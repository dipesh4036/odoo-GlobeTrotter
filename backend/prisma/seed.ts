import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data for clean seed
  await prisma.stopActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Explorer',
      email: 'alice@example.com',
      passwordHash,
      role: Role.USER,
      city: 'New York',
      country: 'USA'
    }
  });

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash,
      role: Role.ADMIN
    }
  });

  // 2. Create Cities
  const paris = await prisma.city.create({ data: { name: 'Paris', country: 'France', costIndex: 85, popularity: 95 } });
  const tokyo = await prisma.city.create({ data: { name: 'Tokyo', country: 'Japan', costIndex: 90, popularity: 100 } });
  const bangkok = await prisma.city.create({ data: { name: 'Bangkok', country: 'Thailand', costIndex: 40, popularity: 90 } });
  const rome = await prisma.city.create({ data: { name: 'Rome', country: 'Italy', costIndex: 80, popularity: 92 } });
  const nyc = await prisma.city.create({ data: { name: 'New York', country: 'USA', costIndex: 100, popularity: 98 } });

  // 3. Create Activities (15 total distributed)
  await prisma.activity.createMany({
    data: [
      { cityId: paris.id, name: 'Eiffel Tower', category: 'sightseeing', cost: 2500, popularity: 99 },
      { cityId: paris.id, name: 'Louvre Museum', category: 'culture', cost: 1500, popularity: 95 },
      { cityId: paris.id, name: 'Seine River Cruise', category: 'sightseeing', cost: 1200, popularity: 85 },
      { cityId: tokyo.id, name: 'Mount Fuji Tour', category: 'adventure', cost: 8000, popularity: 98 },
      { cityId: tokyo.id, name: 'Sushi Making', category: 'food', cost: 4000, popularity: 90 },
      { cityId: tokyo.id, name: 'Senso-ji Temple', category: 'culture', cost: 0, popularity: 88 },
      { cityId: bangkok.id, name: 'Grand Palace', category: 'culture', cost: 1200, popularity: 95 },
      { cityId: bangkok.id, name: 'Street Food Tour', category: 'food', cost: 1500, popularity: 92 },
      { cityId: bangkok.id, name: 'Floating Market', category: 'sightseeing', cost: 2000, popularity: 85 },
      { cityId: rome.id, name: 'Colosseum', category: 'sightseeing', cost: 2500, popularity: 99 },
      { cityId: rome.id, name: 'Vatican Museums', category: 'culture', cost: 3000, popularity: 96 },
      { cityId: rome.id, name: 'Pasta Cooking Class', category: 'food', cost: 5000, popularity: 88 },
      { cityId: nyc.id, name: 'Statue of Liberty', category: 'sightseeing', cost: 2500, popularity: 97 },
      { cityId: nyc.id, name: 'Broadway Show', category: 'culture', cost: 12000, popularity: 95 },
      { cityId: nyc.id, name: 'Central Park Bike Tour', category: 'adventure', cost: 3000, popularity: 90 }
    ]
  });

  // 4. Create Community Posts
  await prisma.communityPost.createMany({
    data: [
      { userId: user1.id, content: 'Just booked my flight to Tokyo! So excited for the sushi.' },
      { userId: user1.id, content: 'Does anyone have recommendations for cheap eats in Paris?' }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
