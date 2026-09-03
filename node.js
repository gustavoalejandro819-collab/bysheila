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
        categoria: "Ropa interior de niñas",
        precio: 20000,
        etiqueta: "NUEVO",
        imagen: "productos/calzones.jpeg",
        talles: ["0","1","2","3","4","5","6"]
    },

    {
        id: 2,
        nombre: "Medias super balance x12",
        categoria: "Medias de adultos",
        precio: 6000,
        etiqueta: "NUEVO",
        imagen: "productos/medias.jpeg",
        talles: ["35","36","37","38"]
    },

    {
        id: 3,
        nombre: "Set de toallas x3",
        categoria: "Toallas",
        precio: 20000,
        etiqueta: "TRENDING",
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
        id: 9,
        nombre: "Medias MD x12",
        categoria: "Medias de adultos",
        precio: 7000,
        etiqueta: "NUEVO",
        imagen: "productos/medias2.jpeg",
        talles: ["39","40","41","42","43","44","45"]
    },

    {
        id: 10,
        nombre: "Calzones oumo de ñiños x12",
        categoria: "Ropa interior de niños",
        precio: 20000,
        etiqueta: "NUEVO",
        imagen: "productos/calzon.jpeg",
        talles: ["0","1","2","3","4","5","6"]
    },

    {
        id: 11,
        nombre: "Medias MD x12",
        categoria: "Medias",
        precio: 7000,
        etiqueta: "NUEVO",
        imagen: "productos/mediasMD.jpeg",
        talles: ["35","36","37","38"]
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
// CREAR MODAL DE DETALLE
// ======================================================

function crearModalDetalle() {

    if (document.getElementById("modalDetalle")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "modalDetalle";

    modal.className = "modal-detalle";

    modal.innerHTML = `

        <div class="modal-detalle-contenido">

            <button
                type="button"
                class="cerrar-detalle"
                onclick="cerrarDetalleProducto()"
            >
                ×
            </button>

            <div id="detalleProducto"></div>

        </div>

    `;

    document.body.appendChild(modal);


    // Cerrar tocando fuera del contenido

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                cerrarDetalleProducto();

            }

        }
    );

}


// ======================================================
// MOSTRAR DETALLE DEL PRODUCTO
// ======================================================

function mostrarDetalleProducto(id) {

    const producto =
        productos.find(
            p => p.id === id
        );

    if (!producto) {
        return;
    }


    crearModalDetalle();


    const modal =
        document.getElementById(
            "modalDetalle"
        );

    const detalle =
        document.getElementById(
            "detalleProducto"
        );


    if (!modal || !detalle) {
        return;
    }


    // ==================================================
    // COLOR
    // ==================================================

    const selectorColor =
        producto.colores
            ? `

                <div class="detalle-opcion">

                    <h4>
                        Color
                    </h4>

                    <div class="selector-colores">

                        ${producto.colores.map((c, i) => `

                            <button
                                type="button"
                                class="btn-color ${i === 0 ? "activo" : ""}"
                                onclick="cambiarColorDetalle(
                                    ${producto.id},
                                    ${i},
                                    this
                                )"
                            >
                                ${c.nombre}
                            </button>

                        `).join("")}

                    </div>

                </div>

              `
            : "";


    // ==================================================
    // TALLE
    // ==================================================

    const selectorTalle =
        producto.talles
            ? `

                <div class="detalle-opcion">

                    <h4>
                        Talle
                    </h4>

                    <div class="selector-talles">

                        ${producto.talles.map((t, i) => `

                            <button
                                type="button"
                                class="btn-talle ${i === 0 ? "activo" : ""}"
                                onclick="cambiarTalleDetalle(
                                    ${producto.id},
                                    ${i},
                                    this
                                )"
                            >
                                ${t}
                            </button>

                        `).join("")}

                    </div>

                </div>

              `
            : "";


    // ==================================================
    // HTML DEL DETALLE
    // ==================================================

    detalle.innerHTML = `

        <div class="detalle-grid">

            <div class="detalle-imagen">

                <img
                    id="detalle-img-${producto.id}"
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </div>


            <div class="detalle-info">

                <span class="detalle-etiqueta">
                    ${producto.etiqueta}
                </span>

                <h2>
                    ${producto.nombre}
                </h2>

                <p class="detalle-categoria">
                    ${producto.categoria}
                </p>

                <strong class="detalle-precio">
                    ${formatoPrecio(producto.precio)}
                </strong>

                ${selectorColor}

                ${selectorTalle}

                <button
                    type="button"
                    class="agregar detalle-agregar"
                    onclick="agregarCarritoDesdeDetalle(${producto.id})"
                >
                    + AGREGAR AL CARRITO
                </button>

            </div>

        </div>

    `;


    // ==================================================
    // RESETEAR SELECCIONES
    // ==================================================

    if (producto.colores) {

        producto.colorSeleccionado =
            producto.colores[0].nombre;

    }

    if (producto.talles) {

        producto.talleSeleccionado =
            producto.talles[0];

    }


    // ==================================================
    // MOSTRAR MODAL
    // ==================================================

    modal.classList.add("activo");

    document.body.classList.add("modal-abierto");

}


