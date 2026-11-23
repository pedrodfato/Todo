import { Calendar, Plus } from 'lucide-react'
import { useState } from 'react'
import { api, formatDate, isOverdue, PRIORITY, STATUS, type Status, type Todo } from '../todo'

type Props = {
  todos: Todo[]
  // A status opens a new task in that column
  onOpen: (target: Todo | Status) => void
  onChange: (change: Promise<unknown>) => void
}

export function Board({ todos, onOpen, onChange }: Props) {
  return (
    <div className="grid flex-1 items-start gap-4 md:grid-cols-3">
      {STATUS.map(({ value, label }) => (
        <Column
          key={value}
          status={value}
          title={label}
          todos={todos.filter((t) => t.status === value)}
          onOpen={onOpen}
          onChange={onChange}
        />
      ))}
    </div>
  )
}

function Column({ status, title, todos, onOpen, onChange }: Props & { status: Status; title: string }) {
  const [over, setOver] = useState(false)

  return (
    <section
      aria-label={title}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        setOver(false)
        const id = e.dataTransfer.getData('taskId')
        if (id) onChange(api.update(id, { status }))
      }}
      className={`flex flex-col md:min-h-64 gap-3 rounded-2xl bg-panel p-3 transition ${over ? 'ring-2 ring-ink' : ''}`}
    >
      <div className="flex items-center gap-2 pl-1">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="rounded-full bg-card px-2 font-mono text-xs leading-5 text-muted">{todos.length}</span>
        <button
          onClick={() => onOpen(status)}
          aria-label={`Adicionar tarefa em ${title}`}
          title="Adicionar tarefa"
          className="ml-auto grid size-9 place-items-center rounded-lg text-muted transition hover:bg-card hover:text-ink active:scale-95"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
      {todos.map((todo) => (
        <Card key={todo.id} todo={todo} onOpen={onOpen} onChange={onChange} />
      ))}
      {todos.length === 0 && (
        <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
          Arraste tarefas para cá
        </p>
      )}
    </section>
  )
}

function Card({ todo, onOpen, onChange }: { todo: Todo } & Omit<Props, 'todos'>) {
  const subtasks = todo.subtasks ?? []
  const doneCount = subtasks.filter((s) => s.done).length
  const isDone = todo.status === 'Done'
  const priority = PRIORITY[todo.priority] ?? PRIORITY.baixa

  const toggle = (id: string) =>
    onChange(
      api.update(todo.id, {
        subtasks: subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)),
      }),
    )

  return (
    <article
      draggable
      onDragStart={(e) => e.dataTransfer.setData('taskId', todo.id)}
      className="cursor-grab rounded-xl bg-card p-3 shadow-[0_1px_2px_color-mix(in_srgb,var(--color-shade)_10%,transparent)] ring-1 ring-line transition hover:shadow-[0_6px_16px_-6px_color-mix(in_srgb,var(--color-shade)_30%,transparent)] active:cursor-grabbing motion-safe:hover:-translate-y-0.5"
    >
      <button
        onClick={() => onOpen(todo)}
        className={`w-full rounded text-left font-medium leading-snug hover:underline ${isDone ? 'text-muted line-through' : ''}`}
      >
        {todo.text}
      </button>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ring-1 ${priority.className}`}>{priority.label}</span>
        {todo.tag && <span className="rounded-full bg-panel px-2 py-0.5 text-muted">{todo.tag}</span>}
        {todo.dueDate && (
          <span
            className={`inline-flex items-center gap-1 ${!isDone && isOverdue(todo.dueDate) ? 'font-medium text-danger' : 'text-muted'}`}
          >
            <Calendar className="size-3.5" aria-hidden /> {formatDate(todo.dueDate)}
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="mt-3 border-t border-line pt-2">
          <div className="flex items-center gap-2 text-xs text-muted">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-panel">
              <div
                className="h-full rounded-full bg-ink transition-[width]"
                style={{ width: `${(doneCount / subtasks.length) * 100}%` }}
              />
            </div>
            <span className="font-mono">
              {doneCount}/{subtasks.length}
            </span>
          </div>
          <ul className="mt-1">
            {subtasks.map((s) => (
              <li key={s.id}>
                <label className="flex cursor-pointer items-start gap-2 rounded py-1 text-sm hover:bg-paper">
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => toggle(s.id)}
                    className="mt-0.5 size-4 shrink-0 accent-ink"
                  />
                  <span className={s.done ? 'text-muted line-through' : ''}>{s.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
