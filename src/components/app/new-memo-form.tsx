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
import { INITIAL_PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';
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
}

export default function NewMemoForm({ onAddMemo, categories }: NewMemoFormProps) {
  const { toast } = useToast();
  const [isVoice, setIsVoice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      imageUrl: '',
      isVoiceMemo: false,
      icon: undefined,
      coverImageUrl: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    const submissionValues = {
      ...values,
      category: values.category === 'uncategorized' ? undefined : values.category,
    };
    onAddMemo(submissionValues);
    form.reset();
    setIsVoice(false);
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
            title: "이미지 추가됨",
            description: "이미지가 메모에 추가되었습니다.",
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
    form.setValue('coverImageUrl', url);
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
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="메모 제목" {...field} />
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
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea placeholder="메모 내용" className="resize-none" {...field} />
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
              <FormLabel>카테고리</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택 (선택 사항)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="uncategorized">선택 안함</SelectItem>
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
        <div className="flex justify-between items-start gap-2">
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="icon" onClick={handleImageUploadClick} aria-label="이미지 업로드">
                  <ImagePlus className="h-4 w-4" />
              </Button>
              <Button type="button" variant={isVoice ? "secondary" : "outline"} size="icon" onClick={handleToggleVoiceMemo} aria-label="음성 메모 녹음">
                  <Mic className="h-4 w-4" />
              </Button>
            </div>

            <Collapsible className="w-full flex-1">
              <div className="flex justify-end">
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="icon" aria-label="꾸미기">
                      <Palette className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <MemoToolbar
                  memo={form.getValues()}
                  onIconChange={handleIconChange}
                  onCoverImageChange={handleCoverImageChange}
                  onRemoveCoverImage={handleRemoveCoverImage}
                  images={INITIAL_PLACEHOLDER_IMAGES}
                  isNewMemo={true}
                />
              </CollapsibleContent>
            </Collapsible>
        </div>
        <Button type="submit" className="w-full">메모 추가</Button>
      </form>
    </Form>
  );
}
