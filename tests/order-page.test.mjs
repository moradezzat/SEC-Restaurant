// End-to-end test of the /order page: the REAL page component is rendered in a simulated
// browser (jsdom) and talks to the REAL backend and database.
//
//   npm i -D jsdom esbuild            (once)
//   node --test tests/order-page.test.mjs
//
// Needs the SEC Manager backend running (dev database only!). Set API_URL if it is not
// http://localhost:3000/api. The order flows need the backend to be OPEN for orders
// (10:00-24:00 Cairo by default); when it is closed those tests are skipped and only the
// closed-state tests run.
//
// Safety: every request carries "X-Skip-Chef-Notification: 1" (ignored by a production
// backend), so these test orders never message your real chef. Test orders are named
// "ZZ Page ..." and are marked paid/cancelled at the end.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeFileSync, rmSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { build, stop as stopEsbuild } from 'esbuild';

const API = (process.env.API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'tests', '.page-bundle.mjs');
const RUN = String(Date.now()).slice(-6);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ bundle the page
const entry = `
  import React, { act } from 'react';
  import { createRoot } from 'react-dom/client';
  import { LanguageProvider } from '@/context/LanguageContext';
  import OrderPage from '@/app/order/page';
  export { React, act, createRoot, LanguageProvider, OrderPage };
`;
await build({
  stdin: { contents: entry, resolveDir: SRC, loader: 'jsx' },
  bundle: true, format: 'esm', platform: 'node', outfile: OUT, jsx: 'automatic', logLevel: 'error',
  loader: { '.js': 'jsx' },
  define: { 'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(API), 'process.env.NODE_ENV': '"development"' },
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
  plugins: [{
    name: 'next-shims',
    setup(b) {
      b.onResolve({ filter: /^@\// }, (args) => b.resolve('./' + args.path.slice(2), { resolveDir: SRC, kind: args.kind }));
      b.onResolve({ filter: /^next\/image$/ }, () => ({ path: 'next-image-stub', namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
        loader: 'jsx', resolveDir: SRC,
        contents: `import React from 'react';
          export default function Image({ src, alt, width, height, priority, fill, sizes, quality, placeholder, ...rest }) {
            return React.createElement('img', { src: typeof src === 'string' ? src : '', alt, ...rest });
          }`,
      }));
    },
  }],
});

await stopEsbuild?.(); // let esbuild's helper process exit

// ------------------------------------------------------------------ simulated browser
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Node', 'Event', 'MouseEvent', 'Element', 'SVGElement', 'DocumentFragment', 'MutationObserver', 'CustomEvent', 'localStorage', 'sessionStorage']) {
  Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true });
}
Object.defineProperty(globalThis, 'navigator', { value: w.navigator, configurable: true });
Object.defineProperty(globalThis, 'getComputedStyle', { value: w.getComputedStyle.bind(w), configurable: true });
Object.defineProperty(globalThis, 'requestAnimationFrame', { value: w.requestAnimationFrame.bind(w), configurable: true });
Object.defineProperty(globalThis, 'cancelAnimationFrame', { value: w.cancelAnimationFrame.bind(w), configurable: true });
w.scrollTo = () => {};
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ------------------------------------------------------------------ network layer
const realFetch = globalThis.fetch.bind(globalThis);
const SKIP = { 'X-Skip-Chef-Notification': '1' };
const calls = [];
let hook = null; // async (rec, real) => Response | undefined
globalThis.fetch = async (url, init = {}) => {
  const rec = { method: (init.method || 'GET').toUpperCase(), url: String(url), body: init.body ? JSON.parse(init.body) : null };
  calls.push(rec);
  const real = async () => realFetch(url, { ...init, headers: { ...(init.headers || {}), ...SKIP } });
  if (hook) { const r = await hook(rec, real); if (r) return r; }
  return real();
};
const reply = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
// Make the page believe the restaurant is open, whatever the real clock says, so tests that
// exercise the order form don't depend on the time of day. `inner` can answer first.
const forceOpen = (inner) => async (rec, real) => {
  const r = inner ? await inner(rec, real) : undefined;
  if (r) return r;
  if (rec.method === 'GET' && rec.url.endsWith('/public/status')) {
    const j = await (await real()).json();
    return reply(200, { ...j, open: true, opens_at: '10:00', closes_at: '00:00' });
  }
};
const posts = () => calls.filter((c) => c.method === 'POST' && c.url.endsWith('/public/orders'));
const getsOf = (suffix) => calls.filter((c) => c.method === 'GET' && c.url.endsWith(suffix));

