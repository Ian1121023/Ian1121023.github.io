(() => {
  document.documentElement.classList.remove('no-js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Flow-field background ---------- */
  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1, particles = [], t = 0;
  const mouse = { x: -9999, y: -9999 };
  const palette = ['242,181,107', '233,135,122', '143,184,232', '236,231,223'];

  function noise(x, y, z) {
    // cheap smooth pseudo-noise built from layered sines
    return (
      Math.sin(x * 1.7 + z) * Math.cos(y * 1.3 - z * 0.7) +
      Math.sin((x + y) * 0.9 + z * 1.3) * 0.5 +
      Math.cos(x * 0.6 - y * 2.1 + z * 0.4) * 0.35
    );
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.round(Math.min(900, (W * H) / 2600));
    particles = Array.from({ length: count }, spawn);
  }

  function spawn() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      life: Math.random() * 200 + 80,
      c: palette[Math.random() < 0.55 ? 0 : Math.random() < 0.5 ? 1 : Math.random() < 0.6 ? 2 : 3],
      s: Math.random() * 0.8 + 0.4,
    };
  }

  function step() {
    t += 0.0016;
    // fade previous frame toward transparent (body bg shows through) for clean trails
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    const scale = 0.0018;
    for (const p of particles) {
      const a = noise(p.x * scale, p.y * scale, t) * Math.PI * 1.6;
      let vx = Math.cos(a) * p.s;
      let vy = Math.sin(a) * p.s;

      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 32000) {
        const f = (1 - d2 / 32000) * 2.2;
        const d = Math.sqrt(d2) || 1;
        vx += (-dy / d) * f + (dx / d) * f * 0.3;
        vy += (dx / d) * f + (dy / d) * f * 0.3;
      }

      const nx = p.x + vx, ny = p.y + vy;
      const alpha = Math.min(1, p.life / 60) * 0.5;
      ctx.strokeStyle = `rgba(${p.c},${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      p.x = nx; p.y = ny; p.life--;
      if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
        Object.assign(p, spawn());
      }
    }
    requestAnimationFrame(step);
  }

  resize();
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(resize, 150);
  });

  if (reduce) {
    // draw a static composition instead of animating
    for (let i = 0; i < 120; i++) {
      for (const p of particles) {
        const a = noise(p.x * 0.0018, p.y * 0.0018, 0) * Math.PI * 1.6;
        const nx = p.x + Math.cos(a), ny = p.y + Math.sin(a);
        ctx.strokeStyle = `rgba(${p.c},0.05)`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny;
      }
    }
  } else {
    requestAnimationFrame(step);
  }

  /* ---------- Cursor glow ---------- */
  const glow = document.querySelector('.cursor');
  if (finePointer) {
    let gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      mouse.x = e.clientX; mouse.y = e.clientY;
      document.body.classList.add('has-pointer');
    });
    document.addEventListener('pointerleave', () => {
      mouse.x = mouse.y = -9999;
      document.body.classList.remove('has-pointer');
    });
    (function follow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  // stagger siblings
  const groups = new Map();
  reveals.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(i, 6) * 0.09}s`);
    groups.set(parent, i + 1);
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            el.classList.add('in');
            io.unobserve(el);
            if (el.classList.contains('tilt')) {
              setTimeout(() => el.classList.add('settled'), 1300);
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Nav state + timeline progress ---------- */
  const nav = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const timeline = document.querySelector('.timeline');
  const items = [...document.querySelectorAll('.timeline li')];

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);

    let current = -1;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
    });
    links.forEach((a, i) => a.classList.toggle('active', i === current));

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const mid = window.innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      timeline.style.setProperty('--progress', p.toFixed(4));
      items.forEach((li) => {
        li.classList.toggle('lit', li.getBoundingClientRect().top + 10 < mid);
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Card spotlight + tilt ---------- */
  if (finePointer && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Footer clock ---------- */
  const clock = document.getElementById('clock');
  document.getElementById('year').textContent = new Date().getFullYear();
  function tick() {
    clock.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Taipei',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
  tick();
  setInterval(tick, 15000);
})();
