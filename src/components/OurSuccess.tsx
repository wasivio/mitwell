import React, { useState } from 'react';
import { Award, Briefcase, ChevronRight, X } from 'lucide-react';
import { SUCCESS_STORIES } from '../data/mockCertificates';

export const OurSuccess: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full my-6">
      {/* Vivid Blue Header matching Screenshot */}
      <div className="w-full bg-[#0096e6] text-white py-2 px-4 rounded-t shadow-sm">
        <h2 className="text-center font-bold text-base md:text-lg tracking-wide flex items-center justify-center gap-2">
          <Award size={18} />
          <span>Our Success</span>
        </h2>
      </div>

      {/* Grid of Placed Students matching Screenshot */}
      <div className="bg-[#f8fafc] border border-slate-200 border-t-0 p-4 md:p-6 rounded-b">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {SUCCESS_STORIES.slice(0, 2).map((student, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition"
            >
              {/* Photo with border matching screenshot */}
              <div className="w-20 h-24 md:w-24 md:h-28 rounded overflow-hidden border-2 border-sky-400 bg-sky-200 shrink-0">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Student Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-wide uppercase truncate">
                  {student.name}
                </h3>
                <p className="text-xs font-semibold text-sky-700 mt-0.5">
                  {student.trade}
                </p>
                <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                  <div className="flex items-center gap-1 text-slate-700 font-medium truncate">
                    <Briefcase size={12} className="text-slate-400 shrink-0" />
                    <span>{student.company}</span>
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Placed: {student.package}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* "View All >>" Link matching Screenshot */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setModalOpen(true)}
            className="text-sky-600 hover:text-sky-800 text-xs md:text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>View All &gt;&gt;</span>
          </button>
        </div>
      </div>

      {/* Full Success Stories Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="text-yellow-500" />
                <span>MIT Well Tech Placement Records & Hall of Fame</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUCCESS_STORIES.map((student, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center gap-3"
                >
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-16 h-20 object-cover rounded border border-sky-400"
                  />
                  <div className="text-xs">
                    <h4 className="font-bold text-slate-900 uppercase">{student.name}</h4>
                    <p className="text-sky-700 font-medium">{student.trade}</p>
                    <p className="text-slate-600 mt-1">{student.company}</p>
                    <p className="text-emerald-700 font-bold">{student.package}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
