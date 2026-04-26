import { Columns3, TableOfContents} from "lucide-react"
import {AddTask} from './ modalAddTask'

export function Header({onSuccess}) {

    return (
        <div className="flex justify-between w-full">
            <div className="flex gap-8">
            <div className="flex items-center gap-2"><TableOfContents className="size-5"/><button>Tasks</button></div>
            <div className="flex items-center gap-2"><Columns3 className="size-5"/><button>Board</button></div>
            </div>
            <AddTask onSuccess={onSuccess}/>
        </div>
    )
}