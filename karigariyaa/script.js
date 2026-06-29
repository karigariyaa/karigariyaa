// =============================================
// KARIGARIYAA -- Website JS
// =============================================

// ---- Auto-hide header on scroll, reveal when still ----
(function () {
  var header = document.querySelector('.site-header');
  var scrollTimer = null;

  window.addEventListener('scroll', function () {
    header.classList.add('nav-hidden');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      header.classList.remove('nav-hidden');
    }, 800);
  }, { passive: true });
})();

// ---- Mobile Menu ----
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');
  if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ---- Order Modal (3-step) ----
var _orderProduct = '', _orderPrice = '', _orderAmount = 0, _selectedSize = '';
var _isCartCheckout = false, _cartSnapshot = [];

function openPayment(name, price, amount, colors, preSelectedColor) {
  _orderProduct = name;
  _orderPrice   = price;
  _orderAmount  = amount;
  _selectedSize = _isCartCheckout ? 'See items' : '';
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductPrice').textContent = price;
  document.getElementById('orderForm').reset();
  document.getElementById('formError').style.display = 'none';
  document.getElementById('sizeError').style.display = 'none';
  document.getElementById('colorError').style.display = 'none';
  document.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('selected'); });
  document.getElementById('orderSizeSection').style.display = _isCartCheckout ? 'none' : '';

  // Build color buttons
  var colorOptions = document.getElementById('payColorOptions');
  var hiddenColor  = document.getElementById('custColor');
  hiddenColor.value = preSelectedColor || '';
  if (colors && colors.length) {
    colorOptions.innerHTML = colors.map(function(c) {
      var sel = c === preSelectedColor ? ' selected' : '';
      return '<button type="button" class="pay-color-btn' + sel + '" onclick="paySelectColor(this,\'' + c.replace(/'/g, '\\\'') + '\')">' + c + '</button>';
    }).join('');
  } else {
    colorOptions.innerHTML = '<button type="button" class="pay-color-btn" onclick="paySelectColor(this,\'Custom\')">Custom</button>';
  }

  goToStep(1);
  document.getElementById('paymentModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function paySelectColor(btn, color) {
  document.querySelectorAll('.pay-color-btn').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  document.getElementById('custColor').value = color;
  document.getElementById('colorError').style.display = 'none';
}

function buyNowFromCard(btn, name, price, amount) {
  var card = btn.closest('.product-card');
  var colors = card ? (card.getAttribute('data-colors') || 'Custom').split(',').map(function(c){ return c.trim(); }) : ['Custom'];
  openPayment(name, price, amount, colors, null);
}

// ---- Size Selection ----
function selectSize(btn, size) {
  document.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  _selectedSize = size;
  document.getElementById('sizeError').style.display = 'none';
}

// ---- Size Chart Modal ----
function openSizeChart() {
  document.getElementById('sizeChartModal').classList.add('open');
}
function closeSizeChart() {
  document.getElementById('sizeChartModal').classList.remove('open');
}
function handleSizeChartClick(e) {
  if (e.target === document.getElementById('sizeChartModal')) closeSizeChart();
}

function goToStep(n) {
  [1, 2, 3].forEach(function (i) {
    document.getElementById('orderStep' + i).style.display = i === n ? 'block' : 'none';
    var ind = document.getElementById('stepInd' + i);
    ind.classList.toggle('active', i <= n);
    ind.classList.toggle('done', i < n);
  });
  document.querySelector('.modal-payment-content').scrollTop = 0;
}

