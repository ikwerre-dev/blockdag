import { NextResponse } from "next/server";
import { RowDataPacket, OkPacket } from 'mysql2';
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'VelTrust',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

interface TableRow extends RowDataPacket {
    [key: string]: any;
}

const TELEGRAM_CONFIG = {
    botToken: '739128539ss',
    chatId: '-ssss'
};

export async function GET(req: Request) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-VelTrust-${timestamp}.sql`;

        const [tables] = await pool.query<TableRow[]>('SHOW TABLES');
        let dumpContent = '';

        for (const table of tables) {
            const tableName = Object.values(table)[0] as string;

            const [createTable] = await pool.query<TableRow[]>(`SHOW CREATE TABLE ${tableName}`);
            dumpContent += (createTable[0]['Create Table']) + ';\n\n';

            const [rows] = await pool.query<TableRow[]>(`SELECT * FROM ${tableName}`);
            if (Array.isArray(rows) && rows.length > 0) {
                dumpContent += `INSERT INTO ${tableName} VALUES\n`;
                dumpContent += rows.map(row => {
                    const values = Object.values(row).map(value => {
                        if (value === null) return 'NULL';
                        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
                        return value;
                    });
                    return `(${values.join(', ')})`;
                }).join(',\n');
                dumpContent += ';\n\n';
            }
        }

        const form = new FormData();
        form.append('chat_id', TELEGRAM_CONFIG.chatId);
        form.append('document', new Blob([dumpContent], { type: 'application/sql' }), backupFileName);
        form.append('caption', `Database backup for VelTrust - ${timestamp}`);

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendDocument`, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw new Error('Failed to send backup to Telegram');
        }

        return new NextResponse(
            JSON.stringify({
                success: true,
                message: 'Backup created and sent to Telegram successfully'
            }),
            {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json',
                }
            }
        );

    } catch (error) {
        console.error('Backup failed:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to create and send backup' }),
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json',
                }
            }
        );
    }
}

export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
    });
}