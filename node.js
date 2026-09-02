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
        nombre: "Calzones x docena",
        categoria: "Ropa interior niños",
        precio: 20000,
        etiqueta: "BEST SELLER",
        imagen: "productos/calzones.jpeg"
    },

    {
        id: 2,
        nombre: "Medias x docena",
        categoria: "Medias",
        precio: 6000,
        etiqueta: "NUEVO",
        imagen: "productos/medias.jpeg"
    },

    {
        id: 3,
        nombre: "Toallas x unidad",
        categoria: "Toallas",
        precio: 20000,
        etiqueta: "TRENDING",
        imagen: "productos/toallas.jpeg"
    },

    {
        id: 4,
        nombre: "Remera Soft",
        categoria: "Remera básica",
        precio: 16000,
        etiqueta: "NUEVO",
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 5,
        nombre: "Biker Suplex",
        categoria: "Calza corta",
        precio: 14000,
        etiqueta: "FAVORITO",
        imagen: "https://images.unsplash.com/photo-1506629905607-d9a4e2d7c3c5?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 6,
        nombre: "Calza Comfort",
        categoria: "Calza larga",
        precio: 22000,
        etiqueta: "NUEVO",
        imagen: "https://images.unsplash.com/photo-1506629905607-d9a4e2d7c3c5?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 7,
        nombre: "Campera Soft",
        categoria: "Campera deportiva",
        precio: 32000,
        etiqueta: "LIMITADO",
        imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 8,
        nombre: "Set Pink",
        categoria: "Conjunto",
        precio: 30000,
        etiqueta: "NUEVO",
        imagen: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85"
    }

];


// ======================================================
// CARRITO
// ======================================================

let carrito = JSON.parse(
    localStorage.getItem("carritoSerena")
) || [];


// ======================================================
// ELEMENTOS HTML
// ======================================================

const productosGrid =
    document.getElementById("productosGrid");

const itemsCarrito =
    document.getElementById("itemsCarrito");

const cantidadCarrito =
    document.getElementById("cantidadCarrito");

const totalCarrito =
    document.getElementById("totalCarrito");

const carritoVacio =
    document.getElementById("carritoVacio");

const carritoElement =
    document.getElementById("carrito");

const overlay =
    document.getElementById("overlay");

const modalCheckout =
    document.getElementById("modalCheckout");

const toast =
    document.getElementById("toast");


// ======================================================
// FORMATEAR PRECIOS
// ======================================================

