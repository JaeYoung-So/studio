'use client';

import type { Memo } from '@/lib/types';
import MemoCard from './memo-card';
import { FileQuestion } from 'lucide-react';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';

interface MemoListProps {
  memos: Memo[];
  searchTerm: string;
  selectedCategory: string;
  filteredMemos: Memo[];
  onDeleteMemo: (id: string) => void;
  onUpdateMemo: (memo: Memo) => void;
  onDragEnd: (event: any) => void;
  images: ImagePlaceholder[];
  t: (key: any) => string;
}

export default function MemoList({ memos, searchTerm, selectedCategory, filteredMemos, onDeleteMemo, onUpdateMemo, onDragEnd, images, t }: MemoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
    
  if (filteredMemos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <FileQuestion className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-semibold font-headline">{t('noMemosTitle')}</h2>
        <p>{t('noMemosDesc')}</p>
      </div>
    );
  }

  const sortedMemos = searchTerm === '' && selectedCategory === t('all') 
  ? memos
  : filteredMemos;

  return (
    <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
    >
        <SortableContext
            items={sortedMemos.map(memo => memo.id)}
            strategy={verticalListSortingStrategy}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {sortedMemos.map(memo => (
                    <MemoCard key={memo.id} memo={memo} onDelete={onDeleteMemo} onUpdate={onUpdateMemo} images={images} t={t} />
                ))}
            </div>
        </SortableContext>
    </DndContext>
  );
}
