// Tests for the /order page's logic and translations. No dependencies:
//   node --test tests/order-logic.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/lib/orderLogic.js';

const menu = [
  { id: 'burger', name: 'Burger', description: null, image_url: null, price: '100.00',
    addons: [{ id: 'cheese', name: 'Cheese', price: '10.00' }, { id: 'sauce', name: 'Sauce', price: '5.00' }] },
  { id: 'fries', name: 'Fries', description: null, image_url: null, price: '40.00', addons: [] },
];
const pricing = { service_tax: '15.00', dine_in_fee_rate: 0.05 };

test('money helpers are exact', () => {
  assert.equal(L.toCents('10.00'), 1000);
  assert.equal(L.toCents('19.99'), 1999);
  assert.equal(L.toCents('0.30'), 30);
  assert.equal(L.fromCents(24600), '246.00');
  assert.equal(L.fromCents(5), '0.05');
});

test('phone numbers are normalised to +E.164', () => {
  const ok = {
    '01012345678': '+201012345678',
    '+201012345678': '+201012345678',
    '00201012345678': '+201012345678',
    '+20 010 1234 5678': '+201012345678',
    '(010) 1234-5678': '+201012345678',
    '1012345678': '+201012345678',
    '٠١٠١٢٣٤٥٦٧٨': '+201012345678', // Arabic-Indic digits
    '۰۱۰۱۲۳۴۵۶۷۸': '+201012345678', // Persian digits
    '+٢٠١٠١٢٣٤٥٦٧٨': '+201012345678',
    '  0101 234 5678  ': '+201012345678',
    '+44 7911 123456': '+447911123456',
    '201012345678': '+201012345678',
  };
  for (const [raw, expected] of Object.entries(ok)) {
    assert.deepEqual(L.normalizePhone(raw), { ok: true, value: expected }, raw);
  }
});

test('invalid phone numbers are rejected', () => {
  for (const raw of ['', '   ', 'abc', '12345', '+1234567890123456', '0101234567', '+0123456789', '01012-ab-5678', '٠١٠abc', null, undefined]) {
    assert.equal(L.normalizePhone(raw).ok, false, String(raw));
  }
});

test('order validation', () => {
  const base = { name: 'Ahmed', phone: '01012345678', orderType: 'takeaway', tableNumber: null, cart: [{}] };
  assert.equal(L.validateOrder(base).ok, true);
  assert.equal(L.validateOrder(base).phone, '+201012345678');
  assert.equal(L.validateOrder({ ...base, name: '  Ahmed   Ali \n ' }).name, 'Ahmed Ali');
  assert.equal(L.validateOrder({ ...base, name: '   ' }).errors.name, 'name_required');
  assert.equal(L.validateOrder({ ...base, name: 'x'.repeat(101) }).errors.name, 'name_long');
  assert.equal(L.validateOrder({ ...base, phone: '123' }).errors.phone, 'phone_invalid');
  assert.equal(L.validateOrder({ ...base, cart: [] }).errors.cart, 'cart_required');
  assert.equal(L.validateOrder({ ...base, orderType: 'dine_in' }).errors.table, 'table_required');
  assert.equal(L.validateOrder({ ...base, orderType: 'dine_in', tableNumber: 3 }).ok, true);
  const all = L.validateOrder({ name: '', phone: '', orderType: 'dine_in', tableNumber: null, cart: [] });
  assert.deepEqual(Object.keys(all.errors).sort(), ['cart', 'name', 'phone', 'table']);
});

test('cart: same dish + same extras merge, different extras do not', () => {
  let cart = L.addLine([], 'burger', ['cheese', 'sauce'], 1);
  cart = L.addLine(cart, 'burger', ['sauce', 'cheese'], 2); // same extras, other order
  assert.equal(cart.length, 1);
  assert.equal(cart[0].qty, 3);
  cart = L.addLine(cart, 'burger', ['cheese'], 1);
  assert.equal(cart.length, 2);
  cart = L.addLine(cart, 'burger', [], 1);
  assert.equal(cart.length, 3);
});

