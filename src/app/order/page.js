"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder, getMenu, getStatus } from '@/lib/orderApi';
import {
  MAX_QTY,
  addLine,
  buildPayload,
  estimate,
  fill,
  fromCents,
  keyFor,
  mapApiError,
  pruneCart,
  removeLine,
  resolveLines,
  setLineQty,
  toCents,
  validateOrder,
} from '@/lib/orderLogic';

const scrollTop = () => {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    /* not available (tests) */
  }
};

const card = 'bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md';
const heading = 'text-[#2c3e50] dark:text-[#d3d3d3]';
const muted = 'text-[#666666] dark:text-[#b8b8b8]';
const input =
  'w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#121212] dark:text-[#d3d3d3] px-3 py-2 outline-none focus:border-[#e74c3c]';
const redBtn =
  'bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-lg py-2 px-4 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

function Stepper({ value, onChange, t, max = MAX_QTY }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label={t.decrease} onClick={() => onChange(value - 1)}
        className="w-8 h-8 rounded-full border border-[#e74c3c] text-[#e74c3c] text-lg leading-none">−</button>
      <span className={`min-w-[1.5rem] text-center font-semibold ${heading}`}>{value}</span>
      <button type="button" aria-label={t.increase} disabled={value >= max} onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full border border-[#e74c3c] text-[#e74c3c] text-lg leading-none disabled:opacity-40">+</button>
    </div>
  );
}

