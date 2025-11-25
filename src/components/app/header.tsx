'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BackgroundSelector from './background-selector';
import { SidebarTrigger } from '../ui/sidebar';
import { AppLogo } from '../icons';
import { cn, colorToRgba } from '@/lib/utils';

interface HeaderProps {
  onSearch: (term: string) => void;
  onBackgroundChange: (url: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundOpacityChange: (opacity: number) => void;
  backgroundColor?: string;
  backgroundOpacity: number;
}

export default function Header({ 
  onSearch, 
  onBackgroundChange, 
  onBackgroundColorChange,
  onBackgroundOpacityChange, 
  backgroundColor,
  backgroundOpacity
}: HeaderProps) {

  const headerStyle = backgroundColor
    ? { backgroundColor: colorToRgba(backgroundColor, backgroundOpacity > 0.3 ? backgroundOpacity - 0.3 : 0.1) }
    : {};
    
  return (
    <header 
      className={cn(
        "flex h-16 items-center gap-4 border-b bg-background/50 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-sm",
        backgroundColor && "bg-transparent border-none"
      )}
      style={headerStyle}
    >
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
         <AppLogo className="h-8 w-8 text-primary" />
         <h1 className="text-xl font-bold font-headline hidden md:block">휙휙 메모</h1>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="메모 검색..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              onChange={(e) => onSearch(e.target.value)}
              aria-label="메모 검색"
            />
          </div>
        </form>
        <BackgroundSelector 
          onBackgroundChange={onBackgroundChange} 
          onBackgroundColorChange={onBackgroundColorChange} 
          onBackgroundOpacityChange={onBackgroundOpacityChange}
          backgroundOpacity={backgroundOpacity}
        />
      </div>
    </header>
  );
}
