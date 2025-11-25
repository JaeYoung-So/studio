'use client';

import { useState, useEffect } from 'react';

export const translations = {
  ko: {
    title: 'MyWay 메모',
    description: '당신의 생각을 빠르게 기록하세요',
    newMemo: '새 메모',
    memoTitle: '메모 제목',
    memoContent: '메모 내용',
    category: '카테고리',
    selectCategory: '카테고리 선택 (선택 사항)',
    selectNone: '선택 안함',
    uploadImage: '이미지 업로드',
    recordVoiceMemo: '음성 메모 녹음',
    decorate: '꾸미기',
    addMemo: '메모 추가',
    imageAdded: '이미지 추가됨',
    imageAddedDesc: '이미지가 메모에 추가되었습니다.',
    error: '오류',
    unsupportedFileType: '지원되지 않는 파일 형식입니다. (jpeg, png, webp, gif)',
    categoryNameRequired: '카테고리 이름을 입력해주세요.',
    categoryExists: '이미 존재하는 카테고리입니다.',
    success: '성공',
    categoryAdded: (category: string) => `'${category}' 카테고리가 추가되었습니다.`,
    categories: '카테고리',
    addNewCategory: '새 카테고리 추가',
    newCategoryName: '카테고리 이름',
    add: '추가',
    all: '전체',
    deleteCategoryTitle: '카테고리 삭제',
    deleteCategoryDesc: (category: string) => `'${category}' 카테고리를 정말로 삭제하시겠습니까? 이 카테고리에 속한 메모들은 '미분류' 상태가 됩니다.`,
    cancel: '취소',
    delete: '삭제',
    searchMemos: '메모 검색...',
    changeBackground: '배경 변경',
    selectBackground: '배경 선택',
    selectBackgroundDesc: '앱의 배경을 꾸며보세요.',
    color: '색상',
    colorOpacity: '색상 투명도',
    image: '이미지',
    upload: '업로드',
    deleteImageTitle: '이미지 삭제',
    deleteImageDesc: '이 이미지를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    noMemosTitle: '메모 없음',
    noMemosDesc: '새 메모를 추가하거나 다른 카테고리를 확인해 보세요.',
    deleteMemoTitle: '메모 삭제',
    deleteMemoDesc: '이 메모를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    decorating: '꾸미기',
    decorateMemo: '아이콘과 커버 이미지로 메모를 꾸며보세요.',
    icon: '아이콘',
    cover: '커버',
    remove: '삭제',
    coverImageChanged: '커버 이미지 변경됨',
    newCoverImageApplied: '새로운 커버 이미지가 적용되었습니다.',
    voice: '음성',
    uploaded: '업로드됨',
    uncategorized: '미분류',
    language: '언어',
    korean: '한국어',
    english: 'English',
  },
  en: {
    title: 'MyWay Memo',
    description: 'Jot down your thoughts quickly.',
    newMemo: 'New Memo',
    memoTitle: 'Memo Title',
    memoContent: 'Memo Content',
    category: 'Category',
    selectCategory: 'Select category (optional)',
    selectNone: 'None',
    uploadImage: 'Upload Image',
    recordVoiceMemo: 'Record Voice Memo',
    decorate: 'Decorate',
    addMemo: 'Add Memo',
    imageAdded: 'Image Added',
    imageAddedDesc: 'The image has been added to the memo.',
    error: 'Error',
    unsupportedFileType: 'Unsupported file type. (jpeg, png, webp, gif)',
    categoryNameRequired: 'Please enter a category name.',
    categoryExists: 'This category already exists.',
    success: 'Success',
    categoryAdded: (category: string) => `Category '${category}' has been added.`,
    categories: 'Categories',
    addNewCategory: 'Add New Category',
    newCategoryName: 'Category Name',
    add: 'Add',
    all: 'All',
    deleteCategoryTitle: 'Delete Category',
    deleteCategoryDesc: (category: string) => `Are you sure you want to delete the '${category}' category? Memos in this category will become 'uncategorized'.`,
    cancel: 'Cancel',
    delete: 'Delete',
    searchMemos: 'Search memos...',
    changeBackground: 'Change Background',
    selectBackground: 'Select Background',
    selectBackgroundDesc: 'Customize the app background.',
    color: 'Color',
    colorOpacity: 'Color Opacity',
    image: 'Image',
    upload: 'Upload',
    deleteImageTitle: 'Delete Image',
    deleteImageDesc: 'Are you sure you want to delete this image? This action cannot be undone.',
    noMemosTitle: 'No Memos',
    noMemosDesc: 'Add a new memo or check other categories.',
    deleteMemoTitle: 'Delete Memo',
    deleteMemoDesc: 'Are you sure you want to delete this memo? This action cannot be undone.',
    decorating: 'Decorating',
    decorateMemo: 'Decorate your memo with icons and cover images.',
    icon: 'Icon',
    cover: 'Cover',
    remove: 'Remove',
    coverImageChanged: 'Cover Image Changed',
    newCoverImageApplied: 'The new cover image has been applied.',
    voice: 'Voice',
    uploaded: 'Uploaded',
    uncategorized: 'Uncategorized',
    language: 'Language',
    korean: '한국어',
    english: 'English',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['ko'];

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey, ...args: any[]) => {
    const translation = translations[language][key] || translations['en'][key];
    if (typeof translation === 'function') {
      return (translation as (...args: any[]) => string)(...args);
    }
    return translation as string;
  };

  return { t, setLanguage, language };
};
