// Pure order logic for the /order page: no React, no network. Everything here is
// covered by tests. Money is handled in whole piastres to avoid floating-point drift.

export const MAX_QTY = 20; // per cart line
export const MAX_LINES = 30; // different lines in one order

export const toCents = (value) => Math.round(Number(value) * 100);
export const fromCents = (cents) => (cents / 100).toFixed(2);

// ---------------------------------------------------------------- phone & name

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const EXT_ARABIC_INDIC = '۰۱۲۳۴۵۶۷۸۹';

// People on Arabic keyboards type ٠١٢٣ - turn them into 0123.
export function toLatinDigits(text) {
  return String(text ?? '')
    .replace(/[٠-٩]/g, (d) => ARABIC_INDIC.indexOf(d))
    .replace(/[۰-۹]/g, (d) => EXT_ARABIC_INDIC.indexOf(d));
}

// Accepts 01012345678, +201012345678, 00201012345678, +20 010 1234 5678, ٠١٠١٢٣٤٥٦٧٨ ...
// and returns a clean international number such as +201012345678.
export function normalizePhone(raw) {
  let s = toLatinDigits(raw).trim().replace(/[\s\-().]/g, '');
  if (s.startsWith('00')) s = '+' + s.slice(2);

  const plus = s.startsWith('+');
  const digits = plus ? s.slice(1) : s;
  if (!/^\d+$/.test(digits)) return { ok: false };

  if (!plus) {
    if (/^01\d{9}$/.test(digits)) return { ok: true, value: '+2' + digits };
    if (/^1\d{9}$/.test(digits)) return { ok: true, value: '+20' + digits };
  }
  // +20 followed by the leading zero of the local number: +2001012345678
  if (/^2001\d{9}$/.test(digits)) return { ok: true, value: '+20' + digits.slice(3) };

  // International numbers never start with 0 (a local number of the wrong length does)
  if (digits.startsWith('0')) return { ok: false };
  if (digits.length < 8 || digits.length > 15) return { ok: false };
  return { ok: true, value: '+' + digits };
}

const cleanName = (name) =>
  String(name ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function validateOrder({ name, phone, orderType, tableNumber, cart }) {
  const errors = {};

  const cleanedName = cleanName(name);
  if (!cleanedName) errors.name = 'name_required';
  else if (cleanedName.length > 100) errors.name = 'name_long';

  const p = normalizePhone(phone);
  if (!p.ok) errors.phone = 'phone_invalid';

  if (orderType === 'dine_in' && !tableNumber) errors.table = 'table_required';
  if (!cart.length) errors.cart = 'cart_required';

  return { ok: Object.keys(errors).length === 0, errors, name: cleanedName, phone: p.value };
}

// ------------------------------------------------------------------------ cart

export const lineKey = (itemId, addonIds) =>
  `${itemId}|${[...addonIds].sort().join(',')}`;

// Same dish with the same extras merges into one line; different extras = a new line.
export function addLine(cart, itemId, addonIds, qty = 1) {
  const key = lineKey(itemId, addonIds);
  const existing = cart.find((l) => l.key === key);

  if (existing) {
    return cart.map((l) =>
      l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l
    );
  }
  if (cart.length >= MAX_LINES) return cart;

  return [
    ...cart,
    {
      key,
      itemId,
      addonIds: [...addonIds].sort(),
      qty: Math.min(MAX_QTY, Math.max(1, qty)),
    },
  ];
}

export const setLineQty = (cart, key, qty) =>
  qty <= 0
    ? cart.filter((l) => l.key !== key)
    : cart.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l));

export const removeLine = (cart, key) => cart.filter((l) => l.key !== key);

// After the menu is reloaded, drop dishes/extras that are gone.
export function pruneCart(cart, menuItems) {
  const byId = new Map(menuItems.map((i) => [i.id, i]));
  let changed = false;
  let next = [];

  for (const line of cart) {
    const item = byId.get(line.itemId);
    if (!item) {
      changed = true;
      continue;
    }
    const valid = new Set(item.addons.map((a) => a.id));
    const addonIds = line.addonIds.filter((id) => valid.has(id));
    if (addonIds.length !== line.addonIds.length) changed = true;
    next = addLine(next, line.itemId, addonIds, line.qty);
  }
  return { cart: next, changed };
}

// Cart lines joined with the current menu, with prices in piastres.
export function resolveLines(cart, menuItems) {
  const byId = new Map(menuItems.map((i) => [i.id, i]));
  const lines = [];

  for (const line of cart) {
    const item = byId.get(line.itemId);
    if (!item) continue;
    const addons = item.addons.filter((a) => line.addonIds.includes(a.id));
    const unitCents =
      toCents(item.price) + addons.reduce((sum, a) => sum + toCents(a.price), 0);
    lines.push({
      key: line.key,
      item,
      addons,
      qty: line.qty,
      unitCents,
      lineCents: unitCents * line.qty,
    });
  }
  return lines;
}

// Mirrors the server's formula so the preview matches. The server's total is the real one.
export function estimate(lines, orderType, pricing) {
  const subtotal = lines.reduce((sum, l) => sum + l.lineCents, 0);
  const fee = orderType === 'dine_in' ? Math.round(subtotal * pricing.dine_in_fee_rate) : 0;
  const tax = toCents(pricing.service_tax);
  return { subtotal, fee, tax, total: subtotal + fee + tax };
}

// --------------------------------------------------------------------- payload

// Sends ONLY what the customer chose. No prices: the server prices everything.
export function buildPayload({ cart, name, phone, orderType, tableNumber }) {
  return {
    customer_name: name,
    customer_phone: phone,
    order_type: orderType,
    ...(orderType === 'dine_in' ? { table_number: Number(tableNumber) } : {}),
    items: cart.map((l) => ({
      menu_item_id: l.itemId,
      quantity: l.qty,
      addons: l.addonIds.map((id) => ({ addon_id: id, quantity: 1 })),
    })),
  };
}

export function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // crypto.randomUUID needs HTTPS; fall back for plain-HTTP development
  return 'k-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
}

// The server answers a repeated key with the ORIGINAL order, whatever the payload now
// says. So: the same order retried (double click, flaky network) keeps its key, but the
// moment anything in the order changes it gets a fresh one.
export function keyFor(holder, payload) {
  const signature = JSON.stringify(payload);
  if (holder.signature !== signature) {
    holder.signature = signature;
    holder.key = newIdempotencyKey();
  }
  return holder.key;
}

// -------------------------------------------------------------------- errors

export function mapApiError(status, body) {
  const message = String(body?.message ?? '');

  if (status === 403 && body?.code === 'orders_closed') {
    return { kind: 'closed', opensAt: body.opens_at };
  }
  if (status === 409) return { kind: 'table_busy' };
  if (status === 400 && /unavailable/i.test(message)) {
    return { kind: 'unavailable' };
  }
  if (status === 400) return { kind: 'validation' };
  if (status === 429) return { kind: 'busy' };
  return { kind: 'server' };
}

export const fill = (text, vars) =>
  String(text).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
