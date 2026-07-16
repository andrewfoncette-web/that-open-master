import {v4 as uuidv4} from "uuid"

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

export interface IProject {
    name: string
    description: string
    userRole: "Architect" | "Engineer" | "Developer"
    status: "Pending" | "Active" | "Finished"
    finishDate: Date
}
               
export class Project implements IProject{
    //To satisfy IProject
    name!: string
    description!: string
    userRole!: UserRole
    status!: ProjectStatus
    finishDate!: Date

    //Class internals
    cost: number = 0
    progress: number = 0
    ui!: HTMLDivElement
    id: string

    constructor(data: IProject) {
        Object.assign(this, data) // Assign the properties from the data object to the instance
        this.id = uuidv4() // Generate a unique ID for each project instance
        this.setUI()
    
    }

    setUI() {

        this.ui = document.createElement("div")
        this.ui.className = "project-card"

        this.ui.style.border = "3px solid red"; 

        this.ui.innerHTML = `
        <div class="card-header">
          <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1 ;">${this.name.substring(0,2).toUpperCase()}</p>
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
