import { Task } from '../types';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  phase: string;
  order: number;
  is_recurring: boolean;
  recurring_interval?: string;
}

export interface PhaseTemplate {
  id: string;
  name: string;
  order: number;
  tasks: TaskTemplate[];
}

// Mock data - will be replaced with Supabase data
export const projectPhaseTemplates: PhaseTemplate[] = [
  {
    id: '1',
    name: 'Planning',
    order: 1,
    tasks: [
      {
        id: '1',
        name: 'Project Kickoff',
        description: 'Initial project meeting with stakeholders',
        duration: 1,
        phase: 'Planning',
        order: 1,
        is_recurring: false
      },
      {
        id: '2',
        name: 'Requirements Gathering',
        description: 'Document project requirements',
        duration: 5,
        phase: 'Planning',
        order: 2,
        is_recurring: false
      }
    ]
  },
  {
    id: '2',
    name: 'Execution',
    order: 2,
    tasks: [
      {
        id: '3',
        name: 'Weekly Status Meeting',
        description: 'Team status update',
        duration: 1,
        phase: 'Execution',
        order: 1,
        is_recurring: true,
        recurring_interval: 'weekly'
      }
    ]
  }
];

export function generateProjectTasks(
  project_id: string,
  start_date: string,
  end_date: string
): Omit<Task, 'id' | 'created_at' | 'updated_at'>[] {
  const tasks: Omit<Task, 'id' | 'created_at' | 'updated_at'>[] = [];
  let currentDate = new Date(start_date);

  projectPhaseTemplates.forEach(phase => {
    phase.tasks.forEach(template => {
      const taskEndDate = new Date(currentDate);
      taskEndDate.setDate(taskEndDate.getDate() + template.duration);

      tasks.push({
        project_id,
        name: template.name,
        description: template.description,
        assigned_to_id: null,
        status: 'pending',
        start_date: currentDate.toISOString().split('T')[0],
        end_date: taskEndDate.toISOString().split('T')[0],
        is_recurring: template.is_recurring,
        recurring_interval: template.recurring_interval
      });

      currentDate = new Date(taskEndDate);
      currentDate.setDate(currentDate.getDate() + 1);
    });
  });

  return tasks;
}