// ======================================================
// CERRAR DETALLE
// ======================================================

function cerrarDetalleProducto() {

    const modal =
        document.getElementById(
            "modalDetalle"
        );

    if (modal) {

        modal.classList.remove(
            "activo"
        );

    }

    document.body.classList.remove(
        "modal-abierto"
    );

}


// ======================================================
// CAMBIAR COLOR DESDE EL DETALLE
// ======================================================

function cambiarColorDetalle(
    productoId,
    colorIndex,
    boton
) {

    const producto =
        productos.find(
            p => p.id === productoId
        );

    if (!producto || !producto.colores) {
        return;
    }


    producto.colorSeleccionado =
        producto.colores[colorIndex].nombre;


    const imagen =
        document.getElementById(
            "detalle-img-" + productoId
        );


    if (imagen) {

        imagen.src =
            producto.colores[colorIndex].imagen;

    }


    const contenedor =
        boton.closest(
            ".selector-colores"
        );


    if (contenedor) {

        contenedor
            .querySelectorAll(".btn-color")
            .forEach(b => {

                b.classList.remove(
                    "activo"
                );

            });

        boton.classList.add(
            "activo"
        );

    }

}


// ======================================================
// CAMBIAR TALLE DESDE EL DETALLE
// ======================================================

function cambiarTalleDetalle(
    productoId,
    talleIndex,
    boton
) {

    const producto =
        productos.find(
            p => p.id === productoId
        );

    if (!producto || !producto.talles) {
        return;
    }


    producto.talleSeleccionado =
        producto.talles[talleIndex];


    const contenedor =
        boton.closest(
            ".selector-talles"
        );


    if (contenedor) {

        contenedor
            .querySelectorAll(".btn-talle")
            .forEach(b => {

                b.classList.remove(
                    "activo"
                );

            });

        boton.classList.add(
            "activo"
        );

    }

}


// ======================================================
// AGREGAR DESDE DETALLE
// ======================================================

