import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, History, FileText, Download, TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { cvService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await cvService.getHistory();
      if (response.success) {
        const cvList = response.data || [];
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentCVs = cvList.filter(cv => new Date(cv.createdAt) >= sevenDaysAgo);
        
        setStats({
          total: cvList.length,
          recent: recentCVs.length
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>{t('dashboard.aiPlatform')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {t('dashboard.welcome')}, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            {t('dashboard.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
              <Link to="/generate">
                <Zap className="mr-2 h-5 w-5" />
                {t('dashboard.generateNow')}
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
              <Link to="/history">
                <History className="mr-2 h-5 w-5" />
                {t('dashboard.viewHistory')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.stats.totalCVs')}
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('dashboard.stats.sinceRegistration')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.stats.thisWeek')}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.recent}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('dashboard.stats.last7Days')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.stats.avgTime')}
              </CardTitle>
              <Clock className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">~30s</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('dashboard.stats.perGeneration')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors duration-300">
                <Sparkles className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <CardTitle className="text-xl">{t('dashboard.quickActions.generate.title')}</CardTitle>
                <CardDescription className="mt-1">
                  {t('dashboard.quickActions.generate.subtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.quickActions.generate.description')}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('dashboard.quickActions.generate.feature1')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('dashboard.quickActions.generate.feature2')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('dashboard.quickActions.generate.feature3')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group-hover:bg-blue-600" size="lg">
              <Link to="/generate">
                <Sparkles className="mr-2 h-5 w-5" />
                {t('dashboard.quickActions.generate.button')}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-500">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors duration-300">
                <History className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <CardTitle className="text-xl">{t('dashboard.quickActions.history.title')}</CardTitle>
                <CardDescription className="mt-1">
                  {t('dashboard.quickActions.history.subtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.quickActions.history.description')}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('dashboard.quickActions.history.feature1')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('dashboard.quickActions.history.feature2')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('dashboard.quickActions.history.feature3')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group-hover:bg-purple-50 group-hover:border-purple-500" size="lg">
              <Link to="/history">
                <History className="mr-2 h-5 w-5" />
                {t('dashboard.quickActions.history.button')} ({stats.total})
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('dashboard.howItWorks.title')}</CardTitle>
          <CardDescription className="text-base">
            {t('dashboard.howItWorks.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative text-center space-y-3 group">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 hidden lg:block"></div>
              <h4 className="font-semibold text-lg">{t('dashboard.howItWorks.step1.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.howItWorks.step1.description')}
              </p>
            </div>
            <div className="relative text-center space-y-3 group">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 hidden lg:block"></div>
              <h4 className="font-semibold text-lg">{t('dashboard.howItWorks.step2.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.howItWorks.step2.description')}
              </p>
            </div>
            <div className="relative text-center space-y-3 group">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-pink-500 to-red-500 hidden lg:block"></div>
              <h4 className="font-semibold text-lg">{t('dashboard.howItWorks.step3.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.howItWorks.step3.description')}
              </p>
            </div>
            <div className="relative text-center space-y-3 group">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h4 className="font-semibold text-lg">{t('dashboard.howItWorks.step4.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.howItWorks.step4.description')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{t('dashboard.features.ai.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.features.ai.description')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">{t('dashboard.features.templates.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.features.templates.description')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">{t('dashboard.features.fast.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.features.fast.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
