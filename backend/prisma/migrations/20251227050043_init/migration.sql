-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MaintenanceTeam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("teamId", "userId"),
    CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "MaintenanceTeam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT,
    "category" TEXT,
    "purchaseDate" DATETIME,
    "warrantyInfo" TEXT,
    "warrantyExpiresAt" DATETIME,
    "location" TEXT,
    "department" TEXT,
    "employeeName" TEXT,
    "maintenanceTeamId" INTEGER,
    "defaultTechnicianId" INTEGER,
    "isUsable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_maintenanceTeamId_fkey" FOREIGN KEY ("maintenanceTeamId") REFERENCES "MaintenanceTeam" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipment_defaultTechnicianId_fkey" FOREIGN KEY ("defaultTechnicianId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "equipmentCategory" TEXT,
    "teamId" INTEGER NOT NULL,
    "technicianId" INTEGER,
    "scheduledDate" DATETIME,
    "durationHours" REAL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdByUserId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaintenanceRequest_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "MaintenanceTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceTeam_name_key" ON "MaintenanceTeam"("name");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_teamId_idx" ON "MaintenanceRequest"("teamId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_equipmentId_idx" ON "MaintenanceRequest"("equipmentId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_technicianId_idx" ON "MaintenanceRequest"("technicianId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_type_idx" ON "MaintenanceRequest"("type");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_scheduledDate_idx" ON "MaintenanceRequest"("scheduledDate");
