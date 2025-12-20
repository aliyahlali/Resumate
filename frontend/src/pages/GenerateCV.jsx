import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cvService, uploadService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InputFile } from '@/components/ui/input-file';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle, Download, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';

const GenerateCV = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-professional');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: t('generate.steps.template.title'), description: t('generate.steps.template.description') },
    { number: 2, title: t('generate.steps.cv.title'), description: t('generate.steps.cv.description') },
    { number: 3, title: t('generate.steps.job.title'), description: t('generate.steps.job.description') },
    { number: 4, title: t('generate.steps.generation.title'), description: t('generate.steps.generation.description') },
  ];

  const handleFileUpload = async (file) => {
    if (!file) {
      setUploadedFile(null);
      return;
    }

    setExtracting(true);
    setError('');
    setUploadedFile(file);

    try {
      const response = await uploadService.extractText(file);
      
      if (response.success) {
        setCvText(response.data.extractedText);
        setUploadedFile({
          ...file,
          extractedText: response.data.extractedText,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || t('generate.errors.extractionError'));
      setUploadedFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    setGeneratedCV(null);

    if (cvText.trim().length < 50) {
      setError(t('generate.errors.cvTooShort'));
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError(t('generate.errors.jobTooShort'));
      return;
    }

    setLoading(true);
    setCurrentStep(4);

    try {
      const response = await cvService.generate(cvText, jobDescription, selectedTemplate);
      
      if (response.success) {
        setSuccess(true);
        setGeneratedCV(response.data);
        
        setTimeout(() => {
          navigate('/history');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('generate.errors.generationError'));
      setCurrentStep(3);
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

  const canGoNext = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return cvText.length >= 50;
    if (currentStep === 3) return jobDescription.length >= 20;
    return false;
  };

  const goNext = () => {
    if (currentStep < 3 && canGoNext()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && canGoNext()) {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('generate.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('generate.subtitle')}
        </p>
      </div>

      {/* Stepper */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      currentStep === step.number
                        ? 'bg-blue-600 text-white scale-110 shadow-lg'
                        : currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <div className={`font-semibold text-sm ${currentStep === step.number ? 'text-blue-600' : 'text-gray-600'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden md:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {success && (
        <Alert className="border-green-500 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {t('generate.step4.redirecting')}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">
        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <Card className="animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                {t('generate.step1.title')}
              </CardTitle>
              <CardDescription>
                {t('generate.step1.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 2: CV Upload */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6 text-purple-600" />
                  {t('generate.step2a.title')}
                </CardTitle>
                <CardDescription>
                  {t('generate.step2a.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InputFile
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  onFileChange={handleFileUpload}
                  value={uploadedFile}
                  disabled={extracting || loading}
                />
                {extracting && (
                  <div className="mt-4 flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{t('generate.step2a.extracting')}</span>
                  </div>
                )}
                {uploadedFile && uploadedFile.extractedText && (
                  <Alert className="mt-4 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {t('generate.step2a.extracted', { count: uploadedFile.extractedText.length })}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  {t('generate.step2b.title')}
                  <span className="text-destructive">{t('generate.step2b.required')}</span>
                </CardTitle>
                <CardDescription>
                  {t('generate.step2b.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder={t('generate.step2b.placeholder')}
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {t('generate.step2b.charCount', { count: cvText.length })}
                  </p>
                  {cvText.length >= 50 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t('generate.step2b.ready')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Job Description */}
        {currentStep === 3 && (
          <Card className="animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-pink-600" />
                {t('generate.step3.title')}
                <span className="text-destructive">{t('generate.step3.required')}</span>
              </CardTitle>
              <CardDescription>
                {t('generate.step3.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={t('generate.step3.placeholder')}
                rows={18}
                className="text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {t('generate.step3.charCount', { count: jobDescription.length })}
                </p>
                {jobDescription.length >= 20 && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t('generate.step3.ready')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Generation */}
        {currentStep === 4 && (
          <Card className="animate-in fade-in duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Sparkles className="h-8 w-8 text-yellow-500" />
                {t('generate.step4.title')}
              </CardTitle>
              <CardDescription>
                {t('generate.step4.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold">{t('generate.step4.optimizing')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('generate.step4.duration')}
                    </p>
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{t('generate.step4.analyzing')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{t('generate.step4.extracting')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span>{t('generate.step4.generating')}</span>
                    </div>
                  </div>
                </div>
              )}

              {success && generatedCV && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600">{t('generate.step4.success')}</h3>
                    <p className="text-muted-foreground">
                      {t('generate.step4.successMessage')}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleDownloadPDF} size="lg" className="gap-2">
                      <Download className="h-5 w-5" />
                      {t('generate.step4.downloadPDF')}
                    </Button>
                    <Button onClick={() => navigate('/history')} variant="outline" size="lg">
                      {t('generate.step4.viewHistory')}
                    </Button>
                  </div>

                  <Separator />

                  <div className="bg-white p-8 rounded-lg border max-h-[600px] overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: generatedCV.cvHTML }} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                onClick={goBack}
                variant="outline"
                size="lg"
                disabled={currentStep === 1 || loading}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('common.previous')}
              </Button>

              <div className="text-sm text-muted-foreground">
                {t('generate.navigation.stepOf', { current: currentStep, total: 3 })}
              </div>

              <Button
                onClick={goNext}
                size="lg"
                disabled={!canGoNext() || loading}
                className="gap-2"
              >
                {currentStep === 3 ? (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {t('generate.navigation.generateCV')}
                  </>
                ) : (
                  <>
                    {t('common.next')}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenerateCV;
