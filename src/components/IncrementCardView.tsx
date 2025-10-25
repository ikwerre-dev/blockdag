"use client";
import { useEffect } from 'react';

export default function IncrementCardView({ userId }: { userId: string }) {
  useEffect(() => {
    if (!userId) return;
    fetch('/api/card/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  }, [userId]);

  return null;
}