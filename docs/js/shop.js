// =====================
// SHOP.JS
// =====================

// ---- Add to Cart ----
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ✅ Check if item already exists
  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1; // increase quantity if same product
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount(); // ✅ keep cart count updated
  showCartModal();
}

// ---- Update Cart Count ----
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

// ---- Cart Modal ----
function showCartModal() {
  const modal = document.getElementById("cartModal");
  modal.style.display = "flex";

  // Close when clicking "Continue Shopping"
  document.getElementById("continueShoppingBtn").onclick = () => {
    modal.style.display = "none";
  };

  // Go to Cart page when clicking "View Cart"
  document.getElementById("viewCartBtn").onclick = () => {
    window.location.href = "cart.html";
  };

  // Close modal when clicking outside the modal content
  window.addEventListener("click", function outsideClick(e) {
    if (e.target === modal) {
      modal.style.display = "none";
      window.removeEventListener("click", outsideClick); // Remove listener after closing
    }
  });
}

// ---- Product Filtering ----
function filterProducts() {
  const categoryEl = document.querySelector("#categoryFilter .active");
  const brandEl = document.querySelector("#brandFilter .active");
  const category = categoryEl ? categoryEl.dataset.category : "all";
  const brand = brandEl ? brandEl.dataset.brand : "all";
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  document.querySelectorAll("#productGrid .card").forEach(card => {
    const cardCategory = card.dataset.category;
    const cardBrand = card.dataset.brand;
    const cardName = card.querySelector("h4").innerText.toLowerCase();

    let show =
      (category === "all" || category === cardCategory) &&
      (brand === "all" || brand === cardBrand) &&
      cardName.includes(searchTerm);

    card.style.display = show ? "block" : "none";
  });
}

// ---- Sorting ----
function sortProducts() {
  const sortValue = document.getElementById("sortSelect").value;
  const grid = document.getElementById("productGrid");
  const cards = Array.from(grid.children);

  cards.sort((a, b) => {
    const priceA = parseInt(a.dataset.price);
    const priceB = parseInt(b.dataset.price);

    if (sortValue === "low-high") return priceA - priceB;
    if (sortValue === "high-low") return priceB - priceA;
    return 0;
  });

  cards.forEach(card => grid.appendChild(card));
}

// ---- Sidebar Click Handling ----
document.querySelectorAll("#categoryFilter li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelectorAll("#categoryFilter li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");
    filterProducts();
  });
});

document.querySelectorAll("#brandFilter li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelectorAll("#brandFilter li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");
    filterProducts();
  });
});

// ---- Search ----
document.getElementById("searchInput").addEventListener("input", filterProducts);

// ---- Toggle Search Bar ----
document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.getElementById("searchToggle"); // search icon
  const searchBar = document.getElementById("searchBar");       // container holding input
  const searchInput = document.getElementById("searchInput");   // input field

  if (searchToggle) {
    searchToggle.addEventListener("click", e => {
      e.preventDefault();
      searchBar.classList.toggle("show");

      if (searchBar.classList.contains("show")) {
        searchInput.focus();
      }
    });

    // Close search bar if clicked outside
    document.addEventListener("click", e => {
      if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
        searchBar.classList.remove("show");
      }
    });

    // Allow pressing ESC to close search bar
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        searchBar.classList.remove("show");
      }
    });
  }

  // ---- Brand Pre-Selection from URL ----
  const urlParams = new URLSearchParams(window.location.search);
  const brandParam = urlParams.get("brand");

  if (brandParam) {
    const brandItem = document.querySelector(`#brandFilter li[data-brand="${brandParam}"]`);
    if (brandItem) {
      document.querySelectorAll("#brandFilter li").forEach(el => el.classList.remove("active"));
      brandItem.classList.add("active");
      filterProducts();
    }
  }

  // ---- Sort Select ----
  document.getElementById("sortSelect").addEventListener("change", sortProducts);

  // ✅ Initialize cart count on page load
  updateCartCount();
});
