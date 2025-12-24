// Sample CV data for template previews
export const sampleCVData = {
  fullName: 'Chloe Anne Bouchard',
  jobTitle: 'Interior Designer',
  email: 'example@gmail.com',
  phone: '(412) 479-6342',
  location: 'Market Street 1, Washington, USA',
  summary: 'Motivation, ambition, and determination are my foundation for success. My philosophy is that innovative new techniques allow businesses to evolve and grow. Experienced and driven Financial professional skilled at managing multi-million dollar budgets while providing analysis and account support to multiple departments. Worked to reduce business expenses and develop logical and advanced resource creating quarterly accruals based on trends and forecasted expenses.',
  
  experience: [
    {
      company: 'Penfold, Procter & Gamble',
      position: 'Senior Designer',
      startDate: '2018',
      endDate: 'Present',
      description: 'Coordination, and determination are my foundation for success. My philosophy is that innovative new techniques allow businesses to evolve and grow.'
    },
    {
      company: 'Interior Studio',
      position: 'Interior Designer',
      startDate: '2015',
      endDate: '2018',
      description: 'Achieved reputation as a major contributor through delegation in a collaborative team player.'
    }
  ],
  
  education: [
    {
      school: 'University of Design',
      degree: 'Bachelor of Arts',
      field: 'Interior Design',
      year: '2015'
    },
    {
      school: 'Art Institute',
      degree: 'High School Diploma',
      year: '2011'
    }
  ],
  
  skills: ['UI Design', 'UX Research', 'Prototyping', 'Adobe Creative Suite', 'Figma', 'User Testing'],
  
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'French', level: 'Fluent' },
    { name: 'Spanish', level: 'Basic' }
  ]
};