function formatoPrecio(precio) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS"
        }
    ).format(precio);

}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function mostrarProductos() {

    if (!productosGrid) {

        console.error(
            "No se encontró #productosGrid en el HTML."
        );

        return;
    }

    productosGrid.innerHTML = "";

    productos.forEach(producto => {

        const tarjeta =
            document.createElement("article");

        tarjeta.classList.add("producto");

        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

                <span class="etiqueta">
                    ${producto.etiqueta}
                </span>

            </div>

            <div class="producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.categoria}
                </p>

                <strong class="precio">
                    ${formatoPrecio(producto.precio)}
                </strong>

                <button
                    class="agregar"
                    onclick="agregarCarrito(${producto.id})"
                >
                    + AGREGAR AL CARRITO
                </button>

            </div>

        `;

        productosGrid.appendChild(tarjeta);

    });

}


// ======================================================
// AGREGAR AL CARRITO
// ======================================================

function agregarCarrito(id) {

    const productoExistente =
        carrito.find(
            producto => producto.id === id
        );

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            id: id,
            cantidad: 1
        });

    }

    guardarCarrito();

    mostrarCarrito();

    mostrarToast(
        "¡Prenda agregada al carrito! 🛍️"
    );

}


// ======================================================
// CAMBIAR CANTIDAD
// ======================================================

function cambiarCantidad(id, cambio) {

    const producto =
        carrito.find(
            producto => producto.id === id
        );

    if (!producto) return;

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(
                producto => producto.id !== id
            );

    }

    guardarCarrito();

    mostrarCarrito();

}


// ======================================================
// ELIMINAR PRODUCTO
// ======================================================

function eliminarProducto(id) {

    carrito =
        carrito.filter(
            producto => producto.id !== id
        );

    guardarCarrito();

    mostrarCarrito();

}


// ======================================================
// CALCULAR TOTAL
// ======================================================

function calcularTotal() {

    return carrito.reduce(
        (total, item) => {

            const producto =
                productos.find(
                    producto =>
                        producto.id === item.id
                );

            if (!producto) return total;

            return total +
                producto.precio *
                item.cantidad;

        },

        0
    );

}


// ======================================================
// CALCULAR CANTIDAD
// ======================================================

function calcularCantidad() {

    return carrito.reduce(
        (total, item) =>
            total + item.cantidad,

        0
    );

}


// ======================================================
// MOSTRAR CARRITO
// ======================================================

function mostrarCarrito() {

    if (
        !itemsCarrito ||
        !cantidadCarrito ||
        !totalCarrito
    ) {
        return;
    }

    itemsCarrito.innerHTML = "";

    cantidadCarrito.textContent =
        calcularCantidad();

    totalCarrito.textContent =
        formatoPrecio(
            calcularTotal()
        );


    // ==================================================
    // CARRITO VACÍO
    // ==================================================

    if (carrito.length === 0) {

        if (carritoVacio) {

            carritoVacio.classList.add(
                "visible"
            );

        }

        const footer =
            document.querySelector(
                ".carrito-footer"
            );

        if (footer) {

            footer.style.display =
                "none";

        }

        return;
    }


    // ==================================================
    // CARRITO CON PRODUCTOS
    // ==================================================

    if (carritoVacio) {

        carritoVacio.classList.remove(
            "visible"
        );

    }

    const footer =
        document.querySelector(
            ".carrito-footer"
        );

    if (footer) {

        footer.style.display =
            "block";

    }


    carrito.forEach(item => {

        const producto =
            productos.find(
                producto =>
                    producto.id === item.id
            );

        if (!producto) {
            return;
        }


        const elemento =
            document.createElement("div");

        elemento.classList.add(
            "item-carrito"
        );


        elemento.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div>

                <h4>
                    ${producto.nombre}
                </h4>

                <p>
                    ${formatoPrecio(
                        producto.precio
                    )} c/u
                </p>

                <div class="controles">

                    <button
                        onclick="cambiarCantidad(
                            ${producto.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <strong>
                        ${item.cantidad}
                    </strong>

                    <button
                        onclick="cambiarCantidad(
                            ${producto.id},
                            1
                        )"
                    >
                        +
                    </button>

                </div>

                <button
                    class="eliminar"
                    onclick="eliminarProducto(
                        ${producto.id}
                    )"
                >
                    Eliminar
                </button>

            </div>

            <strong>
                ${formatoPrecio(
                    producto.precio *
                    item.cantidad
                )}
            </strong>

        `;

        itemsCarrito.appendChild(elemento);

    });

}


// ======================================================
// GUARDAR CARRITO
// ======================================================

function guardarCarrito() {

    localStorage.setItem(
        "carritoSerena",
        JSON.stringify(carrito)
    );

}


// ======================================================
// ABRIR CARRITO
// ======================================================

const abrirCarrito =
    document.getElementById(
        "abrirCarrito"
    );

if (abrirCarrito) {

    abrirCarrito.addEventListener(
        "click",
        () => {

            carritoElement.classList.add(
                "activo"
            );

            overlay.classList.add(
                "activo"
            );

        }
    );

}


// ======================================================
// CERRAR CARRITO
// ======================================================

function cerrarCarrito() {

    if (carritoElement) {

        carritoElement.classList.remove(
            "activo"
        );

    }

    if (overlay) {

        overlay.classList.remove(
            "activo"
        );

    }

}


const cerrarCarritoBtn =
    document.getElementById(
        "cerrarCarrito"
    );

if (cerrarCarritoBtn) {

    cerrarCarritoBtn.addEventListener(
        "click",
        cerrarCarrito
    );

}


if (overlay) {

    overlay.addEventListener(
        "click",
        cerrarCarrito
    );

}


// ======================================================
// VER PRODUCTOS
// ======================================================

const verProductos =
    document.getElementById(
        "verProductos"
    );

