

/* ==========================================
   CONGRESO UJAT 2027
   JAVASCRIPT PRINCIPAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================
       1. MENÚ DE NAVEGACIÓN MÓVIL
    ====================================== */

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav-principal");

    if (menuBtn && nav) {
        const movil = window.matchMedia("(max-width: 768px)");
        function establecerMenu(abierto) {
            nav.classList.toggle("abierto", abierto);
            menuBtn.setAttribute("aria-expanded", String(abierto));
            menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        }
        function cerrarMenu() { establecerMenu(false); }
        cerrarMenu();
        menuBtn.addEventListener("click", () => {
            establecerMenu(movil.matches && !nav.classList.contains("abierto"));
        });
        nav.querySelectorAll("a").forEach(enlace => {
            enlace.addEventListener("click", cerrarMenu);
        });
        document.addEventListener("click", evento => {
            if (!nav.contains(evento.target) && !menuBtn.contains(evento.target)) {
                cerrarMenu();
            }
        });
        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape" && nav.classList.contains("abierto")) {
                cerrarMenu();
                menuBtn.focus();
            }
        });
        if (movil.addEventListener) movil.addEventListener("change", cerrarMenu);
        else movil.addListener(cerrarMenu);
        window.addEventListener("pageshow", cerrarMenu);
    }


    /* ======================================
       2. CUENTA REGRESIVA
    ====================================== */

    /*
       Fecha del Congreso:
       25 y 26 de febrero de 2027.

       La hora de las 09:00 es provisional.
       Debe confirmarse con los organizadores.
    */

    const fechaCongreso = new Date(
        "2027-02-25T09:00:00-06:00"
    );

    const countdown = document.getElementById("countdown");
    const diasElemento = document.getElementById("dias");
    const horasElemento = document.getElementById("horas");
    const minutosElemento = document.getElementById("minutos");
    const segundosElemento = document.getElementById("segundos");
    const mensajeCuenta = document.getElementById("mensajeCuenta");

    if (
        countdown &&
        diasElemento &&
        horasElemento &&
        minutosElemento &&
        segundosElemento
    ) {

        function actualizarCuenta() {

            const diferencia = fechaCongreso.getTime() - Date.now();

            if (diferencia <= 0) {

                diasElemento.textContent = "0";
                horasElemento.textContent = "00";
                minutosElemento.textContent = "00";
                segundosElemento.textContent = "00";

                countdown.style.display = "none";

                if (mensajeCuenta) {
                    mensajeCuenta.textContent =
                        "Ha llegado la fecha del Congreso UJAT 2027.";
                }

                return false;
            }

            const dias = Math.floor(
                diferencia / 86400000
            );

            const horas = Math.floor(
                (diferencia / 3600000) % 24
            );

            const minutos = Math.floor(
                (diferencia / 60000) % 60
            );

            const segundos = Math.floor(
                (diferencia / 1000) % 60
            );

            diasElemento.textContent = String(dias);

            horasElemento.textContent =
                String(horas).padStart(2, "0");

            minutosElemento.textContent =
                String(minutos).padStart(2, "0");

            segundosElemento.textContent =
                String(segundos).padStart(2, "0");

            return true;
        }

        if (actualizarCuenta()) {

            const intervalo = setInterval(() => {

                if (!actualizarCuenta()) {
                    clearInterval(intervalo);
                }

            }, 1000);

        }

    }


    /* ======================================
       3. NAVEGACIÓN INTERNA
    ====================================== */

    document.querySelectorAll('a[href^="#"]').forEach(enlace => {

        enlace.addEventListener("click", evento => {

            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const seccion = document.getElementById(
                destino.substring(1)
            );

            if (!seccion) {
                return;
            }

            evento.preventDefault();

            seccion.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

        });

    });


    /* ======================================
       4. ENCABEZADO AL DESPLAZARSE
    ====================================== */

    const encabezado = document.querySelector(".topbar");

    if (encabezado) {

        function actualizarEncabezado() {

            encabezado.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );

        }

        window.addEventListener(
            "scroll",
            actualizarEncabezado,
            { passive: true }
        );

        actualizarEncabezado();

    }

});
