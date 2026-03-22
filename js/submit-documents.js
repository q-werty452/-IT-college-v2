

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initLangSwitcher();
  initMultiStepForm();
  initFileUploads();
  initRevealAnimations();
});

/* ─── Scroll Progress Bar ─── */
function initScrollProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ─── Navbar Scroll ─── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ─── Mobile Menu ─── */
function initMobileMenu() {
  const toggle   = document.getElementById('nav-toggle');
  const mobile   = document.getElementById('nav-mobile');
  const closeBtn = document.getElementById('nav-mobile-close');
  if (!toggle || !mobile) return;

  const open  = () => { mobile.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobile.classList.remove('open'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', () => mobile.classList.contains('open') ? close() : open());
  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobile.contains(e.target)) close();
  });
}

/* ─── Language Switcher ─── */
function initLangSwitcher() {
  const ls = document.getElementById('lang-switcher');
  const lb = document.getElementById('lang-btn');
  if (!lb || !ls) return;

  lb.addEventListener('click', (e) => { e.stopPropagation(); ls.classList.toggle('open'); });
  document.addEventListener('click', () => ls.classList.remove('open'));
}

function setLang(lang) {
  const FLAGS = { ru: '🇷🇺', ky: '🇰🇬', en: '🇬🇧' };
  const CODES  = { ru: 'RU',   ky: 'KY',   en: 'EN' };
  const T = {
    ru: { nav_abit: 'Абитуриентам', nav_programs: 'Программы', nav_students: 'Студентам', nav_news: 'Новости', nav_contacts: 'Контакты', btn_apply: 'Поступить' },
    ky: { nav_abit: 'Абитуриенттерге', nav_programs: 'Программалар', nav_students: 'Студенттерге', nav_news: 'Жаңылыктар', nav_contacts: 'Байланыш', btn_apply: 'Тапшыруу' },
    en: { nav_abit: 'For Applicants', nav_programs: 'Programs', nav_students: 'For Students', nav_news: 'News', nav_contacts: 'Contacts', btn_apply: 'Apply' }
  };
  const flagEl = document.getElementById('lang-flag');
  const codeEl = document.getElementById('lang-code');
  if (flagEl) flagEl.textContent = FLAGS[lang];
  if (codeEl) codeEl.textContent = CODES[lang];
  document.querySelectorAll('.lang-option').forEach(o => o.classList.toggle('active', o.dataset.lang === lang));
  const ls = document.getElementById('lang-switcher');
  if (ls) ls.classList.remove('open');
  const dict = T[lang] || T.ru;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  try { localStorage.setItem('itcollege_lang', lang); } catch(e) {}
}

// Restore saved language
(function() {
  try {
    const saved = localStorage.getItem('itcollege_lang');
    if (saved && saved !== 'ru') setLang(saved);
  } catch(e) {}
})();

/* ─── Multi-step Form ─── */
function initMultiStepForm() {
  const form = document.getElementById('applicationForm');
  if (!form) return;

  const steps       = form.querySelectorAll('.form-step');
  const pSteps      = [
    document.getElementById('pStep1'),
    document.getElementById('pStep2'),
    document.getElementById('pStep3'),
  ];
  const pLines      = [
    document.getElementById('pLine1'),
    document.getElementById('pLine2'),
  ];
  let current = 0;

  function showStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));

    pSteps.forEach((s, i) => {
      if (!s) return;
      s.classList.toggle('active', i === idx);
      s.classList.toggle('done',   i <  idx);
    });
    pLines.forEach((l, i) => {
      if (!l) return;
      l.classList.toggle('done', i < idx);
    });

    window.scrollTo({ top: form.parentElement.offsetTop - 100, behavior: 'smooth' });
  }

  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current < steps.length - 1) { current++; showStep(current); }
    });
  });

  form.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) { current--; showStep(current); }
    });
  });

  const submitBtn  = form.querySelector('[data-submit]');
  const confirm    = document.getElementById('confirmationScreen');
  const progressWrap = document.getElementById('progressBar');

  if (submitBtn && confirm) {
    submitBtn.addEventListener('click', () => {
      form.style.display         = 'none';
      if (progressWrap) progressWrap.style.display = 'none';
      confirm.classList.add('active');
      confirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  showStep(0);
}

/* ─── File Uploads ─── */
function initFileUploads() {
  document.querySelectorAll('.file-upload').forEach(wrapper => {
    const input = wrapper.querySelector('input[type="file"]');
    const label = wrapper.querySelector('p');
    if (!input) return;

    // Click triggers file picker (input covers the area via position:absolute)
    input.addEventListener('change', () => {
      if (label && input.files.length > 0) {
        label.textContent = Array.from(input.files).map(f => f.name).join(', ');
        wrapper.style.borderColor = 'var(--primary)';
        wrapper.style.background  = 'rgba(14,165,233,.06)';
      }
    });

    // Drag & drop
    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      wrapper.style.borderColor = 'var(--primary)';
      wrapper.style.background  = 'rgba(14,165,233,.08)';
    });
    wrapper.addEventListener('dragleave', () => {
      wrapper.style.borderColor = '';
      wrapper.style.background  = '';
    });
    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length) {
        try { input.files = files; } catch (_) {}
        if (label) label.textContent = Array.from(files).map(f => f.name).join(', ');
        wrapper.style.borderColor = 'var(--primary)';
        wrapper.style.background  = 'rgba(14,165,233,.06)';
      }
    });
  });
}

/* ─── Reveal Animations on Scroll ─── */
function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}
