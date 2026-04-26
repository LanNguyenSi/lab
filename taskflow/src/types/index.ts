export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  tasks?: TaskTag[];
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  dueDate?: Date | null;
  projectId?: string | null;
  project?: Project | null;
  tags?: TaskTag[];
  timeEntries?: TimeEntry[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

export interface TaskTag {
  taskId: string;
  tagId: string;
  task?: Task;
  tag?: Tag;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  task?: Task;
  startedAt: Date;
  endedAt?: Date | null;
  duration?: number | null;
}

export interface TaskFilter {
  status?: Status[];
  priority?: Priority[];
  projectId?: string | null;
  tagIds?: string[];
  dueBefore?: Date | null;
  dueAfter?: Date | null;
  search?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: Date;
  projectId?: string;
  tagIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  dueDate?: Date | null;
  projectId?: string | null;
  completedAt?: Date | null;
}
