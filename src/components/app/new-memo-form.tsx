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
import { ImagePlus, Mic, Palette } from 'lucide-react';
import { useRef, useState } from 'react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { MemoToolbar } from './memo-toolbar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const formSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }).max(50),
  content: z.string().min(1, { message: '내용을 입력해주세요.' }),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
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
      imageUrl: undefined,
      isVoiceMemo: false,
      icon: undefined,
      coverImageUrl: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    const submissionValues: Omit<Memo, 'id' | 'createdAt'> = {
      ...values,
      category: values.category === 'uncategorized' ? undefined : values.category,
    };
    if (!submissionValues.imageUrl) {
      delete submissionValues.imageUrl;
    }
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
      imageUrl: undefined,
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
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          form.setValue('imageUrl', e.target.result);
          toast({
            title: t('imageAdded'),
            description: t('imageAddedDesc'),
          });
        }
      };
      reader.readAsDataURL(file);
    }
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
          accept="image/*"
        />
        <div className="space-y-2">
            <div className="flex gap-2">
                <Button type="button" variant="outline" size="icon" onClick={handleImageUploadClick} aria-label={t('uploadImage')}>
                    <ImagePlus className="h-4 w-4" />
                </Button>
                <Button type="button" variant={isVoice ? "secondary" : "outline"} size="icon" onClick={handleToggleVoiceMemo} aria-label={t('recordVoiceMemo')}>
                    <Mic className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <Collapsible open={isDecoratorOpen} onOpenChange={setIsDecoratorOpen} className="space-y-2">
            <div className="flex justify-start">
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                        <Palette className="h-4 w-4 mr-2" />
                        {t('decorate')}
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="bg-card p-4 rounded-md border">
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
