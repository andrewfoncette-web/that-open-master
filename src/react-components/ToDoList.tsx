import { ToDo } from "../class/ToDo";

interface Props {
    todos: ToDo[];
}

export default function ToDoList({
    todos
}: Props) {

    if (todos.length === 0) {
    return null; // Return null if there are no todos to display
}

    return (
        <div>

            {todos.map((todo) => {

                console.log(todo.status);

    let backgroundColor = "#444";

    switch (todo.status) {

        case "Pending":
            backgroundColor = "#f0c419";
            break;

        case "In Progress":
            backgroundColor = "#4d73ff";
            break;

        case "Completed":
            backgroundColor = "#56b347";
            break;
    }

    return (

        <div
            key={todo.id}
            className="todo-item"
        >

            <div
                style={{
                    backgroundColor,
                    padding: "15px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                }}
            >

                <div>

                    <p style={{
                        color: "white",
                        fontWeight: "600",
                        marginBottom: "5px"
                    }}
                    >
                        {todo.description}
                        
                    </p>

                    <small style={{
                        color: "white"
                    }}
                    >
                        {todo.status}
                    </small>

                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}
                >

                    <p style={{
                        whiteSpace: "nowrap",
                        color: "#ffffff"
                    }}
                    >
                        {
                            new Date(todo.dueDate)
                                .toISOString()
                                .split("T")[0]
                        }
                    </p>

                    <button
                        type="button"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                    >
                        <span className="material-icons-round">
                            delete
                        </span>
                    </button>

                </div>

            </div>

        </div>

    );

})}
        </div>
    );
}