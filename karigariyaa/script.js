// =============================================
// KARIGARIYAA -- Website JS
// =============================================

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

function openPayment(name, price, amount) {
  _orderProduct = name;
  _orderPrice   = price;
  _orderAmount  = amount;
  _selectedSize = '';
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductPrice').textContent = price;
  document.getElementById('orderForm').reset();
  document.getElementById('formError').style.display = 'none';
  document.getElementById('sizeError').style.display = 'none';
  document.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('selected'); });
  goToStep(1);
  document.getElementById('paymentModal').classList.add('open');
  document.body.style.overflow = 'hidden';
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
  if (!color || !name || !phone || !address || !city || !state || pin.length < 6) {
    document.getElementById('formError').style.display = 'block';
    return;
  }
  document.getElementById('sizeError').style.display = 'none';
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

  var msg = '🛍️ *New Order - KARIGARIYAA*\n\n'
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
    closeSizeChart();
    closePayment();
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
});
