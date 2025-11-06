const gallery = document.getElementById("gallery");
const addBtn = document.getElementById("addHouse");
const removeBtn = document.getElementById("removeHouse");

let houseCount = 3;

// Carga inicial
const initialHouses = [
  { title: "Casa Moderna", img: "https://picsum.photos/400/250?random=1", location: "Ciudad de México" },
  { title: "Residencia Familiar", img: "https://picsum.photos/400/250?random=2", location: "Guadalajara" },
  { title: "Casa de Campo", img: "https://picsum.photos/400/250?random=3", location: "Puebla" }
];

function renderGallery() {
  gallery.innerHTML = "";
  initialHouses.forEach((house, index) => {
    const card = document.createElement("div");
    card.classList.add("house-card");
    card.innerHTML = `
      <img src="${house.img}" alt="${house.title}">
      <div class="info">
        <h2>${house.title}</h2>
        <p>${house.location}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

// Enviar eventos al parent (la página que hace el embed)
function sendMessage(action, payload = {}) {
  window.parent.postMessage({ source: "gallery", action, payload }, "*");
}

addBtn.addEventListener("click", () => {
  const newHouse = {
    title: `Casa Nueva #${++houseCount}`,
    img: `https://picsum.photos/400/250?random=${Math.floor(Math.random() * 1000)}`,
    location: "Nuevo Ingreso"
  };
  initialHouses.push(newHouse);
  renderGallery();
  sendMessage("house_added", newHouse);
});

removeBtn.addEventListener("click", () => {
  if (initialHouses.length === 0) return;
  const removed = initialHouses.pop();
  renderGallery();
  sendMessage("house_removed", removed);
});

// Escucha de mensajes desde el parent (por ejemplo, para refrescar)
window.addEventListener("message", (event) => {
  if (event.data?.action === "refresh_gallery") {
    renderGallery();
  }
});

renderGallery();
