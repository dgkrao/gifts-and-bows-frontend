/* =====================================================
   ADMIN NAVBAR ONLY
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  injectAdminNavbar();
});

/* =====================================================
   ADMIN NAVBAR
   ===================================================== */

function injectAdminNavbar() {
  const header = document.querySelector("header");
  if (!header) return;

  header.innerHTML = `
    <div class="admin-navbar">
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
    </div>
  `;
}

/* =====================================================
   MOBILE MENU
   ===================================================== */

function toggleAdminMenu() {
  const nav = document.getElementById("adminNav");
  if (nav) nav.classList.toggle("show");
}
