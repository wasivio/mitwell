import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCertificateByRoll } from '../firebase/certificateService';
import { Certificate } from '../types/certificate';
import { PrintableCertificate } from '../components/PrintableCertificate';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export const CertificateViewPage: React.FC = () => {
  const { rollNumber } = useParams<{ rollNumber: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rollNumber) return;
    const fetchCert = async () => {
      setLoading(true);
      try {
        const found = await getCertificateByRoll(rollNumber);
        setCertificate(found);
      } catch (err) {
        console.error('Error fetching certificate:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [rollNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 size={36} className="animate-spin text-[#0096e6] mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading Official Certificate...</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-slate-800">Certificate Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            No certificate record was found for Roll Number "{rollNumber}".
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0096e6] text-white rounded text-xs font-semibold hover:bg-sky-600 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Public Verification</span>
          </Link>
        </div>
      </div>
    );
  }

  return <PrintableCertificate certificate={certificate} isStandalone={true} />;
};
