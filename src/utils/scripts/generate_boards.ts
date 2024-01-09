import { PrismaClient } from '@prisma/client';

// instantiate prisma client
const prisma = new PrismaClient();

async function main() {
  const boards = [
    {
      name: 'Acknowledged',
      color: '#FFC107',
    },
    {
      name: 'In Progress',
      color: '#17A2B8',
    },
    {
      name: 'Documentation',
      color: '#007BFF',
    },
    {
      name: 'Done',
      color: '#28A745',
    },
    {
      name: 'Cancelled',
      color: '#DC3545',
    },
  ];

  // add index to boards
  for (let i = 0; i < boards.length; i++) {
    // if board already exists, skip
    const board = await prisma.statusBoard.findFirst({
      where: {
        name: boards[i].name,
      },
    });

    if (board) {
      console.log(`Board ${boards[i].name} already exists`);
      continue;
    }

    console.log(`Creating board ${boards[i].name}`);
    await prisma.statusBoard.create({
      data: {
        name: boards[i].name,
        color: boards[i].color,
        index: i,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
