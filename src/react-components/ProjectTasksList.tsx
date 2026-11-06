
import { useState } from "react";
import { ToDo } from "../class/ToDo";
import SearchBox from "./SearchBox";
import ToDoCard from "./ToDoCard";
import ToDoForm from "./ToDoForm";

interface Props {
    projectId: string;
    todos: ToDo[];
    onTodosChanged: (todos: ToDo[]) => void;
}

export default function ProjectTasksList({
    projectId,
    todos,
    onTodosChanged
}: Props) {

    const [searchText, setSearchText] = useState("");
    const [editingTodo, setEditingTodo] =
        useState<ToDo | undefined>();

    const [showTodoForm, setShowTodoForm] = useState(false);

    const filteredTodos = todos.filter((todo) =>
        todo.description
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    return (
        <div className="dashboard-card">

            <div style={{ padding: "25px" }}>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <h4>To-Do</h4>

                    <SearchBox
                        value={searchText}
                        onChange={setSearchText}
                    />

                    <button
                        type="button"
                        className="todo-add-button"
                        onClick={() => {
                            setEditingTodo(undefined);
                            setShowTodoForm(true);
                        }}
                    >
                        +
                    </button>

                </div>

                <div style={{ marginTop: "15px" }}>

                    {filteredTodos.length > 0 ? (

                        filteredTodos.map((todo) => (

                            <ToDoCard
                                key={todo.id}
                                todo={todo}
                                onEdit={() => {
                                    setEditingTodo(todo);
                                    setShowTodoForm(true);
                                }}
                            />

                        ))

                    ) : (

                        <p>
                            {searchText
                                ? "No To-Dos Found"
                                : "There are no To-Dos for this project yet."}
                        </p>

                    )}

                </div>

                {showTodoForm && (

                    <ToDoForm
                        projectId={projectId}
                        todo={editingTodo}
                        onSaved={(savedTodo) => {

                            const todoExists = todos.some(
                                existingTodo =>
                                    existingTodo.id === savedTodo.id
                            );

                            if (todoExists) {

                                const updatedTodos = todos.map(
                                    existingTodo =>
                                        existingTodo.id === savedTodo.id
                                            ? savedTodo
                                            : existingTodo
                                );

                                onTodosChanged(updatedTodos);

                            } else {

                                onTodosChanged([
                                    ...todos,
                                    savedTodo
                                ]);

                            }

                            setEditingTodo(undefined);
                            setShowTodoForm(false);
                        }}
                        onCancel={() => {
                            setEditingTodo(undefined);
                            setShowTodoForm(false);
                        }}
                    />

                )}

            </div>

        </div>
    );
}
