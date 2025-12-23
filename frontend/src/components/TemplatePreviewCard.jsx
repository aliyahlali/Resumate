import React, { useEffect, useRef } from 'react';
import { generateTemplatePreview } from '../services/templatePreview';

export default function TemplatePreviewCard({ templateId, templateName }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const html = generateTemplatePreview(templateId);
      const iframe = iframeRef.current;
      iframe.srcdoc = html;
    }
  }, [templateId]);

  return (
    <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-100">
        {/* Template Preview */}
        <div className="aspect-[3/4] bg-white overflow-hidden">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none scale-[0.4] origin-top-left"
            style={{ width: '250%', height: '250%' }}
            title={templateName}
            sandbox="allow-same-origin"
          />
        </div>
        
        {/* Template Name */}
        <div className="p-4 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {templateName}
          </h3>
          <button className="mt-3 w-full py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            Preview Template
          </button>
        </div>
      </div>
    </div>
  );
}
