// =========================
// PROJECT DATA
// =========================
const projects = [
  {
    id: "weather-app",
    title: "Weather App",
    categories: ["Web", "JavaScript"],
    role: "Frontend Developer",
    tools: ["HTML", "CSS", "JavaScript"],
    overview: "A weather application with city search and geolocation support showing current weather and forecast.",
    demo: "https://tessydesigns.github.io/weather-app/",
    github: "https://github.com/Tessydesigns/weather-app"
  },
  {
    id: "todo-list",
    title: "To-Do List",
    categories: ["Web", "JavaScript"],
    role: "Frontend Developer",
    tools: ["HTML", "CSS", "JavaScript"],
    overview: "A task manager app allowing users to add, complete, delete, and filter tasks.",
    demo: "https://tessydesigns.github.io/To-do-list/",
    github: "https://github.com/Tessydesigns/To-do-list"
  },
  {
    id: "calculator",
    title: "Web Calculator",
    categories: ["Web", "JavaScript"],
    role: "Frontend Developer",
    tools: ["HTML", "CSS", "JavaScript"],
    overview: "A simple web calculator that performs basic arithmetic operations with a clean and responsive interface.",
    demo: "https://tessydesigns.github.io/web-calculator/",
    github: "https://github.com/Tessydesigns/web-calculator"
  },
  {
    id: "building-apis",
    title: "student-management-APIs",
    categories: ["Web", "Node.js", "Express.js"],
    role: "Backend Developer",
    tools: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "dotenv",
      "Mongoose",
      "jsonwebtoken",
      "bcryptjs",
      "Nodemon",
      "Thunder Client"
    ],
    overview: `This project is a RESTful API built using Node.js and Express.js to manage student records.
It supports CRUD operations, filtering and sorting, middleware for logging and validation, JWT-based authentication, and MongoDB for persistent data storage.
The project demonstrates how to build a structured and secure backend system using real-world development practices.`,
    demo: "https://tessydesigns.github.io/student-management-APIs/",
    github: "https://github.com/Tessydesigns/student-management-APIs"
  }
];
// =========================
// HELPERS
// =========================
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =========================
// THEME TOGGLE
// =========================
const themeBtn = $("#themeBtn");
const themeLabel = $("#themeLabel");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeLabel) {
    themeLabel.textContent = theme === "light" ? "Dark" : "Light";
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
  setTheme(current === "dark" ? "light" : "dark");
});

// =========================
// MOBILE MENU
// =========================
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.hidden = true;
  menuBtn?.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", () => {
  const willOpen = mobileMenu.hidden;
  mobileMenu.hidden = !willOpen;
  menuBtn?.setAttribute("aria-expanded", String(willOpen));
});

$$(".mobile-menu a").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

// =========================
// ACTIVE NAV LINK
// =========================
(function highlightCurrentPage() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  let current = "home";
  if (file.includes("projects")) current = "projects";
  else if (file.includes("about")) current = "about";
  else if (file.includes("contact")) current = "contact";

  $$("[data-nav]").forEach(link => {
    const isActive = link.getAttribute("data-nav") === current;
    link.classList.toggle("active", isActive);
  });
})();

// =========================
// FOOTER YEAR
// =========================
const yearEl = $("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =========================
// PROJECT CARD TEMPLATE
// =========================
function projectCardHTML(project) {
  const tags = project.categories
    .map(category => `<span class="tag">${escapeHtml(category)}</span>`)
    .join("");

  return `
    <article class="card">
      <img class="thumb" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} screenshot">

      <div class="card-body">
        <div class="card-top">
          <div>
            <h3>${escapeHtml(project.title)}</h3>
            <div class="muted small">${escapeHtml(project.role)} · ${escapeHtml(project.tools.join(" · "))}</div>
          </div>
        </div>

        <p class="muted small">${escapeHtml(project.overview)}</p>

        <div class="tag-row">${tags}</div>

        <div class="actions">
          <a class="btn primary" href="${escapeHtml(project.demo)}" target="_blank" rel="noreferrer">Live Demo</a>
          <a class="btn" href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </article>
  `;
}

// =========================
// HOMEPAGE FEATURED PROJECTS
// =========================
const featuredGrid = $("#featuredGrid");
if (featuredGrid) {
  featuredGrid.innerHTML = projects.slice(0, 2).map(projectCardHTML).join("");
}

// =========================
// PROJECTS PAGE RENDER
// =========================
const projectGrid = $("#projectGrid");
const filterButtons = $$(".filter");

function renderProjects(filter = "All") {
  if (!projectGrid) return;

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(project => project.categories.includes(filter));

  if (!filteredProjects.length) {
    projectGrid.innerHTML = `<p class="muted">No projects found.</p>`;
    return;
  }

  projectGrid.innerHTML = filteredProjects.map(projectCardHTML).join("");
}

if (projectGrid) {
  renderProjects();

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      renderProjects(button.dataset.filter || "All");
    });
  });
}


// ===== Projects page =====
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
function goBack() {
  window.history.back();
}