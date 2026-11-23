import { Moon, Plus, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Board } from './components/board'
import { TaskDialog } from './components/taskDialog'
import { api, type Status, type Todo } from './todo'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [offline, setOffline] = useState(false)
  const [editing, setEditing] = useState<Todo | Status | null>(null)
  // index.html sets the starting theme (saved choice, else the system's) before React loads
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')

  const toggleTheme = () => {
    const theme = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // storage blocked: the choice lasts until reload
    }
    setDark(!dark)
  }

  // Runs a change against the API, then reloads the board from it
  const sync = async (change?: Promise<unknown>) => {
    try {
      await change
      setTodos(await api.list())
      setOffline(false)
    } catch {
      setOffline(true)
    }
  }

  useEffect(() => {
    api.list().then(setTodos, () => setOffline(true))
  }, [])

  const done = todos.filter((t) => t.status === 'Done').length

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-medium tracking-[-0.035em]">Tarefas</h1>
          <p className="mt-1 text-muted">
            {todos.length - done} abertas · {done} concluídas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            aria-label={dark ? 'Usar tema claro' : 'Usar tema escuro'}
            className="grid size-11 place-items-center rounded-lg bg-card ring-1 ring-line transition hover:bg-panel active:scale-95"
          >
            {dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
          </button>
          <button
            onClick={() => setEditing('notStarted')}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 font-medium text-paper transition hover:bg-ink/90 active:scale-[.98]"
          >
            <Plus className="size-4" aria-hidden /> Nova tarefa
          </button>
        </div>
      </header>

      {offline && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-danger ring-1 ring-danger/30">
          Não foi possível falar com a API em localhost:5000. Ela está rodando?
        </p>
      )}

      <Board todos={todos} onOpen={setEditing} onChange={sync} />

      {editing && <TaskDialog todo={editing} onClose={() => setEditing(null)} onChange={sync} />}
    </main>
  )
}

export default App