function proceedToPayment(e) {
  e.preventDefault();
  var color   = document.getElementById('custColor').value.trim();
  var name    = document.getElementById('custName').value.trim();
  var phone   = document.getElementById('custPhone').value.trim();
  var address = document.getElementById('custAddress').value.trim();
  var city    = document.getElementById('custCity').value.trim();
  var state   = document.getElementById('custState').value.trim();
  var pin     = document.getElementById('custPin').value.trim();
  if (!_selectedSize) {
    document.getElementById('sizeError').style.display = 'block';
    return;
  }
  if (!color) {
    document.getElementById('colorError').style.display = 'block';
    return;
  }
  if (!name || !phone || !address || !city || !state || pin.length < 6) {
    document.getElementById('formError').style.display = 'block';
    return;
  }
  document.getElementById('sizeError').style.display = 'none';
  document.getElementById('colorError').style.display = 'none';
  document.getElementById('formError').style.display = 'none';
  // Build QR with amount
  var upiData = 'upi://pay?pa=9303266338@kotak&pn=KARIGARIYAA&am=' + _orderAmount + '&tn=' + encodeURIComponent(_orderProduct);
  document.getElementById('modalQR').src =
    'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(upiData);
  goToStep(2);
}

function confirmOrder() {
  var color   = document.getElementById('custColor').value.trim();
  var name    = document.getElementById('custName').value.trim();
  var phone   = document.getElementById('custPhone').value.trim();
  var email   = document.getElementById('custEmail').value.trim();
  var address = document.getElementById('custAddress').value.trim();
  var city    = document.getElementById('custCity').value.trim();
  var state   = document.getElementById('custState').value.trim();
  var pin     = document.getElementById('custPin').value.trim();
  var fullAddr = address + ', ' + city + ', ' + state + ' - ' + pin;

  document.getElementById('confirmProduct').textContent = _orderProduct;
  document.getElementById('confirmPrice').textContent   = _orderPrice;
  document.getElementById('confirmSize').textContent    = _selectedSize;
  document.getElementById('confirmColor').textContent   = color;
  document.getElementById('confirmName').textContent    = name;
  document.getElementById('confirmPhone').textContent   = phone;
  document.getElementById('confirmAddr').textContent    = fullAddr;

  var msg;
  if (_isCartCheckout && _cartSnapshot.length > 0) {
    var itemLines = _cartSnapshot.map(function (i, n) {
      return (n + 1) + '. *' + i.name + '* (' + i.id + ')'
        + (i.size  ? ' [Size: '  + i.size  + ']' : '')
        + (i.color ? ' [Color: ' + i.color + ']' : '')
        + ' x' + i.qty + ' — ' + i.price;
    }).join('\n');
    msg = '🛍️ *New Cart Order - KARIGARIYAA*\n\n'
      + '*Items:*\n' + itemLines + '\n\n'
      + '*Total: ' + _orderPrice + '*\n\n'
      + '*Customer Details:*\n'
      + 'Name: ' + name + '\n'
      + 'Phone: ' + phone + '\n'
      + (email ? 'Email: ' + email + '\n' : '')
      + 'Address: ' + fullAddr + '\n\n'
      + '📸 *Payment screenshot is attached to this message.*\n'
      + '_Please confirm my order once payment is verified._';
    clearCart();
    _isCartCheckout = false;
  } else {
    msg = '🛍️ *New Order - KARIGARIYAA*\n\n'
      + '*Product:* ' + _orderProduct + '\n'
      + '*Amount:* ' + _orderPrice + '\n'
      + '*Size:* ' + _selectedSize + '\n'
      + '*Color:* ' + color + '\n\n'
      + '*Customer Details:*\n'
      + 'Name: ' + name + '\n'
      + 'Phone: ' + phone + '\n'
      + (email ? 'Email: ' + email + '\n' : '')
      + 'Address: ' + fullAddr + '\n\n'
      + '📸 *Payment screenshot is attached to this message.*\n'
      + '_Please confirm my order once payment is verified._';
  }

  document.getElementById('whatsappOrderLink').href =
    'https://wa.me/919303266338?text=' + encodeURIComponent(msg);

  goToStep(3);
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleModalClick(e) {
  if (e.target === document.getElementById('paymentModal')) closePayment();
}

function copyUPI() {
  copyText('9303266338@kotak', document.querySelector('.modal-upi-row .modal-copy-btn'));
}

function copyText(text, btn) {
  if (!navigator.clipboard) { return; }
  navigator.clipboard.writeText(text).then(function () {
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.background = '#2a7a4a';
    setTimeout(function () { btn.textContent = orig; btn.style.background = ''; }, 2000);
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (document.getElementById('sizeChartModal').classList.contains('open')) { closeSizeChart(); return; }
    if (document.getElementById('paymentModal').classList.contains('open')) { closePayment(); return; }
    if (document.getElementById('pdModal').classList.contains('open')) { closePdModalBtn(); return; }
    if (document.getElementById('cartDrawer').classList.contains('open')) { closeCart(); return; }
  }
});

// ---- Section Collapse / Expand ----
function toggleSection(btn) {
  var body = btn.closest('section').querySelector('.section-body');
  var icon = btn.querySelector('.toggle-icon');

  if (body.classList.contains('collapsed')) {
    // Expand
    body.style.maxHeight = body.scrollHeight + 'px';
    body.classList.remove('collapsed');
    btn.classList.remove('is-collapsed');
    icon.textContent = '-';
    // Clear inline max-height after transition so the body can grow freely
    body.addEventListener('transitionend', function clearHeight() {
      body.style.maxHeight = '';
      body.removeEventListener('transitionend', clearHeight);
    });
  } else {
    // Collapse -- snapshot height first then animate to 0
    body.style.maxHeight = body.scrollHeight + 'px';
    body.offsetHeight; // force reflow
    body.style.maxHeight = '0px';
    body.classList.add('collapsed');
    btn.classList.add('is-collapsed');
    icon.textContent = '+';
  }
}

// ---- FAQ Accordion ----
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var isOpen = btn.classList.contains('open');

  // Close all open items
  document.querySelectorAll('.faq-question.open').forEach(function (q) {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });

  // Open the clicked one (unless it was already open)
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ---- Newsletter ----
function handleSubscribe(e) {
  e.preventDefault();
  var thanks = document.getElementById('newsletterThanks');
  var input = e.target.querySelector('.newsletter-input');
  thanks.style.display = 'block';
  input.value = '';
  setTimeout(function () { thanks.style.display = 'none'; }, 4000);
}

// ---- Image Carousel ----
function _carouselSet(container, idx) {
  var imgs = container.querySelectorAll('img');
  var dots = container.querySelectorAll('.carousel-dot');
  var cur  = parseInt(container.dataset.index) || 0;
  imgs[cur].classList.remove('active');
  if (dots[cur]) dots[cur].classList.remove('active');
  imgs[idx].classList.add('active');
  if (dots[idx]) dots[idx].classList.add('active');
  container.dataset.index = idx;
}

function carouselMove(btn, dir) {
  var container = btn.closest('.product-image');
  var total     = container.querySelectorAll('img').length;
  var next      = ((parseInt(container.dataset.index) || 0) + dir + total) % total;
  _carouselSet(container, next);
}

function carouselGoto(dot, idx) {
  _carouselSet(dot.closest('.product-image'), idx);
}

// Touch-swipe support for carousels
(function () {
  var startX = 0;
  document.addEventListener('touchstart', function (e) {
    if (e.target.closest('.product-image')) startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var container = e.target.closest('.product-image');
    if (!container) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      var total = container.querySelectorAll('img').length;
      var next  = ((parseInt(container.dataset.index) || 0) + (dx < 0 ? 1 : -1) + total) % total;
      _carouselSet(container, next);
    }
  }, { passive: true });
}());

