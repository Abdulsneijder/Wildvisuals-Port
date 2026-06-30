// ===== Ambient particle field (mouse-responsive) =====
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // respect accessibility setting, skip entirely

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animFrame;

  const COLORS = ['#FF3D6E', '#FFB800', '#00E5A0']; // pink, amber, mint — brand accent palette

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function particleCount() {
    // scale density to viewport, fewer on small screens for performance
    const area = window.innerWidth * window.innerHeight;
    return Math.max(28, Math.min(70, Math.round(area / 22000)));
  }

  function createParticles() {
    const count = particleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      baseAlpha: Math.random() * 0.35 + 0.15,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      // ambient drift
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // mouse interaction: gentle repel within radius
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 140;

      if (dist < radius) {
        const force = (1 - dist / radius) * 0.6;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 4;
        p.y += Math.sin(angle) * force * 4;
      }

      const alpha = dist < radius ? Math.min(1, p.baseAlpha + (1 - dist / radius) * 0.5) : p.baseAlpha;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    animFrame = requestAnimationFrame(step);
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  resize();
  createParticles();
  step();

  // pause animation when tab not visible, for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      animFrame = requestAnimationFrame(step);
    }
  });
})();


const burger = document.getElementById('navBurger');
const navLinksWrap = document.querySelector('.nav-links');

if (burger) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    document.body.classList.toggle('nav-open');
  });
}

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return; // no real image loaded into this slot yet
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== Reveal-on-scroll for sections =====
const revealEls = document.querySelectorAll('.gallery-item, .skill-card, .about-grid');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)';
  observer.observe(el);
});