async function api(method, p, body) {
  const res = await realFetch(API + p, { method, headers: { 'Content-Type': 'application/json', ...SKIP }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const { React, act, createRoot, LanguageProvider, OrderPage } = await import(pathToFileURL(OUT).href);
rmSync(OUT, { force: true });

// ------------------------------------------------------------------ DOM helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
const text = () => document.body.textContent.replace(/\s+/g, ' ');
const button = (re, scope = document) =>
  $$('button', scope).find((b) => re.test(b.textContent.trim()) || re.test(b.getAttribute('aria-label') || ''));
const flush = (ms = 40) => act(async () => { await sleep(ms); });
async function waitFor(fn, ms = 6000, label = '') {
  const end = Date.now() + ms;
  for (;;) {
    let v;
    try { v = fn(); } catch { v = null; }
    if (v) return v;
    if (Date.now() > end) throw new Error(`timed out waiting for: ${label || fn.toString().slice(0, 100)}\nPAGE TEXT: ${text().slice(0, 400)}`);
    await flush();
  }
}
const click = (el) => act(async () => { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true })); });
const type = (el, value) => act(async () => {
  Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value').set.call(el, value);
  el.dispatchEvent(new w.Event('input', { bubbles: true }));
});

let root = null;
async function mount(lang = 'en', networkHook = null) {
  await unmount();
  calls.length = 0; hook = networkHook;
  w.localStorage.clear(); w.localStorage.setItem('language', lang);
  document.body.innerHTML = '<div id="root"></div>';
  root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(LanguageProvider, null, React.createElement(OrderPage))); });
}
async function unmount() {
  if (root) { await act(async () => { root.unmount(); }); root = null; }
  document.body.innerHTML = '';
}
const card = (id) => $(`[data-testid="menu-item-${id}"]`);
const addToOrder = (id) => click(button(/^(Add to order|Added|أضف للطلب|تمت الإضافة)/, card(id)));
const fillDetails = async (name, phone) => { await type($('#order-name'), name); await type($('#order-phone'), phone); };

// ------------------------------------------------------------------ fixtures
const seeded = { items: [], orders: [] };
let burger, cheese, fries, open = false;
before(async () => {
  const health = await api('GET', '/health').catch(() => null);
  assert.ok(health?.status === 200, `Backend not reachable at ${API}`);
  open = (await api('GET', '/public/status')).json.open;
  const mk = async (body) => { const r = await api('POST', '/menu', body); seeded.items.push(r.json.item.id); return r.json.item; };
  burger = await mk({ name: `ZZ Page Burger ${RUN}`, price: 100, description: 'Juicy test burger' });
  cheese = (await api('POST', `/menu/${burger.id}/addons`, { name: `ZZ Page Cheese ${RUN}`, price: 10 })).json.addon;
  await api('POST', `/menu/${burger.id}/addons`, { name: `ZZ Page Hidden Addon ${RUN}`, price: 5, is_available: false });
  fries = await mk({ name: `ZZ Page Fries ${RUN}`, price: 40 });
  await mk({ name: `ZZ Page Hidden Item ${RUN}`, price: 70, is_available: false });
  console.log(`# backend ${API} is ${open ? 'OPEN' : 'CLOSED'} for orders`);
});
after(async () => {
  await unmount();
  for (const id of seeded.orders) await api('PATCH', `/orders/${id}/status`, { status: 'paid' });
  for (const id of seeded.items) await api('DELETE', `/menu/${id}`);
  w.close(); // stop the simulated browser's timers
  // The simulated browser leaves a few internal handles open; make sure the process ends.
  setTimeout(() => process.exit(), 2000).unref();
});
const ordersNamed = async (name) => (await api('GET', '/orders?limit=500')).json.orders.filter((o) => o.customer_name === name);
const track = (order) => { if (order?.id) seeded.orders.push(order.id); return order; };
const needsOpen = (name, fn) =>
  test(name, async (t) => {
    if (!open) return t.skip('backend is closed for orders right now');
    await fn(t);
  });

