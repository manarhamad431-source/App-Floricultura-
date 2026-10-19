const welcomeScreen = document.querySelector("#welcome-screen");
const loginScreen = document.querySelector("#login-screen");
const appLayout = document.querySelector("#app-layout");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const authSwitch = document.querySelector("#auth-switch");
const sessionUser = document.querySelector("#session-user");
const sessionStorageKey = "floraAuraDemoUser";
const accountsStorageKey = "floraAuraAccountsV1";
const pageContent = document.querySelector("#page-content");
const plantDialog = document.querySelector("#plant-dialog");
const detailDialog = document.querySelector("#detail-dialog");
const plantForm = document.querySelector("#plant-form");
const toast = document.querySelector("#toast");

let authMode = "login";
let currentAccount = null;
let currentPage = "inicio";
let toastTimeout;

const catalogPlants = [
  { name: "Monstera", scientificName: "Monstera deliciosa", category: "Interior", light: "Luz indireta", watering: "Semanal", icon: "🌿" },
  { name: "Lavanda", scientificName: "Lavandula angustifolia", category: "Exterior", light: "Sol direto", watering: "Semanal", icon: "🪻" },
  { name: "Aloe vera", scientificName: "Aloe barbadensis miller", category: "Suculenta", light: "Sol direto", watering: "Quinzenal", icon: "🌵" },
  { name: "Lírio-da-paz", scientificName: "Spathiphyllum wallisii", category: "Interior", light: "Meia-sombra", watering: "A cada 2-3 dias", icon: "🌱" },
  { name: "Roseira", scientificName: "Rosa spp.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌹" },
  { name: "Orquídea", scientificName: "Phalaenopsis", category: "Ornamental", light: "Luz indireta", watering: "Semanal", icon: "🌸" }
];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  document.querySelector("#auth-eyebrow").textContent = registering ? "COMEÇA A CULTIVAR" : "BEM-VINDO DE VOLTA";
  document.querySelector("#login-title").textContent = registering ? "Cria a tua conta" : "O teu jardim espera por ti";
  document.querySelector("#auth-description").textContent = registering
    ? "Cria o teu espaço FloraAura e organiza os cuidados das tuas plantas."
    : "Inicia sessão para continuares a cuidar das tuas plantas.";
  document.querySelector("#auth-name-field").hidden = !registering;
  document.querySelector("#register-name").required = registering;
  document.querySelector("#auth-confirm-field").hidden = !registering;
  document.querySelector("#register-confirm").required = registering;
  document.querySelector("#login-password").autocomplete = registering ? "new-password" : "current-password";
  document.querySelector("#auth-submit").textContent = registering ? "Criar conta e entrar" : "Iniciar sessão";
  document.querySelector("#auth-switch-copy").textContent = registering ? "Já tens uma conta?" : "Ainda não tens conta?";
  authSwitch.textContent = registering ? "Iniciar sessão" : "Criar conta";
  loginMessage.textContent = "";
}

function showLogin(mode = "login") {
  currentAccount = null;
  appLayout.hidden = true;
  welcomeScreen.hidden = true;
  loginScreen.hidden = false;
  loginForm.reset();
  setAuthMode(mode);
  document.querySelector("#login-email").focus();
}

function showWelcome() {
  currentAccount = null;
  appLayout.hidden = true;
  loginScreen.hidden = true;
  welcomeScreen.hidden = false;
  loginForm.reset();
  setAuthMode("login");
  document.querySelector("#welcome-continue").focus();
}

function showApp() {
  welcomeScreen.hidden = true;
  loginScreen.hidden = true;
  appLayout.hidden = false;
  sessionUser.textContent = currentAccount.name;
  document.querySelector(".avatar").textContent = currentAccount.name.trim().charAt(0).toUpperCase();
  renderPage(currentPage);
}

function readAccounts() {
  const stored = localStorage.getItem(accountsStorageKey);
  if (!stored) return [];
  const accounts = JSON.parse(stored);
  if (!Array.isArray(accounts)) throw new Error("Os dados das contas estão num formato inválido.");
  return accounts;
}

function saveAccounts(accounts) {
  localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
}

function plantStorageKey() {
  return `floraAuraPlants:${currentAccount.email}`;
}

