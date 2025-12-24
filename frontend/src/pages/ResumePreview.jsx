import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cvService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Printer, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const ResumePreview = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    generatedCV,
    originalMatchScore = 0,
    matchAnalysis,
    cvText,
    jobDescription,
  } = location.state || {};

  useEffect(() => {
    if (!generatedCV) {
      navigate('/generate');
    }
  }, [generatedCV, navigate]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToHistory = async () => {
    setLoading(true);
    try {
      // CV is already saved to history during generation
      // Just navigate to history
      navigate('/history');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!generatedCV) {
    return null;
  }

  const newMatchScore = matchAnalysis?.matchScore || 0;
  const scoreImprovement = newMatchScore - originalMatchScore;
  const matchedKeywords = matchAnalysis?.matchedKeywords || [];
  const missingKeywords = matchAnalysis?.missingKeywords || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/generate')}
              variant="ghost"
              size="lg"
              className="gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              {t('common.back') || 'Back'}
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {t('preview.title') || 'Your Tailored Resume'}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('preview.subtitle') || 'Optimized for maximum impact'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Printer className="h-5 w-5" />
              {t('preview.print') || 'Print'}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              className="gap-2"
            >
              <Download className="h-5 w-5" />
              {t('preview.download') || 'Download PDF'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Resume Preview */}
          <div className="col-span-2 space-y-6">
            {/* Resume Preview */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-white p-8 min-h-[800px] overflow-y-auto border rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: generatedCV.cvHTML }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* ATS Score Improvement */}
            {matchAnalysis && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    {t('preview.atsScore') || 'ATS Score Improvement'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score Comparison */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t('preview.original') || 'Original'}
                      </span>
                      <span className="text-3xl font-bold text-orange-500">
                        {originalMatchScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-blue-600">→</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t('preview.newMatch') || 'New Match'}
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        {newMatchScore}%
                      </span>
                    </div>
                    {scoreImprovement > 0 && (
                      <div className="pt-2 text-center bg-green-100 rounded-lg py-2">
                        <div className="text-sm font-semibold text-green-700">
                          +{scoreImprovement}% {t('preview.improvement') || 'Improvement'}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Matched Keywords */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-sm text-gray-900">
                        {t('preview.matchedKeywords') || 'Matched Keywords'}
                      </h4>
                      <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {matchedKeywords.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchedKeywords.slice(0, 6).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium whitespace-nowrap"
                        >
                          {keyword}
                        </span>
                      ))}
                      {matchedKeywords.length > 6 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          +{matchedKeywords.length - 6} {t('preview.more') || 'more'}
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Missing Keywords */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-sm text-gray-900">
                        {t('preview.stillMissing') || 'Still Missing'}
                      </h4>
                      <span className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        {missingKeywords.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.slice(0, 5).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium whitespace-nowrap"
                        >
                          {keyword}
                        </span>
                      ))}
                      {missingKeywords.length > 5 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                          +{missingKeywords.length - 5} {t('preview.more') || 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  onClick={handleSaveToHistory}
                  className="w-full"
                  disabled={loading}
                >
                  {t('preview.viewHistory') || 'View All Resumes'}
                </Button>
                <Button
                  onClick={() => navigate('/generate')}
                  variant="outline"
                  className="w-full"
                >
                  {t('preview.createNew') || 'Create Another'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .col-span-2,
          .space-y-6 > :nth-child(1),
          button,
          .flex.items-center.justify-between,
          .space-y-6 > div:nth-child(2) {
            display: none !important;
          }
          .bg-white {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
