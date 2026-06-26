export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Missed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  estimatedDuration: string;
  reminderDate: string;
  reminderTime: string;
  repeat: string;
  location?: string;
  tags: string[];
  attachments: string[];
  status: TaskStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
