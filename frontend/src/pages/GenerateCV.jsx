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
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [analyzingMatch, setAnalyzingMatch] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: t('generate.steps.template.title'), description: t('generate.steps.template.description') },
    { number: 2, title: t('generate.steps.cv.title'), description: t('generate.steps.cv.description') },
    { number: 3, title: t('generate.steps.generation.title'), description: t('generate.steps.generation.description') },
  ];

  const handleFileUpload = async (file) => {
    if (!file) {
      setUploadedFile(null);
      setCvText('');
      return;
    }

    setError('');
    setExtracting(true);
    setUploadedFile(file);

    try {
      const response = await uploadService.extractText(file);
      
      if (response.success && response.data.extractedText) {
        setCvText(response.data.extractedText);
        setUploadedFile(prevFile => ({
          ...prevFile,
          extractedText: response.data.extractedText,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('generate.errors.extractionError'));
      setUploadedFile(null);
      setCvText('');
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
    setCurrentStep(3);

    try {
      // First, analyze the original match score
      let originalScore = 0;

      try {
        const matchResponse = await cvService.analyzeMatch(cvText, jobDescription);
        if (matchResponse.success) {
          originalScore = matchResponse.data.matchScore || 0;
        }
      } catch (matchErr) {
        console.log('Match analysis skipped');
      }

      // Then generate the optimized CV
      const response = await cvService.generate(cvText, jobDescription, selectedTemplate);
      
      if (response.success) {
        setSuccess(true);
        setGeneratedCV(response.data);
        
        // Analyze the optimized CV to get new match score
        let newMatchAnalysis = null;
        try {
          const optimizedMatchResponse = await cvService.analyzeMatch(response.data.optimizedCVText, jobDescription);
          if (optimizedMatchResponse.success) {
            newMatchAnalysis = optimizedMatchResponse.data;
          }
        } catch (matchErr) {
          console.log('New match analysis skipped');
        }
        
        // Navigate to preview page with all necessary data
        setTimeout(() => {
          navigate('/preview', {
            state: {
              generatedCV: response.data,
              originalMatchScore: originalScore,
              matchAnalysis: newMatchAnalysis,
              cvText,
              jobDescription,
            },
          });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('generate.errors.generationError'));
      setCurrentStep(2);
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

  const handleCheckMatch = async () => {
    setError('');
    setAnalyzingMatch(true);

    if (cvText.trim().length < 50) {
      setError(t('generate.errors.cvTooShort'));
      setAnalyzingMatch(false);
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError(t('generate.errors.jobTooShort'));
      setAnalyzingMatch(false);
      return;
    }

    try {
      const response = await cvService.analyzeMatch(cvText, jobDescription);
      if (response.success) {
        setMatchAnalysis(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('generate.errors.analysisError'));
    } finally {
      setAnalyzingMatch(false);
    }
  };

  const canGoNext = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return uploadedFile && cvText.length >= 50 && jobDescription.length >= 20;
    return false;
  };

  const goNext = () => {
    if (currentStep < 2 && canGoNext()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && canGoNext()) {
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

        {/* Step 2: CV Upload & Job Description */}
        {currentStep === 2 && (
          <Card className="animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-purple-600" />
                {t('generate.step2.title')}
              </CardTitle>
              <CardDescription>
                {t('generate.step2.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Resume Upload Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700">{t('generate.resumeSource')}</h3>
                  <InputFile
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    onFileChange={handleFileUpload}
                    value={uploadedFile}
                    disabled={extracting || loading || analyzingMatch}
                  />
                  {extracting && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{t('generate.step2.extracting')}</span>
                    </div>
                  )}
                  {uploadedFile && uploadedFile.extractedText && (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 text-sm">
                        {t('generate.step2.extracted', { count: uploadedFile.extractedText.length })}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Job Description Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700">{t('generate.jobDescription')}</h3>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={t('generate.step3.placeholder')}
                    rows={12}
                    className="text-sm resize-none"
                    disabled={loading || analyzingMatch}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('generate.step3.charCount', { count: jobDescription.length })}
                  </p>
                </div>
              </div>

              {/* Match Analysis Section */}
              {matchAnalysis && (
                <div className="mt-8 space-y-6 border-t pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-600" />
                          {t('generate.resumeMatchAnalysis')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {matchAnalysis.analysis}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">{matchAnalysis.matchScore}%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{t('generate.matchScore')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Matched Keywords */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('generate.matchedKeywords')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchAnalysis.matchedKeywords && matchAnalysis.matchedKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {t('generate.missingKeywords')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchAnalysis.missingKeywords && matchAnalysis.missingKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generation */}
        {currentStep === 3 && (
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
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  {/* Modern Animated Spinner */}
                  <div className="relative w-20 h-20">
                    <style>{`
                      @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                      @keyframes pulse-ring {
                        0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
                        70% { box-shadow: 0 0 0 20px rgba(37, 99, 235, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
                      }
                      .spinner-ring {
                        animation: spin-slow 2s linear infinite;
                      }
                      .spinner-pulse {
                        animation: pulse-ring 2s infinite;
                      }
                    `}</style>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 spinner-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 spinner-ring"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-gray-900">{t('generate.step4.optimizing')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('generate.step4.duration')}
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-gray-700 font-medium">{t('generate.step4.analyzing')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-gray-700 font-medium">{t('generate.step4.extracting')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0">
                        <div className="relative w-5 h-5">
                          <style>{`
                            @keyframes dot-pulse {
                              0%, 100% { opacity: 0.6; }
                              50% { opacity: 1; }
                            }
                            .dot { animation: dot-pulse 1.4s infinite; }
                            .dot:nth-child(1) { animation-delay: 0s; }
                            .dot:nth-child(2) { animation-delay: 0.2s; }
                            .dot:nth-child(3) { animation-delay: 0.4s; }
                          `}</style>
                          <span className="absolute w-1.5 h-1.5 bg-blue-600 rounded-full left-0 top-1.5 dot"></span>
                          <span className="absolute w-1.5 h-1.5 bg-blue-600 rounded-full left-2 top-1.5 dot"></span>
                          <span className="absolute w-1.5 h-1.5 bg-blue-600 rounded-full left-4 top-1.5 dot"></span>
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium">{t('generate.step4.generating')}</span>
                    </div>
                  </div>

                  {/* Modern Progress Bar */}
                  <div className="w-full max-w-md space-y-2">
                    <style>{`
                      @keyframes progress-slide {
                        0% { left: -100%; }
                        50% { left: 100%; }
                        100% { left: 100%; }
                      }
                      .progress-bar {
                        overflow: hidden;
                      }
                      .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #2563eb, #3b82f6, #2563eb);
                        animation: progress-slide 2s infinite;
                        background-size: 200% 100%;
                      }
                    `}</style>
                    <div className="h-1.5 bg-gray-200 rounded-full progress-bar">
                      <div className="progress-fill w-full"></div>
                    </div>
                    <p className="text-xs text-center text-gray-500">Processing your resume...</p>
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
      {currentStep === 2 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                size="lg"
                disabled={loading || analyzingMatch}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('common.previous')}
              </Button>

              <div className="flex gap-4">
                <Button
                  onClick={handleCheckMatch}
                  variant="outline"
                  size="lg"
                  disabled={!canGoNext() || loading || analyzingMatch}
                  className="gap-2"
                >
                  {analyzingMatch ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('generate.analyzing')}
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      {t('generate.checkMatchScore')}
                    </>
                  )}
                </Button>

                <Button
                  onClick={goNext}
                  size="lg"
                  disabled={!canGoNext() || loading || analyzingMatch}
                  className="gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  {t('generate.fixAndGenerate')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep < 2 && currentStep >= 1 && (
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
                {t('generate.navigation.stepOf', { current: currentStep, total: 2 })}
              </div>

              <Button
                onClick={goNext}
                size="lg"
                disabled={!canGoNext() || loading}
                className="gap-2"
              >
                {t('common.next')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenerateCV;
