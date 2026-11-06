import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
    addDoc,
    collection,
    doc,
    updateDoc
} from "firebase/firestore";

import { firebaseDB } from "../firebase/index";
import {
    ToDo,
    ToDoStatus,
    ToDoPriority
} from "../class/ToDo";

interface Props {
    projectId: string;
    todo?: ToDo;
    onSaved: (todo: ToDo) => void;
    onCancel: () => void;
}

export default function ToDoForm({
    projectId,
    todo,
    onSaved,
    onCancel
}: Props) {

    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] =
        useState<ToDoStatus>("Pending");
    const [priority, setPriority] = 
        useState<ToDoPriority>("Medium");

    const editing = !!todo;

    useEffect(() => {

        if (todo) {

            setDescription(todo.description);
            setStatus(todo.status);
            setPriority(todo.priority);

            const date = new Date(todo.dueDate);

            setDueDate(
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    date.getDate()
                ).padStart(2, "0")}`
            );

        } else {

            setDescription("");
            setDueDate("");
            setStatus("Pending");
            setPriority("Medium");

        }

    }, [todo]);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (description.trim().length === 0) {
            alert("Please enter a To-Do description.");
            return;
        }

        if (!dueDate) {
            alert("Please select a due date.");
            return;
        }

        try {

            const todoData = {
                description: description.trim(),
                dueDate: new Date(dueDate),
                status,
                priority
            };

            console.log("Priority state before saving:", priority);
            console.log("To-Do data being saved:", todoData);

            if (todo) {

                const todoRef = doc(
                    firebaseDB,
                    "projects",
                    projectId,
                    "todos",
                    todo.id
                );

                await updateDoc(todoRef, todoData);

                const updatedTodo = new ToDo(todoData);

                updatedTodo.id = todo.id;

                console.log("Updated To-Do object:", updatedTodo);
                console.log("Updated priority:", updatedTodo.priority);

                onSaved(updatedTodo);

            } else {

                const todosCollection = collection(
                    firebaseDB,
                    "projects",
                    projectId,
                    "todos"
                );

                const docRef = await addDoc(
                    todosCollection,
                    todoData
                );

                const newTodo = new ToDo(todoData);

                newTodo.id = docRef.id;

                onSaved(newTodo);

            }

            setDescription("");
            setDueDate("");
            setStatus("Pending");
            setPriority("Medium");

        } catch (error) {

            console.error("Error saving To-Do:", error);

            alert(
                "Unable to save the To-Do. Please try again."
            );

            return;
        }

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="todo-form"
        >

            <h4>
                {editing ? "Edit To-Do" : "New To-Do"}
            </h4>

            <div className="input-list">

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">
                            description
                        </span>
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter your To-Do..."
                        rows={3}
                        required
                    />

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">
                            calendar_month
                        </span>
                        Due Date
                    </label>

                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) =>
                            setDueDate(e.target.value)
                        }
                        required
                    />

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">
                            help_center
                        </span>
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value as ToDoStatus
                            )
                        }
                    >

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                    </select>

                </div>

                <div className="form-field-container">

                  <label>
                      <span className="material-icons-round">
                           flag
                      </span>
                          Priority
                   </label>

                   <select
                      value={priority}
                      onChange={(e) =>
                           setPriority(
                               e.target.value as ToDoPriority
                            )
                     }
                 >

                     <option value="Low">
                            Low
                     </option>

                     <option value="Medium">
                          Medium
                     </option>

                     <option value="High">
                           High
                     </option>

                    </select>

                </div>

            </div>

            <div className="buttons-group">

                <button
                    type="submit"
                    className="btn submit-btn"
                >
                    {editing
                        ? "Update To-Do"
                        : "Create To-Do"}
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