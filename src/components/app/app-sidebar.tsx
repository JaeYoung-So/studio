'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { ScrollArea } from '../ui/scroll-area';
import { cn, colorToRgba } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
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


interface AppSidebarComposition {
  Categories: typeof AppSidebarCategories;
}

const AppSidebar: React.FC<React.PropsWithChildren<{}>> & AppSidebarComposition = ({ children }) => {
  return (
    <Sidebar className={cn('border-none')}>
      <ScrollArea className="h-full rounded-lg bg-white">
        <SidebarHeader className="bg-transparent">
          <h2 className="text-lg font-headline font-semibold">새 메모</h2>
          {children}
        </SidebarHeader>
      </ScrollArea>
    </Sidebar>
  );
};

interface AppSidebarCategoriesProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  backgroundColor?: string;
  backgroundOpacity: number;
}

function AppSidebarCategories({ 
  categories,
  onAddCategory,
  onDeleteCategory,
  onSelectCategory, 
  selectedCategory, 
}: AppSidebarCategoriesProps) {
  const allCategories = ['전체', ...categories];
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '카테고리 이름을 입력해주세요.',
      });
      return;
    }
    if (categories.includes(newCategory.trim())) {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '이미 존재하는 카테고리입니다.',
      });
      return;
    }
    onAddCategory(newCategory.trim());
    setNewCategory('');
    toast({
      title: '성공',
      description: `'${newCategory.trim()}' 카테고리가 추가되었습니다.`,
    });
  };

  return (
    <SidebarContent>
        <SidebarGroup>
        <div className="flex justify-between items-center pr-2">
            <SidebarGroupLabel>카테고리</SidebarGroupLabel>
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
                <div className="space-y-2">
                <p className="font-medium">새 카테고리 추가</p>
                <div className="flex gap-2">
                    <Input 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="카테고리 이름"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button onClick={handleAddCategory}>추가</Button>
                </div>
                </div>
            </PopoverContent>
            </Popover>
        </div>
        <SidebarMenu>
            {allCategories.map(category => (
            <SidebarMenuItem key={category} className="group/item relative">
                <SidebarMenuButton
                onClick={() => onSelectCategory(category)}
                isActive={selectedCategory === category}
                className="w-full justify-start"
                >
                {category}
                </SidebarMenuButton>
                {category !== '전체' && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                                >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              '{category}' 카테고리를 정말로 삭제하시겠습니까? 이 카테고리에 속한 메모들은 '미분류' 상태가 됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                  onDeleteCategory(category);
                              }}
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </SidebarMenuItem>
            ))}
        </SidebarMenu>
        </SidebarGroup>
    </SidebarContent>
  );
}

AppSidebar.Categories = AppSidebarCategories;

export default AppSidebar;
