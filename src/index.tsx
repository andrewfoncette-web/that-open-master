import * as React from "react";
import * as ReactDOM from "react-dom/client";
import  Sidebar  from "./react-components/Sidebar";
import ProjectsPage from "./react-components/ProjectsPage";
import { IProject, Project, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"
import { ToDo, ToDoStatus, ToDoPriority } from "./class/ToDo"
import { projectsManager } from "./class/projectsManagerInstance";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as BUI from "@thatopen/ui";
import UsersPage from "./react-components/UsersPage";





const rootElement = document.getElementById("app") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

function App() {
    return (
        <BrowserRouter>
            <Sidebar />

            <main id="content">
                <Routes>
                    <Route
                        path="/"
                        element={<ProjectsPage />}
                    />

                    <Route
                        path="/project/:projectId"
                        element={<ProjectsPage />}
                    />

                    <Route
                        path="/users"
                        element={<UsersPage />}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

BUI.Manager.init();

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "bim-label": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                icon?: string;

            };

            "bim-button": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                 icon?: string;
                 label?: string;
            };

            "bim-text-input": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                 icon?: string;
                 label?: string;
                 name?: string;
                 placeholder?: string;
                 value?: string;
                 type?: string;
                 debounce?: number;
            };

            "bim-grid": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

root.render(<App />);




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





let editingProject: Project | null = null




const backBtn = document.getElementById("back-to-projects");

backBtn?.addEventListener("click", () => {
    showProjectsPage();
});

const projectsNav = document.getElementById("projects-nav");

console.log(projectsNav);

projectsNav?.addEventListener("click", () => {
    showProjectsPage();
});



const newTodoBtn = document.getElementById("new-todo-btn")

console.log(newTodoBtn)

newTodoBtn?.addEventListener("click", (e) => {

    e.preventDefault()

    console.log("New To-Do button clicked")

    showModal("new-todo-modal")

})

const toDoForm = document.getElementById(
    "new-todo-form"
) as HTMLFormElement;


toDoForm?.addEventListener("submit", (e) => {

    e.preventDefault()

    console.log("TODO SUBMIT FIRED")

    const selectedProject =
        projectsManager.selectedProject

        console.log("Selected Project:", selectedProject)

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

        status: formData.get("status") as ToDoStatus,

        priority: formData.get("priority") as ToDoPriority
            
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

    console.log("Searching:", todoSearchInput.value)

    projectsManager.todoSearchText =
        todoSearchInput.value

    projectsManager.refreshToDoList()

})










