import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDB, deleteDocument } from "../firebase/index";
import { Project } from "../class/Project";
import { projectsManager } from "../class/projectsManagerInstance";
import ProjectDetails from "./ProjectDetails";
import ProjectCard from "./ProjectCard";
import  SearchBox  from "./SearchBox";
import { useNavigate, useParams } from "react-router-dom";
import ProjectsForm from "./ProjectsForm";




export default function ProjectsPage() {

    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [editingProject, setEditingProject] =
    React.useState<Project | null>(null);

    const [selectedProject, setSelectedProject] = 
    React.useState<Project | null>(null);

    const [, forceUpdate] = 
    React.useState(0);

    const [projectSearch, setProjectSearch] = 
    React.useState("");

    const uploadButtonRef = React.useRef<HTMLElement>(null);
    const downloadButtonRef = React.useRef<HTMLElement>(null);
    const newProjectButtonRef = React.useRef<HTMLElement>(null);
    const searchInputRef = React.useRef<HTMLElement>(null);

    const [firebaseProjects, setFirebaseProjects] =
    React.useState<Project[]>([]);

    const [loadingProjects, setLoadingProjects] = 
    React.useState(true);

   const getFirestoreProjects = async () => {
    try {
        setLoadingProjects(true);

        const projectsCollection = collection(firebaseDB, "projects");

        const firebaseSnapshot = await getDocs(projectsCollection);

        const loadedProjects: Project[] = firebaseSnapshot.docs.map((doc) => {
            const data = doc.data();

            const project = new Project({
                name: data.name ?? "",
                description: data.description ?? "",
                userRole: data.userRole,
                status: data.status,

                finishDate: data.finishDate?.toDate
                    ? data.finishDate.toDate()
                    : data.finishDate
                        ? new Date(data.finishDate)
                        : new Date(),

                toDos: data.toDos ?? []
            });

            // Preserve the Firebase document ID
            project.id = doc.id;

            // Restore additional project properties
            project.cost = data.cost ?? 0;
            project.progress = data.progress ?? 0;
            project.color = data.color ?? project.color;

            return project;
        });

        setFirebaseProjects(loadedProjects);

        console.log("Projects retrieved from Firebase:", loadedProjects);

    } catch (error) {
        console.error("Error retrieving Firebase projects:", error);
    } finally {
        setLoadingProjects(false);
    }
};

   React.useEffect(() => {

    getFirestoreProjects();

}, []);


React.useEffect(() => {
    if (!projectId) {
        setSelectedProject(null);
        return;
    }

    if (firebaseProjects.length === 0) {
        return;
    }

    const project = firebaseProjects.find(
        (item) => item.id === projectId
    );

    if (project) {
        projectsManager.selectedProject = project;
        setSelectedProject(project);
    } else {
        setSelectedProject(null);
        console.error("Project not found:", projectId);
    }
}, [projectId, firebaseProjects]);


    React.useEffect(() => {

    if (projectsManager.list.length === 0) {

        projectsManager.newProject({
            name: "Default Name",
            description: "Default Description",
            userRole: "Developer",
            status: "Active",
            finishDate: new Date()
        });

        console.log( "Project Count After Creation:",projectsManager.list.length);

        forceUpdate(value => value + 1);

    }

}, []);

React.useEffect(() => {
    const goHome = () => {
        navigate("/");
    };

    window.addEventListener("go-home", goHome);

    return () => {
        window.removeEventListener("go-home", goHome);
    };
}, [navigate]);

React.useEffect(() => {

    const uploadButton = uploadButtonRef.current;
    const downloadButton = downloadButtonRef.current;
    const newProjectButton = newProjectButtonRef.current;

    const handleUpload = () => {
        projectsManager.importFromJSON();
    };

    const handleDownload = () => {
        projectsManager.exportToJSON();
    };

    const handleNewProject = () => {
        onNewProjectClick();
    };

    const searchInput = searchInputRef.current;

    const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setProjectSearch(target.value);
    };

    
    uploadButton?.addEventListener("click", handleUpload);
    downloadButton?.addEventListener("click", handleDownload);
    newProjectButton?.addEventListener("click", handleNewProject);
    searchInput?.addEventListener("input", handleSearch);

    return () => {
        uploadButton?.removeEventListener("click", handleUpload);
        downloadButton?.removeEventListener("click", handleDownload);
        newProjectButton?.removeEventListener("click", handleNewProject);
        searchInput?.removeEventListener("input", handleSearch);
    };

}, []);

    

    const onNewProjectClick = () => {
         const modal = document.getElementById("new-project-modal")
          if(!(modal && modal instanceof HTMLDialogElement)){return}
            modal.showModal()
   }

   React.useEffect(() => {

    const searchInput = searchInputRef.current;

    searchInput?.style.setProperty(
        "--bim-ui_main-base",
        "#029AE0"
    );

}, []);

