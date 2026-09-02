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
        imagen: "productos/toallas.jpeg",
        colores: [
            { nombre: "Cremita", imagen: "productos/toallas.jpeg" },
            { nombre: "Blanca",  imagen: "productos/toalla_blanca.jpeg" }
        ]
    },

    {
        id: 9,
        nombre: "Medias 2 x docena",
        categoria: "Medias",
        precio: 7000,
        etiqueta: "NUEVO",
        imagen: "productos/medias2.jpeg"
    },

    {
        id: 10,
        nombre: "Calzon x docena",
        categoria: "Ropa interior niños",
        precio: 20000,
        etiqueta: "BEST SELLER",
        imagen: "productos/calzon.jpeg"
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

        // Selector de color solo si el producto tiene colores
        const selectorColor = producto.colores
            ? `<div class="selector-colores">
                ${producto.colores.map((c, i) => `
                    <button
                        class="btn-color ${i === 0 ? "activo" : ""}"
                        onclick="cambiarColor(${producto.id}, ${i}, this)"
                    >
                        ${c.nombre}
                    </button>
                `).join("")}
               </div>`
            : "";

        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    id="img-producto-${producto.id}"
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

                ${selectorColor}

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
// CAMBIAR COLOR (TOALLAS)
// ======================================================

function cambiarColor(productoId, colorIndex, boton) {

    const producto =
        productos.find(p => p.id === productoId);

    if (!producto || !producto.colores) return;

    // Actualizar imagen
    const img =
        document.getElementById(
            "img-producto-" + productoId
        );

    if (img) {
        img.src = producto.colores[colorIndex].imagen;
    }

    // Guardar color seleccionado en el objeto del producto
    producto.colorSeleccionado =
        producto.colores[colorIndex].nombre;

    // Resaltar botón activo
    const contenedor = boton.closest(".selector-colores");

    contenedor
        .querySelectorAll(".btn-color")
        .forEach(b => b.classList.remove("activo"));

    boton.classList.add("activo");

}


// ======================================================
// AGREGAR AL CARRITO
// ======================================================

function agregarCarrito(id) {

    const producto =
        productos.find(p => p.id === id);

    if (!producto) return;

    // Si tiene colores y no eligió, usar el primero por defecto
    const colorElegido = producto.colores
        ? (producto.colorSeleccionado || producto.colores[0].nombre)
        : null;

    const clave = colorElegido
        ? id + "-" + colorElegido
        : id;

    const productoExistente =
        carrito.find(item => item.clave === clave);

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            clave:  clave,
            id:     id,
            color:  colorElegido,
            cantidad: 1
        });

    }

    guardarCarrito();

    mostrarCarrito();

    mostrarToast(
        "Prenda agregada al carrito!"
    );

}


// ======================================================
// CAMBIAR CANTIDAD
// ======================================================

function cambiarCantidad(clave, cambio) {

    const item =
        carrito.find(i => i.clave === clave);

    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {

        carrito =
            carrito.filter(i => i.clave !== clave);

    }

    guardarCarrito();

    mostrarCarrito();

}


// ======================================================
// ELIMINAR PRODUCTO
// ======================================================

function eliminarProducto(clave) {

    carrito =
        carrito.filter(i => i.clave !== clave);

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
                productos.find(p => p.id === item.id);

            if (!producto) return total;

            return total +
                producto.precio * item.cantidad;

        },
        0
    );

}


// ======================================================
// CALCULAR CANTIDAD
// ======================================================

