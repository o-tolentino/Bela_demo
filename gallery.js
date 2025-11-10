// =======================
// 🔹 Obtener parámetros de URL
// =======================
const params = new URLSearchParams(window.location.search);
const lote = params.get("lote") || "N/A";
const cliente = params.get("cliente") || "Sin nombre";

document.getElementById("houseTitle").textContent = `🏠 Casa - Lote ${lote}`;
document.getElementById("clientName").textContent = `👤 Cliente: ${cliente}`;

// =======================
// 🔹 Datos base
// =======================
const packages = [
  { id: "pkg_basic", name: "Paquete Básico", desc: "Incluye acabados estándar y equipamiento esencial." },
  { id: "pkg_premium", name: "Paquete Premium", desc: "Materiales de alta gama, aire acondicionado y domótica básica." },
  { id: "pkg_luxury", name: "Paquete Luxury", desc: "Lujo total con domótica avanzada y jardín decorativo." }
];

const upgrades = [
  { id: "upg_panels", name: "Paneles Solares", desc: "Reduce tu consumo eléctrico hasta un 60%." },
  { id: "upg_kitchen", name: "Cocina Integral", desc: "Diseño moderno con acabados premium." },
  { id: "upg_closet", name: "Closets Personalizados", desc: "Optimiza tus espacios con diseño funcional." },
  { id: "upg_garden", name: "Jardín Frontal", desc: "Dale un toque verde a tu hogar." }
];

// =======================
// 🔹 Renderizado
// =======================
function renderSection(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div>
        <button class="add-btn" data-id="${item.id}" data-type="${type}">➕ Add</button>
        <button class="remove-btn" data-id="${item.id}" data-type="${type}" style="background:#dc3545;">🗑 Remove</button>
      </div>
    `;

    container.appendChild(card);
  });
}

renderSection("packages", packages, "package");
renderSection("upgrades", upgrades, "upgrade");

// =======================
// 🔹 Comunicación con el parent
// =======================
function sendMessage(action, payload = {}) {
  window.parent.postMessage({ source: "gallery", action, payload }, "*");
}

// Evento click para Add / Remove
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn") || e.target.classList.contains("remove-btn")) {
    const type = e.target.dataset.type;
    const id = e.target.dataset.id;
    const action = e.target.classList.contains("add-btn") ? `${type}Added` : `${type}Removed`;
    const itemList = type === "package" ? packages : upgrades;
    const item = itemList.find((i) => i.id === id);

    sendMessage(action, { lote, cliente, ...item });
  }
});

// =======================
// 🔹 Escuchar mensajes del parent
// =======================
window.addEventListener("message", (event) => {
  const { action } = event.data || {};
  if (action === "refresh_gallery") {
    location.reload();
  }
});
