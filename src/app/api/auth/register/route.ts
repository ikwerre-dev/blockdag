import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      address,
      type, // 'user' | 'provider'
      handle,
      displayName,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodType,
      addressLine,
      city,
      region,
      postalCode,
      country,
      emergencyContactName,
      emergencyContactPhone,
      encryptionKey,
      encryptionSalt,
    } = body as {
      address: string
      type?: 'user' | 'provider'
      handle?: string
      displayName?: string
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      dateOfBirth?: string
      gender?: string
      bloodType?: string
      addressLine?: string
      city?: string
      region?: string
      postalCode?: string
      country?: string
      emergencyContactName?: string
      emergencyContactPhone?: string
      encryptionKey?: string
      encryptionSalt?: string
    }

    if (!address) {
      return NextResponse.json({ message: 'address required' }, { status: 400 })
    }

    const prefix = type === 'provider' ? 'provider' : 'user'
    const resolvedHandle = handle || `${prefix}-${address.slice(2, 8)}`

    const dob = dateOfBirth ? new Date(dateOfBirth) : undefined
    if (dateOfBirth && isNaN(dob!.getTime())) {
      return NextResponse.json({ message: 'invalid dateOfBirth' }, { status: 400 })
    }

    const user = await prisma.user.upsert({
      where: { address },
      update: {
        handle: resolvedHandle,
        displayName,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dob,
        gender,
        bloodType,
        addressLine,
        city,
        region,
        postalCode,
        country,
        emergencyContactName,
        emergencyContactPhone,
        encryptionKey,
        encryptionSalt,
      },
      create: {
        address,
        handle: resolvedHandle,
        displayName,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dob,
        gender,
        bloodType,
        addressLine,
        city,
        region,
        postalCode,
        country,
        emergencyContactName,
        emergencyContactPhone,
        encryptionKey,
        encryptionSalt,
      },
    })

    // Create signup notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'auth',
          title: 'Welcome to Bivo Health',
          message: 'Your account was created successfully. Start managing your encrypted medical records.',
        },
      })
    } catch (e) {
      console.warn('Failed to create signup notification:', e)
    }

    return NextResponse.json({ message: 'User registered', user }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}