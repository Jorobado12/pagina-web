import { login_auth} from "../firebase/firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById("loginbtn-admin");

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById("edtuser-admin").value;
        const password = document.getElementById("edtpassword-admin").value;

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const validation = await login_auth(email, password);

            // Verificar si el correo electrónico es el correo electrónico administrativo
            if (email === "diazjuanau@gmail.com") { // Reemplaza "correo@admin.com" con tu correo electrónico administrativo
                // Usuario es un administrador
                alert('Inicio de sesión como administrador exitoso.');
                // Redirige al panel de administrador o realiza otras acciones administrativas
                window.location.href = "../Templates/administrador.html";
            }
            else{
                alert('datos incorrectos');
            }
        } catch (error) {
            alert(error.message);
            console.log('Error de autenticación:', error);
        }
    });
});
