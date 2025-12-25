import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Zap, Rocket, Crown } from 'lucide-react';

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userCredits, setUserCredits] = useState(23); // This would come from the user API

  const plans = [
    {
      id: 'starter',
      name: t('pricing.starter.name'),
      description: t('pricing.starter.description'),
      price: 19,
      credits: 20,
      icon: Zap,
      popular: false,
      features: [
        t('pricing.starter.feature1'),
        t('pricing.starter.feature2'),
        t('pricing.starter.feature3'),
        t('pricing.starter.feature4'),
        t('pricing.starter.feature5'),
      ],
      buttonText: t('pricing.getStarter'),
      buttonVariant: 'default',
    },
    {
      id: 'best',
      name: t('pricing.best.name'),
      description: t('pricing.best.description'),
      price: 39,
      credits: 60,
      icon: Rocket,
      popular: true,
      features: [
        t('pricing.best.feature1'),
        t('pricing.best.feature2'),
        t('pricing.best.feature3'),
        t('pricing.best.feature4'),
        t('pricing.best.feature5'),
        t('pricing.best.feature6'),
        t('pricing.best.feature7'),
      ],
      buttonText: t('pricing.getBest'),
      buttonVariant: 'primary',
    },
    {
      id: 'power',
      name: t('pricing.power.name'),
      description: t('pricing.power.description'),
      price: 79,
      credits: 150,
      icon: Crown,
      popular: false,
      features: [
        t('pricing.power.feature1'),
        t('pricing.power.feature2'),
        t('pricing.power.feature3'),
        t('pricing.power.feature4'),
        t('pricing.power.feature5'),
        t('pricing.power.feature6'),
      ],
      buttonText: t('pricing.getPower'),
      buttonVariant: 'default',
    },
  ];

  const handlePlanSelect = (plan) => {
    // This would navigate to a checkout page or handle payment
    if (!user) {
      // Redirect to register if not authenticated
      navigate('/register');
      return;
    }
    console.log('Selected plan:', plan);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">
              {t('pricing.title')} <span className="text-blue-600">{t('pricing.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.id} className="relative">
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      ⭐ {t('pricing.mostPopular')}
                    </span>
                  </div>
                )}

                <Card
                  className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg ${
                    plan.popular
                      ? 'border-2 border-blue-500 shadow-lg ring-1 ring-blue-200 pt-4'
                      : 'border border-gray-200'
                  }`}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-1 border-t border-gray-200 pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-sm text-gray-600">/one-time</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">
                        {plan.credits} {t('pricing.creditsIncluded')}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full font-semibold py-3 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Free Trial Section */}
        <div className="text-center space-y-4 bg-gray-50 rounded-lg p-12">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('pricing.tryFirst')}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            {t('pricing.newUserMessage')}
          </p>
          <Alert className="bg-blue-50 border-blue-200 max-w-xl mx-auto">
            <Zap className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 font-semibold">
              {t('pricing.freeCredits')}
            </AlertDescription>
          </Alert>
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            {t('pricing.faqText')} <a href="#" className="text-blue-600 hover:underline">{t('pricing.contactSupport')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