function readPlants() {
  const stored = localStorage.getItem(plantStorageKey());
  if (!stored) return [];
  const plants = JSON.parse(stored);
  if (!Array.isArray(plants)) throw new Error("Os dados das plantas estão num formato inválido.");
  return plants;
}

function savePlants(plants) {
  localStorage.setItem(plantStorageKey(), JSON.stringify(plants));
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error("Este navegador não permite proteger a palavra-passe. Abre a aplicação através de localhost ou HTTPS.");
  }
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: Uint8Array.from(salt.match(/.{2}/g), (byte) => parseInt(byte, 16)),
    iterations: 120000,
    hash: "SHA-256"
  }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(salt, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  loginMessage.textContent = "";
  if (!loginForm.reportValidity()) return;

  const formData = new FormData(loginForm);
  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));
  const submitButton = document.querySelector("#auth-submit");
  submitButton.disabled = true;

  try {
    const accounts = readAccounts();
    if (authMode === "register") {
      const name = String(formData.get("name")).trim();
      const confirmation = String(formData.get("confirmPassword"));
      if (name.length < 2) {
        loginMessage.textContent = "Escreve um nome com pelo menos 2 caracteres.";
        return;
      }
      if (password !== confirmation) {
        loginMessage.textContent = "As palavras-passe não coincidem.";
        return;
      }
      if (accounts.some((account) => account.email === email)) {
        loginMessage.textContent = "Já existe uma conta com este email. Inicia sessão.";
        return;
      }

      const salt = randomSalt();
      const passwordHash = await hashPassword(password, salt);
      currentAccount = { name, email, salt, passwordHash };
      saveAccounts([...accounts, currentAccount]);
    } else {
      const account = accounts.find((candidate) => candidate.email === email);
      if (!account) {
        loginMessage.textContent = "Não encontrámos uma conta com esse email. Cria uma conta primeiro.";
        return;
      }
      const passwordHash = await hashPassword(password, account.salt);
      if (passwordHash !== account.passwordHash) {
        loginMessage.textContent = "Palavra-passe incorreta.";
        return;
      }
      currentAccount = account;
    }

    sessionStorage.setItem(sessionStorageKey, currentAccount.email);
    currentPage = "inicio";
    showApp();
  } catch (error) {
    loginMessage.textContent = error.message || "Não foi possível guardar os dados neste navegador.";
  } finally {
    submitButton.disabled = false;
  }
}

function formatDate(date) {
  if (!date) return "Sem data definida";
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? "Data inválida" : parsed.toLocaleDateString("pt-PT");
}

