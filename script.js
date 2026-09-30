// ======================================================
// CONFIGURACIÓN Y DATOS
// ======================================================

const NUMERO_WHATSAPP = "5491136335317";

const productos = [
    { id: 1, nombre: "medias MD x12 ", categoria: "Medias", precio: 7000, etiqueta: "OFERTA", imagen: "productos/medias2.jpeg", talles: ["35", "36", "37", "38"] },
    { id: 2, nombre: "set toallones x3", categoria: "Toallas", precio: 20000, etiqueta: "MÁS VENDIDO", imagen: "productos/toallas.jpeg", colores: [{ nombre: "Cremita", imagen: "productos/toallas.jpeg" }, { nombre: "Blanca", imagen: "productos/toalla_blanca.jpeg" }] },
    { id: 3, nombre: "Medias super balance x12", categoria: "Medias", precio: 6000, etiqueta: "NUEVO", imagen: "productos/medias.jpeg", talles: ["35","36","37","38"] },
    { id: 4, nombre: "Medias MD x12", categoria: "Medias", precio: 6000, etiqueta: "OFERTA", imagen: "productos/mediasMD.jpeg", talles: ["35","36","37","38","39","40"] },
    { id: 5, nombre: "pijamas", categoria: "pijamas", precio: 20000, etiqueta: "NUEVO", imagen: "productos/pijama1.jpeg", talles: ["85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100"], colores: [{ nombre: "café", imagen: "productos/pijama3.jpeg" }, { nombre: "avellana", imagen: "productos/pijama2.jpeg" }, { nombre: "Vainilla Floral", imagen: "productos/pijama1.jpeg" }] },
    { id: 6, nombre: "pijamas shorts", categoria: "pijamas", precio: 24000, etiqueta: "NUEVO", imagen: "productos/pijamashor0.jpeg", talles: ["1","2","3","4"], colores: [{ nombre: "café", imagen: "productos/pijamahort.jpeg" }, { nombre: "blanco", imagen: "productos/pijamashort1.jpeg" }, { nombre: "cremita", imagen: "productos/pijama2piezas2.jpeg" }] },
    { id: 7, nombre: "pijamas de 2 piezas", categoria: "pijamas", precio: 25000, etiqueta: "NUEVO", imagen: "productos/pijama2piezas.jpeg", talles: ["1","2","3","4"], colores: [{ nombre: "negro", imagen: "productos/pijama2piezas.jpeg" }, { nombre: "azul", imagen: "productos/pijama2piezas1.jpeg" }, { nombre: "cremita", imagen: "productos/pijama2piezas2.jpeg" }] },
    { id: 8, nombre: "pijamas de 4 piezas", categoria: "pijamas", precio: 25000, etiqueta: "NUEVO", imagen: "productos/conjunto.jpeg", talles: ["1","2","3","4"], colores: [{ nombre: "rosa", imagen: "productos/conjunto.jpeg" }, { nombre: "cremita", imagen: "productos/conjunto1.jpeg" }] },
    { id: 9, nombre: "pijamas cullotte", categoria: "pijamas", precio: 22000, etiqueta: "NUEVO", imagen: "productos/barato1.jpeg", talles:["85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100"], colores: [{ nombre: "negro", imagen: "productos/culotte.jpg" }, { nombre: "rojo", imagen: "productos/culote1.jpg" }, { nombre: "gris", imagen: "productos/grisculote.jpg" }, { nombre: "blanco", imagen: "productos/blaconn1.jpg" }, { nombre: "verde y flores", imagen: "productos/florcitas.jpg" }, { nombre: "celeste y flores", imagen: "productos/celeste.jpg" }] },
    { id: 10, nombre: "remera vogue", categoria: "remeras", precio: 5500, etiqueta: "NUEVO", imagen: "productos/vogue.jpeg", colores: [{ nombre: "negro", imagen: "productos/vogue.jpeg" }, { nombre: "lila", imagen: "productos/vogue1.jpeg" }, { nombre: "blaco", imagen: "productos/vogue2.jpeg" }, { nombre: "verde", imagen: "productos/vogue3.jpeg" }, { nombre: "avellana", imagen: "productos/vogue4.jpeg" }] }
];