// ================================================================== tests
test('menu: shows available dishes and extras, hides unavailable ones (English)', async () => {
  await mount('en');
  await waitFor(() => card(burger.id), 6000, 'menu to load');
  assert.ok(card(fries.id));
  assert.equal(text().includes(`ZZ Page Hidden Item ${RUN}`), false, 'unavailable dish must not be listed');
  assert.ok(card(burger.id).textContent.includes(`ZZ Page Cheese ${RUN}`), 'available extra is listed');
  assert.equal(text().includes('ZZ Page Hidden Addon'), false, 'unavailable extra must not be listed');
  assert.ok(card(burger.id).textContent.includes('Juicy test burger'));
  assert.ok(card(burger.id).textContent.includes('100.00 EGP'));
  assert.ok(text().includes('Your order is empty'));
  assert.equal($('h1').textContent, 'Order online');
  assert.equal($('main').getAttribute('dir'), 'ltr');
});

test('Arabic: right-to-left layout and Arabic text', async () => {
  await mount('ar');
  await waitFor(() => card(burger.id));
  assert.equal($('main').getAttribute('dir'), 'rtl');
  assert.equal($('h1').textContent, 'اطلب أونلاين');
  assert.ok(button(/ابعت الطلب/), 'Arabic place-order button');
  assert.ok(text().includes('ج.م'));
  assert.ok(text().includes('طلبك فاضي'));
  assert.equal(/Place order|Your order/.test(text()), false, 'no English leaks into the Arabic page');
});

test('cart: extras, quantities, merging and live totals (takeaway then dine-in)', async () => {
  await mount('en', forceOpen());
  await waitFor(() => card(burger.id));
  await click($$('input[type=checkbox]', card(burger.id)).find((c) => c.parentElement.textContent.includes('ZZ Page Cheese')));
  await click(button(/Increase quantity/, card(burger.id))); // qty 2
  await addToOrder(burger.id);
  await waitFor(() => $$('[data-testid=cart-line]').length === 1);
  assert.ok($('[data-testid=cart-line]').textContent.includes('+ZZ Page Cheese'));
  assert.equal($('[data-testid=estimated-total]').textContent, '235.00 EGP', '2 x (100+10) + 15');
  await addToOrder(fries.id);
  await waitFor(() => $$('[data-testid=cart-line]').length === 2);
  assert.equal($('[data-testid=estimated-total]').textContent, '275.00 EGP', '260 + 15');
  await addToOrder(fries.id); // same dish, same extras: merges
  assert.equal($$('[data-testid=cart-line]').length, 2);
  assert.equal($('[data-testid=estimated-total]').textContent, '315.00 EGP', '300 + 15');
  await click(button(/^Dine in$/));
  assert.equal($('[data-testid=estimated-total]').textContent, '330.00 EGP', '300 + 15 fee (5%) + 15 tax');
  assert.ok($('[data-testid=totals]').textContent.includes('Dine-in fee (5%)'));
  await click(button(/^Takeaway$/));
  assert.equal($('[data-testid=totals]').textContent.includes('Dine-in fee'), false);
  const friesLine = $$('[data-testid=cart-line]').find((l) => l.textContent.includes('ZZ Page Fries'));
  await click(button(/Remove/, friesLine));
  assert.equal($$('[data-testid=cart-line]').length, 1);
  await click(button(/Decrease quantity/, $('[data-testid=cart-line]')));
  await click(button(/Decrease quantity/, $('[data-testid=cart-line]')));
  assert.equal($$('[data-testid=cart-line]').length, 0, 'quantity 0 removes the line');
});

test('validation: nothing is sent until the form is valid', async () => {
  await mount('en', forceOpen());
  await waitFor(() => card(burger.id));
  await click($('[data-testid=place-order]'));
  for (const msg of ['Add at least one item', 'Please enter your name', 'Please enter a valid phone number']) assert.ok(text().includes(msg), msg);
  assert.equal(posts().length, 0);
  await addToOrder(fries.id);
  await fillDetails('Ahmed', '12345');
  await click($('[data-testid=place-order]'));
  assert.ok(text().includes('Please enter a valid phone number'));
  assert.equal(text().includes('Please enter your name'), false, 'fixed fields lose their error');
  await click(button(/^Dine in$/));
  await fillDetails('Ahmed', '01012345678');
  await click($('[data-testid=place-order]'));
  assert.ok(text().includes('Please choose a table'));
  assert.equal(posts().length, 0, 'no request was sent');
});

