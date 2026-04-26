import { LayoutList, ListCheck, LoaderCircle } from "lucide-react";
import { useState } from 'react';
import { ModalEditTodo } from "./modalEditTodo";

type TodoStatus = "notStarted" | "inProgress" | "Done";
type Priority = "baixa" | "media" | "alta";

interface Todo {
  id: string;
  text: string;
  status: TodoStatus;
  priority?: Priority;
  dueDate?: string;
}

function KanbanColumn({ 
    title, 
    icon, 
    todos, 
    statusFilter, 
    bgColumnClass, 
    bgCardClass, 
    borderClass,
    onDropTask,
    onDeleteTask
}: {
    title: string;
    icon: React.ReactNode;
    todos: Todo[];
    statusFilter: TodoStatus;
    bgColumnClass: string;
    bgCardClass: string;
    borderClass: string;
    onDropTask: (taskId: string, newStatus: TodoStatus) => void;
    onDeleteTask: () => void;
}) {

    const [isHovered, setIsHovered] = useState(false);


    const filteredTodos = todos.filter(todo => todo.status === statusFilter);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); 
        setIsHovered(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        setIsHovered(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        setIsHovered(false);
        const taskId = e.dataTransfer.getData("taskId");
        onDropTask(taskId, statusFilter); 
    };

    const highlightClasses = isHovered 
        ? "ring-2 ring-[#8A43F0] bg-opacity-80 scale-[1.02]" 
        : "bg-opacity-100 scale-100";


    return (
        <div 
        className={`h-full w-[280px] p-5 rounded-xl flex gap-3 flex-col ${bgColumnClass} transition-all duration-200 ${highlightClasses}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
            <div className="flex items-center gap-2">
                {icon}  
                <h3 className={`font-bold uppercase ${title == 'Concluídas' ? 'text-[#67E8F9]' : 'text-[#C4B5FD]'}`}>{title}</h3>
            </div>
            
            <hr className="border-[#8A43F0]/30" />

            {filteredTodos.map((todo) => (
                <div 
                    key={todo.id} draggable onDragStart={(e) => e.dataTransfer.setData("taskId", todo.id)}
                    className={`flex flex-col items-start justify-center p-2 rounded-md text-[#D2C6F9] gap-3 cursor-grab active:cursor-grabbing hover:brightness-125 transition-all duration-300 ${bgCardClass} ${borderClass} ${title == 'Concluídas' ? 'opacity-50' : ''} group`}
                >
                    <ModalEditTodo className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" todoId={todo.id} onDeleteSuccess={onDeleteTask}/>
                    <p className={title == 'Concluídas' ? 'line-through' : ''}>{todo.text}</p>
                    <p className={`uppercase text-xs py-1 font-bold px-3 border-1 rounded-2xl ${todo.priority == 'alta' ? 'bg-[#3E172D] text-[#F87171]  border-[#F87171]/20  ' : ''}${todo.priority == 'media' ? 'bg-[#422D28] text-[#FCD34D] border-[#FCD34D]/20 ' : ''}${todo.priority == 'baixa' ? 'bg-[#1C3437] text-[#86EFAC] border-[#86EFAC]/20 ' : ''}`}>{todo.priority}</p>
                </div>
            ))}
        </div>
    );
}


export function AllTodos({data: todos, onUpdate}: {data: any[], onUpdate: (data: any[]) => void}){
    
    const handleDropTask = async (taskId: string, newStatus: string) => {
        await fetch(`http://localhost:5000/todos/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        const res = await fetch('http://localhost:5000/todos');
        const updatedTodos = await res.json();
        onUpdate(updatedTodos);
    };

    const handleRefetchTodos = async () => {
        const res = await fetch('http://localhost:5000/todos');
        const updatedTodos = await res.json();
        onUpdate(updatedTodos);
    };

    return(
        <div className="flex w-full gap-5">
            <KanbanColumn
                title="Não Iniciadas"
                icon={<LayoutList className="size-4 text-[#9A8CD1]" />}
                todos={todos}
                statusFilter="notStarted"
                bgColumnClass="bg-[#151221] border border-[#1C142F]"
                bgCardClass="bg-[#1C142F]"
                borderClass="border-l-4 border-l-[#8A43F0] border-1 border-[#8A43F0]/20"
                onDropTask={handleDropTask}
                onDeleteTask={handleRefetchTodos}
            />

            <KanbanColumn
                title="Em andamento"
                icon={<LoaderCircle className="size-4 text-white" />}
                todos={todos}
                statusFilter="inProgress"
                bgColumnClass="bg-[#151221]"
                bgCardClass="bg-[#1C142F]"
                borderClass="border-l-4 border-l-[#8A43F0] border-1 border-[#8A43F0]/20"
                onDropTask={handleDropTask}
                onDeleteTask={handleRefetchTodos}
            />

            <KanbanColumn
                title="Concluídas"
                icon={<ListCheck className="size-4 text-white" />}
                todos={todos}
                statusFilter="Done"
                bgColumnClass="bg-[#151221]"    
                bgCardClass="bg-[#1C142F]"
                borderClass="border-l-4 border-l-[#64E2F3] border-1 border-[#64E2F3]/20"
                onDropTask={handleDropTask}
                onDeleteTask={handleRefetchTodos}
            />
        </div>
    );
}