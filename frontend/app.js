// URL base da API que conecta com o backend (api.py)
const API = "http://localhost:8000";

// >>> Substitua pelos seus valores do EmailJS
const EMAILJS_PUBLIC_KEY = "2YxHAZ0kQiatuyFSl";
const EMAILJS_SERVICE_ID = "service_uhqhls1";
const EMAILJS_TEMPLATE_ID = "template_sn6ho0q";

// Inicializa o EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// =============================
// 🔹 Função para buscar dados JSON da API
// =============================
async function getJSON(path) {
  const res = await fetch(API + path); // faz a requisição
  if (!res.ok) throw new Error("Falha ao buscar " + path); // caso dê erro, lança exceção
  return res.json(); // retorna o resultado convertido para JSON
}

// =============================
// 🔹 Função para criar links (âncoras)
// =============================
function anchor(href, label) {
  const a = document.createElement("a");
  a.href = href; // link para abrir
  a.target = "_blank"; // abre em nova aba
  a.rel = "noopener"; // segurança para evitar acesso à aba original
  a.textContent = label; // texto que aparece no link
  return a; // retorna o elemento <a>
}

// =============================
// 🔹 Chips suaves e translúcidos com ícones por tecnologia
// =============================
function chip(text) {
  const span = document.createElement("span");
  const tech = text.toLowerCase();
  span.textContent = "";

  // Estilo base
  span.style.display = "inline-flex";
  span.style.alignItems = "center";
  span.style.gap = "6px";
  span.style.padding = "6px 12px";
  span.style.borderRadius = "999px";
  span.style.fontSize = "13px";
  span.style.fontWeight = "500";
  span.style.color = "#fff";
  span.style.backdropFilter = "blur(6px)";
  span.style.transition = "0.3s ease";
  span.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  span.style.border = "1px solid rgba(255,255,255,0.08)";
  span.style.opacity = "0.95";

  // 🔹 Cores translúcidas suaves
  let emoji = "💡";
  if (tech.includes("html")) {
    emoji = "🌐";
    span.style.background = "rgba(74, 144, 226, 0.25)"; // azul transparente
  } else if (tech.includes("css")) {
    emoji = "🎨";
    span.style.background = "rgba(92, 107, 192, 0.25)"; // lilás azulado suave
  } else if (tech.includes("javascript")) {
    emoji = "⚡";
    span.style.background = "rgba(100, 181, 246, 0.25)"; // azul clarinho
  } else if (tech.includes("python")) {
    emoji = "🐍";
    span.style.background = "rgba(102, 187, 106, 0.25)"; // verde menta transparente
  } else if (tech.includes("postgresql") || tech.includes("sql")) {
    emoji = "🗃️";
    span.style.background = "rgba(141, 110, 99, 0.25)"; // marrom claro suave
  } else if (tech.includes("tensorflow") || tech.includes("opencv")) {
    emoji = "🧠";
    span.style.background = "rgba(186, 104, 200, 0.25)"; // roxo pastel
  } else if (tech.includes("power bi") || tech.includes("powerbi")) {
    emoji = "📊";
    span.style.background = "rgba(144, 164, 174, 0.25)"; // cinza azulado claro
  } else if (tech.includes("machine")) {
    emoji = "🤖";
    span.style.background = "rgba(149, 117, 205, 0.25)"; // lilás transparente
  } else {
    span.style.background = "rgba(120, 144, 156, 0.25)"; // neutro padrão
  }

  // Ícone + nome
  span.textContent = `${emoji} ${text}`;

  // Hover — só aumenta um pouco a opacidade
  span.addEventListener("mouseenter", () => {
    span.style.background = span.style.background.replace("0.25", "0.4");
  });
  span.addEventListener("mouseleave", () => {
    span.style.background = span.style.background.replace("0.4", "0.25");
  });

  return span;
}

// =============================
// 🔹 Carrega as informações do perfil do banco de dados
// =============================
async function loadProfile() {
  const { profile } = await getJSON("/api/profile"); // busca os dados do perfil
  if (!profile) return; // se não vier nada, para aqui

  // Define os textos nas tags do HTML
  document.getElementById("nome").textContent = profile.full_name || "Seu Nome";
  document.getElementById("headline").textContent = profile.headline || "";
  document.getElementById("bio").textContent = profile.bio || "";

  const elEmail = document.getElementById("email");
  elEmail.textContent = ""; // limpa

  // Botão/link para abrir modal
  const btnOpen = document.createElement("span");
  btnOpen.className = "email-link";
  btnOpen.textContent = "Enviar e-mail";
  btnOpen.onclick = abrirFormulario;

  // Mostrar o e-mail ao lado (apenas informativo)
  const txtEmail = document.createElement("span");
  txtEmail.style.marginLeft = "10px";
  txtEmail.style.opacity = "0.8";
  txtEmail.textContent = profile.email || "";

  // Monta
  elEmail.appendChild(btnOpen);
  elEmail.appendChild(txtEmail);

  document.getElementById("tel").textContent = profile.phone || "";
  document.getElementById("ano").textContent = new Date().getFullYear();

  // Adiciona os links sociais no rodapé
  const social = document.getElementById("footer-social");
  social.innerHTML = ""; // limpa antes de preencher

  if (profile.github) social.appendChild(anchor(profile.github, "GitHub"));
  if (profile.linkedin)
    social.appendChild(anchor(profile.linkedin, "LinkedIn"));
  if (profile.instagram)
    social.appendChild(anchor(profile.instagram, "Instagram"));
}

