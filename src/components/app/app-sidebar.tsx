
'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
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

interface AppSidebarProps {
    children: React.ReactNode;
    t: (key: any) => string;
}

const AppSidebar: React.FC<AppSidebarProps> & AppSidebarComposition = ({ children, t }) => {
  return (
    <Sidebar className={cn('border-none')}>
      <ScrollArea className="h-full rounded-lg bg-white">
        <SidebarHeader className="bg-transparent">
          <h2 className="text-lg font-headline font-semibold">{t('newMemo')}</h2>
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
  t: (key: any, ...args: any[]) => string;
}

function AppSidebarCategories({ 
  categories,
  onAddCategory,
  onDeleteCategory,
  onSelectCategory, 
  selectedCategory, 
  t,
}: AppSidebarCategoriesProps) {
  const allString = t('all');
  const allCategories = [allString, ...categories, t('uncategorized')];
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('categoryNameRequired'),
      });
      return;
    }
    if (categories.includes(newCategory.trim())) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('categoryExists'),
      });
      return;
    }
    onAddCategory(newCategory.trim());
    setNewCategory('');
    toast({
      title: t('success'),
      description: t('categoryAdded', newCategory.trim()),
    });
  };

  return (
    <SidebarContent>
        <SidebarGroup>
        <div className="flex justify-between items-center pr-2">
            <SidebarGroupLabel>{t('categories')}</SidebarGroupLabel>
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
                <div className="space-y-2">
                <p className="font-medium">{t('addNewCategory')}</p>
                <div className="flex gap-2">
                    <Input 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder={t('newCategoryName')}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button onClick={handleAddCategory}>{t('add')}</Button>
                </div>
                </div>
            </PopoverContent>
            </Popover>
        </div>
        <SidebarMenu>
            {allCategories.map(category => (
             <AlertDialog key={category}>
                <SidebarMenuItem className="group/item relative">
                    <SidebarMenuButton
                        onClick={() => onSelectCategory(category)}
                        isActive={selectedCategory === category}
                        className="w-full justify-start"
                    >
                    {category}
                    </SidebarMenuButton>
                    {category !== allString && category !== t('uncategorized') && (
                        <>
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
                            <AlertDialogTitle>{t('deleteCategoryTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('deleteCategoryDesc', category)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                  onDeleteCategory(category);
                              }}
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                       </>
                    )}
                </SidebarMenuItem>
            </AlertDialog>
            ))}
        </SidebarMenu>
        </SidebarGroup>
    </SidebarContent>
  );
}

AppSidebar.Categories = AppSidebarCategories;

export default AppSidebar;
