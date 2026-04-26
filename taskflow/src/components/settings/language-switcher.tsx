'use client';

import { useI18n, Language } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('settings.language')}</label>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as Language)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('settings.english')}</SelectItem>
          <SelectItem value="de">{t('settings.german')}</SelectItem>
          <SelectItem value="vi">{t('settings.vietnamese')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
