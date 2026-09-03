// ======================================================
// CONFIGURACIÓN
// ======================================================

const NUMERO_WHATSAPP = "5491136335317";


// ======================================================
// PRODUCTOS
// ======================================================

const productos = [

    {
        id: 1,
        nombre: "Calzones x12",
        categoria: "Ropa interior niños",
        precio: 20000,
        etiqueta: "NUEVO",
        imagen: "productos/calzones.jpeg",
        talles: ["0","1","2", "3", "4", "5", "6"]
    },

    {
        id: 2,
        nombre: "medias MD x12 ",
        categoria: "Medias",
        precio: 7000,
        etiqueta: "DESTACADO",
        imagen: "productos/medias2.jpeg",
        talles: ["35", "36", "37", "38"]
    },

    {
        id: 3,
        nombre: "set toallones x3",
        categoria: "Toallas",
        precio: 20000,
        etiqueta: "NUEVO",
        imagen: "productos/toallas.jpeg",
        colores: [
            {
                nombre: "Cremita",
                imagen: "productos/toallas.jpeg"
            },
            {
                nombre: "Blanca",
                imagen: "productos/toalla_blanca.jpeg"
            }
        ]
    },

    {
        id: 4,
        nombre: "boxer de niños x12",
        categoria: "Ropa interior niños",
        precio: 20000,
        etiqueta: "NUEVO",
        imagen: "productos/calzon.jpeg",
        talles: ["0","1","2", "3", "4", "5", "6"]
    },

    {
        id: 5,
        nombre: "Medias super balance x12",
        categoria: "Medias",
        precio: 6000,
        etiqueta: "NUEVO",
        imagen: "productos/medias.jpeg",
        talles: ["35","36","37","38"]
    },

    {
        id: 6,
        nombre: "Medias MD x12",
        categoria: "Medias",
        precio: 6000,
        etiqueta: "NUEVO",
        imagen: "productos/mediasMD.jpeg",
        talles: ["35","36","37","38","39","40"]
    }

];


// ======================================================
// VARIABLES
// ======================================================
let carrito = [];

let categoriaActual = "Todos";

let productoSeleccionado = null;

let talleSeleccionado = null;

let colorSeleccionado = null;

let cantidadSeleccionada = 1;


// ======================================================
// ELEMENTOS
// ======================================================

const productosGrid =
    document.getElementById("productosGrid");

const buscador =
    document.getElementById("buscador");

const categorias =
    document.getElementById("categorias");

const carritoPanel =
    document.getElementById("carrito");

const overlay =
    document.getElementById("overlay");

const itemsCarrito =
    document.getElementById("itemsCarrito");

const carritoVacio =
    document.getElementById("carritoVacio");

const cantidadCarrito =
    document.getElementById("cantidadCarrito");

const totalCarrito =
    document.getElementById("totalCarrito");

const modalProducto =
    document.getElementById("modalProducto");

const detalleProducto =
    document.getElementById("detalleProducto");

const modalCheckout =
    document.getElementById("modalCheckout");

const toast =
    document.getElementById("toast");


// ======================================================
// PRECIO
// ======================================================

function formatoPrecio(precio) {

    return precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0
    });

}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function mostrarProductos() {

    productosGrid.innerHTML = "";

    const texto =
        buscador.value.toLowerCase().trim();


    const filtrados = productos.filter(function(producto) {

        const coincideCategoria =
            categoriaActual === "Todos" ||
            producto.categoria === categoriaActual;


        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto);


        return coincideCategoria && coincideBusqueda;

    });


    if (filtrados.length === 0) {

        productosGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px;
            ">
                <h3>No encontramos productos.</h3>
                <p>Probá con otra búsqueda.</p>
            </div>
        `;

        return;
    }


    filtrados.forEach(function(producto) {

        const tarjeta =
            document.createElement("article");


        tarjeta.className = "producto-card";


        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

                <span class="etiqueta-producto">
                    ${producto.etiqueta}
                </span>

            </div>


            <div class="producto-info">

                <p class="producto-categoria">
                    ${producto.categoria}
                </p>

                <h3>
                    ${producto.nombre}
                </h3>

                <p class="precio">
                    ${formatoPrecio(producto.precio)}
                </p>

                <button
                    type="button"
                    class="ver-producto"
                    onclick="abrirDetalle(${producto.id})"
                >
                    VER PRODUCTO
                </button>

            </div>

        `;


        productosGrid.appendChild(tarjeta);

    });

}


// ======================================================
// DETALLE DEL PRODUCTO
// ======================================================

