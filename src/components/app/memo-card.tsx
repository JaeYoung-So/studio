'use client';

import type { Memo } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface MemoCardProps {
  memo: Memo;
  onDelete: (id: string) => void;
}

export default function MemoCard({ memo, onDelete }: MemoCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-headline">{memo.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(memo.id)}
          aria-label="메모 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {memo.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src={memo.imageUrl}
              alt={memo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="memo image"
            />
          </div>
        )}
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{memo.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{memo.category}</Badge>
          {memo.isVoiceMemo && (
            <div className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              <span>음성</span>
            </div>
          )}
        </div>
        <span>
          {formatDistanceToNow(new Date(memo.createdAt), { addSuffix: true, locale: ko })}
        </span>
      </CardFooter>
    </Card>
  );
}
