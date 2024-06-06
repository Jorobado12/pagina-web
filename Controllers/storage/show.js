import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCi7GSvp53xSF2wXq2N-rjnPmUh0aNGiYo",
    authDomain: "appweb-5bc8d.firebaseapp.com",
    projectId: "appweb-5bc8d",
    storageBucket: "appweb-5bc8d.appspot.com",
    messagingSenderId: "551827984747",
    appId: "1:551827984747:web:196f48e4aca49cd9003c2e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productCardsContainer = document.getElementById('productCards');

const productcardsinitialize = async () => {
    try {
        const productsQuery = query(collection(db, "products"));
        const querySnapshot = await getDocs(productsQuery);

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            // Logging para depuración
            console.log("Producto recibido:", product);

            // Verificar si el campo 'id' está presente
            const productId = product.id || doc.id; // Usar doc.id si 'product.id' no está disponible

            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="product-card">
                    <div class="card">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-info">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text"><strong>ID: </strong>${productId}</p>
                            <p class="card-text"><strong>Precio: </strong>${product.price}</p>
                        </div>
                        <div class="card-body">
                            <p class="description">${product.description}</p>
                        </div>
                    </div>
                </div>
            `;
            productCardsContainer.appendChild(col);
        });
    } catch (error) {
        console.error("Error inicializando productos:", error);
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    productcardsinitialize();
});
