(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const bar = document.querySelector('.progress i');
  const toggle = document.querySelector('.toggle');
  const menu = document.querySelector('#menu');
  const hero = document.querySelector('.hero');

  function closeMenu() {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Odpri navigacijo');
    menu?.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zapri navigacijo' : 'Odpri navigacijo');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.querySelectorAll('a[href="#domov"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      closeMenu();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    });
  });
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); }, { passive: true });

  let navigationTimer;
  function showNavigation() {
    header?.classList.remove('nav-hidden');
    clearTimeout(navigationTimer);
    navigationTimer = setTimeout(() => {
      const menuOpen = toggle?.getAttribute('aria-expanded') === 'true';
      const navigationFocused = header?.contains(document.activeElement);
      const onHome = hero && scrollY < hero.offsetHeight - (header?.offsetHeight || 0);
      if (!onHome && !menuOpen && !navigationFocused) header?.classList.add('nav-hidden');
    }, 2000);
  }
  ['pointermove', 'pointerdown', 'touchstart', 'scroll'].forEach(eventName => {
    addEventListener(eventName, showNavigation, { passive: true });
  });
  addEventListener('keydown', showNavigation);
  header?.addEventListener('focusin', showNavigation);
  header?.addEventListener('mouseenter', showNavigation);
  showNavigation();

  let ticking = false;
  function updateScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header?.classList.toggle('scrolled', scrollY > 30);
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
      ticking = false;
    });
  }
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .1, rootMargin: '0px 0px -35px' });
    reveals.forEach(element => observer.observe(element));
  } else reveals.forEach(element => element.classList.add('visible'));

  document.querySelectorAll('.item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.item');
      const opening = !item.classList.contains('open');
      document.querySelectorAll('.item').forEach(entry => {
        entry.classList.remove('open');
        entry.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (opening) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.header nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }), { rootMargin: '-35% 0px -55%' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }

  document.querySelectorAll('[data-placeholder]').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  const form = document.querySelector('#contact-form');
  form?.querySelectorAll('input,textarea').forEach(field => field.addEventListener('input', () => field.closest('.field').classList.remove('invalid')));
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const required = [...form.querySelectorAll('[required]')];
    required.forEach(field => field.closest('.field').classList.toggle('invalid', !field.validity.valid));
    const invalid = required.find(field => !field.validity.valid);
    if (invalid) { invalid.focus(); return; }
    const data = new FormData(form);
    const body = `Ime in priimek: ${data.get('name')}\nE-pošta: ${data.get('email')}\nTelefon: ${data.get('phone') || 'ni naveden'}\n\n${data.get('message')}`;
    const url = `mailto:odvetnica.spelazamljen@gmail.com?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
    form.querySelector('.status').textContent = 'Odpiram vaš e-poštni program. Sporočilo pošljete od tam.';
    location.href = url;
  });
})();
