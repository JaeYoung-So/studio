'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Image as ImageIcon,
  Lightbulb,
  MoreVertical,
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
}

export function MemoToolbar({
  memo,
  onIconChange,
  onCoverImageChange,
  onRemoveCoverImage,
  images,
  onUpdate,
  isNewMemo = false
}: MemoToolbarProps) {
  const backgroundImages = images.filter(p => p.id.startsWith('bg-'));
  const memoImages = images.filter(p => !p.id.startsWith('bg-'));

  const icons = [
    { name: 'smile', component: Smile },
    { name: 'briefcase', component: Briefcase },
    { name: 'shopping-cart', component: ShoppingCart },
    { name: 'lightbulb', component: Lightbulb },
  ];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onCoverImageChange(e.target.result);
          if (!isNewMemo) {
            toast({
              title: "커버 이미지 변경됨",
              description: "새로운 커버 이미지가 적용되었습니다.",
            });
          }
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


  const toolbarContent = (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">꾸미기</h4>
        <p className="text-sm text-muted-foreground">
          아이콘과 커버 이미지로 메모를 꾸며보세요.
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          아이콘
        </p>
        <div className="flex gap-2">
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
            커버
          </p>
          <div className='flex items-center'>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button type="button" variant="ghost" size="sm" className="h-7" onClick={handleImageUploadClick}>
              <Upload className="h-3 w-3 mr-1" />
              업로드
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={onRemoveCoverImage}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                삭제
              </Button>
          </div>
        </div>
        <ScrollArea className="h-40">
          <div className="grid grid-cols-2 gap-2">
            {[...backgroundImages, ...memoImages].map(image => (
              <button
                key={image.id}
                type="button"
                className={cn(
                  "relative aspect-video w-full rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  memo.coverImageUrl === image.imageUrl && "ring-2 ring-ring ring-offset-2"
                )}
                onClick={() => onCoverImageChange(image.imageUrl)}
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
