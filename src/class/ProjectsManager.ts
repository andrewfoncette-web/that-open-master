import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
    defaultData: IProject

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

        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists.`)
        }
        const project = new Project(data)

        console.log("Created project:", project)
        console.log("Project UI:", project.ui)

        project.ui.addEventListener("click", () => {

            this.setDetailsPage(project)

            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")

            const detailsName = document.getElementById("details-name")

            const detailsDescription = document.getElementById("details-description")

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

        const detailsDescription = document.getElementById("details-description")

        if (detailsName) {
            detailsName.textContent = project.name
        }

        if (detailsDescription) {
            detailsDescription.textContent = project.description
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