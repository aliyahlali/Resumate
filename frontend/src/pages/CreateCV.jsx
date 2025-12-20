import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cvService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle, Download, FileText, Sparkles } from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';

const CreateCV = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Main state
  const [selectedTemplate, setSelectedTemplate] = useState('modern-professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);
  
  // CV data
  const [cvData, setCvData] = useState({
    name: '',
    jobTitle: '',
    contact: {
      email: '',
      phone: '',
      address: '',
      website: '',
    },
    profile: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
    references: [],
  });

  // State for dynamic forms
  const [newExperience, setNewExperience] = useState({ position: '', company: '', location: '', period: '', description: '' });
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', period: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newProject, setNewProject] = useState({ name: '', period: '', description: '' });
  const [newCertification, setNewCertification] = useState('');
  const [newReference, setNewReference] = useState({ name: '', title: '', phone: '', email: '' });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCvData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCvData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addExperience = () => {
    if (newExperience.position && newExperience.company) {
      setCvData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }],
      }));
      setNewExperience({ position: '', company: '', location: '', period: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setCvData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }],
      }));
      setNewEducation({ institution: '', degree: '', period: '' });
    }
  };

  const removeEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setCvData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    if (newProject.name) {
      setCvData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject }],
      }));
      setNewProject({ name: '', period: '', description: '' });
    }
  };

  const removeProject = (index) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCvData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const addReference = () => {
    if (newReference.name) {
      setCvData(prev => ({
        ...prev,
        references: [...prev.references, { ...newReference }],
      }));
      setNewReference({ name: '', title: '', phone: '', email: '' });
    }
  };

  const removeReference = (index) => {
    setCvData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    setGeneratedCV(null);

    if (!cvData.name.trim()) {
      setError(t('createCV.errors.nameRequired'));
      return;
    }

    setLoading(true);

    try {
      const response = await cvService.createFromScratch(cvData, selectedTemplate);
      
      if (response.success) {
        setSuccess(true);
        setGeneratedCV(response.data);
        
        setTimeout(() => {
          navigate('/history');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('createCV.errors.generationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedCV?.cvHTML) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatedCV.cvHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('createCV.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('createCV.subtitle')}
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <Alert className="border-green-500 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {t('createCV.success.redirecting')}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !success && (
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                {t('createCV.template.title')}
              </CardTitle>
              <CardDescription>
                {t('createCV.template.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.personalInfo.title')}</CardTitle>
              <CardDescription>{t('createCV.personalInfo.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('createCV.personalInfo.name')} *</Label>
                  <Input
                    id="name"
                    value={cvData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('createCV.personalInfo.namePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">{t('createCV.personalInfo.jobTitle')}</Label>
                  <Input
                    id="jobTitle"
                    value={cvData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder={t('createCV.personalInfo.jobTitlePlaceholder')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">{t('createCV.personalInfo.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cvData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder={t('createCV.personalInfo.emailPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('createCV.personalInfo.phone')}</Label>
                  <Input
                    id="phone"
                    value={cvData.contact.phone}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder={t('createCV.personalInfo.phonePlaceholder')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">{t('createCV.personalInfo.address')}</Label>
                  <Input
                    id="address"
                    value={cvData.contact.address}
                    onChange={(e) => handleInputChange('contact.address', e.target.value)}
                    placeholder={t('createCV.personalInfo.addressPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="website">{t('createCV.personalInfo.website')}</Label>
                  <Input
                    id="website"
                    value={cvData.contact.website}
                    onChange={(e) => handleInputChange('contact.website', e.target.value)}
                    placeholder={t('createCV.personalInfo.websitePlaceholder')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.profile.title')}</CardTitle>
              <CardDescription>{t('createCV.profile.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={cvData.profile}
                onChange={(e) => handleInputChange('profile', e.target.value)}
                placeholder={t('createCV.profile.placeholder')}
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.experience.title')}</CardTitle>
              <CardDescription>{t('createCV.experience.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company} {exp.location && `- ${exp.location}`}</p>
                      {exp.period && <p className="text-xs text-muted-foreground">{exp.period}</p>}
                      {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={newExperience.position}
                    onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                    placeholder={t('createCV.experience.positionPlaceholder')}
                  />
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    placeholder={t('createCV.experience.companyPlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    placeholder={t('createCV.experience.locationPlaceholder')}
                  />
                  <Input
                    value={newExperience.period}
                    onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                    placeholder={t('createCV.experience.periodPlaceholder')}
                  />
                </div>
                <Textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  placeholder={t('createCV.experience.descriptionPlaceholder')}
                  rows={3}
                />
                <Button onClick={addExperience} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createCV.experience.add')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.education.title')}</CardTitle>
              <CardDescription>{t('createCV.education.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    {edu.period && <p className="text-xs text-muted-foreground">{edu.period}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Separator />
              <div className="space-y-3">
                <Input
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  placeholder={t('createCV.education.institutionPlaceholder')}
                />
                <Input
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  placeholder={t('createCV.education.degreePlaceholder')}
                />
                <Input
                  value={newEducation.period}
                  onChange={(e) => setNewEducation({ ...newEducation, period: e.target.value })}
                  placeholder={t('createCV.education.periodPlaceholder')}
                />
                <Button onClick={addEducation} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createCV.education.add')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.skills.title')}</CardTitle>
              <CardDescription>{t('createCV.skills.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(index)} className="text-blue-600 hover:text-blue-800">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder={t('createCV.skills.placeholder')}
                />
                <Button onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.languages.title')}</CardTitle>
              <CardDescription>{t('createCV.languages.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cvData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <span>{lang}</span>
                      <button onClick={() => removeLanguage(index)} className="text-green-600 hover:text-green-800">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  placeholder={t('createCV.languages.placeholder')}
                />
                <Button onClick={addLanguage} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.projects.title')}</CardTitle>
              <CardDescription>{t('createCV.projects.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.projects.map((proj, index) => (
                <div key={index} className="p-4 border rounded-lg flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{proj.name}</h4>
                    {proj.period && <p className="text-xs text-muted-foreground">{proj.period}</p>}
                    {proj.description && <p className="text-sm mt-2">{proj.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeProject(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Separator />
              <div className="space-y-3">
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder={t('createCV.projects.namePlaceholder')}
                />
                <Input
                  value={newProject.period}
                  onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
                  placeholder={t('createCV.projects.periodPlaceholder')}
                />
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder={t('createCV.projects.descriptionPlaceholder')}
                  rows={3}
                />
                <Button onClick={addProject} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createCV.projects.add')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.certifications.title')}</CardTitle>
              <CardDescription>{t('createCV.certifications.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.certifications.length > 0 && (
                <div className="space-y-2">
                  {cvData.certifications.map((cert, index) => (
                    <div key={index} className="p-3 border rounded-lg flex justify-between items-center">
                      <span>{cert}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  placeholder={t('createCV.certifications.placeholder')}
                />
                <Button onClick={addCertification} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* References */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCV.references.title')}</CardTitle>
              <CardDescription>{t('createCV.references.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.references.map((ref, index) => (
                <div key={index} className="p-4 border rounded-lg flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{ref.name}</h4>
                    <p className="text-sm text-muted-foreground">{ref.title}</p>
                    {ref.phone && <p className="text-xs text-muted-foreground">{t('createCV.references.phone')}: {ref.phone}</p>}
                    {ref.email && <p className="text-xs text-muted-foreground">{t('createCV.references.email')}: {ref.email}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeReference(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Separator />
              <div className="space-y-3">
                <Input
                  value={newReference.name}
                  onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                  placeholder={t('createCV.references.namePlaceholder')}
                />
                <Input
                  value={newReference.title}
                  onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                  placeholder={t('createCV.references.titlePlaceholder')}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={newReference.phone}
                    onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
                    placeholder={t('createCV.references.phonePlaceholder')}
                  />
                  <Input
                    value={newReference.email}
                    onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                    placeholder={t('createCV.references.emailPlaceholder')}
                    type="email"
                  />
                </div>
                <Button onClick={addReference} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createCV.references.add')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleSubmit} size="lg" className="w-full" disabled={!cvData.name.trim() || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('createCV.generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t('createCV.generate')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">{t('createCV.loading.title')}</p>
                <p className="text-sm text-muted-foreground">{t('createCV.loading.subtitle')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {success && generatedCV && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600">{t('createCV.success.title')}</h3>
              <p className="text-muted-foreground">{t('createCV.success.message')}</p>
            </div>

            <Separator />

            <div className="flex gap-4 justify-center">
              <Button onClick={handleDownloadPDF} size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                {t('createCV.success.downloadPDF')}
              </Button>
              <Button onClick={() => navigate('/history')} variant="outline" size="lg">
                {t('createCV.success.viewHistory')}
              </Button>
            </div>

            <Separator />

            <div className="bg-white p-8 rounded-lg border max-h-[600px] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: generatedCV.cvHTML }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateCV;

