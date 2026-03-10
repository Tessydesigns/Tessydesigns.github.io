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
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
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
  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "light" : "dark";
  }
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  setTheme(prefersDark ? "dark" : "light");
}

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
  if (!mobileMenu) return;
  const willOpen = mobileMenu.hidden;
  mobileMenu.hidden = !willOpen;
  menuBtn?.setAttribute("aria-expanded", String(willOpen));
});

$$(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", closeMobile);
});

// ===== Active nav highlight =====
(function highlightNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const currentPage =
    file.includes("projects") ? "projects" :
    file.includes("about") ? "about" :
    file.includes("contact") ? "contact" :
    "home";

  $$("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-nav") === currentPage);
  });
})();

// ===== Footer year =====
const yearEl = $("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Featured projects on Home =====
function projectCardHTML(project) {
  const categories = project.categories
    .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
    .join("");

  const tools = project.tools
    .slice(0, 3)
    .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
    .join("");

  return `
    <article class="card">
      <div class="thumb" role="img" aria-label="${escapeHtml(project.title)} preview"></div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <h3>${escapeHtml(project.title)}</h3>
            <div class="muted small">
              ${escapeHtml(project.role)} · ${escapeHtml(project.tools.join(" · "))}
            </div>
          </div>
          <span class="pill small">New</span>
        </div>
        <p class="muted">${escapeHtml(project.overview)}</p>
        <div class="tag-row">${categories}</div>
        <div class="tag-row">${tools}</div>
        <div class="actions mt">
          <a class="btn primary" href="${project.demo}" target="_blank" rel="noreferrer">Live Demo</a>
          <a class="btn" href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </article>
  `;
}

const featuredGrid = $("#featuredGrid");
if (featuredGrid) {
  featuredGrid.innerHTML = projects.slice(0, 2).map(projectCardHTML).join("");
}

// ===== Projects page =====
const projectGrid = $("#projectGrid");

if (projectGrid) {
  function renderProjects(filter = "All") {
    const list =
      filter === "All"
        ? projects
        : projects.filter((project) => project.categories.includes(filter));

    projectGrid.innerHTML = list.length
      ? list.map((project) => `
        <article class="card">
          <div class="thumb" role="img" aria-label="${escapeHtml(project.title)} preview"></div>
          <div class="card-body">
            <div class="card-top">
              <div>
                <h3>${escapeHtml(project.title)}</h3>
                <div class="muted small">
                  ${escapeHtml(project.role)} · ${escapeHtml(project.tools.join(" · "))}
                </div>
              </div>
            </div>
            <p class="muted">${escapeHtml(project.overview)}</p>
            <div class="tag-row">
              ${project.categories.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
            </div>
            <div class="actions mt">
              <a class="btn primary" href="${project.demo}" target="_blank" rel="noreferrer">Live Demo</a>
              <a class="btn" href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </article>
      `).join("")
      : `<div class="muted">No projects found.</div>`;
  }

  renderProjects();

  $$(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter").forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      renderProjects(button.dataset.filter || "All");
    });
  });
}

// ===== Contact form =====
const form = $("#contactForm");

if (form) {
  const formError = $("#formError");
  const formSuccess = $("#formSuccess");

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function showError(message) {
    if (formError) {
      formError.style.display = "block";
      formError.textContent = message;
    }
    if (formSuccess) {
      formSuccess.style.display = "none";
      formSuccess.textContent = "";
    }
  }

  function showSuccess(message) {
    if (formError) {
      formError.style.display = "none";
      formError.textContent = "";
    }
    if (formSuccess) {
      formSuccess.style.display = "block";
      formSuccess.textContent = message;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#name")?.value.trim() || "";
    const email = $("#email")?.value.trim() || "";
    const message = $("#message")?.value.trim() || "";

    if (name.length < 2) {
      showError("Please enter your name.");
      return;
    }

    if (!isEmail(email)) {
      showError("Please enter a valid email.");
      return;
    }

    if (message.length < 10) {
      showError("Please write a message (10+ characters).");
      return;
    }

    showSuccess("Your message looks good and is ready to send.");
    form.reset();
  });
}