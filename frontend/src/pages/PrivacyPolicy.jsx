import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
            Privacy Policy
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
              Resumate ("the Platform", "we", "our", or "us") is committed to protecting the privacy and personal data of its users. This Privacy Policy explains how we collect, use, store, and protect personal information when users access and use the Resumate platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using Resumate, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect only the information necessary to provide and improve our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Email address</li>
              <li>Account username</li>
              <li>Authentication credentials (stored securely in encrypted or hashed form)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Resume and Career Data</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Uploaded resumes or master resumes</li>
              <li>Job descriptions provided by the user</li>
              <li>Generated personalized resumes</li>
              <li>Resume analysis results (e.g., keywords, match scores)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Technical Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>IP address (used only for security and system integrity)</li>
              <li>Session-related data</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              User data is used exclusively to deliver the platform's core functionality.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              Specifically, we use data to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Authenticate users and manage accounts</li>
              <li>Analyze resumes and job descriptions</li>
              <li>Generate personalized resumes using AI services</li>
              <li>Store resume versions and user history</li>
              <li>Improve system performance and usability</li>
              <li>Ensure security and prevent misuse</li>
            </ul>
            <p className="text-gray-700 leading-relaxed font-medium">
              Resumate does not sell, rent, or trade user data to third parties.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI and Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To generate personalized resumes, Resumate may send resume content and job descriptions to third-party AI services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              Important clarifications:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Only the minimum necessary data is transmitted</li>
              <li>Data is processed solely for resume generation</li>
              <li>No personal data is used for AI training by Resumate</li>
              <li>We do not retain AI service responses beyond the generation process unless saved by the user</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Storage and Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect user data, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure password hashing</li>
              <li>Restricted access to stored data</li>
              <li>Logical separation of user accounts</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Despite these measures, no system can be guaranteed to be 100% secure. Users are encouraged to protect their login credentials.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>User data is retained only as long as the account is active</li>
              <li>Saved resumes and history remain accessible until deleted by the user</li>
              <li>Users may delete their saved resumes at any time</li>
              <li>When an account is deleted, associated data is permanently removed</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Access their personal data</li>
              <li>Update or correct their information</li>
              <li>Delete saved resumes and history</li>
              <li>Request account deletion</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              These rights align with general data protection principles such as GDPR.
            </p>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Resumate uses essential cookies or local storage mechanisms solely to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Maintain user sessions</li>
              <li>Improve platform usability</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              No advertising or tracking cookies are used.
            </p>
          </div>

          {/* Section 9 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Resumate is not intended for users under the age of 16. We do not knowingly collect personal data from minors.
            </p>
          </div>

          {/* Section 10 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy may be updated to reflect changes in functionality or legal requirements. Any updates will be published on this page with a revised "Last updated" date.
            </p>
          </div>

          {/* Section 11 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions or concerns regarding this Privacy Policy, please contact:
            </p>
            <p className="text-gray-700 leading-relaxed">
              Resumate Support Team
            </p>
          </div>

          {/* Academic Note */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Note</h3>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy is provided as part of an academic software engineering project and demonstrates compliance-aware system design principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