function abrirDetalle(id) {

    const producto =
        productos.find(function(item) {
            return item.id === id;
        });

    if (!producto) {
        return;
    }

    productoSeleccionado = producto;

    talleSeleccionado = null;

    colorSeleccionado = null;

    cantidadSeleccionada = 1;


    // ==================================================
    // TALLES
    // ==================================================

    let tallesHTML = "";

    if (
        producto.talles &&
        producto.talles.length > 0
    ) {

        producto.talles.forEach(function(talle) {

            tallesHTML += `
                <button
                    type="button"
                    class="talle"
                    onclick="seleccionarTalle('${talle}')"
                >
                    ${talle}
                </button>
            `;

        });

    }


    // ==================================================
    // COLORES
    // ==================================================

    let coloresHTML = "";

    if (
        producto.colores &&
        producto.colores.length > 0
    ) {

        producto.colores.forEach(function(color, indice) {

            coloresHTML += `
                <button
                    type="button"
                    class="talle"
                    onclick="seleccionarColor(${indice})"
                >
                    ${color.nombre}
                </button>
            `;

        });

    }


    // ==================================================
    // OPCIONES
    // ==================================================

    let opcionesHTML = "";


    // TALLES

    if (
        producto.talles &&
        producto.talles.length > 0
    ) {

        opcionesHTML += `

            <strong>
                Elegí tu talle:
            </strong>

            <div
                class="selector-talles"
                id="selectorTalles"
            >
                ${tallesHTML}
            </div>

        `;

    }


    // COLORES

    if (
        producto.colores &&
        producto.colores.length > 0
    ) {

        opcionesHTML += `

            <strong>
                Elegí tu color:
            </strong>

            <div
                class="selector-talles"
                id="selectorColores"
            >
                ${coloresHTML}
            </div>

        `;

    }


    // ==================================================
    // DETALLE COMPLETO
    // ==================================================

    detalleProducto.innerHTML = `

        <div class="detalle-grid">

            <div>

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    class="detalle-imagen"
                    id="imagenDetalle"
                >

            </div>


            <div class="detalle-info">

                <p class="producto-categoria">
                    ${producto.categoria}
                </p>

                <h2>
                    ${producto.nombre}
                </h2>

                <p class="detalle-precio">
                    ${formatoPrecio(producto.precio)}
                </p>


                ${
                    producto.stock !== undefined
                    ? `
                        <p>
                            Stock disponible:
                            <strong>
                                ${producto.stock}
                            </strong>
                        </p>
                    `
                    : ""
                }


                <br>


                ${opcionesHTML}


                <strong>
                    Cantidad:
                </strong>


                <div class="cantidad-selector">

                    <button
                        type="button"
                        onclick="cambiarCantidadDetalle(-1)"
                    >
                        −
                    </button>


                    <span id="cantidadDetalle">
                        1
                    </span>


                    <button
                        type="button"
                        onclick="cambiarCantidadDetalle(1)"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="boton boton-completo"
                    onclick="agregarProductoDesdeDetalle()"
                >
                    AGREGAR AL CARRITO
                </button>

            </div>

        </div>

    `;


    modalProducto.classList.add("activo");

}

// ======================================================
// SELECCIONAR TALLE
// ======================================================

function seleccionarTalle(talle) {

    talleSeleccionado = talle;

    const botones =
        document.querySelectorAll("#selectorTalles .talle");

    botones.forEach(function(boton) {
        boton.classList.remove("seleccionado");
    });

    botones.forEach(function(boton) {

        if (boton.textContent.trim() === talle) {
            boton.classList.add("seleccionado");
        }

    });

}


// ======================================================
// CANTIDAD DEL DETALLE
// ======================================================

function cambiarCantidadDetalle(cambio) {

    if (!productoSeleccionado) {
        return;
    }


    cantidadSeleccionada += cambio;


    if (cantidadSeleccionada < 1) {
        cantidadSeleccionada = 1;
    }


    if (cantidadSeleccionada > productoSeleccionado.stock) {

        cantidadSeleccionada =
            productoSeleccionado.stock;

    }


    const elemento =
        document.getElementById("cantidadDetalle");


    if (elemento) {

        elemento.textContent =
            cantidadSeleccionada;

    }

}
function seleccionarColor(indice) {

    if (!productoSeleccionado) {
        return;
    }

    const color =
        productoSeleccionado.colores[indice];

    if (!color) {
        return;
    }

    colorSeleccionado = color.nombre;

    const imagen =
        document.getElementById("imagenDetalle");

    if (imagen) {
        imagen.src = color.imagen;
    }

    const botones =
        document.querySelectorAll("#selectorColores .talle");

    botones.forEach(function(boton) {
        boton.classList.remove("seleccionado");
    });

    if (botones[indice]) {
        botones[indice].classList.add("seleccionado");
    }

}


