import React from 'react';

export default function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
      <div className="mb-4 inline-block p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
