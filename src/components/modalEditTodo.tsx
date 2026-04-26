import { Ellipsis } from "lucide-react";
import { useState } from 'react'


export function ModalEditTodo({ className, todoId, onDeleteSuccess }: { className?: string, todoId?: string, onDeleteSuccess: () => void }) {

const [isModalOpen, setIsModalOpen] = useState(false)

const handleOpenModal = () => setIsModalOpen(true)
const handleCloseModal = () => setIsModalOpen(false)

const handleDeleteTodo = async () => {
    await fetch(`http://localhost:5000/todos/${todoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    onDeleteSuccess();
    setIsModalOpen(false);
}
    return(
       <>
            <Ellipsis className={`size-5 self-end absolute mt-[-45px] cursor-pointer ${className || ''}`} onClick={handleOpenModal}/>
            {isModalOpen && (
                <div className="bg-[#100D1D] p-5 rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border border-[#8A43F0]/30 shadow-2xl">
                    <h1 className="text-white mb-4">Quer deletar mesmo, vilão?</h1>
                    <div className="flex gap-2">
                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md w-full transition-colors" onClick={handleDeleteTodo}>Deletar</button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md w-full transition-colors" onClick={handleCloseModal}>Cancelar</button>
                    </div>
                </div>
            )} 
        </>
    )
}