function daysUntil(date) {
  if (!date) return Number.POSITIVE_INFINITY;
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function healthClass(health) {
  if (health === "Doente") return "danger";
  if (health === "Atenção") return "warning";
  return "";
}

function plantCard(plant, index) {
  const icon = plant.photo
    ? `<img class="plant-image" src="${escapeHTML(plant.photo)}" alt="${escapeHTML(plant.name)}">`
    : `<div class="plant-image plant-placeholder" aria-hidden="true">${escapeHTML(plant.icon || "🌿")}</div>`;
  return `
    <article class="plant-card">
      ${icon}
      <div class="plant-card-body">
        <span class="category-tag">${escapeHTML(plant.category)}</span>
        <h3>${escapeHTML(plant.name)}</h3>
        <p class="scientific-name">${escapeHTML(plant.scientificName || "Nome científico não indicado")}</p>
        <span class="health-tag ${healthClass(plant.health)}">${escapeHTML(plant.health || "Saudável")}</span>
        <div class="plant-meta">
          <span>☀ ${escapeHTML(plant.light || "Exposição não indicada")}</span>
          <span>◷ Próxima rega: ${escapeHTML(formatDate(plant.nextWatering))}</span>
        </div>
        <div class="card-actions">
          <button class="button button-light" type="button" data-action="details" data-index="${index}">Ver detalhes</button>
          <button class="button button-light" type="button" data-action="edit" data-index="${index}">Editar</button>
          <button class="button button-danger" type="button" data-action="delete" data-index="${index}">Apagar</button>
        </div>
      </div>
    </article>`;
}

function renderDashboard(plants) {
  const upcoming = plants
    .filter((plant) => plant.nextWatering)
    .sort((a, b) => a.nextWatering.localeCompare(b.nextWatering))
    .slice(0, 4);
  const today = new Date().toISOString().slice(0, 10);
  const due = plants.filter((plant) => plant.nextWatering && plant.nextWatering <= today).length;
  const attention = plants.filter((plant) => plant.health === "Atenção" || plant.health === "Doente").length;

  return `
    <section class="welcome-banner">
      <span class="eyebrow">O TEU ESPAÇO VERDE</span>
      <h2>Olá, ${escapeHTML(currentAccount.name.split(" ")[0])}!</h2>
      <p>Um jardim saudável começa com pequenos cuidados. Consulta as tuas plantas e mantém tudo a florescer.</p>
      <button class="button" type="button" data-action="add">＋ Adicionar uma planta</button>
    </section>
    <div class="stats-grid">
      <article class="stat-card"><span class="stat-icon">🌿</span><strong class="stat-number">${plants.length}</strong><span class="stat-label">Plantas no teu jardim</span></article>
      <article class="stat-card"><span class="stat-icon">◷</span><strong class="stat-number">${due}</strong><span class="stat-label">Rega(s) por fazer</span></article>
      <article class="stat-card"><span class="stat-icon">♡</span><strong class="stat-number">${attention}</strong><span class="stat-label">A precisar de atenção</span></article>
      <article class="stat-card"><span class="stat-icon">✿</span><strong class="stat-number">${plants.filter((plant) => plant.health === "Saudável").length}</strong><span class="stat-label">Plantas saudáveis</span></article>
    </div>
    <div class="section-heading"><div><h2>Próximos cuidados</h2><p>As datas de rega das tuas plantas.</p></div><button class="text-button" type="button" data-go-page="cuidados">Ver todos</button></div>
    ${upcoming.length ? `<div class="care-list">${upcoming.map((plant) => `
      <article class="care-item"><div><strong>${escapeHTML(plant.name)}</strong><p>Rega · ${escapeHTML(plant.watering || "Frequência não indicada")}</p></div><time class="care-date">${escapeHTML(formatDate(plant.nextWatering))}</time></article>
    `).join("")}</div>` : `<div class="empty-state"><span>💧</span><h3>Ainda não há regas agendadas</h3><p>Adiciona plantas e define a próxima rega para organizares os cuidados.</p></div>`}`;
}

function renderPlantList(plants, heading, description) {
  return `
    <div class="section-heading"><div><h2>${heading}</h2><p>${description}</p></div></div>
    <div class="toolbar">
      <input class="search-input" id="plant-search" type="search" placeholder="Pesquisar por nome..." aria-label="Pesquisar plantas">
      <select class="filter-select" id="category-filter" aria-label="Filtrar por categoria">
        <option value="">Todas as categorias</option>
        <option>Interior</option><option>Exterior</option><option>Ornamental</option><option>Jardim</option><option>Suculenta</option>
      </select>
    </div>
    <div class="plant-grid" id="plant-grid">${plants.length ? plants.map(plantCard).join("") : `<div class="empty-state"><span>🌱</span><h3>O teu jardim ainda está vazio</h3><p>Adiciona a tua primeira planta para começares a organizar os cuidados.</p><button class="button button-primary" type="button" data-action="add">＋ Adicionar planta</button></div>`}</div>`;
}

function renderCatalog() {
  const plants = readPlants();
  return `
    <div class="section-heading"><div><h2>Catálogo de plantas</h2><p>Explora algumas plantas e adiciona-as ao teu jardim.</p></div></div>
    <div class="plant-grid catalog-grid">${catalogPlants.map((plant, index) => `
      <article class="plant-card catalog-card">
        <div class="plant-image plant-placeholder" aria-hidden="true">${plant.icon}</div>
        <div class="plant-card-body"><span class="category-tag">${escapeHTML(plant.category)}</span>
          <h3>${escapeHTML(plant.name)}</h3><p class="scientific-name">${escapeHTML(plant.scientificName)}</p>
          <div class="plant-meta"><span>☀ ${escapeHTML(plant.light)}</span><span>◷ Rega ${escapeHTML(plant.watering.toLowerCase())}</span></div>
          <button class="button button-primary" type="button" data-action="add-catalog" data-index="${index}" ${plants.some((owned) => owned.catalogId === index) ? "disabled" : ""}>
            ${plants.some((owned) => owned.catalogId === index) ? "Já está no teu jardim" : "＋ Adicionar ao jardim"}
          </button>
        </div>
      </article>`).join("")}
    </div>`;
}

function renderCare(plants) {
  const sorted = plants.filter((plant) => plant.nextWatering)
    .sort((a, b) => a.nextWatering.localeCompare(b.nextWatering));
  return `
    <div class="section-heading"><div><h2>Registos de cuidados</h2><p>Acompanha as próximas regas das tuas plantas.</p></div></div>
    ${sorted.length ? `<div class="care-list">${sorted.map((plant) => {
      const days = daysUntil(plant.nextWatering);
      const status = days < 0 ? "Rega atrasada" : days === 0 ? "Regar hoje" : days === 1 ? "Regar amanhã" : `Daqui a ${days} dias`;
      return `<article class="care-item"><div><strong>${escapeHTML(plant.name)}</strong><p>${escapeHTML(plant.watering || "Frequência não indicada")} · ${escapeHTML(status)}</p></div><time class="care-date">${escapeHTML(formatDate(plant.nextWatering))}</time></article>`;
    }).join("")}</div>` : `<div class="empty-state"><span>🪴</span><h3>Sem cuidados agendados</h3><p>Define a próxima rega ao criar ou editar uma planta.</p></div>`}`;
}

function renderProfile() {
  return `
    <div class="section-heading"><div><h2>O meu perfil</h2><p>Consulta e atualiza os dados do teu espaço FloraAura.</p></div></div>
    <section class="profile-card">
      <div class="profile-avatar">${escapeHTML(currentAccount.name.trim().charAt(0).toUpperCase())}</div>
      <form id="profile-form" class="profile-form">
        <label for="profile-name">Nome</label>
        <input id="profile-name" name="name" value="${escapeHTML(currentAccount.name)}" required minlength="2" maxlength="80">
        <label for="profile-email">Email</label>
        <input id="profile-email" type="email" value="${escapeHTML(currentAccount.email)}" disabled>
        <button class="button button-primary" type="submit">Guardar alterações</button>
      </form>
    </section>
    <p class="profile-note">Os dados do perfil e das plantas são guardados localmente neste navegador.</p>`;
}

function renderPage(page) {
  if (!currentAccount) return;
  currentPage = ["inicio", "catalogo", "minhas-plantas", "cuidados", "perfil"].includes(page) ? page : "inicio";
  const titles = {
    inicio: ["O teu jardim digital", "PAINEL BOTÂNICO"],
    catalogo: ["Catálogo de plantas", "DESCOBRE E CULTIVA"],
    "minhas-plantas": ["As minhas plantas", "O TEU JARDIM"],
    cuidados: ["Registos de cuidados", "ROTINA BOTÂNICA"],
    perfil: ["O meu perfil", "A TUA CONTA"]
  };
  document.querySelector("#page-title").textContent = titles[currentPage][0];
  document.querySelector(".topbar .eyebrow").textContent = titles[currentPage][1];
  document.querySelector("#add-plant-btn").hidden = currentPage === "catalogo" || currentPage === "perfil";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const active = link.dataset.page === currentPage;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  try {
    const plants = readPlants();
    if (currentPage === "inicio") pageContent.innerHTML = renderDashboard(plants);
    if (currentPage === "catalogo") pageContent.innerHTML = renderCatalog();
    if (currentPage === "minhas-plantas") pageContent.innerHTML = renderPlantList(plants, "As minhas plantas", "Gere as plantas do teu jardim: consulta, atualiza ou remove registos.");
    if (currentPage === "cuidados") pageContent.innerHTML = renderCare(plants);
    if (currentPage === "perfil") pageContent.innerHTML = renderProfile();
  } catch (error) {
    pageContent.innerHTML = `<div class="empty-state"><h2>Não foi possível carregar esta página</h2><p>${escapeHTML(error.message)}</p></div>`;
  }
}

function openPlantForm(plant = null) {
  plantForm.reset();
  document.querySelector("#plant-id").value = plant?.id || "";
  document.querySelector("#form-title").textContent = plant ? "Editar planta" : "Adicionar planta";
  for (const key of ["commonName", "scientificName", "category", "light", "watering", "soil", "health", "nextWatering", "notes"]) {
    const input = plantForm.elements.namedItem(key);
    if (input && plant) input.value = plant[key] || "";
  }
  plantDialog.showModal();
}

function showPlantDetails(plant) {
  const content = document.querySelector("#detail-content");
  content.innerHTML = `
    <div class="modal-header"><div><span class="eyebrow">DETALHES DA PLANTA</span><h2>${escapeHTML(plant.name)}</h2></div>
      <button class="icon-button" type="button" data-action="close-details" aria-label="Fechar">✕</button></div>
    ${plant.photo ? `<img class="detail-image" src="${escapeHTML(plant.photo)}" alt="${escapeHTML(plant.name)}">` : ""}
    <p class="scientific-name">${escapeHTML(plant.scientificName || "Nome científico não indicado")}</p>
    <p class="detail-description">${escapeHTML(plant.notes || "Sem descrição ou dicas de cuidados.")}</p>
    <div class="detail-list">
      ${[["Categoria", plant.category], ["Exposição solar", plant.light], ["Frequência de rega", plant.watering], ["Tipo de solo", plant.soil], ["Estado de saúde", plant.health], ["Próxima rega", formatDate(plant.nextWatering)]]
        .map(([label, value]) => `<div class="detail-field"><small>${escapeHTML(label)}</small><strong>${escapeHTML(value || "Não indicado")}</strong></div>`).join("")}
    </div>`;
  detailDialog.showModal();
}

async function photoAsDataUrl(file) {
  if (!file || !file.size) return "";
  if (!file.type.startsWith("image/")) throw new Error("O ficheiro selecionado não é uma imagem.");
  if (file.size > 1500000) throw new Error("A fotografia deve ter menos de 1,5 MB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Não foi possível ler a fotografia selecionada."));
    reader.readAsDataURL(file);
  });
}

