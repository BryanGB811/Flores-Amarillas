/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const MESSAGE = "Feliz día de la primavera! Espero que hoy tengas un bonito día y razones para sonreír. 🌻";

const SVG_NS = "http://www.w3.org/2000/svg";

/* Centro de la flor dentro del viewBox 0 0 200 300 */
const CX = 100;
const CY = 90;

const garden      = document.getElementById("sunflower-garden");
const typedText   = document.getElementById("typed-text");
const cursor      = document.querySelector(".writing-cursor");
const msgFlourish = document.querySelector(".message-flourish");


/* =========================================================
   POSICIONES
   left   → centro horizontal de la flor (%)
   bottom → altura de la base (%)
   ========================================================= */

const MAIN_FLOWERS = [
    { left: 43, bottom:  8, scale: 1.12, rotate:   0, delay: 0.0 },
    { left: 26, bottom:  0, scale: 0.94, rotate:  -4, delay: 0.5 },
    { left: 58, bottom: -2, scale: 0.98, rotate:   4, delay: 1.0 },
    { left: 19, bottom: 17, scale: 0.68, rotate: -14, delay: 1.5 },
    { left: 72, bottom: 14, scale: 0.66, rotate:  14, delay: 2.0 },
    { left: 34, bottom: -9, scale: 0.72, rotate:   3, delay: 2.4 }
];

const BACKGROUND_FLOWERS = [
    { left:  7, bottom: 12, scale: 0.62, rotate: -6, delay: 0.9 },
    { left: 88, bottom:  9, scale: 0.64, rotate:  6, delay: 1.4 }
];


/* =========================================================
   UTILIDADES SVG
   ========================================================= */

function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}


/* =========================================================
   NOMBRE ANIMADO LETRA POR LETRA
   ========================================================= */

function animateName() {

    const title = document.getElementById("garden-name");
    if (!title) return;

    const name = title.textContent.trim();
    title.textContent = "";

    [...name].forEach((char, i) => {

        if (char === " ") {
            title.appendChild(document.createTextNode("\u00A0"));
            return;
        }

        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = char;
        span.style.setProperty("--i", i);
        title.appendChild(span);
    });
}


/* =========================================================
   CONSTRUIR UN GIRASOL
   ========================================================= */

function createSunflower(cfg, isBackground) {

    const flower = document.createElement("div");
    flower.className = "sunflower " + (isBackground ? "background-flower" : "main-flower");

    flower.style.left   = `calc(${cfg.left}% - 15%)`;
    flower.style.bottom = `${cfg.bottom}%`;
    flower.style.transform = `scale(${cfg.scale}) rotate(${cfg.rotate}deg)`;
    flower.style.setProperty("--delay", `${cfg.delay}s`);
    flower.style.setProperty("--sway-delay", `${(cfg.delay % 2).toFixed(2)}s`);

    const sway = document.createElement("div");
    sway.className = "sunflower-sway";

    const svg = svgEl("svg", { viewBox: "0 0 200 300", class: "sunflower-svg" });

    /* ---------- 1. Tallo ---------- */
    svg.appendChild(svgEl("path", {
        class: "stem",
        d: "M 100 300 C 95 240, 105 170, 100 96"
    }));

    /* ---------- 2. Hojas ---------- */
    const leftLeaf = svgEl("path", {
        class: "leaf leaf-left",
        d: "M 101 218 C 74 204, 46 210, 30 188 C 60 176, 90 190, 101 218 Z"
    });
    leftLeaf.style.animationDelay = `${cfg.delay + 1.05}s`;
    svg.appendChild(leftLeaf);

    const rightLeaf = svgEl("path", {
        class: "leaf leaf-right",
        d: "M 99 182 C 126 166, 154 170, 170 148 C 140 138, 110 154, 99 182 Z"
    });
    rightLeaf.style.animationDelay = `${cfg.delay + 1.25}s`;
    svg.appendChild(rightLeaf);

    /* ---------- 3. Pétalos ---------- */
    const PETALS = isBackground ? 13 : 16;

    const backPath  = `M ${CX} ${CY} C 87 62, 87 26, ${CX} 6  C 113 26, 113 62, ${CX} ${CY} Z`;
    const frontPath = `M ${CX} ${CY} C 88 66, 88 34, ${CX} 14 C 112 34, 112 66, ${CX} ${CY} Z`;

    const petalStart = cfg.delay + 1.65;

    const backLayer = svgEl("g");
    for (let i = 0; i < PETALS; i++) {
        const angle = (360 / PETALS) * i + (180 / PETALS);
        const g = svgEl("g", { transform: `rotate(${angle} ${CX} ${CY})` });
        const p = svgEl("path", { class: "petal petal-back", d: backPath });
        p.style.animationDelay = `${(petalStart + i * 0.035).toFixed(3)}s`;
        g.appendChild(p);
        backLayer.appendChild(g);
    }
    svg.appendChild(backLayer);

    const frontLayer = svgEl("g");
    for (let i = 0; i < PETALS; i++) {
        const angle = (360 / PETALS) * i;
        const g = svgEl("g", { transform: `rotate(${angle} ${CX} ${CY})` });
        const p = svgEl("path", { class: "petal", d: frontPath });
        p.style.animationDelay = `${(petalStart + 0.25 + i * 0.035).toFixed(3)}s`;
        g.appendChild(p);
        frontLayer.appendChild(g);
    }
    svg.appendChild(frontLayer);

    /* ---------- 4. Centro con semillas ---------- */
    const centerGroup = svgEl("g", { class: "center-group" });
    centerGroup.appendChild(svgEl("circle", { class: "center-ring",   cx: CX, cy: CY, r: 32 }));
    centerGroup.appendChild(svgEl("circle", { class: "flower-center", cx: CX, cy: CY, r: 28 }));

    const seeds = isBackground ? 60 : 110;
    for (let i = 0; i < seeds; i++) {
        const r     = 26 * Math.sqrt(i / seeds);
        const theta = i * 2.39996;
        centerGroup.appendChild(svgEl("circle", {
            class: "seed",
            cx: (CX + r * Math.cos(theta)).toFixed(2),
            cy: (CY + r * Math.sin(theta)).toFixed(2),
            r: 1.5
        }));
    }

    centerGroup.style.animationDelay = `${(petalStart + 0.9).toFixed(2)}s`;
    svg.appendChild(centerGroup);

    sway.appendChild(svg);
    flower.appendChild(sway);
    garden.appendChild(flower);

    setTimeout(() => flower.classList.add("finished"), (cfg.delay + 3.6) * 1000);
}


