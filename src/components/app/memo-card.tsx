'use client';

import type { Memo } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, Trash2, Smile, Briefcase, ShoppingCart, Lightbulb, GripVertical, Book, Coffee, Gamepad2, Music } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { MemoToolbar } from './memo-toolbar';
import * as React from 'react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { Language } from '@/lib/i18n';

interface MemoCardProps {
  memo: Memo;
  onDelete: (id: string) => void;
  onUpdate: (memo: Memo) => void;
  images: ImagePlaceholder[];
  t: (key: any, ...args: any[]) => string;
}

const iconMap: { [key: string]: React.ElementType } = {
  smile: Smile,
  briefcase: Briefcase,
  'shopping-cart': ShoppingCart,
  lightbulb: Lightbulb,
  book: Book,
  coffee: Coffee,
  'gamepad-2': Gamepad2,
  music: Music,
};


export default function MemoCard({ memo, onDelete, onUpdate, images, t }: MemoCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({id: memo.id});
      
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = memo.icon ? iconMap[memo.icon] : null;
    
    const handleIconChange = (icon: string) => {
        const newIcon = memo.icon === icon ? undefined : icon;
        onUpdate({ ...memo, icon: newIcon });
    };

    const handleCoverImageChange = (url: string) => {
        const newUrl = memo.coverImageUrl === url ? undefined : url;
        onUpdate({ ...memo, coverImageUrl: newUrl });
    };

    const handleRemoveCoverImage = () => {
        onUpdate({ ...memo, coverImageUrl: undefined });
    }
    
    const [lang, setLang] = React.useState<Language>('ko');
    React.useEffect(() => {
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang) {
            setLang(storedLang);
        }
    }, []);

  return (
    <Card 
        ref={setNodeRef} 
        style={style}
        className={cn(
            "flex flex-col overflow-hidden transition-shadow hover:shadow-xl duration-300 ease-in-out bg-card/80 backdrop-blur-sm touch-none"
        )}
    >
      {(memo.coverImageUrl || memo.imageUrl || memo.icon) && (
          <div className="relative h-32 w-full bg-muted/20">
            {memo.coverImageUrl && (
              <Image
                src={memo.coverImageUrl}
                alt={memo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
             {!memo.coverImageUrl && memo.imageUrl && (
              <Image
                src={memo.imageUrl}
                alt={memo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
      )}
      <div className={cn("relative", !(memo.coverImageUrl || memo.imageUrl || memo.icon) && 'pt-6')}>
        {Icon && (
          <div className="absolute -top-5 left-4 bg-background p-1 rounded-full border">
            <Icon className="h-8 w-8 text-gray-500" />
          </div>
        )}
        <CardHeader className={cn(
            "flex flex-row items-start justify-between space-y-0 pb-2",
            Icon ? 'pt-8' : 'pt-6'
        )}>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
                 {memo.title}
            </CardTitle>
            <div className="flex items-center">
                <button {...attributes} {...listeners} className="cursor-grab p-2 text-muted-foreground hover:bg-accent rounded-md">
                    <GripVertical className="h-5 w-5" />
                </button>
                <MemoToolbar 
                    memo={memo}
                    onIconChange={handleIconChange} 
                    onCoverImageChange={handleCoverImageChange}
                    onRemoveCoverImage={handleRemoveCoverImage}
                    images={images}
                    onUpdate={onUpdate}
                    t={t}
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label={t('deleteMemoTitle')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteMemoTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteMemoDesc')}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(memo.id)}>{t('delete')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{memo.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
            {memo.category && <Badge variant="secondary">{memo.category}</Badge>}
            {memo.isVoiceMemo && (
                <div className="flex items-center gap-1">
                <Mic className="h-4 w-4" />
                <span>{t('voice')}</span>
                </div>
            )}
            </div>
            <span>
            {formatDistanceToNow(new Date(memo.createdAt), { addSuffix: true, locale: lang === 'ko' ? ko : enUS })}
            </span>
        </CardFooter>
      </div>
    </Card>
  );
}
