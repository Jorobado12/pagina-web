import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { addDoc, collection, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Obtener una referencia a Firestore
const db = getFirestore();
// Obtener una referencia a la instancia de autenticación
const auth = getAuth();

// Función para agregar un comentario
const addComment = async (email, comment) => {
    try {
        // Agregar el comentario a la colección "comentarios" en Firestore
        await addDoc(collection(db, "comentarios"), {
            email: email,
            comment: comment,
            timestamp: serverTimestamp() // Utiliza serverTimestamp() para capturar la fecha y hora del servidor
        });
        const timestamp = new Date();
        const formattedDateTime = timestamp.toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        alert(`Comentario añadido exitosamente. Fecha y hora: ${formattedDateTime}`);
        // Limpiar el campo del formulario después de agregar el comentario
        document.getElementById('commentText').value = '';
    } catch (error) {
        console.error("Error añadiendo comentario: ", error);
        alert("Hubo un error al añadir el comentario.");
    }
};

// Manejar el envío del formulario
document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obtener el usuario actualmente autenticado
    const user = auth.currentUser;
    // Verificar que el usuario esté autenticado y su correo electrónico exista
    if (user && user.email) {
        const email = user.email;
        const comment = document.getElementById('commentText').value;
        // Verificar que el comentario no esté vacío
        if (comment.trim() !== '') {
            // Llamar a la función para agregar el comentario
            await addComment(email, comment);
        } else {
            alert("Por favor, escribe un comentario antes de enviar.");
        }
    } else {
        alert("Debes iniciar sesión para dejar un comentario.");
        // Redirigir al usuario a la página de inicio de sesión
        // Aquí puedes implementar tu propia lógica de redirección
    }
});


