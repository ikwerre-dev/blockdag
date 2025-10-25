import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()
    if (!address) {
      return NextResponse.json({ message: 'address is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { address } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const token = jwt.sign(
      { userId: user.id, address: user.address, handle: user.handle },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    // Create login notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'auth',
          title: 'Login Successful',
          message: 'You logged in with your wallet. Keep your recovery phrase safe.',
        },
      })
    } catch (e) {
      console.warn('Failed to create login notification:', e)
    }

    return NextResponse.json({ message: 'Wallet login successful', user })
  } catch (error) {
    console.error('Wallet login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}