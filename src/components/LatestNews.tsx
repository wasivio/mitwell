import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { LATEST_NEWS_ITEMS } from '../data/mockCertificates';

export const LatestNews: React.FC = () => {
  return (
    <div className="w-full my-6">
      {/* Vivid Blue Header matching Screenshot */}
      <div className="w-full bg-[#0096e6] text-white py-2 px-4 rounded-t shadow-sm">
        <h2 className="text-center font-bold text-base md:text-lg tracking-wide flex items-center justify-center gap-2">
          <Bell size={18} className="animate-bounce" />
          <span>Latest News</span>
        </h2>
      </div>

      {/* News Content Box */}
      <div className="bg-[#f1f5f9] border border-slate-200 border-t-0 p-4 rounded-b text-xs md:text-sm text-slate-700 shadow-inner">
        {/* Ticker / Marquee line */}
        <div className="overflow-hidden bg-white p-2.5 rounded border border-slate-200 mb-3 shadow-xs">
          <div className="animate-marquee font-medium text-slate-800">
            {LATEST_NEWS_ITEMS.join('  •  ★  •  ')}
          </div>
        </div>

        {/* Bulleted list of notices */}
        <ul className="space-y-2 mt-2">
          {LATEST_NEWS_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs md:text-sm">
              <span className="text-sky-600 font-bold mt-0.5">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
