import { v4 as uuidv4 } from "uuid"

export interface IToDo {
    description: string
    dueDate: Date
    status: ToDoStatus
}

export class ToDo implements IToDo {

    description: string
    dueDate: Date
    status: ToDoStatus
    id: string

    constructor(data: IToDo) {

        console.log("Constructor received data:", data) // Log the received data to verify it's correct

        this.description = data.description
        this.dueDate = data.dueDate
        this.status = data.status
        this.id = uuidv4()
    }
}

export type ToDoStatus = 
| "Pending" 
| "In Progress" 
| "Completed"