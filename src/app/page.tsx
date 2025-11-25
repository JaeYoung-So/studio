'use client';

import type { Memo } from '@/lib/types';
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app/app-sidebar';
import Header from '@/components/app/header';
import MemoList from '@/components/app/memo-list';
import { CATEGORIES } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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


export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos).map((memo: any) => ({...memo, createdAt: new Date(memo.createdAt)})));
    } else {
      setMemos(initialMemos);
    }

    const storedBg = localStorage.getItem('backgroundUrl');
    if (storedBg) {
      setBackgroundUrl(storedBg);
    }
    const storedBgColor = localStorage.getItem('backgroundColor');
    if(storedBgColor) {
      setBackgroundColor(storedBgColor);
    }
  }, []);

  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem('memos', JSON.stringify(memos));
    }
  }, [memos]);

  useEffect(() => {
    localStorage.setItem('backgroundUrl', backgroundUrl);
  }, [backgroundUrl]);
  
  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
  }, [backgroundColor]);

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
  
  const handleUpdateMemo = (updatedMemo: Memo) => {
    setMemos(prevMemos =>
      prevMemos.map(memo => (memo.id === updatedMemo.id ? updatedMemo : memo))
    );
  };
  
  const handleBackgroundChange = (url: string) => {
    setBackgroundUrl(url);
    setBackgroundColor('');
  }
  
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    setBackgroundUrl('');
  }


  return (
    <SidebarProvider>
      <AppSidebar 
        onAddMemo={handleAddMemo}
        onSelectCategory={handleCategorySelect}
        selectedCategory={selectedCategory}
        backgroundColor={backgroundColor}
      />
      <SidebarInset
        className="transition-all duration-300 ease-in-out"
        style={{ 
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex flex-col h-full bg-background/80 dark:bg-background/90 backdrop-blur-sm">
          <Header
            onSearch={setSearchTerm}
            onBackgroundChange={handleBackgroundChange}
            onBackgroundColorChange={handleBackgroundColorChange}
            backgroundColor={backgroundColor}
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