// ======================================================
// AGREGAR DESDE DETALLE
// ======================================================

function agregarProductoDesdeDetalle() {

    if (!productoSeleccionado) {
        return;
    }


    // VERIFICAR TALLE SOLO SI TIENE TALLES

    if (
        productoSeleccionado.talles &&
        productoSeleccionado.talles.length > 0
    ) {

        if (!talleSeleccionado) {

            mostrarToast(
                "Primero elegí un talle"
            );

            return;
        }

    }


    // VERIFICAR COLOR SOLO SI TIENE COLORES

    if (
        productoSeleccionado.colores &&
        productoSeleccionado.colores.length > 0
    ) {

        if (!colorSeleccionado) {

            mostrarToast(
                "Primero elegí un color"
            );

            return;
        }

    }


    const existente =
        carrito.find(function(item) {

            return (
                item.id === productoSeleccionado.id &&
                item.talle === talleSeleccionado &&
                item.color === colorSeleccionado
            );

        });


    if (existente) {

        existente.cantidad +=
            cantidadSeleccionada;

    } else {

        carrito.push({

            id: productoSeleccionado.id,

            nombre: productoSeleccionado.nombre,

            precio: productoSeleccionado.precio,

            talle: talleSeleccionado,

            color: colorSeleccionado,

            cantidad: cantidadSeleccionada

        });

    }


    actualizarCarrito();

    cerrarModalProducto();

    mostrarToast(
        "Producto agregado al carrito"
    );

}

// ======================================================
// ACTUALIZAR CARRITO
// ======================================================

function actualizarCarrito() {

    itemsCarrito.innerHTML = "";

    let total = 0;

    let cantidadTotal = 0;


    carrito.forEach(function(item, indice) {

        const subtotal =
            item.precio * item.cantidad;


        total += subtotal;

        cantidadTotal += item.cantidad;


        const elemento =
            document.createElement("div");


        elemento.className =
            "item-carrito";


        elemento.innerHTML = `

            <h4>
                ${item.nombre}
            </h4>


            ${
                item.talle
                    ? `
                        <p class="detalle-talle">
                            Talle: ${item.talle}
                        </p>
                    `
                    : ""
            }


            ${
                item.color
                    ? `
                        <p class="detalle-talle">
                            Color: ${item.color}
                        </p>
                    `
                    : ""
            }


            <strong>
                ${formatoPrecio(item.precio)}
            </strong>


            <div class="controles">

                <button
                    type="button"
                    onclick="cambiarCantidadCarrito(${indice}, -1)"
                >
                    −
                </button>


                <span>
                    ${item.cantidad}
                </span>


                <button
                    type="button"
                    onclick="cambiarCantidadCarrito(${indice}, 1)"
                >
                    +
                </button>

            </div>


            <p class="item-precio">
                Subtotal:
                ${formatoPrecio(subtotal)}
            </p>


            <button
                type="button"
                class="eliminar"
                onclick="eliminarProducto(${indice})"
            >
                Eliminar
            </button>

        `;


        itemsCarrito.appendChild(elemento);

    });


    cantidadCarrito.textContent =
        cantidadTotal;


    totalCarrito.textContent =
        formatoPrecio(total);


    if (carrito.length === 0) {

        carritoVacio.style.display =
            "flex";

    } else {

        carritoVacio.style.display =
            "none";

    }

}


// ======================================================
// CAMBIAR CANTIDAD CARRITO
// ======================================================

function cambiarCantidadCarrito(indice, cambio) {

    if (!carrito[indice]) {
        return;
    }


    carrito[indice].cantidad +=
        cambio;


    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }


    actualizarCarrito();

}


// ======================================================
// ELIMINAR
// ======================================================

function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    actualizarCarrito();

}


// ======================================================
// ABRIR CARRITO
// ======================================================

function abrirCarrito() {

    carritoPanel.classList.add("activo");

    overlay.classList.add("activo");

}


// ======================================================
// CERRAR CARRITO
// ======================================================

function cerrarCarrito() {

    carritoPanel.classList.remove("activo");

    overlay.classList.remove("activo");

}


// ======================================================
// CERRAR MODAL PRODUCTO
// ======================================================

function cerrarModalProducto() {

    modalProducto.classList.remove("activo");

}


// ======================================================
// CHECKOUT
// ======================================================

function abrirCheckout() {

    if (carrito.length === 0) {

        mostrarToast(
            "El carrito está vacío"
        );

        return;
    }


    modalCheckout.classList.add("activo");

}


