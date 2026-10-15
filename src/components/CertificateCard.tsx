import React, { useState } from 'react';
import { Certificate } from '../types/certificate';
import { QRCodeCanvas } from 'qrcode.react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  QrCode,
  Download,
  Copy,
  Printer,
  FileText,
  Share2,
  Check,
  ExternalLink
} from 'lucide-react';
import { getVerificationUrl, downloadQRCodeAsPNG, copyToClipboard } from '../utils/qrCode';

interface CertificateCardProps {
  certificate: Certificate;
  onViewCertificateModal?: (cert: Certificate) => void;
  showAdminActions?: boolean;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onViewCertificateModal,
  showAdminActions = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const verificationUrl = getVerificationUrl(certificate.rollNumber);
  const qrCanvasId = `cert-qr-${certificate.rollNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(verificationUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    downloadQRCodeAsPNG(qrCanvasId, certificate.rollNumber, certificate.studentName);
  };

  // Status config
  const getStatusBadge = () => {
    switch (certificate.status) {
      case 'valid':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle size={14} className="text-emerald-600" />
            <span>VERIFIED & ACTIVE</span>
          </div>
        );
      case 'revoked':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle size={14} className="text-red-600" />
            <span>REVOKED / CANCELLED</span>
          </div>
        );
      case 'expired':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle size={14} className="text-amber-600" />
            <span>EXPIRED</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Outer Card with Dotted / Dashed Border matching screenshot */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded p-6 md:p-8 transition-shadow hover:shadow-md">
        
        {/* Top Status Bar & Action Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {certificate.certificateNumber && (
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Ref: {certificate.certificateNumber}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
              title="Copy public verification link"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium transition border border-sky-200"
              title="View & Download QR Code"
            >
              <QrCode size={13} />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        {/* Revocation Warning Alert if Revoked */}
        {certificate.status === 'revoked' && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-800 text-xs md:text-sm">
            <div className="font-bold flex items-center gap-1.5 text-red-900">
              <XCircle size={16} />
              Notice: This certificate has been officially revoked by the institute.
            </div>
            <p className="mt-1 text-red-700">
              {certificate.revocationReason || 'Violated institute academic or verification policies.'}
            </p>
          </div>
        )}

        {/* Expired Warning Alert if Expired */}
        {certificate.status === 'expired' && (
          <div className="mb-6 p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-amber-800 text-xs md:text-sm">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle size={16} />
              Notice: Certificate validity period has expired.
            </div>
            <p className="mt-1 text-amber-700">
              Expired on {certificate.expiryDate || 'N/A'}. Renewal required for active professional licensing.
            </p>
          </div>
        )}

        {/* Certificate Details: Key-Value Table matching Screenshot */}
        <div className="space-y-2.5 text-xs md:text-sm font-sans tracking-wide">
          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="w-40 font-medium text-gray-700 uppercase">Roll Number</span>
            <span className="font-bold text-gray-950 font-mono tracking-wider">: {certificate.rollNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="w-40 font-medium text-gray-700 uppercase">Name</span>
            <span className="font-bold text-gray-950 uppercase">: {certificate.studentName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="w-40 font-medium text-gray-700 uppercase">Father's Name</span>
            <span className="font-semibold text-gray-900 uppercase">: {certificate.fatherName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="w-40 font-medium text-gray-700 uppercase">Trade</span>
            <span className="font-bold text-sky-800 uppercase">: {certificate.trade}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="w-40 font-medium text-gray-700 uppercase">Session</span>
            <span className="font-semibold text-gray-900 uppercase">: {certificate.session}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="w-40 font-medium text-gray-700 uppercase">Grade</span>
            <span className="font-extrabold text-emerald-700 uppercase">: {certificate.grade}</span>
          </div>

          {certificate.courseDuration && (
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <span className="w-40 font-medium text-gray-700 uppercase">Duration</span>
              <span className="font-semibold text-gray-900 uppercase">: {certificate.courseDuration}</span>
            </div>
          )}

          {certificate.issueDate && (
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <span className="w-40 font-medium text-gray-700 uppercase">Issue Date</span>
              <span className="font-semibold text-gray-900 uppercase">: {certificate.issueDate}</span>
            </div>
          )}
        </div>

        {/* Student Passport Photo Section matching Screenshot */}
        <div className="mt-6 flex flex-col items-start">
          <div className="relative group">
            <div className="w-32 h-40 bg-blue-600 rounded overflow-hidden shadow border-2 border-slate-300 flex items-center justify-center">
              {certificate.photoUrl ? (
                <img
                  src={certificate.photoUrl}
                  alt={certificate.studentName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to blue avatar if image fails
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-700 flex flex-col items-center justify-center text-white text-xs font-bold p-2 text-center">
                  <span>PHOTO</span>
                  <span className="text-[10px] opacity-80">NOT PROVIDED</span>
                </div>
              )}
            </div>
            <div className="mt-1 text-[11px] text-gray-500 font-medium">Passport Photo</div>
          </div>

          {/* "View Certificate" Link matching Screenshot */}
          <div className="mt-4 pt-2">
            <button
              onClick={() => {
                if (onViewCertificateModal) {
                  onViewCertificateModal(certificate);
                } else {
                  window.open(`/certificate/${encodeURIComponent(certificate.rollNumber)}`, '_blank');
                }
              }}
              className="text-sky-600 hover:text-sky-800 text-sm font-semibold hover:underline flex items-center gap-1.5 focus:outline-none"
            >
              <FileText size={16} />
              <span>View Certificate</span>
            </button>
          </div>
        </div>

        {/* Hidden QR Code Canvas for PNG export */}
        <div className="hidden">
          <QRCodeCanvas
            id={qrCanvasId}
            value={verificationUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* QR Code Quick Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 mb-1">Official Verification QR</h3>
            <p className="text-xs text-gray-500 mb-4">
              Scan with any mobile camera to verify this student certificate.
            </p>

            <div className="bg-white p-4 inline-block border-2 border-slate-200 rounded-lg shadow-inner my-2">
              <QRCodeCanvas
                value={verificationUrl}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="mt-2 text-xs font-mono font-bold text-gray-700">
              {certificate.rollNumber} - {certificate.studentName}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadQr}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow"
              >
                <Download size={14} />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
