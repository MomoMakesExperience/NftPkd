import React from 'react';
import { CONFIG, UNIVERSES, rng } from './config';
import { st } from './st';

/* Le cœur lumineux à maintenir appuyé (remplace les boutons) */
const Orb = ({ hb, label, hint, blue, icon, labelStyle, hintStyle, ringBg, ringFill, className, style }: any) => (
      <div className={'orb-wrap ' + (className || '')} style={style}>
        <button
          className={'orb-btn ' + (blue ? 'orb-blue ' : '') + hb.cls}
          aria-label={label}
          onPointerDown={hb.down} onPointerUp={hb.up} onPointerLeave={hb.up} onPointerCancel={hb.up}
          onClick={hb.click} onContextMenu={(e) => e.preventDefault()}
        >
          <span className="orb-sat"><span></span><span></span></span>
          <svg className="orb-ring" width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <circle className="ring-bg" cx="48" cy="48" r="44" style={ringBg ? { stroke: ringBg } : undefined}></circle>
            <circle className="ring-fill" cx="48" cy="48" r="44" style={ringFill ? { stroke: ringFill } : undefined}></circle>
          </svg>
          <span className="orb-core">{icon}</span>
        </button>
        <span className="orb-label" style={labelStyle}><span className="orb-hint" style={hintStyle}>{hint}</span>{label}</span>
      </div>
    );

export default class App extends React.Component<any, any> {
  [key: string]: any;

  constructor(props: any) {
    super(props);
    this.state = {
      scene: 1, veil: 0, leaving: false, tx: 0, ty: 0, holding: null,
      envStage: 0, typed: 0, typingDone: false, typingOn: false,
      lit: [], active: -1, taps: 0,
      turned: 0, lastTurn: -1, dir: 'fwd',
      qi: 0, picked: -1, inviteOn: false,
      musicStarted: false, musicOn: false, outro: 'none'
    };
    this.timers = [];
    const r = rng(11);
    const pinkBlue = ['#FF6FB5', '#1E90FF', '#FFC2DF', '#8CC8FF'];
    this.orbs = Array.from({ length: 7 }, (_, i) => {
      const c = i % 2 === 0 ? ['#FFC2DF', '#FF4F9A', '#9D174D'] : ['#BFE0FF', '#1E90FF', '#0B3C80'];
      const size = 40 + r() * 110;
      return {
        left: (r() * 90).toFixed(1) + '%', top: (r() * 90).toFixed(1) + '%', size: size.toFixed(0) + 'px',
        bg: 'radial-gradient(circle at 32% 28%, ' + c[0] + ', ' + c[1] + ' 45%, ' + c[2] + ' 100%)',
        blur: (size > 110 ? 6 : r() * 2).toFixed(1) + 'px', dur: (6 + r() * 6).toFixed(1) + 's', delay: (-r() * 6).toFixed(1) + 's'
      };
    });
    this.specks = Array.from({ length: 46 }, () => ({
      left: (r() * 100).toFixed(1) + '%', top: (r() * 100).toFixed(1) + '%', size: (1 + r() * 2.2).toFixed(1) + 'px',
      dur: (2 + r() * 4).toFixed(1) + 's', delay: (r() * 4).toFixed(1) + 's'
    }));
    this.shoots = [{ left: '70%', top: '12%', delay: '1s' }, { left: '95%', top: '38%', delay: '4.5s' }, { left: '60%', top: '64%', delay: '7.5s' }];
    this.burst = Array.from({ length: 14 }, (_, i) => ({ angle: (i * 360 / 14).toFixed(0) + 'deg', color: pinkBlue[i % 4], delay: (r() * 0.1).toFixed(2) + 's' }));
    this.confetti = Array.from({ length: 12 }, () => ({ left: (60 + r() * 180).toFixed(0) + 'px', color: pinkBlue[Math.floor(r() * 4)], cx: (-90 + r() * 180).toFixed(0) + 'px', delay: (r() * 0.5).toFixed(2) + 's' }));
    this.orbitSparks = Array.from({ length: 10 }, (_, i) => { const a = i / 10 * 2 * Math.PI; return { x: (Math.cos(a) * 175).toFixed(1) + 'px', y: (Math.sin(a) * 175).toFixed(1) + 'px', color: pinkBlue[i % 4] }; });
    const petalColors = ['#FF6FB5', '#FFC2DF', '#FF4F9A', '#1E90FF', '#8CC8FF'];
    this.petals = Array.from({ length: 20 }, () => ({
      left: (r() * 100).toFixed(1) + '%', size: (10 + r() * 10).toFixed(0) + 'px',
      color: petalColors[Math.floor(r() * petalColors.length)],
      dur: (7 + r() * 6).toFixed(1) + 's', delay: (1 + r() * 9).toFixed(1) + 's'
    }));
    this.sparks = Array.from({ length: 22 }, () => ({
      left: (r() * 100).toFixed(1) + '%', color: pinkBlue[Math.floor(r() * 4)],
      dur: (5 + r() * 5).toFixed(1) + 's', delay: (r() * 7).toFixed(1) + 's'
    }));
    this.heartLayers = Array.from({ length: 11 }, (_, i) => ({
      z: (i * 1.6 - 8).toFixed(1) + 'px',
      fill: i === 10 ? '#FF6FB5' : i === 0 ? '#1E90FF' : (i > 5 ? '#C2316F' : '#A8255D')
    }));
    this.lanternPos = [[24, 170], [92, 210], [160, 168], [228, 214], [56, 92], [126, 120], [196, 86], [250, 130]].map((p, i) => ({
      left: p[0] + 'px', top: p[1] + 'px', dur: (3 + r() * 2).toFixed(1) + 's', delay: (-r() * 3).toFixed(1) + 's',
      bg: i % 2 === 0 ? 'linear-gradient(180deg,#FFE3F1,#FF6FB5)' : 'linear-gradient(180deg,#DCEEFF,#4AA8FF)'
    }));
    const hx = (t) => 16 * Math.pow(Math.sin(t), 3);
    const hy = (t) => 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const px = (x) => 150 + x * 8.5;
    const py = (y) => 140 - (y + 2.7) * 8.5;
    this.starPts = Array.from({ length: 8 }, (_, i) => { const t = i * Math.PI / 4; return { x: px(hx(t)), y: py(hy(t)) }; });
    let d = '';
    for (let i = 0; i <= 80; i++) { const t = i / 80 * 2 * Math.PI; d += (i ? ' L ' : 'M ') + px(hx(t)).toFixed(1) + ' ' + py(hy(t)).toFixed(1); }
    this.heartPath = d + ' Z';
    // Cire du sceau : un disque aux bords irréguliers, comme une vraie cire coulée
    const bumps = [46, 44, 47.5, 43, 45.5, 48, 44.5, 46.5, 43.5, 47, 45, 48, 44, 46];
    let sp = '';
    const npts = bumps.length * 3;
    for (let i = 0; i <= npts; i++) {
      const a = i / npts * 2 * Math.PI;
      const k = i / 3, k0 = Math.floor(k) % bumps.length, k1 = (k0 + 1) % bumps.length, f = k - Math.floor(k);
      const rr = bumps[k0] * (1 - f) + bumps[k1] * f;
      sp += (i ? ' L ' : 'M ') + (50 + Math.cos(a) * rr).toFixed(1) + ' ' + (50 + Math.sin(a) * rr).toFixed(1);
    }
    this.sealPath = sp + ' Z';
    // Lettre : positions de chaque paragraphe dans le texte complet
    this.paraOffs = []; let acc = 0;
    CONFIG.letter.paragraphs.forEach((p) => { this.paraOffs.push(acc); acc += p.length; });
    this.totalChars = acc;
  }

