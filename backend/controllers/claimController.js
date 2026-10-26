const db = require('../db');

const getClaims = async (req, res) => {
  try {
    const { status, state } = req.query;
    let query = 'SELECT * FROM `ClubClaim` WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND (claimStatus = ? OR verificationStatus = ?)';
      params.push(status, status);
    }
    if (state) {
      query += ' AND state = ?';
      params.push(state.toUpperCase());
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'Club claim verification requests fetched from database `club`'
    });
  } catch (err) {
    console.error('[Claim Controller Error - getClaims]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const createClaim = async (req, res) => {
  try {
    const {
      id,
      club,
      clubName,
      state,
      applicant,
      email,
      phone,
      message,
      submittedDate,
      claimStatus,
      verificationStatus
    } = req.body;

    const targetClub = (club || clubName || '').trim();
    const targetApplicant = (applicant || '').trim();
    const targetEmail = (email || '').trim().toLowerCase();

    if (!targetApplicant || !targetEmail || (!targetClub && !state)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Applicant name, email, and target club or state are required for claim submission'
        }
      });
    }

    const claimId = id || `CLM-${Math.floor(100 + Math.random() * 900)}`;
    const targetState = (state || 'HI').toUpperCase().slice(0, 10);
    const dateStr = submittedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const statusVal = claimStatus || 'Pending';
    const verificationVal = verificationStatus || 'Pending Review';

    await db.query(
      `INSERT INTO \`ClubClaim\` (id, club, state, applicant, email, phone, submittedDate, claimStatus, verificationStatus, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         club = VALUES(club),
         state = VALUES(state),
         applicant = VALUES(applicant),
         email = VALUES(email),
         phone = VALUES(phone),
         submittedDate = VALUES(submittedDate),
         claimStatus = VALUES(claimStatus),
         verificationStatus = VALUES(verificationStatus),
         message = VALUES(message)`,
      [
        claimId,
        targetClub || `${targetState} State Association`,
        targetState,
        targetApplicant,
        targetEmail,
        phone || '',
        dateStr,
        statusVal,
        verificationVal,
        message || 'Official State/Club administration claim request.'
      ]
    );

    const [savedRows] = await db.query('SELECT * FROM `ClubClaim` WHERE id = ?', [claimId]);
    const savedClaim = savedRows[0] || {
      id: claimId,
      club: targetClub,
      state: targetState,
      applicant: targetApplicant,
      email: targetEmail,
      claimStatus: statusVal
    };

    return res.status(201).json({
      success: true,
      data: savedClaim,
      message: 'Claim request saved to database `club`'
    });
  } catch (err) {
    console.error('[Claim Controller Error - createClaim]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { claimStatus, status } = req.body;
    const nextStatus = (claimStatus || status || '').trim();

    if (!nextStatus || !['Approved', 'Rejected', 'Pending'].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Valid claimStatus (Approved, Rejected, Pending) is required' }
      });
    }

    const [existing] = await db.query('SELECT * FROM `ClubClaim` WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Claim #${id} not found in database` }
      });
    }

    const claim = existing[0];
    const verificationStatus = nextStatus === 'Approved' ? 'Verified Official' : nextStatus === 'Rejected' ? 'Rejected' : 'Pending Review';

    await db.query(
      'UPDATE `ClubClaim` SET claimStatus = ?, verificationStatus = ? WHERE id = ?',
      [nextStatus, verificationStatus, id]
    );

    // If claim approved, link administrator to the corresponding State or Club
    if (nextStatus === 'Approved') {
      const applicantName = claim.applicant;
      const applicantEmail = (claim.email || '').toLowerCase().trim();
      const stateCode = (claim.state || '').toUpperCase().trim();
      const clubName = (claim.club || '').trim();

      const isStateAssociation =
        clubName.toLowerCase().includes('state association') ||
        clubName.toLowerCase().includes('state hound') ||
        clubName.toLowerCase().includes('state chapter');

      // 1. Update StateAssociation if matching
      if (isStateAssociation && stateCode) {
        await db.query(
          'UPDATE `StateAssociation` SET adminName = ? WHERE code = ? OR LOWER(name) LIKE ?',
          [applicantName, stateCode, `%${stateCode.toLowerCase()}%`]
        );
      }

      // 2. Update LocalClub if matching
      if (!isStateAssociation && clubName) {
        await db.query(
          'UPDATE `LocalClub` SET adminName = ? WHERE LOWER(name) = ? OR id = ?',
          [applicantName, clubName.toLowerCase(), clubName]
        );
      }

      // 3. If a User account exists with applicant's email, assign corresponding role
      if (applicantEmail) {
        const [userRows] = await db.query('SELECT id, role FROM `User` WHERE LOWER(email) = ?', [applicantEmail]);
        if (userRows.length > 0) {
          const user = userRows[0];
          // Do not demote Super Admin
          if (user.role !== 'SUPER_ADMIN') {
            const targetRole = isStateAssociation ? 'STATE_ADMIN' : 'CLUB_ADMIN';
            await db.query(
              'UPDATE `User` SET role = ?, stateCode = COALESCE(stateCode, ?) WHERE id = ?',
              [targetRole, stateCode || 'HI', user.id]
            );
            console.log(`✅ Promoted user ${applicantEmail} (${user.id}) to ${targetRole} for ${clubName}`);
          }
        }
      }
    }

    const [updatedRows] = await db.query('SELECT * FROM `ClubClaim` WHERE id = ?', [id]);
    const updatedClaim = updatedRows[0] || { id, claimStatus: nextStatus, verificationStatus };

    return res.json({
      success: true,
      data: updatedClaim,
      message: `Claim status updated to ${nextStatus}`
    });
  } catch (err) {
    console.error('[Claim Controller Error - updateClaimStatus]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getClaims,
  createClaim,
  updateClaimStatus
};
