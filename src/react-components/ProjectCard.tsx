import { Project } from "../class/Project";

interface Props {
    project: Project;
    onClick: () => void;
}

export default function ProjectCard({
    project,
    onClick
}: Props) {

    return (
        <div
            className="project-card"
            onClick={onClick}
        >
            <div className="card-header">
                <p
                    style={{
                        backgroundColor: "#4A90E2",
                        padding: "10px",
                        borderRadius: "8px",
                        aspectRatio: "1"
                    }}
                >
                    {project.name
                        .substring(0, 2)
                        .toUpperCase()}
                </p>

                <div>
                    <h5>{project.name}</h5>

                    <p>
                        {project.description}
                    </p>
                </div>
            </div>

            <div className="card-content">

                <div className="card-property">
                    <p style={{ color: "#969696" }}>
                        Status
                    </p>

                    <p>{project.status}</p>
                </div>

                <div className="card-property">
                    <p style={{ color: "#969696" }}>
                        Role
                    </p>

                    <p>{project.userRole}</p>
                </div>

                <div className="card-property">
                    <p style={{ color: "#969696" }}>
                        Cost
                    </p>

                    <p>$0</p>
                </div>

                <div className="card-property">
                    <p style={{ color: "#969696" }}>
                        Estimated Progress
                    </p>

                    <p>0%</p>
                </div>

            </div>
        </div>
    );
}