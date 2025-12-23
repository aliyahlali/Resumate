import React from 'react';

export default function StepCard({ number, title, description }) {
  return (
    <div className="relative">
      <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
        {/* Step Number */}
        <div className="mb-4">
          <span className="inline-block text-4xl font-bold text-blue-600">{number}</span>
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
