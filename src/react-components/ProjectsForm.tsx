import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Project } from "../class/Project";
import type { ProjectStatus, UserRole } from "../class/Project";
import { firebaseDB, updateDocument } from "../firebase/index";
import { addDoc, collection } from "firebase/firestore";

interface Props {
    project?: Project;
    onSaved: (project: Project, isNew: boolean) => void;
    onCancel: () => void;
}

export default function ProjectsForm({
    project,
    onSaved,
    onCancel
}: Props) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [userRole, setUserRole] = useState<UserRole>("Developer");
    const [status, setStatus] = useState<ProjectStatus>("Active");
    const [finishDate, setFinishDate] = useState("");

    const editing = !!project;

    // Populate the form when editing an existing project.
    // Reset the fields when creating a new project.
    useEffect(() => {

        if (project) {

            setName(project.name);
            setDescription(project.description);
            setUserRole(project.userRole);
            setStatus(project.status);

            const date = new Date(project.finishDate);

            setFinishDate(
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    date.getDate()
                ).padStart(2, "0")}`
            );

        } else {

            setName("");
            setDescription("");
            setUserRole("Developer");
            setStatus("Active");
            setFinishDate("");

        }

    }, [project]);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (name.trim().length < 5) {
            alert("Project name must be at least 5 characters long.");
            return;
        }

        const projectData = {
            name: name.trim(),
            description: description.trim(),
            userRole,
            status,
            finishDate: finishDate
                ? new Date(finishDate)
                : new Date()
        };

        try {

            if (project) {

                // Update the existing Firebase document.
                await updateDocument(
                    "projects",
                    project.id,
                    projectData
                );

                // Update the existing project object.
                Object.assign(project, projectData);

                onSaved(project, false);

                console.log("Project updated successfully:", project);

            } else {

                // Create a new project.
                const newProject = new Project(projectData);

                newProject.cost = 0;
                newProject.progress = 80;

                // Save the new project to Firebase.
                const docRef = await addDoc(
                    collection(firebaseDB, "projects"),
                    {
                        name: newProject.name,
                        description: newProject.description,
                        userRole: newProject.userRole,
                        status: newProject.status,
                        finishDate: newProject.finishDate,
                        cost: newProject.cost,
                        progress: newProject.progress,
                        color: newProject.color,
                        toDos: []
                    }
                );

                newProject.id = docRef.id;

                onSaved(newProject, true);

                console.log("Project created successfully:", newProject);
            }

        } catch (error) {

            console.error("Error saving project:", error);
            alert("Unable to save the project. Please try again.");

        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            id="new-project-form"
        >

            <h2>{editing ? "Edit Project" : "New Project"}</h2>

            <div className="input-list">

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">person</span>
                        Name
                    </label>

                    <input
                        name="name"
                        type="text"
                        minLength={5}
                        placeholder="What's the name of your project?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <i>
                        TIP: Give a short name to your project with a minimum of 5 characters.
                    </i>

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">notes</span>
                        Description
                    </label>

                    <textarea
                        name="description"
                        cols={30}
                        rows={5}
                        placeholder="Describe your project here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">account_circle</span>
                        Role
                    </label>

                    <select
                        name="userRole"
                        value={userRole}
                        onChange={(e) =>
                            setUserRole(e.target.value as UserRole)
                        }
                    >
                        <option value="Architect">Architect</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Developer">Developer</option>
                    </select>

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">help_center</span>
                        Status
                    </label>

                    <select
                        name="status"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as ProjectStatus)
                        }
                    >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Finished">Finished</option>
                    </select>

                </div>

                <div className="form-field-container">

                    <label htmlFor="finishDate">
                        <span className="material-icons-round">calendar_month</span>
                        Finish Date
                    </label>

                    <input
                        name="finishDate"
                        type="date"
                        value={finishDate}
                        onChange={(e) => setFinishDate(e.target.value)}
                    />

                </div>

            </div>

            <div className="buttons-group">

                <button
                    type="submit"
                    className="btn submit-btn"
                >
                    {editing ? "Update Project" : "Create Project"}
                </button>

                <button
                    type="button"
                    className="btn reset-btn"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
}