/*
       const onProjectSearch = (value: string) => {
        console.log("Search value received:", value); // Log the received search value
        setProjectSearch(value);
       
        };

        const filteredProjects = projectsManager.list.filter((project) =>
            project.name.toLowerCase().includes(projectSearch.trim().toLowerCase())
        );

        console.log("Filtered Projects:", filteredProjects); // Log the filtered projects to verify the filtering logic
*/  

const onEditProjectClick = (project: Project) => {

    setEditingProject(project);

    const modal = document.getElementById(
        "new-project-modal"
    ) as HTMLDialogElement;

    modal?.showModal();
};


const onDeleteProjectClick = async (project: Project) => {

    const confirmed = window.confirm(
        `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
        await deleteDocument("projects", project.id);

        setFirebaseProjects(previousProjects =>
            previousProjects.filter(item => item.id !== project.id)
        );

        setSelectedProject(null);
        setEditingProject(null);

        projectsManager.selectedProject = null;

        navigate("/");

        console.log("Project deleted successfully:", project.id);

    } catch (error) {
        console.error("Error deleting project:", error);

        alert("Unable to delete the project. Please try again.");
    }
};


console.log("Projects:", projectsManager.list);

 const filteredProjects = firebaseProjects.filter((project) =>
    project.name
        .toLowerCase()
        .includes(projectSearch.trim().toLowerCase())
);

    return( 
    <>

    <dialog id="new-project-modal">

    <ProjectsForm
        project={editingProject ?? undefined}

        onSaved={(savedProject, isNew) => {

            if (isNew) {

                setFirebaseProjects(previousProjects => [
                    ...previousProjects,
                    savedProject
                ]);

            } else {

                setFirebaseProjects(previousProjects =>
                    previousProjects.map(project =>
                        project.id === savedProject.id
                            ? savedProject
                            : project
                    )
                );

                setSelectedProject(savedProject);
                projectsManager.selectedProject = savedProject;

            }

            setEditingProject(null);

            const modal = document.getElementById(
                "new-project-modal"
            ) as HTMLDialogElement;

            modal?.close();

        }}

        onCancel={() => {

            setEditingProject(null);

            const modal = document.getElementById(
                "new-project-modal"
            ) as HTMLDialogElement;

            modal?.close();

        }}
    />

</dialog>  

    
{!selectedProject && (
    <div 
        className="page" 
        id="projects-page" 
    >
    <header>

        <bim-label style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
          Projects
        </bim-label>
                
       <bim-text-input
           ref={searchInputRef}
           icon="material-symbols:search"
           placeholder="Search Projects..."
           type="text"
           value={projectSearch}
           style={{
                    width: "400px",
                    flex: "0 0 400px"
                }}
    />

<div style={{display: "flex", alignItems: "center", columnGap: "15px"}}>

    <bim-button
        ref={uploadButtonRef}
        icon="material-symbols:upload"
        label="Upload"
    />

    <bim-button
        ref={downloadButtonRef}
        icon="material-symbols:download"
        label="Download"
    />

    <bim-button
        ref={newProjectButtonRef}
        icon="material-symbols:add"
        label="New Project"
    />

</div>
    </header>

             <div 
                 className="grid"
                 style={{
                           minHeight: "500px",
                           alignItems: filteredProjects.length === 0 ? "center" : "start",
                           justifyItems: filteredProjects.length === 0 ? "center" : "stretch"
                }}
                 
             >

            {loadingProjects ? (
                <p>Loading projects from Firebase...</p>
            ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                   <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => {
                           projectsManager.selectedProject = project;
                           setSelectedProject(project);

                           navigate(`/project/${project.id}`);
                     }}
        />
    ))
) : (
    <div style={{
    gridColumn: "1 / -1",
    width: "100%",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#64748b",
    padding: "40px 20px",
    boxSizing: "border-box"
}}>
    <div style={{ fontSize: "48px", marginBottom: "15px" }}>
        📂
    </div>

    <h3 style={{
        color: "#334155",
        margin: "0 0 10px 0",
        fontSize: "20px"
    }}>
        No Projects Found
    </h3>

    <p style={{
        fontSize: "14px",
        margin: "0",
        maxWidth: "350px",
        lineHeight: "1.6"
    }}>
        We couldn't find any projects matching your search.
        Try another project name or clear your search.
    </p>
</div>
)} 
               
        </div>
        </div>)}


       {selectedProject && (
          <ProjectDetails
                project={selectedProject}
                onBack={() => navigate("/")}
                onEdit={() => onEditProjectClick(selectedProject)}
                onDelete={() => onDeleteProjectClick(selectedProject)}
         />
        )}

    </>
       
);

}
