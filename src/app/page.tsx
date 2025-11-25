'use client';

import type { Memo } from '@/lib/types';
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app/app-sidebar';
import Header from '@/components/app/header';
import MemoList from '@/components/app/memo-list';
import { INITIAL_PLACEHOLDER_IMAGES, type ImagePlaceholder } from '@/lib/placeholder-images';
import { colorToRgba } from '@/lib/utils';
import { arrayMove } from '@dnd-kit/sortable';
import NewMemoForm from '@/components/app/new-memo-form';
import { useTranslation, type Language, translations } from '@/lib/i18n';

const initialMemos: Memo[] = [
  {
    id: '1',
    title: '회의 준비',
    content: '다음 주 월요일 팀 회의 안건 정리. 1분기 실적 보고 및 2분기 계획 발표.',
    category: '업무',
    isVoiceMemo: false,
    createdAt: new Date('2023-10-26T10:00:00Z'),
    imageUrl: INITIAL_PLACEHOLDER_IMAGES.find(p => p.id === 'memo-1')?.imageUrl,
    icon: 'briefcase',
    coverImageUrl: INITIAL_PLACEHOLDER_IMAGES.find(p => p.id === 'bg-1')?.imageUrl,
  },
  {
    id: '2',
    title: '장보기 목록',
    content: '우유, 계란, 빵, 야채 (양파, 토마토)',
    category: '일상',
    isVoiceMemo: false,
    createdAt: new Date('2023-10-25T15:30:00Z'),
    icon: 'shopping-cart',
  },
  {
    id: '3',
    title: '주말 산행 아이디어',
    content: '북한산 등반 코스 알아보기. 친구들에게 연락해서 일정 조율.',
    category: '아이디어',
    isVoiceMemo: true,
    createdAt: new Date('2023-10-24T09:00:00Z'),
    icon: 'lightbulb',
    coverImageUrl: INITIAL_PLACEHOLDER_IMAGES.find(p => p.id === 'bg-3')?.imageUrl,
  },
];

const INITIAL_CATEGORIES = ['일상', '업무', '아이디어', '중요'];