/* =========================================================
   FLORECITAS DEL SUELO
   ========================================================= */

function createTinyFlowers() {

    const colors = ["#ffffff", "#ffffff", "#fff0a8", "#ffe27a"];

    for (let i = 0; i < 16; i++) {

        const holder = document.createElement("div");
        holder.className = "tiny-flower";
        holder.style.left   = `${3 + Math.random() * 94}%`;
        holder.style.bottom = `${-4 + Math.random() * 14}%`;
        holder.style.animationDelay = `${(3.2 + Math.random() * 2.5).toFixed(2)}s`;

        const color = colors[Math.floor(Math.random() * colors.length)];
        const svg = svgEl("svg", { viewBox: "0 0 40 40" });

        for (let p = 0; p < 5; p++) {
            svg.appendChild(svgEl("ellipse", {
                cx: 20, cy: 11, rx: 4.5, ry: 8,
                fill: color,
                transform: `rotate(${p * 72} 20 20)`
            }));
        }

        svg.appendChild(svgEl("circle", { cx: 20, cy: 20, r: 4, fill: "#f0b429" }));

        holder.appendChild(svg);
        garden.appendChild(holder);
    }
}


/* =========================================================
   MENSAJE ESCRITO A MANO
   ========================================================= */

function typeMessage() {

    let i = 0;

    (function writeChar() {

        if (i >= MESSAGE.length) {
            cursor.classList.add("hidden");
            msgFlourish.classList.add("show");
            return;
        }

        typedText.textContent += MESSAGE[i++];
        setTimeout(writeChar, 70 + Math.random() * 60);
    })();
}


/* =========================================================
   REPRODUCTOR DE MÚSICA
   ========================================================= */

function initPlayer() {

    const player   = document.getElementById("musicPlayer");
    const audio    = document.getElementById("musica");
    if (!player || !audio) return;

    const btnPlay  = document.getElementById("btnPlay");
    const playIcon = document.getElementById("playIcon");
    const btnBack  = document.getElementById("btnBack");
    const btnFwd   = document.getElementById("btnFwd");
    const btnMute  = document.getElementById("btnMute");
    const muteIcon = document.getElementById("muteIcon");
    const seek     = document.getElementById("seek");
    const volume   = document.getElementById("volume");
    const tCurrent = document.getElementById("timeCurrent");
    const tTotal   = document.getElementById("timeTotal");
    const state    = document.getElementById("playerState");

    let seeking = false;

    audio.volume = parseFloat(volume.value);
    paintRange(volume, audio.volume * 100);

    /* ---------- helpers ---------- */

    function paintRange(input, percent) {
        input.style.setProperty("--fill", `${percent}%`);
    }

    function formatTime(seconds) {
        if (!isFinite(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function setPlaying(playing) {
        player.classList.toggle("playing", playing);
        playIcon.textContent = playing ? "❚❚" : "▶";
        btnPlay.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
        state.textContent = playing ? "Sonando ahora" : "En pausa";
    }

    /* ---------- controles ---------- */

    btnPlay.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().catch(() => { state.textContent = "No se pudo reproducir"; });
        } else {
            audio.pause();
        }
    });

    btnBack.addEventListener("click", () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });

    btnFwd.addEventListener("click", () => {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    });

    btnMute.addEventListener("click", () => {
        audio.muted = !audio.muted;
        player.classList.toggle("muted", audio.muted);
        muteIcon.textContent = audio.muted ? "✕" : "♪";
        btnMute.setAttribute("aria-label", audio.muted ? "Activar sonido" : "Silenciar");
    });

    volume.addEventListener("input", () => {
        audio.volume = parseFloat(volume.value);
        audio.muted = audio.volume === 0;
        player.classList.toggle("muted", audio.muted);
        muteIcon.textContent = audio.muted ? "✕" : "♪";
        paintRange(volume, audio.volume * 100);
    });

    seek.addEventListener("input", () => {
        seeking = true;
        paintRange(seek, seek.value);
        if (audio.duration) {
            tCurrent.textContent = formatTime((seek.value / 100) * audio.duration);
        }
    });

    seek.addEventListener("change", () => {
        if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
        seeking = false;
    });

    /* ---------- eventos del audio ---------- */

    audio.addEventListener("loadedmetadata", () => {
        tTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        if (seeking || !audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        seek.value = percent;
        paintRange(seek, percent);
        tCurrent.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("play",  () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("error", () => { state.textContent = "No se encontró la canción"; });

    /* Intento de arranque automático: si el navegador lo bloquea,
       el reproductor se queda esperando el clic. */
    audio.play().catch(() => { state.textContent = "Pulsa play para escuchar"; });
}


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    animateName();
    typeMessage();
    initPlayer();

    setTimeout(() => {
        BACKGROUND_FLOWERS.forEach(cfg => createSunflower(cfg, true));
        MAIN_FLOWERS.forEach(cfg => createSunflower(cfg, false));
        createTinyFlowers();
    }, 600);
});
