import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const [tasks, projects, tags, timeEntries, taskTags] = await Promise.all([
      prisma.task.findMany({
        where: { userId },
        include: {
          project: true,
          tags: {
            include: {
              tag: true,
            },
          },
          timeEntries: true,
        },
      }),
      prisma.project.findMany({ where: { userId } }),
      prisma.tag.findMany({ where: { userId } }),
      prisma.timeEntry.findMany({
        where: { task: { userId } },
      }),
      prisma.taskTag.findMany({
        where: { task: { userId } },
      }),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      stats: {
        totalTasks: tasks.length,
        totalProjects: projects.length,
        totalTags: tags.length,
        totalTimeEntries: timeEntries.length,
      },
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt,
      })),
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
        description: project.description,
        isArchived: project.isArchived,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        createdAt: tag.createdAt,
      })),
      timeEntries: timeEntries.map((entry) => ({
        id: entry.id,
        taskId: entry.taskId,
        startedAt: entry.startedAt,
        endedAt: entry.endedAt,
        duration: entry.duration,
      })),
      taskTags: taskTags.map((relation) => ({
        taskId: relation.taskId,
        tagId: relation.tagId,
      })),
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
