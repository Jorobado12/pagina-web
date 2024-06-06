import { username, loginout, auth,getDocs, collection, db, deleteDoc } from "../firebase/firebase.js";

const sesion = document.getElementById('btnlogout');
const nombreUsuario = document.getElementById('nombreUsuario');
const deleteAccountBtn = document.querySelector('.delete-account');
const deleter = document.getElementById('btnDeleteAccount');

async function cerrarSesion() {
    try {
        await loginout();
        alert("Sesión cerrada");
        window.location.href = '../index.html';
    } catch (error) {
        alert('Error al cerrar sesión: ' + error.message);
    }
}

async function eliminarCuenta() {
    try {
        const user = auth.currentUser;
        if (user) {
            const confirmacion = confirm("¿Estás seguro que deseas eliminar la cuenta?");
            if (confirmacion) {
                const userEmail = user.email;

                // Eliminar la cuenta de Firebase Authentication
                await user.delete();

                // Obtener el documento con el correo electrónico del usuario actual
                const querySnapshot = await getDocs(collection(db, 'users'));
                let docToDelete;
                querySnapshot.forEach(doc => {
                    const userData = doc.data();
                    if (userData.userEmail === userEmail) {
                        docToDelete = doc.ref;
                    }
                });

                if (docToDelete) {
                    // Eliminar el documento encontrado
                    await deleteDoc(docToDelete);
                    alert("Cuenta eliminada exitosamente");
                } else {
                    alert("La cuenta fue eliminada de authentication correctamente");
                }

                window.location.href = '../index.html';
            } else {
                alert("Eliminación de cuenta cancelada");
            }
        } else {
            alert('Usuario no identificado');
        }
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        alert('Error al eliminar cuenta: ' + error.message);
    }
}



async function mostrarNombreUsuario() {
    try {
        await username();
        const user = auth.currentUser;
        if (user) {
            nombreUsuario.textContent = `Usuario: ${user.displayName || user.email}`;
            const isGoogleProvider = user.providerData.some(provider => provider.providerId === 'google.com');
            if (isGoogleProvider) {
                // Ocultar el botón "Eliminar cuenta"
                document.querySelector('.nav-item.mb-3 button[data-target="#exampleModal"]').style.display = 'none';
            } else {
                // Ocultar el botón "Eliminar cuenta de Google"
                document.getElementById('btnDeleteAccount').style.display = 'none';
            }
        } else {
            nombreUsuario.textContent = 'Usuario no identificado';
        }
    } catch (error) {
        console.error('Error al obtener el nombre de usuario:', error);
        nombreUsuario.textContent = 'Error al obtener el nombre de usuario';
    }
}






window.addEventListener('DOMContentLoaded', () => {
    sesion.addEventListener('click', cerrarSesion);
    deleter.addEventListener('click', eliminarCuenta);
    mostrarNombreUsuario();
});
