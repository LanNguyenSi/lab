import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Status } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d';

    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const userId = session.user.id;

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      cancelledTasks,
      totalProjects,
      totalTimeEntries,
      tasksByPriority,
      recentTasks,
    ] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: Status.DONE } }),
      prisma.task.count({ where: { userId, status: Status.IN_PROGRESS } }),
      prisma.task.count({ where: { userId, status: Status.TODO } }),
      prisma.task.count({ where: { userId, status: Status.CANCELLED } }),
      prisma.project.count({ where: { userId, isArchived: false } }),
      prisma.timeEntry.count({ where: { task: { userId } } }),
      prisma.task.groupBy({
        by: ['priority'],
        where: { userId },
        _count: { priority: true },
      }),
      prisma.task.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { project: true },
      }),
    ]);

    const timeStats = await prisma.timeEntry.aggregate({
      _sum: { duration: true },
      where: {
        startedAt: { gte: startDate },
        duration: { not: null },
        task: { userId },
      },
    });

    const totalTimeTracked = timeStats._sum.duration || 0;

    const overview = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      cancelledTasks,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalProjects,
      totalTimeTracked,
      totalTimeEntries,
    };

    const productivity = {
      tasksByPriority: tasksByPriority.map((item) => ({
        priority: item.priority,
        count: item._count.priority,
      })),
      tasksByDay: [],
      recentTasks,
    };

    return NextResponse.json({
      overview,
      productivity,
      timeframe,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