needsOpen('happy path (takeaway): the customer gets their order number', async () => {
  const name = `ZZ Page Happy ${RUN}`;
  await mount('en');
  await waitFor(() => card(burger.id));
  await click($$('input[type=checkbox]', card(burger.id)).find((c) => c.parentElement.textContent.includes('ZZ Page Cheese')));
  await click(button(/Increase quantity/, card(burger.id)));
  await addToOrder(burger.id);
  await fillDetails(name, '٠١٠١٢٣٤٥٦٧٨'); // typed with Arabic digits
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=success]'), 8000, 'success screen');

  const sent = posts();
  assert.equal(sent.length, 1);
  const b = sent[0].body;
  assert.deepEqual(b.items, [{ menu_item_id: burger.id, quantity: 2, addons: [{ addon_id: cheese.id, quantity: 1 }] }]);
  assert.equal(b.customer_phone, '+201012345678', 'phone normalised');
  assert.equal(b.order_type, 'takeaway');
  assert.equal('table_number' in b, false);
  assert.ok(b.idempotency_key.length >= 8);
  assert.equal(/price|total|fee|tax/i.test(Object.keys(b).join() + JSON.stringify(b.items)), false, 'no prices sent');

  const [order] = (await ordersNamed(name)).map(track);
  assert.ok(order, 'the order is in the database');
  assert.equal($('[data-testid=order-number]').textContent, `#${order.order_number}`, 'the customer sees the REAL order number');
  assert.ok(text().includes('Order received!'));
  assert.ok(text().includes('Please keep this number'));
  assert.equal(order.total, '235.00');
  assert.ok(text().includes('235.00 EGP'), 'the server total is shown');
  assert.equal(order.customer_phone, '+201012345678');
  assert.equal(order.status, 'on_list');
  assert.equal(order.items[0].name, burger.name);
  assert.ok(text().includes(`2× ${burger.name}`));
  assert.ok(text().includes(`(+ZZ Page Cheese ${RUN})`));

  const saved = JSON.parse(w.localStorage.getItem('lastOrder'));
  assert.equal(saved.number, order.order_number);

  await click(button(/Place another order/));
  await waitFor(() => $('[data-testid=place-order]'));
  assert.ok(text().includes('Your order is empty'), 'cart is empty again');
  assert.equal($('#order-name').value, name, 'name is remembered');
  assert.ok(text().includes(`Your last order was #${order.order_number}`));
});

needsOpen('happy path (Arabic, dine-in at a free table)', async () => {
  const name = `ZZ Page Dine ${RUN}`;
  await mount('ar');
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  await click(button(/^داخل المطعم$/));
  const status = (await api('GET', '/public/status')).json;
  const free = [1, 2, 3, 4].find((n) => !status.occupied_tables.includes(n));
  assert.ok(free, 'a free table exists');
  await click($(`button[aria-label="ترابيزة ${free}"]`));
  await fillDetails(name, '+20 100 123 4567');
  assert.equal($('[data-testid=estimated-total]').textContent, '57.00 ج.م', '40 + 2 + 15');
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=success]'), 8000);
  const [order] = (await ordersNamed(name)).map(track);
  assert.equal(order.order_type, 'dine_in');
  assert.equal(order.table_number, free);
  assert.equal(order.total, '57.00');
  assert.equal($('[data-testid=order-number]').textContent, `#${order.order_number}`);
  assert.ok(text().includes('تم استلام طلبك'));
  assert.ok(text().includes(`ترابيزة ${free}`));
  await api('PATCH', `/orders/${order.id}/status`, { status: 'paid' });
});

needsOpen('occupied tables cannot be picked', async () => {
  const status = (await api('GET', '/public/status')).json;
  const free = [1, 2, 3, 4].find((n) => !status.occupied_tables.includes(n));
  assert.ok(free);
  const held = track((await api('POST', '/orders', { customer_name: `ZZ Page Held ${RUN}`, customer_phone: '+201000000030', order_type: 'dine_in', table_number: free, items: [{ menu_item_id: fries.id, quantity: 1, addons: [] }] })).json.order);
  try {
    await mount('en');
    await waitFor(() => card(fries.id));
    await click(button(/^Dine in$/));
    const taken = $(`button[aria-label="Table ${free} (Taken)"]`);
    assert.ok(taken, 'the occupied table is labelled as taken');
    assert.equal(taken.disabled, true);
    const other = [1, 2, 3, 4].find((n) => n !== free && !status.occupied_tables.includes(n));
    if (other) assert.equal($(`button[aria-label="Table ${other}"]`).disabled, false);
  } finally {
    await api('PATCH', `/orders/${held.id}/status`, { status: 'paid' });
  }
});

