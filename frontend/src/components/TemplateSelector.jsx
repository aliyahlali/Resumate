import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

// Default templates (fallback if API fails)
const defaultTemplates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Modern design with sidebar and vertical timeline',
    features: ['Sidebar', 'Timeline', 'Two-column layout']
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Clean and centered academic-style design',
    features: ['Centered layout', 'Serif font', 'Clean design']
  },
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Classic and professional design',
    features: ['Classic layout', 'Two-column sections', 'Professional']
  },
  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Creative design with initials watermark',
    features: ['Watermark', 'Two-column layout', 'Modern design']
  }
];

// Generate visual preview for each template
const getTemplatePreview = (templateId) => {
  const previewStyles = {
    common: "text-[3px] leading-[1.2] p-1.5",
  };

  switch (templateId) {
    case 'modern-professional':
      return (
        <div className={`${previewStyles.common} flex h-full bg-white`}>
          <div className="w-[35%] bg-gray-50 p-1 border-r-[1px] border-gray-300">
            <div className="font-bold text-[3.8px] mb-0.3 tracking-wide">JOHN DOE</div>
            <div className="text-[2.2px] text-gray-600 mb-1 pb-0.5 border-b border-gray-800">Marketing Manager</div>
            
            <div className="mb-1">
              <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">CONTACT</div>
              <div className="text-[1.8px] space-y-0.3 mt-0.3">
                <div className="flex items-start gap-0.3">
                  <span className="text-[1.5px] font-bold">P</span>
                  <span>+1-234-567-890</span>
                </div>
                <div className="flex items-start gap-0.3">
                  <span className="text-[1.5px] font-bold">E</span>
                  <span>john.doe@email.com</span>
                </div>
                <div className="flex items-start gap-0.3">
                  <span className="text-[1.5px] font-bold">A</span>
                  <span>123 Marketing Street, New York, NY 10001</span>
                </div>
                <div className="flex items-start gap-0.3">
                  <span className="text-[1.5px] font-bold">W</span>
                  <span>linkedin.com/in/johndoe</span>
                </div>
                <div className="flex items-start gap-0.3">
                  <span className="text-[1.5px] font-bold">W</span>
                  <span>www.johndoeportfolio.com</span>
                </div>
              </div>
            </div>
            
            <div className="mb-1">
              <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">SKILLS</div>
              <div className="text-[1.8px] space-y-0.2 mt-0.3">
                <div>• Strategic Planning</div>
                <div>• Digital Marketing</div>
                <div>• Team Leadership</div>
                <div>• Data Analysis</div>
                <div>• SEO/SEM</div>
                <div>• Content Strategy</div>
                <div>• Social Media Marketing</div>
                <div>• Brand Management</div>
                <div>• Marketing Automation</div>
                <div>• Google Analytics</div>
                <div>• Adobe Creative Suite</div>
                <div>• CRM Systems</div>
              </div>
            </div>
            
            <div className="mb-1">
              <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">LANGUAGES</div>
              <div className="text-[1.8px] space-y-0.2 mt-0.3">
                <div>• English (Fluent)</div>
                <div>• French (Native)</div>
                <div>• Spanish (Intermediate)</div>
                <div>• German (Basic)</div>
              </div>
            </div>
            
            <div>
              <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">CERTIFICATIONS</div>
              <div className="text-[1.8px] space-y-0.2 mt-0.3">
                <div>• Google Ads Certified</div>
                <div>• HubSpot Inbound</div>
                <div>• Facebook Blueprint</div>
                <div>• PMP Certified</div>
              </div>
            </div>
          </div>
          
          <div className="w-[65%] p-1 relative">
            <div className="absolute left-0 top-2 bottom-0.5 w-[0.5px] bg-gray-300"></div>
            <div className="pl-1.5 relative">
              <div className="absolute left-[-2px] top-0 w-[2.5px] h-[2.5px] bg-gray-800 rounded-full border border-white"></div>
              
              <div className="mb-1">
                <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">PROFILE</div>
                <div className="text-[1.8px] text-justify mt-0.3 leading-[1.3]">
                  Results-driven Marketing Manager with 8+ years of experience in developing and executing successful marketing strategies across digital and traditional channels. Proven track record in increasing brand awareness by 45%, driving revenue growth of $2M+, and leading high-performing teams. Expert in data-driven decision making, customer acquisition, and retention strategies. Passionate about leveraging emerging technologies and innovative approaches to achieve business objectives.
                </div>
              </div>
              
              <div className="mb-1 relative">
                <div className="absolute left-[-2px] top-0 w-[2.5px] h-[2.5px] bg-gray-800 rounded-full border border-white"></div>
                <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">WORK EXPERIENCE</div>
                <div className="space-y-0.7 mt-0.3">
                  <div>
                    <div className="font-bold text-[2.1px]">Borcelle Studio</div>
                    <div className="text-[1.9px] text-gray-600 flex justify-between">
                      <span>Marketing Manager & Specialist</span>
                      <span className="italic">Jan 2020 - PRESENT</span>
                    </div>
                    <div className="text-[1.7px] mt-0.3 space-y-0.2 leading-[1.3]">
                      <div>• Led cross-functional team of 8 marketing professionals, including designers, content creators, and analysts</div>
                      <div>• Increased brand visibility by 45% through integrated marketing campaigns across social media, email, and paid advertising</div>
                      <div>• Managed annual marketing budget of $500K, optimizing spend to achieve 25% cost reduction while improving ROI by 35%</div>
                      <div>• Implemented marketing automation system that increased lead generation by 60% and improved conversion rates by 28%</div>
                      <div>• Developed and executed content strategy resulting in 200K+ monthly website visitors and 50K+ social media followers</div>
                      <div>• Collaborated with sales team to create targeted campaigns that generated $2M+ in new revenue</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-[2.1px]">Fauget Studio</div>
                    <div className="text-[1.9px] text-gray-600 flex justify-between">
                      <span>Consumer Insights & Marketing Specialist</span>
                      <span className="italic">Mar 2018 - Dec 2019</span>
                    </div>
                    <div className="text-[1.7px] mt-0.3 space-y-0.2 leading-[1.3]">
                      <div>• Conducted comprehensive market research and competitive analysis to identify growth opportunities</div>
                      <div>• Analyzed consumer behavior patterns using advanced analytics tools, providing actionable insights to leadership</div>
                      <div>• Developed customer segmentation strategies that improved targeting and increased campaign effectiveness by 40%</div>
                      <div>• Created detailed reports and presentations for C-level executives on market trends and consumer preferences</div>
                      <div>• Managed social media presence across 5 platforms, growing follower base by 150% in 18 months</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-[2.1px]">Digital Marketing Agency</div>
                    <div className="text-[1.9px] text-gray-600 flex justify-between">
                      <span>Junior Marketing Coordinator</span>
                      <span className="italic">Jun 2016 - Feb 2018</span>
                    </div>
                    <div className="text-[1.7px] mt-0.3 space-y-0.2 leading-[1.3]">
                      <div>• Assisted in planning and execution of digital marketing campaigns for 15+ clients across various industries</div>
                      <div>• Managed email marketing campaigns with average open rates of 28% and click-through rates of 4.5%</div>
                      <div>• Coordinated with design team to create engaging marketing materials and landing pages</div>
                      <div>• Monitored campaign performance metrics and prepared weekly performance reports</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-1 relative">
                <div className="absolute left-[-2px] top-0 w-[2.5px] h-[2.5px] bg-gray-800 rounded-full border border-white"></div>
                <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">EDUCATION</div>
                <div className="space-y-0.5 mt-0.3">
                  <div>
                    <div className="font-bold text-[2.1px]">Master of Business Administration (MBA)</div>
                    <div className="text-[1.9px] text-gray-600">Marketing Concentration | Wardiere University</div>
                    <div className="text-[1.7px] italic">2014 - 2016 | GPA: 3.9/4.0</div>
                    <div className="text-[1.7px] mt-0.2">• Dean's List all semesters • Marketing Excellence Award 2016</div>
                  </div>
                  <div>
                    <div className="font-bold text-[2.1px]">Bachelor of Science in Business Administration</div>
                    <div className="text-[1.9px] text-gray-600">Major: Marketing | State University</div>
                    <div className="text-[1.7px] italic">2010 - 2014 | GPA: 3.7/4.0</div>
                    <div className="text-[1.7px] mt-0.2">• Magna Cum Laude • President of Marketing Club</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-[-2px] top-0 w-[2.5px] h-[2.5px] bg-gray-800 rounded-full border border-white"></div>
                <div className="font-bold text-[2.3px] mb-0.3 border-b border-gray-800 pb-0.3">ACHIEVEMENTS</div>
                <div className="text-[1.7px] space-y-0.2 mt-0.3 leading-[1.3]">
                  <div>• Marketing Campaign of the Year Award 2022 - American Marketing Association</div>
                  <div>• Featured speaker at Digital Marketing Summit 2023</div>
                  <div>• Published article "The Future of Digital Marketing" in Marketing Today Magazine</div>
                  <div>• Increased company revenue by $2M+ through strategic marketing initiatives</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'clean-minimal':
      return (
        <div className={`${previewStyles.common} h-full bg-white`}>
          <div className="text-center mb-1">
            <div className="font-normal text-[4px] mb-0.3 tracking-[0.3em]" style={{fontFamily: 'Georgia, serif'}}>Emma Ahearn</div>
            <div className="text-[2.2px] text-gray-600 mb-0.5 tracking-[0.2em]">CHEMIST</div>
            <div className="border-b border-gray-400 mb-0.5"></div>
          </div>
          
          <div className="text-center text-[1.7px] text-gray-600 mb-1 space-x-0.5">
            <span>Phone: +123-456-7890</span>
            <span>•</span>
            <span>Email: hello@reallygreatsite.com</span>
            <span>•</span>
            <span>Address: 123 Anywhere St., Any City, ST 12345</span>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">PROFESSIONAL SUMMARY</div>
            <div className="text-[1.7px] italic text-justify leading-[1.4] px-0.5">
              Highly motivated chemistry graduate with extensive academic background and hands-on laboratory experience. Seeking to apply analytical skills, research expertise, and passion for scientific innovation in a forward-thinking organization. Proven ability to conduct complex experiments, analyze data, and contribute to peer-reviewed research. Eager to join a dynamic R&D environment where I can contribute to groundbreaking discoveries and advance my career in chemical sciences.
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">EDUCATION</div>
            <div className="space-y-0.5">
              <div>
                <div className="font-bold text-[1.9px]">Bachelor of Science in Chemistry | 2026-2030</div>
                <div className="text-[1.7px] italic text-gray-600">Pacific Northwest College, Wardiere, OR</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3] space-y-0.2">
                  <div>• Relevant Coursework: Organic Chemistry I & II, Inorganic Chemistry, Physical Chemistry, Analytical Chemistry, Chemical Engineering Principles, Material Science, Biochemistry, Quantum Chemistry, Spectroscopy</div>
                  <div>• GPA: 3.8/4.0 | Dean's List: Fall 2026, Spring 2027, Fall 2027, Spring 2028, Fall 2028, Spring 2029</div>
                  <div>• Senior Thesis: "Synthesis and Characterization of Novel Organic Photovoltaic Materials"</div>
                  <div>• Laboratory Skills: HPLC, GC-MS, NMR Spectroscopy, UV-Vis Spectroscopy, IR Spectroscopy, Titration, Distillation</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">RESEARCH EXPERIENCE</div>
            <div className="space-y-0.5">
              <div>
                <div className="font-bold text-[1.9px]">Undergraduate Research Assistant | Jan 2029 - May 2030</div>
                <div className="text-[1.7px] italic text-gray-600">Chemistry Department, East State University</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3] space-y-0.2">
                  <div>• Collaborated with research team of 6 members to study synthesis and characterization of novel organic compounds for renewable energy applications</div>
                  <div>• Conducted 200+ experiments using advanced analytical techniques including chromatography (HPLC, GC), spectroscopy (NMR, IR, UV-Vis), and mass spectrometry</div>
                  <div>• Analyzed and interpreted complex experimental data using ChemDraw, Origin, and MATLAB software</div>
                  <div>• Co-authored 2 peer-reviewed publications in Journal of Organic Chemistry and contributed to 3 conference presentations</div>
                  <div>• Maintained detailed laboratory notebooks and prepared comprehensive research reports for principal investigator</div>
                  <div>• Trained 3 junior students in laboratory safety protocols and experimental techniques</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-[1.9px]">Laboratory Teaching Assistant | Sep 2028 - Dec 2029</div>
                <div className="text-[1.7px] italic text-gray-600">General Chemistry Lab, Pacific Northwest College</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3] space-y-0.2">
                  <div>• Assisted professor in teaching general chemistry laboratory course for 60+ undergraduate students</div>
                  <div>• Demonstrated proper laboratory techniques, safety procedures, and use of analytical instruments</div>
                  <div>• Graded lab reports, quizzes, and exams; held weekly office hours to provide additional support to students</div>
                  <div>• Prepared chemical solutions, set up experiments, and maintained laboratory equipment and inventory</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">PROJECTS</div>
            <div className="space-y-0.4">
              <div>
                <div className="font-bold text-[1.9px]">Fabrication of a Miniature Chemical Reactor</div>
                <div className="text-[1.7px] italic text-gray-600">Chemical Engineering Course, Second Semester of 2028</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3]">
                  • Engineered a small-scale chemical reactor using principles of chemical engineering and thermodynamics. Designed reactor specifications, selected appropriate materials, and conducted safety analysis. Successfully demonstrated continuous flow synthesis of ethyl acetate with 85% yield.
                </div>
              </div>
              <div>
                <div className="font-bold text-[1.9px]">The Green Thumb Chemist: Sustainable Laboratory Practices</div>
                <div className="text-[1.7px] italic text-gray-600">Chemistry Club Leadership Project, First Semester of 2029</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3]">
                  • Led team of 8 students to develop comprehensive project promoting environmentally-friendly laboratory practices. Created educational materials, organized workshops, and implemented waste reduction program that decreased lab chemical waste by 30%.
                </div>
              </div>
              <div>
                <div className="font-bold text-[1.9px]">Analysis of Water Quality in Local River Systems</div>
                <div className="text-[1.7px] italic text-gray-600">Analytical Chemistry Course, Fall 2027</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3]">
                  • Conducted comprehensive water quality analysis of 5 local river sites using spectrophotometry, ion chromatography, and titration methods. Identified pollution sources and presented findings to local environmental agency.
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">TECHNICAL SKILLS</div>
            <div className="text-[1.6px] leading-[1.3] space-y-0.2">
              <div><span className="font-semibold">Analytical Techniques:</span> HPLC, GC-MS, NMR (1H, 13C), IR Spectroscopy, UV-Vis Spectroscopy, Mass Spectrometry, Chromatography, Titration, Distillation, Crystallization</div>
              <div><span className="font-semibold">Software:</span> ChemDraw, Origin, MATLAB, Gaussian, Mercury, SciFinder, Microsoft Office Suite (Excel, Word, PowerPoint)</div>
              <div><span className="font-semibold">Laboratory:</span> Synthesis techniques, Purification methods, Safety protocols, Quality control, Data analysis, Equipment maintenance</div>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">PROFESSIONAL AFFILIATIONS</div>
            <div className="text-[1.6px] space-y-0.2">
              <div>• American Chemical Society (ACS) - Student Member, 2027-Present</div>
              <div>• Chemistry Club - President, 2028-2029 | Vice President, 2027-2028</div>
              <div>• Women in STEM Organization - Active Member, 2026-Present</div>
            </div>
          </div>
          
          <div>
            <div className="font-bold text-[2.2px] mb-0.3 text-teal-700 tracking-wide">NOTABLE AWARDS & HONORS</div>
            <div className="text-[1.6px] space-y-0.2">
              <div>• Dean's List, East State University, 2026-2030 (All Semesters)</div>
              <div>• Gold Award, International Chemistry Olympiad, 2027</div>
              <div>• Outstanding Undergraduate Researcher Award, Pacific Northwest College, 2030</div>
              <div>• Presidential Scholarship Recipient, 2026-2030 (Full Tuition)</div>
              <div>• Best Poster Presentation, Regional ACS Conference, 2029</div>
            </div>
          </div>
        </div>
      );

    case 'professional-classic':
      return (
        <div className={`${previewStyles.common} h-full bg-white`}>
          <div className="text-center mb-1 pb-0.5 border-b-2 border-gray-900">
            <div className="font-bold text-[4px] tracking-[0.4em] mb-0.3">CONNOR HAMILTON</div>
            <div className="text-[2.2px] mb-0.3 tracking-[0.1em]">Real Estate Agent</div>
            <div className="text-[1.7px] text-gray-600 space-x-0.5">
              <span>123-456-7890</span>
              <span>|</span>
              <span>hello@reallygreatsite.com</span>
              <span>|</span>
              <span>reallygreatsite.com</span>
              <span>|</span>
              <span>LinkedIn: /connor-hamilton</span>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">PROFILE</div>
            <div className="text-[1.7px] text-justify leading-[1.4]">
              Dynamic and results-driven Real Estate Agent with over 10 years of proven success in residential and commercial property sales. Passionate about helping clients achieve their real estate goals through personalized service, market expertise, and strategic negotiation. Track record of closing $50M+ in sales volume with 98% client satisfaction rate. Deep knowledge of local market trends, property valuation, and investment opportunities. Skilled in digital marketing, client relationship management, and contract negotiation. Committed to providing exceptional service and building long-term client relationships.
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">WORK EXPERIENCE</div>
            <div className="space-y-0.6">
              <div>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[2px] tracking-wide">SENIOR REAL ESTATE AGENT</div>
                  <div className="text-[1.7px] text-gray-600 italic">June 2015 - Present</div>
                </div>
                <div className="text-[1.9px] font-semibold">Really Great Realty Company | New York, NY</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3] space-y-0.2">
                  <div>• Successfully closed 150+ real estate transactions totaling over $50M in sales volume, consistently ranking in top 5% of agents company-wide</div>
                  <div>• Negotiate complex contracts and real estate transactions, achieving average sale price 7% above listing price through strategic pricing and marketing</div>
                  <div>• Provide exceptional customer service to 200+ clients, maintaining 98% satisfaction rate and generating 75% of business through referrals and repeat clients</div>
                  <div>• Develop and execute comprehensive marketing campaigns for properties utilizing professional photography, virtual tours, social media, email marketing, and traditional advertising</div>
                  <div>• Research and monitor local real estate market trends, providing clients with data-driven insights on property values, neighborhood statistics, and investment opportunities</div>
                  <div>• Manage complete sales cycle from initial consultation through closing, coordinating with lenders, inspectors, attorneys, and title companies</div>
                  <div>• Utilize CRM system to maintain detailed client files, track leads, and manage follow-up communications</div>
                  <div>• Conduct 50+ open houses annually and provide personalized home tours to prospective buyers</div>
                  <div>• Mentor 3 junior agents on sales techniques, market analysis, and client relationship management</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[2px] tracking-wide">REAL ESTATE ASSOCIATE</div>
                  <div className="text-[1.7px] text-gray-600 italic">January 2012 - May 2015</div>
                </div>
                <div className="text-[1.9px] font-semibold">Premier Properties Group | Brooklyn, NY</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3] space-y-0.2">
                  <div>• Closed 80+ residential property transactions valued at $18M, exceeding annual sales targets by average of 25%</div>
                  <div>• Built client base of 100+ buyers and sellers through networking, cold calling, and community involvement</div>
                  <div>• Conducted comparative market analyses and property valuations to assist clients in making informed decisions</div>
                  <div>• Coordinated property showings, open houses, and client meetings while managing multiple transactions simultaneously</div>
                  <div>• Developed strong relationships with mortgage brokers, home inspectors, and contractors to facilitate smooth transactions</div>
                  <div>• Created marketing materials including property listings, brochures, and online advertisements</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[2px] tracking-wide">SALES REPRESENTATIVE</div>
                  <div className="text-[1.7px] text-gray-600 italic">June 2010 - December 2011</div>
                </div>
                <div className="text-[1.9px] font-semibold">Metropolitan Business Solutions | Manhattan, NY</div>
                <div className="text-[1.6px] mt-0.2 leading-[1.3] space-y-0.2">
                  <div>• Generated $500K+ in annual revenue through B2B sales of business services and solutions</div>
                  <div>• Developed strong negotiation and communication skills while building relationships with corporate clients</div>
                  <div>• Consistently exceeded quarterly sales quotas by 15-30% through strategic prospecting and relationship building</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1 mb-0.8">
            <div>
              <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">EDUCATION</div>
              <div className="space-y-0.4">
                <div>
                  <div className="font-bold text-[1.9px]">Bachelor of Arts in Business Administration</div>
                  <div className="text-[1.7px]">New York University</div>
                  <div className="text-[1.6px]">2006 - 2010 | GPA: 3.6/4.0</div>
                  <div className="text-[1.6px]">Major: Marketing & Finance</div>
                  <div className="text-[1.6px]">Dean's List: 2008, 2009, 2010</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">SKILLS</div>
              <div className="text-[1.6px] space-y-0.2">
                <div>• Expert knowledge of NYC real estate market and neighborhoods</div>
                <div>• Advanced negotiation and closing techniques</div>
                <div>• Property valuation and market analysis</div>
                <div>• Digital marketing and social media advertising</div>
                <div>• Client relationship management (CRM systems)</div>
                <div>• Contract review and legal documentation</div>
                <div>• Investment property analysis and ROI calculations</div>
                <div>• Professional photography and virtual tour creation</div>
                <div>• Public speaking and presentation skills</div>
                <div>• Time management and multitasking</div>
              </div>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">LICENSES & CERTIFICATIONS</div>
            <div className="text-[1.6px] space-y-0.2">
              <div>• Licensed Real Estate Salesperson - New York State (License #12345678) - Active since 2012</div>
              <div>• Certified Residential Specialist (CRS) - Council of Residential Specialists, 2017</div>
              <div>• Accredited Buyer's Representative (ABR) - Real Estate Buyer's Agent Council, 2016</div>
              <div>• Certified Negotiation Expert (CNE) - Real Estate Negotiation Institute, 2018</div>
              <div>• Graduate, REALTOR® Institute (GRI) - National Association of REALTORS®, 2015</div>
              <div>• Pricing Strategy Advisor (PSA) - National Association of REALTORS®, 2019</div>
            </div>
          </div>
          
          <div className="mb-0.8">
            <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">AWARDS & RECOGNITION</div>
            <div className="text-[1.6px] space-y-0.2">
              <div>• Top Sales Agent Award - Really Great Realty Company (2016, 2018, 2020, 2022, 2023)</div>
              <div>• Circle of Excellence Award - New York State Association of REALTORS® (2017-2023)</div>
              <div>• President's Club Member - Really Great Realty Company (2019-2023)</div>
              <div>• 5-Star Customer Service Award - Real Estate Excellence Magazine (2021, 2022)</div>
              <div>• Top 100 Real Estate Agents in New York - Real Estate Weekly (2022, 2023)</div>
            </div>
          </div>
          
          <div>
            <div className="font-bold text-[2.2px] mb-0.3 border-b-2 border-gray-900 pb-0.3 tracking-wide">PROFESSIONAL AFFILIATIONS</div>
            <div className="text-[1.6px] space-y-0.2">
              <div>• National Association of REALTORS® (NAR) - Member since 2012</div>
              <div>• New York State Association of REALTORS® - Member since 2012</div>
              <div>• Real Estate Board of New York (REBNY) - Member since 2015</div>
              <div>• Local Chamber of Commerce - Board Member, 2020-Present</div>
            </div>
          </div>
        </div>
      );

    case 'creative-modern':
      return (
        <div className={`${previewStyles.common} h-full bg-white relative overflow-hidden`}>
          <div className="absolute top-0.5 right-0.5 text-[15px] font-bold italic text-gray-200 opacity-15" style={{fontFamily: 'Georgia, serif'}}>OW</div>
          
          <div className="relative z-10">
            <div className="text-center mb-1 pb-0.5 border-b border-gray-300">
              <div className="font-light text-[4.5px] tracking-[0.3em] mb-0.3">OLIVIA WILSON</div>
              <div className="text-[2px] tracking-[0.25em] text-gray-600">MARKETING MANAGER</div>
            </div>
            
            <div className="grid grid-cols-[35%_65%] gap-1">
              <div className="space-y-0.8">
                <div>
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">CONTACT</div>
                  <div className="text-[1.7px] space-y-0.3">
                    <div className="flex items-start gap-0.3">
                      <span className="text-[1.5px]">📞</span>
                      <span>+123-456-7890</span>
                    </div>
                    <div className="flex items-start gap-0.3">
                      <span className="text-[1.5px]">✉</span>
                      <span>hello@reallygreatsite.com</span>
                    </div>
                    <div className="flex items-start gap-0.3">
                      <span className="text-[1.5px]">📍</span>
                      <span>123 Anywhere St., Any City, ST 12345</span>
                    </div>
                    <div className="flex items-start gap-0.3">
                      <span className="text-[1.5px]">🌐</span>
                      <span>www.reallygreatsite.com</span>
                    </div>
                    <div className="flex items-start gap-0.3">
                      <span className="text-[1.5px]">💼</span>
                      <span>linkedin.com/in/oliviawilson</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">EDUCATION</div>
                  <div className="space-y-0.5">
                    <div>
                      <div className="text-[1.6px] text-gray-600">2029 - 2030</div>
                      <div className="font-bold text-[1.9px]">BORCELLE UNIVERSITY</div>
                      <div className="text-[1.7px]">Master of Business Management</div>
                      <div className="text-[1.6px]">• Marketing Concentration</div>
                      <div className="text-[1.6px]">• GPA: 3.9 / 4.0</div>
                      <div className="text-[1.6px]">• Thesis: Digital Marketing Transformation</div>
                    </div>
                    <div>
                      <div className="text-[1.6px] text-gray-600">2025 - 2029</div>
                      <div className="font-bold text-[1.9px]">BORCELLE UNIVERSITY</div>
                      <div className="text-[1.7px]">Bachelor of Business Management</div>
                      <div className="text-[1.6px]">• Marketing & Communications</div>
                      <div className="text-[1.6px]">• GPA: 3.8 / 4.0</div>
                      <div className="text-[1.6px]">• Summa Cum Laude</div>
                      <div className="text-[1.6px]">• Dean's List (All Semesters)</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">SKILLS</div>
                  <div className="text-[1.7px] space-y-0.2">
                    <div>• Strategic Marketing Planning</div>
                    <div>• Digital Marketing & SEO/SEM</div>
                    <div>• Project Management (PMP)</div>
                    <div>• Public Relations & Brand Management</div>
                    <div>• Team Leadership (15+ team members)</div>
                    <div>• Budget Management ($1M+)</div>
                    <div>• Data Analytics & Market Research</div>
                    <div>• Content Strategy & Creation</div>
                    <div>• Social Media Marketing</div>
                    <div>• Marketing Automation (HubSpot, Marketo)</div>
                    <div>• Google Analytics & Ads</div>
                    <div>• Adobe Creative Suite</div>
                    <div>• CRM Systems (Salesforce)</div>
                    <div>• A/B Testing & Conversion Optimization</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">LANGUAGES</div>
                  <div className="text-[1.7px] space-y-0.2">
                    <div>• English: Native / Fluent</div>
                    <div>• French: Fluent (C1)</div>
                    <div>• Spanish: Intermediate (B2)</div>
                    <div>• German: Basic (A2)</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">CERTIFICATIONS</div>
                  <div className="text-[1.7px] space-y-0.2">
                    <div>• Google Ads Certified Professional</div>
                    <div>• HubSpot Inbound Marketing</div>
                    <div>• Facebook Blueprint Certified</div>
                    <div>• PMP - Project Management Professional</div>
                    <div>• Digital Marketing Institute Certified</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-0.8">
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">PROFILE SUMMARY</div>
                  <div className="bg-gray-50 p-0.8 border-l-2 border-gray-700">
                    <div className="text-[1.7px] text-justify leading-[1.4]">
                      Dynamic and results-oriented Marketing Manager with 8+ years of progressive experience in developing and executing innovative marketing strategies across B2B and B2C sectors. Proven track record of driving brand awareness, increasing market share by 35%, and generating $5M+ in revenue growth. Expert in digital marketing, team leadership, and data-driven decision making. Successfully managed marketing budgets exceeding $1M while consistently delivering ROI improvements of 40%+. Passionate about leveraging emerging technologies and creative storytelling to build lasting customer relationships and achieve ambitious business objectives.
                    </div>
                  </div>
                </div>
                
                <div className="mb-0.8">
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">WORK EXPERIENCE</div>
                  <div className="space-y-0.6">
                    <div>
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-[2px]">Borcelle Studio</div>
                        <div className="text-[1.6px] font-bold text-gray-600">JAN 2030 - PRESENT</div>
                      </div>
                      <div className="text-[1.8px] text-gray-600 mb-0.2">Marketing Manager & Digital Strategy Lead</div>
                      <div className="text-[1.6px] leading-[1.3] space-y-0.2">
                        <div>• Lead cross-functional marketing team of 15 professionals, including content creators, designers, analysts, and digital specialists</div>
                        <div>• Developed and implemented comprehensive integrated marketing strategies that resulted in 45% increase in brand visibility and 25% growth in sales revenue ($3M+) within first year</div>
                        <div>• Manage annual marketing budget of $1.2M, optimizing spend allocation to achieve 40% improvement in ROI and 30% reduction in customer acquisition costs</div>
                        <div>• Successfully launched and managed 20+ multi-channel campaigns across digital, social media, email, content marketing, and traditional advertising channels</div>
                        <div>• Implemented marketing automation platform (HubSpot) that increased lead generation by 75%, improved lead quality by 50%, and enhanced conversion rates by 35%</div>
                        <div>• Developed data-driven content strategy resulting in 300K+ monthly website visitors, 100K+ social media followers, and 50% increase in engagement rates</div>
                        <div>• Collaborated closely with sales team to create targeted account-based marketing campaigns that generated $5M+ in new business revenue</div>
                        <div>• Established brand partnerships and influencer collaborations that expanded market reach by 60% and improved brand perception scores by 40%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-[2px]">Fauget Studio</div>
                        <div className="text-[1.6px] font-bold text-gray-600">MAR 2026 - DEC 2029</div>
                      </div>
                      <div className="text-[1.8px] text-gray-600 mb-0.2">Consumer Insights & Marketing Specialist</div>
                      <div className="text-[1.6px] leading-[1.3] space-y-0.2">
                        <div>• Conducted comprehensive market research, competitive analysis, and consumer behavior studies to identify growth opportunities and inform strategic decisions</div>
                        <div>• Analyzed consumer data using advanced analytics tools (Google Analytics, Tableau, SPSS) to provide actionable insights to C-level executives</div>
                        <div>• Developed sophisticated customer segmentation strategies that improved targeting precision and increased campaign effectiveness by 45%</div>
                        <div>• Created detailed quarterly reports and executive presentations on market trends, consumer preferences, and competitive landscape</div>
                        <div>• Managed social media presence across 6 platforms (LinkedIn, Instagram, Facebook, Twitter, TikTok, YouTube), growing follower base by 200% and engagement by 150%</div>
                        <div>• Designed and executed A/B testing programs that optimized email campaigns, landing pages, and ad creative, improving conversion rates by 30%</div>
                        <div>• Collaborated with product development team to incorporate consumer insights into new product launches, contributing to successful introduction of 5 new products</div>
                        <div>• Managed relationships with external agencies, vendors, and freelancers to ensure brand consistency and quality across all marketing materials</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-[2px]">Studio Shodwe</div>
                        <div className="text-[1.6px] font-bold text-gray-600">JUN 2024 - FEB 2026</div>
                      </div>
                      <div className="text-[1.8px] text-gray-600 mb-0.2">Marketing Coordinator & Campaign Manager</div>
                      <div className="text-[1.6px] leading-[1.3] space-y-0.2">
                        <div>• Developed and executed targeted digital marketing campaigns that increased qualified lead generation by 60% and improved lead-to-customer conversion by 25%</div>
                        <div>• Collaborated with sales team to create effective sales enablement materials, presentations, case studies, and promotional content</div>
                        <div>• Managed email marketing campaigns with average open rates of 32% and click-through rates of 5.8%, exceeding industry benchmarks by 40%</div>
                        <div>• Coordinated trade show participation and event marketing activities, generating 500+ qualified leads annually</div>
                        <div>• Implemented SEO best practices that improved organic search rankings, resulting in 80% increase in organic traffic</div>
                        <div>• Created and managed content calendar for blog, social media, and email campaigns, producing 100+ pieces of high-quality content annually</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-[2px]">Creative Marketing Agency</div>
                        <div className="text-[1.6px] font-bold text-gray-600">JAN 2022 - MAY 2024</div>
                      </div>
                      <div className="text-[1.8px] text-gray-600 mb-0.2">Junior Marketing Associate</div>
                      <div className="text-[1.6px] leading-[1.3] space-y-0.2">
                        <div>• Assisted in planning and execution of integrated marketing campaigns for 20+ clients across various industries including tech, retail, and healthcare</div>
                        <div>• Conducted market research and competitive analysis to support campaign development and strategic planning</div>
                        <div>• Managed social media accounts for multiple clients, creating engaging content and monitoring performance metrics</div>
                        <div>• Coordinated with creative team to develop marketing collateral including brochures, presentations, and digital assets</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-[2.2px] mb-0.3 tracking-wide">AWARDS & ACHIEVEMENTS</div>
                  <div className="text-[1.6px] space-y-0.2 leading-[1.3]">
                    <div>• Marketing Campaign of the Year Award 2023 - American Marketing Association</div>
                    <div>• Best Digital Marketing Strategy Award 2022 - Digital Marketing Excellence Awards</div>
                    <div>• Featured speaker at Digital Marketing Summit 2023 and Social Media World Conference 2024</div>
                    <div>• Published article "The Future of AI in Digital Marketing" in Marketing Today Magazine (March 2023)</div>
                    <div>• Increased company revenue by $5M+ through strategic marketing initiatives and campaign optimization</div>
                    <div>• Successfully grew brand social media following from 10K to 100K+ followers in 18 months</div>
                    <div>• Mentor for Junior Marketers Program - Marketing Professionals Association</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
                    <div className="text-4xl mb-2">CV</div>
            <p className="text-xs text-gray-500">Preview</p>
          </div>
        </div>
      );
  }
};

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      setTemplates(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching templates:', err);
      // Use default templates on error
      setTemplates(defaultTemplates);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchTemplates} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose a template</h3>
        <p className="text-sm text-gray-600">
          Select the design that best matches your style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'ring-2 ring-blue-500 shadow-lg'
                : ''
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                {selectedTemplate === template.id && (
                  <div className="bg-blue-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Preview visuel du template */}
              <div className="aspect-[210/297] bg-white rounded border-2 border-gray-200 overflow-hidden shadow-sm">
                {getTemplatePreview(template.id)}
              </div>
              
              {/* Features */}
              {template.features && template.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;