// ---- Category Filter ----
function filterCategory(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(function (card) {
    var show = cat === 'all' || card.dataset.category === cat;
    card.style.display = show ? '' : 'none';
    if (show) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  });
}

// ---- Scroll Reveal ----
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.product-card').forEach(function (el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);

  el.addEventListener('click', function (e) {
    if (e.target.closest('.btn-buy')) return;
    if (e.target.closest('.carousel-btn')) return;
    if (e.target.closest('.carousel-dot')) return;
    openProductDetail(el);
  });
});

// ---- Product Detail Modal ----
var _pdProduct = null;
var _pdSelectedSize = '';
var _pdSelectedColor = '';

function openProductDetail(card) {
  var imgs = Array.from(card.querySelectorAll('.product-image img')).map(function (i) { return i.getAttribute('src'); });
  var name = card.querySelector('.product-name').textContent;
  var id   = card.querySelector('.product-id').textContent;
  var cat  = card.querySelector('.product-category').textContent;
  var price = card.querySelector('.product-price').textContent;
  var amount = parseInt(price.replace(/[^0-9]/g, ''));
  var desc = card.querySelector('.product-description').innerHTML;

  var colors = (card.getAttribute('data-colors') || 'Customisable').split(',').map(function(c){ return c.trim(); });

  _pdProduct = { name: name, id: id, cat: cat, price: price, amount: amount, desc: desc, colors: card.getAttribute('data-colors') || 'Custom' };
  _pdSelectedSize  = '';
  _pdSelectedColor = '';

  document.getElementById('pdCategory').textContent = cat;
  document.getElementById('pdName').textContent     = name;
  document.getElementById('pdIdTag').textContent    = id;
  document.getElementById('pdPrice').textContent    = price;
  document.getElementById('pdDescBody').innerHTML = desc;

  // Build color buttons dynamically from product's data-colors
  var colorOptionsEl = document.getElementById('pdColorOptions');
  colorOptionsEl.innerHTML = colors.map(function(c) {
    return '<button class="pd-color-btn" onclick="pdSelectColor(this,\'' + c.replace(/'/g, '\\\'') + '\')">' + c + '</button>';
  }).join('');

  // Reset selections and error state
  document.getElementById('pdSelectionError').classList.remove('visible');
  document.querySelectorAll('.pd-size-btn').forEach(function (b) { b.classList.remove('selected', 'required-highlight'); });

  // Description collapsed by default
  var descBody = document.getElementById('pdDescBody');
  descBody.classList.remove('open');
  var descToggle = document.querySelector('.pd-desc-toggle .pd-desc-icon');
  if (descToggle) descToggle.textContent = '+';

  // Build thumbnails
  var thumbsEl = document.getElementById('pdThumbs');
  thumbsEl.innerHTML = '';
  imgs.forEach(function (src, i) {
    var thumb = document.createElement('img');
    thumb.src = src;
    thumb.className = 'pd-thumb' + (i === 0 ? ' active' : '');
    thumb.onclick = function () {
      document.getElementById('pdMainImg').src = src;
      thumbsEl.querySelectorAll('.pd-thumb').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    };
    thumbsEl.appendChild(thumb);
  });
  document.getElementById('pdMainImg').src = imgs[0];

  buildYmal(card);

  var overlay = document.getElementById('pdModal');
  overlay.scrollTop = 0;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function buildYmal(currentCard) {
  var category = currentCard.dataset.category;
  var allCards = Array.from(document.querySelectorAll('.product-card'));
  var sameCat  = allCards.filter(function (c) { return c !== currentCard && c.dataset.category === category; });
  var others   = allCards.filter(function (c) { return c !== currentCard && c.dataset.category !== category; });
  var pool = sameCat.concat(others).slice(0, 4);

  var grid = document.getElementById('pdYmalGrid');
  grid.innerHTML = '';
  pool.forEach(function (c) {
    var img   = c.querySelector('.product-image img').getAttribute('src');
    var pname = c.querySelector('.product-name').textContent;
    var pprice = c.querySelector('.product-price').textContent;

    var item = document.createElement('div');
    item.className = 'pd-ymal-item';
    var imgEl = document.createElement('img');
    imgEl.src = img;
    imgEl.alt = pname;
    var nameEl = document.createElement('p');
    nameEl.className = 'pd-ymal-name';
    nameEl.textContent = pname;
    var priceEl = document.createElement('p');
    priceEl.className = 'pd-ymal-price';
    priceEl.textContent = pprice;
    item.appendChild(imgEl);
    item.appendChild(nameEl);
    item.appendChild(priceEl);
    item.onclick = function () { openProductDetail(c); };
    grid.appendChild(item);
  });
}

function pdSelectSize(btn, size) {
  document.querySelectorAll('.pd-size-btn').forEach(function (b) { b.classList.remove('selected', 'required-highlight'); });
  btn.classList.add('selected');
  _pdSelectedSize = size;
  if (_pdSelectedColor) document.getElementById('pdSelectionError').classList.remove('visible');
}

function pdSelectColor(btn, color) {
  document.querySelectorAll('.pd-color-btn').forEach(function (b) { b.classList.remove('selected', 'required-highlight'); });
  btn.classList.add('selected');
  _pdSelectedColor = color;
  if (_pdSelectedSize) document.getElementById('pdSelectionError').classList.remove('visible');
}

function pdValidateSelection() {
  var errEl = document.getElementById('pdSelectionError');
  var missing = [];
  if (!_pdSelectedSize)  missing.push('Size');
  if (!_pdSelectedColor) missing.push('Colour');
  if (missing.length) {
    errEl.textContent = 'Please select a ' + missing.join(' and ') + ' to continue.';
    errEl.classList.add('visible');
    if (!_pdSelectedSize)  document.querySelectorAll('.pd-size-btn').forEach(function(b){ b.classList.add('required-highlight'); });
    if (!_pdSelectedColor) document.querySelectorAll('.pd-color-btn').forEach(function(b){ b.classList.add('required-highlight'); });
    return false;
  }
  errEl.classList.remove('visible');
  return true;
}

function pdBuyNow() {
  if (!pdValidateSelection()) return;
  var p = _pdProduct;
  var colors = (p.colors || 'Custom').split(',').map(function(c){ return c.trim(); });
  openPayment(p.name, p.price, p.amount, colors, _pdSelectedColor);
  if (_pdSelectedSize) {
    setTimeout(function () {
      document.querySelectorAll('.size-btn').forEach(function (b) {
        if (b.textContent.trim() === _pdSelectedSize) selectSize(b, _pdSelectedSize);
      });
    }, 60);
  }
}

function pdEnquire() {
  var p = _pdProduct;
  var msg = 'Hi! I am interested in *' + p.name + '* (' + p.id + ') priced at ' + p.price + '.'
    + (_pdSelectedSize  ? ' Size: '  + _pdSelectedSize  + '.' : '')
    + (_pdSelectedColor ? ' Color: ' + _pdSelectedColor + '.' : '')
    + ' Could you please share more details?';
  window.open('https://wa.me/919303266338?text=' + encodeURIComponent(msg), '_blank');
}

function pdToggleDesc(btn) {
  var body = document.getElementById('pdDescBody');
  var icon = btn.querySelector('.pd-desc-icon');
  var isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  icon.textContent = isOpen ? '+' : '-';
}

function closePdModalBtn() {
  document.getElementById('pdModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closePdModal(e) {
  if (e.target === document.getElementById('pdModal')) closePdModalBtn();
}

function pdAddToCart() {
  if (!pdValidateSelection()) return;
  var p = _pdProduct;
  cartAdd({
    name:   p.name,
    id:     p.id,
    price:  p.price,
    amount: p.amount,
    size:   _pdSelectedSize,
    color:  _pdSelectedColor,
    img:    document.getElementById('pdMainImg').src
  });
}

// ---- Cart ----
var cart = JSON.parse(localStorage.getItem('kg_cart') || '[]');

function cartSave() {
  localStorage.setItem('kg_cart', JSON.stringify(cart));
  updateCartUI();
}

function cartAdd(item) {
  var existing = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === item.name && cart[i].size === item.size && cart[i].color === item.color) {
      existing = cart[i];
      break;
    }
  }
  if (existing) {
    existing.qty = Math.min(existing.qty + 1, 10);
  } else {
    cart.push({ name: item.name, id: item.id, price: item.price, amount: item.amount, size: item.size, color: item.color, img: item.img, qty: 1 });
  }
  cartSave();
  showCartToast();
}

