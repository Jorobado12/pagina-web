// crud.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
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
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js';

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
const storage = getStorage(app);

let isEditing = false;
let currentProductId = null;

export const uploadImage = async (file, filePath) => {
    try {
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (e) {
        console.error("Error subiendo imagen: ", e);
        throw e;
    }
};

export const getImageUrl = async (filePath) => {
    try {
        const storageRef = ref(storage, filePath);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (e) {
        console.error("Error obteniendo URL de imagen: ", e);
        throw e;
    }
};

export const deleteImage = async (filePath) => {
    try {
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
    } catch (e) {
        console.error("Error eliminando imagen: ", e);
        throw e;
    }
};

export const addProduct = async (productId, productData, imageFile) => {
    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            alert("El productId ya existe en la base de datos, no se puede agregar.");
            return;
        }

        let imageUrl = "";
        if (imageFile) {
            const filePath = `products/${productData.name}_${Date.now()}`;
            imageUrl = await uploadImage(imageFile, filePath);
            productData.imageUrl = imageUrl;
        }

        // Asegurarse de incluir el productId en los datos del producto
        productData.productId = productId;

        await setDoc(docRef, productData);
        return productId;
    } catch (e) {
        console.error("Error añadiendo producto: ", e);
        throw e;
    }
};

export const getProduct = async (productId) => {
    try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
            return productDoc.data();
        } else {
            throw new Error("No se encontró el producto");
        }
    } catch (e) {
        console.error("Error obteniendo producto: ", e);
        throw e;
    }
};

export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (e) {
        console.error("Error obteniendo todos los productos: ", e);
        throw e;
    }
};

export const updateProduct = async (productId, updatedData, newImageFile) => {
    try {
        const productDocRef = doc(db, "products", productId);
        const productDoc = await getDoc(productDocRef);
        
        if (!productDoc.exists()) {
            throw new Error("El producto no existe");
        }

        const productData = productDoc.data();
        
        let imageUrl = productData.imageUrl;
        if (newImageFile) {
            if (productData.imageUrl) {
                await deleteImage(productData.imageUrl);
            }
            
            const filePath = `products/${updatedData.name}_${Date.now()}`;
            imageUrl = await uploadImage(newImageFile, filePath);
        }

        const newData = {
            ...updatedData,
            imageUrl: imageUrl || productData.imageUrl
        };
        
        await updateDoc(productDocRef, newData);
    } catch (e) {
        console.error("Error actualizando producto: ", e);
        throw e;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const productDocRef = doc(db, "products", productId);
        const productDoc = await getDoc(productDocRef);
        if (productDoc.exists()) {
            const productData = productDoc.data();
            if (productData.imageUrl) {
                const imageUrl = productData.imageUrl;
                const storageBaseUrl = "https://firebasestorage.googleapis.com/v0/b/";
                const pathStartIndex = imageUrl.indexOf(storageBaseUrl) + storageBaseUrl.length;
                const bucketEndIndex = imageUrl.indexOf("/o/");
                const bucket = imageUrl.substring(pathStartIndex, bucketEndIndex);
                const encodedPath = imageUrl.substring(bucketEndIndex + 3, imageUrl.indexOf("?alt=media"));
                const filePath = decodeURIComponent(encodedPath);

                const storageRef = ref(storage, filePath);
                await deleteObject(storageRef);
            }
            await deleteDoc(productDocRef);
        } else {
            throw new Error("No se encontró el producto");
        }
    } catch (e) {
        console.error("Error eliminando producto: ", e);
        throw e;
    }
};

export const initializeProducts = async () => {
    try {
        const products = await getAllProducts();
        const productsList = document.getElementById('dataproducts');
        productsList.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td>${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="width: 50px; height: 50px;">` : ''}</td>
                <td>
                    <button class="btn btn-warning btn-edit-product" data-id="${product.id}">
                        <img src="/Resources/Img/Gicon/edit_24dp_FILL0_wght400_GRAD0_opsz24.png" style="width: 20px; height: 20px;">
                    </button>
                    <button class="btn btn-danger btn-delete-product" data-id="${product.id}">
                        <img src="/Resources/Img/Gicon/delete_24dp_FILL0_wght400_GRAD0_opsz24.png" style="width: 20px; height: 20px;">
                    </button>
                </td>
            `;
            productsList.appendChild(row);
        });

        document.querySelectorAll('.btn-edit-product').forEach(button => {
            button.addEventListener('click', handleEditProduct);
        });
        document.querySelectorAll('.btn-delete-product').forEach(button => {
            button.addEventListener('click', handleDeleteProduct);
        });
    } catch (e) {
        console.error("Error inicializando productos: ", e);
    }
};

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productname').value;
    const price = document.getElementById('productprice').value;
    const description = document.getElementById('productdescription').value;
    const imageFile = document.getElementById('productimg').files[0];
    const productId = document.getElementById('productid').value;
    
    try {
        if (isEditing && currentProductId) {
            await updateProduct(currentProductId, { name, price, description }, imageFile);
            alert("Producto actualizado exitosamente.");
        } else {
            await addProduct(productId, { name, price, description }, imageFile);
            alert("Producto añadido exitosamente.");
        }
        document.getElementById('productname').value = '';
        document.getElementById('productprice').value = '';
        document.getElementById('productimg').value = '';
        document.getElementById('productid').value = '';
        document.getElementById('productdescription').value = '';
        isEditing = false;
        currentProductId = null;
        document.getElementById('productid').disabled = false; // Rehabilitar el campo productId
        $('#addProductModal').modal('hide'); // Cierra el modal aquí
        await initializeProducts();
    } catch (e) {
        console.error("Error añadiendo/editando producto: ", e);
        alert("Hubo un error al añadir/editar el producto.");
    }
});

window.onload = async () => {
    await initializeProducts();
};

async function handleEditProduct(event) {
    event.preventDefault();
    const productId = event.currentTarget.getAttribute('data-id');
    try {
        const doc = await getProduct(productId);
        if (doc) {
            document.getElementById('productname').value = doc.name;
            document.getElementById('productprice').value = doc.price;
            document.getElementById('productdescription').value = doc.description;
            document.getElementById('productid').value = productId;
            document.getElementById('productimg').value = '';
            document.getElementById('productid').disabled = true; // Desactivar el campo productId
            isEditing = true;
            currentProductId = productId;
            $('#addProductModal').modal('show');
        }
    } catch (e) {
        console.error("Error obteniendo datos del producto para editar:", e);
        alert("Hubo un error al obtener los datos del producto para editar.");
    }
}

async function handleDeleteProduct(event) {
    const productId = event.currentTarget.getAttribute('data-id');
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await deleteProduct(productId);
            await initializeProducts();
            alert("Producto eliminado exitosamente.");
        } catch (e) {
            console.error("Error eliminando producto:", e);
            alert("Hubo un error al eliminar el producto.");
        }
    }
}

// Restablecer la variable isEditing cuando el modal se cierra
$('#addProductModal').on('hidden.bs.modal', function () {
    isEditing = false;
    currentProductId = null;
    document.getElementById('addProductForm').reset(); // Restablecer el formulario al estado inicial
    document.getElementById('productid').disabled = false; // Rehabilitar el campo productId
});

