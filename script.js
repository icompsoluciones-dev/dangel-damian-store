/* ══════════════════════════════════════════════════════
   DANGEL & DAMIÁN STORE · script.js
   Versión con tracking de conversiones WhatsApp + GA4
   ══════════════════════════════════════════════════════ */

// ── TRACKING SIMPLE PARA GOOGLE TAG MANAGER ──────────────
const WA_BUTTONS = [
  'nav-whatsapp', 'hero-whatsapp', 'cta-sabanas', 
  'cta-perfumes', 'cta-moda', 'contact-whatsapp-btn', 'float-whatsapp'
];

WA_BUTTONS.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', () => {
      // Envía un evento súper simple a GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'whatsapp_click',
        'boton': id
      });
      console.log('✅ Clic en WhatsApp registrado:', id);
    });
  }
});

// ══════════════════════════════════════════════════════
//   UI INTERACTIVITY (sin cambios respecto a v1)
// ══════════════════════════════════════════════════════

// ── NAVBAR SCROLL ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE MENU ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── SCROLL TO TOP ──────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── REVEAL ON SCROLL ───────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach(el => observer.observe(el));

// ── BRANDS TABS ────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.brands-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('tab-active'));
    btn.classList.add('tab-active');

    panels.forEach(p => {
      if (p.id === `panel-${tab}`) {
        p.classList.remove('hidden');
        p.querySelectorAll('.brand-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        });
      } else {
        p.classList.add('hidden');
      }
    });
  });
});

// ── REVEAL AUTO-APPLY ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = [
    '.about-visual', '.about-text',
    '.cat-card', '.brand-card',
    '.contact-left', '.contact-right',
    '.promise-item', '.section-header',
  ];
  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  });
});

// ── ACTIVE LINK HIGHLIGHT ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// ── PARALLAX HERO ──────────────────────────────────────
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight && heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
    heroContent.style.opacity = `${1 - scrolled / 700}`;
  }
}, { passive: true });

// ── CURSOR GLOW ON CARDS ───────────────────────────────
document.querySelectorAll('.cat-card, .brand-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  });
});
