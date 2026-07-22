import {IProject, Project, ProjectStatus, UserRole} from "./class/Project"
import {ProjectsManager} from "./class/ProjectsManager"
import { ToDo, ToDoStatus } from "./class/ToDo"

let editingToDo: ToDo | null = null

function showModal(id: string) {
    const modal = document.getElementById(id)
   if(modal && modal instanceof HTMLDialogElement) {
        modal.showModal()
   } else {
        console.warn("The provided modal wasn't found. ID: ", id)
   }
}

function showProjectsPage() {
    const projectsPage = document.getElementById("projects-page");
    const detailsPage = document.getElementById("project-details");

    if (!projectsPage || !detailsPage) return;

    projectsPage.style.display = "flex";
    detailsPage.style.display = "none";
}

function closeModal(id: string) {
    const modal = document.getElementById(id)
   if(modal && modal instanceof HTMLDialogElement) {
        modal.close()
   } else {
        console.warn("The provided modal wasn't found. ID: ", id)
   }
}

function toggleModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement | null

    if (!modal) 
        return console.warn("Modal not found. ID: ", id) // log a warning if the modal does not exist

        if (!modal.open) {
            modal.showModal()
        } else {
            modal.close()
        }
    }


const projectsListUI = document.getElementById("projects-list") as HTMLElement

console.log("Projects List UI: ", projectsListUI)

const projectsManager = new ProjectsManager(projectsListUI)
let editingProject: Project | null = null

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if(newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("New Project button not found")
}

const projectForm = document.getElementById(
    "new-project-form"
) 

const toDoForm = document.getElementById(
    "new-todo-form"
) as HTMLFormElement
if(projectForm && projectForm instanceof HTMLFormElement) {
   projectForm.addEventListener("submit", (e) => {

    console.log("FORM SUBMITTED")
    e.preventDefault() // This prevents the form from refreshing the page when submitted.
    const formData = new FormData(projectForm) // This creates an object that we can use to easily access the form data.

    const finishDateValue = formData.get("finishDate") as string;
    
    const projectData: IProject = {
        name: formData.get("name") as string, // We need to cast the value to a string because FormData.get() returns FormDataEntryValue | null.
        description: formData.get("description") as string,
        userRole: formData.get("userRole") as UserRole,
        status: formData.get("status") as ProjectStatus,
        finishDate: finishDateValue
            ? new Date(finishDateValue) // Convert the string to a Date object if it's not null
            : new Date() // Use the current date if the finishDate is null
    }

    console.log("Finish Date:", projectData.finishDate);

    //Validate name length
    if (projectData.name.trim().length < 5) {
        alert("Project name must be at least 5 characters long.");
        return;
    }

    try {
        console.log("Creating project...")

       if (editingProject) {

        projectsManager.updateProject(editingProject, projectData)
        editingProject = null

       }  else {

        const project = projectsManager.newProject(projectData)

        console.log("Project created: ", project)
       }

       projectForm.reset() // This resets the form fields after submission.

       closeModal("new-project-modal") 

    } catch (error) {
        console.error(error) // This logs the error to the console if a project with the same name already exists.
        alert(error) // This shows an alert with the error message if a project with the same name already exists.
    }
})

} else {
    console.warn("The project form was not found. Check the ID!")
}

const exportProjectsBtn = document.getElementById("export-project-btn")

if (exportProjectsBtn) {
    exportProjectsBtn.addEventListener("click", () => {
        projectsManager.exportToJSON()
    })
}

const importProjectsBtn = document.getElementById("import-project-btn")

if (importProjectsBtn) {
    importProjectsBtn.addEventListener("click", () => {
        projectsManager.importFromJSON()
    })
}

const cancelProjectBtn = document.getElementById("cancel-project-btn")

if (cancelProjectBtn && projectForm instanceof HTMLFormElement) {
    cancelProjectBtn.addEventListener("click", () => {
        projectForm.reset()
        closeModal("new-project-modal")
    })
}


const backBtn = document.getElementById("back-to-projects");

backBtn?.addEventListener("click", () => {
    showProjectsPage();
});

const projectsNav = document.getElementById("projects-nav");

console.log(projectsNav);

projectsNav?.addEventListener("click", () => {
    showProjectsPage();
});

const editProjectBtn = document.getElementById("edit-project-btn")

editProjectBtn?.addEventListener("click", () => {

    console.log("Edit Project button clicked")

    const project = projectsManager.selectedProject

    console.log("Selected project: ", project)

    if (!project || !projectForm) return

    console.log("Name: ", project.name)
    console.log("Description: ", project.description)

    editingProject = project

    const form = projectForm as HTMLFormElement

    const nameInput = form.elements.namedItem("name") as HTMLInputElement
    const descriptionInput = form.elements.namedItem("description") as HTMLTextAreaElement

    console.log("Name input: ", nameInput)
    console.log("Description input: ", descriptionInput)

    nameInput.value = project.name
    descriptionInput.value = project.description

    console.log("Before opening modal")

    showModal("new-project-modal")

    console.log("After opening modal")

})

const newTodoBtn = document.getElementById("new-todo-btn")

console.log(newTodoBtn)

newTodoBtn?.addEventListener("click", (e) => {

    e.preventDefault()

    console.log("New To-Do button clicked")

    showModal("new-todo-modal")

})

toDoForm?.addEventListener("submit", (e) => {

    e.preventDefault()

    const selectedProject =
        projectsManager.selectedProject

    if (!selectedProject) return

    const formData = new FormData(toDoForm)

    console.log("Status from form: ", formData.get("status"))


    if (projectsManager.selectedToDo) {

        projectsManager.selectedToDo.description = formData.get("description") as string

        projectsManager.selectedToDo.dueDate = new Date(formData.get("dueDate") as string)

        projectsManager.selectedToDo.status = formData.get("status") as ToDoStatus

        projectsManager.selectedToDo = null

    } else {

    const todo = new ToDo({
        description:
            formData.get("description") as string,

        dueDate:
            new Date(
                formData.get("dueDate") as string
            ),

        status: formData.get("status") as ToDoStatus
            
    })

    console.log("Created To-Do: ", todo)

    selectedProject.toDos.push(todo)

    console.log(selectedProject.toDos)

}

    toDoForm.reset()

    closeModal("new-todo-modal")

    projectsManager.refreshToDoList()
    
})

const todoSearchInput =
    document.getElementById(
        "todo-search"
    ) as HTMLInputElement


todoSearchInput?.addEventListener("input", () => {

    projectsManager.todoSearchText =
        todoSearchInput.value

    projectsManager.refreshToDoList()

})
