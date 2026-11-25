
import * as React from "react";
import { User } from "../class/User";

interface Props {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export default function UserCard({
    user,
    onEdit,
    onDelete
}: Props) {

    const nameParts = user.name.trim().split(/\s+/);

    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : nameParts[0]?.[0] ?? "";

    return (
        <div
            className="user-card"
            style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid var(--bim-ui_main-contrast-20)",
                backgroundColor: "var(--bim-ui_bg-contrast-10)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
            }}
        >

            {/* User Information */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                }}
            >

                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        minWidth: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#029AE0",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold"
                    }}
                >
                    {initials.toUpperCase()}
                </div>

                <div style={{ minWidth: 0 }}>

                    <h3 style={{ margin: "0 0 5px 0" }}>
                        {user.name}
                    </h3>

                    <p style={{
                        margin: 0,
                        color: "#94A3B8",
                        fontSize: "14px"
                    }}>
                        {user.title}
                    </p>

                </div>

            </div>

            {/* Contact Information */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    fontSize: "14px"
                }}
            >

                <div>
                    <strong>Email: </strong>
                    <span>{user.email}</span>
                </div>

                <div>
                    <strong>Contact: </strong>
                    <span>{user.contactNumber}</span>
                </div>

            </div>

            {/* Edit and Delete Buttons */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "10px"
                }}
            >

                <button
                    type="button"
                    className="btn"
                    onClick={() => onEdit(user)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="btn reset-btn"
                    onClick={() => onDelete(user)}
                >
                    Delete
                </button>

            </div>

        </div>
    );
}