function cartRemove(idx) {
  cart.splice(idx, 1);
  cartSave();
}

function cartUpdateQty(idx, delta) {
  cart[idx].qty = Math.max(1, Math.min(10, cart[idx].qty + delta));
  cartSave();
}

function clearCart() {
  cart = [];
  cartSave();
}

function updateCartUI() {
  var totalAmt = 0, totalQty = 0;
  cart.forEach(function (i) { totalAmt += i.amount * i.qty; totalQty += i.qty; });

  var badge = document.getElementById('cartBadge');
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? 'flex' : 'none';

  var mobileCount = document.getElementById('mobileCartCount');
  if (mobileCount) mobileCount.textContent = totalQty;

  document.getElementById('cartCount').textContent = totalQty;
  document.getElementById('cartTotal').textContent = 'INR ' + totalAmt.toLocaleString('en-IN');

  var isEmpty = cart.length === 0;
  document.getElementById('cartEmpty').style.display  = isEmpty ? 'block' : 'none';
  document.getElementById('cartFooter').style.display = isEmpty ? 'none'  : 'block';

  renderCartItems();
}

function renderCartItems() {
  var el = document.getElementById('cartItems');
  el.innerHTML = '';
  cart.forEach(function (item, idx) {
    var div = document.createElement('div');
    div.className = 'cart-item';

    var img = document.createElement('img');
    img.className = 'cart-item-img';
    img.src = item.img;
    img.alt = item.name;

    var info = document.createElement('div');
    info.className = 'cart-item-info';

    var nameEl = document.createElement('p');
    nameEl.className = 'cart-item-name';
    nameEl.textContent = item.name;

    var metaParts = [item.id];
    if (item.size)  metaParts.push(item.size);
    if (item.color) metaParts.push(item.color);
    var metaEl = document.createElement('p');
    metaEl.className = 'cart-item-meta';
    metaEl.textContent = metaParts.join(' · ');

    var priceEl = document.createElement('p');
    priceEl.className = 'cart-item-price';
    priceEl.textContent = item.price;

    var qtyEl = document.createElement('div');
    qtyEl.className = 'cart-item-qty';
    var btnMinus = document.createElement('button');
    btnMinus.textContent = '−';
    btnMinus.onclick = (function (i) { return function () { cartUpdateQty(i, -1); }; })(idx);
    var qtySpan = document.createElement('span');
    qtySpan.textContent = item.qty;
    var btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.onclick = (function (i) { return function () { cartUpdateQty(i, 1); }; })(idx);
    qtyEl.appendChild(btnMinus);
    qtyEl.appendChild(qtySpan);
    qtyEl.appendChild(btnPlus);

    info.appendChild(nameEl);
    info.appendChild(metaEl);
    info.appendChild(priceEl);
    info.appendChild(qtyEl);

    var removeBtn = document.createElement('button');
    removeBtn.className = 'cart-item-remove';
    removeBtn.textContent = '×';
    removeBtn.onclick = (function (i) { return function () { cartRemove(i); }; })(idx);

    div.appendChild(img);
    div.appendChild(info);
    div.appendChild(removeBtn);
    el.appendChild(div);
  });
}

function openCart() {
  updateCartUI();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  if (!document.getElementById('pdModal').classList.contains('open') &&
      !document.getElementById('paymentModal').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function showCartToast() {
  var t = document.getElementById('cartToast');
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2200);
}

function checkoutCart() {
  if (cart.length === 0) return;
  var total = cart.reduce(function (s, i) { return s + i.amount * i.qty; }, 0);
  var totalStr = 'INR ' + total.toLocaleString('en-IN');
  _isCartCheckout = true;
  _cartSnapshot = cart.map(function (i) { return { name: i.name, id: i.id, price: i.price, amount: i.amount, size: i.size, color: i.color, qty: i.qty }; });
  closeCart();
  openPayment('Cart Order (' + cart.length + ' item' + (cart.length > 1 ? 's' : '') + ')', totalStr, total);
}

// Initialise cart UI on page load
updateCartUI();