needsOpen('double click sends ONE order', async () => {
  const name = `ZZ Page Double ${RUN}`;
  await mount('en');
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  await fillDetails(name, '01012345678');
  const place = $('[data-testid=place-order]');
  await act(async () => {
    place.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    place.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    place.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  });
  await waitFor(() => $('[data-testid=success]'), 8000);
  assert.equal(posts().length, 1, 'one request');
  const found = (await ordersNamed(name)).map(track);
  assert.equal(found.length, 1, 'one order in the database');
});

needsOpen('lost response: the retry returns the SAME order, never a second one', async () => {
  const name = `ZZ Page Lost ${RUN}`;
  await mount('en');
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  await fillDetails(name, '01012345678');
  // The server SAVES the order, but the response never reaches the browser.
  hook = async (rec, real) => {
    if (rec.method === 'POST' && rec.url.endsWith('/public/orders')) { const r = await real(); await r.arrayBuffer(); throw new TypeError('network lost'); }
  };
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=notice]'));
  assert.ok($('[data-testid=notice]').textContent.includes("couldn't reach the restaurant"));
  assert.equal($('[data-testid=success]'), null);
  assert.equal((await ordersNamed(name)).length, 1, 'the order WAS saved');

  hook = null; // network is back; the customer presses the button again
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=success]'), 8000);
  const [first, second] = posts();
  assert.equal(first.body.idempotency_key, second.body.idempotency_key, 'same key on the retry');
  const found = (await ordersNamed(name)).map(track);
  assert.equal(found.length, 1, 'STILL exactly one order');
  assert.equal($('[data-testid=order-number]').textContent, `#${found[0].order_number}`, 'the customer gets that order\'s number');
});

needsOpen('after a failure, changing the order uses a NEW key (the server would otherwise return the old order)', async () => {
  await mount('en');
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  await fillDetails(`ZZ Page Key ${RUN}`, '01012345678');
  hook = async (rec) => { if (rec.method === 'POST') throw new TypeError('offline'); };
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=notice]'));
  await click($('[data-testid=place-order]'));
  await flush();
  await click(button(/Increase quantity/, $('[data-testid=cart-line]')));
  await click($('[data-testid=place-order]'));
  await flush();
  const keys = posts().map((p) => p.body.idempotency_key);
  assert.equal(keys.length, 3);
  assert.equal(keys[0], keys[1], 'retry of the same order: same key');
  assert.notEqual(keys[2], keys[0], 'edited order: new key');
  assert.equal(posts()[2].body.items[0].quantity, 2);
});

test('server says the window closed (403): clear message, order button disabled', async () => {
  await mount('en', forceOpen());
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  await fillDetails('Ahmed', '01012345678');
  hook = forceOpen(async (rec, real) => {
    if (rec.method === 'POST') return reply(403, { success: false, code: 'orders_closed', message: 'Orders window has now closed', opens_at: '10:00' });
    if (rec.url.endsWith('/public/status')) { const j = await (await real()).json(); return reply(200, { ...j, open: false, opens_at: '10:00', closes_at: '00:00' }); }
  });
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=notice]'));
  assert.equal($('[data-testid=notice]').textContent, 'Sorry, orders are closed right now. We take orders from 10:00 to 00:00.');
  await waitFor(() => $('[data-testid=place-order]').disabled, 4000, 'button disabled');
  assert.ok($('[data-testid=status-banner]').textContent.includes('Orders are closed right now'));
  assert.equal(button(/^(Add to order|Added)/, card(fries.id)).disabled, true, 'cannot add more while closed');
});

