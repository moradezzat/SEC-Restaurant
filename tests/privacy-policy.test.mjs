// The /privacy-policy page: renders the REAL page in a simulated browser (jsdom) and checks
// that the owner's text is complete and in order, the table of contents works, Arabic is
// right-to-left, and nothing is fetched from the network.
//
//   npm i -D jsdom esbuild            (once, shared with the order page test)
//   node --test tests/privacy-policy.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { build, stop as stopEsbuild } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'tests', '.privacy-bundle.mjs');

// ---------------------------------------------------------------- the owner's text
const TITLES = ['Introduction', 'Information We Collect', 'WhatsApp Bot Usage', 'How We Use Your Information', 'Data Storage and Security', 'Third-Party Services', 'Data Retention', 'Your Privacy Rights', 'Changes to This Policy', 'Contact Information'];
const SOURCE = [
  'Privacy Policy', 'Effective Date: November 20, 2026',
  'This Privacy Policy explains how our restaurant backend system collects, processes, stores, and protects personal information when customers place orders through our ordering services.',
  'We respect your privacy and are committed to handling your information responsibly.',
  'When you use our ordering services, we may collect the following information:',
  'Customer Information: Name and phone number.',
  'Order Information: Ordered items, quantities, selected add-ons, prices, and order details.',
  'Order History: Previous orders, order timestamps, and order statuses.',
  'Technical Information: Information received through system requests and integrations, such as transaction identifiers and webhook events.',
  "We only collect information necessary to operate and manage the restaurant's ordering system.",
  'Our WhatsApp bot is strictly intended for internal restaurant management purposes.',
  'The bot is not intended for public use or customer interaction.',
  'It is exclusively operated by the restaurant owner.',
  'Only one authorized person, the restaurant owner, is intended to use the bot.',
  'The bot is used to receive order notifications, review incoming orders, and manage their statuses and related restaurant operations.',
  'Customers do not need to interact with the WhatsApp bot to place orders.',
  'Collected information is used exclusively for legitimate restaurant operations, including:',
  'Processing and managing customer orders.', 'Notifying restaurant management about incoming orders.', 'Preparing and fulfilling orders.',
  'Maintaining order records and history.', 'Managing menu items, availability, and additional options.', 'Preventing duplicate orders and maintaining system reliability.',
  'Order information is stored in a secured database used by the restaurant backend.',
  'We implement reasonable technical and organizational measures to protect stored information against unauthorized access, alteration, disclosure, or destruction.',
  'Access to management functionality is restricted to authorized personnel.',
  'However, no online system or method of electronic storage can guarantee absolute security.',
  'Our system may rely on third-party providers to operate, including:',
  'WhatsApp / Meta: For internal management notifications and related messaging functionality.',
  'Database and Hosting Providers: For securely storing information and operating the backend infrastructure.',
  'These providers may process information as necessary to provide their respective services, subject to their own privacy policies and terms.',
  'We do not sell or rent customer personal information to third parties.',
  'Customer and order information may be retained for as long as reasonably necessary for restaurant operations, order history, recordkeeping, and other legitimate business purposes.',
  'Information that is no longer required may be deleted when appropriate.',
  'You may request information about the personal data we hold about you, request corrections to inaccurate information, or request deletion of your personal information where applicable.',
  "Such requests can be submitted through the restaurant's official contact channels.",
  'We reserve the right to update this Privacy Policy when necessary to reflect changes in our services, technology, or applicable requirements.',
  'Any updates will be published with a revised effective date.',
  'For questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact the restaurant through its official communication channels.',
  'By using our ordering services, you acknowledge that you have read and understood this Privacy Policy.',
];