  componentDidMount() {
    try { this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { this.reduced = false; }
  }
  componentWillUnmount() {
    this.timers.forEach(clearTimeout);
    clearTimeout(this.typeTimer); clearTimeout(this.holdTimer);
    if (this.musicTimer) clearInterval(this.musicTimer);
    try { if (this.raf) cancelAnimationFrame(this.raf); if (this.audioEl) this.audioEl.pause(); if (this.ctx) this.ctx.close(); } catch (e) {}
  }
  later(fn, ms) { this.timers.push(setTimeout(fn, ms)); }
  go(n) {
    this.setState({ veil: 1, holding: null });
    this.later(() => { this.setState({ scene: n }); if (n === 3) this.startTyping(); }, 720);
    this.later(() => this.setState({ veil: 0 }), 820);
  }
  onMove(e) {
    if (this.reduced || !e) return;
    const w = window.innerWidth || 390, h = window.innerHeight || 844;
    const nx = e.clientX / w - 0.5, ny = e.clientY / h - 0.5;
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = null; this.setState({ tx: -ny * 12, ty: nx * 16 }); });
  }

  /* ─── Le cœur à maintenir ─── */
  holdDown(id, fn, e) {
    if (e && e.pointerType === 'mouse' && e.button !== 0) return;
    clearTimeout(this.holdTimer);
    this.setState({ holding: id });
    this.sfx('soft');
    this.holdTimer = setTimeout(() => { this.holdTimer = null; this.setState({ holding: null }); this.sfx('chime'); fn(); }, this.reduced ? 300 : 900);
  }
  holdUp() {
    if (this.holdTimer) { clearTimeout(this.holdTimer); this.holdTimer = null; }
    if (this.state.holding) this.setState({ holding: null });
  }

  /* ─── Lettre écrite en direct ─── */
  startTyping() {
    clearTimeout(this.typeTimer);
    this.setState({ typed: 0, typingDone: false, typingOn: true });
    const step = () => {
      const n = this.state.typed + 1;
      if (n >= this.totalChars) { this.finishTyping(); return; }
      this.setState({ typed: n });
      const all = CONFIG.letter.paragraphs.join('');
      const ch = all[n - 1];
      if (n % 3 === 0) this.sfx('pen');
      if (n % 12 === 0) this.scrollLetter();
      let delay = this.reduced ? 6 : 34;
      if (/[.!?…]/.test(ch)) delay = 380; else if (/[,;:]/.test(ch)) delay = 200;
      if (this.paraOffs.indexOf(n) > 0) delay = 650;
      this.typeTimer = setTimeout(step, delay);
    };
    this.typeTimer = setTimeout(step, 1400);
  }
  finishTyping() {
    clearTimeout(this.typeTimer);
    this.setState({ typed: this.totalChars, typingDone: true, typingOn: false });
    this.later(() => this.scrollLetter(), 300);
    this.later(() => this.scrollLetter(), 1700);
  }
  scrollLetter() {
    try { const el = this.letterEl; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); } catch (e) {}
  }

  /* ─── Audio ─── */
  ensureAudio() {
    if (this.ctx) return this.ctx;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 1; this.master.connect(this.ctx.destination);
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) { this.ctx = null; }
    return this.ctx;
  }
  tone(freq: number, dur: number, vol: number, type?: any, freqEnd?: number) {
    const c = this.ctx; if (!c) return;
    try {
      const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
      if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.05, dur / 4));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  noise(dur: number, vol: number, filterFreq?: number, type?: any) {
    const c = this.ctx; if (!c) return;
    try {
      const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const p = i / len; data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * p); }
      const src = c.createBufferSource(); src.buffer = buf;
      const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = filterFreq || 1800;
      const g = c.createGain(); g.gain.value = vol;
      src.connect(f); f.connect(g); g.connect(this.master); src.start();
    } catch (e) {}
  }
  startMusic() {
    if (this.state.musicStarted) return;
    this.ensureAudio();
    this.setState({ musicStarted: true, musicOn: true });
    if (CONFIG.musicUrl) {
      try { this.audioEl = new Audio(CONFIG.musicUrl); this.audioEl.loop = true; this.audioEl.volume = 0.5; const p = this.audioEl.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
      return;
    }
    if (!this.ctx) return;
    const chords = [[261.63, 329.63, 392.0, 493.88], [220.0, 261.63, 329.63, 392.0], [174.61, 220.0, 261.63, 329.63], [196.0, 246.94, 293.66, 392.0]];
    const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
    let step = 0;
    this.musicTimer = setInterval(() => {
      if (!this.state.musicOn || !this.ctx) { step++; return; }
      const ch = chords[Math.floor(step / 8) % 4];
      this.tone(ch[pattern[step % 8]] * 2, 1.8, 0.022, 'sine');
      if (step % 8 === 0) { this.tone(ch[0] / 2, 4.6, 0.03, 'sine'); this.tone(ch[0], 4.6, 0.012, 'triangle'); }
      step++;
    }, 560);
  }
  sfx(kind) {
    if (!this.ctx || !this.state.musicOn) return;
    if (kind === 'chime') { this.tone(1318.5, 1.4, 0.04); this.tone(1975.5, 1.1, 0.02); }
    if (kind === 'seal') { this.noise(0.18, 0.18, 2400); this.tone(180, 0.2, 0.05, 'triangle', 90); }
    if (kind === 'paper') { this.noise(0.6, 0.05, 3500, 'highpass'); }
    if (kind === 'page') { this.noise(0.7, 0.07, 2600, 'highpass'); }
    if (kind === 'pen') { this.noise(0.04, 0.025, 5000, 'highpass'); }
    if (kind === 'soft') { this.tone(880, 0.6, 0.025); }
    if (kind === 'flip') { this.noise(0.4, 0.05, 3000, 'highpass'); this.tone(660, 0.5, 0.02); }
    if (kind === 'whoosh') { this.noise(0.9, 0.05, 900, 'lowpass'); this.tone(520, 1.2, 0.02, 'sine', 1040); }
    if (kind === 'tv') { this.tone(1500, 0.45, 0.04, 'sine', 50); this.noise(0.35, 0.06, 4000, 'highpass'); }
  }

  /* ─── Scènes ─── */
  startJourney() {
    if (this.state.leaving) return;
    this.startMusic();
    this.setState({ leaving: true });
    this.later(() => this.go(2), 650);
  }
  openEnvelope() {
    if (this.state.envStage > 0) return;
    const k = this.reduced ? 0.4 : 1;
    this.setState({ envStage: 1 }); this.sfx('seal');
    this.later(() => this.setState({ envStage: 2 }), 650 * k);
    this.later(() => { this.setState({ envStage: 3 }); this.sfx('paper'); }, 1450 * k);
    this.later(() => this.setState({ envStage: 4 }), 2700 * k);
  }
  pick(i) {
    if (this.state.lit.indexOf(i) >= 0) { this.setState({ active: i, taps: this.state.taps + 1 }); return; }
    this.setState({ lit: this.state.lit.concat([i]), active: i, taps: this.state.taps + 1 });
    const u = CONFIG.universe || 'Étoiles';
    this.sfx(u === 'Lanternes' ? 'whoosh' : u === 'Rose' ? 'flip' : 'chime');
  }
  leafCount() { return CONFIG.photos.length + 1; }
  nextPage() {
    const t = this.state.turned;
    if (t >= this.leafCount()) return;
    this.setState({ turned: t + 1, lastTurn: t, dir: 'fwd' }); this.sfx('page');
  }
  prevPage() {
    const t = this.state.turned;
    if (t <= 0) return;
    this.setState({ turned: t - 1, lastTurn: t - 1, dir: 'bwd' }); this.sfx('page');
  }
  pickAnswer(j) { if (this.state.picked >= 0) return; this.setState({ picked: j }); this.sfx('flip'); }
  nextQuestion() {
    if (this.state.qi + 1 < CONFIG.questions.length) {
      this.setState({ picked: -1 }); this.sfx('flip');
      this.later(() => this.setState({ qi: this.state.qi + 1 }), 420);
    } else this.setState({ inviteOn: true });
  }
  startOutro() {
    this.go(8);
    this.setState({ outro: 'sig' });
    this.later(() => { this.setState({ outro: 'off' }); this.sfx('tv'); }, 820 + 4600);
    this.later(() => this.setState({ outro: 'black' }), 820 + 4600 + 1900);
  }
  toggleMusic() {
    const on = !this.state.musicOn;
    this.setState({ musicOn: on });
    try {
      if (this.master && this.ctx) this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.1);
      if (this.audioEl) { if (on) { const p = this.audioEl.play(); if (p && p.catch) p.catch(() => {}); } else this.audioEl.pause(); }
    } catch (e) {}
  }

  renderVals() {
    const s = this.state, C = CONFIG;
    const stage = s.envStage;
    const envClass = (stage >= 1 ? 's1 ' : '') + (stage >= 2 ? 's2 ' : '') + (stage >= 3 ? 's3' : '');
    const uName = UNIVERSES[CONFIG.universe] ? CONFIG.universe : 'Étoiles';
    const U = UNIVERSES[uName];
    const isLit = (i) => s.lit.indexOf(i) >= 0;

    const mk = (id, fn) => ({
      cls: s.holding === id ? 'holding' : '',
      down: (e) => this.holdDown(id, fn, e),
      up: () => this.holdUp(),
      click: (e) => { if (e && e.detail === 0) fn(); }
    });
    const h = {
      intro: mk('intro', () => this.startJourney()),
      letter: mk('letter', () => { this.sfx('whoosh'); this.go(3); }),
      stars: mk('stars', () => this.go(4)),
      album: mk('album', () => this.go(5)),
      invite: mk('invite', () => this.go(6)),
      finale: mk('finale', () => this.go(7)),
      forever: mk('forever', () => this.startOutro())
    };

    const stars = this.starPts.map((p, i) => ({
      left: (p.x - 26).toFixed(1) + 'px', top: (p.y - 26).toFixed(1) + 'px',
      cls: isLit(i) ? 'lit' : '',
      label: 'Étoile ' + (i + 1) + (isLit(i) ? ' : ' + C.reasons[i] : ' : une raison secrète'),
      pick: () => this.pick(i)
    }));
    const petals8 = Array.from({ length: 8 }, (_, i) => ({
      angle: (i * 45) + 'deg', cls: isLit(i) ? 'gone' : '', delay: (i * 0.3).toFixed(1) + 's',
      label: 'Pétale ' + (i + 1) + (isLit(i) ? ' : cueilli' : ' : à cueillir'),
      pick: () => this.pick(i)
    }));
    const lanterns = this.lanternPos.map((l, i) => ({
      left: l.left, top: l.top, dur: l.dur, delay: l.delay, bg: l.bg,
      cls: isLit(i) ? 'up' : '',
      label: 'Lanterne ' + (i + 1) + (isLit(i) ? ' : envolée' : ' : à laisser s’envoler'),
      pick: () => this.pick(i)
    }));

    const N = this.leafCount();
    const leaves = Array.from({ length: N }, (_, i) => {
      const turned = i < s.turned;
      const isLast = i === s.lastTurn;
      const cls = (turned ? 'turned ' : '') + (isLast ? s.dir : '');
      const z = isLast ? 300 : (turned ? i : 100 - i);
      if (i === 0) return { cls, z, isCover: true, isPhoto: false, bg: 'linear-gradient(150deg, #1E90FF 0%, #0E5FB8 55%, #0A3D80 100%)' };
      const ph = C.photos[i - 1];
      const land = ph.orientation === 'paysage';
      return {
        cls, z, isCover: false, isPhoto: true, bg: '#FFF8F2',
        hasSrc: !!ph.src, noSrc: !ph.src, src: ph.src || '', file: ph.file, caption: ph.caption,
        ratio: land ? '4 / 3' : '3 / 4', slotW: land ? '100%' : '78%',
        slotLabel: 'Photo ' + i + ' · ' + (land ? 'horizontale' : 'verticale'),
        pageNum: i + ' / ' + C.photos.length
      };
    });

    // Lettre : texte affiché jusqu’au caractère tapé
    const letterParas = [];
    C.letter.paragraphs.forEach((p, i) => {
      const start = this.paraOffs[i];
      if (s.typed < start && !(i === 0 && s.typingOn)) return;
      const shown = Math.max(0, Math.min(p.length, s.typed - start));
      const nextStart = i + 1 < this.paraOffs.length ? this.paraOffs[i + 1] : Infinity;
      letterParas.push({ text: p.slice(0, shown), caret: !s.typingDone && s.typed >= start && s.typed < nextStart });
    });

    const q = C.questions[Math.min(s.qi, C.questions.length - 1)];
    const answers = q.answers.map((a, j) => ({ label: a.label, pick: () => this.pickAnswer(j) }));
    const last = s.qi + 1 >= C.questions.length;

    const tX = s.tx, tY = s.ty;
    const dots = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ w: n === s.scene ? '24px' : '7px', bg: n === s.scene ? '#FF6FB5' : (n < s.scene ? '#1E90FF' : 'rgba(255,255,255,.25)') }));

    return {
      s1: s.scene === 1, s2: s.scene === 2, s3: s.scene === 3, s4: s.scene === 4,
      s5: s.scene === 5, s6: s.scene === 6, s7: s.scene === 7,
      outroScreen: s.scene === 8 && (s.outro === 'sig' || s.outro === 'off'),
      tvOff: s.scene === 8 && s.outro === 'off',
      tvClass: s.scene === 8 && (s.outro === 'off' || s.outro === 'black') ? 'tvoff' : '',
      rootBg: s.scene === 8 ? '#000000' : '#070B24',
      veil: s.veil, leavingClass: s.leaving ? 'leaving' : '',
      tiltX: tX.toFixed(2), tiltY: tY.toFixed(2), tiltXs: (tX * 0.5).toFixed(2), tiltYs: (tY * 0.5).toFixed(2),
      onMove: (e) => this.onMove(e),
      prevent: (e) => { try { e.preventDefault(); } catch (err) {} },
      h,
      showChrome: s.scene >= 2 && s.scene <= 7,
      showMute: s.musicStarted && s.scene <= 7,
      musicOn: s.musicOn, musicOff: !s.musicOn,
      muteLabel: s.musicOn ? 'Couper la musique' : 'Réactiver la musique',
      toggleMusic: () => this.toggleMusic(), dots,

      intro: C.intro, initials: C.initials, herName: C.herName, herFirstName: C.herFirstName,
      signature: C.signature, finalSignature: C.finalSignature, coverNames: C.herFirstName + ' & ' + C.signature,
      orbs: this.orbs, specks: this.specks, shoots: this.shoots, petals: this.petals, sparks: this.sparks, heartLayers: this.heartLayers,
      sealPath: this.sealPath, burst: this.burst, confetti: this.confetti, orbitSparks: this.orbitSparks,

      envClass, envClosed: stage === 0, envReady: stage >= 4,
      openEnvelope: () => this.openEnvelope(),
      envDown: (e) => { this.downY = e && e.clientY; },
      envUp: (e) => { if (this.downY != null && e && this.downY - e.clientY > 30) this.openEnvelope(); this.downY = null; },

      letter: C.letter, letterParas, typingDone: s.typingDone, typingOn: s.typingOn && !s.typingDone,
      skipTyping: () => this.finishTyping(),
      letterRef: (el) => { this.letterEl = el; },

      uni: { title: U.title, hint: U.hint, unit: U.unit, done: U.done, isStars: uName === 'Étoiles', isRose: uName === 'Rose', isLanterns: uName === 'Lanternes' },
      stars, petals8, lanterns, heartPath: this.heartPath,
      roseRX: (24 + tX * 0.5).toFixed(2),
      litCount: s.lit.length, allLit: s.lit.length >= 8,
      msgA: s.active >= 0 && s.taps % 2 === 1, msgB: s.active >= 0 && s.taps % 2 === 0,
      activeTitle: s.active >= 0 ? U.item + ' n° ' + (s.active + 1) : '',
      activeMsg: s.active >= 0 ? C.reasons[s.active] : '',

      leaves, bookRX: (10 + tX * 0.6).toFixed(2), bookRY: (-6 + tY * 0.8).toFixed(2),
      atStart: s.turned <= 0, atEnd: s.turned >= N,
      pageLabel: s.turned === 0 ? 'Couverture' : (s.turned >= N ? 'Fin' : 'Page ' + s.turned + ' / ' + C.photos.length),
      nextPage: () => this.nextPage(), prevPage: () => this.prevPage(),
      bookDown: (e) => { if (e) { this.bx = e.clientX; this.by = e.clientY; } },
      bookUp: (e) => {
        if (!e || this.bx == null) return;
        const dx = e.clientX - this.bx, dy = e.clientY - this.by;
        this.bx = null;
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) this.nextPage(); else this.prevPage(); return; }
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          let mid = 0.5;
          try { const rc = e.currentTarget.getBoundingClientRect(); mid = (e.clientX - rc.left) / rc.width; } catch (err) {}
          if (mid < 0.3) this.prevPage(); else this.nextPage();
        }
      },

      quizOn: !s.inviteOn, inviteOn: s.inviteOn,
      q, answers, qNum: s.qi + 1, qTotal: C.questions.length,
      flipClass: s.picked >= 0 ? 'on' : '',
      pickedLabel: s.picked >= 0 ? q.answers[s.picked].label : '',
      reaction: s.picked >= 0 ? q.answers[s.picked].reaction : '',
      nextLabel: last ? 'Voir l’invitation' : 'Question suivante',
      nextQuestion: () => this.nextQuestion(),
      invitation: C.invitation, inviteDetails: C.invitation.details,

      declLines: C.declaration.map((t, i) => ({ text: t, delay: (3.6 + i * 1.8).toFixed(1) + 's' })),
      declSignDelay: (3.6 + C.declaration.length * 1.8).toFixed(1) + 's',
      declBtnDelay: (4.6 + C.declaration.length * 1.8).toFixed(1) + 's'
    };
  }

  render() {
    const v: any = this.renderVals();
    const HEART = 'M12 21s-7.5-4.6-10-9.2C.4 8.6 2.2 4.4 6 4.1c2.3-.2 4.1 1.2 6 3.6 1.9-2.4 3.7-3.8 6-3.6 3.8.3 5.6 4.5 4 7.7C19.5 16.4 12 21 12 21z';

    const sealSvg = (withDefs: boolean) => (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {withDefs && (
          <defs>
            <radialGradient id="waxG" cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#F0567F"></stop><stop offset=".45" stopColor="#B3124A"></stop><stop offset="1" stopColor="#5E0624"></stop></radialGradient>
            <radialGradient id="waxIn" cx="60%" cy="65%" r="70%"><stop offset="0" stopColor="#C21A55"></stop><stop offset="1" stopColor="#7A0A30"></stop></radialGradient>
          </defs>
        )}
        <path d={v.sealPath} fill="url(#waxG)"></path>
        <circle cx="50" cy="50" r="31" fill="url(#waxIn)" stroke="#E04A78" strokeWidth="1.6"></circle>
        <circle cx="50" cy="50" r="27" fill="none" stroke="#5E0624" strokeWidth="1" strokeDasharray="1.5 3"></circle>
        <ellipse cx="34" cy="28" rx="10" ry="5" fill="#FFFFFF" opacity=".22" transform="rotate(-30 34 28)"></ellipse>
      </svg>
    );

    const msgCard = (
      <div className="msg" style={st('display: flex; flex-direction: column; gap: 6px; padding: 16px 20px; border-radius: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(140,200,255,.35)')}>
        <span className="kicker" style={{ color: '#FF8CC6' }}>{v.activeTitle}</span>
        <span style={st('font-size: 21px; font-weight: 500; line-height: 1.35')}>{v.activeMsg}</span>
      </div>
    );

    return (
      <div onPointerMove={v.onMove} style={st(`position: relative; width: 100%; height: 100%; min-height: 100vh; overflow: hidden; background: ${v.rootBg}; color: #FFFFFF; font-family: 'Montserrat', system-ui, sans-serif`)}>
        <div className={v.tvClass} style={st('position: absolute; inset: 0')}>

          {/* Fond vivant commun à toutes les scènes */}
          <div className="aurora" aria-hidden="true">
            <span className="blob b1"></span><span className="blob b2"></span><span className="blob b3"></span><span className="blob b4"></span>
            <div className="grain"></div>
            {v.specks.map((sk: any, i: number) => (
              <span key={i} className="speck" style={st(`left: ${sk.left}; top: ${sk.top}; width: ${sk.size}; height: ${sk.size}; animation-duration: ${sk.dur}; animation-delay: ${sk.delay}`)}></span>
            ))}
            {v.shoots.map((sh: any, i: number) => (
              <span key={i} className="shoot" style={st(`left: ${sh.left}; top: ${sh.top}; animation-delay: ${sh.delay}`)}></span>
            ))}
          </div>

          {/* ═════ SCÈNE 1 ═════ */}
          {v.s1 && (
            <section className={'scene ' + v.leavingClass} style={st('display: flex; align-items: center; justify-content: center; padding: 32px 26px')}>
              <div className="stage" aria-hidden="true" style={st(`position: absolute; inset: 0; pointer-events: none; transform: rotateX(${v.tiltX}deg) rotateY(${v.tiltY}deg)`)}>
                {v.orbs.map((o: any, i: number) => (
                  <span key={i} className="orb" style={st(`left: ${o.left}; top: ${o.top}; width: ${o.size}; height: ${o.size}; background: ${o.bg}; filter: blur(${o.blur}); animation-duration: ${o.dur}; animation-delay: ${o.delay}`)}></span>
                ))}
              </div>
              <div className="flare" aria-hidden="true"></div>
              <div className="stage" style={st(`position: relative; transform: rotateX(${v.tiltXs}deg) rotateY(${v.tiltYs}deg)`)}>
                <div className="intro-inner" style={st('display: flex; flex-direction: column; align-items: center; gap: 22px; text-align: center; max-width: 420px')}>
                  <p className="reveal d1 kicker" style={{ margin: 0 }}>Une surprise pour toi</p>
                  <h1 className="reveal d2 title-3d" style={st('margin: 0; font-weight: 800; font-size: 44px; line-height: 1.08; color: #FFE3F1')}>{v.intro.line1}</h1>
                  <p className="reveal d4" style={st('margin: 0; font-size: 21px; line-height: 1.45; font-weight: 500; color: #E6F2FF')}>{v.intro.line2}</p>
                  <div style={{ height: 10 }}></div>
                  <Orb className="reveal d6" hb={v.h.intro} label={v.intro.button} hint="Maintiens le cœur"
                    icon={<svg aria-hidden="true" width="28" height="26" viewBox="0 0 24 22"><path d={HEART} fill="#FFFFFF"></path></svg>} />
                </div>
              </div>
            </section>
          )}

          {/* ═════ SCÈNE 2 — ENVELOPPE ═════ */}
          {v.s2 && (
            <section className="scene" style={st('background: radial-gradient(ellipse at 50% 45%, rgba(30,144,255,.18) 0%, rgba(7,11,36,0) 60%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 72px 24px 36px')}>
              <p className="reveal d1 kicker" style={{ margin: 0 }}>Scène 2 · L’enveloppe secrète</p>
              <div className="stage" style={st(`transform: rotateX(${v.tiltX}deg) rotateY(${v.tiltY}deg)`)}>
                <button className={'env ' + v.envClass} aria-label="Ouvrir l’enveloppe" onClick={v.openEnvelope} onPointerDown={v.envDown} onPointerUp={v.envUp}>
                  <div className="env-shadow"></div>
                  <div className="env-body">
                    <div className="env-rays"></div>
                    <div className="env-part env-back"></div>
                    <div className="env-letter">
                      <div className="env-letter-inner" style={st('display: flex; flex-direction: column; align-items: center; padding-top: 22px; gap: 6px')}>
                        <span style={st("font-family: 'Great Vibes', cursive; font-size: 38px; color: #E4579C")}>Pour toi</span>
                        <span style={st('width: 60px; height: 2px; border-radius: 2px; background: #1E90FF')}></span>
                      </div>
                    </div>
                    <div className="env-part env-front"></div>
                    <div className="env-part env-flap"></div>
                    <div className="seal">
                      <span className="seal-ring"></span>
                      <div className="seal-half seal-l">{sealSvg(true)}<span className="seal-txt">{v.initials}</span></div>
                      <div className="seal-half seal-r">{sealSvg(false)}<span className="seal-txt">{v.initials}</span></div>
                    </div>
                    <div className="burst">
                      {v.burst.map((bu: any, i: number) => (
                        <span key={i} className="burst-ray" style={{ transform: `rotate(${bu.angle})` }}>
                          <span className="burst-dot" style={st(`background: ${bu.color}; box-shadow: 0 0 10px ${bu.color}; animation-delay: ${bu.delay}`)}></span>
                        </span>
                      ))}
                    </div>
                    {v.confetti.map((cf: any, i: number) => (
                      <span key={i} className="confetti" style={st(`left: ${cf.left}; top: 200px; background: ${cf.color}; --cx: ${cf.cx}; animation-delay: ${cf.delay}`)}></span>
                    ))}
                  </div>
                  <div className="env-orbit">
                    <div className="env-orbit-spin">
                      {v.orbitSparks.map((os: any, i: number) => (
                        <span key={i} className="spark-o" style={st(`left: ${os.x}; top: ${os.y}; background: ${os.color}; box-shadow: 0 0 12px ${os.color}`)}></span>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
              {v.envClosed && (
                <p className="reveal d3 bob" style={st('margin: 0; font-size: 15px; font-weight: 600; color: #FFC2DF; text-align: center')}>Fais glisser vers le haut, ou touche le sceau</p>
              )}
              {v.envReady && (
                <Orb className="reveal" blue hb={v.h.letter} label="Lire la lettre" hint="Maintiens"
                  icon={<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>} />
              )}
            </section>
          )}

          {/* ═════ SCÈNE 3 — LETTRE EN DIRECT ═════ */}
          {v.s3 && (
            <section className="scene" ref={v.letterRef} style={st('background: rgba(7,11,36,.35); padding: 76px 18px 48px')}>
              <div className="stage" style={st(`max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 26px; transform: rotateX(${v.tiltXs}deg) rotateY(${v.tiltYs}deg)`)}>
                <article className="paper-in" style={st('position: relative; width: 100%; background: #FFF8F2; color: #2B1A3A; border-radius: 10px; padding: 40px 26px 34px; box-shadow: 0 2px 0 #F2DCE6, 0 4px 0 #E8CCD9, 0 40px 70px rgba(0,0,0,.55); display: flex; flex-direction: column; gap: 16px')}>
                  <span aria-hidden="true" style={st('position: absolute; left: 0; right: 0; top: 0; height: 8px; border-radius: 10px 10px 0 0; background: linear-gradient(90deg, #FF6FB5, #1E90FF)')}></span>
                  {v.typingOn && (
                    <button onClick={v.skipTyping} style={st('position: absolute; top: 16px; right: 14px; min-height: 32px; padding: 0 12px; border-radius: 999px; border: 1px solid rgba(30,144,255,.4); background: #FFFFFF; color: #0E5FB8; font-size: 12px; font-weight: 600')}>Tout afficher</button>
                  )}
                  <p style={st("margin: 0 0 4px; font-family: 'Great Vibes', cursive; font-size: 40px; color: #E4579C; line-height: 1.15")}>{v.letter.greeting}</p>
                  {v.letterParas.map((p: any, i: number) => (
                    <p key={i} style={st("margin: 0; font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 500; font-size: 23px; line-height: 1.5; min-height: 1.5em")}>
                      {p.text}{p.caret && <span className="caret"></span>}
                    </p>
                  ))}
                  {v.typingDone && (
                    <div style={st('display: flex; flex-direction: column; gap: 4px')}>
                      <p className="reveal" style={st("margin: 12px 0 0; font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 600; font-size: 22px")}>{v.letter.closing}</p>
                      <p style={st("margin: 0; align-self: flex-end; font-family: 'Great Vibes', cursive; font-size: 52px; color: #1E90FF")}><span className="sign-draw">{v.letter.signature}</span></p>
                    </div>
                  )}
                </article>
                {v.typingDone && (
                  <Orb className="reveal" style={{ animationDelay: '1.4s' }} hb={v.h.stars} label="Découvrir mon univers" hint="Maintiens"
                    icon={<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.5 6.8L12 17l-5.5 3.5L8 13.7 3 9.3l6.4-.7z"></path></svg>} />
                )}
              </div>
            </section>
          )}

          {/* ═════ SCÈNE 4 — MON UNIVERS ═════ */}
          {v.s4 && (
            <section className="scene" style={st('background: rgba(5,8,36,.45); padding: 72px 20px 40px')}>
              <div style={st('position: relative; max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center')}>
                <p className="reveal d1 kicker" style={{ margin: 0 }}>Scène 4 · Mon univers</p>
                <h2 className="reveal d2" style={st('margin: 0; font-weight: 700; font-size: 27px; line-height: 1.2')}>{v.uni.title}</h2>
                <p className="reveal d3" style={st('margin: 0; font-size: 15px; font-weight: 500; color: #FFC2DF')}>{v.uni.hint}</p>

                {v.uni.isStars && (
                  <div className="reveal d3" style={{ perspective: '900px' }}>
                    <div className="stage" style={st(`position: relative; width: 300px; height: 290px; margin-top: 4px; transform: rotateX(${v.tiltXs}deg) rotateY(${v.tiltYs}deg)`)}>
                      {v.allLit && (
                        <svg aria-hidden="true" width="300" height="290" viewBox="0 0 300 290" style={st('position: absolute; inset: 0; overflow: visible; pointer-events: none')}>
                          <path className="constellation" d={v.heartPath} fill="none" stroke="#FF8CC6" strokeWidth="2" strokeOpacity=".85"></path>
                        </svg>
                      )}
                      {v.stars.map((stx: any, i: number) => (
                        <button key={i} className={'star ' + stx.cls} style={st(`left: ${stx.left}; top: ${stx.top}`)} aria-label={stx.label} onClick={stx.pick}>
                          <span className="star-ring"></span>
                          <span className="star-core"></span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {v.uni.isRose && (
                  <div className="reveal d3" style={st('perspective: 900px; display: flex; flex-direction: column; align-items: center')}>
                    <div className="stage" style={st(`transform: rotateX(${v.roseRX}deg) rotateY(${v.tiltYs}deg)`)}>
                      <div className="rose">
                        {v.petals8.map((pt: any, i: number) => (
                          <div key={i} className="petal-slot" style={{ transform: `rotate(${pt.angle})` }}>
                            <button className={'petal-btn ' + pt.cls} aria-label={pt.label} onClick={pt.pick}>
                              <span className="petal-shape" style={{ animationDelay: pt.delay }}></span>
                            </button>
                          </div>
                        ))}
                        <div className="bud"><span className="bud-swirl"></span></div>
                        {v.allLit && (
                          <div className="bloom reveal">
                            <svg role="img" aria-label="Cœur" width="92" height="84" viewBox="0 0 24 22" style={{ filter: 'drop-shadow(0 0 16px rgba(255,140,198,.9))' }}><path d={HEART} fill="#FF6FB5" stroke="#FFE3F1" strokeWidth=".6"></path></svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <svg aria-hidden="true" width="120" height="70" viewBox="0 0 120 70" style={{ marginTop: -18 }}><path d="M60 0 C58 25 62 45 60 70" stroke="#2F9E6A" strokeWidth="5" fill="none" strokeLinecap="round"></path><path d="M60 34 C40 22 26 30 22 40 C38 44 50 42 60 34z" fill="#3BB37A"></path><path d="M61 48 C78 38 94 42 98 52 C84 56 70 54 61 48z" fill="#2F9E6A"></path></svg>
                  </div>
                )}

                {v.uni.isLanterns && (
                  <div className="reveal d3" style={st('position: relative; width: 300px; height: 300px')}>
                    {v.lanterns.map((ln: any, i: number) => (
                      <button key={i} className={'lantern ' + ln.cls} style={st(`left: ${ln.left}; top: ${ln.top}; animation-duration: ${ln.dur}; animation-delay: ${ln.delay}`)} aria-label={ln.label} onClick={ln.pick}>
                        <span className="lantern-body" style={{ background: ln.bg }}></span>
                      </button>
                    ))}
                  </div>
                )}

                <div style={st('min-height: 120px; width: 100%; display: flex; align-items: center; justify-content: center; perspective: 600px')}>
                  {(v.msgA || v.msgB) && <div key={this.state.taps} style={{ display: 'contents' }}>{msgCard}</div>}
                </div>
                <p style={st('margin: 0; font-size: 14px; font-weight: 600; color: #B9D9FF')}>{v.litCount} / 8 {v.uni.unit}</p>
                {v.allLit && (
                  <div className="reveal" style={st('display: flex; flex-direction: column; align-items: center; gap: 18px; animation-delay: 1.2s')}>
                    <p style={st('margin: 0; font-size: 20px; font-weight: 600; color: #FFC2DF')}>{v.uni.done}</p>
                    <Orb blue hb={v.h.album} label="Ouvrir notre album" hint="Maintiens"
                      icon={<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2z"></path><path d="M8 3v18"></path></svg>} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ═════ SCÈNE 5 — ALBUM ═════ */}
          {v.s5 && (
            <section className="scene" style={st('background: rgba(18,24,90,.25); padding: 72px 20px 36px')}>
              <div style={st('max-width: 460px; min-height: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px')}>
                <p className="reveal d1 kicker" style={{ margin: 0 }}>Scène 5 · Notre album</p>
                <div className="reveal d2 book-wrap">
                  <div className="book" style={st(`transform: rotateX(${v.bookRX}deg) rotateY(${v.bookRY}deg)`)} onPointerDown={v.bookDown} onPointerUp={v.bookUp}>
                    <div className="book-base" style={st('display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 30px; text-align: center')}>
                      <p style={st("margin: 0; font-family: 'Great Vibes', cursive; font-size: 34px; color: #E4579C")}>La suite s’écrit ensemble…</p>
                    </div>
                    {v.leaves.map((lf: any, i: number) => (
                      <div key={i} className={'leaf ' + lf.cls} style={{ zIndex: lf.z }}>
                        <div className="face" style={{ background: lf.bg }}>
                          {lf.isCover && (
                            <div style={st('position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 30px; text-align: center')}>
                              <div style={st('position: absolute; inset: 14px; border: 2px solid rgba(255,194,223,.7); border-radius: 6px')}></div>
                              <span className="kicker" style={{ color: '#FFC2DF' }}>{v.coverNames}</span>
                              <span className="title-font" style={st('font-weight: 800; font-size: 40px; line-height: 1.05; color: #FFE3F1; text-shadow: 0 2px 0 #C2316F, 0 4px 12px rgba(0,0,0,.4)')}>Notre album</span>
                              <span style={st('width: 54px; height: 3px; border-radius: 3px; background: #FF6FB5')}></span>
                              <span style={st('font-size: 14px; font-weight: 600; color: #E6F2FF')}>Touche pour tourner la page</span>
                            </div>
                          )}
                          {lf.isPhoto && (
                            <div style={st('position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 28px 26px 22px 34px')}>
                              <span className="corner" style={{ left: 0, top: 0 }}></span>
                              <div style={{ width: lf.slotW, position: 'relative' }}>
                                {lf.hasSrc ? (
                                  <img src={lf.src} alt={lf.caption} draggable={false} style={st(`display: block; width: 100%; aspect-ratio: ${lf.ratio}; object-fit: cover; border-radius: 4px; box-shadow: 0 8px 18px rgba(0,0,0,.25)`)} />
                                ) : (
                                  <div className="slot" style={{ aspectRatio: lf.ratio }}>
                                    <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1E90FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="11" r="2"></circle><path d="M21 17l-5-5-9 7"></path></svg>
                                    <span style={st('font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #0E5FB8')}>{lf.slotLabel}</span>
                                    <span style={st('font-size: 11px; font-weight: 500; color: #3B6EA8')}>{lf.file}</span>
                                  </div>
                                )}
                              </div>
                              <span style={st('font-size: 18px; font-weight: 500; line-height: 1.3; color: #2B1A3A; text-align: center')}>{lf.caption}</span>
                              <span style={st('position: absolute; right: 18px; bottom: 12px; font-size: 12px; font-weight: 600; color: #B08AA0')}>{lf.pageNum}</span>
                            </div>
                          )}
                          <div className="spine"></div>
                          <div className="curl"></div>
                          <div className="gloss"></div>
                        </div>
                        <div className="face face-back">
                          <div style={st('position: absolute; inset: 0; display: flex; align-items: center; justify-content: center')}>
                            <span className="title-font" style={st('font-weight: 800; font-size: 26px; letter-spacing: .1em; color: rgba(228,87,156,.3)')}>{v.initials}</span>
                          </div>
                          <div className="curl"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={st('display: flex; align-items: center; gap: 14px; margin-top: 10px')}>
                  <button className="chip" aria-label="Page précédente" onClick={v.prevPage} disabled={v.atStart}>‹ Avant</button>
                  <span style={st('min-width: 70px; text-align: center; font-size: 14px; font-weight: 700; color: #FFC2DF')}>{v.pageLabel}</span>
                  <button className="chip" aria-label="Page suivante" onClick={v.nextPage} disabled={v.atEnd}>Après ›</button>
                </div>
                <p style={st('margin: 0; font-size: 13px; font-weight: 500; color: #B9D9FF; text-align: center')}>Touche la page ou fais-la glisser pour la tourner</p>
                <Orb className="reveal d4" style={{ marginTop: 6 }} hb={v.h.invite} label="Une invitation pour toi" hint="Maintiens"
                  icon={<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v9H4v-9"></path><path d="M2 7h20v5H2z"></path><path d="M12 22V7"></path><path d="M12 7c-2-4-6-4-6-1s6 1 6 1zM12 7c2-4 6-4 6-1s-6 1-6 1z"></path></svg>} />
              </div>
            </section>
          )}

          {/* ═════ SCÈNE 6 — INVITATION ═════ */}
          {v.s6 && (
            <section className="scene" style={st('background: radial-gradient(ellipse at 50% 20%, rgba(255,111,181,.85) 0%, rgba(194,49,111,.7) 35%, rgba(59,15,69,.55) 75%, rgba(18,8,42,.4) 100%); padding: 76px 20px 44px')}>
              <div style={st('max-width: 440px; min-height: 100%; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: 18px')}>
                <div className="reveal" style={st('text-align: center; display: flex; flex-direction: column; gap: 6px')}>
                  <span className="kicker" style={{ color: '#FFE3F1' }}>Invitation privée</span>
                  <span style={st('font-size: 17px; font-weight: 500; color: #FFFFFF')}>Strictement réservée à {v.herName}</span>
                </div>
                {v.quizOn && (
                  <div className="flip-wrap reveal d1">
                    <div className={'flip ' + v.flipClass}>
                      <div className="card-face card-front" style={st('background: linear-gradient(160deg, #FFFFFF, #E6F2FF); color: #0B2A55; box-shadow: 0 6px 0 #8CC8FF, 0 30px 60px rgba(0,0,0,.4)')}>
                        <span className="kicker" style={{ color: '#1E90FF' }}>Question {v.qNum} / {v.qTotal}</span>
                        <h2 style={st('margin: 0; font-weight: 700; font-size: 25px; line-height: 1.25')}>{v.q.q}</h2>
                        <div style={st('width: 100%; display: flex; flex-direction: column; gap: 12px; margin-top: 4px')}>
                          {v.answers.map((a: any, i: number) => (
                            <button key={i} className="answer" onClick={a.pick}>{a.label}</button>
                          ))}
                        </div>
                      </div>
                      <div className="card-face card-back" style={st('background: linear-gradient(160deg, #1E90FF, #0E5FB8); color: #FFFFFF; box-shadow: 0 6px 0 #0B4C99, 0 30px 60px rgba(0,0,0,.4)')}>
                        <span className="kicker" style={{ color: '#FFE3F1' }}>Ta réponse : {v.pickedLabel}</span>
                        <p style={st('margin: 0; font-weight: 600; font-size: 23px; line-height: 1.4')}>{v.reaction}</p>
                        <button className="next-link" onClick={v.nextQuestion}>{v.nextLabel} ›</button>
                      </div>
                    </div>
                  </div>
                )}
                {v.inviteOn && (
                  <div className="paper-in" style={st('border-radius: 22px; padding: 30px 22px; background: #FFF8F2; color: #2B1A3A; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; box-shadow: 0 6px 0 #F2C6DB, 0 30px 60px rgba(0,0,0,.45)')}>
                    <h2 style={st('margin: 0; font-weight: 800; font-size: 32px; line-height: 1.15; color: #E4579C')}>{v.invitation.title}</h2>
                    <p style={st('margin: 0; font-size: 17px; font-weight: 500; line-height: 1.5')}>{v.invitation.text}</p>
                    <div style={st('width: 100%; display: flex; flex-direction: column; margin: 4px 0')}>
                      {v.inviteDetails.map((d: any, i: number) => (
                        <div key={i} style={st('display: flex; justify-content: space-between; gap: 14px; padding: 12px 0; border-bottom: 1px dashed rgba(30,144,255,.4); text-align: left')}>
                          <span className="kicker" style={{ color: '#1E90FF', letterSpacing: '.16em' }}>{d.label}</span>
                          <span style={st('font-size: 17px; font-weight: 600; text-align: right')}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                    <Orb style={{ marginTop: 6 }} hb={v.h.finale} label={v.invitation.button} hint="Maintiens pour signer"
                      labelStyle={{ color: '#2B1A3A' }} hintStyle={{ color: '#E4579C' }} ringBg="rgba(228,87,156,.25)" ringFill="#1E90FF"
                      icon={<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10"></path></svg>} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ═════ SCÈNE 7 — DÉCLARATION ═════ */}
          {v.s7 && (
            <section className="scene" style={st('background: rgba(7,11,36,.45); padding: 70px 26px 48px')}>
              <div aria-hidden="true" style={st('position: fixed; inset: 0; pointer-events: none; overflow: hidden')}>
                {v.sparks.map((sp: any, i: number) => (
                  <span key={i} className="spark" style={st(`left: ${sp.left}; background: ${sp.color}; box-shadow: 0 0 8px ${sp.color}; animation-duration: ${sp.dur}; animation-delay: ${sp.delay}`)}></span>
                ))}
                {v.petals.map((pe: any, i: number) => (
                  <span key={i} className="petal" style={st(`left: ${pe.left}; width: ${pe.size}; height: ${pe.size}; background: ${pe.color}; animation-duration: ${pe.dur}; animation-delay: ${pe.delay}`)}></span>
                ))}
              </div>
              <div className="stage" style={st(`position: relative; min-height: 100%; max-width: 440px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; text-align: center; transform-style: flat; transform: rotateX(${v.tiltXs}deg) rotateY(${v.tiltYs}deg)`)}>
                <div className="heart3d-wrap" role="img" aria-label="Cœur en 3D qui tourne">
                  <div className="heart3d">
                    {v.heartLayers.map((hl: any, i: number) => (
                      <svg key={i} className="heart-layer" aria-hidden="true" width="120" height="110" viewBox="0 0 24 22" style={{ transform: `translateZ(${hl.z})` }}>
                        <path d={HEART} fill={hl.fill}></path>
                      </svg>
                    ))}
                  </div>
                </div>
                <h1 className="name-in title-3d" style={st('margin: 0; font-weight: 800; font-size: 46px; line-height: 1.05; color: #FFE3F1')}>{v.herFirstName}</h1>
                {v.declLines.map((dl: any, i: number) => (
                  <p key={i} className="reveal" style={st(`margin: 0; font-size: 20px; font-weight: 500; line-height: 1.55; color: #EAF4FF; white-space: pre-line; animation-delay: ${dl.delay}`)}>{dl.text}</p>
                ))}
                <p className="reveal title-font" style={st(`margin: 4px 0 0; font-style: italic; font-weight: 700; font-size: 38px; color: #FF8CC6; animation-delay: ${v.declSignDelay}`)}>{v.signature}</p>
                <Orb className="reveal" style={{ marginTop: 6, animationDelay: v.declBtnDelay }} hb={v.h.forever} label="Pour toujours" hint="Maintiens"
                  icon={<svg aria-hidden="true" width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round"><path d="M8 10c0-3 2-5 4.5-5S17 7 15 10s2.5 5 4.5 5S24 13 24 10s-2-5-4.5-5S15 7 15 10s-2.5 5-4.5 5S8 13 8 10z"></path></svg>} />
              </div>
            </section>
          )}

          {/* ═════ OUTRO ═════ */}
          {v.outroScreen && (
            <section className="crt" style={st('display: flex; align-items: center; justify-content: center; padding: 24px')}>
              <p className="sig-in flicker title-font" style={st('margin: 0; font-weight: 800; font-size: 42px; line-height: 1.12; color: #FFE3F1; text-align: center')}>{v.finalSignature}</p>
              <div className="crt-lines" aria-hidden="true"></div>
              <div className="crt-vignette" aria-hidden="true"></div>
              {v.tvOff && <div className="tvflash" aria-hidden="true"></div>}
            </section>
          )}
        </div>

        {v.tvOff && <div className="tvdot" aria-hidden="true"></div>}

        <div aria-hidden="true" style={st(`position: absolute; inset: 0; background: #000000; pointer-events: none; z-index: 50; transition: opacity .7s ease; opacity: ${v.veil}`)}></div>

        {v.showChrome && (
          <div style={st('position: absolute; left: 0; right: 0; top: 0; z-index: 45; display: flex; align-items: center; justify-content: center; height: 64px; padding: 0 64px; pointer-events: none')}>
            <div aria-hidden="true" style={st('display: flex; gap: 8px')}>
              {v.dots.map((dt: any, i: number) => (
                <span key={i} style={st(`width: ${dt.w}; height: 5px; border-radius: 5px; background: ${dt.bg}; transition: width .5s, background .5s`)}></span>
              ))}
            </div>
          </div>
        )}
        {v.showMute && (
          <button aria-label={v.muteLabel} onClick={v.toggleMusic} style={st('position: absolute; top: 10px; right: 10px; z-index: 46; width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid rgba(140,200,255,.55); background: rgba(7,11,36,.6); color: #8CC8FF; display: flex; align-items: center; justify-content: center; padding: 0')}>
            {v.musicOn ? (
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"></path><path d="M15.5 8.5a5 5 0 010 7"></path><path d="M18.5 5.5a9 9 0 010 13"></path></svg>
            ) : (
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"></path><path d="M16 9l5 6"></path><path d="M21 9l-5 6"></path></svg>
            )}
          </button>
        )}
      </div>
    );
  }
}
