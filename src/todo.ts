const API = 'http://localhost:5000/todos'

export type Status = 'notStarted' | 'inProgress' | 'Done'
export type Priority = 'baixa' | 'media' | 'alta'

export interface Subtask {
  id: string
  text: string
  done: boolean
}

export interface Todo {
  id: string
  text: string
  status: Status
  priority: Priority
  dueDate?: string
  tag?: string
  subtasks?: Subtask[]
}

export type TodoInput = Omit<Todo, 'id'>

export const STATUS: { value: Status; label: string }[] = [
  { value: 'notStarted', label: 'Não iniciadas' },
  { value: 'inProgress', label: 'Em andamento' },
  { value: 'Done', label: 'Concluídas' },
]

export const PRIORITY: Record<Priority, { label: string; className: string }> = {
  alta: { label: 'Alta', className: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900' },
  media: { label: 'Média', className: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900' },
  baixa: { label: 'Baixa', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900' },
}

export const newId = () => Math.random().toString(36).slice(2, 10)

// dueDate is stored as YYYY-MM-DD; en-CA formats today the same way, in local time
export const isOverdue = (date: string) => date < new Date().toLocaleDateString('en-CA')

export function formatDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

async function request(path: string, init?: RequestInit) {
  const res = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

export const api = {
  list: (): Promise<Todo[]> => request(''),
  create: (todo: TodoInput) => request('', { method: 'POST', body: JSON.stringify(todo) }),
  update: (id: string, patch: Partial<Todo>) =>
    request(`/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: (id: string) => request(`/${id}`, { method: 'DELETE' }),
}
