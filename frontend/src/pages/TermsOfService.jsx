import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: 01-01-2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          {/* Section 1 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Resumate ("the Platform", "we", "our", or "us").
              These Terms of Service govern your access to and use of the Resumate web application.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By accessing or using Resumate, you agree to be bound by these Terms. If you do not agree, you must not use the platform.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Purpose of the Platform</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Resumate is an AI-powered resume personalization platform designed to help users:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Upload or create resumes</li>
              <li>Analyze resumes against job descriptions</li>
              <li>Generate personalized resumes using AI</li>
              <li>Store and manage resume versions</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The platform is developed as part of an academic software engineering project and is provided for educational and demonstration purposes.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features, users must create an account.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              Users agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Provide accurate and up-to-date information</li>
              <li>Keep login credentials confidential</li>
              <li>Be responsible for all activities performed under their account</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Resumate reserves the right to suspend or terminate accounts that violate these Terms.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Upload false, misleading, or unlawful content</li>
              <li>Use the platform for fraudulent or malicious purposes</li>
              <li>Attempt to access other users' data</li>
              <li>Reverse engineer or misuse the system</li>
              <li>Upload content that infringes intellectual property rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Resumate may restrict access if misuse is detected.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users retain full ownership of:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Uploaded resumes</li>
              <li>Job descriptions</li>
              <li>Generated resume content</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using the platform, users grant Resumate a limited, non-exclusive license to process this content solely for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Resume analysis</li>
              <li>AI-based personalization</li>
              <li>Platform functionality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              User content is never sold or shared for commercial purposes.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Resumate uses third-party AI services to generate resume content.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              Important disclaimers:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>AI-generated resumes are suggestions and may require user review</li>
              <li>Resumate does not guarantee employment outcomes</li>
              <li>Users are responsible for verifying the accuracy of generated content</li>
              <li>The platform does not guarantee that generated resumes will result in interviews, offers, or employment</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Availability and Performance</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Resumate is provided on an "as-is" and "as-available" basis.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Continuous availability</li>
              <li>Error-free operation</li>
              <li>Compatibility with all devices or browsers</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Maintenance, updates, or outages may occur without prior notice.
            </p>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Protection and Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              The collection and use of personal data are governed by our Privacy Policy.
              By using Resumate, you acknowledge and agree to those practices.
            </p>
          </div>

          {/* Section 9 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Account Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users may:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Delete saved resumes at any time</li>
              <li>Request account deletion</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Resumate may suspend or terminate accounts that violate these Terms or compromise system integrity.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, associated user data will be deleted in accordance with the Privacy Policy.
            </p>
          </div>

          {/* Section 10 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Resumate shall not be liable for indirect or consequential damages</li>
              <li>We are not responsible for decisions made based on AI-generated content</li>
              <li>Use of the platform is at the user's own risk</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to the Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms may be updated to reflect platform improvements or academic requirements.
              Changes will be effective upon publication.
            </p>
          </div>

          {/* Section 12 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by general principles of applicable data protection and digital service regulations, without reference to specific jurisdictions, due to the academic nature of the project.
            </p>
          </div>

          {/* Section 13 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions regarding these Terms, please contact:
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Resumate Support Team
            </p>
          </div>

          {/* Academic Note */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Note</h3>
            <p className="text-gray-700 leading-relaxed">
              This Terms of Service document is part of a university-level software engineering project and demonstrates responsible system governance and user agreement practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
