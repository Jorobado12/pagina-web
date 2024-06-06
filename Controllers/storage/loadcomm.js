import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {getDocs, collection, getFirestore, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Obtener una referencia a Firestore
const db = getFirestore();
// Obtener una referencia a la instancia de autenticación
const auth = getAuth();

// Función para cargar los comentarios
// Función para cargar los comentarios
// Función para cargar los comentarios
const deleteComment = async (commentId) => {
    try {
        // Eliminar el comentario de la colección "comentarios" en Firestore
        await deleteDoc(doc(db, "comentarios", commentId));
        alert("Comentario eliminado exitosamente.");
        loadComments();
        // Remover el elemento del DOM
        var commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
            commentElement.remove();
        } else {
            console.error("No se encontró el elemento del comentario en el DOM.");
        }
    } catch (error) {
        console.error("Error eliminando comentario: ", error);
        alert("Hubo un error al eliminar el comentario.");
    }
};


const loadComments = async () => {
    try {
        // Obtener la colección de comentarios de Firestore
        const querySnapshot = await getDocs(collection(db, "comentarios"));
        
        // Obtener el contenedor de comentarios en el HTML
        const commentsContainer = document.querySelector('.comments');
        commentsContainer.innerHTML = ''; // Limpiar el contenido actual del contenedor

        // Iterar sobre cada documento de la colección de comentarios
        querySnapshot.forEach((doc) => {
            // Obtener los datos del comentario y su ID
            const commentData = doc.data();
            const commentId = doc.id; // ID del comentario
            const email = commentData.email;
            const comment = commentData.comment;
            const timestamp = commentData.timestamp.toDate(); // Convertir la marca de tiempo a un objeto Date

            // Crear un elemento de comentario para mostrar en el contenedor
            const comentarioDiv = document.createElement('div');
            comentarioDiv.classList.add('comentario');
            comentarioDiv.innerHTML = `
                <div class="card custom-card">
                    <div class="card-body">
                        <p><strong>${email}</strong>: ${comment}</p>
                        <p class="timestamp">${timestamp.toLocaleString('es-CO')}</p>
                    </div>
                    <div class="comment" id="comment-${commentId}">
                       <div class="button-container">
                            <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${commentId}" style="padding: 3px 6px; font-size: 10px;">
                                <img src="/Resources/Img/Gicon/delete_24dp_FILL0_wght400_GRAD0_opsz24.png" alt="Eliminar" class="logo-img">
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Agregar el elemento de comentario al contenedor
            commentsContainer.appendChild(comentarioDiv);

            // Agregar event listener al botón de eliminar
            const deleteButton = comentarioDiv.querySelector('.delete-btn');
            deleteButton.addEventListener('click', async () => {
                // Confirmar eliminación
                const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este comentario?");
                if (confirmDelete) {
                    // Llamar a la función para eliminar el comentario
                    deleteComment(commentId);
                }
            });
        });
    } catch (error) {
        console.error("Error cargando comentarios: ", error);
        alert("Hubo un error al cargar los comentarios.");
    }
};

// Llamar a la función para cargar los comentarios al cargar la página
window.addEventListener('load', loadComments);