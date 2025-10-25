import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: string | undefined = body?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const card = await prisma.medicalCard.findUnique({ where: { userId } });
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const today = new Date();
    const key = today.toISOString().slice(0, 10);
    const viewsByDay = (card.viewsByDay as Record<string, number> | null) || {};
    const newViewsByDay = { ...viewsByDay, [key]: (viewsByDay[key] || 0) + 1 };

    const updated = await prisma.medicalCard.update({
      where: { userId },
      data: {
        viewsCount: (card.viewsCount || 0) + 1,
        viewsByDay: newViewsByDay,
      },
    });

    return NextResponse.json({ ok: true, viewsCount: updated.viewsCount, viewsByDay: updated.viewsByDay });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}