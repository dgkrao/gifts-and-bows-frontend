/* =====================================================
   GLOBAL CONFIG
   ===================================================== */

const API_BASE = "http://localhost:8080/api";

/* =====================================================
   INIT
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  injectNavbar();
  injectFooter();
  protectAdminPages();
});

/* =====================================================
   AUTH UTILITIES
   ===================================================== */

function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  const token = getToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    localStorage.clear();
    return null;
  }
}

function authHeaders(isJson = false) {
  const headers = {};
  const token = localStorage.getItem("token");

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}


function logout() {
  localStorage.clear();
  window.location.href = "../pages/login.html";
}

/* =====================================================
   NAVBAR INJECTION
   ===================================================== */

function injectNavbar() {
  const header = document.querySelector("header");
  if (!header) return;

  const isAdminPage = window.location.pathname.includes("/admin/");
  const role = getRole();

  if (isAdminPage) {
    if (role !== "ADMIN") {
      logout();
      return;
    }
    renderAdminNavbar(header);
  } else {
    renderUserNavbar(header);
  }
}

/* ================= USER NAVBAR ================= */

function renderUserNavbar(header) {
  header.className = "navbar";
  header.innerHTML = `
    <div class="nav-container">
      <div class="logo">
        <img src="../assets/logo/logo.png">
        <span>Gifts_and_Bows</span>
      </div>

      <nav id="navLinks">
        <a href="index.html">Home</a>

        <div class="dropdown">
          <span onclick="toggleDropdown()">Categories ▾</span>
          <div class="dropdown-menu" id="categoryDropdown">
            <span style="padding:10px;">Loading...</span>
          </div>
        </div>

        <a href="products.html">Products</a>
        <a href="cart.html">Cart</a>
        <a href="orders.html">My Orders</a>
        ${
          getToken()
            ? `<a href="#" onclick="logout()">Logout</a>`
            : `<a href="login.html">Login</a>`
        }
      </nav>

      <div class="hamburger" onclick="toggleUserMenu()">☰</div>
    </div>
  `;

  loadUserCategories();
}

/* ================= ADMIN NAVBAR ================= */

function renderAdminNavbar(header) {
  header.className = "admin-navbar";
  header.innerHTML = `
    <div class="admin-nav-container">
      <div class="admin-logo">Gifts_and_Bows · Admin</div>

      <div class="admin-hamburger" onclick="toggleAdminMenu()">☰</div>

      <nav class="admin-nav" id="adminNav">
        <a href="dashboard.html">Dashboard</a>
        <a href="categories.html">Categories</a>
        <a href="products.html">Products</a>
        <a href="orders.html">Orders</a>
        <a href="feedback.html">Feedback</a>
        <a href="site-settings.html">Settings</a>
        <a href="#" onclick="logout()">Logout</a>
      </nav>
    </div>
  `;
}

/* =====================================================
   FOOTER
   ===================================================== */

function injectFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  const isAdminPage = window.location.pathname.includes("/admin/");

  footer.innerHTML = isAdminPage
    ? `<p>© 2025 Gifts_and_Bows · Admin Panel</p>`
    : `
        <p>Contact: support@giftsandbows.com</p>
        <p>© 2025 Gifts_and_Bows. All rights reserved.</p>
      `;
}

/* =====================================================
   UI CONTROLS
   ===================================================== */

function toggleUserMenu() {
  const nav = document.getElementById("navLinks");
  if (nav) nav.classList.toggle("show");
}

function toggleAdminMenu() {
  const nav = document.getElementById("adminNav");
  if (nav) nav.classList.toggle("show");
}

function toggleDropdown() {
  const menu = document.getElementById("categoryDropdown");
  if (!menu) return;
  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}

/* =====================================================
   DATA LOADERS
   ===================================================== */

function loadUserCategories() {
  fetch(API_BASE + "/categories")
    .then(res => res.json())
    .then(categories => {
      const dropdown = document.getElementById("categoryDropdown");
      if (!dropdown) return;

      dropdown.innerHTML = categories.length
        ? categories
            .map(c => `<a href="products.html?category=${c.id}">${c.name}</a>`)
            .join("")
        : `<span style="padding:10px;">No categories</span>`;
    })
    .catch(() => {
      const dropdown = document.getElementById("categoryDropdown");
      if (dropdown)
        dropdown.innerHTML = `<span style="padding:10px;">Error</span>`;
    });
}

/* =====================================================
   ADMIN PAGE PROTECTION
   ===================================================== */

function protectAdminPages() {
  if (!window.location.pathname.includes("/admin/")) return;
  if (getRole() !== "ADMIN") {
    alert("Admin access required");
    logout();
  }
}

/* =====================================================
   AUTH
   ===================================================== */

function login() {
  const email = val("email");
  const password = val("password");

  if (!email || !password) {
    alert("Email & password required");
    return;
  }

  fetch(API_BASE + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.text();
    })
    .then(token => {
      localStorage.setItem("token", token);
      getRole() === "ADMIN"
        ? (window.location.href = "../admin/dashboard.html")
        : (window.location.href = "index.html");
    })
    .catch(e => alert(e.message));
}

function register() {
  fetch(API_BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: val("name"),
      email: val("email"),
      password: val("password")
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Registration failed");
      alert("Registered successfully");
      window.location.href = "login.html";
    })
    .catch(e => alert(e.message));
}

/* =====================================================
   UTIL
   ===================================================== */

function val(id) {
  return document.getElementById(id)?.value.trim();
}
