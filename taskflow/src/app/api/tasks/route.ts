import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Status, Priority } from '@/types';

// Validation schemas
const getTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.array(z.nativeEnum(Status)).optional(),
  priority: z.array(z.nativeEnum(Priority)).optional(),
  projectId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  search: z.string().max(200).optional(),
  hideCompleted: z.coerce.boolean().default(false),
});

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(Status).default(Status.TODO),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

function handleValidationError(error: z.ZodError) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    },
    { status: 400 }
  );
}

// GET /api/tasks - Liste aller Tasks mit Filter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const status = searchParams.getAll('status') as Status[];
    const priority = searchParams.getAll('priority') as Priority[];
    const tagIds = searchParams.getAll('tagIds');

    const validationResult = getTasksQuerySchema.safeParse({
      ...params,
      status,
      priority,
      tagIds,
    });

    if (!validationResult.success) {
      return handleValidationError(validationResult.error);
    }

    const validated = validationResult.data;
    const skip = (validated.page - 1) * validated.limit;

    const where: Prisma.TaskWhereInput = {
      userId: session.user.id,
    };

    if (validated.status && validated.status.length > 0) {
      where.status = { in: validated.status };
    }

    if (validated.priority && validated.priority.length > 0) {
      where.priority = { in: validated.priority };
    }

    if (validated.projectId) {
      where.projectId = validated.projectId;
    }

    if (validated.dueBefore || validated.dueAfter) {
      where.dueDate = {};
      if (validated.dueBefore) {
        where.dueDate.lte = new Date(validated.dueBefore);
      }
      if (validated.dueAfter) {
        where.dueDate.gte = new Date(validated.dueAfter);
      }
    }

    if (validated.search) {
      where.OR = [
        { title: { contains: validated.search } },
        { description: { contains: validated.search } },
      ];
    }

    if (validated.tagIds && validated.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: validated.tagIds },
        },
      };
    }

    if (
      validated.hideCompleted &&
      (!validated.status || validated.status.length === 0)
    ) {
      where.status = { not: Status.DONE };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
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
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: validated.limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      data: tasks,
      meta: {
        total,
        page: validated.page,
        limit: validated.limit,
        totalPages: Math.ceil(total / validated.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Neuen Task erstellen
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createTaskSchema.safeParse(body);

    if (!validationResult.success) {
      return handleValidationError(validationResult.error);
    }

    const data = validationResult.data;

    const task = await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId: data.projectId || null,
        userId: session.user.id,
        tags:
          data.tagIds && data.tagIds.length > 0
            ? {
                create: data.tagIds.map((tagId: string) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
      },
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

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
