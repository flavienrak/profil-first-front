import React from 'react';

export default function Popup({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black/50 flex justify-center items-center">
      <div className="max-w-[32rem] bg-white p-5 rounded-xl relative border-gray-500 shadow">
        {children}
        <i
          onClick={onClose}
          className="absolute z-10 text-neutral-900 top-2 right-2 p-2 cursor-pointer rounded-full flex justify-center items-center h-10 w-10 bg-gray-100 hover:bg-gray-300 transition-all duration-150"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </i>
      </div>
    </div>
  );
}