export default function Home() {
  const { t, language, setLanguage } = useTranslation();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t('all'));
  const [categories, setCategories] = useState<string[]>([]);
  
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.8);
  const [images, setImages] = useState<ImagePlaceholder[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos).map((memo: any) => ({...memo, createdAt: new Date(memo.createdAt)})));
    } else {
       setMemos(initialMemos.map(memo => ({
        ...memo,
        title: language === 'en' ? `Meeting Prep ${memo.id}` : memo.title,
        content: language === 'en' ? `Content for memo ${memo.id}` : memo.content,
        category: language === 'en' ? { '업무': 'Work', '일상': 'Daily', '아이디어': 'Idea' }[memo.category || ''] || 'Misc' : memo.category,
      })));
    }
    
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
       setCategories(language === 'en' ? ['Daily', 'Work', 'Idea', 'Important'] : INITIAL_CATEGORIES);
    }

    const storedBgUrl = localStorage.getItem('backgroundUrl');
    if (storedBgUrl) setBackgroundUrl(storedBgUrl);
    
    const storedBgColor = localStorage.getItem('backgroundColor');
    if(storedBgColor) setBackgroundColor(storedBgColor);
    
    const storedBgOpacity = localStorage.getItem('backgroundOpacity');
    if (storedBgOpacity) setBackgroundOpacity(parseFloat(storedBgOpacity));

    const storedImages = localStorage.getItem('images');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    } else {
      setImages(INITIAL_PLACEHOLDER_IMAGES);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    document.title = t('title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('description'));
    }
  }, [t, isClient]);

  useEffect(() => {
    if (!isClient) return;
    setSelectedCategory(t('all'));
  }, [language, isClient]);

  useEffect(() => {
    if (!isClient || memos.length === 0) return;
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos, isClient]);
  
  useEffect(() => {
    if (!isClient || categories.length === 0) return;
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('backgroundUrl', backgroundUrl);
  }, [backgroundUrl, isClient]);
  
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('backgroundColor', backgroundColor);
  }, [backgroundColor, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('backgroundOpacity', String(backgroundOpacity));
  }, [backgroundOpacity, isClient]);

  useEffect(() => {
    if (!isClient || images.length === 0) return;
    localStorage.setItem('images', JSON.stringify(images));
  }, [images, isClient]);
  

  const handleAddMemo = (memo: Omit<Memo, 'id' | 'createdAt'>) => {
    const newMemoData: Omit<Memo, 'id' | 'createdAt'> = {...memo};
    if (!newMemoData.imageUrl) {
        delete newMemoData.imageUrl;
    }
    const newMemo: Memo = {
      id: new Date().toISOString(),
      createdAt: new Date(),
      ...newMemoData
    };
    setMemos(prevMemos => [newMemo, ...prevMemos]);
  };

  const handleDeleteMemo = (id: string) => {
    setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id));
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(prev => prev.filter(c => c !== categoryToDelete));
    setMemos(prevMemos => prevMemos.map(memo => 
      memo.category === categoryToDelete ? { ...memo, category: undefined } : memo
    ));
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory(t('all'));
    }
  };
  
  const handleUpdateMemo = (updatedMemo: Memo) => {
    setMemos(prevMemos =>
      prevMemos.map(memo => (memo.id === updatedMemo.id ? updatedMemo : memo))
    );
  };
  
  const handleBackgroundChange = (url: string) => {
    setBackgroundUrl(url);
  };
  
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };
  
  const handleBackgroundOpacityChange = (opacity: number) => {
    setBackgroundOpacity(opacity);
  };

  const handleImageUpload = (imageDataUrl: string) => {
    const newImage: ImagePlaceholder = {
      id: `uploaded-${new Date().getTime()}`,
      description: t('uploaded'),
      imageUrl: imageDataUrl,
      imageHint: 'uploaded'
    };
    setImages(prev => [newImage, ...prev]);
    handleBackgroundChange(imageDataUrl);
  };

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(image => {
        const isDeletingCurrentImage = backgroundUrl === image.imageUrl && image.id === imageId;
        if(isDeletingCurrentImage) {
            setBackgroundUrl('');
        }
        return image.id !== imageId;
    }));
  };

  const handleDragEnd = (event: any) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      setMemos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredMemos = memos.filter(memo => {
    const categoryMatch =
      selectedCategory === t('all') ||
      memo.category === selectedCategory ||
      (selectedCategory === t('uncategorized') && !memo.category);

    const searchMatch =
      searchTerm === '' ||
      memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const finalBackgroundColor = colorToRgba(backgroundColor, 1);
  const finalOverlayColor = colorToRgba(backgroundColor, backgroundOpacity);

  if (!isClient) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar t={t}>
        <NewMemoForm onAddMemo={handleAddMemo} categories={categories} images={images} t={t}/>
        <AppSidebar.Categories 
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
            backgroundColor={backgroundColor}
            backgroundOpacity={backgroundOpacity}
            t={t}
        />
      </AppSidebar>
      <SidebarInset
        className="transition-all duration-300 ease-in-out"
        style={{ 
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
          backgroundColor: finalBackgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div 
          className="absolute inset-0 z-0" 
          style={{ backgroundColor: finalOverlayColor, transition: 'background-color 0.3s ease' }}
        />
        <div className="relative z-10 flex flex-col h-full bg-transparent">
          <Header
            onSearch={setSearchTerm}
            onBackgroundChange={handleBackgroundChange}
            onBackgroundColorChange={handleBackgroundColorChange}
            onBackgroundOpacityChange={handleBackgroundOpacityChange}
            backgroundColor={backgroundColor}
            backgroundOpacity={backgroundOpacity}
            onImageUpload={handleImageUpload}
            images={images}
            onImageDelete={handleImageDelete}
            t={t}
            language={language}
            setLanguage={(lang) => setLanguage(lang as Language)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <MemoList
              memos={memos}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              filteredMemos={filteredMemos}
              onDeleteMemo={handleDeleteMemo}
              onUpdateMemo={handleUpdateMemo}
              onDragEnd={handleDragEnd}
              images={images}
              t={t}
            />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
