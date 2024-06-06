import { registerauth, readAllUsers, addDataUser, updateUser, deleteUser, readUser, checkIfEmailExists, loginout } from '../firebase/firebase.js';

let isEditing = false;
let currentUserId = null;
const sesion = document.getElementById('btnlogout');

// Función para renderizar usuarios en la tabla
async function renderUsers() {
    const tbody = document.getElementById('vdata');
    tbody.innerHTML = ''; // Limpiar la tabla
    try {
        const querySnapshot = await readAllUsers();
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userIdentification}</td>
                <td>${user.userName}</td>
                <td>${user.userBDaten}</td>
                <td>${user.userAddr}</td>
                <td>${user.userPhone}</td>
                <td>${user.userGen}</td>
                <td>${user.userRh}</td>
                <td>${user.userEmail}</td>
                <td>
                    <a href="#" class="btn btn-warning btn-editer" data-id="${doc.id}">
                        <img src="/Resources/Img/Gicon/edit_24dp_FILL0_wght400_GRAD0_opsz24.png" style="width: 20px; height: 20px;">
                    </a>
                    <a href="#" class="btn btn-danger btn-deleter" data-id="${doc.id}" alt>
                        <img src="/Resources/Img/Gicon/delete_24dp_FILL0_wght400_GRAD0_opsz24.png" style="width: 20px; height: 20px;" >
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Añadir event listeners para botones de editar y eliminar
        document.querySelectorAll('.btn-editer').forEach(button => {
            button.addEventListener('click', handleEditUser);
            button.addEventListener('click', (event) => event.preventDefault()); // Evitar recargar la página
        });
        document.querySelectorAll('.btn-deleter').forEach(button => {
            button.addEventListener('click', handleDeleteUser);
            button.addEventListener('click', (event) => event.preventDefault()); // Evitar recargar la página
        });
    } catch (error) {
        console.error('Error al renderizar usuarios:', error);
    }
}

async function addUserSubmitHandler(event) {
    event.preventDefault();
    const Id = document.getElementById('Id').value;
    const correo = document.getElementById('correo').value;
    const nombre = document.getElementById('nombre').value;
    const fecha = document.getElementById('fecha').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const genero = document.getElementById('genero').value;
    const rh = document.getElementById('rh').value;
    const password = 'defaultPassword'; 

    try {
        if (isEditing) {
            // Actualizar usuario en Firestore
            const updatedUser = {
                userIdentification: Id,
                userName: nombre,
                userBDaten: fecha,
                userAddr: direccion,
                userPhone: telefono,
                userGen: genero,
                userRh: rh,
                userEmail: correo,
            };
            await updateUser(currentUserId, updatedUser);
            alert('Usuario actualizado exitosamente');
        } else {
            // Verificar si el correo ya está registrado en Firebase Authentication
            const emailExists = await checkIfEmailExists(correo);
            if (emailExists) {
                alert('El correo electrónico proporcionado ya está en uso. Por favor, utiliza otro correo electrónico.');
            } else {
                // Registrar usuario en Firebase Authentication y Firestore
                await registerauth(correo, password); // Puedes cambiar la contraseña por defecto
                await addDataUser(Id, nombre, fecha, direccion, telefono, genero, rh, correo); 
                alert('Usuario registrado con éxito');
            }
        }

        $('#addUserModal').modal('hide');
        resetForm();
        location.reload(); // Recargar la página después de agregar o actualizar el usuario
    } catch (error) {
        if (error.message.includes('auth/email-already-in-use')) {
            alert('El correo electrónico proporcionado ya está en uso. Por favor, utiliza otro correo electrónico.');
        } else {
            alert('Error al agregar o actualizar usuario: ' + error.message);
        }
        console.error('Error al agregar o actualizar usuario:', error.message);
    }
}


async function handleEditUser(event) {
    event.preventDefault();
    isEditing = true;
    currentUserId = event.currentTarget.getAttribute('data-id');
    try {
        const doc = await readUser(currentUserId);
        if (doc && doc.exists) {
            const user = doc.data();

            // Prellenar el formulario de edición
            document.getElementById('Id').value = user.userIdentification;
            document.getElementById('nombre').value = user.userName;
            document.getElementById('fecha').value = user.userBDaten;
            document.getElementById('direccion').value = user.userAddr;
            document.getElementById('telefono').value = user.userPhone;
            document.getElementById('genero').value = user.userGen;
            document.getElementById('rh').value = user.userRh;
            const correoInput = document.getElementById('correo');
            correoInput.value = user.userEmail;
            correoInput.readOnly = true; // Establecer el campo de correo electrónico como solo lectura

            $('#addUserModal').modal('show');
        } else {
            console.error('El documento del usuario no existe:', doc);
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario para editar:', error);
    }
}

async function handleDeleteUser(event) {
    const userId = event.currentTarget.getAttribute('data-id');
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            await deleteUser(userId); // Eliminar usuario de Firebase Authentication y Firestore
            location.reload(); // Recargar la página después de eliminar el usuario
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    }
}

async function cerrarSesion() {
    try {
        await loginout();
        alert("Sesión cerrada");
        window.location.href = '../index.html';
    } catch (error) {
        alert('Error al cerrar sesión: ' + error.message);
    }
}

// Función para resetear el formulario
function resetForm() {
    const form = document.getElementById('addUserForm');
    form.reset();
    document.getElementById('correo').readOnly = false;
    isEditing = false;
    currentUserId = null;
}

// Función para manejar el cierre de sesión
document.getElementById('btnlogout').addEventListener('click', async () => {
    try {
        await loginout();
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

// Inicializar la lista de usuarios cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    renderUsers();

    // Agregar el event listener para el botón de agregar usuario
    const addUserButton = document.getElementById('addUserButton');
    if (addUserButton) {
        addUserButton.addEventListener('click', () => {
            resetForm();
            $('#addUserModal').modal('show');
        });
    }

    // Habilitar el campo de correo electrónico si el modal se cierra inesperadamente
    $('#addUserModal').on('hidden.bs.modal', () => {
        resetForm();
    });

    // Agregar el event listener para el formulario de agregar usuario
    document.getElementById('addUserForm').addEventListener('submit', addUserSubmitHandler);
});

window.addEventListener('DOMContentLoaded', () => {
    sesion.addEventListener('click', cerrarSesion);
});

document.querySelectorAll('.btn-deleter').forEach(button => {
    button.addEventListener('click', handleDeleteUser);
    button.addEventListener('click', (event) => event.preventDefault()); // Evitar recargar la página
});