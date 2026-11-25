import {v4 as uuidv4} from "uuid"
import { ToDo } from "./ToDo"

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

export interface IProject {
    name: string
    description: string
    userRole: "Architect" | "Engineer" | "Developer"
    status: "Pending" | "Active" | "Finished"
    finishDate: Date
    toDos?: ToDo[]
}
               
export class Project implements IProject{
    //To satisfy IProject
    name!: string
    description!: string
    userRole!: UserRole
    status!: ProjectStatus
    finishDate!: Date

     toDos: ToDo[] = []

    //Class internals
    cost: number = 0
    progress: number = 0
    color: string = ""
    ui!: HTMLDivElement
    id: string

    constructor(data: IProject, id = uuidv4()) {
    
            this.toDos = []

            Object.assign(this, data) // Assign the properties from the data object to the instance

            console.log("Constructor toDos:", this.toDos) // Log the toDos property to verify it's an empty array
            console.log("Constructor keys:", Object.keys(this)) // Log the keys of the instance to verify the properties

            this.id = (data as IProject & { id?: string}).id ?? uuidv4() // Generate a unique ID for each project instance
        
        const colors = [
            "#ca8134", // Orange
            "#2196f3", // Blue
            "#4caf50", // Green
            "#9c27b0", // Purple
            "#e91e63", // Pink
            "#ff5722", // Deep Orange
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)] // Assign a random color from the array

        this.progress = 80;

        this.setUI()
    
    }

    setUI() {

        if (!this.ui) {
            this.ui = document.createElement("div")
        }
        this.ui.className = "project-card"

        this.ui.style.border = "3px solid red"; 

        this.ui.innerHTML = `
        <div class="card-header">
          <p style="background-color: ${this.color}; padding: 10px; border-radius: 8px; aspect-ratio: 1 ;">${this.name.substring(0,2).toUpperCase()}</p>
          <div>
            <h5>${this.name}</h5>
            <p>${this.description}</p>
          </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
            </div>
             <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progress}%</p>
            </div>
        </div>`

    }
}
