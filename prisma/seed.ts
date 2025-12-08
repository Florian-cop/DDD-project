import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.reservationRoom.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        email: 'alice.smith@example.com',
        firstname: 'Alice',
        lastname: 'Smith',
        phoneNumber: '0612345678',
        wallet: {
          create: {
            balance: 1000.00,
          },
        },
      },
    }),
    prisma.customer.create({
      data: {
        email: 'bob.martin@example.com',
        firstname: 'Bob',
        lastname: 'Martin',
        phoneNumber: '0698765432',
        wallet: {
          create: {
            balance: 500.00,
          },
        },
      },
    }),
    prisma.customer.create({
      data: {
        email: 'charlie.brown@example.com',
        firstname: 'Charlie',
        lastname: 'Brown',
        phoneNumber: '0611223344',
        wallet: {
          create: {
            balance: 750.00,
          },
        },
      },
    }),
  ]);

  const admins = await Promise.all([
    prisma.admin.create({
      data: {
        email: 'admin@hotel.com',
        firstname: 'Admin',
        lastname: 'System',
        phoneNumber: '0600000000',
        role: 'ADMIN',
      },
    }),
  ]);

  // XYZ Hotel - Chambres
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        number: '101',
        type: 'STANDARD',
        isAvailable: true,
      },
    }),
    prisma.room.create({
      data: {
        number: '102',
        type: 'STANDARD',
        isAvailable: true,
      },
    }),
    prisma.room.create({
      data: {
        number: '103',
        type: 'STANDARD',
        isAvailable: false,
      },
    }),
    prisma.room.create({
      data: {
        number: '201',
        type: 'DELUXE',
        isAvailable: true,
      },
    }),
    prisma.room.create({
      data: {
        number: '202',
        type: 'DELUXE',
        isAvailable: true,
      },
    }),
    prisma.room.create({
      data: {
        number: '301',
        type: 'SUITE',
        isAvailable: true,
      },
    }),
    prisma.room.create({
      data: {
        number: '302',
        type: 'SUITE',
        isAvailable: false,
      },
    }),
  ]);

  // Créer des réservations
  const reservation1 = await prisma.reservation.create({
    data: {
      customerId: customers[0].id,
      checkIn: new Date('2025-12-01'),
      checkOut: new Date('2025-12-05'),
      totalPrice: 200.00,
      status: 'BOOKED',
    },
  });

  // Associer les chambres à la réservation
  await prisma.reservationRoom.create({
    data: {
      reservationId: reservation1.id,
      roomId: rooms[2].id, // Room 103
    },
  });

  const reservation2 = await prisma.reservation.create({
    data: {
      customerId: customers[1].id,
      checkIn: new Date('2025-12-10'),
      checkOut: new Date('2025-12-15'),
      totalPrice: 1000.00,
      status: 'CONFIRMED',
    },
  });

  // Associer plusieurs chambres à la réservation
  await Promise.all([
    prisma.reservationRoom.create({
      data: {
        reservationId: reservation2.id,
        roomId: rooms[6].id, // Suite 302
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${customers.length} customers`);
  console.log(`👤 Created ${admins.length} admins`);
  console.log(`🏨 Created ${rooms.length} rooms`);
  console.log(`📅 Created 2 reservations`);
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
