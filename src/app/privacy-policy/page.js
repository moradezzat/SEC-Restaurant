"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

const heading = 'text-[#2c3e50] dark:text-[#d3d3d3]';
const body = 'text-[#444444] dark:text-[#cecece]';

export default function PrivacyPolicyPage() {
  const { language, translations } = useLanguage();
  const p = translations.privacy_policy;
  const isAr = language === 'ar';

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const sections = useRef([]);

  const goTo = useCallback((index) => {
    setActive(index);
    sections.current[index]?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    try {
      window.history.replaceState(null, '', `#section-${index + 1}`);
    } catch {
      /* not available */
    }
  }, []);

  // Open straight at a section when the address ends with #section-N
  useEffect(() => {
    const match = /^#section-(\d+)$/.exec(window.location.hash);
    if (!match) return;
    const index = Number(match[1]) - 1;
    if (index >= 0 && index < p.sections.length) {
      setActive(index);
      sections.current[index]?.scrollIntoView?.({ block: 'start' });
    }
    // only on first render of the content
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Highlight the section being read
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const index = sections.current.indexOf(visible[0].target);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    sections.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [p.sections.length]);

  const tocLink = (section, index, onNavigate) => (
    <li key={index}>
      <a
        href={`#section-${index + 1}`}
        aria-current={active === index ? 'location' : undefined}
        onClick={(e) => {
          e.preventDefault();
          goTo(index);
          onNavigate?.(e);
        }}
        className={`flex gap-3 py-2 ps-4 border-s-2 text-sm transition-colors duration-200 ${
          active === index
            ? 'border-[#e74c3c] text-[#e74c3c] font-semibold'
            : 'border-gray-200 dark:border-[#333] text-[#666666] dark:text-[#b8b8b8] hover:text-[#e74c3c]'
        }`}
      >
        <span className="tabular-nums opacity-70">{String(index + 1).padStart(2, '0')}</span>
        <span>{section.title}</span>
      </a>
    </li>
  );

  return (
    <div className="bg-[#f5f5f5] text-[#333333] dark:bg-[#0f0f0f] min-h-screen flex flex-col transition-colors duration-300 ease">
      <div aria-hidden="true" className="fixed top-0 start-0 h-1 bg-[#e74c3c] z-[1000] transition-[width] duration-150"
        style={{ width: `${progress}%` }} data-testid="progress" />

      <Navbar />

      <main dir={isAr ? 'rtl' : 'ltr'} className="max-w-[1200px] mx-auto mb-12 px-4 sm:px-8 w-full flex-1 pt-[7.5rem]">
        <header className="mb-10 text-start">
          <p className="text-sm tracking-[0.2em] uppercase text-[#e74c3c] font-semibold">{p.label}</p>
          <h1 className={`text-[2.6rem] leading-tight font-bold mt-2 ${heading}`}>{p.title}</h1>
          <p className="mt-3 text-[#666666] dark:text-[#b8b8b8]">
            <span className="font-medium">{p.effective_label}:</span> {p.effective_date}
          </p>
        </header>

        {/* Mobile: collapsible contents */}
        <details className="lg:hidden mb-8 rounded-xl bg-white dark:bg-[#1e1e1e] shadow-md p-4">
          <summary className={`cursor-pointer font-semibold ${heading}`}>{p.toc_title}</summary>
          <ol className="mt-3">
            {p.sections.map((s, i) => tocLink(s, i, (e) => e.currentTarget.closest('details')?.removeAttribute('open')))}
          </ol>
        </details>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr] items-start">
          {/* Desktop: sticky contents */}
          <nav aria-label={p.toc_title} className="hidden lg:block lg:sticky lg:top-[6.5rem]">
            <p className={`mb-3 font-semibold ${heading}`}>{p.toc_title}</p>
            <ol>{p.sections.map((s, i) => tocLink(s, i))}</ol>
          </nav>

          <article className="flex flex-col gap-6 min-w-0">
            {p.sections.map((section, index) => (
              <section
                key={index}
                id={`section-${index + 1}`}
                ref={(el) => { sections.current[index] = el; }}
                className="scroll-mt-28 rounded-xl bg-white dark:bg-[#1e1e1e] shadow-md p-6 sm:p-8"
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span aria-hidden="true" className="text-4xl font-bold tabular-nums text-[#e74c3c]/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className={`text-2xl font-semibold ${heading}`}>{section.title}</h2>
                </div>

                <div className={`flex flex-col gap-4 leading-8 max-w-[72ch] ${body}`}>
                  {section.before.map((text, i) => <p key={`b${i}`}>{text}</p>)}
                  {section.items.length > 0 && (
                    <ul className="flex flex-col gap-2 ps-6 list-disc marker:text-[#e74c3c]">
                      {section.items.map((item, i) => (
                        <li key={i}>
                          {item.label && <strong className={heading}>{item.label} </strong>}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.after.map((text, i) => <p key={`a${i}`}>{text}</p>)}
                </div>
              </section>
            ))}

            <p className={`rounded-xl border-s-4 border-[#e74c3c] bg-white dark:bg-[#1e1e1e] shadow-md p-6 font-medium ${heading}`}>
              {p.acknowledgement}
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
