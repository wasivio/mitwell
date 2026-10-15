import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CertificateCard } from '../components/CertificateCard';
import { LatestNews } from '../components/LatestNews';
import { OurSuccess } from '../components/OurSuccess';
import { PrintableCertificate } from '../components/PrintableCertificate';
import { getCertificateByRoll } from '../firebase/certificateService';
import { Certificate } from '../types/certificate';
import { Search, Loader2, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PublicVerificationPage: React.FC = () => {
  const { rollNumber: routeRollNumber } = useParams<{ rollNumber?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state (defaults to screenshot example "MCO-1336-24" if no URL param)
  const initialRoll = routeRollNumber || searchParams.get('roll') || 'MCO-1336-24';
  const [searchQuery, setSearchQuery] = useState(initialRoll);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCertForModal, setSelectedCertForModal] = useState<Certificate | null>(null);

  const performSearch = async (roll: string) => {
    if (!roll || !roll.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const result = await getCertificateByRoll(roll.trim());
      setCertificate(result);
      if (result && result.status === 'valid') {
        // Fire confetti for verified valid certificate
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0284c7', '#22c55e', '#f59e0b'],
          });
        } catch {
          // Ignore if canvas-confetti is not supported
        }
      }
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rollToFetch = routeRollNumber || searchParams.get('roll') || 'MCO-1336-24';
    setSearchQuery(rollToFetch);
    performSearch(rollToFetch);
  }, [routeRollNumber, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ roll: searchQuery.trim().toUpperCase() });
      performSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      {/* Main Verification Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8">
        
        {/* Certification Title matching Screenshot (Cyan / Sky Blue) */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0284c7] tracking-tight">
            Certification
          </h1>
          <p className="text-xs md:text-sm text-gray-700 font-medium mt-1">
            Search Results
          </p>
        </div>

        {/* Verification Search Bar */}
        <div className="bg-white p-3 md:p-4 rounded border border-slate-200 shadow-xs mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Enter Student Roll Number (e.g. MCO-1336-24)"
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-300 rounded font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0096e6] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#0096e6] hover:bg-sky-600 text-white font-semibold text-xs md:text-sm rounded transition shadow-sm flex items-center justify-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span>Verify Certificate</span>
            </button>
          </form>

          {/* Quick sample roll numbers */}
          <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
            <span>Quick Test:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('MCO-1336-24');
                setSearchParams({ roll: 'MCO-1336-24' });
                performSearch('MCO-1336-24');
              }}
              className="text-sky-600 hover:underline font-mono bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100"
            >
              MCO-1336-24 (Screenshot)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ACT-1082-24');
                setSearchParams({ roll: 'ACT-1082-24' });
                performSearch('ACT-1082-24');
              }}
              className="text-sky-600 hover:underline font-mono bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100"
            >
              ACT-1082-24 (A/C)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ELC-0912-23');
                setSearchParams({ roll: 'ELC-0912-23' });
                performSearch('ELC-0912-23');
              }}
              className="text-red-600 hover:underline font-mono bg-red-50 px-1.5 py-0.5 rounded border border-red-100"
            >
              ELC-0912-23 (Revoked Sample)
            </button>
          </div>
        </div>

        {/* Verification Result Area */}
        <section aria-label="Certificate Result">
          {loading ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded p-12 text-center">
              <Loader2 size={36} className="animate-spin text-[#0096e6] mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Verifying Certificate Credentials...</p>
              <p className="text-xs text-slate-400 mt-1">Cross-referencing official Institute databases</p>
            </div>
          ) : certificate ? (
            <CertificateCard
              certificate={certificate}
              onViewCertificateModal={(cert) => setSelectedCertForModal(cert)}
            />
          ) : hasSearched ? (
            <div className="bg-white border-2 border-dashed border-red-300 rounded p-8 text-center">
              <AlertCircle size={40} className="text-red-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No Verified Certificate Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No certificate record was found matching Roll Number <span className="font-mono font-bold text-slate-800">"{searchQuery}"</span>.
                Please verify that the Roll Number is entered correctly or contact the institute registrar.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center gap-4 text-xs text-slate-600">
                <span>Helpline: <strong>8092573908</strong></span>
                <span>&bull;</span>
                <span>Email: <strong>info@mitwelltech.com</strong></span>
              </div>
            </div>
          ) : null}
        </section>

        {/* Latest News Section matching Screenshot */}
        <LatestNews />

        {/* Our Success Section matching Screenshot */}
        <OurSuccess />
      </main>

      <Footer />

      {/* Full Authentic Certificate View Modal */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 md:p-6 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl overflow-hidden my-auto">
            <PrintableCertificate
              certificate={selectedCertForModal}
              onClose={() => setSelectedCertForModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
