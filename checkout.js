/* ============ Checkout (UI only — no backend) ============ */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = n => '₹' + Number(n).toLocaleString('en-IN');
  const byId = {}; ITEMS.forEach(i => byId[i.id] = i);
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let cart = load('cc_cart', {});
  Object.keys(cart).forEach(k => { if (!byId[k] || !(cart[k] > 0)) delete cart[k]; });

  const minus = '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>', plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const trash = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

  let tt;
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800); }

  function totals() {
    const sub = Object.keys(cart).reduce((s, id) => s + byId[id].price * cart[id], 0);
    const del = sub === 0 ? 0 : (sub >= 499 ? 0 : 49);
    return { sub, del, total: sub + del };
  }

  function render() {
    const ids = Object.keys(cart), t = totals();
    $('#emptyBox').style.display = ids.length ? 'none' : 'block';
    $('#coGrid').style.display = ids.length ? 'grid' : 'none';
    $('#coItems').innerHTML = ids.map(id => { const i = byId[id]; return `<div class="row-i"><img src="${i.img}" alt="${i.name}" onerror="imgErr(this)">
      <div class="inf"><h4>${i.name}</h4><div class="qty"><button type="button" data-dec="${id}" aria-label="Decrease">${minus}</button><span>${cart[id]}</span><button type="button" data-inc="${id}" aria-label="Increase">${plus}</button></div></div>
      <div style="text-align:right"><b style="font-family:var(--serif)">${money(i.price * cart[id])}</b><br><button type="button" class="rm" data-rm="${id}" aria-label="Remove" style="margin-top:6px">${trash}</button></div></div>`; }).join('');
    $('#coTotals').innerHTML = `<div class="sum" style="margin-top:16px"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div class="sum"><span>Delivery</span><span>${t.del ? money(t.del) : 'Free'}</span></div>
      <div class="sum t"><span>Total</span><span>${money(t.total)}</span></div>`;
    $('#buyBtn').textContent = 'Buy Now · ' + money(t.total);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-inc],[data-dec],[data-rm]'); if (!b) return;
    const d = b.dataset;
    if (d.inc) cart[d.inc] = (cart[d.inc] || 0) + 1;
    else if (d.dec) { cart[d.dec] = (cart[d.dec] || 0) - 1; if (cart[d.dec] <= 0) delete cart[d.dec]; }
    else if (d.rm) { delete cart[d.rm]; toast('Removed from cart'); }
    save('cc_cart', cart); render();
  });

  /* delivery date: today onwards */
  const dt = $('#fDate'), now = new Date();
  dt.min = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!Object.keys(cart).length) return;
    const v = id => $('#' + id).value.trim();
    const rules = {
      fName: v('fName').length > 1,
      fPhone: /^\d{10}$/.test(v('fPhone').replace(/\D/g, '')),
      fEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('fEmail')),
      fAddr: v('fAddr').length > 5,
      fCity: !!v('fCity'), fState: !!v('fState'),
      fPin: /^\d{6}$/.test(v('fPin')),
      fDate: !!v('fDate'), fTime: !!v('fTime')
    };
    let first = null;
    Object.keys(rules).forEach(k => { const f = $('#' + k).parentElement; f.classList.toggle('err', !rules[k]); if (!rules[k] && !first) first = $('#' + k); });
    if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus({ preventScroll: true }); toast('Please fill the highlighted fields'); return; }

    $('#mName').textContent = v('fName').split(' ')[0];
    $('#mWhen').textContent = 'Delivery on ' + v('fDate') + ', ' + v('fTime');
    $('#mId').textContent = 'ORDER #CC' + Math.floor(100000 + Math.random() * 900000);
    $('#modal').classList.add('show'); document.body.classList.add('lock');
    cart = {}; save('cc_cart', cart);
  });
  $$('#orderForm input,#orderForm select,#orderForm textarea').forEach(el => el.addEventListener('input', () => el.parentElement.classList.remove('err')));

  render();
})();
