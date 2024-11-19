export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  azure_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  project_manager: User;
  project_manager_id: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  project_id: string;
  name: string;
  description: string;
  assigned_to_id: string | null;
  assigned_to?: User | null;
  status: 'pending' | 'in-progress' | 'pending-review' | 'completed';
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  recurring_interval?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'task_update' | 'mention' | 'status_change';
  read: boolean;
  created_at: string;
}