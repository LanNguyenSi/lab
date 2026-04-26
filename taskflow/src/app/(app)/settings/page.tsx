'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Download,
  Trash2,
  AlertTriangle,
  Settings2,
  FileJson,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { signOut } from 'next-auth/react';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.replace('/login');
    router.refresh();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');

      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('settings.exportSuccess'),
        description: t('settings.exportSuccessDesc', {
          tasks: data.tasks.length,
          projects: data.projects.length,
          tags: data.tags.length,
        }),
        variant: 'success',
      });
    } catch {
      toast({
        title: t('settings.exportError'),
        description: t('settings.exportErrorDesc'),
        variant: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      if (!response.ok) throw new Error('Reset failed');

      toast({
        title: t('settings.resetSuccess'),
        description: t('settings.resetSuccessDesc'),
        variant: 'success',
      });

      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast({
        title: t('settings.resetError'),
        description: t('settings.resetErrorDesc'),
        variant: 'error',
      });
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings2 className="h-8 w-8" />
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('settings.description')}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {t('settings.appearance')}
            </CardTitle>
            <CardDescription>{t('settings.themeDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">
                    {t('settings.light')}
                  </span>
                </div>
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium">
                    {t('settings.dark')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              {t('settings.language')}
            </CardTitle>
            <CardDescription>{t('settings.selectLanguage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('settings.account')}
            </CardTitle>
            <CardDescription>{t('settings.accountDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('settings.signOut')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('settings.signOutDesc')}
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('settings.signOut')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t('settings.exportTitle')}
            </CardTitle>
            <CardDescription>{t('settings.exportDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('settings.exportIncludes')}:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('settings.exportTasks')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('settings.exportProjects')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('settings.exportTags')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('settings.exportTimeEntries')}
                  </li>
                </ul>
              </div>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="min-w-[140px]"
              >
                {isExporting ? (
                  <>
                    <FileJson className="mr-2 h-4 w-4 animate-spin" />
                    {t('settings.exporting')}
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {t('settings.export')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              {t('settings.resetTitle')}
            </CardTitle>
            <CardDescription>{t('settings.resetDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetConfirm ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {t('settings.resetWarning')}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowResetConfirm(true)}
                  className="min-w-[140px]"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('settings.reset')}
                </Button>
              </div>
            ) : (
              <Alert variant="destructive" className="border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('settings.resetConfirmTitle')}</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-4">{t('settings.resetConfirmDesc')}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleReset}
                      disabled={isResetting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isResetting
                        ? t('settings.resetting')
                        : t('settings.resetConfirmYes')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowResetConfirm(false)}
                      disabled={isResetting}
                    >
                      {t('settings.cancel')}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
