import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

function isPrismaKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id, userId: session.user.id },
      include: {
        tasks: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
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
    const { name, color } = body;

    const existingTag = await prisma.tag.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    if (name !== undefined) {
      if (name.length > 50) {
        return NextResponse.json(
          { error: 'Name must be less than 50 characters' },
          { status: 400 }
        );
      }
    }

    const updateData: {
      name?: string;
      color?: string;
    } = {};

    if (name !== undefined) updateData.name = name.trim().toLowerCase();
    if (color !== undefined) updateData.color = color;

    const tag = await prisma.tag.update({
      where: { id, userId: session.user.id },
      data: updateData,
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    if (isPrismaKnownRequestError(error) && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 409 }
      );
    }

    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
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

    const existingTag = await prisma.tag.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    await prisma.tag.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
