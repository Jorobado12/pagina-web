import { popup } from "../firebase/firebase.js";

const ggbtn = document.getElementById("google-btn");

async function GGLog() {
    try {
        const verification = await popup();
        if (verification != null) {
            alert("Usuario autenticado: " + verification.email);
            window.location.href = "Templates/home.html";
        } else {
            console.log("Sesión no validada");
            alert("Error de usuario, verifique usuario y/o contraseña.");
        }
    } catch (error) {
        console.error("Error al autenticar:", error);
        if (error.code === "auth/popup-closed-by-user") {
            // El usuario cerró la ventana de inicio de sesión
            alert("Iniciar sesión con Google cancelado.");
        } else {
            alert("Error de autenticación. Verifica la consola para más detalles.");
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ggbtn.addEventListener('click', async (e) => {
        console.log("login google");
        e.preventDefault(); 
        await GGLog();
    });
});