async function savePlant(event) {
  event.preventDefault();
  if (!plantForm.reportValidity()) return;
  const data = new FormData(plantForm);
  const id = document.querySelector("#plant-id").value;
  const plants = readPlants();
  const existing = plants.find((plant) => plant.id === id);
  const photoFile = data.get("photo");

  try {
    const photo = photoFile?.size ? await photoAsDataUrl(photoFile) : existing?.photo || "";
    const plant = {
      id: id || crypto.randomUUID(),
      name: String(data.get("commonName")).trim(),
      scientificName: String(data.get("scientificName")).trim(),
      category: String(data.get("category")),
      light: String(data.get("light")),
      watering: String(data.get("watering")),
      soil: String(data.get("soil")).trim(),
      health: String(data.get("health")),
      nextWatering: String(data.get("nextWatering")),
      notes: String(data.get("notes")).trim(),
      photo,
      catalogId: existing?.catalogId ?? null
    };
    const updated = existing ? plants.map((item) => item.id === id ? plant : item) : [...plants, plant];
    savePlants(updated);
    plantDialog.close();
    renderPage(currentPage);
    showToast(existing ? "Planta atualizada." : "Planta adicionada ao teu jardim.");
  } catch (error) {
    showToast(error.message || "Não foi possível guardar a planta.");
  }
}

