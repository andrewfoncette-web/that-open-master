
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Project } from "../class/Project";
import { ToDo, ToDoStatus, ToDoPriority } from "../class/ToDo";
import { firebaseDB } from "../firebase/index";
import ProjectTasksList from "./ProjectTasksList";
import * as BUI from "@thatopen/ui";
import * as TEMPLATES from "../ui-templates"
import { setupComponents } from "../bim-components";
import * as OBC from "@thatopen/components"; 
import { ComponentsGrid } from "../ui-templates/grids/components/src";
import { gridSidebarTemplate } from "../ui-templates/containers/grid-sidebar";

type HeaderElement = {
    name: "header";
    state: {};
};

type LeftElement = {
    name: "left";
    state: {};
};

type SidebarElement = {
    name: "sidebar";
    state: TEMPLATES.GridSidebarState;
};

type ComponentsGridElement = {
    name: "componentsGrid";
    state: {
        components: OBC.Components;
        viewport?: BUI.Viewport;
    };
};

type ProjectDetailsGridElements = [
    HeaderElement,
    LeftElement,
    SidebarElement,
    ComponentsGridElement
];

type ProjectDetailsGridLayouts = ["main"];

type ProjectDetailsGrid = BUI.Grid<
    ProjectDetailsGridLayouts,
    ProjectDetailsGridElements
>;

interface Props {
    project: Project;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ProjectDetails({
    project,
    onBack,
    onEdit,
    onDelete
}: Props) {

    const gridRef = React.useRef<HTMLElement>(null);
    const headerRef = React.useRef<HTMLElement>(null);
    const leftColumnRef = React.useRef<HTMLDivElement>(null);

    let engineManager: OBC.Components | null = null 
    

   
const setupGrid = async () => {

    const grid = gridRef.current as ProjectDetailsGrid | null;


    const header = headerRef.current;
    const leftColumn = leftColumnRef.current;

    if (!grid || !header || !leftColumn) {
        return;
    }

    const { components, viewport } = await setupComponents();
    engineManager = components

    console.log("Sidebar template:", TEMPLATES.gridSidebarTemplate);
    console.log("Components grid template:", TEMPLATES.componentsGridTemplate);

   grid.elements = {
    header,
    left: leftColumn,
    sidebar: {
        template: gridSidebarTemplate,
        initialState: {}
    },
    componentsGrid: {
        template: TEMPLATES.componentsGridTemplate,
        initialState: { components, viewport }
    }
};

grid.layouts = {
    main: {
        template: `
            "sidebar sidebar" auto
            "header header" auto
            "left componentsGrid" minmax(0, 1fr)
            / minmax(0, 0.65fr) minmax(0, 1.35fr)
        `
    }
};

    grid.addEventListener("elementcreated", (e: CustomEvent<BUI.
        ElementCreatedEventDetail<ComponentsGrid>>) => {
        const { name, element: componentsGrid } = e.detail
        if (name !== "componentsGrid") return
        grid.updateComponent.sidebar({ grid: componentsGrid })
    })

    grid.layout = "main";
};


   React.useEffect(() => {
    setupGrid()
    return () => {
        engineManager?.dispose()
        engineManager = null 
    }

}, []);


    const [todos, setTodos] = useState<ToDo[]>([]);
    const [loadingTodos, setLoadingTodos] = useState(true);
    const [todoError, setTodoError] = useState("");

    // Load To-Dos from the project's Firestore subcollection
    useEffect(() => {

        let isMounted = true;

        const loadTodos = async () => {

            setLoadingTodos(true);
            setTodoError("");

            try {

                const todosCollection = collection(
                    firebaseDB,
                    "projects",
                    project.id,
                    "todos"
                );

                const querySnapshot = await getDocs(todosCollection);

                const loadedTodos: ToDo[] = querySnapshot.docs.map((todoDoc) => {

                    const data = todoDoc.data();

                    const dueDate = data.dueDate?.toDate
                        ? data.dueDate.toDate()
                        : data.dueDate
                            ? new Date(data.dueDate)
                            : new Date();

                    const todo = new ToDo({
                        description: data.description ?? "",
                        dueDate,
                        status: (data.status ?? "Pending") as ToDoStatus,
                        priority: (data.priority ?? "Medium") as ToDoPriority
                    });

                    // Use the Firestore document ID
                    todo.id = todoDoc.id;

                    return todo;

                });

                if (isMounted) {
                    setTodos(loadedTodos);
                }

            } catch (error) {

                console.error("Error loading To-Dos:", error);

                if (isMounted) {
                    setTodoError("Unable to load To-Dos. Please try again.");
                }

            } finally {

                if (isMounted) {
                    setLoadingTodos(false);
                }

            }

        };

        loadTodos();

        return () => {
            isMounted = false;
        };

    }, [project.id]);

    console.log("Project Progress:", project.progress);

    return (
        <bim-grid
            ref={gridRef} 
            id="project-details"
            style={{
                width: "100%",
                height: "100vh",
                minHeight: "600px"
            }}
        >

            <header ref={headerRef}>
                <div>

                    <h2>{project.name}</h2>
                    <p>{project.description}</p>

                </div>

                <button
                    className="btn-secondary"
                    onClick={onBack}
                >
                    <span className="material-icons-round">
                        arrow_back
                    </span>
                    Back
                </button>

            </header>

            

                <div className="left-column" ref={leftColumnRef}>

                    {/* PROJECT CARD */}

                    <div className="dashboard-card">

                        <div
                            style={{
                                padding: "25px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >

                                <div
                                    style={{
                                        backgroundColor: project.color,
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {project.name
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px"
                                    }}
                                >

                                    <button
                                        className="btn-secondary"
                                        onClick={onEdit}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn-secondary"
                                        onClick={onDelete}
                                        style={{
                                            backgroundColor: "#dc2626",
                                            color: "white"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                            <h4
                                style={{
                                    marginTop: "15px"
                                }}
                            >
                                {project.name}
                            </h4>

                            <p>{project.description}</p>

                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "20px",
                                    justifyContent: "space-between"
                                }}
                            >

                                <div>
                                    <p>Status</p>
                                    <strong>{project.status}</strong>
                                </div>

                                <div>
                                    <p>Cost</p>
                                    <strong>${project.cost}</strong>
                                </div>

                                <div>
                                    <p>Role</p>
                                    <strong>{project.userRole}</strong>
                                </div>

                                <div>
                                    <p>Finish Date</p>
                                    <strong>
                                        {
                                            new Date(project.finishDate)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div
                                style={{
                                    marginTop: "20px"
                                }}
                            >

                                <div
                                    style={{
                                        height: "16px",
                                        backgroundColor: "#444",
                                        borderRadius: "10px",
                                        overflow: "hidden"
                                    }}
                                >

                                    <div
                                        style={{
                                            width: `${project.progress}%`,
                                            height: "100%",
                                            backgroundColor: "#67c323",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {project.progress}%
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* PROJECT TASKS LIST */}

                    {loadingTodos ? (

                        <div className="dashboard-card">
                            <p>Loading To-Dos...</p>
                        </div>

                    ) : todoError ? (

                        <div className="dashboard-card">
                            <p>{todoError}</p>
                        </div>

                    ) : (

                        <ProjectTasksList
                            projectId={project.id}
                            todos={todos}
                            onTodosChanged={setTodos}
                        />

                    )}

                </div>

                {/* RIGHT COLUMN */}

              
        </bim-grid>
    );
}