if (verProductos) {

    verProductos.addEventListener(
        "click",
        () => {

            cerrarCarrito();

            const seccionProductos =
                document.getElementById(
                    "productos"
                );

            if (seccionProductos) {

                seccionProductos.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// ======================================================
// FINALIZAR COMPRA
// ======================================================

const finalizarCompra =
    document.getElementById(
        "finalizarCompra"
    );

if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        () => {

            if (carrito.length === 0) {

                mostrarToast(
                    "El carrito está vacío 😭"
                );

                return;
            }

            cerrarCarrito();

            if (modalCheckout) {

                modalCheckout.classList.add(
                    "activo"
                );

            }

        }
    );

}


// ======================================================
// CERRAR CHECKOUT
// ======================================================

const cerrarCheckout =
    document.getElementById(
        "cerrarCheckout"
    );

if (cerrarCheckout) {

    cerrarCheckout.addEventListener(
        "click",
        () => {

            modalCheckout.classList.remove(
                "activo"
            );

        }
    );

}


// ======================================================
// ENVIAR PEDIDO A WHATSAPP
// ======================================================

const enviarWhatsApp =
    document.getElementById(
        "enviarWhatsApp"
    );

if (enviarWhatsApp) {

    enviarWhatsApp.addEventListener(
        "click",
        enviarPedido
    );

}


function enviarPedido() {

    const metodoPago =
        document.querySelector(
            'input[name="pago"]:checked'
        );


    const nombre =
        document
            .getElementById("nombre")
            .value
            .trim();


    const direccion =
        document
            .getElementById("direccion")
            .value
            .trim();


    const nota =
        document
            .getElementById("nota")
            .value
            .trim();


    if (!nombre) {

        mostrarToast(
            "Ingresá tu nombre."
        );

        return;
    }


    if (!metodoPago) {

        mostrarToast(
            "Elegí un método de pago."
        );

        return;
    }


    if (
        NUMERO_WHATSAPP.includes("X")
    ) {

        mostrarToast(
            "Configurá tu número de WhatsApp."
        );

        return;
    }


    // Armar el mensaje como texto plano y encodear todo junto al final
    // (igual que el JS de la pizzería — así los emojis llegan bien)

    let mensaje = "🛍️ *NUEVO PEDIDO - BY SHEILA*\n\n";

    mensaje += "👤 *Cliente:* " + nombre + "\n";

    if (direccion) {
        mensaje += "📍 *Dirección:* " + direccion + "\n";
    }

    mensaje += "\n*PRENDAS:*\n";

    carrito.forEach(item => {

        const producto =
            productos.find(
                producto =>
                    producto.id === item.id
            );

        if (!producto) return;

        const subtotal =
            producto.precio *
            item.cantidad;

        mensaje +=
            "• " +
            item.cantidad +
            "x " +
            producto.nombre +
            " — " +
            formatoPrecio(subtotal) +
            "\n";

    });

    mensaje +=
        "\n💰 *TOTAL: " +
        formatoPrecio(calcularTotal()) +
        "*\n";

    mensaje +=
        "💳 *MEDIO DE PAGO: " +
        metodoPago.value +
        "*\n";

    if (nota) {
        mensaje += "\n📝 *Nota:* " + nota + "\n";
    }

    mensaje += "\n¡Hola! Quiero confirmar este pedido 😊";

    const url =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(mensaje);


    window.open(
        url,
        "_blank"
    );

}


// ======================================================
// MENÚ CELULAR
// ======================================================

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            const nav =
                document.getElementById(
                    "nav"
                );

            if (nav) {

                nav.classList.toggle(
                    "abierto"
                );

            }

        }
    );

}


document
    .querySelectorAll(".nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                const nav =
                    document.getElementById(
                        "nav"
                    );

                if (nav) {

                    nav.classList.remove(
                        "abierto"
                    );

                }

            }
        );

    });


// ======================================================
// TOAST
// ======================================================

function mostrarToast(texto) {

    if (!toast) return;

    toast.textContent =
        texto;

    toast.classList.add(
        "visible"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "visible"
                );

            },
            2500
        );

}


// ======================================================
// INICIAR PÁGINA
// ======================================================

mostrarProductos();

mostrarCarrito();