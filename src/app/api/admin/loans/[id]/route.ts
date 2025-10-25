import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface UpdateBody {
    status: string;
}
async function generateTransactionId(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let isUnique = false;
    let result = '';
  
    while (!isUnique) {
      result = '';
      for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
  
      // Check if the ID already exists in the database
      const [existing] = await db.query(
        "SELECT id FROM transactions WHERE transaction_hash = ?",
        [result]
      ) as RowDataPacket[];
  
      if (!existing || existing.length === 0) {
        isUnique = true;
      }
    }
  
    return result;
  }
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await verifyAdminToken(request);
        const body: UpdateBody = await request.json();
        const { status } = body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status value' },
                { status: 400 }
            );
        }
        const [loanRequest] = await db.query(
            'SELECT user_id FROM loan_requests WHERE id = ?',
            [params.id]
        ) as RowDataPacket[];

        if (!loanRequest || loanRequest.length === 0) {
            return NextResponse.json(
                { message: 'Loan request not found' },
                { status: 404 }
            );
        }

        console.log(loanRequest);

        const userId = loanRequest.user_id;
        const transactionHash = await generateTransactionId();


        await db.query(
            'UPDATE loan_requests SET status = ? WHERE id = ?',
            [status, params.id]
        );

        if (status === 'approved') {
            const [loanDetails] = await db.query(
                'SELECT amount FROM loan_requests WHERE id = ?',
                [params.id]
            ) as RowDataPacket[];

            await db.query(
                `INSERT INTO transactions 
                 (sender_id, recipient_id, amount, currency, status, type, description, created_at, updated_at, sender, recipient, transaction_hash) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`,
                [
                    1,
                    userId,
                    loanDetails.amount,
                    'USD',
                    'paid',
                    'loan_disbursement',
                    'Loan disbursement',
                    'Loan System',
                    'User',
                    transactionHash
                    
                ]
            ); 

            await db.query(
                'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
                [loanDetails.amount, userId]
            );

            await db.query(
                'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
                [userId, 'loan', 'Loan Approved', 'Your loan request has been approved.']
            );
        }

        return NextResponse.json({ message: 'Loan status updated' });
    } catch (error) {
        console.error('Error updating loan status:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}