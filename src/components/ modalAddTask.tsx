import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"



type StatusEnum = "notStarted" | "inProgress" | "Done";

type PriorityEnum = "baixa" | "media" | "alta";

interface IFormInput {
    text: string
    status: StatusEnum
    dueDate: string
    priority: PriorityEnum
}


export function AddTask({onSuccess}) {
    const [openPopup, setOpenPopup] = useState(false);
    const { register, handleSubmit } = useForm<IFormInput>()

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        await fetch('http://localhost:5000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'text': data.text,
                'status': data.status,
                'priority': data.priority,
                'dueDate': data.dueDate
            })
        })
        const resposta = await fetch('http://localhost:5000/todos')
        const dados = await resposta.json()
        onSuccess(dados)
        setOpenPopup(false)
    }

    return (
        <>
            <button className="bg-[#B280FA] px-[24px] py-[5px] rounded-3xl text-black border-1 border-[#B280FA] font-medium" onClick={() => setOpenPopup(true)}>New</button>

            {
                openPopup &&
                <>
                    <div className="fixed inset-0 bg-black/60  z-50 flex items-center justify-center z-10"></div>
                    <div className="fixed  top-1/2 left-1/2 z-100 transform -translate-x-1/2 -translate-y-1/2 w-1/4 rounded-2xl shadow-lg p-6 bg-black gap-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                            <input type="text" placeholder="New Task" {...register("text")}></input>
                            <input type="date" placeholder="Due Date" {...register("dueDate")}></input>
                            <select {...register("status")}>
                                <option value="notStarted">notStarted</option>
                                <option value="inProgress">inProgress</option>
                                <option value="Done">Done</option>
                            </select>
                            <select {...register("priority")}>
                                <option value="baixa">baixa</option>
                                <option value="media">media</option>
                                <option value="alta">alta</option>
                            </select>
                            <div className="flex gap-2">
                            <input className="bg-[#B280FA] px-[24px] py-[5px] rounded-3xl text-black border-1 border-[#B280FA] font-medium" type="submit" value="Enviar"></input>
                            <button className="bg-[#B280FA] px-[24px] py-[5px] rounded-3xl text-black border-1 border-[#B280FA] font-medium" onClick={() => setOpenPopup(false)}>Close</button>
                            </div>
                        </form>
                    </div>
                </>
            }
        </>
    )
}