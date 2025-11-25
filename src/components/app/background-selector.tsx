'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';

interface BackgroundSelectorProps {
  onBackgroundChange: (url: string) => void;
}

export default function BackgroundSelector({ onBackgroundChange }: BackgroundSelectorProps) {
  const backgroundImages = PlaceHolderImages.filter(p => p.id.startsWith('bg-'));

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
              앱의 배경 이미지를 선택하세요.
            </p>
          </div>
          <ScrollArea className="h-60">
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
      </PopoverContent>
    </Popover>
  );
}