function calcularCantidad() {

    return carrito.reduce(
        (total, item) => total + item.cantidad,
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
        formatoPrecio(calcularTotal());


    // ==================================================
    // CARRITO VACÍO
    // ==================================================

    if (carrito.length === 0) {

        if (carritoVacio) {
            carritoVacio.classList.add("visible");
        }

        const footer =
            document.querySelector(".carrito-footer");

        if (footer) {
            footer.style.display = "none";
        }

        return;
    }


    // ==================================================
    // CARRITO CON PRODUCTOS
    // ==================================================

    if (carritoVacio) {
        carritoVacio.classList.remove("visible");
    }

    const footer =
        document.querySelector(".carrito-footer");

    if (footer) {
        footer.style.display = "block";
    }


    carrito.forEach(item => {

        const producto =
            productos.find(p => p.id === item.id);

        if (!producto) return;

        // Imagen según color elegido
        let imgSrc = producto.imagen;

        if (item.color && producto.colores) {

            const colorData =
                producto.colores.find(
                    c => c.nombre === item.color
                );

            if (colorData) imgSrc = colorData.imagen;

        }

        const elemento =
            document.createElement("div");

        elemento.classList.add("item-carrito");

        elemento.innerHTML = `

            <img
                src="${imgSrc}"
                alt="${producto.nombre}"
            >

            <div>

                <h4>
                    ${producto.nombre}
                    ${item.color
                        ? `<small style="font-weight:normal;color:#888"> — ${item.color}</small>`
                        : ""}
                </h4>

                <p>
                    ${formatoPrecio(producto.precio)} c/u
                </p>

                <div class="controles">

                    <button
                        onclick="cambiarCantidad('${item.clave}', -1)"
                    >
                        −
                    </button>

                    <strong>
                        ${item.cantidad}
                    </strong>

                    <button
                        onclick="cambiarCantidad('${item.clave}', 1)"
                    >
                        +
                    </button>

                </div>

                <button
                    class="eliminar"
                    onclick="eliminarProducto('${item.clave}')"
                >
                    Eliminar
                </button>

            </div>

            <strong>
                ${formatoPrecio(producto.precio * item.cantidad)}
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
    document.getElementById("abrirCarrito");

if (abrirCarrito) {

    abrirCarrito.addEventListener("click", () => {

        carritoElement.classList.add("activo");
        overlay.classList.add("activo");

    });

}


// ======================================================
// CERRAR CARRITO
// ======================================================

function cerrarCarrito() {

    if (carritoElement) {
        carritoElement.classList.remove("activo");
    }

    if (overlay) {
        overlay.classList.remove("activo");
    }

}

const cerrarCarritoBtn =
    document.getElementById("cerrarCarrito");

if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
}

if (overlay) {
    overlay.addEventListener("click", cerrarCarrito);
}


// ======================================================
// VER PRODUCTOS
// ======================================================

const verProductos =
    document.getElementById("verProductos");

if (verProductos) {

    verProductos.addEventListener("click", () => {

        cerrarCarrito();

        const seccionProductos =
            document.getElementById("productos");

        if (seccionProductos) {
            seccionProductos.scrollIntoView({ behavior: "smooth" });
        }

    });

}


// ======================================================
// FINALIZAR COMPRA
// ======================================================

const finalizarCompra =
    document.getElementById("finalizarCompra");

if (finalizarCompra) {

    finalizarCompra.addEventListener("click", () => {

        if (carrito.length === 0) {
            mostrarToast("El carrito está vacío");
            return;
        }

        cerrarCarrito();

        if (modalCheckout) {
            modalCheckout.classList.add("activo");
        }

    });

}


// ======================================================
// CERRAR CHECKOUT
// ======================================================

const cerrarCheckout =
    document.getElementById("cerrarCheckout");

if (cerrarCheckout) {

    cerrarCheckout.addEventListener("click", () => {
        modalCheckout.classList.remove("activo");
    });

}


// ======================================================
// ENVIAR PEDIDO A WHATSAPP
// ======================================================

const enviarWhatsApp =
    document.getElementById("enviarWhatsApp");

if (enviarWhatsApp) {
    enviarWhatsApp.addEventListener("click", enviarPedido);
}


function enviarPedido() {

    const metodoPago =
        document.querySelector('input[name="pago"]:checked');

    const nombre =
        document.getElementById("nombre").value.trim();

    const direccion =
        document.getElementById("direccion").value.trim();

    const nota =
        document.getElementById("nota").value.trim();

    if (!nombre) {
        mostrarToast("Ingresá tu nombre.");
        return;
    }

    if (!metodoPago) {
        mostrarToast("Elegí un método de pago.");
        return;
    }

    if (NUMERO_WHATSAPP.includes("X")) {
        mostrarToast("Configurá tu número de WhatsApp.");
        return;
    }

    let mensaje = "\uD83D\uDECD\uFE0F *NUEVO PEDIDO - BY SHEILA*\n\n";

    mensaje += "\uD83D\uDC64 *Cliente:* " + nombre + "\n";

    if (direccion) {
        mensaje += "\uD83D\uDCCD *Dirección:* " + direccion + "\n";
    }

    mensaje += "\n*PRENDAS:*\n";

    carrito.forEach(item => {

        const producto =
            productos.find(p => p.id === item.id);

        if (!producto) return;

        const subtotal = producto.precio * item.cantidad;

        mensaje +=
            "• " +
            item.cantidad + "x " +
            producto.nombre +
            (item.color ? " (" + item.color + ")" : "") +
            " — " +
            formatoPrecio(subtotal) +
            "\n";

    });

    mensaje +=
        "\n\uD83D\uDCB0 *TOTAL: " +
        formatoPrecio(calcularTotal()) + "*\n";

    mensaje +=
        "\uD83D\uDCB3 *MEDIO DE PAGO: " +
        metodoPago.value + "*\n";

    if (nota) {
        mensaje += "\n\uD83D\uDCDD *Nota:* " + nota + "\n";
    }

    mensaje += "\n\u00A1Hola! Quiero confirmar este pedido \uD83D\uDE0A";

    const url =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(mensaje);

    window.open(url, "_blank");

}


// ======================================================
// MENÚ CELULAR
// ======================================================

const menuBtn = document.getElementById("menuBtn");

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        const nav = document.getElementById("nav");

        if (nav) {
            nav.classList.toggle("abierto");
        }

    });

}

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        const nav = document.getElementById("nav");

        if (nav) {
            nav.classList.remove("abierto");
        }

    });

});


// ======================================================
// TOAST
// ======================================================

function mostrarToast(texto) {

    if (!toast) return;

    toast.textContent = texto;

    toast.classList.add("visible");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("visible");
    }, 2500);

}


// ======================================================
// INICIAR PÁGINA
// ======================================================

mostrarProductos();

mostrarCarrito();