import { deleteCurrentUser, auth, readAllUsers, signInWithEmailAndPassword }from "../firebase/firebase.js";

// Esperar a que se muestre el modal
$('#exampleModal').on('shown.bs.modal', function () {
    // Agregar event listeners después de que el modal se haya mostrado completamente

    // Obtener referencias a los elementos dentro del modal
    const emailInput = document.getElementById('deletemail');
    const passwordInput = document.getElementById('deletepass');
    const deleteButton = document.getElementById('deletecc');

    // Agregar event listener para el botón de eliminar
    deleteButton.addEventListener('click', async () => {
        try {
            // Obtener el email del usuario autenticado
            const email = auth.currentUser.email;
            const password = passwordInput.value; // Obtener la contraseña ingresada

            // Verificar si el usuario a eliminar es el mismo que el usuario autenticado actualmente
            if (auth.currentUser.email === emailInput.value) {
                // Verificar la contraseña
                await signInWithEmailAndPassword(auth, email, password); // Utilizar la función importada

                // Confirmar si el usuario quiere eliminar su cuenta
                if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                    // Realizar una consulta para encontrar el documento que coincida con el correo electrónico del usuario
                    const querySnapshot = await readAllUsers(); // Supongamos que esta función realiza una consulta para obtener todos los usuarios de Firestore
                    const userDoc = querySnapshot.docs.find(doc => doc.data().userEmail === email);

                    if (userDoc) {
                        // Si se encuentra un documento con el correo electrónico del usuario autenticado, obtener su ID y eliminarlo
                        const userId = userDoc.id;
                        await deleteCurrentUser(userId);
                        
                        // Alertar al usuario y redirigir a la página de inicio
                        alert('Tu cuenta ha sido eliminada exitosamente.');
                        window.location.href = "/Index.html";
                    } else {
                        // Si no se encuentra ningún documento con el correo electrónico del usuario autenticado, mostrar un mensaje de error
                        throw new Error('No se encontró ninguna cuenta asociada a este usuario.');
                    }
                }
            } else {
                throw new Error('El usuario que intenta eliminar no coincide con el usuario autenticado.');
            }
        } catch (error) {
            console.error('Error al eliminar cuenta:', error.message);
            alert('Error al eliminar cuenta: ' + error.message);
        }
    });
});


