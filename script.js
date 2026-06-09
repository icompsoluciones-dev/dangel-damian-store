/* ══════════════════════════════════════════════════════
   DANGEL & DAMIÁN STORE · script.js
   Versión con tracking de conversiones WhatsApp + GA4
   ══════════════════════════════════════════════════════ */

// ── TRACKING HELPER ────────────────────────────────────
/**
 * Registra un evento de conversión en GA4 y en la consola.
 * @param {string} eventName   - Nombre del evento GA4
 * @param {object} params      - Parámetros adicionales del evento
 */
function trackEvent(eventName, params = {}) {
  // Google Analytics 4
  if (typeof window._gtag === 'function') {
    window._gtag('event', eventName, params);
  }
  // Debug en consola (desactiva en producción si deseas)
  console.info('[DD Tracking]', eventName, params);
}

// ── CONVERSIÓN: WHATSAPP BUTTONS ───────────────────────
/**
 * Configuración de todos los botones de WhatsApp con sus labels.
 * Cada entrada: { id, label, category }
 */
const WA_BUTTONS = [
  { id: 'nav-whatsapp',         label: 'Navbar — Escríbenos',      category: 'navegacion'  },
  { id: 'hero-whatsapp',        label: 'Hero — Consultar Ahora',   category: 'hero'        },
  { id: 'cta-sabanas',          label: 'Cat — Sábanas',            category: 'sabanas'     },
  { id: 'cta-perfumes',         label: 'Cat — Perfumes',           category: 'perfumes'    },
  { id: 'cta-moda',             label: 'Cat — Moda',               category: 'moda'        },
  { id: 'contact-whatsapp-btn', label: 'Contacto — CTA Principal', category: 'contacto'    },
  { id: 'float-whatsapp',       label: 'Flotante — WhatsApp',      category: 'flotante'    },
];

WA_BUTTONS.forEach(({ id, label, category }) => {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('click', () => {
    // Evento principal de conversión
    trackEvent('whatsapp_click', {
      event_category:  'whatsapp_conversion',
      event_label:     label,
      product_category: category,
      button_id:       id,
    });

    // También registra como conversión de lead en GA4
    trackEvent('generate_lead', {
      currency: 'USD',
      value: 1,
      lead_source: 'whatsapp',
      product_category: category,
    });
  });
});

// ── TRACKING: TIEMPO EN PÁGINA ──────────────────────────
// Dispara evento si el usuario llega a los 30s (engagement)
let engagementFired = false;
setTimeout(() => {
  if (!engagementFired) {
    trackEvent('page_engagement', {
      event_category: 'comportamiento',
      event_label: 'mas_de_30_segundos',
      value: 30,
    });
    engagementFired = true;
  }
}, 30000);

// ── TRACKING: SCROLL DEPTH ──────────────────────────────
const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
  [25, 50, 75, 100].forEach(pct => {
    if (!scrollMilestones[pct] && scrolled >= pct) {
      scrollMilestones[pct] = true;
      trackEvent('scroll_depth', {
        event_category: 'comportamiento',
        event_label: `scroll_${pct}_porciento`,
        value: pct,
      });
    }
  });
}, { passive: true });

// ── TRACKING: SECCIONES VISTAS ──────────────────────────
const trackedSections = ['nosotros', 'categorias', 'marcas', 'contacto'];
trackedSections.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        trackEvent('section_view', {
          event_category: 'navegacion',
          event_label: `vista_seccion_${id}`,
          section_name: id,
        });
        sectionObs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  sectionObs.observe(el);
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
const hamburger  = document.getElementById('hamburger');
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
const reveals  = document.querySelectorAll('.reveal');
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
const panels  = document.querySelectorAll('.brands-panel');

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

        // Tracking de tab activo
        trackEvent('brands_tab_click', {
          event_category: 'engagement',
          event_label: `tab_${tab}`,
          tab_name: tab,
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
    heroContent.style.opacity   = `${1 - scrolled / 700}`;
  }
}, { passive: true });

// ── CURSOR GLOW ON CARDS ───────────────────────────────
document.querySelectorAll('.cat-card, .brand-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width)  * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  });
});
