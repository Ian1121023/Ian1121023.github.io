(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);

  // Run a callback only while an element is on screen and the tab is visible.
  function whenVisible(el, cb) {
    let visible = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        cb(visible && !document.hidden);
      }, { threshold: 0.05 }).observe(el);
    } else {
      visible = true;
      cb(true);
    }
    document.addEventListener('visibilitychange', () => cb(visible && !document.hidden));
  }

  function fitCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: r.width, h: r.height };
  }

  const css = getComputedStyle(document.documentElement);
  const C = {
    amber: css.getPropertyValue('--amber').trim() || '#f2b56b',
    rose: css.getPropertyValue('--rose').trim() || '#e9877a',
    sky: css.getPropertyValue('--sky').trim() || '#8fb8e8',
    ink2: css.getPropertyValue('--ink-2').trim() || '#a9a49c',
    ink3: css.getPropertyValue('--ink-3').trim() || '#5f5c57',
    red: '#ff6b5b',
  };

  /* =========================================================
   * Demo 01 — ESP32 machine-health monitor
   * ======================================================= */
  (function espDemo() {
    const root = $('esp');
    if (!root) return;
    const canvas = $('espChart');
    const serial = $('serial');
    const btn = $('btnFault');
    const ledToggle = $('ledToggle');
    const thrIn = $('thr');
    const thrOut = $('thrOut');
    const led = $('espLed');
    const alm = $('espAlm');
    const rVib = $('rVib'), rTemp = $('rTemp'), rAmp = $('rAmp');
    const rStatus = $('rStatus').querySelector('b');

    const N = 120; // 30 s at 4 Hz
    const data = [];
    let fault = false, wear = 0, tick = 0, alarm = false;
    let temp = 38.5, amp = 3.2;
    let thr = parseFloat(thrIn.value);
    let timer = null;
    let view = fitCanvas(canvas);
    const lines = [];

    function stamp() {
      const s = Math.floor(tick / 4);
      return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }
    function log(text, cls = '') {
      lines.push(`<span class="t">[${stamp()}]</span> ${cls ? `<span class="${cls}">${text}</span>` : text}`);
      while (lines.length > 7) lines.shift();
      serial.innerHTML = lines.join('\n');
    }

    function sample() {
      const target = fault ? 1 : 0;
      wear += (target - wear) * (fault ? 0.035 : 0.14);
      const t = tick / 4;
      let vib = 1.6 + 0.25 * Math.sin(t / 1.7) + Math.random() * 0.35 + wear * 5.2;
      if (fault && Math.random() < 0.08) vib += Math.random() * 1.6;
      temp += (38.5 + wear * 14 + (Math.random() - 0.5) * 0.6 - temp) * 0.15;
      amp += (3.2 + wear * 0.9 + (Math.random() - 0.5) * 0.12 - amp) * 0.3;
      return Math.max(0, vib);
    }

    function step() {
      tick++;
      const vib = sample();
      data.push(vib);
      while (data.length > N) data.shift();

      const recent = data.slice(-4);
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const nowAlarm = avg > thr;

      rVib.textContent = vib.toFixed(2);
      rTemp.textContent = temp.toFixed(1);
      rAmp.textContent = amp.toFixed(2);

      if (nowAlarm !== alarm) {
        alarm = nowAlarm;
        root.classList.toggle('alarm', alarm);
        rStatus.textContent = alarm ? 'ALARM' : 'NORMAL';
        if (alarm) {
          log(`[WARN] vib ${avg.toFixed(2)} mm/s > ${thr.toFixed(1)} → GPIO25 HIGH`, 'w');
          log('[MQTT] publish factory/line3/pump1/alarm {"lvl":2}', 'w');
        } else {
          log('[INFO] vibration back to normal, alarm cleared', 'i');
        }
      }
      alm.classList.toggle('on', alarm && tick % 2 === 0);
      if (!alarm) alm.classList.remove('on');

      if (tick % 4 === 0) {
        log(`vib=${avg.toFixed(2)}mm/s temp=${temp.toFixed(1)}C I=${amp.toFixed(2)}A`);
      }
      draw();
    }

    function draw() {
      const { ctx, w, h } = view;
      ctx.clearRect(0, 0, w, h);
      const max = 10;
      const padT = 26, padB = 10;
      const y = (v) => padT + (1 - Math.min(v, max) / max) * (h - padT - padB);
      const x = (i) => (i / (N - 1)) * w;

      // grid
      ctx.strokeStyle = 'rgba(236,231,223,0.06)';
      ctx.lineWidth = 1;
      for (let v = 2; v <= 8; v += 2) {
        ctx.beginPath(); ctx.moveTo(0, y(v)); ctx.lineTo(w, y(v)); ctx.stroke();
      }

      // threshold
      const ty = y(thr);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = C.rose;
      ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(w, ty); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = C.rose;
      ctx.textAlign = 'right';
      ctx.fillText(`LIMIT ${thr.toFixed(1)}`, w - 8, ty - 6);

      if (data.length < 2) return;
      const off = N - data.length;
      const path = new Path2D();
      data.forEach((v, i) => (i ? path.lineTo(x(i + off), y(v)) : path.moveTo(x(i + off), y(v))));

      // fill
      const area = new Path2D(path);
      area.lineTo(x(N - 1), h);
      area.lineTo(x(off), h);
      area.closePath();
      const g = ctx.createLinearGradient(0, padT, 0, h);
      g.addColorStop(0, 'rgba(242,181,107,0.28)');
      g.addColorStop(1, 'rgba(242,181,107,0)');
      ctx.fillStyle = g;
      ctx.fill(area);

      // line: amber below the limit, red above it
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.save();
      ctx.beginPath(); ctx.rect(0, ty, w, h); ctx.clip();
      ctx.strokeStyle = C.amber; ctx.stroke(path);
      ctx.restore();
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, w, ty); ctx.clip();
      ctx.strokeStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 8; ctx.stroke(path);
      ctx.restore();

      // head
      const last = data[data.length - 1];
      ctx.fillStyle = last > thr ? C.red : C.amber;
      ctx.beginPath(); ctx.arc(x(N - 1) - 3, y(last), 3.5, 0, Math.PI * 2); ctx.fill();
    }

    btn.addEventListener('click', () => {
      fault = !fault;
      if (fault) {
        btn.textContent = '派工維修 (更換軸承)';
        btn.classList.add('fix');
        log('[SIM] bearing wear injected on pump #1', 'i');
      } else {
        btn.textContent = '模擬軸承磨損';
        btn.classList.remove('fix');
        log('[CM] LOTO → bearing replaced → test run OK · MTTR 00:38', 'i');
      }
    });
    ledToggle.addEventListener('change', () => {
      led.classList.toggle('on', ledToggle.checked);
      log(`> digitalWrite(2, ${ledToggle.checked ? 'HIGH' : 'LOW'})`, 'i');
    });
    thrIn.addEventListener('input', () => {
      thr = parseFloat(thrIn.value);
      thrOut.textContent = thr.toFixed(1);
      draw();
    });
    window.addEventListener('resize', () => { view = fitCanvas(canvas); draw(); });

    // pre-fill so the chart is never empty
    log('ESP32 boot · Wi-Fi connected · MQTT broker OK', 'i');
    for (let i = 0; i < N; i++) { tick++; data.push(sample()); }
    tick = 0;
    step();

    whenVisible(root, (on) => {
      if (on && !timer) timer = setInterval(step, 250);
      if (!on && timer) { clearInterval(timer); timer = null; }
    });
  })();

  /* =========================================================
   * Demo 02 — Oscilloscope: UART / I2C / SPI
   * ======================================================= */
  (function scopeDemo() {
    const root = $('scope');
    if (!root) return;
    const canvas = $('scopeCanvas');
    const read = $('scopeRead');
    const hexIn = $('hexIn');
    const tabs = [...root.querySelectorAll('.tab')];
    let proto = 'uart';
    let byte = 0x5a;
    let view = fitCanvas(canvas);
    let t0 = performance.now();
    let raf = null;

    const bitsMSB = (b, n = 8) => Array.from({ length: n }, (_, i) => (b >> (n - 1 - i)) & 1);
    const hex = (b) => '0x' + b.toString(16).toUpperCase().padStart(2, '0');
    const chr = (b) => (b >= 32 && b < 127 ? ` '${String.fromCharCode(b)}'` : '');

    function build() {
      if (proto === 'uart') {
        const tx = [], marks = [];
        const push = (v, n) => { for (let i = 0; i < n; i++) tx.push(v); };
        push(1, 3);
        marks.push({ a: tx.length, b: tx.length + 2, text: 'S' }); push(0, 2);
        bitsMSB(byte).reverse().forEach((v) => {
          marks.push({ a: tx.length, b: tx.length + 2, text: String(v) });
          push(v, 2);
        });
        marks.push({ a: tx.length, b: tx.length + 2, text: 'P' }); push(1, 2);
        push(1, 3);
        return {
          ch: [{ name: 'TX', color: C.amber, lv: tx }],
          marks,
          read: `UART · 9600 8N1 · LSB first → <b>${hex(byte)}</b>${chr(byte)}`,
        };
      }
      if (proto === 'spi') {
        const cs = [], sck = [], mosi = [], marks = [];
        const push = (c, k, m, n = 1) => { for (let i = 0; i < n; i++) { cs.push(c); sck.push(k); mosi.push(m); } };
        push(1, 0, 0, 2);
        push(0, 0, 0, 1);
        bitsMSB(byte).forEach((v) => {
          marks.push({ a: cs.length, b: cs.length + 2, text: String(v) });
          push(0, 0, v); push(0, 1, v);
        });
        push(0, 0, 0, 1);
        push(1, 0, 0, 2);
        return {
          ch: [
            { name: 'CS', color: C.rose, lv: cs },
            { name: 'SCK', color: C.sky, lv: sck },
            { name: 'MOSI', color: C.amber, lv: mosi },
          ],
          marks,
          read: `SPI · Mode 0 · MSB first → MOSI <b>${hex(byte)}</b>${chr(byte)}`,
        };
      }
      // I2C: write one data byte to an SSD1306 OLED at 0x3C
      const scl = [], sda = [], marks = [];
      const push = (c, d, n = 1) => { for (let i = 0; i < n; i++) { scl.push(c); sda.push(d); } };
      const bit = (v) => { push(0, v); push(1, v); push(1, v); push(0, v); };
      push(1, 1, 2);
      marks.push({ a: scl.length, b: scl.length + 2, text: 'S' }); push(1, 0, 2);
      let a = scl.length; bitsMSB(0x3c, 7).forEach(bit); marks.push({ a, b: scl.length, text: 'ADDR 0x3C' });
      a = scl.length; bit(0); marks.push({ a, b: scl.length, text: 'W' });
      a = scl.length; bit(0); marks.push({ a, b: scl.length, text: 'A' });
      a = scl.length; bitsMSB(byte).forEach(bit); marks.push({ a, b: scl.length, text: `DATA ${hex(byte)}` });
      a = scl.length; bit(0); marks.push({ a, b: scl.length, text: 'A' });
      a = scl.length; push(0, 0); push(1, 0); push(1, 1); marks.push({ a, b: scl.length, text: 'P' });
      push(1, 1, 2);
      return {
        ch: [
          { name: 'SCL', color: C.sky, lv: scl },
          { name: 'SDA', color: C.amber, lv: sda },
        ],
        marks,
        read: `I²C · 100 kHz · addr 0x3C (OLED) → <b>${hex(byte)}</b>${chr(byte)} · ACK ✓`,
      };
    }

    let sig = build();

    function draw(now) {
      const { ctx, w, h } = view;
      ctx.clearRect(0, 0, w, h);
      const left = 50, right = 14, top = 14, bandH = 34;
      const pw = w - left - right;
      const ph = h - top - bandH;

      // graticule
      ctx.strokeStyle = 'rgba(143,184,232,0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const gx = left + (pw * i) / 10;
        ctx.beginPath(); ctx.moveTo(gx, top); ctx.lineTo(gx, top + ph); ctx.stroke();
      }
      for (let i = 0; i <= 4; i++) {
        const gy = top + (ph * i) / 4;
        ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(left + pw, gy); ctx.stroke();
      }

      // sweep: 1.8 s draw, 1.4 s hold
      const cycle = 3200, drawT = 1800;
      const el = reduce ? drawT : (now - t0) % cycle;
      const p = Math.min(1, el / drawT);
      const ease = 1 - Math.pow(1 - p, 2);
      const units = sig.ch[0].lv.length;
      const ux = pw / units;
      const reach = left + pw * ease;

      const lane = ph / sig.ch.length;
      sig.ch.forEach((c, ci) => {
        const hiY = top + lane * ci + lane * 0.25;
        const loY = top + lane * ci + lane * 0.75;
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.85;
        ctx.fillText(c.name, 8, (hiY + loY) / 2 + 4);
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.beginPath(); ctx.rect(left, 0, reach - left, h); ctx.clip();
        ctx.beginPath();
        c.lv.forEach((v, i) => {
          const yy = v ? hiY : loY;
          const x0 = left + i * ux;
          if (i === 0) ctx.moveTo(x0, yy);
          else ctx.lineTo(x0, yy);
          ctx.lineTo(x0 + ux, yy);
        });
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();

        if (p < 1) {
          const idx = Math.min(units - 1, Math.floor((reach - left) / ux));
          ctx.fillStyle = '#fff';
          ctx.shadowColor = c.color; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.arc(reach, c.lv[idx] ? hiY : loY, 2.6, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // decode band
      const by = top + ph + 10;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      sig.marks.forEach((m) => {
        const x0 = left + m.a * ux + 1, x1 = left + m.b * ux - 1;
        if (x0 > reach) return;
        ctx.strokeStyle = 'rgba(242,181,107,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, by); ctx.lineTo(x0, by + 4); ctx.lineTo(x1, by + 4); ctx.lineTo(x1, by);
        ctx.stroke();
        ctx.fillStyle = m.text === 'A' || m.text === 'S' || m.text === 'P' ? C.sky : C.amber;
        ctx.fillText(m.text, (x0 + x1) / 2, by + 18);
      });

      if (!reduce) raf = requestAnimationFrame(draw);
    }

    function restart() {
      sig = build();
      read.innerHTML = sig.read;
      t0 = performance.now();
      if (reduce) draw(t0);
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
      proto = tab.dataset.proto;
      restart();
    }));
    hexIn.addEventListener('input', () => {
      hexIn.value = hexIn.value.replace(/[^0-9a-f]/gi, '').toUpperCase().slice(0, 2);
      if (hexIn.value) { byte = parseInt(hexIn.value, 16); restart(); }
    });
    window.addEventListener('resize', () => { view = fitCanvas(canvas); if (reduce) draw(0); });

    restart();
    if (reduce) draw(0);
    else {
      whenVisible(root, (on) => {
        if (on && !raf) { t0 = performance.now(); raf = requestAnimationFrame(draw); }
        if (!on && raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }
  })();

  /* =========================================================
   * Demo 03 — PLC ladder: motor start/stop with seal-in
   * ======================================================= */
  (function plcDemo() {
    const root = $('plc');
    if (!root) return;
    const s = { start: false, stop: false, ol: false, M: false };
    const motor = $('motor');
    const motorState = $('motorState');
    const set = (id, on) => $(id).classList.toggle('on', !!on);

    function scan() {
      s.M = (s.start || s.M) && !s.stop && !s.ol;
      const r1 = s.start || s.M;
      const r1b = r1 && !s.stop;
      ['w1a', 'w1b', 'w2a', 'w3a'].forEach((id) => set(id, true));
      set('cStart', s.start); set('w1c', s.start);
      set('cSeal', s.M); set('w1d', s.M);
      set('w1e', r1);
      set('cStop', r1b); set('w1f', r1b);
      set('cOl', r1b && !s.ol); set('w1g', s.M); set('kM', s.M);
      set('cM2', s.M); set('w2b', s.M); set('kY', s.M);
      set('cOl2', s.ol); set('w3b', s.ol); set('kA', s.ol);
      motor.classList.toggle('run', s.M);
      motor.classList.toggle('trip', s.ol);
      motorState.textContent = s.ol ? 'OL TRIP' : s.M ? 'RUNNING' : 'STOPPED';
    }

    function momentary(btn, key) {
      const down = () => { s[key] = true; btn.classList.add('down'); scan(); };
      const up = () => { if (!s[key]) return; s[key] = false; btn.classList.remove('down'); scan(); };
      btn.addEventListener('pointerdown', (e) => { e.preventDefault(); btn.setPointerCapture?.(e.pointerId); down(); });
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointercancel', up);
      btn.addEventListener('lostpointercapture', up);
      btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(); } });
      btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up(); } });
      btn.addEventListener('blur', up);
    }
    momentary($('pbStart'), 'start');
    momentary($('pbStop'), 'stop');
    $('olTrip').addEventListener('change', (e) => { s.ol = e.target.checked; scan(); });
    scan();
  })();
})();
