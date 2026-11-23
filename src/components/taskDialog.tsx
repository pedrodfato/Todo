import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { api, newId, PRIORITY, STATUS, type Priority, type Status, type Todo, type TodoInput } from '../todo'

const EMPTY: TodoInput = { text: '', status: 'notStarted', priority: 'baixa', dueDate: '', tag: '', subtasks: [] }

const field =
  'h-11 w-full rounded-lg bg-card px-3 ring-1 ring-line outline-none transition focus:ring-2 focus:ring-ink'
const label = 'flex flex-col gap-1 text-xs font-medium text-muted'

type Props = {
  // A status opens an empty task in that column
  todo: Todo | Status
  onClose: () => void
  onChange: (change: Promise<unknown>) => void
}

export function TaskDialog({ todo, onClose, onChange }: Props) {
  const isNew = typeof todo === 'string'
  const [draft, setDraft] = useState<TodoInput>(() => (isNew ? { ...EMPTY, status: todo } : { ...EMPTY, ...todo }))
  const [newSub, setNewSub] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  const subtasks = draft.subtasks ?? []
  const set = (patch: Partial<TodoInput>) => setDraft((d) => ({ ...d, ...patch }))
  const close = () => ref.current?.close()

  const addSubtask = () => {
    const text = newSub.trim()
    if (!text) return
    set({ subtasks: [...subtasks, { id: newId(), text, done: false }] })
    setNewSub('')
  }

  const save = (e: FormEvent) => {
    e.preventDefault()
    // A subtask still typed in the add field is kept, not lost
    const pending = newSub.trim() ? [{ id: newId(), text: newSub.trim(), done: false }] : []
    const data = {
      ...draft,
      text: draft.text.trim(),
      subtasks: [...subtasks, ...pending].filter((s) => s.text.trim()),
    }
    onChange(isNew ? api.create(data) : api.update(todo.id, data))
    close()
  }

  const remove = () => {
    if (isNew) return
    onChange(api.remove(todo.id))
    close()
  }

  const doneCount = subtasks.filter((s) => s.done).length

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && close()}
      aria-label={isNew ? 'Nova tarefa' : 'Editar tarefa'}
      className="m-auto max-h-[90svh] w-[min(560px,calc(100vw-2rem))] rounded-2xl bg-paper p-0 text-ink shadow-2xl"
    >
      <form onSubmit={save} className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <input
            autoFocus
            required
            pattern=".*\S.*"
            aria-label="Título"
            placeholder="O que precisa ser feito?"
            value={draft.text}
            onChange={(e) => set({ text: e.target.value })}
            className="min-w-0 flex-1 bg-transparent text-2xl font-medium tracking-tight outline-none placeholder:text-muted/60"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="grid size-11 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-panel active:scale-95"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Status
            <select value={draft.status} onChange={(e) => set({ status: e.target.value as Status })} className={field}>
              {STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Prioridade
            <select
              value={draft.priority}
              onChange={(e) => set({ priority: e.target.value as Priority })}
              className={field}
            >
              {Object.entries(PRIORITY).map(([value, p]) => (
                <option key={value} value={value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Vencimento
            <input type="date" value={draft.dueDate} onChange={(e) => set({ dueDate: e.target.value })} className={field} />
          </label>
          <label className={label}>
            Tag
            <input
              placeholder="Trabalho"
              value={draft.tag}
              onChange={(e) => set({ tag: e.target.value })}
              className={field}
            />
          </label>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 flex w-full items-center justify-between text-xs font-medium text-muted">
            Subtarefas
            {subtasks.length > 0 && (
              <span className="font-mono">
                {doneCount}/{subtasks.length}
              </span>
            )}
          </legend>
          {subtasks.map((s, i) => (
            <div key={s.id} className="group flex items-center gap-2 rounded-lg bg-card pl-3 ring-1 ring-line">
              <input
                type="checkbox"
                checked={s.done}
                aria-label={`Concluir ${s.text}`}
                onChange={() =>
                  set({ subtasks: subtasks.map((x, j) => (j === i ? { ...x, done: !x.done } : x)) })
                }
                className="size-4 shrink-0 accent-ink"
              />
              <input
                value={s.text}
                aria-label="Subtarefa"
                onChange={(e) =>
                  set({ subtasks: subtasks.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })
                }
                className={`h-11 min-w-0 flex-1 bg-transparent outline-none ${s.done ? 'text-muted line-through' : ''}`}
              />
              <button
                type="button"
                aria-label={`Remover ${s.text}`}
                onClick={() => set({ subtasks: subtasks.filter((_, j) => j !== i) })}
                className="grid size-11 shrink-0 place-items-center rounded-lg text-muted transition hover:text-danger active:scale-95"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              placeholder="Adicionar subtarefa"
              aria-label="Nova subtarefa"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSubtask()
                }
              }}
              className={field}
            />
            <button
              type="button"
              onClick={addSubtask}
              aria-label="Adicionar subtarefa"
              className="grid size-11 shrink-0 place-items-center rounded-lg bg-card ring-1 ring-line transition hover:bg-panel active:scale-95"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
          {!isNew && (
            <button
              type="button"
              onClick={() => (confirmDelete ? remove() : setConfirmDelete(true))}
              className={`mr-auto inline-flex h-11 items-center gap-2 rounded-lg px-3 font-medium transition active:scale-[.98] ${confirmDelete ? 'bg-danger text-paper hover:bg-danger/90' : 'text-danger hover:bg-danger/10'}`}
            >
              <Trash2 className="size-4" aria-hidden /> {confirmDelete ? 'Confirmar exclusão' : 'Excluir'}
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="h-11 rounded-lg bg-card px-4 font-medium ring-1 ring-line transition hover:bg-panel active:scale-[.98]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-ink px-4 font-medium text-paper transition hover:bg-ink/90 active:scale-[.98]"
          >
            {isNew ? 'Criar tarefa' : 'Salvar'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