// ---------------------------------------------------------------- bundle + browser
await build({
  stdin: { contents: `
    import React, { act } from 'react';
    import { createRoot } from 'react-dom/client';
    import { LanguageProvider } from '@/context/LanguageContext';
    import Page from '@/app/privacy-policy/page';
    export { React, act, createRoot, LanguageProvider, Page };`, resolveDir: SRC, loader: 'jsx' },
  bundle: true, format: 'esm', platform: 'node', outfile: OUT, jsx: 'automatic', logLevel: 'error',
  loader: { '.js': 'jsx' }, define: { 'process.env.NODE_ENV': '"development"' },
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
  plugins: [{
    name: 'next-shims',
    setup(b) {
      b.onResolve({ filter: /^@\// }, (a) => b.resolve('./' + a.path.slice(2), { resolveDir: SRC, kind: a.kind }));
      b.onResolve({ filter: /^next\/image$/ }, () => ({ path: 'stub', namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ loader: 'jsx', resolveDir: SRC, contents: `import React from 'react';
        export default function Image({ src, alt, width, height, priority, fill, sizes, quality, placeholder, ...r }) { return React.createElement('img', { src: typeof src === 'string' ? src : '', alt, ...r }); }` }));
    },
  }],
});
await stopEsbuild?.();

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/privacy-policy', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Node', 'Event', 'MouseEvent', 'Element', 'SVGElement', 'DocumentFragment', 'MutationObserver', 'CustomEvent', 'localStorage', 'sessionStorage']) {
  Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true });
}
Object.defineProperty(globalThis, 'navigator', { value: w.navigator, configurable: true });
Object.defineProperty(globalThis, 'getComputedStyle', { value: w.getComputedStyle.bind(w), configurable: true });
Object.defineProperty(globalThis, 'requestAnimationFrame', { value: w.requestAnimationFrame.bind(w), configurable: true });
Object.defineProperty(globalThis, 'cancelAnimationFrame', { value: w.cancelAnimationFrame.bind(w), configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let fetchCalls = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = (...a) => { fetchCalls++; return realFetch(...a); };

// stand-ins for what jsdom lacks
const scrolled = [];
w.Element.prototype.scrollIntoView = function () { scrolled.push(this.id); };
let observerCallback = null;
globalThis.IntersectionObserver = class { constructor(cb) { observerCallback = cb; } observe() {} disconnect() {} };

const { React, act, createRoot, LanguageProvider, Page } = await import(pathToFileURL(OUT).href);
rmSync(OUT, { force: true });

const $ = (s) => document.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
const norm = (t) => t.replace(/\s+/g, ' ').trim();
let root = null;
async function mount(lang, hash = '') {
  if (root) await act(async () => { root.unmount(); });
  w.history.replaceState(null, '', '/privacy-policy' + hash);
  w.localStorage.clear(); w.localStorage.setItem('language', lang);
  document.body.innerHTML = '<div id="root"></div>';
  scrolled.length = 0;
  root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(LanguageProvider, null, React.createElement(Page))); });
  await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
}
after(async () => {
  if (root) await act(async () => { root.unmount(); });
  w.close();
  setTimeout(() => process.exit(), 2000).unref();
});

// ---------------------------------------------------------------- tests
test('English: every sentence of the owner\'s text is on the page, in order, word for word', async () => {
  await mount('en');
  const page = norm($('main').textContent);
  let from = 0;
  for (const sentence of SOURCE) {
    const at = page.indexOf(norm(sentence), from);
    assert.ok(at >= 0, `missing or out of order: "${sentence.slice(0, 80)}"`);
    from = at + sentence.length;
  }
});

test('English: structure - title, date, 10 numbered sections with the right titles', async () => {
  await mount('en');
  assert.equal($('h1').textContent, 'Privacy Policy');
  assert.ok(norm($('header').textContent).includes('Effective Date: November 20, 2026'));
  const sections = $$('article section');
  assert.equal(sections.length, 10);
  assert.deepEqual($$('article h2').map((h) => h.textContent), TITLES);
  sections.forEach((s, i) => assert.equal(s.id, `section-${i + 1}`));
  assert.equal($('main').getAttribute('dir'), 'ltr');
});

test('English: lists and labels - bullets per section, bold labels', async () => {
  await mount('en');
  const counts = $$('article section').map((s) => $$('li', s).length);
  assert.deepEqual(counts, [0, 4, 4, 6, 0, 2, 0, 0, 0, 0]);
  assert.deepEqual($$('article strong').map((x) => x.textContent.trim()), ['Customer Information:', 'Order Information:', 'Order History:', 'Technical Information:', 'WhatsApp / Meta:', 'Database and Hosting Providers:']);
  assert.ok(norm($('article').lastElementChild.textContent).startsWith('By using our ordering services'));
});

