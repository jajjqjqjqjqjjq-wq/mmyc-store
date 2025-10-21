const modelViewer = document.getElementById("mv");
const artistSelect = document.getElementById("artistSelect");
const prodButtons = document.querySelectorAll(".prod-btn");

const overlay = document.getElementById("overlay");
const artistImg = document.getElementById("artistImg");
const qrImg = document.getElementById("qrImg");
const pvArtist = document.getElementById("pvArtist");
const pvQR = document.getElementById("pvQR");

// --- CAMBIO DE PRODUCTO ---
prodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modelViewer.src = btn.dataset.model;
  });
});

// --- CAMBIO DE ARTISTA ---
artistSelect.addEventListener("change", () => {
  const artist = artistSelect.value;
  const artistPath = `images/disenos/${artist}.png`;
  const qrPath = `images/qr/${artist}.png`;

  artistImg.src = artistPath;
  qrImg.src = qrPath;
  pvArtist.src = artistPath;
  pvQR.src = qrPath;

  // Restablecer posiciones y tamaños
  artistImg.style.top = "50%";
  artistImg.style.left = "50%";
  artistImg.style.transform = "translate(-50%, -50%)";
  artistImg.style.width = document.getElementById("artistSize").value + "%";
  qrImg.style.width = document.getElementById("qrSize").value + "%";
  qrImg.style.bottom = "5%";
  qrImg.style.right = "5%";
});

// --- HACER ELEMENTOS ARRASTRABLES ---
let active = null, startX = 0, startY = 0, origX = 0, origY = 0;

function onDown(e) {
  e.preventDefault();
  active = e.currentTarget;
  const p = e.touches ? e.touches[0] : e;
  startX = p.clientX;
  startY = p.clientY;
  const rect = active.getBoundingClientRect();
  const parentRect = overlay.getBoundingClientRect();
  origX = rect.left - parentRect.left;
  origY = rect.top - parentRect.top;
  active.classList.add("dragging");
}

function onMove(e) {
  if (!active) return;
  const p = e.touches ? e.touches[0] : e;
  const dx = p.clientX - startX;
  const dy = p.clientY - startY;
  const newX = origX + dx;
  const newY = origY + dy;
  const parentRect = overlay.getBoundingClientRect();
  const elemRect = active.getBoundingClientRect();
  const maxX = parentRect.width - elemRect.width;
  const maxY = parentRect.height - elemRect.height;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  active.style.left = clamp(newX, 0, maxX) + "px";
  active.style.top = clamp(newY, 0, maxY) + "px";
  active.style.transform = "none";
}

function onUp() {
  if (active) {
    active.classList.remove("dragging");
    active = null;
  }
}

// Aplicar arrastre a diseño y QR
[artistImg, qrImg].forEach(el => {
  el.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  el.addEventListener("touchstart", onDown, { passive: false });
  el.addEventListener("touchmove", onMove, { passive: false });
  el.addEventListener("touchend", onUp);
});

// --- SLIDERS PARA CAMBIAR TAMAÑO ---
const artistSize = document.getElementById("artistSize");
const qrSize = document.getElementById("qrSize");

artistSize.addEventListener("input", () => {
  artistImg.style.width = artistSize.value + "%";
});

qrSize.addEventListener("input", () => {
  qrImg.style.width = qrSize.value + "%";
});

// --- LIMITE DE MOVIMIENTO Y ESCALA ---
function clampPosition(element) {
  const parentRect = overlay.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();

  const maxX = parentRect.width - elemRect.width;
  const maxY = parentRect.height - elemRect.height;

  const left = parseFloat(element.style.left) || (parentRect.width / 2 - elemRect.width / 2);
  const top = parseFloat(element.style.top) || (parentRect.height / 2 - elemRect.height / 2);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  element.style.left = clamp(left, 0, maxX) + "px";
  element.style.top = clamp(top, 0, maxY) + "px";
}

// Reaplicar límites después de redimensionar
artistSize.addEventListener("input", () => {
  artistImg.style.width = artistSize.value + "%";
  clampPosition(artistImg);
});

qrSize.addEventListener("input", () => {
  qrImg.style.width = qrSize.value + "%";
  clampPosition(qrImg);
});

window.addEventListener("pointerup", () => {
  clampPosition(artistImg);
  clampPosition(qrImg);
});

// === LOGO ARRASTRABLE Y AJUSTABLE ===
const logoImg = document.getElementById("logoImg");
const logoSize = document.getElementById("logoSize");

if (logoImg) {
  logoImg.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  logoImg.addEventListener("touchstart", onDown, { passive: false });
  logoImg.addEventListener("touchmove", onMove, { passive: false });
  logoImg.addEventListener("touchend", onUp);
}

if (logoSize && logoImg) {
  logoSize.addEventListener("input", () => {
    logoImg.style.width = logoSize.value + "%";
  });
}
