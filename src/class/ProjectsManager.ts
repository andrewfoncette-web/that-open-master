import { IProject, Project } from "./Project"
import { ToDo } from "./ToDo"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
    defaultData: IProject

    selectedProject: Project | null = null
    selectedToDo: ToDo | null = null

    todoSearchText: string = ""

    constructor(container: HTMLElement) {
        this.ui = container
        this.defaultData = {
            name: "Default Name" as string,
            description: "Default Description" as string,
            userRole: "Developer",
            status: "Active",
            finishDate: new Date()
        }
    }

    createDefaultProject(){
        const defaultData: IProject = {
            name: "New Project",
            description: "This is a default project",
            status: "Pending",
            userRole: "Developer",
            finishDate: new Date()

        }
        const project = new Project(defaultData)
    }

    newProject(data: IProject) {

        if (data.name.trim().length < 5) {
            throw new Error("Project name must be at least 5 characters long.")
        }

        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists.`)
        }
        const project = new Project(data)

        project.toDos = []

        console.log("Project toDos:", project.toDos)
        console.log("Created project:", project)
        console.log("Project UI:", project.ui)

        project.ui.addEventListener("click", () => {

            console.log("PROJECT CARD CLICKED")

            this.selectedProject = project
            this.setDetailsPage(project)
            this.refreshToDoList()

            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")

            if (!projectsPage || !detailsPage) { return }

            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
        })
        this.ui.append(project.ui)
        console.log("Card added to DOM")
        this.list.push(project)
        return project
    }

    private setDetailsPage(project: Project) {
       
        const detailsName = document.getElementById("details-name")

        if (detailsName) {
            detailsName.textContent = project.name
        }

        const detailsDescription = document.getElementById("details-description")

         if (detailsDescription) {
            detailsDescription.textContent = project.description
        }

        const detailsCardName = document.getElementById("details-card-name")

         if (detailsCardName) {
            detailsCardName.textContent = project.name
        }

        const detailsCardDescription = document.getElementById("details-card-description")

        if (detailsCardDescription) {
            detailsCardDescription.textContent = project.description
        }

        const detailsStatus = document.getElementById("details-status")

         if (detailsStatus) {
            detailsStatus.textContent = project.status
        }

        const detailsRole = document.getElementById("details-role")

         if (detailsRole) {
            detailsRole.textContent = project.userRole
        }

        const detailsCost = document.getElementById("details-cost")

        if (detailsCost) {
            detailsCost.textContent = `$${project.cost}`
        }

        console.log("Project Finish Date:", project.finishDate);

        const detailsFinishDate = document.getElementById("details-finish-date")

        if (detailsFinishDate) {

            const finishDate = new Date(project.finishDate)

            console.log("Finish Date Element: ", detailsFinishDate);
            console.log("Project Finish Date:", project.finishDate);

            detailsFinishDate.textContent = finishDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
        }
    }

    updateProject(project: Project, data: IProject) {

    project.name = data.name
    project.description = data.description
    project.userRole = data.userRole
    project.status = data.status
    project.finishDate = data.finishDate

    project.setUI()

    this.setDetailsPage(project)
}

refreshToDoList() {

    const project = this.selectedProject

    if (!project) return

    const todoList = document.getElementById("todo-list")

    if (!todoList) return

    todoList.innerHTML = ""

    if (!project.toDos) {
        project.toDos = []
    }
    const todos = project.toDos.filter(todo => todo.description.toLowerCase().includes(this.todoSearchText.toLowerCase()) 
    
    || todo.status.toLowerCase().includes(this.todoSearchText.toLowerCase()))



    console.log("Selected Project:", project)
    console.log("Project Object Keys:", Object.keys(project))
    console.log("To-Dos:", project.toDos)

    for (const todo of todos) {

        console.log("Rendering To-Do:", todo)

        const item = document.createElement("div")

        item.className = "todo-item"

        let backgroundColor = "#444"

        switch (todo.status) {
            case "Pending":
                backgroundColor = "#ffc107"
                break
            case "In Progress":
                backgroundColor = "#007bff"
                break
            case "Completed":
                backgroundColor = "#28a745"
                break
        }

        const date = new Date(todo.dueDate)

        const formattedDate = isNaN(date.getTime())? "No Due Date": date.toISOString().split("T")[0]

        item.innerHTML = `
            <div style="background-color:${backgroundColor}; padding: 15px; border-radius: 10px;display: flex; justify-content: space-between; align-items: center; gap: 10px;">
              <div>
                <p>${todo.description}</p>
                <small>${todo.status}</small>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
               <p style="min-width: 100px; text-align: center; white-space: nowrap;">${formattedDate}</p>
               <button class="edit-todo-btn" data-id="${todo.id}">Edit</button>
               <button class="delete-todo-btn" data-id="${todo.id}"><span class="material-icons-round">delete</span></button>
              </div>
                 
            </div>
        
        `

        todoList.append(item)

    const editBtn = item.querySelector(".edit-todo-btn") as HTMLButtonElement
    
    editBtn?.addEventListener("click", () => {

    const descriptionInput =
        document.querySelector(
            '#new-todo-form textarea[name="description"]'
        ) as HTMLTextAreaElement

    const dueDateInput =
        document.querySelector(
            '#new-todo-form input[name="dueDate"]'
        ) as HTMLInputElement

    const statusInput =
        document.querySelector(
            '#new-todo-form select[name="status"]'
        ) as HTMLSelectElement

    descriptionInput.value =
        todo.description

    dueDateInput.value =
        new Date(todo.dueDate)
            .toISOString()
            .split("T")[0]

    statusInput.value =
        todo.status

    this.selectedToDo = todo

    const modal = document.getElementById(
    "new-todo-modal"
) as HTMLDialogElement

modal?.showModal()
})

const deleteBtn = item.querySelector(".delete-todo-btn") as HTMLButtonElement

deleteBtn?.addEventListener("click", () => {

    const project = this.selectedProject

    if (!project) return

    const confirmed = confirm("Are you sure you want to delete this To-Do?")

    if (!confirmed) return

    project.toDos = project.toDos.filter(t => t.id !== todo.id)

    this.refreshToDoList()
})
    }

   
}


    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining 
    }

    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application/json'} )
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON () {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) {return}
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {

                }
            }
         })
         input.addEventListener("change", () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
         })
         input.click()
    }
}