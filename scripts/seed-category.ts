const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Aeropress' },
        { name: 'Drip' },
        { name: 'Espresso' },
        { name: 'Siphon' },
        { name: 'Moka Pot' },
        { name: 'Cold Brew' },
        { name: 'Matcha' },
        { name: 'Kombucha' },
      ],
    });

    console.log('✅ Success');
  } catch (error) {
    console.log('⛔️ Error seeding the db categories', error);
  } finally {
    await database.$disconnect();
  }
}

main();
