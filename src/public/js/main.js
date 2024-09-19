
const socket = io();


socket.on("productos", (data) => {

  console.log(data);
  console.log("Array:", Array.isArray(data));

  renderProductos(data);
});

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  console.log(contenedorProductos);
  if (!contenedorProductos) {
    console.error("Contenedor de productos no encontrado.");
    return;
  }
  contenedorProductos.innerHTML = "";
  
productos.forEach( item => {
    const card = document.createElement("div");
    // card.classList.add("card");
    card.innerHTML = `
      
        <p class="card-title">${item.title}<p>
        <p class="card-text">ID: ${item._id}</p>
        <p class="card-text">Description: ${item.description}</p>
        <p class="card-text">Price: $${item.price}</p>
        <p class="card-text">Code: ${item.code}</p>
        <p class="card-text">Stock: ${item.stock}</p>
        <p class="card-text">Category: ${item.category}</p>

        <button class="btn btn-danger btnEliminar">Eliminar</button>
      
    `;
    contenedorProductos.appendChild(card);

  

    const button = card.querySelector(".btnEliminar");

    button.addEventListener("click", () => {
      eliminarProducto(item._id);

      console.log(item._id);

    });

  });

};


const eliminarProducto = (id) => {

  socket.emit("eliminarProducto", id);

  console.log(id);
  
}



document.getElementById('formAgregarProducto').addEventListener('submit', (e) => {

  e.preventDefault();

  
  const producto = {

      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      price: parseFloat(document.getElementById('price').value),
      code: document.getElementById('code').value,
      stock: parseInt(document.getElementById('stock').value),
      category: document.getElementById('category').value

      
  };


  socket.emit("nuevoProducto", producto);

  
  // fetch('/api/products', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(producto)
  // })
  // .then(response => {
  //     if (!response.ok) {
  //         throw new Error("El código debe ser único");
  //     }
  //     return response.json();
  // })
  // .then(data =>  {
  //     console.log("Producto agregado:", data);
  // })
  // .catch(error => {
  //     console.error("Error al agregar producto:", error.message);
  // });


});
