import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('userId');

    // Fallback to authenticated user if no userId provided
    if (!userId) {
      const token = req.cookies.get('auth-token')?.value;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
          userId = decoded.userId;
        } catch {
          // ignore token errors and return missing userId below
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const card = await prisma.medicalCard.findUnique({ where: { userId } });
    return NextResponse.json({ card });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string | null = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const color = (body?.color as string | undefined) || undefined;
    const text = (body?.text as string | undefined) || undefined;

    // Basic validation
    if (color && typeof color !== 'string') {
      return NextResponse.json({ error: 'Invalid color' }, { status: 400 });
    }
    if (text && typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
    }

    const updated = await prisma.medicalCard.upsert({
      where: { userId: userId! },
      update: { color: color ?? undefined, text: text ?? undefined },
      create: { userId: userId!, color: color ?? '#194dbe', text: text ?? null },
    });

    return NextResponse.json({ ok: true, card: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}