import {IProject, Project, ProjectStatus, UserRole} from "./class/Project"
import {ProjectsManager} from "./class/ProjectsManager"

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
    if (!modal) return console.warn("Modal not found. ID: ", id) // log a warning if the modal does not exist{
        if (!modal.open) {
            modal.showModal()
        } else {
            modal.close()
        }
    }


const projectsListUI = document.getElementById("projects-list") as HTMLElement

console.log("Projects List UI: ", projectsListUI)

const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if(newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("New Project button not found")
}

const projectForm = document.getElementById("new-project-form")
if(projectForm && projectForm instanceof HTMLFormElement) {
   projectForm.addEventListener("submit", (e) => {

    console.log("FORM SUBMITTED")
    e.preventDefault() // This prevents the form from refreshing the page when submitted.
    const formData = new FormData(projectForm) // This creates an object that we can use to easily access the form data.
    const projectData: IProject = {
        name: formData.get("name") as string, // We need to cast the value to a string because FormData.get() returns FormDataEntryValue | null.
        description: formData.get("description") as string,
        userRole: formData.get("userRole") as UserRole,
        status: formData.get("status") as ProjectStatus,
        finishDate: new Date(formData.get("finishDate") as string)
    }
    try {
        console.log("Creating project...")

       const project = projectsManager.newProject(projectData)  // This creates a new instance of the Project class using the data from the form.
       
       console.log("Project created: ", project)

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