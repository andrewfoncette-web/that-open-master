import * as React from "react";

import logo from "../../assests/Construction Company Logo.svg";


function showProjectsPage() {

    window.dispatchEvent(
        new CustomEvent("go-home")
    );
}


export default function Sidebar() {
    return (
         <aside id="sidebar">
            <img src={logo} alt="Company Logo" id="company-logo" />
            <ul id="nav-buttons">
                <li id="projects-nav" onClick={showProjectsPage}><span className="material-icons-round">apartment</span>Projects</li>
                <li><span className="material-icons-round">person</span>Users</li>
            </ul>
        </aside>
    );
}