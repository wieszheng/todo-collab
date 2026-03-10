export interface User {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  status: string
  created_at: string
}

export interface UserCreate {
  email: string
  password: string
  nickname?: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  creator_id: string
  assignee_id: string | null
  created_at: string
  updated_at: string
  // 关联用户信息
  creator: User | null
  assignee: User | null
}

export interface TaskCreate {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  due_date?: string
  assignee_id?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  status?: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  due_date?: string
  assignee_id?: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface Notification {
  id: string
  type: string
  title: string | null
  content: string | null
  is_read: boolean
  related_task_id: string | null
  created_at: string
}
