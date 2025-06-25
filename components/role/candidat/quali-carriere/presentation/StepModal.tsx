import React from 'react';
import { X } from 'lucide-react';

interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepNumber: number;
  title: string;
  content: string;
}

export const StepModal: React.FC<StepModalProps> = ({
  isOpen,
  onClose,
  stepNumber,
  title,
  content
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">{stepNumber}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {content}
            </p>
          </div>
          
          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};