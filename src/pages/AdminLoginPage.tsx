import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Key, Shield, AlertCircle, Loader2, ArrowLeft, Database } from 'lucide-react';
import { loginAdmin, getCurrentAdminUser } from '../firebase/authService';
import { isConfigured } from '../firebase/config';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    const existingAdmin = getCurrentAdminUser();
    if (existingAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = loginId.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setError('Please provide both Administrator Login ID and Password.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(cleanId, cleanPass);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setLoginId('WASIM_372');
    setPassword('WASIM@372@');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#0a2540] flex flex-col justify-center items-center p-4">
      
      {/* Return to Public Site Link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs text-slate-300">
        <Link
          to="/"
          className="inline-flex items-center gap-1 hover:text-yellow-400 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Verification Portal</span>
        </Link>

        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Database size={11} className={isConfigured ? 'text-emerald-400' : 'text-amber-400'} />
          <span>{isConfigured ? 'Firebase Cloud' : 'Demo Ready'}</span>
        </span>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-[#0f2858] p-6 text-center text-white relative">
          <div className="w-14 h-14 bg-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg border-2 border-yellow-400 mb-2">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-black font-serif tracking-wider uppercase">
            MIT WELL TECH INSTITUTE
          </h1>
          <p className="text-xs text-blue-200 uppercase tracking-widest mt-0.5">
            Administrator Security Portal
          </p>
          <div className="mt-2 inline-block bg-yellow-400 text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            Authorized Personnel Only
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Login ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. WASIM_372"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded text-xs font-mono tracking-wide focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0096e6] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#0096e6] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded transition shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Login to Administration Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-fill helper for reviewer */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded text-center">
            <div className="text-[11px] text-slate-600 mb-1.5 font-medium">
              Administrator Access Credentials:
            </div>
            <div className="text-xs font-mono text-slate-800 space-x-2">
              <span className="bg-white border px-1.5 py-0.5 rounded font-bold">WASIM_372</span>
              <span className="bg-white border px-1.5 py-0.5 rounded font-bold">WASIM@372@</span>
            </div>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="mt-2 text-[11px] text-sky-600 hover:text-sky-800 font-semibold underline block mx-auto cursor-pointer"
            >
              Click to Auto-Fill Credentials
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400">
              Notice: Student login and public sign-ups are disabled. Only authorized institute admins may access this system.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MIT WELL TECH INSTITUTE &bull; ISO 9001:2015
      </div>
    </div>
  );
};
