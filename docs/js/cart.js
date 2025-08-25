// Get cart items from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cart container
let cartContainer = document.getElementById('cartItems');

// Clear existing content
cartContainer.innerHTML = "";

// Render each cart item
cart.forEach(item => {
  // Create item container
  let itemDiv = document.createElement('div');
  itemDiv.classList.add('cart-item');

  // Make sure image path is correct relative to cart.html
  // If images are in /images/ folder at root:
  let imgPath = item.image;
  if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
    imgPath = imgPath.replace(/^(\.\.\/)+/, ''); // Remove any '../' from relative paths
    imgPath = 'images/' + imgPath.split('/').pop(); // Use only the filename
  }

  // Set inner HTML
  itemDiv.innerHTML = `
    <img src="${imgPath}" alt="${item.name}" class="cart-item-image">
    <div class="cart-item-details">
      <p class="cart-item-name">${item.name}</p>
      <p class="cart-item-price">LE ${item.price}</p>
      <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
    </div>
  `;

  cartContainer.appendChild(itemDiv);
});
