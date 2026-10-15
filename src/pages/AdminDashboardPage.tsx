import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../components/AdminNavbar';
import { AddEditCertificateModal } from '../components/AddEditCertificateModal';
import { QRCodeModal } from '../components/QRCodeModal';
import { PrintableCertificate } from '../components/PrintableCertificate';
import {
  getAllCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  updateCertificateStatus,
  resetToMockData
} from '../firebase/certificateService';
import { getCurrentAdminUser } from '../firebase/authService';
import { isConfigured } from '../firebase/config';
import { Certificate, CertificateStatus, AdminUser } from '../types/certificate';
import {
  Search,
  Plus,
  Filter,
  QrCode,
  Printer,
  Edit2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  Database,
  RefreshCw,
  Info
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tradeFilter, setTradeFilter] = useState<string>('all');

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [certificateToEdit, setCertificateToEdit] = useState<Certificate | null>(null);
  const [qrModalCert, setQrModalCert] = useState<Certificate | null>(null);
  const [isNewQr, setIsNewQr] = useState(false);
  const [printModalCert, setPrintModalCert] = useState<Certificate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [revokeModalCert, setRevokeModalCert] = useState<Certificate | null>(null);
  const [revokeReasonInput, setRevokeReasonInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication Guard
  useEffect(() => {
    const user = getCurrentAdminUser();
    if (!user) {
      navigate('/admin/login', { replace: true });
    } else {
      setAdminUser(user);
    }
  }, [navigate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllCertificates();
      setCertificates(data);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCertificate = async (
    certData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (certificateToEdit && certificateToEdit.id) {
      const updated = await updateCertificate(certificateToEdit.id, certData);
      setCertificates((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      showToast(`Updated certificate for ${updated.studentName} successfully.`);
      setIsAddEditOpen(false);
      setCertificateToEdit(null);
    } else {
      const created = await addCertificate(certData);
      setCertificates((prev) => [created, ...prev]);
      showToast(`Issued certificate for ${created.studentName} successfully.`);
      setIsAddEditOpen(false);
      // Immediately display the generated QR code modal
      setQrModalCert(created);
      setIsNewQr(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCertificate(id);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
      showToast('Certificate removed from system.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete certificate');
    }
  };

  const handleStatusChange = async (
    cert: Certificate,
    newStatus: CertificateStatus,
    reason?: string
  ) => {
    if (!cert.id) return;
    try {
      const updated = await updateCertificateStatus(cert.id, newStatus, reason);
      setCertificates((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      showToast(`Status changed to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeModalCert || !revokeModalCert.id) return;
    await handleStatusChange(revokeModalCert, 'revoked', revokeReasonInput);
    setRevokeModalCert(null);
    setRevokeReasonInput('');
  };

  // Filter logic
  const filteredCertificates = certificates.filter((cert) => {
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      cert.rollNumber.toLowerCase().includes(q) ||
      cert.studentName.toLowerCase().includes(q) ||
      cert.fatherName.toLowerCase().includes(q) ||
      cert.trade.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' || cert.status === statusFilter;

    const matchesTrade =
      tradeFilter === 'all' || cert.trade.toLowerCase() === tradeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesTrade;
  });

  // Unique trades for filter dropdown
  const allTrades = Array.from(new Set(certificates.map((c) => c.trade)));

  // Statistics
  const totalCount = certificates.length;
  const validCount = certificates.filter((c) => c.status === 'valid').length;
  const revokedCount = certificates.filter((c) => c.status === 'revoked').length;
  const expiredCount = certificates.filter((c) => c.status === 'expired').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <AdminNavbar
        adminUser={adminUser}
        onAddNewCertificate={() => {
          setCertificateToEdit(null);
          setIsAddEditOpen(true);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-3">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner with Overview and Add Button */}
        <div className="bg-white rounded-lg p-5 shadow-xs border border-slate-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 font-serif">
                Certificate Management Dashboard
              </h1>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Admin: WASIM_372
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Issue accredited vocational certificates, enforce duplicate roll protection, generate verification QR codes, and monitor statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCertificateToEdit(null);
                setIsAddEditOpen(true);
              }}
              className="px-4 py-2 bg-[#0096e6] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Issue New Certificate</span>
            </button>
          </div>
        </div>

        {/* Database Mode Advisory Banner */}
        {!isConfigured && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r mb-6 text-xs text-amber-900 flex items-start justify-between">
            <div className="flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold">Active in Local Demo / Offline Mode: </span>
                <span>
                  Using mock certificates (including <strong>MCO-1336-24 MD SHAHID ALAM</strong> from screenshot).
                  All changes are safely stored in your browser's persistent storage. To connect your live Firebase project, set your keys in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code>.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                resetToMockData();
                loadData();
                showToast('Reset database to default sample records.');
              }}
              className="text-[11px] font-bold text-amber-800 hover:underline shrink-0 ml-4"
            >
              Reset Sample Data
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Certificates</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">In Institute Registry</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={14} />
              <span>Active &amp; Valid</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{validCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Passing Verification</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-red-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <XCircle size={14} />
              <span>Revoked</span>
            </div>
            <div className="text-2xl font-black text-red-600 mt-1">{revokedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Invalidated by Institute</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle size={14} />
              <span>Expired</span>
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">{expiredCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Awaiting Renewal</div>
          </div>
        </div>

        {/* Search, Filter, & Table Container */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by Roll No, Student Name, Trade..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Filter size={14} />
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none"
                >
                  <option value="all">All Statuses ({totalCount})</option>
                  <option value="valid">Valid ({validCount})</option>
                  <option value="revoked">Revoked ({revokedCount})</option>
                  <option value="expired">Expired ({expiredCount})</option>
                </select>
              </div>

              {allTrades.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <span>Trade:</span>
                  <select
                    value={tradeFilter}
                    onChange={(e) => setTradeFilter(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none max-w-[150px] truncate"
                  >
                    <option value="all">All Trades</option>
                    {allTrades.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={loadData}
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded"
                title="Refresh Records"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student &amp; Photo</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Trade / Course</th>
                  <th className="py-3 px-4">Session &amp; Grade</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No certificate records match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map((cert) => (
                    <tr
                      key={cert.id || cert.rollNumber}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Photo & Student Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded overflow-hidden bg-blue-600 border border-slate-300 shrink-0">
                            <img
                              src={cert.photoUrl}
                              alt={cert.studentName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 uppercase">
                              {cert.studentName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              S/O {cert.fatherName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {cert.rollNumber}
                      </td>

                      {/* Trade */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-sky-800 uppercase">
                          {cert.trade}
                        </span>
                        {cert.courseDuration && (
                          <span className="block text-[10px] text-slate-400">
                            Duration: {cert.courseDuration}
                          </span>
                        )}
                      </td>

                      {/* Session & Grade */}
                      <td className="py-3 px-4">
                        <div>
                          <span className="text-slate-700 font-medium">Session: {cert.session}</span>
                        </div>
                        <div className="mt-0.5">
                          <span className="inline-block px-1.5 py-0.2 rounded font-extrabold text-[11px] bg-slate-100 text-emerald-800 border border-slate-200">
                            Grade: {cert.grade}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {cert.status === 'valid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle size={12} />
                            <span>Valid</span>
                          </span>
                        )}
                        {cert.status === 'revoked' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                            <XCircle size={12} />
                            <span>Revoked</span>
                          </span>
                        )}
                        {cert.status === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle size={12} />
                            <span>Expired</span>
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* QR Code Modal Button */}
                          <button
                            onClick={() => {
                              setQrModalCert(cert);
                              setIsNewQr(false);
                            }}
                            className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                            title="View & Download QR Code"
                          >
                            <QrCode size={15} />
                          </button>

                          {/* Print Certificate Button */}
                          <button
                            onClick={() => setPrintModalCert(cert)}
                            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded"
                            title="Print / View Authentic Certificate"
                          >
                            <Printer size={15} />
                          </button>

                          {/* Edit Certificate */}
                          <button
                            onClick={() => {
                              setCertificateToEdit(cert);
                              setIsAddEditOpen(true);
                            }}
                            className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Certificate"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Status Management Dropdown/Button */}
                          {cert.status === 'valid' ? (
                            <button
                              onClick={() => {
                                setRevokeModalCert(cert);
                                setRevokeReasonInput('');
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Revoke Certificate"
                            >
                              <ShieldAlert size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(cert, 'valid')}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded"
                              title="Reinstate to Valid"
                            >
                              <ShieldCheck size={15} />
                            </button>
                          )}

                          {/* Delete Certificate */}
                          <button
                            onClick={() => setDeleteConfirmId(cert.id || cert.rollNumber)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredCertificates.length} of {certificates.length} certificates</span>
            <span className="text-[11px]">MIT Well Tech Verification Security Engine</span>
          </div>
        </div>
      </main>

      {/* Add / Edit Certificate Modal */}
      <AddEditCertificateModal
        isOpen={isAddEditOpen}
        certificateToEdit={certificateToEdit}
        onClose={() => {
          setIsAddEditOpen(false);
          setCertificateToEdit(null);
        }}
        onSave={handleSaveCertificate}
      />

      {/* QR Code Modal */}
      {qrModalCert && (
        <QRCodeModal
          certificate={qrModalCert}
          isNew={isNewQr}
          onClose={() => {
            setQrModalCert(null);
            setIsNewQr(false);
          }}
        />
      )}

      {/* Printable Certificate Modal */}
      {printModalCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-3 md:p-6 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl overflow-hidden my-auto">
            <PrintableCertificate
              certificate={printModalCert}
              onClose={() => setPrintModalCert(null)}
            />
          </div>
        </div>
      )}

      {/* Revocation Prompt Modal */}
      {revokeModalCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert size={22} />
              <h3 className="text-base font-bold text-slate-900">
                Revoke Student Certificate
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Are you sure you want to revoke the certificate for{' '}
              <strong>{revokeModalCert.studentName}</strong> (Roll: {revokeModalCert.rollNumber})?
              Public verification will show a red warning that this credential has been revoked.
            </p>

            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Revocation Reason
            </label>
            <textarea
              rows={3}
              value={revokeReasonInput}
              onChange={(e) => setRevokeReasonInput(e.target.value)}
              placeholder="e.g. Incomplete training hours, document falsification, academic audit decision"
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:outline-none mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRevokeModalCert(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeConfirm}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95">
            <Trash2 size={32} className="text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">Delete Certificate Record?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This action permanently removes this record from the verification database.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-2 border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