function agregarCarritoDesdeDetalle(id) {

    agregarCarrito(id);

    cerrarDetalleProducto();

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

        tarjeta.classList.add(
            "producto"
        );


        // ==================================================
        // CLICK EN PRODUCTO
        // ==================================================

        tarjeta.addEventListener(
            "click",
            function(event) {

                // Si se tocó un botón,
                // no abrir el detalle.

                if (
                    event.target.closest("button")
                ) {
                    return;
                }

                mostrarDetalleProducto(
                    producto.id
                );

            }
        );


        // ==================================================
        // SELECTOR DE COLOR
        // ==================================================

        const selectorColor =
            producto.colores
                ? `

                    <div class="selector-colores">

                        ${producto.colores.map((c, i) => `

                            <button
                                type="button"
                                class="btn-color ${i === 0 ? "activo" : ""}"
                                onclick="cambiarColor(
                                    ${producto.id},
                                    ${i},
                                    this
                                )"
                            >
                                ${c.nombre}
                            </button>

                        `).join("")}

                    </div>

                  `
                : "";


        // ==================================================
        // SELECTOR DE TALLE
        // ==================================================

        const selectorTalle =
            producto.talles
                ? `

                    <div class="selector-talles">

                        ${producto.talles.map((t, i) => `

                            <button
                                type="button"
                                class="btn-talle ${i === 0 ? "activo" : ""}"
                                onclick="cambiarTalle(
                                    ${producto.id},
                                    ${i},
                                    this
                                )"
                            >
                                ${t}
                            </button>

                        `).join("")}

                    </div>

                  `
                : "";


        // ==================================================
        // HTML DEL PRODUCTO
        // ==================================================

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

                ${selectorTalle}

                <strong class="precio">
                    ${formatoPrecio(producto.precio)}
                </strong>

                <button
                    type="button"
                    class="agregar"
                    onclick="agregarCarrito(${producto.id})"
                >
                    + AGREGAR AL CARRITO
                </button>

            </div>

        `;


        productosGrid.appendChild(
            tarjeta
        );

    });

}


// ======================================================
// CAMBIAR COLOR
// ======================================================

function cambiarColor(
    productoId,
    colorIndex,
    boton
) {

    const producto =
        productos.find(
            p => p.id === productoId
        );

    if (!producto || !producto.colores) {
        return;
    }


    // ==================================================
    // ACTUALIZAR IMAGEN
    // ==================================================

    const img =
        document.getElementById(
            "img-producto-" + productoId
        );


    if (img) {

        img.src =
            producto.colores[colorIndex].imagen;

    }


    // ==================================================
    // GUARDAR COLOR
    // ==================================================

    producto.colorSeleccionado =
        producto.colores[colorIndex].nombre;


    // ==================================================
    // MARCAR BOTÓN
    // ==================================================

    const contenedor =
        boton.closest(
            ".selector-colores"
        );


    if (contenedor) {

        contenedor
            .querySelectorAll(".btn-color")
            .forEach(b => {

                b.classList.remove(
                    "activo"
                );

            });

        boton.classList.add(
            "activo"
        );

    }

}


// ======================================================
// CAMBIAR TALLE
// ======================================================

function cambiarTalle(
    productoId,
    talleIndex,
    boton
) {

    const producto =
        productos.find(
            p => p.id === productoId
        );

    if (!producto || !producto.talles) {
        return;
    }


    producto.talleSeleccionado =
        producto.talles[talleIndex];


    const contenedor =
        boton.closest(
            ".selector-talles"
        );


    if (contenedor) {

        contenedor
            .querySelectorAll(".btn-talle")
            .forEach(b => {

                b.classList.remove(
                    "activo"
                );

            });

        boton.classList.add(
            "activo"
        );

    }

}


// ======================================================
// AGREGAR AL CARRITO
// ======================================================

function agregarCarrito(id) {

    const producto =
        productos.find(
            p => p.id === id
        );

    if (!producto) {
        return;
    }


    // ==================================================
    // COLOR
    // ==================================================

    const colorElegido =
        producto.colores
            ? (
                producto.colorSeleccionado ||
                producto.colores[0].nombre
            )
            : null;


    // ==================================================
    // TALLE
    // ==================================================

    const talleElegido =
        producto.talles
            ? (
                producto.talleSeleccionado ||
                producto.talles[0]
            )
            : null;


    // ==================================================
    // CLAVE ÚNICA
    // ==================================================

    const clave =
        id +
        "-" +
        (colorElegido || "sin-color") +
        "-" +
        (talleElegido || "sin-talle");


    // ==================================================
    // BUSCAR PRODUCTO EXISTENTE
    // ==================================================

    const productoExistente =
        carrito.find(
            item =>
                String(item.clave) ===
                String(clave)
        );


    // ==================================================
    // SI YA EXISTE
    // ==================================================

    if (productoExistente) {

        productoExistente.cantidad += 1;

    }


    // ==================================================
    // SI NO EXISTE
    // ==================================================

    else {

        carrito.push({

            clave: clave,

            id: id,

            color: colorElegido,

            talle: talleElegido,

            cantidad: 1

        });

    }


    // ==================================================
    // ACTUALIZAR
    // ==================================================

    guardarCarrito();

    mostrarCarrito();

    mostrarToast(
        "Prenda agregada al carrito!"
    );

}


// ======================================================
// CAMBIAR CANTIDAD
// ======================================================

function cambiarCantidad(
    clave,
    cambio
) {

    const item =
        carrito.find(
            i =>
                String(i.clave) ===
                String(clave)
        );


    if (!item) {
        return;
    }


    // ==================================================
    // CAMBIAR
    // ==================================================

    item.cantidad += cambio;


    // ==================================================
    // ELIMINAR SI LLEGA A 0
    // ==================================================

    if (item.cantidad <= 0) {

        carrito =
            carrito.filter(
                i =>
                    String(i.clave) !==
                    String(clave)
            );

    }


    // ==================================================
    // ACTUALIZAR
    // ==================================================

    guardarCarrito();

    mostrarCarrito();

}


// ======================================================
// ELIMINAR PRODUCTO
// ======================================================

function eliminarProducto(clave) {

    carrito =
        carrito.filter(
            item =>
                String(item.clave) !==
                String(clave)
        );


    guardarCarrito();

    mostrarCarrito();

    mostrarToast(
        "Producto eliminado del carrito"
    );

}


// ======================================================
// CALCULAR TOTAL
// ======================================================

function calcularTotal() {

    return carrito.reduce(
        (total, item) => {

            const producto =
                productos.find(
                    p => p.id === item.id
                );

            if (!producto) {
                return total;
            }

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


    // ==================================================
    // LIMPIAR
    // ==================================================

    itemsCarrito.innerHTML = "";


    // ==================================================
    // CANTIDAD Y TOTAL
    // ==================================================

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


    // ==================================================
    // MOSTRAR PRODUCTOS
    // ==================================================

    carrito.forEach(item => {

        const producto =
            productos.find(
                p => p.id === item.id
            );


        if (!producto) {
            return;
        }


        // ==================================================
        // IMAGEN
        // ==================================================

        let imgSrc =
            producto.imagen;


        if (
            item.color &&
            producto.colores
        ) {

            const colorData =
                producto.colores.find(
                    c =>
                        c.nombre ===
                        item.color
                );


            if (colorData) {

                imgSrc =
                    colorData.imagen;

            }

        }


        // ==================================================
        // CREAR ELEMENTO
        // ==================================================

        const elemento =
            document.createElement(
                "div"
            );


        elemento.classList.add(
            "item-carrito"
        );


        // ==================================================
        // HTML
        // ==================================================

        elemento.innerHTML = `

            <img
                src="${imgSrc}"
                alt="${producto.nombre}"
            >


            <div>

                <h4>

                    ${producto.nombre}

                    ${
                        item.color
                            ? `
                                <small
                                    style="
                                        font-weight:normal;
                                        color:#888
                                    "
                                >
                                    — ${item.color}
                                </small>
                              `
                            : ""
                    }


                    ${
                        item.talle
                            ? `
                                <small
                                    style="
                                        font-weight:normal;
                                        color:#888
                                    "
                                >
                                    — Talle ${item.talle}
                                </small>
                              `
                            : ""
                    }

                </h4>


                <p>
                    ${formatoPrecio(
                        producto.precio
                    )} c/u
                </p>


                <!-- CONTROLES -->

                <div class="controles">

                    <button
                        type="button"
                        onclick="cambiarCantidad(
                            '${item.clave}',
                            -1
                        )"
                    >
                        −
                    </button>


                    <strong>
                        ${item.cantidad}
                    </strong>


                    <button
                        type="button"
                        onclick="cambiarCantidad(
                            '${item.clave}',
                            1
                        )"
                    >
                        +
                    </button>

                </div>


                <!-- ELIMINAR -->

                <button
                    type="button"
                    class="eliminar"
                    onclick="eliminarProducto(
                        '${item.clave}'
                    )"
                >
                    Eliminar
                </button>

            </div>


            <!-- SUBTOTAL -->

            <strong>

                ${formatoPrecio(
                    producto.precio *
                    item.cantidad
                )}

            </strong>

        `;


        itemsCarrito.appendChild(
            elemento
        );

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

            if (carritoElement) {

                carritoElement.classList.add(
                    "activo"
                );

            }

            if (overlay) {

                overlay.classList.add(
                    "activo"
                );

            }

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
                    "El carrito está vacío"
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

            if (modalCheckout) {

                modalCheckout.classList.remove(
                    "activo"
                );

            }

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


    const nombreElement =
        document.getElementById(
            "nombre"
        );


    const direccionElement =
        document.getElementById(
            "direccion"
        );


    const notaElement =
        document.getElementById(
            "nota"
        );


    const nombre =
        nombreElement
            ? nombreElement.value.trim()
            : "";


    const direccion =
        direccionElement
            ? direccionElement.value.trim()
            : "";


    const nota =
        notaElement
            ? notaElement.value.trim()
            : "";


    // ==================================================
    // VALIDACIONES
    // ==================================================

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


    if (NUMERO_WHATSAPP.includes("X")) {

        mostrarToast(
            "Configurá tu número de WhatsApp."
        );

        return;

    }


    // ==================================================
    // MENSAJE
    // ==================================================

    let mensaje =
        "🛍️ *NUEVO PEDIDO - BY SHEILA*\n\n";


    mensaje +=
        "👤 *Cliente:* " +
        nombre +
        "\n";


    if (direccion) {

        mensaje +=
            "📍 *Dirección:* " +
            direccion +
            "\n";

    }


    mensaje +=
        "\n*PRENDAS:*\n";


    // ==================================================
    // PRODUCTOS
    // ==================================================

    carrito.forEach(item => {

        const producto =
            productos.find(
                p => p.id === item.id
            );


        if (!producto) {
            return;
        }


        const subtotal =
            producto.precio *
            item.cantidad;


        mensaje +=
            "• " +
            item.cantidad +
            "x " +
            producto.nombre;


        if (item.color) {

            mensaje +=
                " (" +
                item.color +
                ")";

        }


        if (item.talle) {

            mensaje +=
                " - Talle " +
                item.talle;

        }


        mensaje +=
            " — " +
            formatoPrecio(subtotal) +
            "\n";

    });


    // ==================================================
    // TOTAL
    // ==================================================

    mensaje +=
        "\n💰 *TOTAL: " +
        formatoPrecio(
            calcularTotal()
        ) +
        "*\n";


    // ==================================================
    // MEDIO DE PAGO
    // ==================================================

    mensaje +=
        "💳 *MEDIO DE PAGO: " +
        metodoPago.value +
        "*\n";


    // ==================================================
    // NOTA
    // ==================================================

    if (nota) {

        mensaje +=
            "\n📝 *Nota:* " +
            nota +
            "\n";

    }


    mensaje +=
        "\n¡Hola! Quiero confirmar este pedido 😊";


    // ==================================================
    // WHATSAPP
    // ==================================================

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

    if (!toast) {
        return;
    }


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
// CERRAR MODAL CON ESC
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            cerrarDetalleProducto();

        }

    }
);


// ======================================================
// INICIAR PÁGINA
// ======================================================

crearModalDetalle();

mostrarProductos();

mostrarCarrito();