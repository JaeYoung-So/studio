'use client';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is a client component, but we can't use the useTranslation hook here
  // because we need to set the lang attribute on the html tag before the page is hydrated.
  // The useTranslation hook will handle it on the client side.
  
  return (
    <html lang="ko">
      <head>
        <title>휙휙 메모</title>
        <meta name="description" content="당신의 생각을 빠르게 기록하세요" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
