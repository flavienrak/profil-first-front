import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  avatar
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img 
          src={avatar} 
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
          <p className="text-blue-600 text-xs">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-sm flex-grow">{content}</p>
    </div>
  );
};