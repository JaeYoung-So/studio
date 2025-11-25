'use client';

import type { Memo } from '@/lib/types';
import MemoCard from './memo-card';
import { FileQuestion } from 'lucide-react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';

interface MemoListProps {
  memos: Memo[];
  searchTerm: string;
  selectedCategory: string;
  onDeleteMemo: (id: string) => void;
  onUpdateMemo: (memo: Memo) => void;
  images: ImagePlaceholder[];
}

export default function MemoList({ memos, searchTerm, selectedCategory, onDeleteMemo, onUpdateMemo, images }: MemoListProps) {
  const filteredMemos = memos
    .filter(memo => {
      const categoryMatch =
        selectedCategory === '전체' ||
        (selectedCategory !== '전체' && memo.category === selectedCategory) ||
        (selectedCategory === '전체' && !memo.category);

      const searchMatch =
        searchTerm === '' ||
        memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.content.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filteredMemos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <FileQuestion className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-semibold font-headline">메모 없음</h2>
        <p>새 메모를 추가하거나 다른 카테고리를 확인해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {filteredMemos.map(memo => (
        <MemoCard key={memo.id} memo={memo} onDelete={onDeleteMemo} onUpdate={onUpdateMemo} images={images} />
      ))}
    </div>
  );
}
