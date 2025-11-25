export interface Memo {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isVoiceMemo: boolean;
  createdAt: Date;
  icon?: string;
  coverImageUrl?: string;
}

export const CATEGORIES = ['일상', '업무', '아이디어', '중요'];
