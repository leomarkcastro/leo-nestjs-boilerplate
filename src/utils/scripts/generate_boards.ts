import { PrismaClient } from '@prisma/client';

// instantiate prisma client
const prisma = new PrismaClient();

export async function generate_boards() {
  const boards = [
    {
      name: 'Case Filing',
      color: '#FFC107',
    },
    {
      name: 'Documentation',
      color: '#17A2B8',
    },
    {
      name: 'Hearing',
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
