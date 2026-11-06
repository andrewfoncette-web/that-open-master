import { v4 as uuidv4 } from "uuid";

export interface IToDo {
    description: string;
    dueDate: Date;
    status: ToDoStatus;
    priority: ToDoPriority;
}

export class ToDo implements IToDo {

    description: string;
    dueDate: Date;
    status: ToDoStatus;
    priority: ToDoPriority;
    id: string;

    constructor(data: IToDo) {

        console.log(
            "Constructor received data:",
            data
        );

        this.description = data.description;
        this.dueDate = data.dueDate;
        this.status = data.status;
        this.priority = data.priority;
        this.id = uuidv4();
    }
}

export type ToDoStatus =
    | "Pending"
    | "In Progress"
    | "Completed";

export type ToDoPriority =
    | "Low"
    | "Medium"
    | "High";