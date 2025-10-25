import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"
import jwt from "jsonwebtoken"

// Add to imports
 
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

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: number; email: string }

    // Get request body
    const { recipientId, p2pCode, amount, note, currency } = await request.json()

    if (!recipientId || !amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid transfer details" }, { status: 400 })
    }

    // Check if sender has enough balance
    const senderWallets = (await db.query(
      "SELECT id, balance, currency FROM wallets WHERE user_id = ? AND currency = ?",
      [decoded.userId, currency],
    )) as RowDataPacket[]

    if (senderWallets.length === 0) {
      return NextResponse.json({ message: "Sender wallet not found" }, { status: 404 })
    }

    const senderWallet = senderWallets[0]

    if (senderWallet.balance < amount) {
      return NextResponse.json({ message: "Insufficient funds" }, { status: 400 })
    }

    // Get recipient wallet or create one if it doesn't exist
    const recipientWallets = (await db.query(
      "SELECT id, balance, currency FROM wallets WHERE user_id = ? AND currency = ?",
      [recipientId, currency],
    )) as RowDataPacket[]

    let recipientWalletId

    if (recipientWallets.length === 0) {
      // Create a new wallet for the recipient
      const newWalletResult = (await db.query("INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, ?)", [
        recipientId,
        0,
        currency,
      ])) as any

      recipientWalletId = newWalletResult.insertId
    } else {
      recipientWalletId = recipientWallets[0].id
    }

    // Get sender and recipient names for the transaction record
    const senderData = (await db.query("SELECT CONCAT(first_name, ' ', last_name) as name FROM users WHERE id = ?", [
      decoded.userId,
    ])) as RowDataPacket[]

    const recipientData = (await db.query("SELECT CONCAT(first_name, ' ', last_name) as name FROM users WHERE id = ?", [
      recipientId,
    ])) as RowDataPacket[]

    // Generate a transaction hash
    const transactionHash = await generateTransactionId();

    // Update sender's balance
    await db.query("UPDATE wallets SET balance = balance - ? WHERE id = ?", [amount, senderWallet.id])

    // Update recipient's balance
    await db.query("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amount, recipientWalletId])

    // Create transaction record
    await db.query(
      `INSERT INTO transactions 
       (sender_id, recipient_id, sender, recipient, amount, currency, status, type, transaction_hash, description, meta_data) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.userId,
        recipientId,
        senderData[0].name,
        recipientData[0].name,
        amount,
        currency,
        "paid",
        "p2p_transfer",
        transactionHash,
        note || "P2P Transfer",
        JSON.stringify({ p2p_code: p2pCode }),
      ],
    )

    // Create notifications for both sender and recipient
    await db.query("INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)", [
      decoded.userId,
      "transaction",
      "Money Sent",
      `You sent ${currency} ${amount.toFixed(2)} to ${recipientData[0].name}`,
    ])

    await db.query("INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)", [
      recipientId,
      "transaction",
      "Money Received",
      `You received ${currency} ${amount.toFixed(2)} from ${senderData[0].name}`,
    ])

    // Get user emails and first names
    const [senderFullData, recipientFullData] = await Promise.all([
      db.query("SELECT email, first_name FROM users WHERE id = ?", [decoded.userId]) as Promise<RowDataPacket[]>,
      db.query("SELECT email, first_name FROM users WHERE id = ?", [recipientId]) as Promise<RowDataPacket[]>
    ]);

    // Send email notifications
    

    return NextResponse.json({
      message: "Transfer completed successfully",
      transactionHash,
    })
  } catch (error) {
    console.error("P2P transfer error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
