/* =====================================================
   ADMIN NAVBAR SCRIPT (PRODUCTION SAFE)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  injectAdminNavbar();
});

/* =====================================================
   INJECT ADMIN NAVBAR
   ===================================================== */

function injectAdminNavbar() {

  // ✅ Only inject on admin pages
  if (!window.location.pathname.includes("/admin/")) return;

  const header = document.querySelector("header");
  if (!header) return;

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

  highlightActiveLink();
}

/* =====================================================
   MOBILE MENU
   ===================================================== */

function toggleAdminMenu() {
  const nav = document.getElementById("adminNav");
  if (nav) nav.classList.toggle("show");
}

/* =====================================================
   ACTIVE LINK HIGHLIGHT
   ===================================================== */

function highlightActiveLink() {
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".admin-nav a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}
