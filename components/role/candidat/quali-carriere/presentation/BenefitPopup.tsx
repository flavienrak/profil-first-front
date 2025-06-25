import React from 'react';
import { X, TrendingUp, Sparkles } from 'lucide-react';

interface BenefitPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  source: string;
}

export const BenefitPopup: React.FC<BenefitPopupProps> = ({
  isOpen,
  onClose,
  title,
  content,
  source
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-3xl max-w-lg w-full shadow-2xl transform transition-all duration-500 scale-100 border border-white/60 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-100/40 to-pink-100/30 rounded-full blur-2xl"></div>
        
        <div className="relative p-8">
          {/* Header avec icône décorative */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <TrendingUp className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Statistique</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-full transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>
          
          {/* Content avec design amélioré */}
          <div className="mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <p className="text-gray-800 leading-relaxed text-base mb-4 font-medium">
                {content}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <p className="text-gray-600 text-sm font-medium">
                  Source : {source}
                </p>
              </div>
            </div>
          </div>
          
          {/* Button avec design premium */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                <span>Parfait !</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};