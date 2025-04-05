import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from '@auth0/nextjs-auth0';
import { initiateMpesaWithdrawal } from '@/lib/mpesa';

// Get wallet balance and transactions
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the doctor's wallet
    const doctor = await prisma.doctorApplication.findFirst({
      where: { email: session.user.email },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10, // Get last 10 transactions
            },
          },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (!doctor.wallet) {
      // Create wallet if it doesn't exist
      const wallet = await prisma.wallet.create({
        data: {
          doctorId: doctor.id,
          balance: 0,
        },
        include: {
          transactions: true,
        },
      });
      return NextResponse.json(wallet);
    }

    return NextResponse.json(doctor.wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}

// Handle withdrawals
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid withdrawal amount' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Get the doctor's wallet
    const doctor = await prisma.doctorApplication.findFirst({
      where: { email: session.user.email },
      include: { wallet: true },
    });

    if (!doctor || !doctor.wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    if (doctor.wallet.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create withdrawal transaction
    const transaction = await prisma.$transaction.create({
      data: {
        amount,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        description: `Withdrawal to ${phoneNumber}`,
        walletId: doctor.wallet.id,
      },
    });

    try {
      // Initiate M-Pesa withdrawal
      const mpesaResponse = await initiateMpesaWithdrawal(
        phoneNumber,
        amount,
        transaction.id
      );

      // Update transaction status
      await prisma.$transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          description: `Withdrawal to ${phoneNumber} (M-Pesa Ref: ${mpesaResponse.ConversationID})`,
        },
      });

      // Update wallet balance
      await prisma.wallet.update({
        where: { id: doctor.wallet.id },
        data: { balance: { decrement: amount } },
      });

      return NextResponse.json({
        success: true,
        transaction,
        mpesaResponse,
      });
    } catch (error) {
      // Update transaction status to failed
      await prisma.$transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
} 