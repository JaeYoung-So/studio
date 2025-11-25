'use client';

import type { Memo } from '@/lib/types';
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app/app-sidebar';
import Header from '@/components/app/header';
import MemoList from '@/components/app/memo-list';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { colorToRgba } from '@/lib/utils';

const initialMemos: Memo[] = [
  {
    id: '1',
    title: '회의 준비',
    content: '다음 주 월요일 팀 회의 안건 정리. 1분기 실적 보고 및 2분기 계획 발표.',
    category: '업무',
    isVoiceMemo: false,
    createdAt: new Date('2023-10-26T10:00:00Z'),
    imageUrl: PlaceHolderImages.find(p => p.id === 'memo-1')?.imageUrl,
    icon: 'briefcase',
    coverImageUrl: PlaceHolderImages.find(p => p.id === 'bg-1')?.imageUrl,
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
    coverImageUrl: PlaceHolderImages.find(p => p.id === 'bg-3')?.imageUrl,
  },
];

const INITIAL_CATEGORIES = ['일상', '업무', '아이디어', '중요'];

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('hsl(210 40% 98%)');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.8);
  const [uploadedImages, setUploadedImages] = useState<ImagePlaceholder[]>([]);

  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos).map((memo: any) => ({...memo, createdAt: new Date(memo.createdAt)})));
    } else {
      setMemos(initialMemos);
    }
    
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
    }

    const storedBgUrl = localStorage.getItem('backgroundUrl');
    if (storedBgUrl) setBackgroundUrl(storedBgUrl);
    
    const storedBgColor = localStorage.getItem('backgroundColor');
    if(storedBgColor) setBackgroundColor(storedBgColor);
    
    const storedBgOpacity = localStorage.getItem('backgroundOpacity');
    if (storedBgOpacity) setBackgroundOpacity(parseFloat(storedBgOpacity));

    const storedUploadedImages = localStorage.getItem('uploadedImages');
    if (storedUploadedImages) setUploadedImages(JSON.parse(storedUploadedImages));
  }, []);

  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem('memos', JSON.stringify(memos));
    }
  }, [memos]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('backgroundUrl', backgroundUrl);
  }, [backgroundUrl]);
  
  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem('backgroundOpacity', String(backgroundOpacity));
  }, [backgroundOpacity]);

  useEffect(() => {
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  const handleAddMemo = (memo: Omit<Memo, 'id' | 'createdAt'>) => {
    const newMemo: Memo = {
      ...memo,
      id: new Date().toISOString(),
      createdAt: new Date(),
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
      setSelectedCategory('전체');
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
      description: '업로드됨',
      imageUrl: imageDataUrl,
      imageHint: 'uploaded'
    };
    setUploadedImages(prev => [...prev, newImage]);
    handleBackgroundChange(imageDataUrl);
  };

  const finalBackgroundColor = colorToRgba(backgroundColor, 1);
  const finalOverlayColor = colorToRgba(backgroundColor, backgroundOpacity);

  return (
    <SidebarProvider>
      <AppSidebar 
        onAddMemo={handleAddMemo}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onSelectCategory={handleCategorySelect}
        selectedCategory={selectedCategory}
        backgroundColor={backgroundColor}
        backgroundOpacity={backgroundOpacity}
      />
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
            uploadedImages={uploadedImages}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <MemoList
              memos={memos}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onDeleteMemo={handleDeleteMemo}
              onUpdateMemo={handleUpdateMemo}
            />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
