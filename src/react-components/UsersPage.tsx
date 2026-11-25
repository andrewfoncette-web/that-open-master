
import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDB, deleteDocument } from "../firebase/index";
import { User } from "../class/User";
import UsersForm from "./UsersForm";
import UserCard from "./UserCard";

export default function UsersPage() {

    const [editingUser, setEditingUser] =
        React.useState<User | null>(null);

    const [firebaseUsers, setFirebaseUsers] =
        React.useState<User[]>([]);

    const [userSearch, setUserSearch] =
        React.useState("");

    const [loadingUsers, setLoadingUsers] =
        React.useState(true);

    const newUserButtonRef = React.useRef<HTMLElement>(null);
    const searchInputRef = React.useRef<HTMLElement>(null);

    // Retrieve users from Firestore

    const getFirestoreUsers = async () => {

        try {

            setLoadingUsers(true);

            const usersCollection = collection(firebaseDB, "users");

            const firebaseSnapshot = await getDocs(usersCollection);

            const loadedUsers: User[] = firebaseSnapshot.docs.map((doc) => {

                const data = doc.data();

                const user = new User({
                    name: data.name ?? "",
                    title: data.title ?? "",
                    email: data.email ?? "",
                    contactNumber: data.contactNumber ?? ""
                });

                // Preserve Firebase document ID

                user.id = doc.id;

                return user;

            });

            setFirebaseUsers(loadedUsers);

            console.log("Users retrieved from Firebase:", loadedUsers);

        } catch (error) {

            console.error("Error retrieving Firebase users:", error);

        } finally {

            setLoadingUsers(false);

        }

    };

    // Load users when the page opens

    React.useEffect(() => {

        getFirestoreUsers();

    }, []);

    // Handle New User button and Search input

    React.useEffect(() => {

        const newUserButton = newUserButtonRef.current;
        const searchInput = searchInputRef.current;

        const handleNewUser = () => {
            onNewUserClick();
        };

        const handleSearch = (event: Event) => {

            const target = event.target as HTMLInputElement;

            setUserSearch(target.value);

        };

        newUserButton?.addEventListener("click", handleNewUser);
        searchInput?.addEventListener("input", handleSearch);

        return () => {

            newUserButton?.removeEventListener("click", handleNewUser);
            searchInput?.removeEventListener("input", handleSearch);

        };

    }, []);

    // Set search input accent colour

    React.useEffect(() => {

        const searchInput = searchInputRef.current;

        searchInput?.style.setProperty(
            "--bim-ui_main-base",
            "#029AE0"
        );

    }, []);

    // Open New User modal

    const onNewUserClick = () => {

        setEditingUser(null);

        const modal = document.getElementById(
            "new-user-modal"
        ) as HTMLDialogElement;

        modal?.showModal();

    };

    // Open Edit User modal

    const onEditUserClick = (user: User) => {

        setEditingUser(user);

        const modal = document.getElementById(
            "new-user-modal"
        ) as HTMLDialogElement;

        modal?.showModal();

    };

    // Delete User

    const onDeleteUserClick = async (user: User) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${user.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {

            await deleteDocument("users", user.id);

            setFirebaseUsers(previousUsers =>
                previousUsers.filter(item => item.id !== user.id)
            );

            console.log("User deleted successfully:", user.id);

        } catch (error) {

            console.error("Error deleting user:", error);

            alert("Unable to delete the user. Please try again.");

        }

    };

    // Filter users based on search

    const filteredUsers = firebaseUsers.filter((user) =>
        user.name
            .toLowerCase()
            .includes(userSearch.trim().toLowerCase())
    );

    return (

        <>

            {/* New / Edit User Modal */}

            <dialog id="new-user-modal">

                <UsersForm
                    user={editingUser ?? undefined}

                    onSaved={(savedUser, isNew) => {

                        if (isNew) {

                            setFirebaseUsers(previousUsers => [
                                ...previousUsers,
                                savedUser
                            ]);

                        } else {

                            setFirebaseUsers(previousUsers =>
                                previousUsers.map(user =>
                                    user.id === savedUser.id
                                        ? savedUser
                                        : user
                                )
                            );

                        }

                        setEditingUser(null);

                        const modal = document.getElementById(
                            "new-user-modal"
                        ) as HTMLDialogElement;

                        modal?.close();

                    }}

                    onCancel={() => {

                        setEditingUser(null);

                        const modal = document.getElementById(
                            "new-user-modal"
                        ) as HTMLDialogElement;

                        modal?.close();

                    }}

                />

            </dialog>

            {/* Users Page */}

            <div
                className="page"
                id="users-page"
            >

                <header>

                    <bim-label
                        style={{
                            fontSize: "1.8rem",
                            fontWeight: "bold"
                        }}
                    >
                        Users
                    </bim-label>

                    {/* Search Users */}

                    <bim-text-input
                        ref={searchInputRef}
                        icon="material-symbols:search"
                        placeholder="Search Users..."
                        type="text"
                        value={userSearch}
                        style={{
                            width: "400px",
                            flex: "0 0 400px"
                        }}
                    />

                    {/* New User Button */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "15px"
                        }}
                    >

                        <bim-button
                            ref={newUserButtonRef}
                            icon="material-symbols:add"
                            label="New User"
                        />

                    </div>

                </header>

                {/* User Cards */}

                <div
                    className="grid"
                    style={{
                        minHeight: "500px",
                        alignItems: filteredUsers.length === 0 ? "center" : "start",
                        justifyItems: filteredUsers.length === 0 ? "center" : "stretch"
                    }}
                >

                    {loadingUsers ? (

                        <p>Loading users from Firebase...</p>

                    ) : filteredUsers.length > 0 ? (

                        filteredUsers.map((user) => (

                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={onEditUserClick}
                                onDelete={onDeleteUserClick}
                            />

                        ))

                    ) : (

                        <div
                            style={{
                                gridColumn: "1 / -1",
                                width: "100%",
                                minHeight: "500px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                color: "#64748b",
                                padding: "40px 20px",
                                boxSizing: "border-box"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "48px",
                                    marginBottom: "15px"
                                }}
                            >
                                👥
                            </div>

                            <h3
                                style={{
                                    color: "#334155",
                                    margin: "0 0 10px 0",
                                    fontSize: "20px"
                                }}
                            >
                                No Users Found
                            </h3>

                            <p
                                style={{
                                    fontSize: "14px",
                                    margin: "0",
                                    maxWidth: "350px",
                                    lineHeight: "1.6"
                                }}
                            >
                                We couldn't find any users matching your search.
                                Try another name or add a new user.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </>

    );

}