test('table of contents: lists all sections, scrolls to the right one, updates the address', async () => {
  await mount('en');
  const desktop = $$('nav[aria-label="Contents"] a');
  assert.equal(desktop.length, 10);
  assert.deepEqual(desktop.map((a) => a.getAttribute('href')), TITLES.map((_, i) => `#section-${i + 1}`));
  await act(async () => { desktop[5].dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true })); });
  assert.deepEqual(scrolled, ['section-6']);
  assert.equal(w.location.hash, '#section-6');
  assert.equal(desktop[5].getAttribute('aria-current'), 'location');
  assert.equal(desktop.filter((a) => a.getAttribute('aria-current')).length, 1);
  // mobile list works and closes itself
  const details = $('details');
  details.setAttribute('open', '');
  const mobile = $$('a', details);
  assert.equal(mobile.length, 10);
  await act(async () => { mobile[2].dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true })); });
  assert.equal(scrolled.at(-1), 'section-3');
  assert.equal(details.hasAttribute('open'), false);
});

test('the contents highlight follows the section being read', async () => {
  await mount('en');
  assert.ok(observerCallback, 'observer is set up');
  const target = $('#section-4');
  await act(async () => { observerCallback([{ isIntersecting: true, target }]); });
  const current = $$('nav[aria-label="Contents"] a').filter((a) => a.getAttribute('aria-current'));
  assert.equal(current.length, 1);
  assert.ok(current[0].textContent.includes('How We Use Your Information'));
});

test('a link like /privacy-policy#section-5 opens at that section', async () => {
  await mount('en', '#section-5');
  assert.ok(scrolled.includes('section-5'));
  assert.equal($$('nav[aria-label="Contents"] a')[4].getAttribute('aria-current'), 'location');
  await mount('en', '#section-99');
  assert.equal(scrolled.length, 0, 'an unknown section is ignored');
});

test('reading progress bar follows the scroll position', async () => {
  await mount('en');
  const bar = $('[data-testid=progress]');
  assert.equal(bar.style.width, '0%');
  Object.defineProperty(w, 'innerHeight', { value: 800, configurable: true });
  Object.defineProperty(w.document.documentElement, 'scrollHeight', { value: 2800, configurable: true });
  Object.defineProperty(w, 'scrollY', { value: 1000, configurable: true });
  await act(async () => { w.dispatchEvent(new w.Event('scroll')); });
  assert.equal(bar.style.width, '50%');
  Object.defineProperty(w, 'scrollY', { value: 99999, configurable: true });
  await act(async () => { w.dispatchEvent(new w.Event('scroll')); });
  assert.equal(bar.style.width, '100%');
  Object.defineProperty(w, 'scrollY', { value: 0, configurable: true });
});

test('Arabic: right-to-left, translated, same structure', async () => {
  await mount('ar');
  assert.equal($('main').getAttribute('dir'), 'rtl');
  assert.equal($('h1').textContent, 'سياسة الخصوصية');
  assert.ok(norm($('header').textContent).includes('تاريخ السريان: 20 نوفمبر 2026'));
  assert.equal($$('article section').length, 10);
  assert.deepEqual($$('article section').map((s) => $$('li', s).length), [0, 4, 4, 6, 0, 2, 0, 0, 0, 0]);
  assert.equal($$('nav[aria-label="المحتويات"] a').length, 10);
  const text = norm($('main').textContent);
  for (const title of TITLES) assert.equal(text.includes(title), false, `English title "${title}" leaked into the Arabic page`);
  assert.ok(text.includes('واتساب'));
  assert.ok(text.includes('نحن لا نبيع المعلومات الشخصية للعملاء ولا نؤجرها لأطراف ثالثة.'));
});

test('English and Arabic versions have identical structure', () => {
  const read = (l) => JSON.parse(readFileSync(path.join(SRC, 'locales', `${l}.json`), 'utf8')).privacy_policy;
  const en = read('en'), ar = read('ar');
  assert.equal(en.sections.length, ar.sections.length);
  en.sections.forEach((s, i) => {
    const a = ar.sections[i];
    assert.equal(s.before.length, a.before.length, `section ${i + 1} intro`);
    assert.equal(s.after.length, a.after.length, `section ${i + 1} closing`);
    assert.equal(s.items.length, a.items.length, `section ${i + 1} bullets`);
    s.items.forEach((it, k) => assert.equal(Boolean(it.label), Boolean(a.items[k].label), `section ${i + 1} bullet ${k + 1} label`));
  });
  for (const k of ['title', 'label', 'effective_label', 'effective_date', 'toc_title', 'acknowledgement']) {
    assert.ok(en[k].trim() && ar[k].trim(), k);
  }
});

test('the page makes no network requests and sets no cookies', async () => {
  await mount('en');
  assert.equal(fetchCalls, 0);
  assert.equal(w.document.cookie, '');
  assert.equal($$('script, iframe, form, input').length, 0);
});