test('cart limits and edits', () => {
  let cart = L.addLine([], 'fries', [], L.MAX_QTY + 50);
  assert.equal(cart[0].qty, L.MAX_QTY);
  cart = L.addLine(cart, 'fries', [], 5);
  assert.equal(cart[0].qty, L.MAX_QTY);
  const key = cart[0].key;
  assert.equal(L.setLineQty(cart, key, 3)[0].qty, 3);
  assert.equal(L.setLineQty(cart, key, 999)[0].qty, L.MAX_QTY);
  assert.equal(L.setLineQty(cart, key, 0).length, 0);
  assert.equal(L.removeLine(cart, key).length, 0);

  let big = [];
  for (let i = 0; i < L.MAX_LINES + 10; i++) big = L.addLine(big, `item${i}`, [], 1);
  assert.equal(big.length, L.MAX_LINES);
  assert.equal(L.addLine([], 'x', [], 0)[0].qty, 1);
});

test('pruneCart drops vanished dishes and extras', () => {
  let cart = L.addLine([], 'burger', ['cheese', 'sauce'], 2);
  cart = L.addLine(cart, 'pizza', [], 1); // not on the menu any more
  const noSauce = [{ ...menu[0], addons: [menu[0].addons[0]] }, menu[1]];
  const r = L.pruneCart(cart, noSauce);
  assert.equal(r.changed, true);
  assert.equal(r.cart.length, 1);
  assert.deepEqual(r.cart[0].addonIds, ['cheese']);
  assert.equal(r.cart[0].qty, 2);
  assert.equal(L.pruneCart(r.cart, noSauce).changed, false);
  // two lines that become identical after pruning merge
  let two = L.addLine([], 'burger', ['sauce'], 1);
  two = L.addLine(two, 'burger', [], 1);
  const merged = L.pruneCart(two, noSauce);
  assert.equal(merged.cart.length, 1);
  assert.equal(merged.cart[0].qty, 2);
});

test('lines are priced from the menu; missing dishes are skipped', () => {
  let cart = L.addLine([], 'burger', ['cheese'], 2);
  cart = L.addLine(cart, 'ghost', [], 1);
  const lines = L.resolveLines(cart, menu);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].unitCents, 11000);
  assert.equal(lines[0].lineCents, 22000);
  assert.deepEqual(lines[0].addons.map((a) => a.id), ['cheese']);
});

test('estimate mirrors the server formula', () => {
  const lines = L.resolveLines(L.addLine([], 'burger', ['cheese'], 2), menu); // 220.00
  assert.deepEqual(L.estimate(lines, 'takeaway', pricing), { subtotal: 22000, fee: 0, tax: 1500, total: 23500 });
  assert.deepEqual(L.estimate(lines, 'dine_in', pricing), { subtotal: 22000, fee: 1100, tax: 1500, total: 24600 });
  // 10.01 * 5% = 0.5005 -> rounds to 0.50, exactly as the server's Math.round(cents * 0.05)
  assert.equal(L.estimate([{ lineCents: 1001 }], 'dine_in', pricing).fee, 50);
  assert.equal(L.estimate([], 'takeaway', pricing).total, 1500);
});

test('the payload never contains prices or totals', () => {
  const cart = L.addLine(L.addLine([], 'burger', ['cheese'], 2), 'fries', [], 1);
  const dine = L.buildPayload({ cart, name: 'Ahmed', phone: '+201012345678', orderType: 'dine_in', tableNumber: '3' });
  const take = L.buildPayload({ cart, name: 'Ahmed', phone: '+201012345678', orderType: 'takeaway', tableNumber: 3 });
  assert.equal(dine.table_number, 3);
  assert.equal('table_number' in take, false);
  assert.deepEqual(dine.items[0], { menu_item_id: 'burger', quantity: 2, addons: [{ addon_id: 'cheese', quantity: 1 }] });
  const text = JSON.stringify(dine).toLowerCase();
  for (const word of ['price', 'total', 'subtotal', 'fee', 'tax', 'amount']) assert.equal(text.includes(word), false, word);
});

