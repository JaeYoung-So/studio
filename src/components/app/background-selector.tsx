
'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Palette, Upload, X } from 'lucide-react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BackgroundSelectorProps {
  onBackgroundChange: (url: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundOpacityChange: (opacity: number) => void;
  backgroundOpacity: number;
  onImageUpload: (imageDataUrl: string) => void;
  images: ImagePlaceholder[];
  onImageDelete: (imageId: string) => void;
  t: (key: any) => string;
}

export default function BackgroundSelector({ 
  onBackgroundChange, 
  onBackgroundColorChange, 
  onBackgroundOpacityChange, 
  backgroundOpacity,
  onImageUpload,
  images,
  onImageDelete,
  t
}: BackgroundSelectorProps) {
  const backgroundColors = [
    'hsl(0 0% 100%)', // white
    'hsl(222.2 84% 4.9%)', // black
    '#e2e8f0', // slate-200
    '#fecaca', // red-200
    '#fed7aa', // orange-200
    '#fef08a', // yellow-200
    '#d9f99d', // lime-200
    '#bfdbfe', // blue-200
    '#e9d5ff', // purple-200
  ];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          onImageUpload(dataUrl);
        };
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('changeBackground')}>
          <ImageIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">{t('selectBackground')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('selectBackgroundDesc')}
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                {t('color')}
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
               <div className="h-8 w-8 rounded-full border overflow-hidden">
                <input
                  type="color"
                  className="h-10 w-10 -translate-x-1 -translate-y-1 cursor-pointer"
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  aria-label="사용자 지정 색상 선택"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Label htmlFor="opacity-slider" className="text-xs font-medium text-muted-foreground">{t('colorOpacity')}</Label>
            <Slider
              id="opacity-slider"
              min={0}
              max={1}
              step={0.1}
              value={[backgroundOpacity]}
              onValueChange={(value) => onBackgroundOpacityChange(value[0])}
            />
          </div>

          <Separator />

          <div>
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  {t('image')}
                </p>
               </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button variant="outline" size="sm" onClick={handleImageUploadClick}>
                  <Upload className="h-3 w-3 mr-2" />
                  {t('upload')}
                </Button>
            </div>
            <ScrollArea className="h-48">
              <div className="grid grid-cols-2 gap-2">
                {images.map(image => (
                   <AlertDialog key={image.id}>
                    <div className="relative group">
                      <button
                        className="relative aspect-video w-full rounded-md overflow-hidden group/button focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => onBackgroundChange(image.imageUrl)}
                      >
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          sizes="150px"
                          className="object-cover transition-transform group-hover/button:scale-105"
                          data-ai-hint={image.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover/button:bg-black/40 transition-colors" />
                      </button>
                      {image.id.startsWith('uploaded-') && (
                        <p className="absolute bottom-1 left-1 text-white text-[10px] bg-black/50 px-1 rounded-sm pointer-events-none">{t('uploaded')}</p>
                      )}
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('deleteImageTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('deleteImageDesc')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onImageDelete(image.id)}>
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </div>
                  </AlertDialog>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
