import { Project } from "../class/Project";
import * as React from "react";
import { appIcons } from "../globals";

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
                    <bim-label style={{color: "white", fontSize: "1.2rem"}}>{project.name}
                    </bim-label>

                    <bim-label>{project.description}</bim-label>
                </div>
            </div>

            <div className="card-content">

                <div className="card-property">
                    <bim-label icon={appIcons.STATUS} style={{ color: "#969696" }}>
                        Status
                    </bim-label>

                    <bim-label>{project.status}</bim-label>
                </div>

                <div className="card-property">
                    <bim-label icon={appIcons.STATUS} style={{ color: "#969696" }}>
                        Role
                    </bim-label>

                    <bim-label>{project.userRole}</bim-label>
                </div>

                <div className="card-property">
                    <bim-label icon={appIcons.COST} style={{ color: "#969696" }}>
                        Cost
                    </bim-label>

                    <bim-label>${project.cost}</bim-label>

                </div>

                <div className="card-property">
                    <bim-label icon={appIcons.PROGRESS} style={{ color: "#969696" }}>
                        Estimated Progress
                    </bim-label>

                    <bim-label> 0% </bim-label>
                </div>

            </div>
        </div>
    );
}