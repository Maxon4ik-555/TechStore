'use strict';


let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity += 1;
      found = true;
      break;
    }
  }
  if (!found) {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
}

function removeFromCart(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity -= 1;
      if (cart[i].quantity <= 0) {
        cart.splice(i, 1);
      }
      saveCart();
      return;
    }
  }
}

function removeAllFromCart(productId) {
  let newCart = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;
  saveCart();
}

let productData = {
  1: { name: "Samsung Galaxy S24 Ultra", price: 99990 },
  2: { name: "MacBook Pro 16\"", price: 189990 },
  3: { name: "Sony WH-1000XM5", price: 24990 },
  4: { name: "Apple Watch Ultra 2", price: 84990 },
  5: { name: "PlayStation 5 Pro", price: 69990 },
  6: { name: "Epson EcoTank L8180", price: 42490 },
  7: { name: "DJI Mini 4 Pro", price: 114990 },
  8: { name: "Samsung Odyssey G9", price: 149990 }
};

function updateShopButtons() {
  let buttons = document.querySelectorAll('.add-to-cart');
  for (let i = 0; i < buttons.length; i++) {
    let btn = buttons[i];
    let id = parseInt(btn.getAttribute('data-id'), 10);
    if (isNaN(id)) continue;

    let inCart = false;
    let qty = 0;
    for (let j = 0; j < cart.length; j++) {
      if (cart[j].id === id) {
        inCart = true;
        qty = cart[j].quantity;
        break;
      }
    }

    if (inCart) {
      btn.textContent = 'В корзине (' + qty + ')';
    } else {
      btn.textContent = 'Добавить';
    }
  }
}

function updateProfileView() {
  let total = 0;
  let hasItems = false;

  for (let id = 1; id <= 8; id++) {
    let el = document.getElementById('cart-item-' + id);
    if (!el) continue;

    let inCart = false;
    let qty = 0;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        inCart = true;
        qty = cart[i].quantity;
        break;
      }
    }

    if (inCart && qty > 0) {
      let price = productData[id].price;
      total += price * qty;

      let qtyDisplays = el.querySelectorAll('.display-qty, .item-qty');
      for (let k = 0; k < qtyDisplays.length; k++) {
        qtyDisplays[k].textContent = qty;
      }

      let priceEl = el.querySelector('.item-price');
      if (priceEl) {
        priceEl.textContent = formatPrice(price);
      }

      el.classList.remove('hidden');
      hasItems = true;
    } else {
      el.classList.add('hidden');
    }
  }

  let emptyEl = document.getElementById('empty-cart');
  let totalEl = document.getElementById('cart-total');

  if (emptyEl) {
    emptyEl.style.display = hasItems ? 'none' : 'block';
  }

  if (totalEl) {
    totalEl.textContent = hasItems ? 'Итого: ' + formatPrice(total) : '';
  }
}

function showPage(pageName) {
  let pages = document.querySelectorAll('.page');
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }

  let target = document.getElementById(pageName + '-page');
  if (target) {
    target.classList.add('active');
  }

  let navLinks = document.querySelectorAll('nav a');
  for (let j = 0; j < navLinks.length; j++) {
    navLinks[j].classList.remove('active');
  }

  let activeLink = document.querySelector('nav a[data-page="' + pageName + '"]');
  if (activeLink) {
    activeLink.classList.add('active');
  }

  if (pageName === 'profile') {
    updateProfileView();
  } else if (pageName === 'shop') {
    updateShopButtons();
  }
}

function initFAQ() {
  document.addEventListener('click', function(e) {
    let question = null;
    let el = e.target;
    while (el && el !== document) {
      if (el.classList && el.classList.contains('faq-question')) {
        question = el;
        break;
      }
      el = el.parentNode;
    }

    if (question) {
      let answer = question.nextElementSibling;
      if (!answer) return;

      let arrow = question.querySelector('span:last-child');
      if (!arrow) return;

      if (answer.classList.contains('show')) {
        answer.classList.remove('show');
        arrow.textContent = '▼';
      } else {
        answer.classList.add('show');
        arrow.textContent = '▲';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initFAQ();

  let path = window.location.pathname;
  let filename = path.substring(path.lastIndexOf('/') + 1).toLowerCase();

  if (filename === 'profile.html') {
    showPage('profile');
  } else if (filename === 'support.html') {
    showPage('support');
  } else {
    showPage('shop');
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
      e.preventDefault();
      let page = e.target.getAttribute('data-page');
      if (page === 'shop') {
        window.location.href = 'index.html';
      } else if (page === 'profile') {
        window.location.href = 'profile.html';
      } else if (page === 'support') {
        window.location.href = 'support.html';
      }
      return;
    }

    if (e.target.classList.contains('add-to-cart')) {
      let id = parseInt(e.target.getAttribute('data-id'), 10);
      if (!isNaN(id)) {
        addToCart(id);
        updateShopButtons();
      }
      return;
    }

    if (e.target.classList.contains('cart-add')) {
      let id = parseInt(e.target.getAttribute('data-id'), 10);
      if (!isNaN(id)) {
        addToCart(id);
        updateProfileView();
      }
      return;
    }

    if (e.target.classList.contains('cart-remove')) {
      let id = parseInt(e.target.getAttribute('data-id'), 10);
      if (!isNaN(id)) {
        removeFromCart(id);
        updateProfileView();
      }
      return;
    }

    if (e.target.classList.contains('cart-remove-all')) {
      let id = parseInt(e.target.getAttribute('data-id'), 10);
      if (!isNaN(id)) {
        removeAllFromCart(id);
        updateProfileView();
      }
      return;
    }
  });


  let form = document.getElementById('support-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Спасибо! Ваше сообщение отправлено.');
      form.reset();
    });
  }
});