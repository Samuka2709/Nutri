/* =============================================================
   NUTRICIONISTA — interações (JavaScript puro)
   ============================================================= */

/* ---------- CONFIGURAÇÃO — preencha com os dados reais ---------- */
const CONFIG = {
  // WhatsApp somente com números: 55 + DDD + número. Ex.: '5511999998888'
  whatsapp: '', // [PREENCHER: WhatsApp com DDD]
  // Nome usado na saudação das mensagens
  nome: 'Marina', // [PREENCHER: Nome] — demo
};

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp: links com mensagem pré-preenchida ---------- */
  const waUrl = (text) => {
    const base = CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(text)}`;
  };
  const defaultMsg = `Olá, ${CONFIG.nome}! Vim pelo seu site e gostaria de saber mais sobre os atendimentos.`;

  if (!CONFIG.whatsapp) {
    console.warn('[PREENCHER] Número de WhatsApp não configurado em js/main.js (CONFIG.whatsapp).');
  }

  document.querySelectorAll('[data-wa]').forEach((el) => {
    const servico = el.dataset.servico;
    const msg = servico
      ? `Olá, ${CONFIG.nome}! Vim pelo seu site e gostaria de mais informações sobre: ${servico}.`
      : defaultMsg;
    el.href = waUrl(msg);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- Header: estado ao rolar ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  requestAnimationFrame(onScroll); // lê a rolagem no próximo quadro (evita recálculo forçado de layout)
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('nav-panel');
  const desktopNav = window.matchMedia('(min-width: 1180px)');

  const focusables = () => panel.querySelectorAll('a[href], button:not([disabled])');

  const openNav = () => {
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    setTimeout(() => panel.querySelector('.nav-close').focus(), 50);
  };
  const closeNav = (returnFocus = true) => {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (nav.classList.contains('is-open') ? closeNav() : openNav()));
  nav.querySelectorAll('[data-nav-close]').forEach((el) => el.addEventListener('click', () => closeNav()));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeNav(false)));

  document.addEventListener('keydown', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeNav();
    if (e.key === 'Tab') { // mantém o foco dentro do painel
      const items = [...focusables()].filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  desktopNav.addEventListener('change', (e) => { if (e.matches) closeNav(false); });

  /* ---------- Link ativo conforme a seção visível ---------- */
  const links = [...document.querySelectorAll('.nav-link')];
  const byId = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  const tracked = [...document.querySelectorAll('main section[id]')];
  let current = null;

  const setActive = (id) => {
    // Seções fora do menu (ex.: áreas, etapas) mantêm o item anterior
    if (!byId.has(id) || id === current) return;
    current = id;
    links.forEach((l) => {
      const on = l === byId.get(id);
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    tracked.forEach((s) => spy.observe(s));
  }
  // No fim da página (rodapé), a última seção do menu fica ativa
  window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (atBottom) setActive('contato');
  }, { passive: true });

  /* ---------- Revelação suave na rolagem (uma única vez) ---------- */
  // Grupos em cascata: cada filho recebe seu índice (--i) para o atraso
  document.querySelectorAll('.stagger').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });
  const reveals = document.querySelectorAll('.reveal, .stagger');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Botão flutuante do WhatsApp (após o hero) ---------- */
  const waFloat = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero');
  const contato = document.getElementById('contato');
  if (waFloat && hero && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let contactVisible = false;
    const update = () => waFloat.classList.toggle('is-visible', !heroVisible && !contactVisible);
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }, { threshold: .1 }).observe(hero);
    // Oculta na seção de contato, onde o botão principal já está visível
    new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }, { threshold: .2 }).observe(contato);
  }

  /* ---------- FAQ: acordeão (uma resposta aberta por vez) ---------- */
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-q button');
    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-q button').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Formulário de contato ---------- */
  const form = document.getElementById('form-contato');
  if (form) {
    const success = document.getElementById('form-success');
    const fields = {
      nome: form.elements.nome,
      contato: form.elements.contato,
      modalidade: form.elements.modalidade,
      consentimento: form.elements.consentimento,
    };

    const rules = {
      nome: (v) => (v.trim().length >= 2 ? '' : 'Informe seu nome.'),
      contato: (v) => {
        const value = v.trim();
        if (!value) return 'Informe um e-mail ou telefone para retorno.';
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        const digits = value.replace(/\D/g, '');
        const isPhone = !value.includes('@') && digits.length >= 10 && digits.length <= 13;
        return isEmail || isPhone ? '' : 'Digite um e-mail válido ou um telefone com DDD.';
      },
      modalidade: (v) => (v ? '' : 'Escolha uma modalidade.'),
      consentimento: (_, el) => (el.checked ? '' : 'Marque a caixa de consentimento para continuar.'),
    };

    const validate = (name) => {
      const el = fields[name];
      const msg = rules[name](el.value, el);
      const err = document.getElementById(el.getAttribute('aria-describedby'));
      err.textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    // Valida ao sair do campo; após erro, revalida enquanto digita
    Object.keys(fields).forEach((name) => {
      const el = fields[name];
      const evt = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur';
      el.addEventListener(evt, () => validate(name));
      el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validate(name); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      success.textContent = '';
      const results = Object.keys(fields).map(validate);
      if (results.includes(false)) {
        const firstInvalid = Object.values(fields).find((el) => el.getAttribute('aria-invalid') === 'true');
        firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      const nome = data.get('nome').trim();

      /* ENVIO VIA WHATSAPP (padrão) */
      const lines = [
        `Olá, ${CONFIG.nome}! Vim pelo seu site.`,
        '',
        `Nome: ${nome}`,
        `Contato: ${data.get('contato').trim()}`,
        `Modalidade de interesse: ${data.get('modalidade')}`,
      ];
      const msg = (data.get('mensagem') || '').trim();
      if (msg) lines.push(`Mensagem: ${msg}`);
      window.open(waUrl(lines.join('\n')), '_blank', 'noopener');

      /* ALTERNATIVA: FORMSPREE [PREENCHER: ID do formulário]
         Substitua o bloco acima por:
         fetch('https://formspree.io/f/SEU_ID', {
           method: 'POST', body: data, headers: { Accept: 'application/json' },
         }).then((r) => { if (!r.ok) throw new Error(); ... mostrar sucesso ... })
           .catch(() => { success.textContent = 'Não foi possível enviar agora. Tente pelo WhatsApp.'; });
      */

      success.textContent = `Obrigado, ${nome.split(' ')[0]}! Sua mensagem foi aberta no WhatsApp. Confirme o envio por lá.`;
      form.reset();
      Object.values(fields).forEach((el) => el.removeAttribute('aria-invalid'));
    });
  }

  /* ---------- Barra de progresso de leitura ---------- */
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    let ticking = false;
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener("resize", () => requestAnimationFrame(paint));
    requestAnimationFrame(paint);
  }

  /* ---------- Ano atual no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
