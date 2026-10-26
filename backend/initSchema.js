const db = require('./db');

async function ensureSchema() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`ClubClaim\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`club\` VARCHAR(191) NOT NULL,
        \`state\` VARCHAR(10) NOT NULL,
        \`applicant\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL,
        \`phone\` VARCHAR(50),
        \`submittedDate\` VARCHAR(50),
        \`claimStatus\` VARCHAR(50) DEFAULT 'Pending',
        \`verificationStatus\` VARCHAR(191) DEFAULT 'Pending Review',
        \`message\` TEXT,
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Database schema verified: ClubClaim table ready.');
  } catch (err) {
    console.error('⚠️ Schema verification notice:', err.message);
  }
}

module.exports = ensureSchema;
