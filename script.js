const TAX_RATE = 0.06;

const menuData = [
  { id: "coffee", name: "Coffee", price: 4.50, desc: "Fresh brewed coffee" },
  { id: "latte", name: "Latte", price: 6.50, desc: "Creamy milk + espresso" },
  { id: "croissant", name: "Croissant", price: 5.00, desc: "Buttery & flaky pastry" },
  { id: "cake", name: "Cake Slice", price: 7.00, desc: "Sweet dessert slice" },
  { id: "tea", name: "Tea", price: 3.50, desc: "Warm calming tea" },
  { id: "sandwich", name: "Sandwich", price: 8.50, desc: "Quick lunch snack" },
];

let order = {}; // { coffee: 2, latte: 1 ... }

const menuItemsEl = document.getElementById("menuItems");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearBtn = document.getElementById("clearBtn");
const savedNote = document.getElementById("savedNote");

const modal = document.getElementById("modal");
const orderDetails = document.getElementById("orderDetails");
const modalSubtotal = document.getElementById("modalSubtotal");
const modalTax = document.getElementById("modalTax");
const modalTotal = document.getElementById("modalTotal");
const closeModalBtn = document.getElementById("closeModalBtn");

// Load saved order
function loadOrder() {
  const saved = localStorage.getItem("lastCafeOrder");
  if (saved) {
    order = JSON.parse(saved);
    savedNote.textContent = "✅ Loaded your last saved order.";
  } else {
    savedNote.textContent = "No saved order yet.";
  }
}

// Save order to localStorage
function saveOrder() {
  localStorage.setItem("lastCafeOrder", JSON.stringify(order));
  savedNote.textContent = "💾 Order saved!";
}

// Render menu
function renderMenu() {
  menuItemsEl.innerHTML = "";

  menuData.forEach(item => {
    const qty = order[item.id] || 0;

    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>${item.desc} • <strong>$${item.price.toFixed(2)}</strong></p>
      </div>

      <div class="quantity-control">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
        <span class="qty" id="qty-${item.id}">${qty}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
      </div>
    `;

    menuItemsEl.appendChild(card);
  });
}

// Calculate totals
function calculateTotals() {
  let subtotal = 0;

  for (const item of menuData) {
    const qty = order[item.id] || 0;
    subtotal += qty * item.price;
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  return { subtotal, tax, total };
}

// Update quantity
function updateQuantity(itemId, change) {
  const currentQty = order[itemId] || 0;
  const newQty = currentQty + change;

  if (newQty <= 0) {
    delete order[itemId];
  } else {
    order[itemId] = newQty;
  }

  renderMenu();
  calculateTotals();
  saveOrder();
}

// Checkout popup
function checkout() {
  const { subtotal, tax, total } = calculateTotals();

  if (subtotal === 0) {
    alert("Your cart is empty 😅 Add something first!");
    return;
  }

  orderDetails.innerHTML = "";

  menuData.forEach(item => {
    const qty = order[item.id] || 0;
    if (qty > 0) {
      const line = document.createElement("div");
      line.className = "order-item";
      line.innerHTML = `
        <span>${item.name} x ${qty}</span>
        <span>$${(qty * item.price).toFixed(2)}</span>
      `;
      orderDetails.appendChild(line);
    }
  });

  modalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  modalTax.textContent = `$${tax.toFixed(2)}`;
  modalTotal.textContent = `$${total.toFixed(2)}`;

  modal.classList.remove("hidden");
}

// Clear order
function clearOrder() {
  order = {};
  localStorage.removeItem("lastCafeOrder");
  renderMenu();
  calculateTotals();
  savedNote.textContent = "🗑️ Order cleared.";
}

// Close modal
function closeModal() {
  modal.classList.add("hidden");
}

// Event Listeners
menuItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "increase") updateQuantity(id, 1);
  if (action === "decrease") updateQuantity(id, -1);
});

checkoutBtn.addEventListener("click", checkout);
clearBtn.addEventListener("click", clearOrder);
closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Init
loadOrder();
renderMenu();
calculateTotals();
