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
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface MemoToolbarProps {
  onIconChange: (icon: string) => void;
  onCoverImageChange: (url: string) => void;
  onRemoveCoverImage: () => void;
}

export function MemoToolbar({
  onIconChange,
  onCoverImageChange,
  onRemoveCoverImage,
}: MemoToolbarProps) {
  const backgroundImages = PlaceHolderImages.filter(p =>
    p.id.startsWith('bg-')
  );
  const icons = [
    { name: 'smile', component: Smile },
    { name: 'briefcase', component: Briefcase },
    { name: 'shopping-cart', component: ShoppingCart },
    { name: 'lightbulb', component: Lightbulb },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
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
                  onClick={() => onIconChange(icon.name)}
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
              <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={onRemoveCoverImage}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  삭제
                </Button>
            </div>
            <ScrollArea className="h-40">
              <div className="grid grid-cols-2 gap-2">
                {backgroundImages.map(image => (
                  <button
                    key={image.id}
                    className="relative aspect-video w-full rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      </PopoverContent>
    </Popover>
  );
}
