'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Memo } from '@/lib/types';
import { ImagePlus, Mic, Palette, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { MemoToolbar } from './memo-toolbar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }).max(50),
  content: z.string().min(1, { message: '내용을 입력해주세요.' }),
  category: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  isVoiceMemo: z.boolean(),
  icon: z.string().optional(),
  coverImageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewMemoFormProps {
  onAddMemo: (memo: Omit<Memo, 'id' | 'createdAt'>) => void;
  categories: string[];
  images: ImagePlaceholder[];
  t: (key: any, ...args: any[]) => string;
}

export default function NewMemoForm({ onAddMemo, categories, images, t }: NewMemoFormProps) {
  const { toast } = useToast();
  const [isVoice, setIsVoice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDecoratorOpen, setIsDecoratorOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      imageUrls: [],
      isVoiceMemo: false,
      icon: undefined,
      coverImageUrl: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    const submissionValues: Omit<Memo, 'id' | 'createdAt'> = {
      ...values,
      category: values.category === 'uncategorized' ? undefined : values.category,
      imageUrls: values.imageUrls || [],
    };
    if (!submissionValues.coverImageUrl) {
        delete submissionValues.coverImageUrl;
    }
    if (!submissionValues.icon) {
        delete submissionValues.icon;
    }

    onAddMemo(submissionValues);
    form.reset({
      title: '',
      content: '',
      category: '',
      imageUrls: [],
      isVoiceMemo: false,
      icon: undefined,
      coverImageUrl: undefined,
    });
    setIsVoice(false);
    setIsDecoratorOpen(false);
  }
  
  const handleToggleVoiceMemo = () => {
    const newIsVoice = !form.getValues('isVoiceMemo');
    form.setValue('isVoiceMemo', newIsVoice);
    setIsVoice(newIsVoice);
  };
  
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const currentImages = form.getValues('imageUrls') || [];
      
      Array.from(files).forEach(file => {
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
            form.setValue('imageUrls', [...currentImages, dataUrl]);
          } else {
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
              
              form.setValue('imageUrls', [...form.getValues('imageUrls') || [], resizedDataUrl]);
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
    const currentImages = form.getValues('imageUrls') || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue('imageUrls', newImages);
  };

  const handleIconChange = (icon: string) => {
    const newIcon = form.getValues('icon') === icon ? undefined : icon;
    form.setValue('icon', newIcon);
  };

  const handleCoverImageChange = (url: string) => {
    const newUrl = form.getValues('coverImageUrl') === url ? undefined : url;
    form.setValue('coverImageUrl', newUrl);
  };
  
  const handleRemoveCoverImage = () => {
    form.setValue('coverImageUrl', undefined);
  };

  const imageUrls = form.watch('imageUrls');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('memoTitle')}</FormLabel>
              <FormControl>
                <Input placeholder={t('memoTitle')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('memoContent')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('memoContent')} className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {imageUrls && imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Preview ${index}`}
                  width={100}
                  height={100}
                  className="w-full h-auto object-cover rounded-md"
                  unoptimized={url.endsWith('.gif')}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('category')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="uncategorized">{t('selectNone')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
        />
        <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" onClick={handleImageUploadClick} aria-label={t('uploadImage')}>
                <ImagePlus className="h-4 w-4" />
            </Button>
            <Button type="button" variant={isVoice ? "secondary" : "outline"} size="icon" onClick={handleToggleVoiceMemo} aria-label={t('recordVoiceMemo')}>
                <Mic className="h-4 w-4" />
            </Button>
        </div>

        <Collapsible open={isDecoratorOpen} onOpenChange={setIsDecoratorOpen}>
            <div className="flex justify-start">
              <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                      <Palette className="h-4 w-4 mr-2" />
                      {t('decorate')}
                  </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="bg-card p-4 rounded-md border mt-2">
                  <MemoToolbar
                      memo={form.watch()}
                      onIconChange={handleIconChange}
                      onCoverImageChange={handleCoverImageChange}
                      onRemoveCoverImage={handleRemoveCoverImage}
                      images={images}
                      isNewMemo={true}
                      t={t}
                  />
              </div>
            </CollapsibleContent>
        </Collapsible>

        <Button type="submit" className="w-full">{t('addMemo')}</Button>
      </form>
    </Form>
  );
}
