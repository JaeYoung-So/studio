'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Book,
  Briefcase,
  Coffee,
  Gamepad2,
  Image as ImageIcon,
  Lightbulb,
  MoreVertical,
  Music,
  Smile,
  ShoppingCart,
  Trash2,
  Upload,
} from 'lucide-react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { type Memo } from '@/lib/types';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MemoToolbarProps {
  memo: Partial<Memo>;
  onIconChange: (icon: string) => void;
  onCoverImageChange: (url: string) => void;
  onRemoveCoverImage: () => void;
  images: ImagePlaceholder[];
  onUpdate?: (memo: Partial<Memo>) => void;
  isNewMemo?: boolean;
  t: (key: any, ...args: any[]) => string;
}

export function MemoToolbar({
  memo,
  onIconChange,
  onCoverImageChange,
  onRemoveCoverImage,
  images,
  onUpdate,
  isNewMemo = false,
  t,
}: MemoToolbarProps) {

  const icons = [
    { name: 'smile', component: Smile },
    { name: 'briefcase', component: Briefcase },
    { name: 'shopping-cart', component: ShoppingCart },
    { name: 'lightbulb', component: Lightbulb },
    { name: 'book', component: Book },
    { name: 'coffee', component: Coffee },
    { name: 'gamepad-2', component: Gamepad2 },
    { name: 'music', component: Music },
  ];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!supportedTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: t('error'),
          description: t('unsupportedFileType'),
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        const dataUrl = e.target.result as string;

        if (file.type === 'image/gif') {
          // For GIFs, use the original file to preserve animation
          onCoverImageChange(dataUrl);
          if (!isNewMemo) {
            toast({ title: t('coverImageChanged'), description: t('newCoverImageApplied') });
          }
        } else {
          // For other formats, resize the image
          const img = document.createElement('img');
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
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
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            onCoverImageChange(resizedDataUrl);
            if (!isNewMemo) {
              toast({ title: t('coverImageChanged'), description: t('newCoverImageApplied') });
            }
          };
          img.src = dataUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const TriggerButton = isNewMemo ? Button : PopoverTrigger;
  const Content = isNewMemo ? 'div' : PopoverContent;

  const contentProps = isNewMemo 
    ? { className: "grid gap-4 mt-4" }
    : { className: "w-80", align: "end" as "end" };

  const currentMemoImages = [
    ...(memo.imageUrls ? memo.imageUrls.map((url, i) => ({ id: `current-image-${i}`, imageUrl: url, description: 'Current', imageHint: 'current' })) : []),
    ...(memo.coverImageUrl && (!memo.imageUrls || !memo.imageUrls.includes(memo.coverImageUrl)) ? [{ id: 'current-cover', imageUrl: memo.coverImageUrl, description: 'Current Cover', imageHint: 'current cover' }] : [])
  ];

  const combinedImages = [
    ...currentMemoImages,
    ...images.filter(img => !currentMemoImages.some(mi => mi.imageUrl === img.imageUrl))
  ];


  const toolbarContent = (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">{t('decorating')}</h4>
        <p className="text-sm text-muted-foreground">
          {t('decorateMemo')}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {t('icon')}
        </p>
        <div className="flex flex-wrap gap-2">
          {icons.map(icon => (
            <Button
              key={icon.name}
              variant="outline"
              size="icon"
              type="button"
              onClick={() => onIconChange(icon.name)}
              className={cn(memo.icon === icon.name && "bg-accent text-accent-foreground")}
            >
              <icon.component className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium text-muted-foreground">
            {t('cover')}
          </p>
          <div className='flex items-center'>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
            <Button type="button" variant="ghost" size="sm" className="h-7" onClick={handleImageUploadClick}>
              <Upload className="h-3 w-3 mr-1" />
              {t('upload')}
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={onRemoveCoverImage}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {t('remove')}
              </Button>
          </div>
        </div>
        <ScrollArea className="h-40">
          <div className="grid grid-cols-2 gap-2">
            {combinedImages.map(image => (
              <button
                key={image.id}
                type="button"
                className={cn(
                  "relative aspect-video w-full rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  memo.coverImageUrl === image.imageUrl && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => onCoverImageChange(image.imageUrl)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  sizes="150px"
                  className="object-cover transition-transform group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                  unoptimized={image.imageUrl.endsWith('.gif')}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                 {image.id.startsWith('uploaded-') && (
                    <p className="absolute bottom-1 left-1 text-white text-[10px] bg-black/50 px-1 rounded-sm pointer-events-none">{t('uploaded')}</p>
                 )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  if (isNewMemo) {
    return toolbarContent;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent {...contentProps}>
        {toolbarContent}
      </PopoverContent>
    </Popover>
  );
}