test('idempotency key: stable for the same order, fresh when anything changes', () => {
  const holder = { signature: null, key: null };
  const a = { items: [1], customer_name: 'A' };
  const k1 = L.keyFor(holder, a);
  assert.ok(k1.length >= 8 && k1.length <= 100);
  assert.equal(L.keyFor(holder, { ...a }), k1); // retry / double click
  assert.equal(L.keyFor(holder, { ...a }), k1);
  const k2 = L.keyFor(holder, { items: [1, 2], customer_name: 'A' });
  assert.notEqual(k2, k1); // the order changed
  assert.notEqual(L.keyFor(holder, { items: [1, 2], customer_name: 'B' }), k2);
  assert.notEqual(L.newIdempotencyKey(), L.newIdempotencyKey());
});

test('idempotency key works without crypto.randomUUID (plain-HTTP development)', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
  try {
    const k = L.newIdempotencyKey();
    assert.ok(k.length >= 8 && k.length <= 100, k);
    assert.notEqual(k, L.newIdempotencyKey());
  } finally {
    Object.defineProperty(globalThis, 'crypto', original);
  }
});

test('API errors map to the right message', () => {
  assert.deepEqual(L.mapApiError(403, { code: 'orders_closed', message: 'Orders window has now closed', opens_at: '10:00' }), { kind: 'closed', opensAt: '10:00' });
  assert.equal(L.mapApiError(403, { message: 'something else' }).kind, 'server');
  assert.equal(L.mapApiError(409, { message: 'This table already has an unpaid order' }).kind, 'table_busy');
  assert.equal(L.mapApiError(400, { message: 'Menu item unavailable: abc' }).kind, 'unavailable');
  assert.equal(L.mapApiError(400, { message: 'One or more add-ons are invalid or unavailable' }).kind, 'unavailable');
  assert.equal(L.mapApiError(400, { message: 'Invalid order data', errors: { fieldErrors: {} } }).kind, 'validation');
  assert.equal(L.mapApiError(400, { message: 'Invalid table selection for this order type' }).kind, 'validation');
  assert.equal(L.mapApiError(429, {}).kind, 'busy');
  assert.equal(L.mapApiError(500, { message: 'Failed to create order' }).kind, 'server');
  assert.equal(L.mapApiError(502, null).kind, 'server');
});

test('fill() replaces placeholders and leaves unknown ones alone', () => {
  assert.equal(L.fill('from {open} to {close}', { open: '10:00', close: '00:00' }), 'from 10:00 to 00:00');
  assert.equal(L.fill('#{number}', { number: 12 }), '#12');
  assert.equal(L.fill('{a} {b}', { a: 1 }), '1 {b}');
});

test('English and Arabic translations match key for key, with the same placeholders', () => {
  const en = JSON.parse(readFileSync(new URL('../src/locales/en.json', import.meta.url), 'utf8')).order_page;
  const ar = JSON.parse(readFileSync(new URL('../src/locales/ar.json', import.meta.url), 'utf8')).order_page;
  const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
  const fe = new Map(flat(en)), fa = new Map(flat(ar));
  assert.deepEqual([...fe.keys()].sort(), [...fa.keys()].sort());
  for (const [key, text] of fe) {
    assert.ok(String(text).trim().length > 0, `empty English: ${key}`);
    assert.ok(String(fa.get(key)).trim().length > 0, `empty Arabic: ${key}`);
    const ph = (s) => (String(s).match(/\{\w+\}/g) ?? []).sort().join();
    assert.equal(ph(fa.get(key)), ph(text), `placeholders differ: ${key}`);
  }
  assert.ok(/[\u0600-\u06FF]/.test(ar.title), 'Arabic title is Arabic');
  // every key the page uses exists
  const page = readFileSync(new URL('../src/app/order/page.js', import.meta.url), 'utf8');
  for (const [, key] of page.matchAll(/\bt\.([a-z_]+)\b/g)) assert.ok(key in en, `page uses missing key t.${key}`);
});
