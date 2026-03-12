import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function SellerApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subaccountCode, setSubaccountCode] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/seller-applications');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/seller-applications/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (application) => {
    if (!subaccountCode.trim()) {
      alert('Please enter a Paystack subaccount code');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post(`/admin/seller-applications/${application.id}/approve`, {
        subaccount_code: subaccountCode
      });

      if (response.data.success) {
        alert('✅ Seller approved successfully!');
        setShowModal(false);
        setSubaccountCode('');
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving seller:', error);
      alert('❌ Failed to approve seller: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (application) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;

    const reason = window.prompt('Please provide a reason for rejection (optional):');
    
    setProcessing(true);
    try {
      const response = await api.post(`/admin/seller-applications/${application.id}/reject`, {
        reason: reason || undefined
      });

      if (response.data.success) {
        alert('✅ Application rejected');
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting seller:', error);
      alert('❌ Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { backgroundColor: '#fef3c7', color: '#92400e' },
      approved: { backgroundColor: '#d1fae5', color: '#065f46' },
      rejected: { backgroundColor: '#fee2e2', color: '#991b1b' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        ...style
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, borderLeftColor: '#f59e0b'}}>
          <h3 style={styles.statNumber}>{stats.pending}</h3>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={{...styles.statCard, borderLeftColor: '#10b981'}}>
          <h3 style={styles.statNumber}>{stats.approved}</h3>
          <p style={styles.statLabel}>Approved</p>
        </div>
        <div style={{...styles.statCard, borderLeftColor: '#ef4444'}}>
          <h3 style={styles.statNumber}>{stats.rejected}</h3>
          <p style={styles.statLabel}>Rejected</p>
        </div>
        <div style={{...styles.statCard, borderLeftColor: '#6366f1'}}>
          <h3 style={styles.statNumber}>{stats.total}</h3>
          <p style={styles.statLabel}>Total</p>
        </div>
      </div>

      {/* Applications Table */}
      <h3 style={styles.tableTitle}>Seller Applications</h3>
      
      {applications.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No seller applications found</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Applicant</th>
                <th style={styles.th}>Business</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Applied</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Fee Paid</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.applicantInfo}>
                      <div style={styles.applicantName}>{app.user?.full_name || 'Unknown'}</div>
                      <div style={styles.applicantEmail}>{app.user?.email || 'No email'}</div>
                    </div>
                  </td>
                  <td style={styles.td}>{app.business_name}</td>
                  <td style={styles.td}>{app.category}</td>
                  <td style={styles.td}>{app.location}</td>
                  <td style={styles.td}>{formatDate(app.created_at)}</td>
                  <td style={styles.td}>{getStatusBadge(app.status)}</td>
                  <td style={styles.td}>
                    {app.fee_paid ? (
                      <span style={{color: '#10b981', fontWeight: '600'}}>✅ Paid</span>
                    ) : (
                      <span style={{color: '#ef4444', fontWeight: '600'}}>❌ Not Paid</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {app.status === 'pending' && app.fee_paid && (
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowModal(true);
                          }}
                          style={styles.approveButton}
                          disabled={processing}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          style={styles.rejectButton}
                          disabled={processing}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'pending' && !app.fee_paid && (
                      <span style={{color: '#f59e0b'}}>Awaiting Payment</span>
                    )}
                    {app.status !== 'pending' && (
                      <span>Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approval Modal */}
      {showModal && selectedApp && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Approve Seller Application</h3>
            <p style={styles.modalSubtitle}>
              Approving <strong>{selectedApp.user?.full_name}</strong> from{' '}
              <strong>{selectedApp.business_name}</strong>
            </p>

            <div style={styles.modalContent}>
              <label style={styles.label}>
                Paystack Subaccount Code <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={subaccountCode}
                onChange={(e) => setSubaccountCode(e.target.value)}
                placeholder="e.g., ACCT_xxxxxxxxxx"
                style={styles.input}
                disabled={processing}
              />
              <p style={styles.helpText}>
                Enter the Paystack subaccount code you created for this seller.
                This is required for payment splitting.
              </p>

              <div style={styles.modalActions}>
                <button
                  onClick={() => setShowModal(false)}
                  style={styles.cancelButton}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedApp)}
                  style={styles.approveButton}
                  disabled={processing || !subaccountCode.trim()}
                >
                  {processing ? 'Approving...' : 'Confirm Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    borderLeft: '4px solid',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontWeight: '600',
    fontSize: '14px',
    borderBottom: '2px solid #e2e8f0',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
  },
  tr: {
    ':hover': {
      backgroundColor: '#f8fafc',
    },
  },
  applicantInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  applicantName: {
    fontWeight: '600',
    color: '#1e293b',
  },
  applicantEmail: {
    fontSize: '12px',
    color: '#64748b',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  approveButton: {
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  rejectButton: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '20px',
  },
  modalContent: {
    marginTop: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '8px',
  },
  helpText: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '4px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  cancelButton: {
    padding: '10px 16px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    color: '#64748b',
  },
};