// Template HTML generators
const templates = {
  'modern-professional': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { display: flex; height: 100vh; }
        .sidebar { width: 35%; background: #f8f9fa; padding: 40px 30px; border-right: 3px solid #e0e0e0; }
        .main { width: 65%; padding: 40px; }
        h1 { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .job-title { font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px solid #333; }
        h2 { font-size: 14px; font-weight: bold; text-transform: uppercase; margin: 20px 0 10px; border-bottom: 3px solid #333; padding-bottom: 8px; }
        h3 { font-size: 14px; font-weight: bold; margin-top: 15px; }
        .section { margin-bottom: 20px; }
        .item { margin-bottom: 12px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="sidebar">
          <h2>Contact</h2>
          <div class="item">${data.email}</div>
          <div class="item">${data.phone}</div>
          <div class="item">${data.location}</div>
          
          <h2>Skills</h2>
          ${data.skills.map(s => `<div class="item">• ${s}</div>`).join('')}
          
          <h2>Languages</h2>
          ${data.languages.map(l => `<div class="item">${l.name} - ${l.level}</div>`).join('')}
        </div>
        <div class="main">
          <h1>${data.fullName}</h1>
          <div class="job-title">${data.jobTitle}</div>
          
          <h2>About</h2>
          <div class="section" style="font-size: 13px; line-height: 1.5;">${data.summary.substring(0, 150)}...</div>
          
          <h2>Experience</h2>
          ${data.experience.map(exp => `
            <div class="section">
              <h3>${exp.position}</h3>
              <div style="font-size: 12px; color: #666;">${exp.company} | ${exp.startDate} - ${exp.endDate}</div>
              <div style="font-size: 13px; margin-top: 5px;">${exp.description.substring(0, 100)}...</div>
            </div>
          `).join('')}
          
          <h2>Education</h2>
          ${data.education.map(edu => `
            <div class="section">
              <h3>${edu.degree}</h3>
              <div style="font-size: 12px; color: #666;">${edu.school} | ${edu.year}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `,
  
  'clean-minimal': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; line-height: 1.8; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 32px; text-align: center; margin-bottom: 5px; }
        .job-title { text-align: center; color: #666; margin-bottom: 30px; font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        h2 { font-size: 14px; text-transform: uppercase; margin: 25px 0 15px; border-bottom: 2px solid #333; padding-bottom: 8px; }
        .section { margin-bottom: 15px; }
        h3 { font-size: 14px; font-weight: bold; margin-bottom: 3px; }
        .meta { font-size: 12px; color: #666; }
        .contact { text-align: center; font-size: 12px; margin-bottom: 30px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${data.fullName}</h1>
      <div class="job-title">${data.jobTitle}</div>
      <div class="contact">${data.email} | ${data.phone} | ${data.location}</div>
      
      <h2>Professional Summary</h2>
      <div class="section" style="font-size: 13px;">${data.summary.substring(0, 200)}...</div>
      
      <h2>Experience</h2>
      ${data.experience.map(exp => `
        <div class="section">
          <h3>${exp.position}</h3>
          <div class="meta">${exp.company} | ${exp.startDate} - ${exp.endDate}</div>
          <div style="font-size: 12px; margin-top: 5px;">${exp.description.substring(0, 100)}...</div>
        </div>
      `).join('')}
      
      <h2>Education</h2>
      ${data.education.map(edu => `
        <div class="section">
          <h3>${edu.degree} in ${edu.field}</h3>
          <div class="meta">${edu.school} | ${edu.year}</div>
        </div>
      `).join('')}
      
      <h2>Skills</h2>
      <div style="font-size: 12px;">${data.skills.join(' • ')}</div>
    </body>
    </html>
  `,
  
  'professional-classic': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; padding: 30px; max-width: 900px; }
        .header { border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 25px; }
        h1 { font-size: 26px; margin-bottom: 3px; }
        .job-title { font-size: 14px; color: #555; margin-bottom: 8px; }
        .contact { font-size: 11px; color: #666; }
        h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 20px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #0066cc; }
        .section { margin-bottom: 12px; display: grid; grid-template-columns: 150px 1fr; gap: 15px; font-size: 12px; }
        .section h3 { font-weight: bold; grid-column: 1 / -1; margin: 5px 0; }
        .label { font-weight: bold; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; }
        .skill-tag { background: #f0f0f0; padding: 3px 8px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.fullName}</h1>
        <div class="job-title">${data.jobTitle}</div>
        <div class="contact">${data.email} | ${data.phone} | ${data.location}</div>
      </div>
      
      <h2>Professional Summary</h2>
      <div style="font-size: 12px; line-height: 1.5;">${data.summary.substring(0, 180)}...</div>
      
      <h2>Professional Experience</h2>
      ${data.experience.map(exp => `
        <div class="section">
          <h3>${exp.position} - ${exp.company}</h3>
          <div class="label">${exp.startDate} - ${exp.endDate}</div>
          <div>${exp.description.substring(0, 100)}...</div>
        </div>
      `).join('')}
      
      <h2>Education</h2>
      ${data.education.map(edu => `
        <div class="section">
          <h3>${edu.degree} in ${edu.field}</h3>
          <div class="label">${edu.school}</div>
          <div>${edu.year}</div>
        </div>
      `).join('')}
      
      <h2>Skills</h2>
      <div class="skills">
        ${data.skills.map(s => `<div class="skill-tag">${s}</div>`).join('')}
      </div>
    </body>
    </html>
  `,
  
  'legal-classic': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #000; padding: 40px 60px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #000; }
        h1 { font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 8px; }
        .job-title { font-size: 13px; margin-bottom: 12px; }
        .contact { font-size: 10px; line-height: 1.8; color: #000; }
        h2 { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin: 25px 0 15px; }
        .section { margin-bottom: 15px; }
        h3 { font-size: 11px; font-weight: bold; font-style: italic; margin-bottom: 3px; }
        .meta { font-size: 10px; color: #000; }
        .item { margin-bottom: 8px; padding-left: 12px; position: relative; font-size: 10px; }
        .item::before { content: "•"; position: absolute; left: 0; }
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 30px; margin-top: 10px; }
        .skill-item { font-size: 10px; margin-bottom: 6px; display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.fullName}</h1>
        <div class="job-title">${data.jobTitle}</div>
        <div class="contact">
          <div>${data.email}</div>
          <div>${data.phone}</div>
          <div>${data.location}</div>
        </div>
      </div>
      
      <h2>Professional Summary</h2>
      <div class="section" style="font-size: 10px; line-height: 1.7;">${data.summary.substring(0, 150)}...</div>
      
      <h2>Professional Experience</h2>
      ${data.experience.map(exp => `
        <div class="section">
          <h3>${exp.company}</h3>
          <div class="meta">${exp.position} | ${exp.startDate} - ${exp.endDate}</div>
          <div style="font-size: 10px; margin-top: 5px;">${exp.description.substring(0, 90)}...</div>
        </div>
      `).join('')}
      
      <h2>Education</h2>
      ${data.education.map(edu => `
        <div class="section">
          <h3>${edu.school}</h3>
          <div class="meta">${edu.degree} in ${edu.field} | ${edu.year}</div>
        </div>
      `).join('')}
      
      <h2>Skills</h2>
      <div class="skills-grid">
        ${data.skills.map(s => `<div class="skill-item"><span>${s}</span></div>`).join('')}
      </div>
    </body>
    </html>
  `
};

export const generateTemplatePreview = (templateId, data = sampleCVData) => {
  const generator = templates[templateId];
  if (!generator) return null;
  return generator(data);
};
