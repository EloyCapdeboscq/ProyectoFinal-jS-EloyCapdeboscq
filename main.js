class Producto {
    constructor(id, nombre, precio, img){
        this.id = id;
        this.nombre = nombre; 
        this.precio = precio;
        this.img = img; 
        this.cantidad = 1;
    }
}

const cafeMolido = new Producto(1, "Cafe Molido", 500, "img/cafe-molido-mano.jpg");
const capuccino = new Producto(2, "Capuccino", 400, "img/capuccino.jpg");
const cafeEspecial = new Producto(3, "Cafe Especial", 450, "img/cafe-especial.jpg");
const chococcino = new Producto(4, "Chococcino", 6000, "img/chococcino.jpg");
const capuccinoConGalletitas = new Producto(5, "Capuccino Con Galletitas", 650, "img/cappuccino-with-bisquits.jpg");
const cafeEspecialConTorta = new Producto(6, "Cafe Especial Con Torta", 800, "img/cafe-especial-torta.jpg");
const cafeConMedialunas = new Producto(7, "Cafe Con Medialunas", 650, "img/cafe-con-medialunas.jpg");
const capuccinoConTorta = new Producto(8, "Capuccino Con Torta", 900, "img/cafe-torta.jpg");

const productos = [cafeMolido, capuccino, cafeEspecial, chococcino, capuccinoConGalletitas, cafeEspecialConTorta, cafeConMedialunas, capuccinoConTorta];


let carrito = [];

if(localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = () => {
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
        })
    })
}

mostrarProductos();


const agregarAlCarrito = (id) => {
    const productoEnCarrito = carrito.find(producto => producto.id === id);
    if(productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const producto = productos.find(producto => producto.id === id);
        carrito.push(producto);
    }
    calcularTotal();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto => {
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
                                    <button class = "btn btnCantidad"> + </button>
                                    <button class = "btn btnCantidad"> - </button>
                                </div>
                                <button class = "btnCarrito" id="eliminar${producto.id}" > Eliminar </button>
                            </div>
                        </div>
                        `
        contenedorCarrito.appendChild(card);

        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        })
    })
    calcularTotal();
}

const eliminarDelCarrito = (id) => {
    const producto = carrito.find(producto => producto.id === id);
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
        denyButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire("Compra Realizada", '', 'success')
        } else if (result.isDenied) {
        Swal.fire("Compra Cancelada", '', 'info')
        }
    })
})

finalizarCompra.addEventListener("click", () => {
    eliminarTodoElCarrito();
})