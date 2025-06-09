'use client';

import { useBlinkingTitle } from '@/hooks/useBlinkingTitle';

export function BlinkingTitle({ defaultTitle }: { defaultTitle: string }) {
  useBlinkingTitle(defaultTitle);
  return null;
} 