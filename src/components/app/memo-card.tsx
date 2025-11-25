'use client';

import type { Memo } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Smile, Briefcase, ShoppingCart, Lightbulb, GripVertical, Book, Coffee, Gamepad2, Music, Edit, X, Save, ImagePlus, Palette } from 'lucide-react';
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface MemoCardProps {
  memo: Memo;
  onDelete: (id: string) => void;
  onUpdate: (memo: Memo) => void;
  images: ImagePlaceholder[];
  t: (key: any, ...args: any[]) => string;
  categories: string[];
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


export default function MemoCard({ memo, onDelete, onUpdate, images, t, categories }: MemoCardProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({id: memo.id, disabled: isEditing });

    const [editedMemo, setEditedMemo] = React.useState<Memo>(memo);
    const [isDecoratorOpen, setIsDecoratorOpen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();
      
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : (isEditing ? 20 : 'auto'),
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = editedMemo.icon ? iconMap[editedMemo.icon] : null;

    const handleIconChange = (icon: string) => {
        const newIcon = editedMemo.icon === icon ? undefined : icon;
        setEditedMemo({ ...editedMemo, icon: newIcon });
    };

    const handleCoverImageChange = (url: string) => {
        const newUrl = editedMemo.coverImageUrl === url ? undefined : url;
        setEditedMemo({ ...editedMemo, coverImageUrl: newUrl });
    };

    const handleRemoveCoverImage = () => {
        setEditedMemo({ ...editedMemo, coverImageUrl: undefined });
    }

    const handleEdit = () => {
        setIsEditing(true);
        setEditedMemo(memo);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsDecoratorOpen(false);
    };

    const handleSave = () => {
        onUpdate(editedMemo);
        setIsEditing(false);
        setIsDecoratorOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedMemo({ ...editedMemo, [name]: value });
    };

    const handleCategoryChange = (value: string) => {
        setEditedMemo({ ...editedMemo, category: value === 'uncategorized' ? undefined : value });
    };
    
    const [lang, setLang] = React.useState<Language>('ko');
    React.useEffect(() => {
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang) {
            setLang(storedLang);
        }
    }, []);
    
    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
          const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          
          Array.from(files).forEach(file => {
            if (!supportedTypes.includes(file.type)) {
              toast({ variant: 'destructive', title: t('error'), description: t('unsupportedFileType') });
              return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
              if (!e.target?.result) return;
              const dataUrl = e.target.result as string;
    
              if (file.type === 'image/gif') {
                setEditedMemo(prev => ({...prev, imageUrls: [...(prev.imageUrls || []), dataUrl]}));
              } else {
                const img = document.createElement('img');
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 800;
                  const MAX_HEIGHT = 600;
                  let width = img.width;
                  let height = img.height;
        
                  if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                  } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                  setEditedMemo(prev => ({...prev, imageUrls: [...(prev.imageUrls || []), resizedDataUrl]}));
                };
                img.src = dataUrl;
              }
            };
            reader.readAsDataURL(file);
          });
          toast({ title: t('imageAdded'), description: t('imageAddedDesc') });
        }
      };

    const handleRemoveImage = (index: number) => {
        const newImages = [...(editedMemo.imageUrls || [])];
        newImages.splice(index, 1);
        setEditedMemo({ ...editedMemo, imageUrls: newImages });
    };

  return (
    <Card 
        ref={setNodeRef} 
        style={style}
        className={cn(
            "flex flex-col overflow-hidden transition-shadow hover:shadow-xl duration-300 ease-in-out bg-card/80 backdrop-blur-sm",
            isDragging && "touch-none"
        )}
    >
      <div className="relative">
        <div className="relative h-32 w-full bg-muted/20">
          {editedMemo.coverImageUrl && (
            <Image
              src={editedMemo.coverImageUrl}
              alt={editedMemo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={editedMemo.coverImageUrl.endsWith('.gif')}
            />
          )}
        </div>
        {Icon && (
          <div className={cn(
              "absolute left-4 bg-background p-1 rounded-full border",
              "top-auto -bottom-5 transform"
          )}>
              <Icon className="h-8 w-8 text-gray-500" />
          </div>
        )}
      </div>

      <div className={cn("relative flex flex-col flex-1")}>
          <CardHeader className={cn(
              "flex flex-row items-start justify-between space-y-0 pb-2",
              Icon ? "pt-8" : "pt-6"
          )}>
              {isEditing ? (
                  <Input
                      name="title"
                      value={editedMemo.title}
                      onChange={handleInputChange}
                      className="text-lg font-headline flex items-center gap-2 border-0 shadow-none focus-visible:ring-0 p-0"
                  />
              ) : (
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                      {memo.title}
                  </CardTitle>
              )}
              <div className="flex items-center">
                  {!isEditing && (
                      <button {...attributes} {...listeners} className="cursor-grab p-2 text-muted-foreground hover:bg-accent rounded-md">
                          <GripVertical className="h-5 w-5" />
                      </button>
                  )}
                  
                  {isEditing ? (
                      <>
                          <Button onClick={handleSave} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Save className="h-4 w-4" /></Button>
                          <Button onClick={handleCancel} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></Button>
                      </>
                  ) : (
                      <>
                          <Button onClick={handleEdit} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Edit className="h-4 w-4" /></Button>
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
                      </>
                  )}
                  {!isEditing && (
                     <MemoToolbar 
                        memo={editedMemo}
                        onIconChange={handleIconChange} 
                        onCoverImageChange={handleCoverImageChange}
                        onRemoveCoverImage={handleRemoveCoverImage}
                        images={images}
                        t={t}
                        isEditing={isEditing}
                    />
                  )}
              </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-0">
              {isEditing ? (
                  <Collapsible open={isDecoratorOpen} onOpenChange={setIsDecoratorOpen} className='space-y-4'>
                      <Textarea
                          name="content"
                          value={editedMemo.content}
                          onChange={handleInputChange}
                          className="text-sm text-foreground/80 whitespace-pre-wrap"
                      />
                      <div className="grid grid-cols-3 gap-2">
                          {editedMemo.imageUrls?.map((url, index) => (
                          <div key={index} className="relative group">
                              <Image src={url} alt={`Preview ${index}`} width={100} height={100} className="w-full h-auto object-cover rounded-md" unoptimized={url.endsWith('.gif')} />
                              <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveImage(index)}>
                                  <X className="h-4 w-4" />
                              </Button>
                          </div>
                          ))}
                      </div>

                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" multiple />
                      <div className="flex gap-2">
                          <Button type="button" variant="outline" size="icon" onClick={handleImageUploadClick} aria-label={t('uploadImage')}>
                              <ImagePlus className="h-4 w-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                              <Button type="button" variant="outline" size="icon">
                                  <Palette className="h-4 w-4" />
                              </Button>
                          </CollapsibleTrigger>
                      </div>
                      <MemoToolbar
                          memo={editedMemo}
                          onIconChange={handleIconChange}
                          onCoverImageChange={handleCoverImageChange}
                          onRemoveCoverImage={handleRemoveCoverImage}
                          images={images}
                          t={t}
                          isEditing={isEditing}
                        />

                  </Collapsible>
              ) : (
                  <>
                      {memo.imageUrls && memo.imageUrls.length > 0 && (
                          <Carousel className="w-full max-w-xs mx-auto">
                              <CarouselContent>
                                  {memo.imageUrls.map((url, index) => (
                                      <CarouselItem key={index}>
                                          <div className="relative aspect-video w-full rounded-md overflow-hidden mt-2">
                                              <Image
                                                  src={url}
                                                  alt={`${memo.title} - image ${index + 1}`}
                                                  fill
                                                  className="object-cover"
                                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                  unoptimized={url.endsWith('.gif')}
                                              />
                                          </div>
                                      </CarouselItem>
                                  ))}
                              </CarouselContent>
                              {memo.imageUrls.length > 1 && (
                                  <>
                                      <CarouselPrevious className="-left-8" />
                                      <CarouselNext className="-right-8" />
                                  </>
                              )}
                          </Carousel>
                      )}
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{memo.content}</p>
                  </>
              )}
          </CardContent>
          <CardFooter className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
              <div className="flex items-center gap-2">
                  {isEditing ? (
                      <Select onValueChange={handleCategoryChange} value={editedMemo.category || 'uncategorized'}>
                          <SelectTrigger className="text-xs h-7">
                              <SelectValue placeholder={t('selectCategory')} />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="uncategorized">{t('selectNone')}</SelectItem>
                          {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                  ) : (
                      memo.category && <Badge variant="secondary">{memo.category}</Badge>
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
