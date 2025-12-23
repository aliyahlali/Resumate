import React from 'react';
import { ArrowRight, CheckCircle, Zap, Target, Users, Sparkles, Star, TrendingUp } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/cards/Navbar';
import FeatureCard from '../components/cards/FeatureCard';
import StepCard from '../components/cards/StepCard';
import Footer from '../components/cards/Footer';
import TemplatePreviewCard from '../components/TemplatePreviewCard';
import heroImg from '../components/pictures/hero-illustration.png';
import keywordsImg from '../components/pictures/keywords.png';

// Feature cards data
const features = [
  {
    id: 1,
    title: 'AI-Powered Optimization',
    description: 'Leverage advanced AI to transform your CV into a compelling narrative that highlights your strengths.',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Professional Templates',
    description: 'Choose from beautifully designed templates that make your CV stand out to recruiters.',
    icon: Target,
  },
  {
    id: 3,
    title: 'Job Matching',
    description: 'Tailor your CV to specific job descriptions with intelligent keyword optimization.',
    icon: Zap,
  },
  {
    id: 4,
    title: 'Export Ready',
    description: 'Download your CV as PDF, Word, or Image formats instantly.',
    icon: CheckCircle,
  },
  {
    id: 5,
    title: 'Unlimited Edits',
    description: 'Edit and refine your CV as many times as you need with our intuitive interface.',
    icon: Users,
  },
];

// How-it-works steps data
const steps = [
  {
    id: 1,
    number: '01',
    title: 'Upload Your CV',
    description: 'Simply upload your existing CV or create one from scratch using our intuitive editor.',
  },
  {
    id: 2,
    number: '02',
    title: 'AI Optimization',
    description: 'Our AI analyzes your CV and suggests improvements tailored to your target roles.',
  },
  {
    id: 3,
    number: '03',
    title: 'Download & Apply',
    description: 'Download your optimized CV and start applying to your dream jobs with confidence.',
  },
];

// Templates preview data
const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
  },
  {
    id: 'professional-classic',
    name: 'Professional Classic',
  },
];

// FAQ data
const faqs = [
  {
    id: 1,
    question: 'How does the AI optimization work?',
    answer: 'Our AI analyzes your CV content and compares it against thousands of job descriptions to identify missing keywords, improve phrasing, and enhance overall presentation. It suggests improvements while maintaining your authentic voice.',
  },
  {
    id: 2,
    question: 'Can I customize the templates?',
    answer: 'Absolutely! All our templates are fully customizable. You can adjust colors, fonts, layouts, and content to match your personal brand while maintaining professional standards.',
  },
  {
    id: 3,
    question: 'Is my data secure?',
    answer: 'Yes, we use enterprise-grade encryption and comply with GDPR standards. Your CV data is stored securely and never shared with third parties without your consent.',
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white pt-5">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="mt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  This resume builder gets you{' '}
                  <span className="text-blue-600 inline-block">
                    <Typewriter
                      words={['an interview', 'paid more', 'hired faster']}
                      loop
                      cursor
                      cursorStyle="|"
                      typeSpeed={70}
                      deleteSpeed={45}
                      delaySpeed={1500}
                    />
                  </span>
                </h1>

                <p className="text-lg text-gray-600 max-w-lg">
                  Only 2% of resumes win. Yours will be one of them.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2">
                  Create my resume
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('/register')} className="px-8 py-4 border-2 border-blue-300 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300">
                  Upload my resume
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-600">39%</span> more likely to land the job
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-bold">Trustpilot</span> 4.4 out of 5
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative">
                {/* Main frame - lighter background with subtle border */}
                <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl p-6 shadow-2xl border-4 border-blue-100">
                  {/* Image container */}
                  <div className="relative overflow-hidden rounded-2xl bg-white">
                    <img
                      src={heroImg}
                      alt="CV Builder Demo"
                      className="w-full h-auto object-cover rounded-2xl"
                    />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create a CV that gets results
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Discover Keywords Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Discover must-have keywords
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  When you submit your resume, it goes into an ATS database. Hiring managers search for resumes by typing keywords into the ATS search bar.
                </p>
                <p className="text-lg text-gray-700">
                  These must-have keywords come directly from the job description. Jobscan's resume scanner works by comparing your resume to the job description and telling you exactly which keywords are the most important.
                </p>
              </div>

              {/* Scanner Checks */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our scanner checks for:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Hard skills</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Soft skills</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Other keywords</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Buzzwords</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Industry lingo</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                  Check My Resume
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img
                  src={keywordsImg}
                  alt="Skills Comparison"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to your perfect CV
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <StepCard
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Style
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional templates designed for modern careers
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <TemplatePreviewCard
                key={template.id}
                templateId={template.id}
                templateName={template.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our platform
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have already landed their dream jobs
          </p>
          <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// FAQ Item Component
function FAQItem({ faq, defaultOpen = false }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 text-left">
          {faq.question}
        </h3>
        <span
          className={`text-blue-600 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}
