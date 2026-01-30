/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProviderProfiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfiles_userId_key" ON "ProviderProfiles"("userId");
