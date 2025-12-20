import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', name: 'French', flag: 'FR' },
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'lt', name: 'Lithuanian', flag: 'LT' },
  { code: 'ru', name: 'Russian', flag: 'RU' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline">
          <span className="inline-block rounded-full bg-gray-100 px-1 text-[10px] font-semibold mr-1">
            {currentLanguage.flag}
          </span>
          {currentLanguage.name}
        </span>
        <span className="md:hidden text-[10px] font-semibold">
          {currentLanguage.flag}
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 z-50 overflow-hidden animate-in slide-in-from-top duration-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;

