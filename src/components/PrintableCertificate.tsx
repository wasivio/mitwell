import React from 'react';
import { Certificate } from '../types/certificate';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, Download, X, ShieldCheck, Award } from 'lucide-react';
import { getVerificationUrl } from '../utils/qrCode';

interface PrintableCertificateProps {
  certificate: Certificate;
  onClose?: () => void;
  isStandalone?: boolean;
}

export const PrintableCertificate: React.FC<PrintableCertificateProps> = ({
  certificate,
  onClose,
  isStandalone = false,
}) => {
  const verificationUrl = getVerificationUrl(certificate.rollNumber);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full ${isStandalone ? 'min-h-screen bg-slate-100 py-6 px-3' : ''}`}>
      {/* Action Bar (Hidden during print) */}
      <div className="no-print max-w-4xl mx-auto mb-4 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-semibold text-slate-700">
            Official MIT Certificate View
          </span>
          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
            {certificate.rollNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2540] hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Printer size={14} />
            <span>Print / Save as PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
              title="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Certificate Sheet */}
      <div className="certificate-print-sheet max-w-4xl mx-auto bg-white p-6 md:p-10 shadow-2xl relative border-[10px] border-double border-[#0a2540] rounded-sm overflow-hidden select-text">
        {/* Subtle Guilloche / Watermark Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
          <div className="w-[500px] h-[500px] rounded-full border-[20px] border-[#0a2540] flex items-center justify-center">
            <span className="text-8xl font-black font-serif text-[#0a2540]">MIT</span>
          </div>
        </div>

        {/* Diagonal Watermark if Revoked or Expired */}
        {certificate.status === 'revoked' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            <div className="transform -rotate-45 border-8 border-red-600/40 text-red-600/50 text-5xl md:text-7xl font-black uppercase tracking-widest px-8 py-4">
              REVOKED - INVALID
            </div>
          </div>
        )}

        {certificate.status === 'expired' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            <div className="transform -rotate-45 border-8 border-amber-600/40 text-amber-600/50 text-5xl md:text-7xl font-black uppercase tracking-widest px-8 py-4">
              EXPIRED - RENEW
            </div>
          </div>
        )}

        {/* Corner Ornaments */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

        {/* Header Information */}
        <div className="text-center relative z-10 border-b-2 border-amber-500/40 pb-4">
          <div className="text-[10px] md:text-xs font-bold text-slate-500 tracking-widest uppercase">
            AN ISO 9001:2015 CERTIFIED TECHNICAL TRAINING INSTITUTION &bull; GOVT. REGD.
          </div>

          <h1 className="mt-1 text-2xl md:text-4xl font-black font-serif text-[#0a2540] tracking-wider uppercase">
            MIT WELL TECH INSTITUTE
          </h1>

          <div className="text-xs md:text-sm font-bold text-red-600 tracking-wide uppercase mt-0.5">
            MULTI INDUSTRIAL &amp; VOCATIONAL TRAINING CENTRE
          </div>

          <p className="text-[10px] md:text-xs text-slate-600 mt-1">
            Website: www.mitwelltech.com &bull; Email: info@mitwelltech.com &bull; Helpline: 8092573908
          </p>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-6 relative z-10">
          <div className="inline-block relative">
            <h2 className="text-xl md:text-3xl font-serif font-black text-amber-700 tracking-widest uppercase px-6 py-1 border-b-2 border-t-2 border-amber-600">
              CERTIFICATE OF PROFICIENCY
            </h2>
            <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
              THIS IS TO CERTIFY PROFICIENCY &amp; TECHNICAL COMPETENCE
            </div>
          </div>
        </div>

        {/* Certificate Meta Details */}
        <div className="flex justify-between items-center text-xs text-slate-700 font-mono px-2 mb-6">
          <div>
            <span className="font-bold">Cert No: </span>
            <span>{certificate.certificateNumber || `MIT/${certificate.session}/${certificate.rollNumber}`}</span>
          </div>
          <div>
            <span className="font-bold">Roll No: </span>
            <span className="font-extrabold text-[#0a2540]">{certificate.rollNumber}</span>
          </div>
          <div>
            <span className="font-bold">Issue Date: </span>
            <span>{certificate.issueDate || '2024-04-18'}</span>
          </div>
        </div>

        {/* Certificate Body Paragraph */}
        <div className="text-center text-slate-800 text-sm md:text-base leading-relaxed space-y-4 px-4 font-serif">
          <p>
            This is proudly awarded to{' '}
            <span className="font-black text-lg md:text-xl text-[#0a2540] underline decoration-amber-500 decoration-2 underline-offset-4 uppercase">
              {certificate.studentName}
            </span>
          </p>

          <p>
            Son/Daughter of Mr.{' '}
            <span className="font-bold text-[#0a2540] uppercase">
              {certificate.fatherName}
            </span>
            , having successfully completed the comprehensive theoretical and hands-on practical training in
          </p>

          <div className="py-2">
            <span className="inline-block bg-slate-50 border-2 border-slate-300 px-6 py-2 rounded text-base md:text-xl font-black text-sky-900 tracking-wider uppercase shadow-xs">
              {certificate.trade}
            </span>
          </div>

          <p>
            held during the Academic Session{' '}
            <span className="font-bold text-[#0a2540]">{certificate.session}</span>
            {certificate.courseDuration ? ` (${certificate.courseDuration})` : ''} and having secured Grade{' '}
            <span className="font-black text-emerald-800 text-lg md:text-xl underline decoration-emerald-500">
              {certificate.grade}
            </span>
            .
          </p>
        </div>

        {/* Bottom Section: Photo, Official Seal, Verification QR, and Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 items-end gap-4 text-center">
          
          {/* Left: Student Photo with verification watermark */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-28 border-2 border-[#0a2540] rounded overflow-hidden bg-blue-600 shadow-sm">
              <img
                src={certificate.photoUrl}
                alt={certificate.studentName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="absolute inset-0 border border-white/40 pointer-events-none"></div>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">
              Verified Candidate
            </span>
          </div>

          {/* Center: Official Seal & QR Code */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="bg-white p-2 border border-slate-300 rounded shadow-xs">
              <QRCodeCanvas
                value={verificationUrl}
                size={84}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-600 font-bold">
              SCAN TO VERIFY
            </span>

            {/* Embossed Institute Seal */}
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center text-amber-800 bg-amber-50/50 mt-1">
              <Award size={16} className="text-amber-600" />
              <span className="text-[7px] font-bold uppercase">SEAL</span>
            </div>
          </div>

          {/* Right: Authorized Signatures */}
          <div className="flex flex-col items-center justify-end">
            {/* Signature flourish representation */}
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-lg text-slate-800 font-bold tracking-widest">
                Wasim Akram
              </span>
            </div>
            <div className="w-36 border-t-2 border-slate-800 mt-1"></div>
            <span className="text-xs font-bold text-[#0a2540] uppercase mt-0.5">
              Director / Principal
            </span>
            <span className="text-[10px] text-slate-500">
              MIT Well Tech Institute
            </span>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400">
          This is an official computer-generated verified credential. Tampering or unauthorized alteration renders this certificate null and void. Verify anytime at www.mitwelltech.com
        </div>
      </div>
    </div>
  );
};
