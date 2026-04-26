import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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
    const project = await prisma.project.findUnique({
      where: { id, userId: session.user.id },
      include: {
        tasks: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
            timeEntries: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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
    const { name, color, description, isArchived } = body;

    const existingProject = await prisma.project.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (name !== undefined) {
      if (name.length > 100) {
        return NextResponse.json(
          { error: 'Name must be less than 100 characters' },
          { status: 400 }
        );
      }
    }
    if (description !== undefined) {
      if (description && description.length > 500) {
        return NextResponse.json(
          { error: 'Description must be less than 500 characters' },
          { status: 400 }
        );
      }
    }

    const updateData: {
      name?: string;
      color?: string;
      description?: string | null;
      isArchived?: boolean;
    } = {};

    if (name !== undefined) updateData.name = name.trim();
    if (color !== undefined) updateData.color = color;
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    const project = await prisma.project.update({
      where: { id, userId: session.user.id },
      data: updateData,
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    const existingProject = await prisma.project.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
