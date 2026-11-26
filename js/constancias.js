
/* ==========================================
   CONGRESO UJAT 2027
   BUSCADOR DE CONSTANCIAS
   SIN BASE DE DATOS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formConstancia");
    const nombreInput = document.getElementById("nombreConstancia");
    const folioInput = document.getElementById("folioConstancia");
    const botonBuscar = document.getElementById("btnBuscarConstancia");
    const resultado = document.getElementById("resultadoConstancia");

    if (
        !formulario ||
        !nombreInput ||
        !folioInput ||
        !botonBuscar ||
        !resultado
    ) {
        return;
    }

    /* NORMALIZAR NOMBRES Y FOLIOS */

    function normalizar(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();
    }

    /* LIMPIAR RESULTADOS */

    function limpiarResultado() {
        resultado.hidden = true;
        resultado.className = "constancia-resultado";
        resultado.replaceChildren();
    }

    /* MOSTRAR MENSAJES */

    function mostrarMensaje(tipo, titulo, descripcion) {

        limpiarResultado();

        resultado.hidden = false;
        resultado.classList.add(
            "constancia-resultado--" + tipo
        );

        const encabezado = document.createElement("h3");
        encabezado.textContent = titulo;

        const texto = document.createElement("p");
        texto.textContent = descripcion;

        resultado.append(encabezado, texto);
    }

    /* MOSTRAR CONSTANCIA ENCONTRADA */

    function mostrarConstancia(participante) {

        limpiarResultado();

        resultado.hidden = false;
        resultado.classList.add(
            "constancia-resultado--exito"
        );

        const titulo = document.createElement("h3");
        titulo.textContent = "Constancia encontrada";

        const descripcion = document.createElement("p");
        descripcion.textContent =
            "Tu constancia está disponible para visualizar o descargar.";

        const nombre = document.createElement("p");
        nombre.textContent = participante.nombre;

        const folio = document.createElement("p");
        folio.textContent = "Folio: " + participante.folio;

        const rutaPDF =
            "constancias/" +
            encodeURIComponent(participante.archivo);

        const contenedorBotones = document.createElement("div");

        contenedorBotones.style.display = "flex";
        contenedorBotones.style.gap = "12px";
        contenedorBotones.style.flexWrap = "wrap";
        contenedorBotones.style.marginTop = "20px";

        const botonVisualizar = document.createElement("a");

        botonVisualizar.href = rutaPDF;
        botonVisualizar.target = "_blank";
        botonVisualizar.rel = "noopener noreferrer";
        botonVisualizar.textContent = "Visualizar constancia";

        botonVisualizar.style.backgroundColor = "#003F38";
        botonVisualizar.style.color = "#FFFFFF";
        botonVisualizar.style.padding = "12px 20px";
        botonVisualizar.style.borderRadius = "8px";
        botonVisualizar.style.textDecoration = "none";
        botonVisualizar.style.fontWeight = "600";

        const botonDescargar = document.createElement("a");

        botonDescargar.href = rutaPDF;
        botonDescargar.download = participante.archivo;
        botonDescargar.textContent = "Descargar PDF";

        botonDescargar.style.backgroundColor = "#C5A05C";
        botonDescargar.style.color = "#071C19";
        botonDescargar.style.padding = "12px 20px";
        botonDescargar.style.borderRadius = "8px";
        botonDescargar.style.textDecoration = "none";
        botonDescargar.style.fontWeight = "600";

        contenedorBotones.append(
            botonVisualizar,
            botonDescargar
        );

        resultado.append(
            titulo,
            descripcion,
            nombre,
            folio,
            contenedorBotones
        );
    }

    /* CONSULTAR ARCHIVO DE REGISTRO */

    async function consultarConstancia(nombre, folio) {

        const respuesta = await fetch(
            "constancias/registro.json",
            { cache: "no-store" }
        );

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible cargar el registro."
            );
        }

        const participantes = await respuesta.json();

        if (!Array.isArray(participantes)) {
            throw new Error(
                "El registro tiene un formato incorrecto."
            );
        }

        const participante = participantes.find(item => {

            return (
                normalizar(item.nombre) === normalizar(nombre) &&
                normalizar(item.folio) === normalizar(folio)
            );

        });

        return participante || null;
    }

    /* VALIDAR NOMBRE DE ARCHIVO */

    function archivoValido(archivo) {

        return (
            typeof archivo === "string" &&
            archivo.length > 0 &&
            archivo.toLowerCase().endsWith(".pdf") &&
            !archivo.includes("/") &&
            !archivo.includes("\\")
        );
    }

    /* VERIFICAR QUE EXISTA EL PDF */

    async function verificarPDF(archivo) {

        const ruta =
            "constancias/" + encodeURIComponent(archivo);

        const respuesta = await fetch(ruta, {
            method: "HEAD",
            cache: "no-store"
        });

        return respuesta.ok;
    }

    /* BUSCAR CONSTANCIA */

    formulario.addEventListener("submit", async evento => {

        evento.preventDefault();

        const nombre = nombreInput.value.trim();
        const folio = folioInput.value.trim();

        limpiarResultado();

        if (!nombre || !folio) {

            mostrarMensaje(
                "error",
                "Datos incompletos",
                "Ingresa tu nombre completo y folio."
            );

            return;
        }

        botonBuscar.disabled = true;
        botonBuscar.textContent = "Buscando constancia...";

        try {

            const participante = await consultarConstancia(
                nombre,
                folio
            );

            if (!participante) {

                mostrarMensaje(
                    "error",
                    "Constancia no encontrada",
                    "Verifica que tu nombre y folio sean correctos."
                );

                return;
            }

            if (!archivoValido(participante.archivo)) {

                mostrarMensaje(
                    "aviso",
                    "Archivo no disponible",
                    "La constancia no tiene un archivo PDF válido."
                );

                return;
            }

            const existe = await verificarPDF(
                participante.archivo
            );

            if (!existe) {

                mostrarMensaje(
                    "aviso",
                    "Constancia no disponible",
                    "Tu registro fue encontrado, pero el PDF todavía no está disponible."
                );

                return;
            }

            mostrarConstancia(participante);

        } catch (error) {

            console.error(error);

            mostrarMensaje(
                "aviso",
                "No fue posible realizar la búsqueda",
                "Verifica que el registro de constancias esté disponible e intenta nuevamente."
            );

        } finally {

            botonBuscar.disabled = false;
            botonBuscar.textContent = "Buscar mi constancia";

        }

    });

    nombreInput.addEventListener(
        "input",
        limpiarResultado
    );

    folioInput.addEventListener(
        "input",
        limpiarResultado
    );

});
