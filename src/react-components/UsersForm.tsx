
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { User } from "../class/User";
import { firebaseDB, updateDocument } from "../firebase/index";
import { addDoc, collection } from "firebase/firestore";

interface Props {
    user?: User;
    onSaved: (user: User, isNew: boolean) => void;
    onCancel: () => void;
}

export default function UsersForm({
    user,
    onSaved,
    onCancel
}: Props) {

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const editing = !!user;

    // Populate the form when editing an existing user.
    // Reset the fields when creating a new user.
    useEffect(() => {

        if (user) {

            setName(user.name);
            setTitle(user.title);
            setEmail(user.email);
            setContactNumber(user.contactNumber);

        } else {

            setName("");
            setTitle("");
            setEmail("");
            setContactNumber("");

        }

    }, [user]);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (name.trim().length < 2) {
            alert("Name must be at least 2 characters long.");
            return;
        }

        const userData = {
            name: name.trim(),
            title: title.trim(),
            email: email.trim(),
            contactNumber: contactNumber.trim()
        };

        try {

            if (user) {

                // Update the existing Firebase document.
                await updateDocument(
                    "users",
                    user.id,
                    userData
                );

                // Update the existing user object.
                Object.assign(user, userData);

                onSaved(user, false);

                console.log("User updated successfully:", user);

            } else {

                // Create a new user.
                const newUser = new User(userData);

                // Save the new user to Firebase.
                const docRef = await addDoc(
                    collection(firebaseDB, "users"),
                    userData
                );

                newUser.id = docRef.id;

                onSaved(newUser, true);

                console.log("User created successfully:", newUser);

            }

        } catch (error) {

            console.error("Error saving user:", error);
            alert("Unable to save the user. Please try again.");

        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            id="new-user-form"
        >

            <h2>{editing ? "Edit User" : "New User"}</h2>

            <div className="input-list">

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">person</span>
                        Full Name
                    </label>

                    <input
                        name="name"
                        type="text"
                        minLength={2}
                        placeholder="Enter the user's full name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">work</span>
                        Job Title
                    </label>

                    <input
                        name="title"
                        type="text"
                        placeholder="Enter the user's job title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">email</span>
                        Email Address
                    </label>

                    <input
                        name="email"
                        type="email"
                        placeholder="Enter the user's email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <div className="form-field-container">

                    <label>
                        <span className="material-icons-round">phone</span>
                        Contact Number
                    </label>

                    <input
                        name="contactNumber"
                        type="tel"
                        placeholder="Enter the user's contact number..."
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        required
                    />

                </div>

            </div>

            <div className="buttons-group">

                <button
                    type="submit"
                    className="btn submit-btn"
                >
                    {editing ? "Update User" : "Create User"}
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
