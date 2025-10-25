import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { convertCurrency, fetchCurrencyRates } from "@/lib/helpers/currencyHelper"
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
    const {
      recipientName,
      recipientEmail,
      accountNumber,
      swiftCode,
      amount,
      convertedAmount,
      fee,
      note,
      country,
      paymentMethodId,
      sourceCurrency,
      targetCurrency,
    } = await request.json()

    if (!recipientName || !accountNumber || !amount || amount <= 0 || !country) {
      return NextResponse.json({ message: "Invalid transfer details" }, { status: 400 })
    }

    // Check if sender has enough balance
    const senderWallets = (await db.query(
      "SELECT id, balance, currency FROM wallets WHERE user_id = ? AND currency = ?",
      [decoded.userId, sourceCurrency],
    )) as RowDataPacket[]

    if (senderWallets.length === 0) {
      return NextResponse.json({ message: "Sender wallet not found" }, { status: 404 })
    }

    const senderWallet = senderWallets[0]
    const totalAmount = amount + fee 

    if (senderWallet.balance < totalAmount) {
      return NextResponse.json({ message: "Insufficient funds" }, { status: 400 })
    }

    // Get the latest exchange rates to verify the conversion
    const rates = await fetchCurrencyRates()
    const calculatedConvertedAmount = convertCurrency(
      amount,
      sourceCurrency.toLowerCase(),
      targetCurrency.toLowerCase(),
      rates,
    )

    // Verify the conversion is within acceptable range (5% tolerance)
    const conversionDifference = Math.abs(calculatedConvertedAmount - convertedAmount) / calculatedConvertedAmount
    if (conversionDifference > 5) {
      return NextResponse.json(
        {
          message: "Exchange rate has changed significantly. Please try again.",
        },
        { status: 400 },
      )
    }

    // Get sender and recipient data
    const senderData = (await db.query("SELECT CONCAT(first_name, ' ', last_name) as name FROM users WHERE id = ?", [
      decoded.userId,
    ])) as RowDataPacket[]

    // Get recipient data (assuming recipient is a user in the system, modify as needed)
    const recipientData = (await db.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM users WHERE email = ?", [
      recipientEmail || '',
    ])) as RowDataPacket[]

    // Generate a transaction hash
    const transactionHash = await generateTransactionId();

    // Update sender's balance
    await db.query("UPDATE wallets SET balance = balance - ? WHERE id = ?", [totalAmount, senderWallet.id])

 
    // Create transaction record with new schema
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await db.query(
      `INSERT INTO transactions 
       ( sender_id, recipient_id, amount, type, currency, status, description, 
        created_at, updated_at, sender, recipient, transaction_hash, meta_data) 
       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.userId,
        decoded.userId,
        amount,
        "international_transfer",
        sourceCurrency,
        "pending",
        note || `International transfer to ${recipientName} in ${country.name}`,
        currentDate,
        currentDate,
        senderData[0].name,
        recipientData.length > 0 ? recipientData[0].name : recipientName,
        transactionHash,
        JSON.stringify({
          recipientEmail,
          accountNumber,
          swiftCode,
          convertedAmount,
          targetCurrency,
          countryCode: country.code,
          countryName: country.name,
          fee,
          paymentMethodId,
        }),
      ],
    )

    // Create notification for sender
    await db.query("INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)", [
      decoded.userId,
      "transaction",
      "International Transfer Initiated",
      `Your transfer of ${sourceCurrency} ${amount.toFixed(2)} to ${recipientName} in ${country.name} is being processed.`,
    ])

    // Get sender email and first name
    const senderFullData = await db.query(
      "SELECT email, first_name FROM users WHERE id = ?",
      [decoded.userId]
    ) as RowDataPacket[];
     // If recipient email is provided, send them a notification too
    

    return NextResponse.json({
      message: "International transfer initiated successfully",
      transactionHash,
    });
  } catch (error) {
    console.error("International transfer error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 })
    }

    const [transaction] = await db.query(
      `SELECT t.*, 
        JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.convertedAmount')) as convertedAmount,
        JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.targetCurrency')) as targetCurrency,
        JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.countryName')) as countryName,
        JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.fee')) as fee,
        JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.accountNumber')) as accountNumber
      FROM transactions t
      WHERE transaction_hash = ?`,
      [id]
    ) as RowDataPacket[]

    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 })
    }

    const response = {
      amount: transaction.amount,
      convertedAmount: parseFloat(transaction.convertedAmount),
      fee: parseFloat(transaction.fee),
      exchangeRate: parseFloat(transaction.convertedAmount) / transaction.amount,
      recipientName: transaction.recipient,
      bankName: transaction.bank_name || '',
      accountNumber: transaction.accountNumber,
      transactionHash: transaction.transaction_hash,
      status: transaction.status,
      country: {
        name: transaction.countryName,
        currency: transaction.targetCurrency
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}