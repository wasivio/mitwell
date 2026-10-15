import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'About Us', path: '/#about' },
    { label: 'Courses', path: '/#courses' },
    { label: 'Gallery', path: '/#gallery' },
    { label: 'Placement', path: '/#placement' },
    { label: 'Certification', path: '/', active: true },
    { label: 'LOGIN', path: '/admin', highlight: true },
    { label: 'CONTACT', path: '/#contact' },
  ];

  return (
    <header className="w-full bg-white select-none">
      {/* Top Black / Dark Navy Menu Bar */}
      <nav className="w-full bg-[#0b132b] text-white text-xs md:text-sm font-semibold tracking-wider">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-11">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded text-yellow-400 hover:text-white focus:outline-none flex items-center gap-1 text-xs"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="font-bold text-yellow-400">MENU</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`transition-colors py-1 ${
                  link.highlight
                    ? 'text-yellow-400 hover:text-yellow-300 font-bold border-b-2 border-yellow-400'
                    : link.active && location.pathname === '/'
                    ? 'text-sky-400 font-bold'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Quick verification badge */}
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <span className="hidden sm:inline-block bg-sky-900/60 border border-sky-600/40 px-2 py-0.5 rounded text-sky-300">
              ISO 9001:2015 Certified
            </span>
            <Link
              to="/admin"
              className="md:hidden text-yellow-400 hover:text-yellow-300 font-bold"
            >
              ADMIN LOGIN
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e1a38] border-t border-slate-700 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-1.5 px-2 rounded ${
                  link.highlight
                    ? 'bg-yellow-400/20 text-yellow-300 font-bold'
                    : 'text-gray-200 hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Institute Graphic Banner (Replicating Screenshot Banner) */}
      <div className="w-full bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] text-white shadow-md relative overflow-hidden border-b-4 border-yellow-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-between relative min-h-[160px] md:min-h-[190px]">
          
          {/* Left Side: Roofline, A/C Equipment Art, & A/C Training Label */}
          <div className="relative flex-1 flex flex-col justify-between p-3 md:p-4 bg-gradient-to-b from-blue-600 to-blue-700 overflow-hidden min-h-[150px] md:min-h-auto">
            {/* White house/building outline watermark */}
            <svg
              className="absolute -top-2 left-4 w-48 h-32 text-white/30 pointer-events-none stroke-current"
              viewBox="0 0 100 60"
              fill="none"
              strokeWidth="2.5"
            >
              <path d="M 5 45 L 35 15 L 75 15 L 95 45" />
              <path d="M 45 15 L 45 5 L 55 5 L 55 15" />
            </svg>

            {/* Industrial Machinery & HVAC visual illustration */}
            <div className="relative z-10 flex items-center justify-around py-2 gap-2">
              {/* Outdoor AC Condenser Unit Graphic */}
              <div className="flex flex-col items-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 rounded p-1.5 shadow-md border border-slate-300 w-16 md:w-20 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-slate-400 rounded-full flex items-center justify-center my-0.5 bg-slate-300">
                  <div className="w-8 h-8 rounded-full border border-dashed border-slate-600 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Compressor</div>
              </div>

              {/* Split AC Indoor Unit Graphic */}
              <div className="flex flex-col items-center bg-slate-100 text-slate-800 rounded p-1.5 shadow-md border border-slate-300 w-24 md:w-32">
                <div className="w-full flex justify-between items-center px-1">
                  <div className="h-1.5 w-6 bg-slate-400 rounded"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="w-full border-t border-slate-300 my-1"></div>
                <div className="text-[9px] font-bold text-slate-700 tracking-tight">INVERTER SPLIT</div>
              </div>

              {/* Mobile Crane & Heavy Equipment icon */}
              <div className="hidden sm:flex flex-col items-center bg-amber-500 text-slate-900 rounded p-1.5 shadow-md border border-amber-600 w-20 text-center font-bold">
                <span className="text-[10px] text-amber-950 font-extrabold uppercase">HEAVY CRANE</span>
                <span className="text-[9px] bg-slate-900 text-yellow-400 px-1 rounded mt-0.5">TRAINING</span>
              </div>
            </div>

            {/* A/C TRAINING Ribbon Bar */}
            <div className="mt-auto bg-blue-900/90 py-1 px-3 text-center rounded border border-blue-400/40">
              <span className="text-white font-black tracking-widest text-xs md:text-sm uppercase drop-shadow">
                A / C   T R A I N I N G   &   H E A V Y   E Q U I P M E N T
              </span>
            </div>
          </div>

          {/* Decorative Dot Matrix Divider */}
          <div className="hidden lg:flex flex-col justify-center items-center px-3 text-yellow-300">
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm" />
              ))}
            </div>
          </div>

          {/* Right Side: Institute Official Details Box */}
          <div className="flex-1 bg-[#0f2858] p-3 md:p-4 flex flex-col justify-center items-center text-center space-y-1.5">
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-widest uppercase font-serif drop-shadow-md">
                M I T &nbsp; W E L L &nbsp; T E C H
              </h1>
              <h2 className="text-base md:text-lg lg:text-xl font-extrabold text-blue-200 tracking-wider uppercase">
                I N S T I T U T E
              </h2>
            </div>

            {/* Multi Industrial Training Box */}
            <div className="w-full max-w-sm bg-white text-red-600 font-black py-0.5 px-3 rounded shadow text-xs md:text-sm tracking-wide uppercase border border-red-200">
              Multi Industrial Training
            </div>

            {/* Red Call Banner */}
            <div className="w-full max-w-sm bg-red-600 text-white font-extrabold py-0.5 px-3 rounded shadow text-xs md:text-sm tracking-tight flex items-center justify-center gap-1.5">
              <Phone size={13} className="inline fill-white" />
              <span>Call: 8092573908 / 7004752125</span>
            </div>

            {/* Dark Green Website Banner */}
            <div className="w-full max-w-sm bg-[#046307] text-white font-bold py-0.5 px-3 rounded text-[11px] md:text-xs flex items-center justify-center gap-1.5">
              <Globe size={12} className="inline" />
              <span>Website: www.mitwelltech.com</span>
            </div>

            {/* Teal Email Banner */}
            <div className="w-full max-w-sm bg-[#084c61] text-white font-bold py-0.5 px-3 rounded text-[11px] md:text-xs flex items-center justify-center gap-1.5">
              <Mail size={12} className="inline" />
              <span>Email: info@mitwelltech.com</span>
            </div>

            {/* Bottom Hindi Tagline Ribbon */}
            <div className="w-full max-w-sm bg-[#166534] text-yellow-300 font-bold py-0.5 px-2 rounded text-[11px] md:text-xs text-center border-t border-emerald-400/30">
              आपकी कामयाबी हमारी पहचान
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