// =============================
// 🔹 Cria dinamicamente o card de um projeto
// =============================
function renderProjectCard(p) {
  const el = document.createElement("article");
  el.className = "card"; // usa o estilo de card do CSS

  // 🖼️ Imagem do projeto (com validação melhorada)
  // Ignora valores null, [null], "null" ou vazios
  const hasValidImage =
    p.image_url &&
    p.image_url.trim() !== "" &&
    p.image_url !== "[null]" &&
    p.image_url !== "null";

  if (hasValidImage) {
    const img = document.createElement("img");
    img.src = p.image_url.trim(); // remove espaços em branco
    img.alt = p.title || "Imagem do projeto";
    img.style.width = "100%";
    img.style.borderRadius = "10px";
    img.style.marginBottom = "10px";
    img.style.objectFit = "cover";
    img.style.maxHeight = "180px";
    img.style.backgroundColor = "#1c2740"; // cor de fundo enquanto carrega

    // Tratamento de erro caso a imagem não carregue
    img.onerror = function () {
      console.error(`❌ Erro ao carregar imagem: ${p.image_url}`);
      this.style.display = "none"; // esconde se der erro
    };

    // Log para debug (pode remover depois)
    img.onload = function () {
      console.log(`✅ Imagem carregada: ${p.image_url}`);
    };

    el.appendChild(img);
  } else {
    console.warn(`⚠️ Projeto "${p.title}" sem imagem definida`);
  }

  // Título do projeto
  const title = document.createElement("h3");
  title.textContent = p.title;

  // Descrição do projeto
  const desc = document.createElement("p");
  desc.textContent = p.description || "";

  // Lista de chips (tecnologias usadas)
  const chips = document.createElement("div");
  chips.style.display = "flex";
  chips.style.gap = "8px";
  chips.style.flexWrap = "wrap";

  (p.skills || "")
    .split(",")
    .map((s) => s.trim()) // remove espaços
    .filter(Boolean) // ignora vazios
    .forEach((s) => chips.appendChild(chip(s))); // cria um chip para cada skill

  // Cria os botões de links (GitHub, Demo e agora o Certificado)
  const links = document.createElement("div");
  links.style.marginTop = "10px";
  links.style.display = "flex";
  links.style.gap = "10px";

  // Se existir link do repositório, cria botão "Código"
  if (p.repo_url) links.appendChild(anchor(p.repo_url, "Código"));
  // Se existir link de demo, cria botão "Demo"
  if (p.live_url) links.appendChild(anchor(p.live_url, "Demo"));
  // 🔹 Se existir certificado, cria botão "Ver Certificado"
  if (p.certificate_url && p.certificate_url.trim() !== "") {
    const cert = anchor(p.certificate_url, "📜 Ver Certificado");
    cert.className = "btn-certificado";
    cert.style.marginLeft = "auto"; // empurra para o canto direito
    links.appendChild(cert);
  }

  // Monta o card na ordem certa
  el.appendChild(title);
  el.appendChild(desc);
  el.appendChild(chips);
  el.appendChild(links);

  return el; // retorna o card pronto
}

// =============================
// 🔹 Carrega todos os projetos do banco de dados
// =============================
async function loadProjects() {
  const { projects } = await getJSON("/api/projects"); // busca da API
  const academicos = document.getElementById("lista-academicos");
  const pessoais = document.getElementById("lista-pessoais");

  // Limpa as seções antes de preencher
  academicos.innerHTML = "";
  pessoais.innerHTML = "";

  // Cria um card para cada projeto e separa entre acadêmicos e pessoais
  projects.forEach((p) => {
    const card = renderProjectCard(p);
    const kind = (p.kind || "").toLowerCase();
    if (kind.includes("acad")) academicos.appendChild(card);
    else pessoais.appendChild(card);
  });
}

// =============================
// 🔹 Função principal — inicia tudo
// =============================
async function init() {
  try {
    await loadProfile(); // carrega dados do perfil
    await loadProjects(); // carrega os projetos
  } catch (err) {
    alert(
      "Falha ao carregar dados da API. Verifique se o servidor (api.py) está rodando."
    );
    console.error(err);
  }
}

// Executa tudo assim que o arquivo for carregado
init();

// Abre/fecha o modal
function abrirFormulario() {
  document.getElementById("formEmail").style.display = "flex";
}
function fecharFormulario() {
  document.getElementById("formEmail").style.display = "none";
}

// Envio do formulário
const form = document.getElementById("contactForm");
const btnEnviar = document.getElementById("btnEnviar");

// ✅ Só adiciona o evento se o formulário realmente existir
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede recarregamento

    const data = {
      from_name: form.from_name.value,
      from_email: form.from_email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    btnEnviar.disabled = true;
    const oldLabel = btnEnviar.textContent;
    btnEnviar.textContent = "Enviando…";

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
      alert("📤 Mensagem enviada com sucesso!");
      form.reset();
      fecharFormulario(); // se você tiver uma função pra fechar o modal
    } catch (err) {
      console.error(" Erro ao enviar:", err);
      alert("Erro ao enviar mensagem. Verifique os dados e tente novamente.");
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = oldLabel;
    }
  });
} else {
  console.warn("⚠️ Formulário de contato não encontrado (id='contactForm')");
}
