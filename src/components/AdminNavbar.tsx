import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, ExternalLink, PlusCircle, Award, Database } from 'lucide-react';
import { logoutAdmin } from '../firebase/authService';
import { isConfigured } from '../firebase/config';
import { AdminUser } from '../types/certificate';

interface AdminNavbarProps {
  adminUser: AdminUser | null;
  onAddNewCertificate?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  adminUser,
  onAddNewCertificate,
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-[#0b132b] text-white border-b-2 border-yellow-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Institute Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-serif font-black text-white text-base shadow border border-blue-400">
                MIT
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black tracking-wider text-sm md:text-base leading-tight group-hover:text-yellow-400 transition">
                  MIT WELL TECH INSTITUTE
                </span>
                <span className="text-[10px] text-sky-400 font-semibold tracking-widest uppercase">
                  ADMINISTRATION PORTAL
                </span>
              </div>
            </Link>

            {/* Cloud vs Demo Database Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-slate-800/80">
              <Database size={12} className={isConfigured ? 'text-emerald-400' : 'text-amber-400'} />
              <span className={isConfigured ? 'text-emerald-300' : 'text-amber-300'}>
                {isConfigured ? 'Live Firebase Cloud' : 'Local Demo Mode'}
              </span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {onAddNewCertificate && (
              <button
                onClick={onAddNewCertificate}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0096e6] hover:bg-sky-600 text-white rounded text-xs font-semibold shadow-sm transition"
              >
                <PlusCircle size={15} />
                <span>Issue Certificate</span>
              </button>
            )}

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition"
              title="Open public verification page"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Public Site</span>
            </Link>

            {/* Admin User Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-yellow-400">WASIM_372</span>
                <span className="text-[10px] text-slate-400">Administrator</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded transition"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
