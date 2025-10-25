-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "warningNotes" TEXT,
    "data" TEXT NOT NULL,
    "hash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicalRecord" ("createdAt", "data", "description", "hash", "id", "title", "type", "userId", "warningNotes") SELECT "createdAt", "data", "description", "hash", "id", "title", "type", "userId", "warningNotes" FROM "MedicalRecord";
DROP TABLE "MedicalRecord";
ALTER TABLE "new_MedicalRecord" RENAME TO "MedicalRecord";
CREATE INDEX "MedicalRecord_userId_idx" ON "MedicalRecord"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
