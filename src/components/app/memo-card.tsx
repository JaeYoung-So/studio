'use client';

import type { Memo } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, Trash2, Smile, Briefcase, ShoppingCart, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MemoToolbar } from './memo-toolbar';
import * as React from 'react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';

interface MemoCardProps {
  memo: Memo;
  onDelete: (id: string) => void;
  onUpdate: (memo: Memo) => void;
  images: ImagePlaceholder[];
}

const iconMap: { [key: string]: React.ElementType } = {
  smile: Smile,
  briefcase: Briefcase,
  'shopping-cart': ShoppingCart,
  lightbulb: Lightbulb,
};


export default function MemoCard({ memo, onDelete, onUpdate, images }: MemoCardProps) {
    const Icon = memo.icon ? iconMap[memo.icon] : null;
    
    const handleIconChange = (icon: string) => {
        onUpdate({ ...memo, icon });
    };

    const handleCoverImageChange = (url: string) => {
        onUpdate({ ...memo, coverImageUrl: url });
    };

    const handleRemoveCoverImage = () => {
        onUpdate({ ...memo, coverImageUrl: undefined });
    }

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl duration-300 ease-in-out bg-card/80 backdrop-blur-sm">
      {memo.coverImageUrl && (
          <div className="relative h-32 w-full">
            <Image
              src={memo.coverImageUrl}
              alt={memo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute -top-5 left-4 bg-background p-1 rounded-full">
            <Icon className="h-8 w-8 text-gray-500" />
          </div>
        )}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-8">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
                 {memo.title}
            </CardTitle>
            <div className="flex items-center">
                <MemoToolbar 
                    onIconChange={handleIconChange} 
                    onCoverImageChange={handleCoverImageChange}
                    onRemoveCoverImage={handleRemoveCoverImage}
                    images={images}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(memo.id)}
                  aria-label="메모 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
            {memo.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                src={memo.imageUrl}
                alt={memo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint="memo image"
                />
            </div>
            )}
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{memo.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
            {memo.category && <Badge variant="secondary">{memo.category}</Badge>}
            {memo.isVoiceMemo && (
                <div className="flex items-center gap-1">
                <Mic className="h-4 w-4" />
                <span>음성</span>
                </div>
            )}
            </div>
            <span>
            {formatDistanceToNow(new Date(memo.createdAt), { addSuffix: true, locale: ko })}
            </span>
        </CardFooter>
      </div>
    </Card>
  );
}
