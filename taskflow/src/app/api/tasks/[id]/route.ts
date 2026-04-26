import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Priority, Status } from '@/types';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id, userId: session.user.id },
      include: {
        project: true,
        tags: {
          include: {
            tag: true,
          },
        },
        timeEntries: {
          orderBy: {
            startedAt: 'desc',
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, dueDate, projectId } = body;

    const existingTask = await prisma.task.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateData: {
      title?: string;
      description?: string | null;
      status?: Status;
      priority?: Priority;
      dueDate?: Date | null;
      projectId?: string | null;
      completedAt?: Date | null;
    } = {};

    if (title !== undefined) {
      if (title.length > 200) {
        return NextResponse.json(
          { error: 'Title must be less than 200 characters' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }
    if (description !== undefined) {
      if (description && description.length > 2000) {
        return NextResponse.json(
          { error: 'Description must be less than 2000 characters' },
          { status: 400 }
        );
      }
      updateData.description = description?.trim() || null;
    }
    if (status !== undefined) {
      updateData.status = status;
      if (status === Status.DONE && !existingTask.completedAt) {
        updateData.completedAt = new Date();
      } else if (status !== Status.DONE) {
        updateData.completedAt = null;
      }
    }
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (projectId !== undefined) updateData.projectId = projectId || null;

    const task = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: updateData,
      include: {
        project: true,
        tags: {
          include: {
            tag: true,
          },
        },
        timeEntries: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingTask = await prisma.task.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