async function addCatalogPlant(index) {
  const sample = catalogPlants[index];
  if (!sample) return;
  try {
    const plants = readPlants();
    if (plants.some((plant) => plant.catalogId === index)) return;
    plants.push({
      ...sample,
      id: crypto.randomUUID(),
      catalogId: index,
      health: "Saudável",
      soil: "",
      notes: "",
      nextWatering: "",
      photo: ""
    });
    savePlants(plants);
    renderPage(currentPage);
    showToast(`${sample.name} adicionada ao teu jardim.`);
  } catch (error) {
    showToast(error.message || "Não foi possível adicionar a planta.");
  }
}

async function saveProfile(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const name = String(new FormData(event.currentTarget).get("name")).trim();
  if (name.length < 2) {
    showToast("O nome deve ter pelo menos 2 caracteres.");
    return;
  }
  try {
    const accounts = readAccounts();
    const index = accounts.findIndex((account) => account.email === currentAccount.email);
    if (index < 0) throw new Error("Não foi encontrada a conta atual.");
    accounts[index] = { ...accounts[index], name };
    saveAccounts(accounts);
    currentAccount = accounts[index];
    sessionUser.textContent = name;
    document.querySelector(".avatar").textContent = name.trim().charAt(0).toUpperCase();
    renderPage("perfil");
    showToast("Perfil atualizado.");
  } catch (error) {
    showToast(error.message || "Não foi possível guardar o perfil.");
  }
}

