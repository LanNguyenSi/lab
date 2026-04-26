import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const task = await prisma.task.findUnique({
      where: { id, userId: session.user.id },
      include: {
        timeEntries: {
          where: {
            endedAt: null,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (action === 'start') {
      if (task.timeEntries.length > 0) {
        return NextResponse.json(
          { error: 'Time tracking already active' },
          { status: 400 }
        );
      }

      const timeEntry = await prisma.timeEntry.create({
        data: {
          taskId: id,
          startedAt: new Date(),
        },
      });

      return NextResponse.json(timeEntry, { status: 201 });
    }

    if (action === 'stop') {
      const activeEntry = task.timeEntries[0];

      if (!activeEntry) {
        return NextResponse.json(
          { error: 'No active time tracking' },
          { status: 400 }
        );
      }

      const endedAt = new Date();
      const duration = Math.floor(
        (endedAt.getTime() - activeEntry.startedAt.getTime()) / 1000
      );

      const timeEntry = await prisma.timeEntry.update({
        where: { id: activeEntry.id },
        data: {
          endedAt,
          duration,
        },
      });

      return NextResponse.json(timeEntry);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing time tracking:', error);
    return NextResponse.json(
      { error: 'Failed to manage time tracking' },
      { status: 500 }
    );
  }
}