// ======================================================
// ESTADO GLOBAL Y ELEMENTOS DOM
// ======================================================

let carrito = [];
let categoriaActual = "Todos";
let productoSeleccionado = null;
let talleSeleccionado = null;
let colorSeleccionado = null;
let cantidadSeleccionada = 1;

const $ = (id) => document.getElementById(id);

const productosGrid = $("productosGrid");
const buscador = $("buscador");
const carritoPanel = $("carrito");
const overlay = $("overlay");
const itemsCarrito = $("itemsCarrito");
const carritoVacio = $("carritoVacio");
const cantidadCarrito = $("cantidadCarrito");
const totalCarrito = $("totalCarrito");
const modalProducto = $("modalProducto");
const detalleProducto = $("detalleProducto");
const modalCheckout = $("modalCheckout");
const toast = $("toast");

// ======================================================
// UTILIDADES
// ======================================================

function formatoPrecio(precio) {
    return precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });
}

function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.classList.add("activo");
    setTimeout(() => toast.classList.remove("activo"), 2500);
}

// Animación "push": el botón del carrito rebota al agregar un producto
function animarCarrito() {
    const btn = $("abrirCarrito");
    btn.classList.remove("rebote");
    void btn.offsetWidth; // reinicia la animación
    btn.classList.add("rebote");
    lanzarParticulas(btn);
}

// Partículas que salen disparadas desde el botón del carrito
function lanzarParticulas(btn) {
    const rect = btn.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;
    const colores = ["#e91e63", "#ff80ab", "#ffd6e5", "#ead9ff", "#ffc107"];
    const total = 100;

    for (let i = 0; i < total; i++) {
        const particula = document.createElement("span");
        particula.className = "particula";

        const angulo = (Math.PI * 2 * i) / total + Math.random() * 0.5;
        const distancia = 50 + Math.random() * 50;

        particula.style.left = centroX + "px";
        particula.style.top = centroY + "px";
        particula.style.background = colores[i % colores.length];
        particula.style.setProperty("--dx", Math.cos(angulo) * distancia + "px");
        particula.style.setProperty("--dy", Math.sin(angulo) * distancia + "px");

        document.body.appendChild(particula);
        setTimeout(() => particula.remove(), 800);
    }
}

function generarOpcionesHTML(titulo, items, esColor = false) {
    if (!items || items.length === 0) return "";
    const selectorId = esColor ? "selectorColores" : "selectorTalles";
    
    const botones = items.map((item, index) => {
        const valor = esColor ? item.nombre : item;
        const accion = esColor ? `seleccionarColor(${index})` : `seleccionarTalle('${valor}')`;
        return `<button type="button" class="talle" onclick="${accion}">${valor}</button>`;
    }).join("");

    return `<strong>${titulo}</strong><div class="selector-talles" id="${selectorId}">${botones}</div>`;
}

// ======================================================
// VISTAS Y MONTAJE
// ======================================================

