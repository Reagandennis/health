import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber } = await request.json();

    // Validate amount
    if (amount < 200) {
      return NextResponse.json(
        { error: 'Minimum withdrawal amount is KES 200' },
        { status: 400 }
      );
    }

    // Get doctor and wallet
    const doctor = await prisma.doctorApplication.findFirst({
      where: { email: session.user.email },
      select: {
        id: true,
        wallet: {
          select: {
            id: true,
            balance: true
          }
        }
      }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (!doctor.wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check if sufficient balance
    if (doctor.wallet.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create transaction and update wallet in a single transaction
    const result = await prisma.$transaction([
      // Create transaction record
      prisma.transaction.create({
        data: {
          amount,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          walletId: doctor.wallet.id,
          description: `Withdrawal to M-Pesa ${phoneNumber}`
        }
      }),

      // Update wallet balance
      prisma.wallet.update({
        where: { id: doctor.wallet.id },
        data: {
          balance: {
            decrement: amount
          }
        }
      }),

      // Update transaction status (we'll update the first transaction we just created)
      prisma.transaction.updateMany({
        where: {
          walletId: doctor.wallet.id,
          type: 'WITHDRAWAL',
          status: 'PENDING'
        },
        data: {
          status: 'COMPLETED'
        }
      })
    ]);

    return NextResponse.json({
      message: 'Withdrawal successful',
      transactionId: result[0].id
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
} 