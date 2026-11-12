const welcomeScreen = document.querySelector("#welcome-screen");
const loginScreen = document.querySelector("#login-screen");
const appLayout = document.querySelector("#app-layout");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const authSwitch = document.querySelector("#auth-switch");
const passwordInput = document.querySelector("#login-password");
const passwordToggle = document.querySelector("#password-toggle");
const installButton = document.querySelector("#install-app");
const installHelp = document.querySelector("#install-help");
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
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCalendarDate = dateKey(new Date());
let toastTimeout;
let installPrompt = null;

const catalogPlants = [
  { name: "Monstera", scientificName: "Monstera deliciosa", description: "Planta tropical de folhas grandes e recortadas, ideal para dar um toque exuberante a interiores.", category: "Interior", light: "Luz indireta", watering: "Semanal", icon: "🌿", photo: "assets/plants/monstera-user.png" },
  { name: "Lavanda", scientificName: "Lavandula angustifolia", description: "Planta aromática de flores roxas, apreciada pelo perfume e por atrair abelhas e outros polinizadores.", category: "Exterior", light: "Sol direto", watering: "Semanal", icon: "🪻", photo: "assets/plants/lavender-user.png" },
  { name: "Aloe vera", scientificName: "Aloe barbadensis miller", description: "Suculenta de folhas carnudas que armazenam água e tolera bem períodos de seca.", category: "Suculenta", light: "Sol direto", watering: "Quinzenal", icon: "🌵", photo: "assets/plants/aloe-vera-user.png" },
  { name: "Lírio-da-paz", scientificName: "Spathiphyllum wallisii", description: "Planta de interior conhecida pelas folhas verdes e pelas elegantes flores brancas.", category: "Interior", light: "Meia-sombra", watering: "A cada 2-3 dias", icon: "🌱", photo: "assets/plants/peace-lily-user.png" },
  { name: "Roseira", scientificName: "Rosa spp.", description: "Arbusto florido muito popular, com flores perfumadas disponíveis em muitas cores e formas.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌹", photo: "assets/plants/rose-user.png" },
  { name: "Orquídea", scientificName: "Phalaenopsis", description: "Orquídea elegante de interior, famosa pelas hastes floridas e pelas flores duradouras.", category: "Ornamental", light: "Luz indireta", watering: "Semanal", icon: "🌸", photo: "assets/plants/orchid-user.png" },
  { name: "Rosa vermelha", scientificName: "Rosa spp.", description: "Rosa de pétalas vermelhas, símbolo clássico de elegância e frequentemente oferecida como presente.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌹", photo: "assets/plants/red-rose-user.png" },
  { name: "Tulipa", scientificName: "Tulipa gesneriana", description: "Bolbosa primaveril que produz flores em forma de taça e numa grande variedade de cores.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌷", photo: "assets/plants/tulip-user.png" },
  { name: "Dália", scientificName: "Dahlia 'Bishop of Auckland'", description: "Planta ornamental de flores vistosas, que podem variar bastante em tamanho, forma e cor.", category: "Ornamental", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌺", photo: "assets/plants/dahlia-user.png" },
  { name: "Margarida", scientificName: "Leucanthemum vulgare 'Filigran'", description: "Flor campestre de pétalas brancas e centro amarelo, simples e luminosa no jardim.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌼", photo: "assets/plants/daisy-user.png" },
  { name: "Jiboia", scientificName: "Epipremnum aureum", description: "Trepadeira tropical de fácil adaptação, com folhas decorativas que ficam bonitas em vasos suspensos.", category: "Interior", light: "Luz indireta", watering: "Semanal", icon: "🍃", photo: "assets/plants/jiboia-user.png" },
  { name: "Cato", scientificName: "Echinopsis spp.", description: "Suculenta resistente que armazena água no caule e precisa de muita luz e regas espaçadas.", category: "Suculenta", light: "Sol direto", watering: "Mensal", icon: "🌵", photo: "assets/plants/cato.png" },
  { name: "Alecrim", scientificName: "Salvia rosmarinus", description: "Erva aromática mediterrânica, muito usada na cozinha e apreciada pelas folhas perfumadas.", category: "Exterior", light: "Sol direto", watering: "Semanal", icon: "🌱", photo: "assets/plants/alecrim.png" },
  { name: "Gerânio", scientificName: "Pelargonium zonale", description: "Planta ornamental de floração colorida, muito popular em canteiros, vasos e varandas.", category: "Ornamental", light: "Sol direto", watering: "Semanal", icon: "🌺", photo: "assets/plants/geranio.png" },
  { name: "Jasmim", scientificName: "Jasminum officinale", description: "Trepadeira conhecida pelas flores delicadas e perfumadas, que embelezam jardins e pérgulas.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌼", photo: "assets/plants/jasmim.png" },
  { name: "Calatéia", scientificName: "Goeppertia makoyana", description: "Planta tropical de interior, valorizada pelas folhas com padrões e contrastes decorativos.", category: "Interior", light: "Luz indireta", watering: "A cada 2-3 dias", icon: "🍀", photo: "assets/plants/calateia.png" },
  { name: "Begónia", scientificName: "Begonia semperflorens", description: "Planta compacta com folhas arredondadas e pequenas flores que dão cor durante longos períodos.", category: "Ornamental", light: "Meia-sombra", watering: "Semanal", icon: "🌸", photo: "assets/plants/begonia.png" },
  { name: "Crisântemo", scientificName: "Chrysanthemum morifolium", description: "Planta ornamental de flores abundantes, muito associada aos jardins e arranjos de outono.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌼", photo: "assets/plants/crisantemo.png" },
  { name: "Hera", scientificName: "Hedera helix", description: "Trepadeira perene de crescimento vigoroso, ideal para cobrir muros ou criar cascatas de folhas.", category: "Exterior", light: "Meia-sombra", watering: "Semanal", icon: "🍃", photo: "assets/plants/hera.png" },
  { name: "Hortênsia", scientificName: "Hydrangea macrophylla", description: "Arbusto de jardim com grandes conjuntos de flores, cujas cores podem variar com as condições do solo.", category: "Jardim", light: "Meia-sombra", watering: "A cada 2-3 dias", icon: "💐", photo: "assets/plants/hortensia.png" },
  { name: "Girassol", scientificName: "Helianthus annuus", description: "Planta alta e solarenga, reconhecida pelas grandes flores amarelas que atraem polinizadores.", category: "Jardim", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌻", photo: "assets/plants/girassol.png" },
  { name: "Peónia", scientificName: "Paeonia lactiflora", description: "Planta perene apreciada pelas flores grandes, exuberantes e frequentemente perfumadas.", category: "Ornamental", light: "Sol direto", watering: "Semanal", icon: "🌸", photo: "assets/plants/peonia-user.png" },
  { name: "Camélia", scientificName: "Camellia japonica", description: "Arbusto perene de folhas brilhantes, que floresce com elegância nos meses mais frescos.", category: "Exterior", light: "Meia-sombra", watering: "Semanal", icon: "🌺", photo: "assets/plants/camelia.png" },
  { name: "Gardénia", scientificName: "Gardenia jasminoides", description: "Arbusto de folhas verde-escuras e flores brancas célebres pelo seu perfume intenso.", category: "Ornamental", light: "Luz indireta", watering: "A cada 2-3 dias", icon: "🤍", photo: "assets/plants/gardenia.png" },
  { name: "Violeta-africana", scientificName: "Saintpaulia ionantha", description: "Planta de interior compacta, com folhas aveludadas e flores delicadas em tons de roxo ou rosa.", category: "Interior", light: "Luz indireta", watering: "Semanal", icon: "💜", photo: "assets/plants/violeta-africana.png" },
  { name: "Hibisco", scientificName: "Hibiscus rosa-sinensis", description: "Arbusto tropical que se destaca pelas flores grandes e coloridas, de aspeto exótico.", category: "Exterior", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌺", photo: "assets/plants/hibisco.png" },
  { name: "Petúnia", scientificName: "Petunia × atkinsiana", description: "Planta de floração abundante, com flores em forma de trombeta e muitas combinações de cores.", category: "Ornamental", light: "Sol direto", watering: "A cada 2-3 dias", icon: "🌷", photo: "assets/plants/petunia.png" }
];

const catalogPlantGuides = {
  "Monstera": { origin: "América Central e regiões tropicais próximas.", use: "Cultivada sobretudo como planta ornamental de interior. As folhas recortadas criam um ponto de destaque em salas e escritórios.", soil: "Substrato fértil, leve e bem drenado.", careTips: "Prefere luz indireta forte, calor e alguma humidade. Deixa a camada superior do substrato secar antes de regar e dá-lhe um tutor quando crescer." },
  "Lavanda": { origin: "Região mediterrânica.", use: "Planta ornamental e aromática; as flores perfumadas atraem abelhas e outros polinizadores e são usadas em saquetas e arranjos secos.", soil: "Solo leve, pobre a moderadamente fértil e muito bem drenado.", careTips: "Gosta de sol direto e não tolera solo encharcado. Poda ligeiramente após a floração, sem cortar a parte lenhosa antiga." },
  "Aloe vera": { origin: "Península Arábica, atualmente cultivada em muitas regiões quentes.", use: "Suculenta ornamental. O gel das folhas é usado em alguns produtos cosméticos; não ingerir nem aplicar na pele sem conhecer a segurança e a origem do produto.", soil: "Mistura para cactos e suculentas, mineral e bem drenada.", careTips: "Precisa de bastante luz e de o substrato secar completamente entre regas. Evita deixar água acumulada no prato ou no centro da roseta." },
  "Lírio-da-paz": { origin: "Regiões tropicais das Américas.", use: "Planta ornamental de interior, apreciada pelas folhas verdes e pelas brácteas brancas. Não é comestível e pode ser tóxica para animais de estimação se ingerida.", soil: "Substrato rico em matéria orgânica, arejado e com boa drenagem.", careTips: "Adapta-se a luz indireta e prefere humidade regular, sem encharcamento. Mantém-na afastada de crianças e animais que possam mastigar as folhas." },
  "Roseira": { origin: "O género Rosa inclui espécies nativas de várias regiões temperadas do Hemisfério Norte.", use: "Arbusto ornamental para jardins e vasos; as flores são usadas em arranjos e, em algumas variedades próprias, em perfumaria.", soil: "Solo fértil, profundo e bem drenado.", careTips: "Oferece várias horas de sol e rega junto ao solo, sem molhar continuamente as folhas. Remove flores murchas e verifica regularmente a presença de pragas." },
  "Orquídea": { origin: "Espécies Phalaenopsis são nativas de regiões tropicais da Ásia e do Pacífico.", use: "Orquídea ornamental cultivada em casa pelas flores duradouras; também é muito usada em decoração e como planta de oferta.", soil: "Substrato próprio para orquídeas, geralmente à base de casca de pinheiro e bem arejado.", careTips: "Prefere luz indireta e raízes arejadas. Rega quando o substrato estiver quase seco e não deixes o vaso dentro de água." },
  "Rosa vermelha": { origin: "As roseiras cultivadas resultam de espécies e cruzamentos com origens diversas.", use: "Variedade ornamental apreciada em jardins, ramos e arranjos. O perfume e a forma variam conforme a cultivar.", soil: "Solo fértil, profundo e bem drenado.", careTips: "Escolhe um local soalheiro, rega junto à base e remove flores murchas. A poda e a proteção no inverno dependem da variedade e do clima." },
  "Tulipa": { origin: "O género Tulipa tem origem na Ásia Central e regiões próximas.", use: "Bolbosa ornamental de primavera, muito usada em canteiros, vasos e flores de corte.", soil: "Solo solto, fértil e bem drenado; o bolbo apodrece facilmente em solo encharcado.", careTips: "Planta os bolbos na época adequada ao clima local e deixa a folhagem amarelecer naturalmente após a floração para repor reservas." },
  "Dália": { origin: "México e América Central.", use: "Planta ornamental de jardim e flor de corte, com cultivares de muitas formas e cores.", soil: "Solo fértil, rico em matéria orgânica e bem drenado.", careTips: "Precisa de boa luminosidade e rega regular durante o crescimento. Em locais com geadas, os tubérculos podem precisar de proteção no inverno." },
  "Margarida": { origin: "Europa e regiões temperadas da Ásia.", use: "Flor ornamental para canteiros e prados; as flores atraem insetos polinizadores.", soil: "Solo comum de jardim, moderadamente fértil e bem drenado.", careTips: "Cultiva em local soalheiro e rega quando o solo começar a secar. Retira flores murchas para prolongar a floração." },
  "Jiboia": { origin: "Ilhas do Pacífico Sul; atualmente cultivada em interiores de todo o mundo.", use: "Trepadeira ornamental para prateleiras e vasos suspensos. Todas as partes podem ser tóxicas se mastigadas, pelo que deve ficar fora do alcance de animais e crianças.", soil: "Substrato de interior leve, com boa drenagem.", careTips: "Adapta-se a luz indireta e prefere secar ligeiramente entre regas. Limpa as folhas e poda as pontas para controlar o tamanho." },
  "Cato": { origin: "O género Echinopsis é nativo da América do Sul; os cactos variam bastante entre espécies.", use: "Planta ornamental de coleção, valorizada pela forma escultural e, em algumas espécies, por flores grandes e vistosas.", soil: "Mistura mineral para cactos, muito drenante, num vaso com furos.", careTips: "Dá-lhe muita luz e rega apenas quando o substrato estiver completamente seco; no tempo frio, reduz ainda mais a rega. Usa luvas ao manusear espécies com espinhos." },
  "Alecrim": { origin: "Região mediterrânica.", use: "Erva aromática usada como condimento na cozinha; também é cultivada como sebe baixa e planta atrativa para polinizadores.", soil: "Solo leve, pouco compacto e bem drenado.", careTips: "Prefere sol direto e tolera alguma seca depois de estabelecido. Evita o excesso de água e poda ligeiramente para manter a forma." },
  "Gerânio": { origin: "África Austral.", use: "Planta ornamental de vasos, varandas e canteiros, com floração prolongada e várias cores.", soil: "Substrato fértil, mas bem drenado.", careTips: "Oferece boa luminosidade e rega moderada, deixando a superfície do solo secar entre regas. Remove folhas e flores secas." },
  "Jasmim": { origin: "Ásia, com espécies cultivadas em muitas regiões quentes.", use: "Trepadeira ornamental para pérgulas e jardins; algumas variedades são cultivadas pelo perfume das flores.", soil: "Solo fértil, fresco e bem drenado.", careTips: "Precisa de bastante luz para florir e de suporte para trepar. Rega mais durante o crescimento ativo, sem deixar as raízes encharcadas." },
  "Calatéia": { origin: "Regiões tropicais da América Central e do Sul.", use: "Planta ornamental de interior, cultivada sobretudo pela folhagem com padrões marcantes.", soil: "Substrato rico, leve e capaz de reter alguma humidade sem ficar encharcado.", careTips: "Prefere luz indireta, ambiente húmido e água pouco calcária. Protege-a de correntes de ar e do sol direto intenso." },
  "Begónia": { origin: "A espécie Begonia semperflorens tem origem no Brasil.", use: "Planta ornamental compacta para vasos e canteiros, conhecida pela floração abundante.", soil: "Substrato fértil, leve e bem drenado.", careTips: "Gosta de luz abundante sem sol forte nas horas quentes. Rega o solo, evitando molhar excessivamente as folhas e flores." },
  "Crisântemo": { origin: "China e Leste Asiático.", use: "Planta ornamental de jardim e flor de corte, com grande variedade de formas e cores.", soil: "Solo fértil, fresco e bem drenado.", careTips: "Precisa de boa luminosidade e rega regular durante a floração. Retira flores murchas e assegura espaço para circulação de ar." },
  "Hera": { origin: "Europa, Norte de África e partes da Ásia Ocidental.", use: "Trepadeira ornamental para muros e coberturas de solo; pode tornar-se invasora em alguns locais. As bagas são tóxicas se ingeridas.", soil: "Solo comum de jardim, fresco e bem drenado.", careTips: "Adapta-se a várias exposições e precisa de controlo da poda. Mantém as folhas e bagas fora do alcance de crianças e animais." },
  "Hortênsia": { origin: "Ásia Oriental, incluindo o Japão.", use: "Arbusto ornamental para jardins e arranjos florais. A cor das flores pode variar com o pH do solo em algumas variedades.", soil: "Solo rico em matéria orgânica, fresco e bem drenado.", careTips: "Prefere luz suave ou sol da manhã e rega regular, sobretudo em dias quentes. Evita que o solo seque completamente." },
  "Girassol": { origin: "América do Norte.", use: "Planta ornamental e de cultivo agrícola; as sementes de variedades próprias são usadas como alimento e para extração de óleo.", soil: "Solo profundo, fértil e bem drenado.", careTips: "Escolhe um local com sol direto e espaço para crescer. Rega profundamente durante o crescimento e protege plantas altas do vento forte." },
  "Peónia": { origin: "Ásia Oriental; a espécie Paeonia lactiflora é originária da China.", use: "Planta perene ornamental, muito usada em jardins e em ramos pelas flores grandes.", soil: "Solo fértil, profundo e bem drenado.", careTips: "Planta num local luminoso e evita mudar de sítio frequentemente. Não enterres demasiado os olhos de crescimento e dá apoio às flores pesadas." },
  "Camélia": { origin: "Ásia Oriental.", use: "Arbusto ornamental perene, cultivado pela floração de inverno ou primavera, conforme a variedade.", soil: "Solo ácido, rico em matéria orgânica e bem drenado.", careTips: "Prefere meia-sombra e abrigo de ventos secos. Usa água pouco calcária e mantém o solo húmido, sem encharcar." },
  "Gardénia": { origin: "Ásia Oriental.", use: "Arbusto ornamental de interior luminoso ou exterior ameno, apreciado pelas flores brancas perfumadas.", soil: "Substrato ácido, fértil e bem drenado.", careTips: "Precisa de humidade regular, luz abundante indireta e proteção contra mudanças bruscas. Água calcária pode amarelecer as folhas." },
  "Violeta-africana": { origin: "Montanhas Usambara, na Tanzânia, e regiões próximas do Leste de África.", use: "Planta ornamental compacta para interior, com floração frequente em boas condições.", soil: "Substrato leve e arejado, próprio para violetas-africanas.", careTips: "Mantém em luz indireta e temperatura estável. Rega pela base ou diretamente no solo, evitando molhar o centro da planta e as folhas." },
  "Hibisco": { origin: "Regiões tropicais da Ásia.", use: "Arbusto ornamental de clima quente, cultivado pelas flores grandes e coloridas; atrai polinizadores.", soil: "Solo fértil, fresco e bem drenado.", careTips: "Precisa de bastante luz e calor para florir. Rega com regularidade durante o crescimento e protege de frio intenso." },
  "Petúnia": { origin: "América do Sul.", use: "Planta ornamental de floração longa para vasos, jardineiras e canteiros; as flores atraem polinizadores.", soil: "Substrato fértil, leve e bem drenado.", careTips: "Cultiva ao sol para favorecer a floração, rega quando a superfície secar e remove flores murchas para estimular novas flores." }
};

catalogPlants.forEach((plant) => Object.assign(plant, catalogPlantGuides[plant.name]));

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
  passwordInput.type = "password";
  passwordToggle.textContent = "Mostrar";
  passwordToggle.setAttribute("aria-label", "Mostrar palavra-passe");
  passwordToggle.setAttribute("aria-pressed", "false");
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
  setAccountAvatar(document.querySelector(".avatar"), currentAccount);
  renderPage(currentPage);
}

function setAccountAvatar(element, account) {
  const photo = typeof account.profilePhoto === "string" &&
    /^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(account.profilePhoto)
    ? account.profilePhoto
    : "";
  if (photo) {
    const image = document.createElement("img");
    image.src = photo;
    image.alt = `Fotografia de perfil de ${account.name}`;
    element.replaceChildren(image);
    element.setAttribute("aria-label", image.alt);
  } else {
    element.textContent = account.name.trim().charAt(0).toUpperCase();
    element.removeAttribute("aria-label");
  }
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
  const updatedPlants = plants.map((plant) => {
    const updatedPhoto = {
      "Monstera": ["assets/plants/monstera.jpg", "assets/plants/monstera-user.png"],
      "Lavanda": ["assets/plants/lavender.jpg", "assets/plants/lavender-user.png"],
      "Aloe vera": ["assets/plants/aloe-vera.jpg", "assets/plants/aloe-vera-user.png"],
      "Lírio-da-paz": ["assets/plants/peace-lily.jpg", "assets/plants/peace-lily-user.png"],
      "Roseira": ["assets/plants/rose.jpg", "assets/plants/rose-user.png"],
      "Orquídea": ["assets/plants/orchid.jpg", "assets/plants/orchid-user.png"],
      "Dália": ["assets/plants/dahlia.jpg", "assets/plants/dahlia-user.png"],
      "Margarida": ["assets/plants/daisy.jpg", "assets/plants/daisy-user.png"],
      "Tulipa": ["assets/plants/tulip.jpg", "assets/plants/tulip-user.png"],
      "Rosa vermelha": ["assets/plants/red-rose.jpg", "assets/plants/red-rose-user.png"],
      "Jiboia": ["assets/plants/jiboia.png", "assets/plants/jiboia-user.png"],
      "Peónia": ["assets/plants/peonia.png", "assets/plants/peonia-user.png"]
    }[plant.name];
    if (updatedPhoto && plant.photo === updatedPhoto[0]) {
      return { ...plant, photo: updatedPhoto[1], artist: "", source: "", license: "", licenseUrl: "" };
    }
    return plant;
  });
  if (updatedPlants.some((plant, index) => plant !== plants[index])) savePlants(updatedPlants);
  return updatedPlants;
}

function savePlants(plants) {
  localStorage.setItem(plantStorageKey(), JSON.stringify(plants));
}

function taskStorageKey() {
  return `floraAuraTasks:${currentAccount.email}`;
}

function careStorageKey() {
  return `floraAuraCareLog:${currentAccount.email}`;
}

function readTasks() {
  const stored = localStorage.getItem(taskStorageKey());
  if (!stored) return [];
  const tasks = JSON.parse(stored);
  if (!Array.isArray(tasks)) throw new Error("Os dados das tarefas estão num formato inválido.");
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(taskStorageKey(), JSON.stringify(tasks));
}

function readCareLogs() {
  const stored = localStorage.getItem(careStorageKey());
  if (!stored) return [];
  const logs = JSON.parse(stored);
  if (!Array.isArray(logs)) throw new Error("Os dados de registo de cuidados estão num formato inválido.");
  return logs;
}

function saveCareLogs(logs) {
  localStorage.setItem(careStorageKey(), JSON.stringify(logs));
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

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysUntil(date) {
  if (!date) return Number.POSITIVE_INFINITY;
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function estimateNextWateringDate(referenceDate, wateringText = "Semanal") {
  const baseDate = referenceDate ? new Date(`${referenceDate}T00:00:00`) : new Date();
  const normalized = String(wateringText)
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  let days = 7;

  if (normalized.includes("diaria") || normalized.includes("diário") || normalized.includes("daily")) {
    days = 1;
  } else if (normalized.includes("2-3 dias") || normalized.includes("2 a 3 dias") || normalized.includes("2-3") || normalized.includes("2 a 3")) {
    days = 3;
  } else if (normalized.includes("quinzenal")) {
    days = 14;
  } else if (normalized.includes("mensal")) {
    days = 30;
  } else if (normalized.includes("semanal")) {
    days = 7;
  }

  const next = new Date(baseDate);
  next.setDate(next.getDate() + days);
  return dateKey(next);
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
        ${plant.description ? `<p class="plant-description">${escapeHTML(plant.description)}</p>` : ""}
        ${plant.artist && plant.source && plant.license && plant.licenseUrl ? `<small class="image-credit">Fotografia: <a href="${escapeHTML(plant.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(plant.artist)}</a> · <a href="${escapeHTML(plant.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(plant.license)}</a></small>` : ""}
        <span class="health-tag ${healthClass(plant.health)}">${escapeHTML(plant.health || "Saudável")}</span>
        <div class="plant-meta">
          <span>☀ ${escapeHTML(plant.light || "Exposição não indicada")}</span>
          <span>💧 Última rega: ${escapeHTML(formatDate(plant.lastWatered))}</span>
          <span>◷ Próxima rega: ${escapeHTML(formatDate(plant.nextWatering))}</span>
        </div>
        <div class="card-actions">
          <button class="button button-primary" type="button" data-action="water-plant" data-plant-id="${escapeHTML(plant.id)}" aria-label="Regar ${escapeHTML(plant.name)} agora">Regar agora</button>
          <button class="button button-light" type="button" data-action="details" data-index="${index}">Ver detalhes</button>
          <button class="button button-light" type="button" data-action="edit" data-index="${index}">Editar</button>
          <button class="button button-danger" type="button" data-action="delete" data-index="${index}">Apagar</button>
        </div>
      </div>
    </article>`;
}

function renderDashboard(plants) {
  const tasks = readTasks();
  const pendingTasks = tasks.filter((task) => !task.completed);
  const today = new Date().toISOString().slice(0, 10);
  const dueTasks = pendingTasks.filter((task) => task.dueDate && task.dueDate <= today);
  const upcoming = plants
    .filter((plant) => plant.nextWatering)
    .sort((a, b) => a.nextWatering.localeCompare(b.nextWatering))
    .slice(0, 4);
  const due = plants.filter((plant) => plant.nextWatering && plant.nextWatering <= today).length;
  const attention = plants.filter((plant) => plant.health === "Atenção" || plant.health === "Doente").length;
  const favorites = plants.slice(0, 3);

  return `
    <section class="welcome-banner">
      <div class="welcome-copy">
        <span class="eyebrow">O TEU ESPAÇO VERDE</span>
        <h2>Olá, ${escapeHTML(currentAccount.name.split(" ")[0])} <span aria-hidden="true">🌿</span></h2>
        <p>O teu jardim está a crescer. Vê o que precisa de atenção e continua a cuidar das tuas plantas.</p>
        <button class="button" type="button" data-action="add">＋ Adicionar uma planta</button>
      </div>
      <div class="welcome-art" aria-hidden="true">
        <span class="welcome-art-sun">☀</span>
        <span class="welcome-art-plant">🪴</span>
        <span class="welcome-art-leaf">✿</span>
      </div>
    </section>
    <div class="stats-grid">
      <article class="stat-card stat-plants"><span class="stat-icon">♧</span><strong class="stat-number">${plants.length}</strong><span class="stat-label">Plantas no jardim</span><span class="stat-caption">A tua coleção verde</span></article>
      <article class="stat-card stat-watering"><span class="stat-icon">◷</span><strong class="stat-number">${due}</strong><span class="stat-label">Regas por fazer</span><span class="stat-caption">${due ? "Está na hora de cuidar" : "Tudo em dia"}</span></article>
      <article class="stat-card stat-attention"><span class="stat-icon">♡</span><strong class="stat-number">${attention}</strong><span class="stat-label">A precisar de atenção</span><span class="stat-caption">${attention ? "Dá-lhes um carinho extra" : "Todas bem cuidadas"}</span></article>
      <article class="stat-card stat-healthy"><span class="stat-icon">✓</span><strong class="stat-number">${pendingTasks.length}</strong><span class="stat-label">Tarefas por fazer</span><span class="stat-caption">${dueTasks.length ? `${dueTasks.length} com prazo para hoje ou antes` : "O teu jardim, ao teu ritmo"}</span></article>
    </div>
    <section class="dashboard-section">
      <div class="section-heading"><div><span class="eyebrow">UM JARDIM CHEIO DE VIDA</span><h2>As tuas plantas</h2><p>Um olhar rápido sobre a tua coleção.</p></div><button class="text-button" type="button" data-go-page="minhas-plantas">Ver coleção <span aria-hidden="true">→</span></button></div>
      ${favorites.length ? `<div class="dashboard-plant-grid">${favorites.map((plant) => `
        <article class="dashboard-plant-card">
          ${plant.photo
            ? `<img src="${escapeHTML(plant.photo)}" alt="${escapeHTML(plant.name)}" loading="lazy" decoding="async">`
            : `<div class="dashboard-plant-placeholder" aria-hidden="true">${escapeHTML(plant.icon || "🌿")}</div>`}
          <div class="dashboard-plant-info"><span class="category-tag">${escapeHTML(plant.category)}</span><h3>${escapeHTML(plant.name)}</h3><span class="health-tag ${healthClass(plant.health)}">${escapeHTML(plant.health || "Saudável")}</span></div>
        </article>`).join("")}</div>` : `<div class="dashboard-empty-plants"><span aria-hidden="true">🌱</span><div><strong>O teu jardim começa com uma planta</strong><p>Adiciona a primeira e começa a criar a tua coleção.</p></div><button class="button button-light" type="button" data-action="add">Adicionar planta</button></div>`}
    </section>
    <div class="dashboard-bottom-grid">
      <section class="dashboard-panel">
        <div class="section-heading"><div><span class="eyebrow">ROTINA BOTÂNICA</span><h2>Próximos cuidados</h2></div><button class="text-button" type="button" data-go-page="cuidados">Ver todos <span aria-hidden="true">→</span></button></div>
        ${upcoming.length ? `<div class="dashboard-care-list">${upcoming.map((plant) => {
          const days = daysUntil(plant.nextWatering);
          const status = days < 0 ? "Atrasada" : days === 0 ? "Hoje" : days === 1 ? "Amanhã" : formatDate(plant.nextWatering);
          return `<article class="dashboard-care-item">
            <span class="dashboard-care-icon" aria-hidden="true">${plant.photo ? `<img src="${escapeHTML(plant.photo)}" alt="" loading="lazy">` : escapeHTML(plant.icon || "🌿")}</span>
            <div class="dashboard-care-info"><strong>${escapeHTML(plant.name)}</strong><span>Rega · ${escapeHTML(plant.watering || "Frequência não indicada")}</span></div>
            <time class="care-date ${days <= 0 ? "care-date-due" : ""}" datetime="${escapeHTML(plant.nextWatering)}">${escapeHTML(status)}</time>
          </article>`;
        }).join("")}</div>` : `<div class="dashboard-care-empty"><span aria-hidden="true">💧</span><div><strong>Sem regas agendadas</strong><p>Define uma data de rega ao adicionar ou editar uma planta.</p></div></div>`}
      </section>
      <aside class="garden-tip">
        <span class="garden-tip-icon" aria-hidden="true">☀</span>
        <span class="eyebrow">DICA DO JARDIM</span>
        <h2>Um pouco de atenção faz toda a diferença.</h2>
        <p>Verifica a humidade da terra antes de regar. Cada planta tem o seu ritmo — cuida dela ao ritmo da natureza.</p>
        <button class="text-button" type="button" data-go-page="cuidados">Organizar cuidados <span aria-hidden="true">→</span></button>
      </aside>
    </div>
    <section class="dashboard-task-panel">
      <div class="section-heading"><div><span class="eyebrow">PEQUENOS PASSOS, GRANDES JARDINS</span><h2>As tuas tarefas</h2><p>${pendingTasks.length ? `${pendingTasks.length} tarefa${pendingTasks.length === 1 ? "" : "s"} por concluir.` : "Tudo feito por agora — ou começa a planear o próximo cuidado."}</p></div><button class="text-button" type="button" data-go-page="tarefas">Ver tarefas <span aria-hidden="true">→</span></button></div>
      ${pendingTasks.length
        ? `<div class="dashboard-task-list">${pendingTasks.slice().sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31")).slice(0, 3).map((task) => {
          const plant = plants.find((item) => item.id === task.plantId);
          return `<article class="dashboard-task-item"><span class="dashboard-task-icon" aria-hidden="true">✓</span><div><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(plant ? plant.name : "Jardim")} · ${escapeHTML(task.dueDate ? formatDate(task.dueDate) : "Sem prazo")}</small></div><span class="priority-tag priority-${task.priority.toLowerCase()}">${escapeHTML(task.priority)}</span></article>`;
        }).join("")}</div>`
        : `<div class="dashboard-task-empty"><span aria-hidden="true">📝</span><p>Adiciona uma tarefa para acompanhar os próximos cuidados do teu jardim.</p><button class="button button-light" type="button" data-go-page="tarefas">Organizar tarefas</button></div>`}
    </section>`;
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
    <div class="section-heading"><div><h2>Catálogo de plantas</h2><p>Explora ${catalogPlants.length} espécies e adiciona as tuas favoritas ao jardim.</p></div></div>
    <div class="plant-grid catalog-grid">${catalogPlants.map((plant, index) => `
      <article class="plant-card catalog-card">
        <button class="catalog-details-trigger" type="button" data-action="catalog-details" data-index="${index}" aria-label="Ver detalhes de ${escapeHTML(plant.name)}">
          ${plant.photo
            ? `<img class="plant-image catalog-image" src="${escapeHTML(plant.photo)}" alt="" loading="lazy" decoding="async">`
            : `<span class="plant-image plant-placeholder catalog-image" aria-hidden="true">${escapeHTML(plant.icon || "🌿")}</span>`}
        </button>
        <div class="plant-card-body"><span class="category-tag">${escapeHTML(plant.category)}</span>
          <h3>${escapeHTML(plant.name)}</h3><p class="scientific-name">${escapeHTML(plant.scientificName)}</p>
          <p class="plant-description">${escapeHTML(plant.description)}</p>
          <div class="plant-meta"><span>☀ ${escapeHTML(plant.light)}</span><span>◷ Rega ${escapeHTML(plant.watering.toLowerCase())}</span></div>
          <button class="button button-light catalog-details-button" type="button" data-action="catalog-details" data-index="${index}">Ver detalhes</button>
          <button class="button button-primary" type="button" data-action="add-catalog" data-index="${index}" ${plants.some((owned) => owned.catalogId === index) ? "disabled" : ""}>
            ${plants.some((owned) => owned.catalogId === index) ? "Já está no teu jardim" : "＋ Adicionar ao jardim"}
          </button>
          ${plant.artist && plant.source && plant.license && plant.licenseUrl ? `<small class="image-credit">Fotografia: <a href="${escapeHTML(plant.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(plant.artist)}</a> · <a href="${escapeHTML(plant.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(plant.license)}</a></small>` : ""}
        </div>
      </article>`).join("")}
    </div>`;
}

function renderTasks(plants) {
  const tasks = readTasks();
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
    if (!a.dueDate) return b.dueDate ? 1 : 0;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
  const plantOptions = plants.map((plant) =>
    `<option value="${escapeHTML(plant.id)}">${escapeHTML(plant.name)}</option>`
  ).join("");

  return `
    <div class="section-heading task-heading">
      <div><h2>As tuas tarefas</h2><p>Organiza os cuidados do jardim, uma tarefa de cada vez.</p></div>
      <button class="button button-primary" type="button" data-action="new-task">＋ Nova tarefa</button>
    </div>
    <form class="task-form" id="task-form" hidden>
      <input type="hidden" name="taskId" id="task-id">
      <div class="task-form-heading"><div><strong id="task-form-title">Nova tarefa</strong><p>Define o que há a fazer e quando.</p></div></div>
      <label for="task-title">Tarefa *</label>
      <input id="task-title" name="title" required maxlength="100" placeholder="Ex.: Adubar as roseiras">
      <label for="task-description">Notas</label>
      <textarea id="task-description" name="description" rows="2" maxlength="400" placeholder="Detalhes ou materiais necessários"></textarea>
      <div class="form-grid task-form-grid">
        <div><label for="task-due-date">Prazo</label><input id="task-due-date" name="dueDate" type="date"></div>
        <div><label for="task-priority">Prioridade</label><select id="task-priority" name="priority"><option value="Normal">Normal</option><option value="Alta">Alta</option><option value="Baixa">Baixa</option></select></div>
      </div>
      <label for="task-plant">Planta associada</label>
      <select id="task-plant" name="plantId"><option value="">Tarefa geral do jardim</option>${plantOptions}</select>
      <div class="task-form-actions">
        <button class="button button-light" type="button" data-action="cancel-task">Cancelar</button>
        <button class="button button-primary" type="submit">Guardar tarefa</button>
      </div>
    </form>
    <div class="task-toolbar">
      <p><strong>${tasks.filter((task) => !task.completed).length}</strong> por fazer <span>·</span> <strong>${tasks.filter((task) => task.completed).length}</strong> concluídas</p>
      <select class="filter-select" id="task-filter" aria-label="Filtrar tarefas">
        <option value="all">Todas as tarefas</option><option value="pending">Por fazer</option><option value="completed">Concluídas</option>
      </select>
    </div>
    <div class="task-list" id="task-list">
      ${sorted.length ? sorted.map((task) => taskCard(task, plants)).join("") : `<div class="empty-state task-empty"><span>🌱</span><h3>Um jardim cuidado começa com um plano</h3><p>Cria a tua primeira tarefa para organizar os próximos cuidados.</p><button class="button button-primary" type="button" data-action="new-task">＋ Criar tarefa</button></div>`}
    </div>`;
}

function taskCard(task, plants) {
  const plant = plants.find((item) => item.id === task.plantId);
  const overdue = !task.completed && task.dueDate && daysUntil(task.dueDate) < 0;
  const dueLabel = task.dueDate
    ? `${overdue ? "Atrasada · " : "Prazo · "}${formatDate(task.dueDate)}`
    : "Sem prazo definido";
  return `
    <article class="task-card ${task.completed ? "task-completed" : ""}">
      <button class="task-check ${task.completed ? "is-complete" : ""}" type="button" data-action="toggle-task" data-task-id="${escapeHTML(task.id)}" aria-label="${task.completed ? "Reabrir tarefa" : "Concluir tarefa"}">${task.completed ? "✓" : ""}</button>
      <div class="task-card-content">
        <div class="task-card-title"><h3>${escapeHTML(task.title)}</h3><span class="priority-tag priority-${task.priority.toLowerCase()}">${escapeHTML(task.priority)}</span></div>
        ${task.description ? `<p>${escapeHTML(task.description)}</p>` : ""}
        <div class="task-meta"><span class="${overdue ? "task-overdue" : ""}">◷ ${escapeHTML(dueLabel)}</span><span>${plant ? `♧ ${escapeHTML(plant.name)}` : "♧ Jardim"}</span></div>
      </div>
      <div class="task-actions">
        <button class="text-button" type="button" data-action="edit-task" data-task-id="${escapeHTML(task.id)}">Editar</button>
        <button class="text-button task-delete" type="button" data-action="delete-task" data-task-id="${escapeHTML(task.id)}">Apagar</button>
      </div>
    </article>`;
}

function openTaskForm(task = null, dueDate = "") {
  const form = document.querySelector("#task-form");
  form.reset();
  form.elements.namedItem("taskId").value = task?.id || "";
  document.querySelector("#task-form-title").textContent = task ? "Editar tarefa" : "Nova tarefa";
  if (task) {
    form.elements.namedItem("title").value = task.title;
    form.elements.namedItem("description").value = task.description || "";
    form.elements.namedItem("dueDate").value = task.dueDate || "";
    form.elements.namedItem("priority").value = task.priority || "Normal";
    form.elements.namedItem("plantId").value = task.plantId || "";
  } else if (dueDate) {
    form.elements.namedItem("dueDate").value = dueDate;
  }
  form.hidden = false;
  document.querySelector("#task-title").focus();
}

function saveTask(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const id = String(data.get("taskId"));
  try {
    const tasks = readTasks();
    const existing = tasks.find((task) => task.id === id);
    const task = {
      id: id || crypto.randomUUID(),
      title: String(data.get("title")).trim(),
      description: String(data.get("description")).trim(),
      dueDate: String(data.get("dueDate")),
      priority: String(data.get("priority")),
      plantId: String(data.get("plantId")),
      completed: existing?.completed || false,
      createdAt: existing?.createdAt || new Date().toISOString()
    };
    saveTasks(existing ? tasks.map((item) => item.id === id ? task : item) : [...tasks, task]);
    renderPage("tarefas");
    showToast(existing ? "Tarefa atualizada." : "Tarefa adicionada.");
  } catch (error) {
    showToast(error.message || "Não foi possível guardar a tarefa.");
  }
}

function filterTasks(status) {
  const tasks = readTasks().filter((task) =>
    status === "all" || (status === "completed" ? task.completed : !task.completed)
  );
  const list = pageContent.querySelector("#task-list");
  if (!list) return;
  const plants = readPlants();
  list.innerHTML = tasks.length
    ? tasks.sort((a, b) => {
      if (!a.dueDate) return b.dueDate ? 1 : 0;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }).map((task) => taskCard(task, plants)).join("")
    : `<div class="empty-state task-empty"><span>${status === "completed" ? "🌷" : "🌱"}</span><h3>${status === "completed" ? "Ainda não há tarefas concluídas" : "Está tudo em dia"}</h3><p>${status === "completed" ? "As tarefas concluídas vão aparecer aqui." : "Cria uma tarefa para planear os próximos cuidados."}</p></div>`;
}

function renderCare(plants) {
  const logs = readCareLogs();
  const sorted = [...plants]
    .sort((a, b) => (a.nextWatering || "9999-12-31").localeCompare(b.nextWatering || "9999-12-31"));
  const recentLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  const scheduledCount = plants.filter((plant) => plant.nextWatering).length;
  const plantOptions = plants.map((plant) => `<option value="${escapeHTML(plant.id)}">${escapeHTML(plant.name)}</option>`).join("");

  return `
    <div class="section-heading"><div><h2>Registos de cuidados</h2><p>Acompanha as próximas regas, o histórico recente e a rotina do teu jardim.</p></div></div>
    <div class="care-summary-grid">
      <section class="care-panel care-panel-primary">
        <div class="care-panel-header">
          <span class="eyebrow">REGAS DAS TUAS PLANTAS</span>
          <span class="care-pill">${scheduledCount} agendadas</span>
        </div>
        ${sorted.length ? `<div class="care-list">${sorted.slice(0, 6).map((plant) => {
          const days = daysUntil(plant.nextWatering);
          const status = !plant.nextWatering ? "Sem rega agendada" : days < 0 ? "Rega atrasada" : days === 0 ? "Regar hoje" : days === 1 ? "Regar amanhã" : `Daqui a ${days} dias`;
          return `<article class="care-item"><div class="care-item-info"><strong>${escapeHTML(plant.name)}</strong><p>${escapeHTML(plant.watering || "Frequência não indicada")} · ${escapeHTML(status)}</p><small>Última rega: ${escapeHTML(formatDate(plant.lastWatered))}</small></div><div class="care-item-actions"><time class="care-date">${escapeHTML(formatDate(plant.nextWatering))}</time><button class="button button-primary small-button" type="button" data-action="water-plant" data-plant-id="${escapeHTML(plant.id)}" aria-label="Regar ${escapeHTML(plant.name)} agora">Regar agora</button></div></article>`;
        }).join("")}</div>` : `<div class="empty-state"><span>🪴</span><h3>Ainda não tens plantas</h3><p>Adiciona plantas ao teu jardim para começares a organizar as regas.</p></div>`}
      </section>

      <section class="care-panel">
        <div class="care-panel-header">
          <span class="eyebrow">HISTÓRICO</span>
          <span class="care-pill">${recentLogs.length} registos</span>
        </div>
        ${recentLogs.length ? `<div class="care-log-list">${recentLogs.map((entry) => `
          <article class="care-log-item">
            <span class="care-log-icon" aria-hidden="true">${entry.type === "watering" ? "💧" : entry.type === "fertilizer" ? "🌿" : "✓"}</span>
            <div>
              <strong>${escapeHTML(entry.title)}</strong>
              <p>${escapeHTML(entry.note || "Registo atualizado com sucesso.")}</p>
              <small>${escapeHTML(formatDate(entry.date))}</small>
            </div>
          </article>`).join("")}</div>` : `<div class="empty-state compact-empty"><span>✦</span><h3>Nenhum registo recente</h3><p>Quando registares um cuidado, ele aparece aqui para acompanhar a rotina.</p></div>`}
      </section>
    </div>

    <section class="care-entry-panel">
      <div class="care-panel-header">
        <span class="eyebrow">REGISTAR CUIDADO</span>
        <span class="care-pill">Atualiza o teu jardim</span>
      </div>
      <form class="care-form" id="care-form">
        <div class="form-grid">
          <div>
            <label for="care-plant">Planta</label>
            <select id="care-plant" name="plantId" required>
              <option value="">Seleciona uma planta</option>
              ${plantOptions}
            </select>
          </div>
          <div>
            <label for="care-type">Tipo de cuidado</label>
            <select id="care-type" name="type" required>
              <option value="watering">Rega</option>
              <option value="fertilizer">Fertilização</option>
              <option value="inspection">Inspeção</option>
            </select>
          </div>
        </div>
        <div class="form-grid">
          <div>
            <label for="care-date">Data</label>
            <input id="care-date" name="date" type="date" value="${dateKey(new Date())}" required>
          </div>
          <div>
            <label for="care-next-date" id="care-next-label">Próxima rega sugerida</label>
            <input id="care-next-date" name="nextDate" type="date">
          </div>
        </div>
        <label for="care-note">Observações</label>
        <textarea id="care-note" name="note" rows="3" maxlength="500" placeholder="Ex.: A planta estava bem hidratada, folhas sem amarelecimento."></textarea>
        <div class="task-form-actions">
          <button class="button button-primary" type="submit">Guardar registo</button>
        </div>
      </form>
    </section>`;
}

function saveCareRecord(event) {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const plantId = String(data.get("plantId")).trim();
  const type = String(data.get("type"));
  const careDate = String(data.get("date"));
  const nextDate = String(data.get("nextDate") || "");
  const note = String(data.get("note") || "").trim();
  const plants = readPlants();
  const plant = plants.find((item) => item.id === plantId);

  if (!plant) {
    showToast("Seleciona uma planta válida.");
    return;
  }

  try {
    const logs = readCareLogs();
    const logTitle = type === "watering" ? "Rega registada" : type === "fertilizer" ? "Fertilização registada" : "Inspeção registada";
    const newLog = {
      id: crypto.randomUUID(),
      plantId,
      type,
      title: `${plant.name} · ${logTitle}`,
      date: careDate,
      note: note || "Cuidado registado na rotina do jardim.",
      createdAt: new Date().toISOString()
    };

    saveCareLogs([newLog, ...logs]);

    const updatedPlants = plants.map((item) => {
      if (item.id !== plantId) return item;
      return {
        ...item,
        ...(type === "watering" ? {
          lastWatered: careDate,
          nextWatering: nextDate || estimateNextWateringDate(careDate, item.watering)
        } : {}),
        health: type === "inspection" && note ? "Atenção" : item.health || "Saudável"
      };
    });
    savePlants(updatedPlants);
    renderPage(currentPage === "cuidados" ? "cuidados" : currentPage);
    showToast("Registo de cuidado guardado.");
    form.reset();
    form.querySelector("#care-date").value = dateKey(new Date());
    updateCareNextDateSuggestion();
  } catch (error) {
    showToast(error.message || "Não foi possível guardar o registo de cuidado.");
  }
}

function recordPlantWatering(plantId) {
  const plants = readPlants();
  const plant = plants.find((item) => item.id === plantId);
  if (!plant) throw new Error("Não foi encontrada a planta que queres regar.");

  const wateredOn = dateKey(new Date());
  const newLog = {
    id: crypto.randomUUID(),
    plantId,
    type: "watering",
    title: `${plant.name} · Rega registada`,
    date: wateredOn,
    note: "Rega registada na rotina do jardim.",
    createdAt: new Date().toISOString()
  };
  const updatedPlants = plants.map((item) => item.id === plantId
    ? {
      ...item,
      lastWatered: wateredOn,
      nextWatering: estimateNextWateringDate(wateredOn, item.watering)
    }
    : item);

  savePlants(updatedPlants);
  saveCareLogs([newLog, ...readCareLogs()]);
  renderPage(currentPage);
  showToast(`${plant.name} regada. Próxima rega: ${formatDate(updatedPlants.find((item) => item.id === plantId).nextWatering)}.`);
}

function updateCareNextDateSuggestion() {
  const form = pageContent.querySelector("#care-form");
  if (!form) return;
  const plant = readPlants().find((item) => item.id === form.elements.namedItem("plantId").value);
  const type = form.elements.namedItem("type").value;
  const careDate = form.elements.namedItem("date").value;
  const nextDate = form.elements.namedItem("nextDate");

  if (type !== "watering") {
    form.querySelector("#care-next-label").textContent = "Próxima rega (apenas para regas)";
    nextDate.value = "";
    nextDate.disabled = true;
    return;
  }
  form.querySelector("#care-next-label").textContent = "Próxima rega sugerida";
  nextDate.disabled = false;
  nextDate.value = plant && careDate ? estimateNextWateringDate(careDate, plant.watering) : "";
}

function renderCalendar(plants) {
  const tasks = readTasks();
  const eventsByDate = new Map();
  const addEvent = (date, event) => {
    if (!date) return;
    if (!eventsByDate.has(date)) eventsByDate.set(date, []);
    eventsByDate.get(date).push(event);
  };

  plants.forEach((plant) => {
    addEvent(plant.nextWatering, {
      type: "watering",
      title: `Regar ${plant.name}`,
      detail: plant.watering || "Frequência não indicada",
      plantName: plant.name
    });
  });
  tasks.forEach((task) => {
    addEvent(task.dueDate, {
      type: "task",
      title: task.title,
      detail: task.completed ? "Tarefa concluída" : `Tarefa · prioridade ${task.priority || "Normal"}`,
      plantName: plants.find((plant) => plant.id === task.plantId)?.name || "Jardim",
      completed: task.completed
    });
  });

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayKey = dateKey(new Date());
  const selectedEvents = eventsByDate.get(selectedCalendarDate) || [];
  const monthLabel = calendarMonth.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
  const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return `
    <div class="section-heading"><div><h2>Calendário de cuidados</h2><p>Consulta as regas agendadas e os prazos das tarefas do teu jardim.</p></div></div>
    <section class="calendar-panel" aria-label="Calendário mensal de cuidados">
      <header class="calendar-header">
        <div class="calendar-month-control">
          <button class="icon-button" type="button" data-action="calendar-prev" aria-label="Mês anterior">‹</button>
          <h2>${escapeHTML(monthLabel)}</h2>
          <button class="icon-button" type="button" data-action="calendar-next" aria-label="Mês seguinte">›</button>
        </div>
        <button class="button button-light calendar-today" type="button" data-action="calendar-today">Hoje</button>
      </header>
      <div class="calendar-weekdays" aria-hidden="true">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="calendar-grid">
        ${Array.from({ length: cellCount }, (_, index) => {
          const date = new Date(year, month, index - offset + 1);
          const key = dateKey(date);
          const dayEvents = eventsByDate.get(key) || [];
          const inMonth = date.getMonth() === month;
          const classes = ["calendar-day", inMonth ? "" : "calendar-day-outside", key === todayKey ? "calendar-day-today" : "", key === selectedCalendarDate ? "calendar-day-selected" : ""].filter(Boolean).join(" ");
          const labels = dayEvents.slice(0, 2).map((event) => `<span class="calendar-event calendar-event-${event.type}${event.completed ? " calendar-event-completed" : ""}">${event.type === "watering" ? "💧 " : "✓ "}${escapeHTML(event.title)}</span>`).join("");
          const remaining = dayEvents.length > 2 ? `<span class="calendar-event-more">+${dayEvents.length - 2} mais</span>` : "";
          const dateLabel = date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
          const summary = dayEvents.length ? `, ${dayEvents.length} cuidado${dayEvents.length === 1 ? "" : "s"}` : "";
          return `<button class="${classes}" type="button" data-action="calendar-select-day" data-date="${key}" aria-label="${dateLabel}${summary}" aria-pressed="${key === selectedCalendarDate}">
            <span class="calendar-day-number">${date.getDate()}</span>
            <span class="calendar-day-events">${labels}${remaining}</span>
          </button>`;
        }).join("")}
      </div>
      <div class="calendar-legend"><span><i class="calendar-legend-watering"></i> Rega</span><span><i class="calendar-legend-task"></i> Tarefa</span></div>
    </section>
    <section class="calendar-agenda" aria-live="polite">
      <div class="calendar-agenda-heading">
        <div><span class="eyebrow">AGENDA DO DIA</span><h2>${escapeHTML(formatDate(selectedCalendarDate))}</h2></div>
        <button class="button button-primary" type="button" data-action="calendar-add-task">＋ Nova tarefa</button>
      </div>
      ${selectedEvents.length
        ? `<div class="calendar-agenda-list">${selectedEvents.map((event) => `
          <article class="calendar-agenda-item calendar-agenda-${event.type}${event.completed ? " calendar-agenda-completed" : ""}">
            <span class="calendar-agenda-icon" aria-hidden="true">${event.type === "watering" ? "💧" : event.completed ? "✓" : "☑"}</span>
            <div><strong>${escapeHTML(event.title)}</strong><p>${escapeHTML(event.detail)} · ${escapeHTML(event.plantName)}</p></div>
          </article>`).join("")}</div>`
        : `<div class="empty-state calendar-empty"><span>🌿</span><h3>Dia livre de cuidados</h3><p>Não há regas nem tarefas marcadas para este dia.</p></div>`}
    </section>`;
}

function renderProfile() {
  return `
    <div class="section-heading"><div><h2>O meu perfil</h2><p>Consulta e atualiza os dados do teu espaço FloraAura.</p></div></div>
    <section class="profile-card">
      <div class="profile-identity">
        <div class="profile-avatar" id="profile-avatar" aria-label="Fotografia de perfil de ${escapeHTML(currentAccount.name)}"></div>
        <input class="profile-photo-input" id="profile-photo" name="profilePhoto" type="file" form="profile-form" accept="image/jpeg,image/png,image/webp,image/gif" aria-describedby="profile-photo-help profile-photo-message">
        <label class="button button-light profile-photo-button" for="profile-photo">Escolher fotografia</label>
        <small class="profile-photo-help" id="profile-photo-help">JPG, PNG, WebP ou GIF · máximo 1,5 MB</small>
        <p class="profile-photo-message" id="profile-photo-message" role="status" aria-live="polite"></p>
      </div>
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
  currentPage = ["inicio", "catalogo", "minhas-plantas", "cuidados", "calendario", "tarefas", "perfil"].includes(page) ? page : "inicio";
  const titles = {
    inicio: ["O teu jardim digital", "PAINEL BOTÂNICO"],
    catalogo: ["Catálogo de plantas", "DESCOBRE E CULTIVA"],
    "minhas-plantas": ["As minhas plantas", "O TEU JARDIM"],
    cuidados: ["Registos de cuidados", "ROTINA BOTÂNICA"],
    calendario: ["Calendário de cuidados", "AGENDA DO JARDIM"],
    tarefas: ["Tarefas do jardim", "ORGANIZA O TEU JARDIM"],
    perfil: ["O meu perfil", "A TUA CONTA"]
  };
  document.querySelector("#page-title").textContent = titles[currentPage][0];
  document.querySelector(".topbar .eyebrow").textContent = titles[currentPage][1];
  document.querySelector("#add-plant-btn").hidden = currentPage === "catalogo" || currentPage === "perfil" || currentPage === "tarefas";
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
    if (currentPage === "calendario") pageContent.innerHTML = renderCalendar(plants);
    if (currentPage === "tarefas") pageContent.innerHTML = renderTasks(plants);
    if (currentPage === "perfil") {
      pageContent.innerHTML = renderProfile();
      setAccountAvatar(document.querySelector("#profile-avatar"), currentAccount);
    }
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
  if (!plant) {
    plantForm.elements.namedItem("watering").value = "Semanal";
    plantForm.elements.namedItem("nextWatering").value = estimateNextWateringDate(dateKey(new Date()), "Semanal");
  }
  plantDialog.showModal();
}

function showPlantDetails(plant) {
  const content = document.querySelector("#detail-content");
  const guide = catalogPlantGuides[plant.name] || {};
  const soil = plant.soil || guide.soil;
  content.innerHTML = `
    <div class="modal-header"><div><span class="eyebrow">DETALHES DA PLANTA</span><h2>${escapeHTML(plant.name)}</h2></div>
      <button class="icon-button" type="button" data-action="close-details" aria-label="Fechar">✕</button></div>
    ${plant.photo ? `<img class="detail-image" src="${escapeHTML(plant.photo)}" alt="${escapeHTML(plant.name)}">` : ""}
    <p class="scientific-name">${escapeHTML(plant.scientificName || "Nome científico não indicado")}</p>
    ${plant.artist && plant.source && plant.license && plant.licenseUrl ? `<small class="image-credit detail-image-credit">Fotografia: <a href="${escapeHTML(plant.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(plant.artist)}</a> · <a href="${escapeHTML(plant.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(plant.license)}</a></small>` : ""}
    <section class="detail-info-section">
      <h3>Sobre a planta</h3>
      <p class="detail-description">${escapeHTML(plant.description || "Ainda não foi adicionada uma descrição para esta planta.")}</p>
      ${guide.origin ? `<p class="detail-origin"><strong>Origem:</strong> ${escapeHTML(guide.origin)}</p>` : ""}
    </section>
    <div class="detail-list">
      ${[["Categoria", plant.category], ["Exposição solar", plant.light], ["Frequência de rega", plant.watering], ["Última rega", formatDate(plant.lastWatered)], ["Solo recomendado", soil], ["Estado de saúde", plant.health], ["Próxima rega", plant.nextWatering ? formatDate(plant.nextWatering) : "Não agendada"]]
        .map(([label, value]) => `<div class="detail-field"><small>${escapeHTML(label)}</small><strong>${escapeHTML(value || "Não indicado")}</strong></div>`).join("")}
    </div>
    ${guide.use ? `<section class="detail-info-section"><h3>Utilização e interesse</h3><p class="detail-description">${escapeHTML(guide.use)}</p></section>` : ""}
    ${guide.careTips ? `<section class="detail-info-section detail-care-tips"><h3>Dicas de cultivo</h3><p class="detail-description">${escapeHTML(guide.careTips)}</p><small>A frequência de rega é indicativa: ajusta-a à estação, à temperatura e à humidade do solo.</small></section>` : ""}
    ${plant.notes ? `<section class="detail-info-section detail-personal-notes"><h3>As tuas notas</h3><p class="detail-description">${escapeHTML(plant.notes)}</p></section>` : ""}`;
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

async function previewProfilePhoto(event) {
  const input = event.target;
  const file = input.files?.[0];
  if (!file) return;
  const message = document.querySelector("#profile-photo-message");
  const profileAvatar = document.querySelector("#profile-avatar");

  try {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      throw new Error("Escolhe uma fotografia JPG, PNG, WebP ou GIF.");
    }
    const profilePhoto = await photoAsDataUrl(file);
    setAccountAvatar(profileAvatar, { ...currentAccount, profilePhoto });
    message.textContent = "Pré-visualização pronta. Guarda as alterações para guardar a fotografia.";
  } catch (error) {
    input.value = "";
    setAccountAvatar(profileAvatar, currentAccount);
    message.textContent = error.message || "Não foi possível carregar esta fotografia.";
  }
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
      nextWatering: String(data.get("nextWatering")) || (existing ? "" : estimateNextWateringDate(dateKey(new Date()), String(data.get("watering")))),
      lastWatered: existing?.lastWatered || "",
      notes: String(data.get("notes")).trim(),
      description: existing?.description || "",
      origin: existing?.origin || "",
      use: existing?.use || "",
      careTips: existing?.careTips || "",
      photo,
      catalogId: existing?.catalogId ?? null,
      artist: existing?.artist || "",
      source: existing?.source || "",
      license: existing?.license || "",
      licenseUrl: existing?.licenseUrl || ""
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
      nextWatering: estimateNextWateringDate(dateKey(new Date()), sample.watering),
      lastWatered: "",
      photo: sample.photo
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
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const photoFile = data.get("profilePhoto");
  if (name.length < 2) {
    showToast("O nome deve ter pelo menos 2 caracteres.");
    return;
  }
  try {
    const accounts = readAccounts();
    const index = accounts.findIndex((account) => account.email === currentAccount.email);
    if (index < 0) throw new Error("Não foi encontrada a conta atual.");
    let profilePhoto = currentAccount.profilePhoto || "";
    if (photoFile?.size) {
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(photoFile.type)) {
        throw new Error("Escolhe uma fotografia JPG, PNG, WebP ou GIF.");
      }
      profilePhoto = await photoAsDataUrl(photoFile);
    }
    accounts[index] = { ...accounts[index], name, profilePhoto };
    saveAccounts(accounts);
    currentAccount = accounts[index];
    sessionUser.textContent = name;
    setAccountAvatar(document.querySelector(".avatar"), currentAccount);
    renderPage("perfil");
    showToast(photoFile?.size ? "Perfil e fotografia atualizados." : "Perfil atualizado.");
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
passwordToggle.addEventListener("click", () => {
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  passwordToggle.textContent = isVisible ? "Mostrar" : "Ocultar";
  passwordToggle.setAttribute("aria-label", `${isVisible ? "Mostrar" : "Ocultar"} palavra-passe`);
  passwordToggle.setAttribute("aria-pressed", String(!isVisible));
});
document.querySelector("#welcome-continue").addEventListener("click", () => showLogin());
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  installButton.disabled = true;
  try {
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      installHelp.textContent = "A instalação da FloraAura foi iniciada.";
      installButton.hidden = true;
    }
  } catch (error) {
    console.error("Falha ao iniciar a instalação da PWA:", error);
    installHelp.textContent = "Não foi possível iniciar a instalação. Usa o menu do navegador para instalar a aplicação.";
  } finally {
    installPrompt = null;
    installButton.disabled = false;
  }
});
window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
  installHelp.textContent = "FloraAura instalada com sucesso.";
});
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
  if (button.dataset.action === "calendar-prev" || button.dataset.action === "calendar-next") {
    const direction = button.dataset.action === "calendar-prev" ? -1 : 1;
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction, 1);
    selectedCalendarDate = dateKey(calendarMonth);
    renderPage("calendario");
    return;
  }
  if (button.dataset.action === "calendar-today") {
    const today = new Date();
    calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedCalendarDate = dateKey(today);
    renderPage("calendario");
    return;
  }
  if (button.dataset.action === "calendar-select-day") {
    selectedCalendarDate = button.dataset.date;
    const selectedDate = new Date(`${selectedCalendarDate}T00:00:00`);
    calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    renderPage("calendario");
    return;
  }
  if (button.dataset.action === "calendar-add-task") {
    const dueDate = selectedCalendarDate;
    renderPage("tarefas");
    openTaskForm(null, dueDate);
    return;
  }
  if (button.dataset.action === "new-task") {
    openTaskForm();
    return;
  }
  if (button.dataset.action === "cancel-task") {
    document.querySelector("#task-form").hidden = true;
    document.querySelector("#task-form").reset();
    return;
  }
  if (button.dataset.action === "edit-task" || button.dataset.action === "toggle-task" || button.dataset.action === "delete-task") {
    try {
      const tasks = readTasks();
      const task = tasks.find((item) => item.id === button.dataset.taskId);
      if (!task) throw new Error("Não foi encontrada esta tarefa.");
      if (button.dataset.action === "edit-task") {
        openTaskForm(task);
      } else if (button.dataset.action === "toggle-task") {
        saveTasks(tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item));
        renderPage("tarefas");
        showToast(task.completed ? "Tarefa reaberta." : "Tarefa concluída. Muito bem!");
      } else if (window.confirm(`Queres apagar a tarefa "${task.title}"?`)) {
        saveTasks(tasks.filter((item) => item.id !== task.id));
        renderPage("tarefas");
        showToast("Tarefa removida.");
      }
    } catch (error) {
      showToast(error.message || "Não foi possível atualizar a tarefa.");
    }
    return;
  }
  if (button.dataset.action === "catalog-details") {
    const catalogPlant = catalogPlants[Number(button.dataset.index)];
    if (catalogPlant) showPlantDetails(catalogPlant);
    return;
  }
  if (button.dataset.action === "water-plant") {
    try {
      recordPlantWatering(button.dataset.plantId);
    } catch (error) {
      showToast(error.message || "Não foi possível registar a rega.");
    }
    return;
  }
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
  if (event.target.id === "profile-photo") {
    previewProfilePhoto(event);
    return;
  }
  if (event.target.id === "task-filter") {
    filterTasks(event.target.value);
    return;
  }
  if (["care-plant", "care-type", "care-date"].includes(event.target.id)) {
    updateCareNextDateSuggestion();
    return;
  }
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

plantForm.addEventListener("change", (event) => {
  if (event.target.name !== "watering" || document.querySelector("#plant-id").value) return;
  plantForm.elements.namedItem("nextWatering").value =
    estimateNextWateringDate(dateKey(new Date()), event.target.value);
});

pageContent.addEventListener("submit", (event) => {
  if (event.target.id === "task-form") saveTask(event);
  if (event.target.id === "profile-form") saveProfile(event);
  if (event.target.id === "care-form") saveCareRecord(event);
});

document.querySelector("#detail-content").addEventListener("click", (event) => {
  if (event.target.closest('[data-action="close-details"]')) detailDialog.close();
});

if ("serviceWorker" in navigator && window.isSecureContext) {
  navigator.serviceWorker.register("./sw.js")
    .catch((error) => {
      console.error("Falha ao registar o service worker da FloraAura:", error);
      installHelp.textContent = "Não foi possível preparar a instalação offline. Abre a aplicação através de HTTPS e tenta novamente.";
    });
}

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
