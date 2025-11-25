'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Palette } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface BackgroundSelectorProps {
  onBackgroundChange: (url: string) => void;
  onBackgroundColorChange: (color: string) => void;
}

export default function BackgroundSelector({ onBackgroundChange, onBackgroundColorChange }: BackgroundSelectorProps) {
  const backgroundImages = PlaceHolderImages.filter(p => p.id.startsWith('bg-'));
  const backgroundColors = [
    'hsl(195 53% 91%)', // default light background
    'hsl(20 10% 8%)', // default dark background
    '#e2e8f0',
    '#fecaca',
    '#fed7aa',
    '#fef08a',
    '#d9f99d',
    '#bfdbfe',
    '#e9d5ff',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="배경 변경">
          <ImageIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">배경 선택</h4>
            <p className="text-sm text-muted-foreground">
              앱의 배경을 꾸며보세요.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                색상
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {backgroundColors.map(color => (
                <button
                  key={color}
                  className="h-8 w-8 rounded-full border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{ backgroundColor: color }}
                  onClick={() => onBackgroundColorChange(color)}
                  aria-label={`배경색 ${color}로 변경`}
                />
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center mb-2">
               <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
               <p className="text-xs font-medium text-muted-foreground">
                이미지
              </p>
            </div>
            <ScrollArea className="h-48">
              <div className="grid grid-cols-2 gap-2">
                {backgroundImages.map(image => (
                  <button
                    key={image.id}
                    className="relative aspect-video w-full rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => onBackgroundChange(image.imageUrl)}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
