import { ToDo } from "../class/ToDo";

interface Props {
    todo: ToDo;
    onEdit: () => void;
}

export default function ToDoCard({
    todo,
    onEdit
}: Props) {

    const status = todo.status ?? "Pending";
    const priority = todo.priority ?? "Medium";

    return (
        <div className="dashboard-card">

            <div style={{ padding: "20px" }}>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>
                        <h4>{todo.description}</h4>
                    </div>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onEdit}
                    >
                        Edit
                    </button>

                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                        alignItems: "center"
                    }}
                >

                    <span
                        className={`todo-status ${status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                    >
                        {status}
                    </span>

                    <span
                        className={`todo-priority ${priority.toLowerCase()}`}
                    >
                        {priority}
                    </span>

                   <span className="todo-due-date">
                        📅 Due:{" "}
                        {new Date(todo.dueDate)
                              .toISOString()
                              .split("T")[0]}
                    </span>

                </div>

            </div>

        </div>
    );
}

console.log("ToDoCard component loaded");