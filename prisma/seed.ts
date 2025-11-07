import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
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
        role: 'SUPER_ADMIN',
      },
    }),
  ]);
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Grand Hotel Paris',
        address: '123 Avenue des Champs-Élysées',
        city: 'Paris',
        country: 'France',
        description: 'Hôtel de luxe au cœur de Paris',
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Hotel Riviera',
        address: '45 Promenade des Anglais',
        city: 'Nice',
        country: 'France',
        description: 'Vue magnifique sur la Méditerranée',
      },
    }),
  ]);
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        number: '101',
        type: 'STANDARD',
        pricePerDay: 150.00,
        capacity: 2,
        description: 'Chambre standard avec vue sur la ville',
        hotelId: hotels[0].id,
      },
    }),
    prisma.room.create({
      data: {
        number: '201',
        type: 'DELUXE',
        pricePerDay: 250.00,
        capacity: 2,
        description: 'Chambre deluxe avec balcon',
        hotelId: hotels[0].id,
      },
    }),
    prisma.room.create({
      data: {
        number: '301',
        type: 'SUITE',
        pricePerDay: 450.00,
        capacity: 4,
        description: 'Suite luxueuse avec salon',
        hotelId: hotels[0].id,
      },
    }),
    prisma.room.create({
      data: {
        number: '101',
        type: 'STANDARD',
        pricePerDay: 120.00,
        capacity: 2,
        description: 'Chambre avec vue sur la mer',
        hotelId: hotels[1].id,
      },
    }),
    prisma.room.create({
      data: {
        number: '202',
        type: 'DELUXE',
        pricePerDay: 200.00,
        capacity: 3,
        description: 'Chambre deluxe vue mer panoramique',
        hotelId: hotels[1].id,
      },
    }),
  ]);
  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        customerId: customers[0].id,
        roomId: rooms[0].id,
        checkIn: new Date('2025-12-01'),
        checkOut: new Date('2025-12-05'),
        totalPrice: 600.00,
        status: 'CONFIRMED',
      },
    }),
    prisma.reservation.create({
      data: {
        customerId: customers[1].id,
        roomId: rooms[3].id,
        checkIn: new Date('2025-12-10'),
        checkOut: new Date('2025-12-15'),
        totalPrice: 600.00,
        status: 'PENDING',
      },
    }),
  ]);
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