// ======================================================
// CERRAR CHECKOUT
// ======================================================

function cerrarCheckout() {

    modalCheckout.classList.remove("activo");

}


// ======================================================
// WHATSAPP
// ======================================================

function enviarPedidoWhatsApp() {

    if (carrito.length === 0) {

        mostrarToast(
            "El carrito está vacío"
        );

        return;
    }


    const nombre =
        document.getElementById("nombre")
        .value
        .trim();


    const direccion =
        document.getElementById("direccion")
        .value
        .trim();


    const nota =
        document.getElementById("nota")
        .value
        .trim();


    const pago =
        document.querySelector(
            'input[name="pago"]:checked'
        );


    if (!nombre) {

        mostrarToast(
            "Ingresá tu nombre"
        );

        return;
    }


    if (!direccion) {

        mostrarToast(
            "Ingresá tu dirección"
        );

        return;
    }


    if (!pago) {

        mostrarToast(
            "Elegí un método de pago"
        );

        return;
    }


    let mensaje =
        "Hola, quiero realizar un pedido:%0A%0A";


    mensaje +=
        "Nombre: " +
        encodeURIComponent(nombre) +
        "%0A";


    mensaje +=
        "Dirección: " +
        encodeURIComponent(direccion) +
        "%0A";


    mensaje +=
        "Método de pago: " +
        encodeURIComponent(pago.value) +
        "%0A%0A";


    let total = 0;


    carrito.forEach(function(item) {

        const subtotal =
            item.precio * item.cantidad;


        total += subtotal;


  mensaje +=
    "• " +
    encodeURIComponent(item.nombre);

if (item.talle) {

    mensaje +=
        " | Talle: " +
        encodeURIComponent(item.talle);

}

if (item.color) {

    mensaje +=
        " | Color: " +
        encodeURIComponent(item.color);

}

mensaje +=
    " | Cantidad: " +
    item.cantidad +
    " | " +
    encodeURIComponent(
        formatoPrecio(subtotal)
    ) +
    "%0A";
    });


    mensaje +=
        "%0ATotal: " +
        encodeURIComponent(
            formatoPrecio(total)
        );


    if (nota) {

        mensaje +=
            "%0A%0ANota: " +
            encodeURIComponent(nota);

    }


    const url =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        mensaje;


    window.open(
        url,
        "_blank"
    );

}


// ======================================================
// TOAST
// ======================================================

function mostrarToast(mensaje) {

    toast.textContent = mensaje;

    toast.classList.add("activo");


    setTimeout(function() {

        toast.classList.remove("activo");

    }, 2500);

}


// ======================================================
// EVENTOS
// ======================================================

document
    .getElementById("abrirCarrito")
    .addEventListener(
        "click",
        abrirCarrito
    );


document
    .getElementById("cerrarCarrito")
    .addEventListener(
        "click",
        cerrarCarrito
    );


overlay.addEventListener(
    "click",
    cerrarCarrito
);


document
    .getElementById("verProductos")
    .addEventListener(
        "click",
        function() {

            cerrarCarrito();

            document
                .getElementById("productos")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById("finalizarCompra")
    .addEventListener(
        "click",
        abrirCheckout
    );


document
    .getElementById("cerrarProducto")
    .addEventListener(
        "click",
        cerrarModalProducto
    );


document
    .getElementById("cerrarCheckout")
    .addEventListener(
        "click",
        cerrarCheckout
    );


document
    .getElementById("enviarWhatsApp")
    .addEventListener(
        "click",
        enviarPedidoWhatsApp
    );


document
    .getElementById("buscador")
    .addEventListener(
        "input",
        mostrarProductos
    );


document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("nav")
                .classList.toggle("activo");

        }
    );


// ======================================================
// CATEGORÍAS
// ======================================================

document
    .querySelectorAll(".categoria")
    .forEach(function(boton) {

        boton.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".categoria")
                    .forEach(function(item) {

                        item.classList.remove(
                            "activa"
                        );

                    });


                boton.classList.add(
                    "activa"
                );


                categoriaActual =
                    boton.dataset.categoria;


                mostrarProductos();

            }
        );

    });


// ======================================================
// CERRAR MODALES HACIENDO CLICK AFUERA
// ======================================================

modalProducto.addEventListener(
    "click",
    function(event) {

        if (event.target === modalProducto) {

            cerrarModalProducto();

        }

    }
);


modalCheckout.addEventListener(
    "click",
    function(event) {

        if (event.target === modalCheckout) {

            cerrarCheckout();

        }

    }
);


// ======================================================
// INICIAR
// ======================================================

mostrarProductos();

actualizarCarrito();