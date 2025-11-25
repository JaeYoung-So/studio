'use client';

import type { Memo } from '@/lib/types';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import NewMemoForm from './new-memo-form';
import { CATEGORIES } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface AppSidebarProps {
  onAddMemo: (memo: Omit<Memo, 'id' | 'createdAt'>) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export default function AppSidebar({ onAddMemo, onSelectCategory, selectedCategory }: AppSidebarProps) {
  const allCategories = ['전체', ...CATEGORIES];

  return (
    <Sidebar>
      <ScrollArea className="h-full">
        <SidebarHeader>
          <h2 className="text-lg font-headline font-semibold">새 메모</h2>
          <NewMemoForm onAddMemo={onAddMemo} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>카테고리</SidebarGroupLabel>
            <SidebarMenu>
              {allCategories.map(category => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    onClick={() => onSelectCategory(category)}
                    isActive={selectedCategory === category}
                    className="w-full justify-start"
                  >
                    {category}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
