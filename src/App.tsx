import './App.css'
import { Check } from 'lucide-react'
import {Header} from './components/header'
import {AllTodos} from './components/todos'
import { useState, useEffect } from 'react'


function App() {
  const [todos, setTodos] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/todos').then(res => res.json()).then(data => setTodos(data))
    }, [])

    const newTodoAdded = (allTodos) => {
      setTodos(allTodos)
    }

  return (
    <section className="bg-[#0E0B1A] w-full text-white flex flex-col items-center pt-15 h-screen">
      <div className="h-full w-[1100px] flex flex-col items-start gap-5"><div className="flex gap-4 items-center"><Check className="border-3  p-1 size-8 rounded-sm text-white/40"/><h1 className="text-3xl font-bold text-[#B1A2E5]">To-dos</h1></div>
      <Header onSuccess={newTodoAdded}/>
      <AllTodos data={todos} onUpdate={newTodoAdded} />
      </div>
    </section>
  )
}

export default App
