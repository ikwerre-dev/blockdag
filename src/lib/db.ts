import mysql from 'mysql2/promise'
import { PrismaClient } from '../generated/prisma/client'
import path from 'path'
import fs from 'fs'

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'VelTrust',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const db = {
  query: async (sql: string, params?: any[]) => {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  },
}

// Prisma client for SQLite usage (Next.js hot-reload safe)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Prefer env DATABASE_URL, fallback to local dev db path
const envUrl = process.env.DATABASE_URL
const prismaDatasourceUrl = envUrl?.startsWith('file:')
  ? `file:${path.resolve(process.cwd(), envUrl.replace('file:', ''))}`
  : envUrl || `file:${path.resolve(process.cwd(), 'prisma/dev.db')}`

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ datasources: { db: { url: prismaDatasourceUrl } } })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma