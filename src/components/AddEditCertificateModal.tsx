import React, { useState, useEffect } from 'react';
import { Certificate, CertificateStatus } from '../types/certificate';
import { X, Upload, Image as ImageIcon, AlertCircle, Check, Loader2 } from 'lucide-react';
import { checkDuplicateRollNumber } from '../firebase/certificateService';

interface AddEditCertificateModalProps {
  certificateToEdit?: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (certData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const COMMON_TRADES = [
  'MOBILE CRANE OPERATOR',
  'TOWER CRANE OPERATOR',
  'CRAWLER CRANE OPERATOR',
  'HEAVY EQUIPMENT & JCB OPERATOR',
  'FORKLIFT OPERATOR',
  'A/C & REFRIGERATION TECHNICIAN',
  'INDUSTRIAL ELECTRICIAN',
  'TIG & ARC WELDER 6G',
  'PIPE FITTER & FABRICATOR',
  'RIGGER & SCAFFOLDER',
  'MECHANICAL FITTER',
  'INSTRUMENTATION TECHNICIAN'
];

export const AddEditCertificateModal: React.FC<AddEditCertificateModalProps> = ({
  certificateToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(certificateToEdit);

  const [rollNumber, setRollNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [trade, setTrade] = useState('MOBILE CRANE OPERATOR');
  const [session, setSession] = useState('24');
  const [grade, setGrade] = useState('A');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<CertificateStatus>('valid');
  const [revocationReason, setRevocationReason] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [courseDuration, setCourseDuration] = useState('6 Months');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form values
  useEffect(() => {
    if (certificateToEdit) {
      setRollNumber(certificateToEdit.rollNumber);
      setStudentName(certificateToEdit.studentName);
      setFatherName(certificateToEdit.fatherName);
      setTrade(certificateToEdit.trade);
      setSession(certificateToEdit.session);
      setGrade(certificateToEdit.grade);
      setPhotoUrl(certificateToEdit.photoUrl || '');
      setStatus(certificateToEdit.status || 'valid');
      setRevocationReason(certificateToEdit.revocationReason || '');
      setIssueDate(certificateToEdit.issueDate || '');
      setExpiryDate(certificateToEdit.expiryDate || '');
      setCertificateNumber(certificateToEdit.certificateNumber || '');
      setCourseDuration(certificateToEdit.courseDuration || '6 Months');
    } else {
      setRollNumber('');
      setStudentName('');
      setFatherName('');
      setTrade('MOBILE CRANE OPERATOR');
      setSession('24');
      setGrade('A');
      setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      setStatus('valid');
      setRevocationReason('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setExpiryDate('');
      setCertificateNumber('');
      setCourseDuration('6 Months');
    }
    setError(null);
  }, [certificateToEdit, isOpen]);

  // Handle local image file upload (converts to Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Selected image is too large. Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanRoll = rollNumber.trim().toUpperCase();
    if (!cleanRoll) {
      setError('Roll Number is mandatory.');
      return;
    }
    if (!studentName.trim()) {
      setError("Student Name is mandatory.");
      return;
    }
    if (!fatherName.trim()) {
      setError("Father's Name is mandatory.");
      return;
    }
    if (!trade.trim()) {
      setError('Trade / Course is mandatory.');
      return;
    }

    setSaving(true);
    try {
      // Validate duplicate roll number only if roll number is new or changed
      const isRollChanged =
        !certificateToEdit ||
        cleanRoll !== certificateToEdit.rollNumber.trim().toUpperCase();

      if (isRollChanged) {
        const isDuplicate = await checkDuplicateRollNumber(
          cleanRoll,
          certificateToEdit?.id,
          certificateToEdit?.rollNumber
        );

        if (isDuplicate) {
          setError(`A certificate with Roll Number "${cleanRoll}" already exists. Duplicate roll numbers are not permitted.`);
          setSaving(false);
          return;
        }
      }

      await onSave({
        rollNumber: cleanRoll,
        studentName: studentName.trim().toUpperCase(),
        fatherName: fatherName.trim().toUpperCase(),
        trade: trade.trim().toUpperCase(),
        session: session.trim(),
        grade: grade.trim().toUpperCase(),
        photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        status,
        revocationReason: status === 'revoked' ? revocationReason.trim() : undefined,
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        expiryDate: status === 'expired' ? expiryDate : undefined,
        certificateNumber: certificateNumber.trim() || `MIT/${session.trim()}/${cleanRoll}`,
        courseDuration: courseDuration.trim(),
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save certificate record.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 md:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Certificate Record' : 'Issue New Student Certificate'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Update student credentials, trade, grades, or status.'
                : 'Enforce duplicate checks and automatically generate verification QR code.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Roll Number & Trade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. MCO-1336-24"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono uppercase focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Must be unique per student</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Trade / Discipline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                list="trades-list"
                value={trade}
                onChange={(e) => setTrade(e.target.value.toUpperCase())}
                placeholder="e.g. MOBILE CRANE OPERATOR"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs uppercase focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
              <datalist id="trades-list">
                {COMMON_TRADES.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Row 2: Student Name & Father's Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                placeholder="e.g. MD SHAHID ALAM"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs uppercase focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value.toUpperCase())}
                placeholder="e.g. EZAHAR ALAM"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs uppercase focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Session, Grade, Course Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Session <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="e.g. 24 or 2023-2024"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Grade Secured <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0096e6] focus:outline-none bg-white font-bold"
              >
                <option value="A+">A+ (Outstanding - 85%+)</option>
                <option value="A">A (Excellent - 75%-84%)</option>
                <option value="B+">B+ (Very Good - 65%-74%)</option>
                <option value="B">B (Good - 55%-64%)</option>
                <option value="C">C (Pass)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Course Duration
              </label>
              <input
                type="text"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                placeholder="e.g. 6 Months / 1 Year"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Student Photo Preview & URL/Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Student Passport Photo (With Blue Background)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview */}
              <div className="w-24 h-28 bg-blue-600 rounded overflow-hidden border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                ) : (
                  <ImageIcon size={28} className="text-white/60" />
                )}
              </div>

              {/* URL input and File upload */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Paste student photo image URL"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
                />
                
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 shadow-2xs">
                    <Upload size={13} />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')}
                    className="text-[11px] text-sky-600 hover:underline"
                  >
                    Use Sample Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Certificate Status & Revocation Management */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Certificate Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CertificateStatus)}
                  className={`w-full px-3 py-2 border rounded text-xs font-bold focus:ring-2 focus:outline-none ${
                    status === 'valid'
                      ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                      : status === 'revoked'
                      ? 'border-red-300 text-red-800 bg-red-50'
                      : 'border-amber-300 text-amber-800 bg-amber-50'
                  }`}
                >
                  <option value="valid">VALID & ACTIVE (Normal)</option>
                  <option value="revoked">REVOKED (Disciplinary / Invalidated)</option>
                  <option value="expired">EXPIRED (License Expired)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
                />
              </div>
            </div>

            {/* Revocation Reason field if Revoked */}
            {status === 'revoked' && (
              <div className="animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-red-700 uppercase mb-1">
                  Official Reason for Revocation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="State the reason why this certificate is revoked (e.g., Audit failure, forged credentials, disciplinary action)"
                  className="w-full px-3 py-1.5 border border-red-300 rounded text-xs text-red-900 bg-red-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            )}

            {/* Expiry Date field if Expired */}
            {status === 'expired' && (
              <div className="animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-amber-700 uppercase mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-amber-300 rounded text-xs text-amber-900 bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#0096e6] hover:bg-sky-600 text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              <span>{isEditing ? 'Save Changes' : 'Issue Certificate & Generate QR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
