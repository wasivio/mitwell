import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, Globe, MapPin, Award, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0b132b] text-slate-300 text-xs mt-12 border-t-4 border-yellow-400 no-print">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Institute About */}
          <div className="space-y-3">
            <h3 className="text-white font-serif font-black text-base md:text-lg tracking-wider uppercase">
              MIT WELL TECH
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs">
              Premier vocational and multi-industrial technical training institution dedicated to hands-on skill development, heavy machinery operation, and global Gulf placements.
            </p>
            <div className="flex items-center gap-2 text-yellow-400 font-semibold text-xs">
              <Award size={16} />
              <span>ISO 9001:2015 Certified Institution</span>
            </div>
          </div>

          {/* Col 2: Top Courses */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-slate-700 pb-1">
              Industrial Trades
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Mobile Crane Operator</li>
              <li>Tower Crane &amp; Crawler Crane</li>
              <li>A/C &amp; Refrigeration Technician</li>
              <li>Heavy Equipment &amp; JCB Operator</li>
              <li>Industrial Electrician &amp; PLC</li>
              <li>TIG / MIG / 6G Pipe Welder</li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-slate-700 pb-1">
              Verification &amp; Links
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition">
                  Online Certificate Verification
                </Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-yellow-400 transition">
                  About MIT Well Tech
                </Link>
              </li>
              <li>
                <Link to="/#placement" className="hover:text-yellow-400 transition">
                  Gulf &amp; Domestic Placements
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1">
                  <Lock size={12} />
                  <span>Admin Portal (WASIM_372)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-slate-700 pb-1">
              Contact &amp; Helpline
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                <span>MIT Well Tech Institute, Main Industrial Training Highway Centre, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-yellow-400 shrink-0" />
                <span>8092573908 / 7004752125</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-yellow-400 shrink-0" />
                <span>info@mitwelltech.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-yellow-400 shrink-0" />
                <span>www.mitwelltech.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} MIT WELL TECH INSTITUTE. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400/80">आपकी कामयाबी हमारी पहचान</span>
            <Link to="/admin" className="hover:text-slate-300">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