function MenuCard({ item, t, disabled, onAdd }) {
  const [qty, setQty] = useState(1);
  const [picked, setPicked] = useState([]);
  const [flash, setFlash] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const add = () => {
    onAdd(item.id, picked, qty);
    setQty(1);
    setPicked([]);
    setFlash(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 1200);
  };

  return (
    <article data-testid={`menu-item-${item.id}`} className={`${card} overflow-hidden flex flex-col`}>
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt={item.name} loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="w-full h-40 object-cover" />
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className={`text-lg font-semibold ${heading}`}>{item.name}</h3>
          {item.description && <p className={`text-sm mt-1 ${muted}`}>{item.description}</p>}
          <p className="mt-2 font-semibold text-[#e74c3c]">{item.price} {t.egp}</p>
        </div>

        {item.addons.length > 0 && (
          <fieldset className="flex flex-col gap-1">
            <legend className={`text-sm font-medium mb-1 ${heading}`}>{t.extras}</legend>
            {item.addons.map((a) => (
              <label key={a.id} className={`flex items-center gap-2 text-sm cursor-pointer ${muted}`}>
                <input type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)}
                  className="accent-[#e74c3c]" />
                <span>{a.name}</span>
                <span className="ms-auto">+{a.price} {t.egp}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${muted}`}>{t.quantity}</span>
            <Stepper value={qty} onChange={(v) => setQty(Math.max(1, v))} t={t} />
          </div>
          <button type="button" disabled={disabled} onClick={add} className={redBtn}>
            {flash ? t.added : `${t.add} · ${fromCents((toCents(item.price) + picked.reduce((s, id) => s + toCents(item.addons.find((a) => a.id === id)?.price ?? 0), 0)) * qty)} ${t.egp}`}
          </button>
        </div>
      </div>
    </article>
  );
}

function SuccessView({ order, t, onNew }) {
  return (
    <section data-testid="success" className={`${card} p-8 max-w-[560px] mx-auto text-center`}>
      <h2 className={`text-[1.8rem] font-semibold ${heading}`}>{t.success_title}</h2>
      <p className={`mt-4 ${muted}`}>{t.success_number}</p>
      <p data-testid="order-number" className="text-[4rem] leading-none font-bold text-[#e74c3c] my-2">
        #{order.order_number}
      </p>
      <p className={`${muted} mb-6`}>{t.success_keep}</p>

      <div className="text-start border-t border-gray-200 dark:border-[#333] pt-4">
        <p className={`font-semibold mb-2 ${heading}`}>
          {t.success_items} · {order.order_type === 'dine_in' ? `${t.dine_in} · ${t.table} ${order.table_number}` : t.takeaway}
        </p>
        <ul className={`flex flex-col gap-1 ${muted}`}>
          {order.items.map((i) => (
            <li key={i.id}>
              {i.quantity}× {i.name}
              {i.addons.length > 0 && ` (+${i.addons.map((a) => a.name).join(', +')})`}
              <span className="float-end">{i.line_total}</span>
            </li>
          ))}
        </ul>
        <dl className={`mt-4 flex flex-col gap-1 ${muted}`}>
          <div className="flex justify-between"><dt>{t.subtotal}</dt><dd>{order.subtotal} {t.egp}</dd></div>
          {Number(order.dine_in_fee) > 0 && (
            <div className="flex justify-between"><dt>{fill(t.dine_in_fee, { percent: 5 })}</dt><dd>{order.dine_in_fee} {t.egp}</dd></div>
          )}
          <div className="flex justify-between"><dt>{t.service_tax}</dt><dd>{order.service_tax} {t.egp}</dd></div>
          <div className={`flex justify-between font-bold text-lg ${heading}`}><dt>{t.total}</dt><dd>{order.total} {t.egp}</dd></div>
        </dl>
      </div>

      <button type="button" onClick={onNew} className={`${redBtn} mt-6 w-full`}>{t.success_new}</button>
    </section>
  );
}

export default function OrderPage() {
  const { language, translations } = useLanguage();
  const t = translations.order_page;
  const isAr = language === 'ar';

  const [status, setStatus] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('takeaway');
  const [table, setTable] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  const keyHolder = useRef({ signature: null, key: null });
  const submittingRef = useRef(false);

  const refreshStatus = useCallback(async () => {
    try {
      setStatus(await getStatus());
    } catch {
      /* keep the last known status */
    }
  }, []);

  const load = useCallback(async () => {
    setLoadFailed(false);
    try {
      const [s, m] = await Promise.all([getStatus(), getMenu()]);
      setStatus(s);
      setMenu(m.items);
      setCart((c) => pruneCart(c, m.items).cart);
    } catch {
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The restaurant may open or close while the page is open.
  useEffect(() => {
    const id = setInterval(refreshStatus, 60000);
    return () => clearInterval(id);
  }, [refreshStatus]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lastOrder');
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && Date.now() - saved.at < 12 * 3600 * 1000) setLastOrder(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // A table someone else just took can't stay selected.
  useEffect(() => {
    if (table && status?.occupied_tables?.includes(table)) setTable(null);
  }, [status, table]);

  const lines = useMemo(() => (menu ? resolveLines(cart, menu) : []), [cart, menu]);
  const totals = useMemo(
    () => (status ? estimate(lines, orderType, status.pricing) : null),
    [lines, orderType, status]
  );

  const closed = !!status && !status.open;
  const edit = (field, setter) => (e) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSuccess = (order) => {
    setPlaced(order);
    setCart([]);
    setNotice(null);
    setErrors({});
    keyHolder.current = { signature: null, key: null };
    try {
      const saved = { number: order.order_number, total: order.total, at: Date.now() };
      localStorage.setItem('lastOrder', JSON.stringify(saved));
      setLastOrder(saved);
    } catch {
      /* private mode */
    }
    refreshStatus();
    scrollTop();
  };

  const onFailure = (err) => {
    setNotice(err);
    scrollTop();
    if (err.kind === 'closed') {
      setStatus((s) => (s ? { ...s, open: false, opens_at: err.opensAt ?? s.opens_at } : s));
      refreshStatus();
    }
    if (err.kind === 'table_busy') {
      setTable(null);
      refreshStatus();
    }
    if (err.kind === 'unavailable') load();
  };

  const submit = async () => {
    if (submittingRef.current) return; // a double click can't send twice
    setNotice(null);

    const v = validateOrder({ name, phone, orderType, tableNumber: table, cart });
    setErrors(v.errors);
    if (!v.ok) return;

    const base = buildPayload({ cart, name: v.name, phone: v.phone, orderType, tableNumber: table });
    const key = keyFor(keyHolder.current, base);

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const res = await createOrder({ ...base, idempotency_key: key });
      if ((res.status === 201 || res.status === 200) && res.body?.order) {
        onSuccess(res.body.order);
      } else {
        onFailure(mapApiError(res.status, res.body));
      }
    } catch {
      onFailure({ kind: 'network' });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const noticeText = notice
    ? fill(t.notices[notice.kind] ?? t.notices.server, {
        open: notice.opensAt ?? status?.opens_at ?? '',
        close: status?.closes_at ?? '',
      })
    : null;

  return (
    <div className="bg-[#f5f5f5] text-[#333333] dark:bg-[#0f0f0f] min-h-screen flex flex-col transition-colors duration-300 ease">
      <Navbar />

      <main dir={isAr ? 'rtl' : 'ltr'} className="max-w-[1200px] mx-auto mb-8 px-4 sm:px-8 w-full flex-1 pt-[7.5rem]">
        {placed ? (
          <SuccessView order={placed} t={t} onNew={() => { setPlaced(null); scrollTop(); }} />
        ) : (
          <>
            <header className="mb-6 text-start">
              <h1 className={`text-[2.2rem] font-semibold ${heading}`}>{t.title}</h1>
              <p className={`mt-2 ${muted}`}>{t.subtitle}</p>

              {status && (
                <p data-testid="status-banner" role="status"
                  className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${closed ? 'bg-red-100 text-red-800 dark:bg-[#3a1c1c] dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-[#1b3322] dark:text-green-300'}`}>
                  {closed
                    ? fill(t.status_closed, { open: status.opens_at, close: status.closes_at })
                    : t.status_open}
                </p>
              )}
              {lastOrder && (
                <p className={`mt-3 text-sm ${muted}`}>{fill(t.last_order, { number: lastOrder.number })}</p>
              )}
            </header>

            {noticeText && (
              <p data-testid="notice" role="alert"
                className="mb-6 rounded-lg px-4 py-3 bg-red-100 text-red-800 dark:bg-[#3a1c1c] dark:text-red-300">
                {noticeText}
              </p>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
              <section aria-label={t.title}>
                {menu === null && !loadFailed && <p className={muted}>{t.loading}</p>}
                {loadFailed && (
                  <div className={`${card} p-6 flex flex-col items-start gap-3`}>
                    <p className={heading}>{t.load_error}</p>
                    <button type="button" onClick={load} className={redBtn}>{t.retry}</button>
                  </div>
                )}
                {menu && menu.length === 0 && <p className={muted}>{t.empty}</p>}
                {menu && menu.length > 0 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {menu.map((item) => (
                      <MenuCard key={item.id} item={item} t={t} disabled={closed}
                        onAdd={(id, addonIds, qty) => setCart((c) => addLine(c, id, addonIds, qty))} />
                    ))}
                  </div>
                )}
              </section>

              <aside className={`${card} p-5 flex flex-col gap-4 lg:sticky lg:top-[6rem]`}>
                <h2 className={`text-xl font-semibold ${heading}`}>{t.your_order}</h2>

                {lines.length === 0 ? (
                  <p className={`text-sm ${muted}`}>{t.cart_empty}</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {lines.map((l) => (
                      <li key={l.key} data-testid="cart-line" className="flex flex-col gap-2 border-b border-gray-200 dark:border-[#333] pb-3">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className={`font-medium ${heading}`}>{l.item.name}</p>
                            {l.addons.length > 0 && (
                              <p className={`text-xs ${muted}`}>+{l.addons.map((a) => a.name).join(', +')}</p>
                            )}
                          </div>
                          <p className={`font-semibold whitespace-nowrap ${heading}`}>{fromCents(l.lineCents)} {t.egp}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Stepper value={l.qty} t={t} onChange={(v) => setCart((c) => setLineQty(c, l.key, v))} />
                          <button type="button" onClick={() => setCart((c) => removeLine(c, l.key))}
                            className="text-sm text-[#e74c3c] hover:underline">{t.remove}</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {errors.cart && <p role="alert" className="text-sm text-red-600">{t.errors[errors.cart]}</p>}

                <div>
                  <p className={`text-sm font-medium mb-2 ${heading}`}>{t.order_type}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['takeaway', 'dine_in'].map((type) => (
                      <button key={type} type="button" aria-pressed={orderType === type}
                        onClick={() => { setOrderType(type); setErrors((p) => ({ ...p, table: undefined })); }}
                        className={`rounded-lg py-2 border transition-colors ${orderType === type ? 'bg-[#e74c3c] border-[#e74c3c] text-white' : `border-gray-300 dark:border-[#3a3a3a] ${muted}`}`}>
                        {type === 'dine_in' ? t.dine_in : t.takeaway}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === 'dine_in' && status && (
                  <div>
                    <p className={`text-sm font-medium mb-2 ${heading}`}>{t.choose_table}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: status.table_count }, (_, i) => i + 1).map((n) => {
                        const taken = status.occupied_tables.includes(n);
                        return (
                          <button key={n} type="button" disabled={taken} aria-pressed={table === n}
                            aria-label={`${t.table} ${n}${taken ? ` (${t.table_taken})` : ''}`}
                            onClick={() => { setTable(n); setErrors((p) => ({ ...p, table: undefined })); }}
                            className={`rounded-lg py-2 border transition-colors disabled:opacity-40 disabled:line-through ${table === n ? 'bg-[#e74c3c] border-[#e74c3c] text-white' : `border-gray-300 dark:border-[#3a3a3a] ${muted}`}`}>
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    {errors.table && <p role="alert" className="text-sm text-red-600 mt-1">{t.errors[errors.table]}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="order-name" className={`text-sm font-medium ${heading}`}>{t.name}</label>
                  <input id="order-name" className={`${input} mt-1`} value={name} maxLength={100}
                    placeholder={t.name_placeholder} autoComplete="name" onChange={edit('name', setName)} />
                  {errors.name && <p role="alert" className="text-sm text-red-600 mt-1">{t.errors[errors.name]}</p>}
                </div>
                <div>
                  <label htmlFor="order-phone" className={`text-sm font-medium ${heading}`}>{t.phone}</label>
                  <input id="order-phone" className={`${input} mt-1`} value={phone} inputMode="tel" dir="ltr"
                    placeholder={t.phone_placeholder} autoComplete="tel" onChange={edit('phone', setPhone)} />
                  {errors.phone && <p role="alert" className="text-sm text-red-600 mt-1">{t.errors[errors.phone]}</p>}
                </div>

                {totals && lines.length > 0 && (
                  <dl data-testid="totals" className={`flex flex-col gap-1 text-sm ${muted}`}>
                    <div className="flex justify-between"><dt>{t.subtotal}</dt><dd>{fromCents(totals.subtotal)} {t.egp}</dd></div>
                    {orderType === 'dine_in' && (
                      <div className="flex justify-between"><dt>{fill(t.dine_in_fee, { percent: Math.round(status.pricing.dine_in_fee_rate * 100) })}</dt><dd>{fromCents(totals.fee)} {t.egp}</dd></div>
                    )}
                    <div className="flex justify-between"><dt>{t.service_tax}</dt><dd>{fromCents(totals.tax)} {t.egp}</dd></div>
                    <div className={`flex justify-between font-bold text-lg ${heading}`}><dt>{t.total}</dt><dd data-testid="estimated-total">{fromCents(totals.total)} {t.egp}</dd></div>
                    <p className="text-xs mt-1">{t.estimate_note}</p>
                  </dl>
                )}

                <button type="button" data-testid="place-order" disabled={submitting || closed || !menu}
                  onClick={submit} className={`${redBtn} py-3 text-lg`}>
                  {submitting ? t.placing : t.place_order}
                </button>
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}