function signOut() {
  try {
    sessionStorage.removeItem(sessionStorageKey);
    showWelcome();
  } catch (error) {
    showToast("Não foi possível terminar a sessão neste separador.");
  }
}

authSwitch.addEventListener("click", () => setAuthMode(authMode === "login" ? "register" : "login"));
document.querySelector("#welcome-continue").addEventListener("click", () => showLogin());
loginForm.addEventListener("submit", handleAuthSubmit);
plantForm.addEventListener("submit", savePlant);
document.querySelector("#add-plant-btn").addEventListener("click", () => openPlantForm());
document.querySelector("#sign-out-btn").addEventListener("click", signOut);
document.querySelector("#close-dialog").addEventListener("click", () => plantDialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => plantDialog.close());
document.querySelector("#menu-toggle").addEventListener("click", (event) => {
  const sidebar = document.querySelector("#sidebar");
  const open = sidebar.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

document.querySelector(".navigation").addEventListener("click", (event) => {
  const link = event.target.closest(".nav-link");
  if (!link) return;
  event.preventDefault();
  currentPage = link.dataset.page;
  history.replaceState(null, "", `#${currentPage}`);
  renderPage(currentPage);
  document.querySelector("#sidebar").classList.remove("open");
});

pageContent.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-go-page]");
  if (pageButton) {
    currentPage = pageButton.dataset.goPage;
    renderPage(currentPage);
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const plants = readPlants();
  const index = Number(button.dataset.index);
  const plant = plants[index];
  if (button.dataset.action === "add") openPlantForm();
  if (button.dataset.action === "add-catalog") addCatalogPlant(index);
  if (button.dataset.action === "details" && plant) showPlantDetails(plant);
  if (button.dataset.action === "edit" && plant) openPlantForm(plant);
  if (button.dataset.action === "delete" && plant && window.confirm(`Queres apagar ${plant.name} do teu jardim?`)) {
    try {
      savePlants(plants.filter((item) => item.id !== plant.id));
      renderPage(currentPage);
      showToast("Planta removida.");
    } catch (error) {
      showToast(error.message || "Não foi possível remover a planta.");
    }
  }
});

pageContent.addEventListener("input", (event) => {
  if (event.target.id !== "plant-search") return;
  const query = event.target.value.trim().toLocaleLowerCase("pt-PT");
  const category = pageContent.querySelector("#category-filter")?.value || "";
  filterPlants(query, category);
});

pageContent.addEventListener("change", (event) => {
  if (event.target.id !== "category-filter") return;
  const query = pageContent.querySelector("#plant-search")?.value.trim().toLocaleLowerCase("pt-PT") || "";
  filterPlants(query, event.target.value);
});

function filterPlants(query, category) {
  const plants = readPlants();
  const filtered = plants.filter((plant) =>
    (!query || `${plant.name} ${plant.scientificName}`.toLocaleLowerCase("pt-PT").includes(query)) &&
    (!category || plant.category === category)
  );
  const grid = pageContent.querySelector("#plant-grid");
  if (grid) grid.innerHTML = filtered.length
    ? filtered.map((plant) => plantCard(plant, plants.indexOf(plant))).join("")
    : `<div class="empty-state"><span>🔎</span><h3>Não encontrámos plantas</h3><p>Altera a pesquisa ou o filtro de categoria.</p></div>`;
}

pageContent.addEventListener("submit", (event) => {
  if (event.target.id === "profile-form") saveProfile(event);
});

document.querySelector("#detail-content").addEventListener("click", (event) => {
  if (event.target.closest('[data-action="close-details"]')) detailDialog.close();
});

try {
  const savedEmail = sessionStorage.getItem(sessionStorageKey);
  if (savedEmail) {
    currentAccount = readAccounts().find((account) => account.email === savedEmail) || null;
    if (currentAccount) {
      currentPage = location.hash.slice(1) || "inicio";
      showApp();
    } else {
      sessionStorage.removeItem(sessionStorageKey);
      showWelcome();
    }
  } else {
    showWelcome();
  }
} catch (error) {
  showLogin();
  loginMessage.textContent = error.message || "Não foi possível ler os dados guardados neste navegador.";
}
