import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    await prisma.timeEntry.deleteMany({
      where: { task: { userId } },
    });

    await prisma.taskTag.deleteMany({
      where: { task: { userId } },
    });

    await prisma.task.deleteMany({
      where: { userId },
    });

    await prisma.tag.deleteMany({
      where: { userId },
    });

    await prisma.project.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: 'All your data has been reset',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error resetting data:', error);
    return NextResponse.json(
      { error: 'Failed to reset data' },
      { status: 500 }
    );
  }
}
