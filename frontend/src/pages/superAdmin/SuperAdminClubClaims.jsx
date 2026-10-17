import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { FileCheck, CheckCircle2, XCircle, Info } from 'lucide-react';

export const SuperAdminClubClaims = () => {
  const { claims, updateClaimStatus } = useApp();
  const [selectedClaim, setSelectedClaim] = useState(null);

  const handleAction = (claimId, status) => {
    updateClaimStatus(claimId, status);
    setSelectedClaim(null);
  };

  const columns = [
    { header: 'Claim ID', accessor: 'id', render: (r) => <span className="font-mono font-bold">#{r.id}</span> },
    { header: 'Applicant', accessor: 'applicant', render: (r) => <span className="font-extrabold text-forest-800">{r.applicant}</span> },
    { header: 'Requested Club', accessor: 'club' },
    { header: 'State', accessor: 'state' },
    { header: 'Submitted', accessor: 'submittedDate' },
    { header: 'Verification', accessor: 'verificationStatus', render: (r) => <span className="font-bold text-emerald-700">{r.verificationStatus}</span> },
    { header: 'Claim Status', accessor: 'claimStatus', isStatus: true },
    {
      header: 'Actions',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => setSelectedClaim(r)}
          className="px-3 py-1 bg-forest-800 text-white text-xs font-bold rounded hover:bg-forest-900"
        >
          View Claim
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Club Management Claims</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Review verified official requests to claim admin rights for existing club profiles</p>
      </div>

      <DataTable
        columns={columns}
        data={claims}
        searchPlaceholder="Search claims by applicant or club..."
        filterField="claimStatus"
        filterOptions={['Pending', 'Approved', 'Rejected']}
      />

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <Modal isOpen={true} onClose={() => setSelectedClaim(null)} title={`Review Claim #${selectedClaim.id}`}>
          <div className="space-y-4 text-xs">
            <div className="bg-surface-low p-4 rounded border space-y-2">
              <div><strong>Applicant Name:</strong> {selectedClaim.applicant}</div>
              <div><strong>Email:</strong> {selectedClaim.email}</div>
              <div><strong>Phone:</strong> {selectedClaim.phone}</div>
              <div><strong>Requested Club:</strong> {selectedClaim.club} ({selectedClaim.state})</div>
              <div><strong>Submitted:</strong> {selectedClaim.submittedDate}</div>
              <div><strong>Verification Document:</strong> <span className="text-emerald-700 font-bold">{selectedClaim.verificationStatus}</span></div>
            </div>

            <div className="bg-surface-lowest p-3 rounded border">
              <strong>Applicant Statement:</strong>
              <p className="text-charcoal-muted mt-1 italic">"{selectedClaim.message}"</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => handleAction(selectedClaim.id, 'Rejected')}
                className="px-3 py-2 bg-red-800 text-white font-bold rounded flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Reject Claim
              </button>
              <button
                onClick={() => handleAction(selectedClaim.id, 'Approved')}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Grant Admin Scope
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
