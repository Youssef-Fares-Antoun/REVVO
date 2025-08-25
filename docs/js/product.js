// =====================
// PRODUCT DATA
// =====================
const products = {
  1: {
    name: "Porsche 911 Tee",
    price: 850,
    description:
      "A premium Porsche 911 inspired tee made from high-quality cotton. Perfect for motorsport fans who love performance and style.",
    images: ["/images/911Front.png", "/images/911Back.png"]
  },
  2: {
    name: "Ferrari SF90 Tee",
    price: 950,
    description:
      "Exclusive Ferrari SF90 tee crafted with precision stitching and premium cotton. A must-have for Ferrari enthusiasts.",
    images: ["/images/SF90Front.png", "/images/SF90Back.png"]
  },
  3: {
    name: "McLaren P1 Tee",
    price: 900,
    description:
      "A premium McLaren P1 inspired tee made from high-quality cotton. Perfect for motorsport fans who appreciate cutting-edge design.",
    images: ["/images/P1Front.png", "/images/P1Back.png"]
  },
  4: {
    name: "McLaren Senna Tee",
    price: 850,
    description:
      "A premium McLaren Senna inspired tee made from high-quality cotton. Perfect for motorsport fans who love speed and British design.",
    images: ["/images/SennaFront.png", "/images/SennaBack.png"]
  }
};

// =====================
// HELPERS
// =====================
function toRootPath(src) {
  try {
    const u = new URL(src, window.location.origin);
    return u.pathname;
  } catch (e) {
    if (src.startsWith("/")) return src;
    return "/" + src.replace(/^(\.\/|(\.\.\/)+)/, "");
  }
}

// LocalStorage helpers
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================
// RENDER PRODUCT BASED ON ID
// =====================
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const product = products[productId];

if (product) {
  const container = document.getElementById("product-details");
  if (container) {
    container.innerHTML = `
      <div class="product-container">
        <div class="image-gallery">
          <img id="mainImage" src="${product.images[0]}" alt="${product.name}">
          <div class="thumbnail-row">
            ${product.images
              .map((img) => `<img src="${img}" alt="thumb" onclick="changeImage('${img}')">`)
              .join("")}
          </div>
        </div>
        <div class="product-info">
          <h1>${product.name}</h1>
          <p class="price">LE ${product.price}.00</p>
          <p>${product.description}</p>

          <!-- Size Selector -->
          <div class="option-group">
            <label for="size">Size:</label>
            <select id="size" name="size">
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="X-Large">X-Large</option>
            </select>
          </div>

          <!-- Quantity Selector -->
          <div class="option-group">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" value="1" min="1">
          </div>

          <!-- Buttons -->
          <button onclick="addToCart('${product.name}', ${product.price}, document.getElementById('mainImage').src)">🛒 Add to Cart</button>
          <button onclick="buyNow('${product.name}', ${product.price}, document.getElementById('mainImage').src)">⚡ Buy Now</button>
        </div>
      </div>

      <!-- Popup Modal -->
      <div id="cartModal" class="cart-modal">
        <div class="cart-modal-content">
          <span id="closeModal">&times;</span>
          <p id="cartModalMessage"></p>
          <div class="modal-buttons">
            <button id="continueBtn">Continue Shopping</button>
            <button id="goCartBtn">Go to Cart</button>
          </div>
        </div>
      </div>
    `;
  }
} else {
  const container = document.getElementById("product-details");
  if (container) container.innerHTML = "<p>Product not found.</p>";
}

// =====================
// IMAGE SWITCHER
// =====================
function changeImage(newSrc) {
  const mainImg = document.getElementById("mainImage");
  if (mainImg) mainImg.src = newSrc;
}

// =====================
// ADD TO CART / BUY NOW
// =====================
function addToCart(name, price, image) {
  const sizeEl = document.getElementById("size");
  const qtyEl = document.getElementById("quantity");
  const size = sizeEl ? sizeEl.value : "Default";
  const quantity = qtyEl ? Math.max(1, parseInt(qtyEl.value) || 1) : 1;

  const imgPath = toRootPath(image);

  let cart = getCart();
  const existing = cart.find((i) => i.name === name && i.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, size, quantity, image: imgPath });
  }

  saveCart(cart);

  // Show popup modal (centered)
  const modal = document.getElementById("cartModal");
  const msg = document.getElementById("cartModalMessage");
  if (modal && msg) {
    msg.textContent = `${quantity} × ${name} (Size: ${size}) added to cart!`;
    modal.style.display = "flex";
  }
}

function buyNow(name, price, image) {
  addToCart(name, price, image);
  window.location.href = "/checkout.html";
}

// =====================
// MODAL BEHAVIOR
// =====================
document.addEventListener("click", function (e) {
  const modal = document.getElementById("cartModal");
  const closeBtn = document.getElementById("closeModal");
  if (!modal) return;

  if (e.target === modal || e.target === closeBtn) {
    modal.style.display = "none";
  }
});

// =====================
// BUTTON ACTIONS
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.getElementById("continueBtn");
  const goCartBtn = document.getElementById("goCartBtn");

  if (continueBtn) {
    continueBtn.style.background = "#145214";
    continueBtn.style.color = "#fff";
    continueBtn.style.padding = "10px 15px";
    continueBtn.style.marginRight = "10px";
    continueBtn.style.border = "none";
    continueBtn.style.cursor = "pointer";
    continueBtn.style.borderRadius = "5px";

    continueBtn.onmouseover = () => (continueBtn.style.background = "#0f3d0f");
    continueBtn.onmouseout = () => (continueBtn.style.background = "#145214");

    continueBtn.onclick = () => {
      document.getElementById("cartModal").style.display = "none";
    };
  }

  if (goCartBtn) {
    goCartBtn.style.background = "#222";
    goCartBtn.style.color = "#fff";
    goCartBtn.style.padding = "10px 15px";
    goCartBtn.style.border = "none";
    goCartBtn.style.cursor = "pointer";
    goCartBtn.style.borderRadius = "5px";

    goCartBtn.onmouseover = () => (goCartBtn.style.background = "#000");
    goCartBtn.onmouseout = () => (goCartBtn.style.background = "#222");

    goCartBtn.onclick = () => {
      window.location.href = "/cart.html";
    };
  }
});
