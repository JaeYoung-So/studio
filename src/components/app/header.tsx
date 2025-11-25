
'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BackgroundSelector from './background-selector';
import { SidebarTrigger } from '../ui/sidebar';
import { AppLogo } from '../icons';
import { cn, colorToRgba } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import LanguageSelector from './language-selector';
import { Language } from '@/lib/i18n';
import { DatePicker } from '../ui/date-picker';
import { format } from 'date-fns';

interface HeaderProps {
  onSearch: (term: string) => void;
  onBackgroundChange: (url: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundOpacityChange: (opacity: number) => void;
  backgroundColor: string;
  backgroundOpacity: number;
  onImageUpload: (imageDataUrl: string) => void;
  images: ImagePlaceholder[];
  onImageDelete: (imageId: string) => void;
  t: (key: any, ...args: any[]) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Header({ 
  onSearch, 
  onBackgroundChange, 
  onBackgroundColorChange,
  onBackgroundOpacityChange, 
  backgroundColor,
  backgroundOpacity,
  onImageUpload,
  images,
  onImageDelete,
  t,
  language,
  setLanguage
}: HeaderProps) {

  const headerStyle = backgroundColor
    ? { backgroundColor: colorToRgba(backgroundColor, backgroundOpacity > 0.3 ? backgroundOpacity - 0.3 : 0.1) }
    : {};
    
  return (
    <header 
      className={cn(
        "flex h-16 items-center gap-4 border-b bg-background/50 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-sm",
        "border-border/50"
      )}
      style={headerStyle}
    >
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
         <AppLogo className="h-8 w-8 text-primary" />
         <h1 className="text-xl font-bold font-headline hidden md:block">{t('title')}</h1>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial relative flex items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchMemos')}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              onChange={(e) => onSearch(e.target.value)}
              aria-label={t('searchMemos')}
            />
            <DatePicker onDateSelect={(date) => onSearch(format(date, 'yyyy-MM-dd'))} />
        </div>
        <LanguageSelector language={language} setLanguage={setLanguage} t={t} />
        <BackgroundSelector 
          onBackgroundChange={onBackgroundChange} 
          onBackgroundColorChange={onBackgroundColorChange} 
          onBackgroundOpacityChange={onBackgroundOpacityChange}
          backgroundOpacity={backgroundOpacity}
          onImageUpload={onImageUpload}
          images={images}
          onImageDelete={onImageDelete}
          t={t}
        />
      </div>
    </header>
  );
}
