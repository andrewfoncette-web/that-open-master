
import * as React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assests/Construction Company Logo.svg";

export default function Sidebar() {

    const projectsButtonRef = React.useRef<HTMLElement>(null);
    const usersButtonRef = React.useRef<HTMLElement>(null);

    const navigate = useNavigate();

    React.useEffect(() => {

        const projectsButton = projectsButtonRef.current;
        const usersButton = usersButtonRef.current;

       

        const showProjectsPage = () => {
          navigate("/");
        };

        const showUsersPage = () => {
          navigate("/users");
        };

        projectsButton?.addEventListener(
            "click",
            showProjectsPage
        );

        usersButton?.addEventListener(
            "click", 
            showUsersPage
        );

        return () => {
            projectsButton?.removeEventListener(
                "click",
                showProjectsPage
            );

            usersButton?.removeEventListener(
                "click",
                showUsersPage
            );
        };

    }, [navigate]);

    return (
        <aside id="sidebar">

            <img
                src={logo}
                alt="Company Logo"
                id="company-logo"
            />

            <ul id="nav-buttons">

                <li id="projects-nav">
                    <bim-button
                        ref={projectsButtonRef}
                        icon="material-symbols:apartment"
                        label="Projects"
                        style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            backgroundColor: "transparent",
                            "--bim-label--fz": "16px"
                        } as React.CSSProperties}
                    />
                </li>

                <li>
                    <bim-button
                        ref={usersButtonRef}
                        icon="material-symbols:person"
                        label="Users"
                        style={{
                           width: "100%",
                           border: "none",
                           outline: "none",
                           backgroundColor: "transparent",
                           "--bim-label--fz": "16px"
                        } as React.CSSProperties}
                    />
                </li>
            </ul>

        </aside>
    );
}
