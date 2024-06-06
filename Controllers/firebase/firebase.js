import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    deleteUser as authDeleteUser,
    fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    setDoc,
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCi7GSvp53xSF2wXq2N-rjnPmUh0aNGiYo",
    authDomain: "appweb-5bc8d.firebaseapp.com",
    projectId: "appweb-5bc8d",
    storageBucket: "appweb-5bc8d.appspot.com",
    messagingSenderId: "551827984747",
    appId: "1:551827984747:web:196f48e4aca49cd9003c2e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const providerGoogle = new GoogleAuthProvider();

export const popup = () => {
    // Iniciar sesión con Google
    return signInWithPopup(auth, providerGoogle)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            
            // Devolver el usuario para que puedas utilizarlo
            return user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            throw error;
        });
};

export async function getAllUserEmails() {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    const emails = [];
    querySnapshot.forEach((doc) => {
        emails.push(doc.data().userEmail);
    });
    return emails;
}

// Función para eliminar la cuenta del usuario actual
export const deleteCurrentUserAccount = () => {
    const user = currentUser(auth);
    
    if (user) {
        // Eliminar la cuenta del usuario actual
        return user.delete().then(() => {
            console.log('Cuenta eliminada exitosamente.');
        }).catch((error) => {
            console.error('Error al eliminar la cuenta:', error);
            throw error;
        });
    } else {
        console.error('Usuario no autenticado.');
    }
};

export const confi = () => sendEmailVerification(auth.currentUser);

export const login_auth = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const loginout = () => signOut(auth);

export function userstate() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(uid);
        } else {
            window.location.href = '../index.html';
        }
    });
}

export async function username() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user.displayName || user.email);
            } else {
                reject(new Error('No hay usuario autenticado'));
            }
        });
    });
}

export const registerauth = async (email, password) => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
        throw new Error('auth/email-already-in-use');
        
    }
    return createUserWithEmailAndPassword(auth, email, password);
};

export const addDataUser = (Id, name, Fecha, direccion, telefono, gen, sangre, email) =>
    addDoc(collection(db, "users"), {
        userIdentification: Id,
        userName: name,
        userBDaten: Fecha,
        userAddr: direccion,
        userPhone: telefono,
        userGen: gen,
        userRh: sangre,
        userEmail: email
    });

export const recovery_pass = (email) =>
    sendPasswordResetEmail(auth, email);

export const deleteUserFromAuth = async (userEmail) => {
    try {
        await authDeleteUser(auth.currentUser, userEmail);
    } catch (error) {
        throw new Error('Error al autenticar o eliminar usuario: ' + error.message);
    }
};

export const deleteUser = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
            const userEmail = userSnap.data().userEmail;

            // Ensure user is authenticated before attempting to delete
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Delete from Firestore
                await deleteDoc(userDocRef);

                // Delete from authentication
                await deleteUserFromAuth(userEmail);
            } else {
                throw new Error('User not authenticated.');
            }
        } else {
            throw new Error('User document does not exist.');
        }
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};

export const deleteCurrentUser = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
        const userEmail = userSnap.data().userEmail;
        
        try {
            // Eliminar de Firestore
            await deleteDoc(userDocRef);

            // Eliminar de la autenticación
            const currentUser = auth.currentUser;
            await currentUser.delete(); // Utilizar la función de Firebase para eliminar al usuario actualmente autenticado

            // Alternativamente, si deseas seguir utilizando la función deleteUserFromAuth, deberías proporcionar la contraseña correcta del usuario actualmente autenticado
            // await deleteUserFromAuth(userEmail, userPassword); // Asegúrate de obtener la contraseña del usuario correctamente
        } catch (error) {
            throw new Error('Error al eliminar usuario: ' + error.message);
        }
    }
};

export {signInWithEmailAndPassword};
export { auth };
export{getAuth, fetchSignInMethodsForEmail};
export{getDocs, collection, db, deleteDoc};

export const createUser = (codigo, data) => setDoc(doc(db, "users", codigo), data);

export const readUser = (codigo) => getDoc(doc(db, "users", codigo));

export const readAllUsers = () => getDocs(collection(db, "users"));

export const updateUser = (codigo, data) => updateDoc(doc(db, "users", codigo), data);

// Función para verificar si un correo electrónico está siendo utilizado
export async function checkIfEmailExists(email) {
    const auth = getAuth();
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        return signInMethods.length > 0;
    } catch (error) {
        console.error('Error checking if email exists:', error);
        throw error;
    }
}
const storage = getStorage();
const storageRef = ref(storage);