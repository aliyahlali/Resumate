import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setLoading(true);

    const result = await register(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || t('auth.registerError'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]"></div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 text-4xl font-bold">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resumate
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {t('register.joinThousands')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              {t('register.subtitle')}
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span>{t('register.benefits.unlimited')}</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span>{t('register.benefits.templates')}</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span>{t('register.benefits.ocr')}</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span>{t('register.benefits.history')}</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span>{t('register.benefits.pdf')}</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span>{t('register.benefits.ai')}</span>
            </div>
          </div>

          <div className="pt-8">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-2xl border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{t('register.free.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('register.free.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <Card className="w-full shadow-2xl border-2">
          <CardHeader className="space-y-1 text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{t('auth.createAccount')}</CardTitle>
            <CardDescription className="text-base">
              {t('register.joinFree')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg border border-destructive/30 animate-in slide-in-from-top duration-300">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('auth.passwordMinLength')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">{t('auth.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('auth.createMyAccount')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {t('auth.termsAccept')}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth.alreadyAccount')}
                  </span>
                </div>
              </div>
              <p className="text-center text-sm">
                <Link to="/login" className="text-primary hover:underline font-semibold text-base">
                  {t('auth.signIn')} →
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
