import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3aSpJVlu7VU-jT05XCgKW-zKkzsPUMpE",
    authDomain: "bim-dev-master-68f34.firebaseapp.com",
    projectId: "bim-dev-master-68f34",
    storageBucket: "bim-dev-master-68f34.firebasestorage.app",
    messagingSenderId: "806802077232",
    appId: "1:806802077232:web:e63bf2c9cc4d40d7d1dff5"
};

const app = initializeApp(firebaseConfig);

export const firebaseDB = getFirestore(app);


//UPDATE A FIRESTORE DOCUMENT
export async function updateDocument(path: string, id: string, data: Record<string, unknown>) {
    const documentRef = doc(firebaseDB, path, id);
    await updateDoc(documentRef, data);

    console.log("Document successfully updated:", id);
}

//DELETE A FIRESTORE DOCUMENT

export async function deleteDocument(path: string, id: string) {
    const documentRef = doc(firebaseDB, path, id);
    await deleteDoc(documentRef);

    console.log("Document successfully deleted:", id);
}




