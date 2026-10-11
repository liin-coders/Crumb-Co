/* ============ Crumb & Co. — lightweight vanilla JS ============ */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = n => '₹' + Number(n).toLocaleString('en-IN');
  const byId = {}; ITEMS.forEach(i => byId[i.id] = i);
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- state ---------- */
  let cart = load('cc_cart', {});
  let wish = load('cc_wish', []);
  Object.keys(cart).forEach(k => { if (!byId[k] || !(cart[k] > 0)) delete cart[k]; });
  wish = wish.filter(id => byId[id]);

  /* ---------- icons ---------- */
  const IC = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 4.5 6.3 4.5c2.1 0 3.9 1.2 5.7 3.3 1.8-2.1 3.6-3.3 5.7-3.3 3.7 0 5.4 3.9 3.9 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1900);
  }

  /* ---------- templates ---------- */
  const imgTag = i => `<img src="${i.img}" alt="${i.name}" loading="lazy" draggable="false" onerror="imgErr(this)">`;
  const wishBtn = id => `<button class="wish" data-wish="${id}" aria-label="Add to wishlist" aria-pressed="false">${IC.heart}</button>`;
  const addBtn = id => `<button class="add" data-add="${id}" aria-label="Add to cart">${IC.bag}</button>`;

  const card = i => `<article class="card"><div class="card-img">${imgTag(i)}${wishBtn(i.id)}<span class="tag">${i.cat}</span></div>
    <div class="card-body"><h3>${i.name}</h3><p>${i.desc}</p><div class="card-foot"><span class="price">${money(i.price)}</span>${addBtn(i.id)}</div></div></article>`;

  const pcard = (i, n) => `<article class="pcard ${n === 0 ? 'big' : ''}"><div class="pc-img">${imgTag(i)}${wishBtn(i.id)}<span class="pc-no">0${n + 1}</span></div>
    <div class="pc-body"><div class="pc-meta"><span>${i.cat}</span><span>★ ${i.rating}</span></div><h3>${i.name}</h3><p>${i.desc}</p>
    <div class="card-foot"><span class="price">${money(i.price)}</span>${addBtn(i.id)}</div></div></article>`;

  const cake = i => `<article class="cake"><div class="cake-img">${imgTag(i)}</div><div class="cake-body">
    <div class="veg-row"><span class="vm ${i.veg ? '' : 'nv'}" title="${i.veg ? 'Veg' : 'Contains egg'}"></span><small>${i.veg ? 'Veg' : 'Non-Veg'}</small></div>
    <h3>${i.name}</h3><div class="card-foot"><span class="price">${money(i.price)}</span>${addBtn(i.id)}</div></div></article>`;

  /* ---------- render static sections ---------- */
  $('#productGrid').innerHTML = FEATURED.map((id, n) => pcard(byId[id], n)).join('');
  $('#collections').innerHTML = COLLECTIONS.map((c, n) => `<div class="col-block ${n % 2 ? 'rev' : ''}">
    <div class="col-head"><div class="col-info"><span class="col-no">0${n + 1}</span><h3>${c.name}</h3><p>${c.tag}</p><span class="chip">${c.ids.length} items</span></div>
    <div class="col-pic"><img src="${c.img}" alt="${c.name}" loading="lazy" draggable="false" onerror="imgErr(this)"></div></div>
    <div class="grid4">${c.ids.map(id => card(byId[id])).join('')}</div></div>`).join('');
  $('#cakeGrid').innerHTML = CAKES.map(id => cake(byId[id])).join('');
  $('#promoTrack').innerHTML = PROMOS.map(p => `<div class="ticket"><div class="t-main"><small>Special Offer</small><b>${p.big}</b><span>${p.sub}</span></div>
    <div class="t-code"><div><em>Code</em><button data-copy="${p.code}" aria-label="Copy code ${p.code}">${p.code}</button></div></div></div>`).join('');
  $('#faqList').innerHTML = FAQS.map((f, n) => `<div class="faq"><button aria-expanded="false"><span class="n">${n + 1}</span><span class="q">${f[0]}</span><span class="pm">${IC.plus}</span></button>
    <div class="a"><p>${f[1]}</p></div></div>`).join('');
  $('#ctaPics').insertAdjacentHTML('afterbegin', CTA_IMAGES.map((s, n) => `<img src="${s}" alt="Bakery favourites ${n + 1}" draggable="false" class="${n === 0 ? 'on' : ''}" onerror="imgErr(this)">`).join(''));
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- wishlist / cart logic ---------- */
  function toggleWish(id) {
    const i = wish.indexOf(id);
    if (i > -1) { wish.splice(i, 1); toast('Removed from wishlist'); }
    else { wish.push(id); toast('Added to wishlist'); }
    save('cc_wish', wish); sync();
  }
  function addCart(id, btn) {
    cart[id] = (cart[id] || 0) + 1;
    save('cc_cart', cart); toast(byId[id].name + ' added to cart'); sync();
    if (btn) { btn.classList.add('done'); setTimeout(() => btn.classList.remove('done'), 900); }
  }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = q;
    save('cc_cart', cart); sync();
  }
  function totals() {
    const sub = Object.keys(cart).reduce((s, id) => s + byId[id].price * cart[id], 0);
    const del = sub === 0 ? 0 : (sub >= 499 ? 0 : 49);
    return { sub, del, total: sub + del };
  }

  function renderWish() {
    $('#wishCount').textContent = wish.length ? `(${wish.length})` : '';
    $('#wishBody').innerHTML = wish.length ? wish.map(id => { const i = byId[id]; return `<div class="row-i"><img src="${i.img}" alt="${i.name}" onerror="imgErr(this)">
      <div class="inf"><h4>${i.name}</h4><small>${money(i.price)}</small><br><button class="mini-add" data-add="${id}">Add to cart</button></div>
      <button class="rm" data-wish="${id}" aria-label="Remove from wishlist">${IC.trash}</button></div>`; }).join('')
      : `<div class="empty"><div>${IC.heart}</div><b>Your wishlist is empty</b>Tap the heart on any treat to save it here.</div>`;
  }
  function renderCart() {
    const ids = Object.keys(cart), count = ids.reduce((s, id) => s + cart[id], 0);
    $('#cartCount').textContent = count ? `(${count})` : '';
    $('#cartBody').innerHTML = ids.length ? ids.map(id => { const i = byId[id]; return `<div class="row-i"><img src="${i.img}" alt="${i.name}" onerror="imgErr(this)">
      <div class="inf"><h4>${i.name}</h4><small>${money(i.price)} each</small><br>
      <div class="qty"><button data-dec="${id}" aria-label="Decrease">${IC.minus}</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Increase">${IC.plus}</button></div></div>
      <div style="text-align:right"><b style="font-family:var(--serif)">${money(i.price * cart[id])}</b><br><button class="rm" data-rm="${id}" aria-label="Remove" style="margin-top:6px">${IC.trash}</button></div></div>`; }).join('')
      : `<div class="empty"><div>${IC.bag}</div><b>Your cart is empty</b>Add something delicious to get started.</div>`;
    const t = totals();
    if (!ids.length) { $('#cartFoot').innerHTML = `<button class="btn btn-fill" data-close>Start Shopping</button>`; return; }
    const left = Math.max(0, 499 - t.sub);
    $('#cartFoot').innerHTML = `<div class="free">${left ? `Add <b>${money(left)}</b> more for free delivery` : '🎉 You unlocked free delivery'}<div class="bar"><i style="width:${Math.min(100, t.sub / 499 * 100)}%"></i></div></div>
      <div class="sum"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div class="sum"><span>Delivery</span><span>${t.del ? money(t.del) : 'Free'}</span></div>
      <div class="sum t"><span>Total</span><span>${money(t.total)}</span></div>
      <a href="checkout.html" class="btn btn-fill">Proceed to Checkout ${IC.arrow}</a>`;
  }
  function sync() {
    renderWish(); renderCart();
    $$('[data-wish]').forEach(b => {
      if (b.classList.contains('rm')) return;
      const on = wish.includes(b.dataset.wish);
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
    });
    $('#wishBtn').classList.toggle('has', wish.length > 0);
    $('#cartDot').classList.toggle('on', Object.keys(cart).length > 0);
    if ($('#searchInput').value.trim()) runSearch();
  }

  /* ---------- drawers ---------- */
  function openDrawer(id) {
    $$('.drawer').forEach(d => d.classList.toggle('open', d.id === id));
    $('#overlay').classList.add('show'); document.body.classList.add('lock');
  }
  function closeDrawers() {
    $$('.drawer').forEach(d => d.classList.remove('open'));
    $('#overlay').classList.remove('show'); document.body.classList.remove('lock');
  }

  /* ---------- global click delegation ---------- */
  document.addEventListener('click', e => {
    const inSearch = !!e.target.closest('#searchBox,#searchToggle');
    const t = e.target.closest('[data-wish],[data-add],[data-inc],[data-dec],[data-rm],[data-open],[data-close],[data-copy]');
    if (t) {
      const d = t.dataset;
      if (d.wish) toggleWish(d.wish);
      else if (d.add) addCart(d.add, t);
      else if (d.inc) setQty(d.inc, (cart[d.inc] || 0) + 1);
      else if (d.dec) setQty(d.dec, (cart[d.dec] || 0) - 1);
      else if (d.rm) { setQty(d.rm, 0); toast('Removed from cart'); }
      else if (d.open) openDrawer(d.open);
      else if (t.hasAttribute('data-close')) closeDrawers();
      else if (d.copy) {
        (navigator.clipboard ? navigator.clipboard.writeText(d.copy) : Promise.reject()).then(() => toast('Code ' + d.copy + ' copied'), () => toast('Code: ' + d.copy));
      }
    }
    if (!inSearch) $('#results').classList.remove('show');
  });
  $('#overlay').addEventListener('click', closeDrawers);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawers(); closeMenu(); $('#results').classList.remove('show'); } });

  /* ---------- header behaviour ---------- */
  const hdr = $('#hdr');
  function onScroll() {
    const s = window.scrollY > 70;
    hdr.classList.toggle('scrolled', s);
    if (!s) hdr.classList.remove('search-open');
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#searchToggle').addEventListener('click', () => { hdr.classList.toggle('search-open'); if (hdr.classList.contains('search-open')) $('#searchInput').focus(); });

  function closeMenu() { document.body.classList.remove('menu-open'); document.body.classList.remove('lock'); $('#burger').innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>'; }
  $('#burger').addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    document.body.classList.toggle('lock', open);
    $('#burger').innerHTML = open ? '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>';
  });
  $$('#nav a').forEach(a => a.addEventListener('click', closeMenu));

  /* active nav link by section */
  const links = $$('#nav a');
  const secIds = ['home', 'about', 'products', 'cta', 'collection', 'cakes', 'contact'];
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  secIds.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });

  /* ---------- search ---------- */
  function runSearch() {
    const q = $('#searchInput').value.trim().toLowerCase(), box = $('#results');
    if (!q) { box.classList.remove('show'); return; }
    const hits = ITEMS.filter(i => (i.name + ' ' + i.cat + ' ' + i.desc).toLowerCase().includes(q)).slice(0, 6);
    box.innerHTML = hits.length ? hits.map(i => `<div class="res"><img src="${i.img}" alt="" onerror="imgErr(this)"><div><b>${i.name}</b><small>${i.cat} · ${money(i.price)}</small></div>${addBtn(i.id)}</div>`).join('')
      : '<div class="res-empty">No treats found. Try "cake" or "croissant".</div>';
    box.classList.add('show');
  }
  $('#searchInput').addEventListener('input', runSearch);
  $('#searchInput').addEventListener('focus', runSearch);

  /* ---------- dots helper ---------- */
  function buildDots(box, n, onClick) {
    box.innerHTML = '';
    for (let k = 0; k < n; k++) { const b = document.createElement('button'); b.setAttribute('aria-label', 'Go to ' + (k + 1)); b.addEventListener('click', () => onClick(k)); box.appendChild(b); }
    return idx => Array.from(box.children).forEach((b, k) => b.classList.toggle('active', k === idx));
  }

  /* ---------- hero slider: dots + drag + swipe + trackpad ---------- */
  (function () {
    const root = $('#hero'), track = $('.hero-track', root), slides = $$('.slide', root);
    let i = 0, startX = 0, dx = 0, down = false, moved = false, timer, lock = false;
    const mark = buildDots($('#heroDots'), slides.length, k => { go(k); play(); });
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transition = 'transform .95s cubic-bezier(.7,0,.2,1)';
      track.style.transform = `translateX(${-i * 100}%)`;
      slides.forEach((s, k) => s.classList.toggle('active', k === i)); mark(i);
    }
    function play() { clearInterval(timer); timer = setInterval(() => { if (!down) go(i + 1); }, 6500); }
    root.addEventListener('pointerdown', e => { if (e.button > 0) return; down = true; moved = false; startX = e.clientX; dx = 0; });
    root.addEventListener('pointermove', e => {
      if (!down) return; dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 8) { moved = true; track.style.transition = 'none'; try { root.setPointerCapture(e.pointerId); } catch (x) {} }
      if (moved) track.style.transform = `translateX(calc(${-i * 100}% + ${dx}px))`;
    });
    const end = () => {
      if (!down) return; down = false;
      if (moved) { if (dx < -60) go(i + 1); else if (dx > 60) go(i - 1); else go(i); }
    };
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    root.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    root.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
        e.preventDefault(); if (lock) return; lock = true; go(i + (e.deltaX > 0 ? 1 : -1)); play(); setTimeout(() => lock = false, 900);
      }
    }, { passive: false });
    go(0); play();
  })();

  /* ---------- promos slider: native scroll-snap + mouse drag + dots ---------- */
  (function () {
    const tr = $('#promoTrack'), cards = Array.from(tr.children);
    const mark = buildDots($('#promoDots'), cards.length, k => tr.scrollTo({ left: cards[k].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' }));
    function upd() {
      let idx = 0, best = 1e9;
      cards.forEach((c, k) => { const d = Math.abs(c.offsetLeft - cards[0].offsetLeft - tr.scrollLeft); if (d < best) { best = d; idx = k; } });
      if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4) idx = cards.length - 1;
      mark(idx);
    }
    tr.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    let down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; });
    window.addEventListener('pointermove', e => {
      if (!down) return; const d = e.clientX - sx;
      if (Math.abs(d) > 5) { moved = true; tr.classList.add('dragging'); }
      if (moved) tr.scrollLeft = sl - d;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return; down = false; tr.classList.remove('dragging');
      if (moved) { let idx = 0, best = 1e9; cards.forEach((c, k) => { const d = Math.abs(c.offsetLeft - cards[0].offsetLeft - tr.scrollLeft); if (d < best) { best = d; idx = k; } }); tr.scrollTo({ left: cards[idx].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' }); }
    });
    tr.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  })();

  /* ---------- CTA auto crossfade ---------- */
  (function () {
    const imgs = $$('#ctaPics img'); let i = 0, timer;
    const mark = buildDots($('#ctaDots'), imgs.length, k => { show(k); start(); });
    function show(n) { i = (n + imgs.length) % imgs.length; imgs.forEach((m, k) => m.classList.toggle('on', k === i)); mark(i); }
    function start() { clearInterval(timer); timer = setInterval(() => show(i + 1), 3600); }
    show(0); start();
  })();

  /* ---------- FAQ accordion ---------- */
  $$('.faq').forEach(f => {
    const b = $('button', f), a = $('.a', f);
    b.addEventListener('click', () => {
      const open = !f.classList.contains('open');
      $$('.faq').forEach(o => { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); $('.a', o).style.maxHeight = 0; });
      if (open) { f.classList.add('open'); b.setAttribute('aria-expanded', 'true'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- contact form (UI only) ---------- */
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = id => $('#' + id).value.trim();
    const rules = { cName: v('cName').length > 1, cPhone: /^\d{10}$/.test(v('cPhone').replace(/\D/g, '')), cEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('cEmail')), cSub: !!v('cSub'), cMsg: v('cMsg').length > 5 };
    let ok = true;
    Object.keys(rules).forEach(k => { $('#' + k).parentElement.classList.toggle('err', !rules[k]); if (!rules[k]) ok = false; });
    const msg = $('#formMsg');
    if (ok) { msg.textContent = 'Thank you, ' + v('cName') + '! Your message has been received. We will get back to you soon.'; msg.classList.add('show'); e.target.reset(); setTimeout(() => msg.classList.remove('show'), 6000); }
    else msg.classList.remove('show');
  });
  $$('#contactForm input,#contactForm select,#contactForm textarea').forEach(el => el.addEventListener('input', () => el.parentElement.classList.remove('err')));

  /* ---------- keep cart/wishlist in sync across tabs ---------- */
  window.addEventListener('storage', e => {
    if (e.key === 'cc_cart') { cart = load('cc_cart', {}); sync(); }
    if (e.key === 'cc_wish') { wish = load('cc_wish', []); sync(); }
  });

  sync();
})();