test('closed from the start: banner, disabled buttons, no request possible', async () => {
  await mount('ar', async (rec, real) => {
    if (rec.url.endsWith('/public/status')) {
      const j = await (await real()).json();
      return reply(200, { ...j, open: false, opens_at: '10:00', closes_at: '00:00' });
    }
  });
  await waitFor(() => card(fries.id));
  assert.ok($('[data-testid=status-banner]').textContent.includes('الطلبات مقفولة دلوقتي. بنستقبل الطلبات من 10:00 لحد 00:00'));
  assert.equal($('[data-testid=place-order]').disabled, true);
  assert.equal(button(/^أضف للطلب/, card(fries.id)).disabled, true);
  await click($('[data-testid=place-order]'));
  assert.equal(posts().length, 0);
});

test('real server status is honoured (open or closed)', async () => {
  await mount('en');
  await waitFor(() => $('[data-testid=status-banner]'));
  const closedUi = $('[data-testid=status-banner]').textContent.includes('closed');
  assert.equal(closedUi, !open, `page shows ${closedUi ? 'closed' : 'open'} but the server says ${open ? 'open' : 'closed'}`);
  assert.equal($('[data-testid=place-order]').disabled, !open);
});

test('error messages: table taken, item gone, bad data, rate limit, server error', async () => {
  const run = async (response, expected, after) => {
    await mount('en', forceOpen());
    await waitFor(() => card(fries.id));
    await addToOrder(fries.id);
    await fillDetails('Ahmed', '01012345678');
    hook = forceOpen(async (rec) => { if (rec.method === 'POST') return typeof response === 'function' ? response() : response; });
    await click($('[data-testid=place-order]'));
    await waitFor(() => $('[data-testid=notice]'), 4000, expected);
    assert.ok($('[data-testid=notice]').textContent.includes(expected), `${expected} | got: ${$('[data-testid=notice]').textContent}`);
    if (after) await after();
  };
  await run(reply(409, { success: false, message: 'This table already has an unpaid order' }), 'That table already has an open order');
  await run(reply(400, { success: false, message: 'Invalid order data', errors: { fieldErrors: {} } }), "Some details in your order aren't valid");
  await run(reply(429, { success: false }), 'Too many requests');
  await run(reply(500, { success: false, message: 'Failed to create order' }), 'Something went wrong on our side');
  await run(reply(502, {}), 'Something went wrong on our side');
  await run(() => new Response('<html>Bad gateway</html>', { status: 502 }), 'Something went wrong on our side');
  await run(reply(400, { success: false, message: `Menu item unavailable: ${fries.id}` }), 'no longer available', async () => {
    assert.ok(getsOf('/public/menu').length >= 2, 'the menu was reloaded');
  });
});

test('table chosen but taken by someone else meanwhile: clear message, table cleared', async () => {
  await mount('en', forceOpen());
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  await click(button(/^Dine in$/));
  const status = (await api('GET', '/public/status')).json;
  const free = [1, 2, 3, 4].find((n) => !status.occupied_tables.includes(n)) ?? 1;
  await click($(`button[aria-label="Table ${free}"]`));
  await fillDetails('Ahmed', '01012345678');
  hook = forceOpen(async (rec) => { if (rec.method === 'POST') return reply(409, { success: false, message: 'This table already has an unpaid order' }); });
  await click($('[data-testid=place-order]'));
  await waitFor(() => $('[data-testid=notice]'));
  assert.equal($(`button[aria-label="Table ${free}"]`).getAttribute('aria-pressed'), 'false', 'selection cleared');
  await click($('[data-testid=place-order]'));
  assert.ok(text().includes('Please choose a table'));
});

test('menu problems: load failure with retry, empty menu', async () => {
  await mount('en', async (rec) => { if (rec.url.endsWith('/public/menu')) throw new TypeError('offline'); });
  await waitFor(() => text().includes("couldn't load the menu"));
  hook = null;
  await click(button(/Try again/));
  await waitFor(() => card(fries.id), 6000, 'menu after retry');
  assert.equal(text().includes("couldn't load the menu"), false);

  await mount('en', async (rec) => { if (rec.url.endsWith('/public/menu')) return reply(200, { success: true, items: [] }); });
  await waitFor(() => text().includes('The menu is empty right now'));
});

test('the page only talks to the public endpoints', async () => {
  await mount('en', forceOpen());
  await waitFor(() => card(fries.id));
  await addToOrder(fries.id);
  const urls = new Set(calls.map((c) => c.url.replace(API, '')));
  assert.deepEqual([...urls].sort(), ['/public/menu', '/public/status']);
});