function mostrarProductos() {
    productosGrid.innerHTML = "";
    const texto = buscador.value.toLowerCase().trim();

    const filtrados = productos.filter(p => 
        (categoriaActual === "Todos" || p.categoria === categoriaActual) &&
        (p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto))
    );

    if (filtrados.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <h3>No encontramos productos.</h3>
                <p>Probá con otra búsqueda.</p>
            </div>`;
        return;
    }

    filtrados.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto-card";
        tarjeta.innerHTML = `
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <span class="etiqueta-producto">${producto.etiqueta}</span>
            </div>
            <div class="producto-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h3>${producto.nombre}</h3>
                <p class="precio">${formatoPrecio(producto.precio)}</p>
                <button type="button" class="ver-producto" onclick="abrirDetalle(${producto.id})">VER PRODUCTO</button>
            </div>`;
        productosGrid.appendChild(tarjeta);
    });
}

function abrirDetalle(id) {
    const producto = productos.find(item => item.id === id);
    if (!producto) return;

    productoSeleccionado = producto;
    talleSeleccionado = null;
    colorSeleccionado = null;
    cantidadSeleccionada = 1;

    const opcionesHTML = generarOpcionesHTML("Elegí tu talle:", producto.talles) +
                         generarOpcionesHTML("Elegí tu color:", producto.colores, true);

    detalleProducto.innerHTML = `
        <div class="detalle-grid">
            <div>
                <img src="${producto.imagen}" alt="${producto.nombre}" class="detalle-imagen" id="imagenDetalle">
            </div>
            <div class="detalle-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h2>${producto.nombre}</h2>
                <p class="detalle-precio">${formatoPrecio(producto.precio)}</p>
                <br>
                ${opcionesHTML}
                <strong>Cantidad:</strong>
                <div class="cantidad-selector">
                    <button type="button" onclick="cambiarCantidadDetalle(-1)">−</button>
                    <span id="cantidadDetalle">1</span>
                    <button type="button" onclick="cambiarCantidadDetalle(1)">+</button>
                </div>
                <button type="button" class="boton boton-completo" onclick="agregarProductoDesdeDetalle()">
                    AGREGAR AL CARRITO
                </button>
            </div>
        </div>`;

    modalProducto.classList.add("activo");
}

// ======================================================
// SELECTORES EN DETALLE
// ======================================================

function marcarSeleccion(selector, condicion) {
    document.querySelectorAll(`${selector} .talle`).forEach((btn, i) => {
        btn.classList.toggle("seleccionado", condicion(btn, i));
    });
}

function seleccionarTalle(talle) {
    talleSeleccionado = talle;
    marcarSeleccion("#selectorTalles", btn => btn.textContent.trim() === talle);
}

function seleccionarColor(indice) {
    if (!productoSeleccionado || !productoSeleccionado.colores[indice]) return;

    const color = productoSeleccionado.colores[indice];
    colorSeleccionado = color.nombre;

    const imagen = $("imagenDetalle");
    if (imagen) imagen.src = color.imagen;

    marcarSeleccion("#selectorColores", (_, i) => i === indice);
}

function cambiarCantidadDetalle(cambio) {
    if (!productoSeleccionado) return;

    cantidadSeleccionada += cambio;
    if (cantidadSeleccionada < 1) cantidadSeleccionada = 1;

    const elemento = $("cantidadDetalle");
    if (elemento) elemento.textContent = cantidadSeleccionada;
}

// ======================================================
// LÓGICA DEL CARRITO
// ======================================================

function agregarProductoDesdeDetalle() {
    if (!productoSeleccionado) return;

    if (productoSeleccionado.talles?.length && !talleSeleccionado) {
        return mostrarToast("Primero elegí un talle");
    }

    if (productoSeleccionado.colores?.length && !colorSeleccionado) {
        return mostrarToast("Primero elegí un color");
    }

    const existente = carrito.find(item => 
        item.id === productoSeleccionado.id &&
        item.talle === talleSeleccionado &&
        item.color === colorSeleccionado
    );

    if (existente) {
        existente.cantidad += cantidadSeleccionada;
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
    animarCarrito();
    mostrarToast("Producto agregado al carrito");
}

function actualizarCarrito() {
    itemsCarrito.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((item, indice) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        cantidadTotal += item.cantidad;

        const elemento = document.createElement("div");
        elemento.className = "item-carrito";
        elemento.innerHTML = `
            <h4>${item.nombre}</h4>
            ${item.talle ? `<p class="detalle-talle">Talle: ${item.talle}</p>` : ""}
            ${item.color ? `<p class="detalle-talle">Color: ${item.color}</p>` : ""}
            <strong>${formatoPrecio(item.precio)}</strong>
            <div class="controles">
                <button type="button" onclick="cambiarCantidadCarrito(${indice}, -1)">−</button>
                <span>${item.cantidad}</span>
                <button type="button" onclick="cambiarCantidadCarrito(${indice}, 1)">+</button>
            </div>
            <p class="item-precio">Subtotal: ${formatoPrecio(subtotal)}</p>
            <button type="button" class="eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>`;

        itemsCarrito.appendChild(elemento);
    });

    cantidadCarrito.textContent = cantidadTotal;
    totalCarrito.textContent = formatoPrecio(total);
    carritoVacio.style.display = carrito.length === 0 ? "flex" : "none";
}

