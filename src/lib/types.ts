export interface Memo {
  id: string;
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
  isVoiceMemo: boolean;
  createdAt: Date;
  icon?: string;
  coverImageUrl?: string;
}

// This is now used as initial categories, but not the source of truth.
export const CATEGORIES = ['일상', '업무', '아이디어', '중요'];
