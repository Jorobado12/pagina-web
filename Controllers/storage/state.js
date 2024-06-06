import { initializeProducts, addProduct, updateProduct, getProduct, deleteProduct } from '../storage/crud.js';

let isEditing = false;

document.getElementById('btnOpenAddUserModal').addEventListener('click', () => {
    isEditing = false;
    document.getElementById('addUserForm').reset();
    document.getElementById('Id').value = ''; // Ensure the ID field is reset
});

document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('nombre').value;
    const price = document.getElementById('fecha').value;
    const imageFile = document.getElementById('direccion').files[0];
    const productId = document.getElementById('Id').value;

    try {
        if (isEditing) {
            // Ensure the product ID exists before updating
            if (productId) {
                const productDoc = await getProduct(productId);
                if (productDoc) {
                    await updateProduct(productId, { name, price }, imageFile);
                } else {
                    console.error("El producto no existe, no se puede actualizar");
                    throw new Error("No se encontró el producto para actualizar");
                }
            }
        } else {
            await addProduct({ name, price }, imageFile);
        }
        document.getElementById('addUserForm').reset();
        await initializeProducts();
        $('#addUserModal').modal('hide');
    } catch (e) {
        console.error("Error añadiendo/editando producto: ", e);
    }
});

async function handleEditProduct(event) {
    event.preventDefault();
    const productId = event.currentTarget.getAttribute('data-id');
    try {
        const doc = await getProduct(productId);
        if (doc) {
            document.getElementById('nombre').value = doc.name;
            document.getElementById('fecha').value = doc.price;
            document.getElementById('Id').value = productId;
            document.getElementById('direccion').value = '';
            isEditing = true;
            $('#addUserModal').modal('show');
        }
    } catch (e) {
        console.error("Error obteniendo datos del producto para editar:", e);
    }
}

async function handleDeleteProduct(event) {
    const productId = event.currentTarget.getAttribute('data-id');
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await deleteProduct(productId);
            await initializeProducts();
        } catch (e) {
            console.error("Error eliminando producto:", e);
        }
    }
}

window.onload = async () => {
    await initializeProducts();
};
