import { login_auth } from "../firebase/firebase.js";

async function validar(event) {
    event.preventDefault(); // Esto evita que el formulario se envíe automáticamente
    
    const email = document.getElementById('edtuser').value;
    const password = document.getElementById('edtpassword').value;

    if (email.trim() === '' || password.trim() === '') {
        alert("Debe llenar los campos de usuario y el de contraseña.");
        return;
    }

    try {
        const verification = await login_auth(email, password);
        if (verification != null) {
            alert("Usuario autenticado: " + email);
            window.location.href = "Templates/home.html";
        } else {
            console.log("Sesión " + email + " no validada");
            alert("Error de usuario, verifique usuario y/o contraseña.");
        }
    } catch (error) {
        console.error("Error al autenticar:", error);
        alert("Error de usuario, verifique usuario y/o contraseña.");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', validar);
});
