import { ShieldPlusIcon } from '@/components/icons';
import { LanguageSwitcher } from '@/components/language-switcher';

type HeaderProps = {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
};

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card shadow-sm sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <ShieldPlusIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground">
              Ayush Shield
            </h1>
        </div>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
    </header>
  );
}
