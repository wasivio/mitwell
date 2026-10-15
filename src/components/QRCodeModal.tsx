import React, { useState } from 'react';
import { Certificate } from '../types/certificate';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink, X, CheckCircle, QrCode } from 'lucide-react';
import { getVerificationUrl, downloadQRCodeAsPNG, copyToClipboard } from '../utils/qrCode';

interface QRCodeModalProps {
  certificate: Certificate;
  onClose: () => void;
  isNew?: boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  certificate,
  onClose,
  isNew = false,
}) => {
  const [copied, setCopied] = useState(false);
  const verificationUrl = getVerificationUrl(certificate.rollNumber);
  const canvasId = `modal-qr-${certificate.rollNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(verificationUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    downloadQRCodeAsPNG(canvasId, certificate.rollNumber, certificate.studentName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X size={18} />
        </button>

        {isNew ? (
          <div className="inline-flex p-2 bg-emerald-100 text-emerald-700 rounded-full mb-2">
            <CheckCircle size={28} />
          </div>
        ) : (
          <div className="inline-flex p-2 bg-sky-100 text-sky-700 rounded-full mb-2">
            <QrCode size={28} />
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900">
          {isNew ? 'Certificate Saved Successfully!' : 'Official Verification QR'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isNew
            ? 'A unique QR code has been generated. When scanned, it directly loads this student record.'
            : 'Scan with any mobile camera or QR reader to verify this certificate.'}
        </p>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg inline-block shadow-inner">
          <QRCodeCanvas
            id={canvasId}
            value={verificationUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Student Summary Card */}
        <div className="bg-slate-100 rounded p-3 text-left text-xs mb-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Roll Number:</span>
            <span className="font-mono font-bold text-slate-900">{certificate.rollNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Student Name:</span>
            <span className="font-bold text-slate-900 uppercase">{certificate.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Trade:</span>
            <span className="font-semibold text-sky-800 uppercase">{certificate.trade}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Status:</span>
            <span className={`font-bold uppercase ${
              certificate.status === 'valid'
                ? 'text-emerald-700'
                : certificate.status === 'revoked'
                ? 'text-red-700'
                : 'text-amber-700'
            }`}>
              {certificate.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0096e6] hover:bg-sky-600 text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Download size={15} />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold transition"
          >
            {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
          </button>
        </div>

        <div className="mt-3">
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium hover:underline"
          >
            <ExternalLink size={13} />
            <span>Open Public Verification Page</span>
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};
