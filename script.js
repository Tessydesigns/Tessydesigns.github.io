
const SITE_EMAIL = "you@example.com"; // change to your email

const projects = [
  {
    id: "weather-app",
    title: "Weather App",
    categories: ["Web", "JavaScript"],
    role: "Frontend Developer",
    tools: ["HTML", "CSS", "JavaScript"],
    overview:
      "A weather application with city search and geolocation support showing current weather and forecast.",
    bullets: [
      "City search + current location support",
      "Displays temperature, wind, humidity",
      "7-day forecast",
      "Responsive layout"
    ],
    github: "https://github.com/Tessydesigns/weather-app",
    demo: "https://tessydesigns.github.io/weather-app/"
  },
  {
    id: "todo-list",
    title: "To-Do List",
    categories: ["Web", "JavaScript"],
    role: "Frontend Developer",
    tools: ["HTML", "CSS", "JavaScript"],
    overview:
      "A task manager app allowing users to add, complete, delete, and filter tasks.",
    bullets: [
      "Add / complete / delete tasks",
      "Filter tasks (All / Active / Completed)",
      "Data saved using localStorage",
      "Mobile-friendly UI"
    ],
    github: "https://github.com/Tessydesigns/To-do-list",
    demo: "https://tessydesigns.github.io/To-do-list/"
  }
];
// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===== Theme =====
const themeBtn = $("#themeBtn");
const themeLabel = $("#themeLabel");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "light" : "dark";
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);
else setTheme(window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light");

themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
});

// ===== Mobile Menu =====
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

function closeMobile() {
  if (!mobileMenu) return;
  mobileMenu.hidden = true;
  menuBtn?.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", () => {
  const willOpen = mobileMenu.hidden;
  mobileMenu.hidden = !willOpen;
  menuBtn.setAttribute("aria-expanded", String(willOpen));
});

$$(".mobile-menu a").forEach(a => a.addEventListener("click", closeMobile));

// ===== Active nav highlight (based on filename) =====
(function highlightNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const key =
    file.includes("projects") ? "projects" :
    file.includes("about") ? "about" :
    file.includes("contact") ? "contact" : "home";

  $$("[data-nav]").forEach(a => a.classList.toggle("active", a.getAttribute("data-nav") === key));
})();

// ===== Footer year =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Render featured projects on Home =====
function projectCardHTML(p) {
  const cats = p.categories.map(c => `<span class="tag">${escapeHtml(c)}</span>`).join("");
  const tools = p.tools.slice(0, 3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  return `
    <article class="card">
      <div class="thumb" role="img" aria-label="${escapeHtml(p.title)} preview"></div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <h3>${escapeHtml(p.title)}</h3>
            <div class="muted small">${escapeHtml(p.role)} · ${escapeHtml(p.tools.join(" · "))}</div>
          </div>
          <span class="pill small">New</span>
        </div>
        <p class="muted">${escapeHtml(p.overview)}</p>
        <div class="tag-row">${cats}</div>
        <div class="tag-row">${tools}</div>
        <a class="open-link" href="projects.html">View details →</a>
      </div>
    </article>
  `;
}

const featuredGrid = $("#featuredGrid");
if (featuredGrid) {
  featuredGrid.innerHTML = projects.slice(0, 2).map(projectCardHTML).join("");
}

// ===== Projects page: render + filter + modal =====
const projectGrid = $("#projectGrid");
if (projectGrid) {
  function renderProjects(filter = "All") {
    const list = filter === "All" ? projects : projects.filter(p => p.categories.includes(filter));

    projectGrid.innerHTML = list.length ? list.map(p => `
      <article class="card">
        <div class="thumb" role="img" aria-label="${escapeHtml(p.title)} preview"></div>
        <div class="card-body">
          <div class="card-top">
            <div>
              <h3>${escapeHtml(p.title)}</h3>
              <div class="muted small">${escapeHtml(p.role)} · ${escapeHtml(p.tools.join(" · "))}</div>
            </div>
            
          </div>
          <p class="muted">${escapeHtml(p.overview)}</p>
          <div class="tag-row">${p.categories.map(c => `<span class="tag">${escapeHtml(c)}</span>`).join("")}</div>
          <div class="actions mt">
  <a class="btn primary" href="${p.demo}" target="_blank">Live Demo</a>
  <a class="btn" href="${p.github}" target="_blank">GitHub</a>
</div>
        </div>
      </article>
    `).join("") : `<div class="muted">No projects found.</div>`;
  }

  renderProjects();

  // Filters
  $$(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".filter").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      renderProjects(btn.dataset.filter || "All");
    });
  });

  // Modal wiring
  const backdrop = $("#modalBackdrop");
  const modalClose = $("#modalClose");
  const modalTitle = $("#modalTitle");
  const modalMeta = $("#modalMeta");
  const modalOverview = $("#modalOverview");
  const modalBullets = $("#modalBullets");
  const modalTags = $("#modalTags");
  const modalDemo = $("#modalDemo");
  const modalGithub = $("#modalGithub");
  const copyBtn = $("#copyBtn");
openModal(id)
modalDemo.href = p.demo || "#";
modalGithub.href = p.github || "#"
  let current = null;
  let lastFocused = null;

  function openModal(id) {
    const p = projects.find(x => x.id === id);
    if (!p) return;

    current = p;
    lastFocused = document.activeElement;

    modalTitle.textContent = p.title;
    modalMeta.textContent = `${p.categories.join(" · ")} · ${p.tools.join(" · ")}`;
    modalOverview.textContent = p.overview;
    modalBullets.innerHTML = p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("");
    modalTags.innerHTML = p.categories.map(c => `<span class="tag">${escapeHtml(c)}</span>`).join("");
    modalLink.href = p.demo || "#";
modalLink.textContent = "Live Demo";
modalLink.insertAdjacentHTML(
  "afterend",
  `<a class="btn" href="${p.github}" target="_blank">GitHub</a>`
);

    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    current = null;
    lastFocused?.focus?.();
  }

  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open]");
    if (openBtn) {
      e.preventDefault();
      openModal(openBtn.getAttribute("data-open"));
      return;
    }
    if (e.target === backdrop) closeModal();
  });

  modalClose?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (!backdrop.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
  });

  copyBtn?.addEventListener("click", async () => {
    if (!current) return;
    const text =
`${current.title}
Role: ${current.role}
Tools: ${current.tools.join(", ")}
Overview: ${current.overview}
Highlights:
${current.bullets.map(b => `- ${b}`).join("\n")}
Link: ${current.link || "n/a"}`;

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy summary", 1200);
    } catch {
      copyBtn.textContent = "Copy failed";
      setTimeout(() => copyBtn.textContent = "Copy summary", 1200);
    }
  });
}

// ===== Contact form (contact.html) =====
const form = $("#contactForm");
if (form) {
  const formError = $("#formError");
  const formSuccess = $("#formSuccess");

  function isEmail(x) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x).trim());
  }
  function showError(msg) {
    formError.style.display = "block";
    formError.textContent = msg;
    formSuccess.style.display = "none";
  }
  function showSuccess() {
    formError.style.display = "none";
    formError.textContent = "";
    formSuccess.style.display = "block";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();

    if (name.length < 2) return showError("Please enter your name.");
    if (!isEmail(email)) return showError("Please enter a valid email.");
    if (message.length < 10) return showError("Please write a message (10+ characters).");

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    showSuccess();
    window.location.href = `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
  });

  form.addEventListener("reset", () => {
    formError.style.display = "none";
    formSuccess.style.display = "none";
  });
}