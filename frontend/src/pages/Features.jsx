import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  BarChart3, 
  FileText, 
  Database, 
  History, 
  Download, 
  Zap,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mainFeatures = [
    {
      id: 1,
      icon: Sparkles,
      title: t('features.personalization.title'),
      description: t('features.personalization.description'),
      details: [
        t('features.personalization.detail1'),
        t('features.personalization.detail2'),
        t('features.personalization.detail3'),
        t('features.personalization.detail4'),
        t('features.personalization.detail5'),
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      icon: BarChart3,
      title: t('features.analysis.title'),
      description: t('features.analysis.description'),
      details: [
        t('features.analysis.detail1'),
        t('features.analysis.detail2'),
        t('features.analysis.detail3'),
        t('features.analysis.detail4'),
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      icon: FileText,
      title: t('features.templates.title'),
      description: t('features.templates.description'),
      details: [
        t('features.templates.detail1'),
        t('features.templates.detail2'),
        t('features.templates.detail3'),
        t('features.templates.detail4'),
        t('features.templates.detail5'),
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      icon: Database,
      title: t('features.storage.title'),
      description: t('features.storage.description'),
      details: [
        t('features.storage.detail1'),
        t('features.storage.detail2'),
        t('features.storage.detail3'),
        t('features.storage.detail4'),
      ],
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 5,
      icon: History,
      title: t('features.versions.title'),
      description: t('features.versions.description'),
      details: [
        t('features.versions.detail1'),
        t('features.versions.detail2'),
        t('features.versions.detail3'),
        t('features.versions.detail4'),
      ],
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 6,
      icon: Download,
      title: t('features.export.title'),
      description: t('features.export.description'),
      details: [
        t('features.export.detail1'),
        t('features.export.detail2'),
        t('features.export.detail3'),
        t('features.export.detail4'),
      ],
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 7,
      icon: Zap,
      title: t('features.performance.title'),
      description: t('features.performance.description'),
      details: [
        t('features.performance.detail1'),
        t('features.performance.detail2'),
        t('features.performance.detail3'),
        t('features.performance.detail4'),
      ],
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  const targetAudience = [
    t('features.audience.students'),
    t('features.audience.graduates'),
    t('features.audience.earlyCareer'),
    t('features.audience.midCareer'),
    t('features.audience.switchers'),
    t('features.audience.highVolume'),
  ];

  const futureEnhancements = [
    t('features.improvements.industry'),
    t('features.improvements.language'),
    t('features.improvements.matching'),
    t('features.improvements.analytics'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
            {t('features.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
          <div className="pt-4">
            <Button
              onClick={() => navigate('/register')}
              size="lg"
              className="gap-2"
            >
              {t('features.cta')}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t('features.mainFeaturesTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">{t('features.builtFor.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('features.builtFor.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudience.map((audience, idx) => (
              <Card key={idx} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6 flex items-start gap-4">
                  <Users className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{audience}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-gray-600 text-lg">
            {t('features.builtFor.adaptability')}
          </div>
        </div>
      </section>

      {/* Continuous Improvement Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-gray-900">{t('features.improvements.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('features.improvements.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {futureEnhancements.map((enhancement, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                <CardContent className="pt-6 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 font-medium text-left">{enhancement}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-4xl font-bold">{t('features.summary.title')}</h2>
          <p className="text-lg text-blue-100">
            {t('features.summary.description')}
          </p>
          <div className="pt-6 flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 gap-2 font-semibold"
            >
              {t('features.summary.cta')}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate('/pricing')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 gap-2 font-semibold"
            >
              {t('features.summary.pricing')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
