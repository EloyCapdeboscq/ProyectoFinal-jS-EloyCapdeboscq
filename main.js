let productos = [];
let carrito = [];
carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const urlLocal = "productos.json"

fetch(urlLocal)
    .then(response => response.json())
    .then(data => {
        productos = data;
        mostrarProductos(data);
    })
    .catch(error => console.log(error))


const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = (productos) => {
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-sm-12");
        card.innerHTML = `
                        <div class ="card">
                            <img src = "${producto.img}" class = "img" alt = "${producto.nombre}">
                            <div>
                                <h5 class = "nombre"> ${producto.nombre} </h5>
                                <p class = "precio"> $${producto.precio} </p>
                                <button class = "btn" id="boton${producto.id}" > Agregar al Carrito </button>
                            </div>
                        </div>
                        `
        contenedorProductos.appendChild(card);

        const boton = document.getElementById(`boton${producto.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #65b5bb, #41787c"
            }).showToast();
        })
    });
}


const agregarAlCarrito = (id) => {
    const producto = productos.find(producto => producto.id === id);
    const productoEnCarrito = carrito.find(producto => producto.id === id);
    if(productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push(producto);
    }
    calcularTotal();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-sm-12");
        card.innerHTML = `
                        <div class ="cardCarrito">
                            <img src = "${producto.img}" class = "img" alt = "${producto.nombre}">
                            <div>
                                <h5 class = "nombre"> ${producto.nombre} </h5>
                                <p class = "precio"> $${producto.precio} </p>
                                <div class = "div-card">
                                    <p class = "cantidad"> Cantidad: ${producto.cantidad} </p>
                                    <button class = "btn btnCantidad" id = "aumentar${producto.id}"> + </button>
                                    <button class = "btn btnCantidad" id = "disminuir${producto.id}"> - </button>
                                </div>
                                <button class = "btnCarrito" id="eliminar${producto.id}" > Eliminar </button>
                            </div>
                        </div>
                        `
        contenedorCarrito.appendChild(card);


        const aumentar = document.getElementById(`aumentar${producto.id}`);
        aumentar.addEventListener("click", () => {
            aumentarCantidad(producto.id);
        })

        const disminuir = document.getElementById(`disminuir${producto.id}`);
        disminuir.addEventListener("click", () => {
            disminuirCantidad(producto.id);
        })

        const eliminar = document.getElementById(`eliminar${producto.id}`);
        eliminar.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        })
    })
    calcularTotal();
}


const aumentarCantidad = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    producto.cantidad++;
    localStorage.setItem("carrito",JSON.stringify(carrito));
    mostrarCarrito();
}

const disminuirCantidad = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    producto.cantidad--;
    if(producto.cantidad === 0){
        eliminarDelCarrito(id);
    }else{
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }
    mostrarCarrito();
}

const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    mostrarCarrito();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0; 
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = `$${totalCompra}`;
}

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

const eliminarTodoElCarrito = () => {
    carrito = []; 
    mostrarCarrito();

    localStorage.clear();
}

const finalizarCompra = document.getElementById("finalizarCompra")

finalizarCompra.addEventListener("click", () => {
    Swal.fire({
        title: "¿Desea finalizar su compra?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No, seguir comprando",
    }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire("Compra Realizada", '', 'success')
        eliminarTodoElCarrito();
        } else if (result.isDenied) {
        Swal.fire("Puedes seguir sumando productos al carrito", '', 'success')
        }
    })
})