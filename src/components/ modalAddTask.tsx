import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

const AddTaskShema = z.object({ 
  text: z.string().nonempty('A tarefa deve possuir um título'),
  status: z.enum(["notStarted", "inProgress", "Done"]),
  dueDate: z.string().nonempty("Adicione uma data"),
  priority: z.enum(["baixa", "media", "alta"]),
  tag: z.string()
});

type IFormInput = z.infer<typeof AddTaskShema>;

export function AddTask({onSuccess}) {
    const [openPopup, setOpenPopup] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: zodResolver(AddTaskShema), defaultValues: {status: "notStarted", priority: "baixa",text: "",tag: "",dueDate: ""}
  })

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
                'dueDate': data.dueDate,
                'tag': data.tag
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
                    <div className="fixed  top-1/2 left-1/2 z-100 transform -translate-x-1/2 -translate-y-1/2 w-1/4 rounded-2xl shadow-lg p-6 bg-[#17111e] border-1 border-[#B280FA]/25 gap-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                            <input className="text-2xl focus:outline-none focus:ring-0 bg-transparent border-none" type="text" placeholder="Nova Tarefa" {...register("text")}></input>
                            {errors.text && <span className="text-red-500 text-xs mt-1 font-semibold">{errors.text.message}</span>}
                            <label className="text-[#6E6190] uppercase text-xs mt-4 mb-1">Data de vencimento</label>
                            <input className="mt-1 bg-[#1C142F] text-white border-1 border-[#B280FA]/30 p-2 rounded-lg focus:outline-none focus:ring-0 focus:border-[#B280FA]" type="date" placeholder="Data de vencimento" {...register("dueDate")}></input>
                            <label className="text-[#6E6190] uppercase text-xs mt-4 mb-1">Status</label>
                            <select className="bg-[#1C142F] text-white border-1 border-[#B280FA]/30 p-2 rounded-lg " {...register("status")}>
                                <option value="notStarted">Não iniciado</option>
                                <option value="inProgress">Em andamento</option>
                                <option value="Done">Concluído</option>
                            </select>
                            {errors.status && <span className="text-red-500 text-xs mt-1 font-semibold">{errors.status.message}</span>}
                            <label className="text-[#6E6190] uppercase text-xs mt-4 mb-1">Prioridade</label>
                            <select className="bg-[#1C142F] text-white border-1 border-[#B280FA]/30 p-2 rounded-lg" {...register("priority")}>
                                <option value="baixa">Baixa</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                            {errors.priority && <span className="text-red-500 text-xs mt-1 font-semibold">{errors.priority.message}</span>}
                            <label className="text-[#6E6190] uppercase text-xs mt-4 mb-1">Tag</label>
                            <input type="text" className=" bg-[#1C142F] text-white border-1 border-[#B280FA]/30 p-2 rounded-lg focus:outline-none focus:ring-0 focus:border-[#B280FA]" {...register("tag")} placeholder="Trabalho"></input>
                            {errors.tag && <span className="text-red-500 text-xs mt-1 font-semibold">{errors.tag.message}</span>}
                            <div className="flex gap-3 mt-5">
                            <input className="bg-[#B280FA] px-[24px] py-[5px] rounded-3xl text-black border-1 border-[#B280FA] font-medium" type="submit" value="Adicionar"></input>
                            <button className="text-[#D2C6F9] px-[24px] py-[5px] rounded-3xl border-2 border-[#B280FA] font-medium" onClick={() => setOpenPopup(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </>
            }
        </>
    )
}