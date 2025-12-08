-- AlterEnum
-- Change ReservationStatus enum values from PENDING/COMPLETED to BOOKED
-- Create new enum type
CREATE TYPE "ReservationStatus_new" AS ENUM ('BOOKED', 'CONFIRMED', 'CANCELLED');

-- Update existing data: map PENDING -> BOOKED, COMPLETED -> CONFIRMED
ALTER TABLE "reservations" 
  ALTER COLUMN "status" TYPE "ReservationStatus_new" 
  USING (
    CASE 
      WHEN "status"::text = 'PENDING' THEN 'BOOKED'::ReservationStatus_new
      WHEN "status"::text = 'COMPLETED' THEN 'CONFIRMED'::ReservationStatus_new
      ELSE "status"::text::ReservationStatus_new
    END
  );

-- Drop old enum and rename new one
DROP TYPE "ReservationStatus";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";

-- CreateTable
-- Create reservation_rooms junction table for many-to-many relationship
CREATE TABLE "reservation_rooms" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservation_rooms_reservationId_roomId_key" ON "reservation_rooms"("reservationId", "roomId");

-- AddForeignKey
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data from reservations.roomId to reservation_rooms
INSERT INTO "reservation_rooms" ("id", "reservationId", "roomId", "createdAt")
SELECT gen_random_uuid(), "id", "roomId", CURRENT_TIMESTAMP
FROM "reservations";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT IF EXISTS "reservations_roomId_fkey";

-- AlterTable
-- Remove roomId column from reservations table
ALTER TABLE "reservations" DROP COLUMN IF EXISTS "roomId";

-- AlterTable
-- Change default status to BOOKED
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'BOOKED';

-- DropForeignKey
-- Remove hotel relation from rooms if it exists
ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "rooms_hotelId_fkey";

-- AlterTable
-- Remove hotelId column from rooms table
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "hotelId";

-- DropTable
-- Remove hotels table as it's not needed (single hotel context)
DROP TABLE IF EXISTS "hotels";
