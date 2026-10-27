import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { FileCheck, CheckCircle2, XCircle, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

export const SuperAdminClubClaims = () => {
  const { claims, setClaims, updateClaimStatus, showToast } = useApp();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchLiveClaims = async () => {
    setIsRefreshing(true);
    try {
      const res = await apiClient.get('/club-claims');
      if (res?.success && Array.isArray(res.data)) {
        setClaims(res.data);
        showToast(`Refreshed ${res.data.length} live claim records from database.`, 'info');
      }
    } catch (err) {
      showToast(`Unable to refresh claims: ${err.message}`, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveClaims();
  }, []);

  const handleAction = async (claimId, status) => {
    setIsProcessing(true);
    setActionError('');
    try {
      await updateClaimStatus(claimId, status);
      setSelectedClaim(null);
    } catch (err) {
      setActionError(err.message || `Failed to update claim #${claimId} on server.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    { header: 'Claim ID', accessor: 'id', render: (r) => <span className="font-mono font-bold">#{r.id}</span> },
    { header: 'Applicant', accessor: 'applicant', render: (r) => <span className="font-extrabold text-forest-800">{r.applicant}</span> },
    { header: 'Requested Club', accessor: 'club' },
    { header: 'State', accessor: 'state' },
    { header: 'Submitted', accessor: 'submittedDate' },
    {
      header: 'Verification',
      accessor: 'verificationStatus',
      render: (r) => <span className="font-bold text-emerald-700">{r.verificationStatus || 'Pending'}</span>
    },
    { header: 'Claim Status', accessor: 'claimStatus', isStatus: true },
    {
      header: 'Actions',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => {
            setActionError('');
            setSelectedClaim(r);
          }}
          className="px-3 py-1.5 bg-forest-800 text-white text-xs font-bold rounded-lg hover:bg-forest-900 transition-colors shadow-xs"
        >
          View Claim
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-900 tracking-tight">Club Management Claims</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Review verified requests to claim administration rights for existing club profiles.
          </p>
        </div>

        <button
          onClick={fetchLiveClaims}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-low hover:bg-surface-lowest border border-surface-border rounded-xl text-xs font-bold text-forest-900 transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-tan-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Live DB Claims'}</span>
        </button>
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
        <Modal isOpen={true} onClose={() => !isProcessing && setSelectedClaim(null)} title={`Review Claim #${selectedClaim.id}`}>
          <div className="space-y-4 text-xs">
            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="bg-surface-low p-4 rounded-xl border border-surface-border space-y-2">
              <div><strong>Applicant Name:</strong> {selectedClaim.applicant}</div>
              <div><strong>Email:</strong> {selectedClaim.email}</div>
              <div><strong>Phone:</strong> {selectedClaim.phone || 'N/A'}</div>
              <div><strong>Requested Club:</strong> {selectedClaim.club} ({selectedClaim.state})</div>
              <div><strong>Submitted:</strong> {selectedClaim.submittedDate}</div>
              <div>
                <strong>Verification Document:</strong>{' '}
                <span className="text-emerald-700 font-bold">{selectedClaim.verificationStatus || 'Pending Verification'}</span>
              </div>
              <div>
                <strong>Current Status in DB:</strong>{' '}
                <span className="font-mono font-bold text-forest-900">{selectedClaim.claimStatus || selectedClaim.status || 'Pending'}</span>
              </div>
            </div>

            <div className="bg-surface-lowest p-3 rounded-xl border border-surface-border">
              <strong>Applicant Statement:</strong>
              <p className="text-charcoal-muted mt-1 italic leading-relaxed">
                "{selectedClaim.message || 'Official State/Club administration claim request.'}"
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
              <button
                disabled={isProcessing}
                onClick={() => handleAction(selectedClaim.id, 'Rejected')}
                className="px-3.5 py-2 bg-rose-800 hover:bg-rose-900 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject Claim
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleAction(selectedClaim.id, 'Approved')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Updating Server...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Approve & Grant Admin Scope
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuperAdminClubClaims;