function cambiarCantidadCarrito(indice, cambio) {
    if (!carrito[indice]) return;

    carrito[indice].cantidad += cambio;
    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }
    actualizarCarrito();
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    actualizarCarrito();
}

// ======================================================
// MODALES Y PANELES
// ======================================================

function abrirCarrito() {
    carritoPanel.classList.add("activo");
    overlay.classList.add("activo");
}

function cerrarCarrito() {
    carritoPanel.classList.remove("activo");
    overlay.classList.remove("activo");
}

function cerrarModalProducto() { modalProducto.classList.remove("activo"); }
function cerrarCheckout() { modalCheckout.classList.remove("activo"); }

function abrirCheckout() {
    if (carrito.length === 0) return mostrarToast("El carrito está vacío");
    modalCheckout.classList.add("activo");
}

// ======================================================
// ENVIAR POR WHATSAPP
// ======================================================

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) return mostrarToast("El carrito está vacío");

    const nombre = $("nombre").value.trim();
    const direccion = $("direccion").value.trim();
    const nota = $("nota").value.trim();
    const pago = document.querySelector('input[name="pago"]:checked');

    if (!nombre) return mostrarToast("Ingresá tu nombre");
    if (!direccion) return mostrarToast("Ingresá tu dirección");
    if (!pago) return mostrarToast("Elegí un método de pago");

    let mensaje = `Hola, quiero realizar un pedido:%0A%0A`;
    mensaje += `Nombre: ${encodeURIComponent(nombre)}%0A`;
    mensaje += `Dirección: ${encodeURIComponent(direccion)}%0A`;
    mensaje += `Método de pago: ${encodeURIComponent(pago.value)}%0A%0A`;

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        mensaje += `• ${encodeURIComponent(item.nombre)}`;
        if (item.talle) mensaje += ` | Talle: ${encodeURIComponent(item.talle)}`;
        if (item.color) mensaje += ` | Color: ${encodeURIComponent(item.color)}`;
        mensaje += ` | Cantidad: ${item.cantidad} | ${encodeURIComponent(formatoPrecio(subtotal))}%0A`;
    });

    mensaje += `%0ATotal: ${encodeURIComponent(formatoPrecio(total))}`;
    if (nota) mensaje += `%0A%0ANota: ${encodeURIComponent(nota)}`;

    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, "_blank");
}

// ======================================================
// EVENTOS
// ======================================================

$("abrirCarrito").addEventListener("click", abrirCarrito);
$("cerrarCarrito").addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);

$("verProductos").addEventListener("click", () => {
    cerrarCarrito();
    $("productos").scrollIntoView({ behavior: "smooth" });
});

$("finalizarCompra").addEventListener("click", abrirCheckout);
$("cerrarProducto").addEventListener("click", cerrarModalProducto);
$("cerrarCheckout").addEventListener("click", cerrarCheckout);
$("enviarWhatsApp").addEventListener("click", enviarPedidoWhatsApp);
$("buscador").addEventListener("input", mostrarProductos);

$("menuBtn").addEventListener("click", () => {
    $("nav").classList.toggle("activo");
});

// Categorías
document.querySelectorAll(".categoria").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".categoria").forEach(item => item.classList.remove("activa"));
        boton.classList.add("activa");
        categoriaActual = boton.dataset.categoria;
        mostrarProductos();
    });
});

// Cerrar modales click afuera
[modalProducto, modalCheckout].forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("activo");
    });
});

// ======================================================
// INICIALIZACIÓN
// ======================================================

mostrarProductos();
actualizarCarrito();