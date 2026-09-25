import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   SKILLS — LIVE PCB
   Two stacked canvases:
     1. static  : substrate, copper pour, traces, pads, vias, packages, silkscreen
                  (rendered once per layout, never per frame)
     2. dynamic : signal pulses, hover activation, via flashes, LEDs, scan sweep
   The board is generated from the measured card rectangles, so routing
   always lives in the negative space between/around the real DOM cards.
------------------------------------------------------------------- */

type P = { x: number; y: number };
type Rect = { x: number; y: number; w: number; h: number };
type Pad = Rect & { round?: boolean; cards: number[] };
type Via = { x: number; y: number; r: number; cards: number[]; flash: number };
type Trace = {
  pts: P[];
  cum: number[];
  len: number;
  layer: 1 | 2;
  w: number;
  group: number[];
  pulse: boolean;
  scan: boolean;
  next?: Trace;
  prev?: Trace;
  endVia?: Via;
  startVia?: Via;
};
type Body = Rect & { label: string; cards: number[] };
type Led = { x: number; y: number; period: number; phase: number; cards: number[] };
type Node = { x: number; y: number; r: number; cards: number[]; flash: number };
type Box = Rect & { i: number };
type Pulse = { t: Trace; d: number; dir: 1 | -1; v: number; a: number; hover: boolean };
type Board = {
  W: number;
  H: number;
  traces: Trace[];
  vias: Via[];
  pads: Pad[];
  bodies: Body[];
  leds: Led[];
  nodes: Node[];
  silk: Array<(c: CanvasRenderingContext2D) => void>;
  pours: Array<Rect & { a?: number }>;
  dims: Rect[];
  holes: P[];
  centers: P[];
  hotTraces: Trace[][];
  hotPads: Pad[][];
  hotVias: Via[][];
  hotNodes: Node[][];
  hotBodies: Body[][];
  cardCount: number;
};

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const NETS = ["SDA", "SCL", "TX", "RX", "MOSI", "MISO", "SCK", "CS", "PWM", "ADC", "GND", "3V3", "RST", "IRQ", "VBUS", "CLK"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const inRect = (x: number, y: number, r: Rect, m = 0) => x >= r.x - m && x <= r.x + r.w + m && y >= r.y - m && y <= r.y + r.h + m;

function makeTrace(pts: P[], layer: 1 | 2, w: number, group: number[], pulse = true): Trace {
  const clean: P[] = [];
  pts.forEach((p) => {
    const l = clean[clean.length - 1];
    if (!l || Math.hypot(p.x - l.x, p.y - l.y) > 0.4) clean.push(p);
  });
  const cum = [0];
  for (let i = 1; i < clean.length; i += 1) cum.push(cum[i - 1] + Math.hypot(clean[i].x - clean[i - 1].x, clean[i].y - clean[i - 1].y));
  return { pts: clean, cum, len: cum[cum.length - 1] || 0.001, layer, w, group, pulse, scan: false };
}

function pointAt(t: Trace, d: number): P {
  const dd = clamp(d, 0, t.len);
  const c = t.cum;
  for (let i = 1; i < c.length; i += 1) {
    if (dd <= c[i]) {
      const f = (dd - c[i - 1]) / Math.max(0.0001, c[i] - c[i - 1]);
      return { x: t.pts[i - 1].x + (t.pts[i].x - t.pts[i - 1].x) * f, y: t.pts[i - 1].y + (t.pts[i].y - t.pts[i - 1].y) * f };
    }
  }
  return t.pts[t.pts.length - 1];
}

function strokePts(ctx: CanvasRenderingContext2D, pts: P[]) {
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
}

/* Straight run on the dominant axis + a single 45deg chamfer. */
function seg(a: P, b: P, straightFirst: boolean): P[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < 0.5 || ay < 0.5 || Math.abs(ax - ay) < 0.5) return [b];
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  let m: P;
  if (straightFirst) m = ax > ay ? { x: b.x - sx * ay, y: a.y } : { x: a.x, y: b.y - sy * ax };
  else m = ax > ay ? { x: a.x + sx * ay, y: b.y } : { x: b.x, y: a.y + sy * ax };
  return [m, b];
}

/* ---------------------------------------------------------------- BUILD */
function buildBoard(host: HTMLElement): Board {
  const hr = host.getBoundingClientRect();
  const W = Math.max(1, hr.width);
  const H = Math.max(1, hr.height);
  const rel = (el: Element): Rect => {
    const r = el.getBoundingClientRect();
    return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height };
  };
  const cardEls = Array.from(host.querySelectorAll<HTMLElement>(".futuristic-skill-card"));
  const boxes: Box[] = cardEls.map((el, i) => ({ ...rel(el), i }));
  const nCards = boxes.length;
  const stripEl = host.querySelector(".engineering-practice");
  const strip: Box | null = stripEl ? { ...rel(stripEl), i: 99 } : null;
  const introEl = host.querySelector(".skills-intro h2");
  const introPEl = host.querySelector(".skills-intro p");
  const idxEl = host.querySelector(".section-index");
  const textRect = (el: Element | null): Rect | null => {
    if (!el) return null;
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height };
  };
  const intro = textRect(introEl);
  const introP = introPEl ? rel(introPEl) : null;
  const idx = textRect(idxEl);

  const rand = rng(90417);
  const B: Board = {
    W, H, traces: [], vias: [], pads: [], bodies: [], leds: [], nodes: [], silk: [], pours: [], dims: [], holes: [], centers: [],
    hotTraces: [], hotPads: [], hotVias: [], hotNodes: [], hotBodies: [], cardCount: nCards,
  };
  if (!nCards) return B;
  B.centers = boxes.map((b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 }));

  const gl = Math.min(...boxes.map((b) => b.x));
  const gr = Math.max(...boxes.map((b) => b.x + b.w));
  const gt = Math.min(...boxes.map((b) => b.y));
  const ml = gl;
  const mr = W - gr;
  const gs = (a: number[]) => a.filter((n) => n >= 0 && n < nCards);

  /* --- primitives -------------------------------------------------- */
  const addTrace = (pts: P[], layer: 1 | 2, w: number, group: number[], pulse = true) => {
    const t = makeTrace(pts, layer, w, gs(group), pulse);
    if (t.pts.length >= 2) B.traces.push(t);
    return t;
  };
  const addVia = (x: number, y: number, r: number, cards: number[]) => {
    const v: Via = { x, y, r, cards: gs(cards), flash: 0 };
    B.vias.push(v);
    return v;
  };
  const addNode = (x: number, y: number, r = 2.25, cards: number[] = []) => {
    const c = gs(cards);
    const near = B.nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 7);
    if (near) {
      near.cards = Array.from(new Set([...near.cards, ...c]));
      return near;
    }
    const n: Node = { x, y, r, cards: c, flash: 0 };
    B.nodes.push(n);
    return n;
  };
  const addPad = (x: number, y: number, w: number, h: number, cards: number[], round = false) => {
    B.pads.push({ x, y, w, h, cards: gs(cards), round });
  };
  const addBody = (x: number, y: number, w: number, h: number, label: string, cards: number[]) => {
    B.bodies.push({ x, y, w, h, label, cards: gs(cards) });
  };
  const text = (s: string, x: number, y: number, size = 7.5, alpha = 0.5, align: CanvasTextAlign = "left") => {
    B.silk.push((c) => {
      c.font = `${size}px ${MONO}`;
      c.textAlign = align;
      c.textBaseline = "middle";
      c.fillStyle = `rgba(170,218,236,${alpha})`;
      c.fillText(s, x, y);
    });
  };
  const silkRect = (x: number, y: number, w: number, h: number, alpha = 0.34) => {
    B.silk.push((c) => {
      c.strokeStyle = `rgba(170,218,236,${alpha})`;
      c.lineWidth = 0.8;
      c.strokeRect(x, y, w, h);
    });
  };
  const silkRing = (x: number, y: number, r: number, alpha = 0.3) => {
    B.silk.push((c) => {
      c.strokeStyle = `rgba(170,218,236,${alpha})`;
      c.lineWidth = 0.7;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.stroke();
    });
  };

  /* --- neighbour detection ---------------------------------------- */
  const rightOf = (a: Box) =>
    boxes.filter((b) => b.i !== a.i && Math.abs(b.y - a.y) < 8 && b.x > a.x + a.w - 2).sort((p, q) => p.x - q.x)[0];
  const belowOf = (a: Box): Box | undefined => {
    const d = boxes.filter((b) => b.i !== a.i && Math.abs(b.x - a.x) < 8 && b.y > a.y + a.h - 2).sort((p, q) => p.y - q.y)[0];
    if (d) return d;
    if (strip && strip.y > a.y + a.h - 2 && strip.y - (a.y + a.h) < 90) return strip;
    return undefined;
  };
  const hasLeft = (a: Box) => boxes.some((b) => b.i !== a.i && Math.abs(b.y - a.y) < 8 && b.x + b.w < a.x + 2);

  /* --- passives / packages ------------------------------------------ */
  const passive = (cx: number, cy: number, vertical: boolean, s: number, label: string, cards: number[], showLabel = true): Rect[] => {
    const pl = 4.2 * s;
    const pt = 3.4 * s;
    const off = 4.2 * s;
    const pads: Rect[] = vertical
      ? [{ x: cx - pt / 2, y: cy - off - pl / 2, w: pt, h: pl }, { x: cx - pt / 2, y: cy + off - pl / 2, w: pt, h: pl }]
      : [{ x: cx - off - pl / 2, y: cy - pt / 2, w: pl, h: pt }, { x: cx + off - pl / 2, y: cy - pt / 2, w: pl, h: pt }];
    pads.forEach((p) => addPad(p.x, p.y, p.w, p.h, cards));
    if (vertical) silkRect(cx - 3.4 * s, cy - 2.6 * s, 6.8 * s, 5.2 * s);
    else silkRect(cx - 2.6 * s, cy - 3.4 * s, 5.2 * s, 6.8 * s);
    if (showLabel) text(label, cx + (vertical ? 8 * s : 0), cy + (vertical ? 0 : 8.5 * s), 6.5, 0.42, vertical ? "left" : "center");
    return pads;
  };

  /* px = x of the tips of the pins that face the trace bundle;
     dir = +1 body extends to the right, -1 to the left.            */
  const soic = (px: number, cy: number, dir: 1 | -1, s: number, label: string, cards: number[]): P[] => {
    const pitch = 6.5 * s;
    const padL = 6 * s;
    const bodyW = 14 * s;
    const total = 4 * pitch;
    const pins: P[] = [];
    for (let k = 0; k < 4; k += 1) {
      const y = cy - total / 2 + pitch * (k + 0.5);
      const far = px + dir * (padL * 2 + bodyW);
      addPad(dir > 0 ? px : px - padL, y - 1.4 * s, padL, 2.8 * s, cards);
      addPad(dir > 0 ? far - padL : far, y - 1.4 * s, padL, 2.8 * s, cards);
      pins.push({ x: px, y });
    }
    const bx = dir > 0 ? px + padL : px - padL - bodyW;
    addBody(bx, cy - total / 2 - 1, bodyW, total + 2, label, cards);
    text(label, bx + bodyW / 2, cy - total / 2 - 8, 7, 0.55, "center");
    return pins;
  };
  const qfp = (px: number, cy: number, dir: 1 | -1, s: number, label: string, cards: number[]): P[] => {
    const per = 6;
    const pitch = 4.6 * s;
    const body = per * pitch + 2 * s;
    const pl = 5 * s;
    const pins: P[] = [];
    const bx = dir > 0 ? px + pl : px - pl - body;
    const by = cy - body / 2;
    for (let k = 0; k < per; k += 1) {
      const y = cy - (per * pitch) / 2 + pitch * (k + 0.5);
      const x = bx + s + pitch * (k + 0.5);
      addPad(dir > 0 ? px : px - pl, y - 1.2 * s, pl, 2.4 * s, cards);
      addPad(dir > 0 ? bx + body : bx - pl, y - 1.2 * s, pl, 2.4 * s, cards);
      addPad(x - 1.2 * s, by - pl, 2.4 * s, pl, cards);
      addPad(x - 1.2 * s, by + body, 2.4 * s, pl, cards);
      pins.push({ x: px, y });
    }
    addBody(bx, by, body, body, label, cards);
    text(label, bx + body / 2, by - pl - 7, 7, 0.55, "center");
    return pins;
  };
  const header = (px: number, cy: number, dir: 1 | -1, s: number, label: string, cards: number[], rows = 5): P[] => {
    const pitch = 6.6 * s;
    const pins: P[] = [];
    const total = rows * pitch;
    for (let k = 0; k < rows; k += 1) {
      const y = cy - total / 2 + pitch * (k + 0.5);
      addPad(px - 2.6 * s, y - 2.6 * s, 5.2 * s, 5.2 * s, cards, k !== 0);
      addPad(px + dir * pitch - 2.6 * s, y - 2.6 * s, 5.2 * s, 5.2 * s, cards, true);
      pins.push({ x: px, y });
    }
    const x0 = Math.min(px, px + dir * pitch) - 5 * s;
    silkRect(x0, cy - total / 2 - 2, pitch + 10 * s, total + 4);
    text(label, x0 + (pitch + 10 * s) / 2, cy - total / 2 - 8, 7, 0.55, "center");
    return pins;
  };
  const testPoints = (px: number, cy: number, dir: 1 | -1, s: number, cards: number[], startNo: number): P[] => {
    const pitch = 12 * s;
    const pins: P[] = [];
    for (let k = 0; k < 4; k += 1) {
      const y = cy - 1.5 * pitch + k * pitch;
      addPad(px - 3.4 * s, y - 3.4 * s, 6.8 * s, 6.8 * s, cards, true);
      silkRing(px, y, 6.4 * s);
      text(`TP${startNo + k}`, px + dir * 13 * s, y, 6.5, 0.45, dir > 0 ? "left" : "right");
      pins.push({ x: px, y });
    }
    return pins;
  };
  const crystal = (cx: number, cy: number, s: number, label: string, cards: number[]) => {
    addPad(cx - 8.5 * s, cy - 3.6 * s, 4 * s, 7.2 * s, cards);
    addPad(cx + 4.5 * s, cy - 3.6 * s, 4 * s, 7.2 * s, cards);
    addBody(cx - 5 * s, cy - 3.8 * s, 10 * s, 7.6 * s, "", cards);
    text(label, cx, cy + 11 * s, 6.5, 0.45, "center");
    const a = addVia(cx - 15 * s, cy + 4 * s, 2.5, cards);
    const b = addVia(cx + 15 * s, cy + 4 * s, 2.5, cards);
    addTrace([{ x: cx - 8.5 * s, y: cy }, { x: cx - 11 * s, y: cy }, { x: a.x, y: a.y }], 1, 1.2, cards, false);
    addTrace([{ x: cx + 8.5 * s, y: cy }, { x: cx + 11 * s, y: cy }, { x: b.x, y: b.y }], 1, 1.2, cards, false);
  };
  const led = (cx: number, cy: number, s: number, cards: number[], period: number, label: string) => {
    addPad(cx - 5 * s, cy - 1.7 * s, 3.4 * s, 3.4 * s, cards);
    addPad(cx + 1.6 * s, cy - 1.7 * s, 3.4 * s, 3.4 * s, cards);
    B.leds.push({ x: cx, y: cy, period, phase: rand() * period, cards: gs(cards) });
    text(label, cx, cy + 8, 6.5, 0.42, "center");
  };

  /* --- bundle link between two neighbouring modules ----------------- */
  let netCursor = 0;
  const link = (A: Box, Bx: Box, axis: "h" | "v") => {
    const h = axis === "h";
    const a0 = h ? A.x + A.w : A.y + A.h;
    const b0 = h ? Bx.x : Bx.y;
    const gap = b0 - a0;
    if (gap < 22) return;
    const lo = h ? Math.max(A.y, Bx.y) : Math.max(A.x, Bx.x);
    const hi = h ? Math.min(A.y + A.h, Bx.y + Bx.h) : Math.min(A.x + A.w, Bx.x + Bx.w);
    const n = gap >= 34 ? 4 + Math.floor(rand() * 3) : 3;
    const sp = 6.6;
    const span = (n - 1) * sp;
    const s0 = Math.min(gap - 18, 22);
    const S = s0 > 6 && rand() < 0.72 ? (rand() < 0.5 ? -1 : 1) * (6 + rand() * (s0 - 6)) : 0;
    const vmin = Math.min(0, S) - span / 2;
    const vmax = Math.max(0, S) + span / 2;
    const cLo = lo + 16 - vmin;
    const cHi = hi - 16 - vmax;
    if (cHi <= cLo) return;
    const cv = cLo + rand() * (cHi - cLo);
    const Pt = (u: number, v: number): P => (h ? { x: u, y: v } : { x: v, y: u });
    const u0 = a0 + 8;
    const u1 = b0 - 8;
    const gapu = u1 - u0;
    const um = u0 + (gapu - Math.abs(S)) / 2;
    const cards = [A.i, Bx.i];
    const pw = 3.6;
    const pl = 7;
    for (let k = 0; k < n; k += 1) {
      const v = cv + (k - (n - 1) / 2) * sp;
      const vb = v + S;
      const w = k === 0 && rand() < 0.45 ? 3 : k % 3 === 0 ? 2.1 : 1.6;
      if (h) {
        addPad(a0 + 1, v - pw / 2, pl, pw, cards);
        addPad(b0 - 1 - pl, vb - pw / 2, pl, pw, cards);
      } else {
        addPad(v - pw / 2, a0 + 1, pw, pl, cards);
        addPad(vb - pw / 2, b0 - 1 - pl, pw, pl, cards);
      }
      const pa = Pt(u0, v);
      const pb = Pt(u1, vb);
      const hop = gapu >= 30 && (gapu - Math.abs(S)) / 2 >= 13 && k % 2 === 0 && rand() < 0.5;
      const mid = Math.abs(S) > 0.5 ? [Pt(um, v), Pt(um + Math.abs(S), vb)] : [];
      if (!hop) {
        addTrace([pa, ...mid, pb], 1, w, cards);
      } else {
        const p1 = Pt(u0 + 9, v);
        const p2 = Pt(u1 - 9, vb);
        const v1 = addVia(p1.x, p1.y, 3.1, cards);
        const v2 = addVia(p2.x, p2.y, 3.1, cards);
        const t1 = addTrace([pa, p1], 1, w, cards);
        const t2 = addTrace([p1, ...mid, p2], 2, Math.max(1.3, w - 0.4), cards);
        const t3 = addTrace([p2, pb], 1, w, cards);
        t1.next = t2; t2.prev = t1; t2.next = t3; t3.prev = t2;
        t1.endVia = v1; t2.startVia = v1; t2.endVia = v2; t3.startVia = v2;
      }
      // occasional tee branch to a via on the outer lanes
      if ((k === 0 || k === n - 1) && !hop && rand() < 0.45) {
        const sgn = k === 0 ? -1 : 1;
        if (S === 0 || Math.sign(S) !== sgn) {
          const bs = Pt(um - 6, v);
          const be = Pt(um + 3, v + sgn * 9);
          addTrace([bs, be], 1, 1.3, cards, false);
          addVia(be.x, be.y, 2.6, cards);
        }
      }
    }
    if (gap >= 40) {
      [cv + vmin - 24, cv + vmax + 24].forEach((vc, q) => {
        if (vc < lo + 16 || vc > hi - 16 || rand() < 0.2) return;
        const c = Pt((a0 + b0) / 2, vc);
        const pd = passive(c.x, c.y, !h, 0.95, `${q ? "R" : "C"}${20 + A.i * 2 + q}`, cards, h);
        pd.forEach((p, e) => {
          const sg = e === 0 ? -1 : 1;
          const s0 = { x: p.x + p.w / 2, y: p.y + p.h / 2 };
          const s1 = h ? { x: s0.x + sg * 7, y: s0.y + (q ? 7 : -7) } : { x: s0.x + (q ? 7 : -7), y: s0.y + sg * 7 };
          addTrace([s0, s1], 1, 1.2, cards, false);
          addVia(s1.x, s1.y, 2.5, cards);
        });
      });
    }
    if (!h && gap >= 30) {
      const net = NETS[netCursor % NETS.length];
      netCursor += 1;
      text(net, cv + span / 2 + Math.max(0, S) + 14, (a0 + b0) / 2, 7, 0.42);
    }
  };

  boxes.forEach((a) => {
    const r = rightOf(a);
    if (r) link(a, r, "h");
    const d = belowOf(a);
    if (d) link(a, d, "v");
  });

  /* --- cross-board links: non-adjacent modules routed through a
     layer change so the whole board reads as one connected network,
     not just a lattice of neighbour-to-neighbour traces ------------- */
  const crossPairs: Array<[number, number]> = [[0, 4], [1, 5], [3, 7], [4, 8], [6, 8], [0, 8], [2, 6]];
  crossPairs.forEach(([i, j]) => {
    const A = boxes[i];
    const Bx = boxes[j];
    if (!A || !Bx || i === j) return;
    const cards = [i, j];
    const ac: P = { x: A.x + A.w / 2, y: A.y + A.h / 2 };
    const bc: P = { x: Bx.x + Bx.w / 2, y: Bx.y + Bx.h / 2 };
    // exit / entry points on the nearest corner of each package
    const p0: P = { x: Bx.x > A.x ? A.x + A.w : A.x, y: Bx.y > A.y ? A.y + A.h : A.y };
    const p3: P = { x: A.x > Bx.x ? Bx.x + Bx.w : Bx.x, y: A.y > Bx.y ? Bx.y + Bx.h : Bx.y };
    const dxSign = Math.sign(p3.x - p0.x) || 1;
    const dySign = Math.sign(p3.y - p0.y) || 1;
    const v1 = addVia(p0.x + dxSign * 9, p0.y + dySign * 9, 2.9, cards);
    const v2 = addVia(p3.x - dxSign * 9, p3.y - dySign * 9, 2.9, cards);
    addPad(p0.x - 1.8, p0.y - 1.8, 3.6, 3.6, cards, true);
    addPad(p3.x - 1.8, p3.y - 1.8, 3.6, 3.6, cards, true);
    const t1 = addTrace([p0, v1], 1, 1.2, cards, false);
    const routed = [v1, ...seg(v1, v2, rand() < 0.5)];
    const t2 = addTrace(routed, 2, 1.1, cards, true);
    const t3 = addTrace([v2, p3], 1, 1.2, cards, false);
    t1.next = t2; t2.prev = t1; t2.next = t3; t3.prev = t2;
    t1.endVia = v1; t2.startVia = v1; t2.endVia = v2; t3.startVia = v2;
    // a support component sitting on the route, away from any card body
    const mid = { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 };
    addNode(mid.x, mid.y, 2.35, cards);
    const clearOfCards = !boxes.some((b) => inRect(mid.x, mid.y, b, 24));
    if (clearOfCards) {
      const vertical = Math.abs(v2.x - v1.x) < Math.abs(v2.y - v1.y);
      passive(mid.x, mid.y, vertical, 0.8, rand() < 0.5 ? `R${30 + i}${j}` : `C${30 + i}${j}`, cards, false);
      addVia(mid.x + (vertical ? 10 : 0), mid.y + (vertical ? 0 : 10), 2.4, cards);
    } else {
      addVia(mid.x, mid.y, 2.4, cards);
    }
    // silent reference (no visible bus): net name near the midpoint only
    if (Math.abs(ac.x - bc.x) > 40 || Math.abs(ac.y - bc.y) > 40) {
      const net = NETS[netCursor % NETS.length];
      netCursor += 1;
      text(net, mid.x + 9, mid.y - 7, 6.2, 0.32);
    }
  });

  /* --- gutter intersections: decoupling / test-point cluster --------- */
  boxes.forEach((a) => {
    const r = rightOf(a);
    const d = belowOf(a);
    if (!r || !d || d.i === 99) return;
    const gx = (a.x + a.w + r.x) / 2;
    const gy = (a.y + a.h + d.y) / 2;
    if (r.x - (a.x + a.w) < 28 || d.y - (a.y + a.h) < 28) return;
    const cards = [a.i, r.i, d.i];
    addNode(gx, gy, 2.5, cards);
    addPad(gx - 4, gy - 4, 8, 8, cards, true);
    silkRing(gx, gy, 7.6, 0.32);
    text(`TP${(a.i % 9) + 1}`, gx + 10, gy - 9, 6.5, 0.4);
    const pv = passive(gx - 13, gy + 11, false, 0.9, "", cards, false);
    addVia(gx + 11, gy + 11, 2.8, cards);
    addVia(gx - 12, gy - 12, 2.8, cards);
    const c0 = { x: gx, y: gy };
    addTrace([c0, ...seg(c0, { x: gx + 11, y: gy + 11 }, false)], 1, 1.4, cards);
    addTrace([c0, ...seg(c0, { x: gx - 12, y: gy - 12 }, false)], 1, 1.4, cards);
    const pc = { x: pv[1].x + pv[1].w / 2, y: pv[1].y + pv[1].h / 2 };
    addTrace([pc, { x: gx + 2, y: pc.y }, { x: gx + 6, y: pc.y - 4 }], 1, 1.2, cards, false);
  });

  /* --- fan-out helper (bundle of lanes from a set of starts to pins) - */
  const fan = (starts: P[], pins: P[], axis: "h" | "v", cards: number[], layer: 1 | 2 = 1, w = 1.5) => {
    const n = Math.min(starts.length, pins.length);
    for (let k = 0; k < n; k += 1) {
      const s = starts[k];
      const e = pins[k];
      const d = axis === "h" ? e.y - s.y : e.x - s.x;
      const L = axis === "h" ? e.x - s.x : e.y - s.y;
      const ad = Math.abs(d);
      if (Math.abs(L) < ad + 5) {
        addTrace([s, ...seg(s, e, true)], layer, w, cards);
        continue;
      }
      const um = (Math.abs(L) - ad) / 2;
      const su = Math.sign(L);
      const p1: P = axis === "h" ? { x: s.x + su * um, y: s.y } : { x: s.x, y: s.y + su * um };
      const p2: P = axis === "h" ? { x: s.x + su * (um + ad), y: e.y } : { x: e.x, y: s.y + su * (um + ad) };
      addTrace([s, p1, p2, e], layer, w, cards);
    }
  };

  /* --- outer-margin packages for left / right column cards ---------- */
  const usableL = ml >= 74;
  const usableR = mr >= 74;
  const leftKinds = ["soic", "tp", "qfp"];
  const rightKinds = ["hdr", "soic", "hdr"];
  const marginFan = (b: Box, side: "l" | "r", kind: string, order: number) => {
    const m = side === "l" ? ml : mr;
    const dir: 1 | -1 = side === "l" ? -1 : 1;
    const edge = side === "l" ? b.x : b.x + b.w;
    const F = clamp(m * 0.3, 26, 46);
    const s = clamp((m - F - 8 - 22) / 40, 0.72, 1.3);
    const cy = b.y + b.h * (0.5 + (rand() - 0.5) * 0.14);
    const pcy = cy + (rand() - 0.5) * 10;
    const px = edge + dir * (8 + F);
    const cards = [b.i];
    let pins: P[] = [];
    if (kind === "soic") pins = soic(px, pcy, dir, s, `U${order + 1}`, cards);
    else if (kind === "qfp") pins = qfp(px, pcy, dir, s, `U${order + 1}`, cards);
    else if (kind === "hdr") pins = header(px, pcy, dir, s, `J${order - 2}`, cards, 5);
    else pins = testPoints(px, pcy, dir, s, cards, order * 4 + 1);
    const sp = 7.2;
    const starts: P[] = pins.map((_, k) => {
      const y = cy + (k - (pins.length - 1) / 2) * sp;
      addPad(side === "l" ? edge - 8 : edge + 1, y - 1.8, 7, 3.6, cards);
      return { x: edge + dir * 8, y };
    });
    fan(starts, pins, "h", cards, 1, 1.6);
    const off = 34 * s + pins.length * 2;
    if (kind === "soic") {
      passive(px + dir * 20 * s, cy - off, true, s, `C${order * 2 + 1}`, cards);
      passive(px + dir * 20 * s, cy + off, true, s, `C${order * 2 + 2}`, cards);
    } else if (kind === "qfp") {
      crystal(px + dir * 20 * s, cy + off + 4, s, `Y${order + 1}`, cards);
      led(px + dir * 20 * s, cy - off - 2, s, cards, 2600 + order * 900, `D${order + 1}`);
    } else if (kind === "hdr") {
      passive(px + dir * 6 * s, cy + off - 4, false, s, `R${order - 2}`, cards);
      led(px + dir * 6 * s, cy - off, s, cards, 3100 + order * 700, `D${order + 1}`);
    } else {
      passive(px + dir * 26 * s, cy - 14 * s, false, s, `R${order * 2 + 1}`, cards);
      passive(px + dir * 26 * s, cy + 16 * s, false, s, `R${order * 2 + 2}`, cards);
    }
    for (let q = 0; q < 3; q += 1) {
      const vx = edge + dir * (m - 26 - rand() * Math.max(6, m * 0.2));
      const vy = b.y + 22 + rand() * (b.h - 44);
      addNode(vx, vy, 1.8, cards);
      addVia(vx, vy, 2.6, cards);
      addTrace([{ x: vx, y: vy }, ...seg({ x: vx, y: vy }, { x: vx + dir * 12, y: vy + (rand() < 0.5 ? -12 : 12) }, false)], 1, 1.2, cards, false);
    }
  };

  boxes.filter((b) => !hasLeft(b)).sort((p, q) => p.y - q.y).forEach((b, order) => {
    if (usableL && order < leftKinds.length) marginFan(b, "l", leftKinds[order], order);
  });
  boxes.filter((b) => !rightOf(b)).sort((p, q) => p.y - q.y).forEach((b, order) => {
    if (usableR && order < rightKinds.length) marginFan(b, "r", rightKinds[order], order + 3);
  });

  /* --- short breakouts where there's no neighbour / no margin room --- */
  const stub = (b: Box, side: "l" | "r" | "t") => {
    const cards = [b.i];
    const n = 4;
    const sp = 7;
    for (let k = 0; k < n; k += 1) {
      if (side === "t") {
        const x = b.x + b.w * 0.5 + (k - (n - 1) / 2) * sp + (rand() - 0.5) * 40;
        const room = intro ? b.y - (intro.y + intro.h) : 30;
        const L = Math.min(room - 10, 18 + k * 3);
        if (L < 10) continue;
        addPad(x - 1.8, b.y - 8, 3.6, 7, cards);
        const p0 = { x, y: b.y - 8 };
        const mid = { x, y: b.y - 8 - L * 0.45 };
        const end = { x: x + (k % 2 ? 1 : -1) * L * 0.55, y: b.y - 8 - L };
        addTrace([p0, mid, end], 1, 1.4, cards);
        addVia(end.x, end.y, 2.8, cards);
      } else {
        const dir = side === "l" ? -1 : 1;
        const y = b.y + b.h / 2 + (k - (n - 1) / 2) * sp;
        const edge = side === "l" ? b.x : b.x + b.w;
        addPad(side === "l" ? edge - 8 : edge + 1, y - 1.8, 7, 3.6, cards);
        const p0 = { x: edge + dir * 8, y };
        const L = clamp((side === "l" ? ml : mr) - 22, 12, 34);
        const end = { x: p0.x + dir * L, y: y + (k % 2 ? 1 : -1) * (6 + k * 2) };
        addTrace([p0, ...seg(p0, end, true)], 1, 1.4, cards);
        addVia(end.x, end.y, 2.8, cards);
      }
    }
  };
  boxes.filter((b) => !hasLeft(b) && !usableL).forEach((b) => stub(b, "l"));
  boxes.filter((b) => !rightOf(b) && !usableR).forEach((b) => stub(b, "r"));
  boxes.filter((b) => Math.abs(b.y - gt) < 8).forEach((b) => stub(b, "t"));

  /* --- generic jogged bundle (backbones, top / bottom bands) --------- */
  const bundle = (x0: number, x1: number, y: number, lanes: number, sp: number, layer: 1 | 2, w: number, endVias: boolean) => {
    const lp: P[][] = Array.from({ length: lanes }, () => []);
    let x = x0;
    let yy = y;
    const push = (px: number, py: number) => lp.forEach((arr, k) => arr.push({ x: px, y: py + (k - (lanes - 1) / 2) * sp }));
    push(x, yy);
    while (x < x1) {
      x = Math.min(x1, x + 90 + rand() * 170);
      push(x, yy);
      if (x >= x1 - 30) break;
      const jog = (rand() < 0.5 ? -1 : 1) * (6 + rand() * 8);
      x += Math.abs(jog);
      yy += jog;
      push(x, yy);
      addNode(x, yy, 1.9, []);
    }
    lp.forEach((pts) => {
      const t = addTrace(pts, layer, w, [], true);
      if (endVias) {
        t.startVia = addVia(pts[0].x, pts[0].y, 2.9, []);
        t.endVia = addVia(pts[pts.length - 1].x, pts[pts.length - 1].y, 2.9, []);
        addNode(pts[0].x, pts[0].y, 1.7, []);
        addNode(pts[pts.length - 1].x, pts[pts.length - 1].y, 1.7, []);
      }
    });
    return { starts: lp.map((a) => a[0]), ends: lp.map((a) => a[a.length - 1]) };
  };

  /* --- long inter-row backbones: bottom layer, dim, jogged ----------- */
  const rows = Array.from(new Set(boxes.map((b) => Math.round(b.y)))).sort((a, b) => a - b);
  rows.slice(0, -1).forEach((ry, i) => {
    const upper = boxes.find((b) => Math.round(b.y) === ry);
    if (!upper) return;
    const lowerY = rows[i + 1];
    if (lowerY - (upper.y + upper.h) < 30) return;
    const gy = (upper.y + upper.h + lowerY) / 2;
    const a0 = i % 2 === 0 ? gl - 44 : gl + (gr - gl) * 0.34;
    const a1 = i % 2 === 0 ? gl + (gr - gl) * 0.68 : gr + 44;
    bundle(Math.max(24, a0), Math.min(W - 24, a1), gy + (i % 2 ? 9 : -9), 2, 5, 2, 1.3, true);
  });

  /* --- top band ------------------------------------------------------ */
  const topLimit = idx ? idx.y : gt - 120;
  if (topLimit > 64) {
    const ty = clamp(topLimit * 0.5, 34, topLimit - 22);
    B.pours.push({ x: 16, y: 16, w: W - 32, h: Math.max(20, topLimit - 18) });
    const qx = gr - 44;
    const pins = qfp(qx, ty, -1, 0.95, "U0", []);
    const bnd = bundle(gl + 130, qx - 40, ty, 6, 4.6, 1, 1.5, false);
    fan(bnd.ends, pins, "h", []);
    const tps = testPoints(gl + 56, ty, -1, 0.8, [], 5);
    fan(bnd.starts.slice(0, 4), tps, "h", []);
    text("JCP-ENG-BRD  REV A", gl + 150, 24, 7.5, 0.5);
  }

  /* --- bottom band --------------------------------------------------- */
  const sb = strip ? strip.y + strip.h : boxes.reduce((m, b) => Math.max(m, b.y + b.h), 0);
  if (H - sb > 70) {
    B.pours.push({ x: 16, y: sb + 18, w: W - 32, h: H - sb - 34 });
    const by = sb + (H - sb) * 0.46;
    if (strip) {
      for (let k = 0; k < 6; k += 1) {
        const x = strip.x + strip.w * 0.16 + k * 7.2;
        addPad(x - 1.8, strip.y + strip.h + 1, 3.6, 7, []);
        const p0 = { x, y: strip.y + strip.h + 8 };
        const p1 = { x, y: p0.y + 10 + (k % 2) * 5 };
        const p2 = { x: x - 10, y: p1.y + 10 };
        addTrace([p0, p1, p2], 1, 1.4, [], true);
        addVia(p2.x, p2.y, 2.8, []);
      }
    }
    const qx = gl + 150;
    const pinsQ = qfp(qx, by, -1, 1, "U4", []);
    const bnd = bundle(qx + 40, gl + (gr - gl) * 0.52, by, 6, 4.6, 1, 1.5, false);
    fan(bnd.starts, pinsQ, "h", []);
    bnd.ends.forEach((e) => addVia(e.x, e.y, 2.9, []));
    crystal(gl + 56, by - 40, 0.95, "Y4", []);
    passive(gl + 54, by + 40, false, 0.95, "C40", []);
    passive(gl + 88, by + 40, false, 0.95, "C41", []);
    const fx0 = gl + (gr - gl) * 0.62;
    for (let k = 0; k < 16; k += 1) {
      const x = fx0 + k * 8.8;
      addPad(x - 2.2, H - 30, 4.4, 20, []);
      const top = { x, y: H - 32 };
      const up = 8 + (k % 5) * 6;
      const end = { x: x + (k % 2 ? 6 : -6), y: top.y - up - 6 };
      addTrace([top, { x, y: top.y - up }, end], 1, 1.3, [], true);
      addVia(end.x, end.y, 2.4, []);
    }
    silkRect(fx0 - 9, H - 34, 16 * 8.8 + 10, 26, 0.24);
    text("J5  EDGE I/O", fx0 - 6, H - 44, 7, 0.5);
    header(gr - 30, by - 4, -1, 0.95, "J6", [], 5);
    led(gr - 86, by + 40, 1, [], 3300, "D9");
  }

  /* --- outer pours, sprinkled vias ----------------------------------- */
  B.pours.unshift({ x: 14, y: 14, w: W - 28, h: H - 28, a: 0.24 });
  if (ml > 60) B.pours.push({ x: 16, y: 16, w: Math.max(20, ml - 30), h: H - 32 });
  if (mr > 60) B.pours.push({ x: W - mr + 14, y: 16, w: Math.max(20, mr - 30), h: H - 32 });
  for (let i = 0; i < 12; i += 1) {
    const x = i % 2 === 0 ? 30 + rand() * Math.max(6, ml - 80) : W - 30 - rand() * Math.max(6, mr - 80);
    const y = 60 + rand() * (H - 120);
    if (boxes.some((b) => inRect(x, y, b, 14)) || (strip && inRect(x, y, strip, 14))) continue;
    if (intro && inRect(x, y, intro, 20)) continue;
    addVia(x, y, 2.6, []);
  }

  /* --- additional connected junction nodes --------------------------- */
  // Promote selected routing bends into visible junction/test nodes.
  // This adds PCB network structure without introducing floating decoration.
  let bendCount = 0;
  for (const t of B.traces) {
    if (t.pts.length < 3 || bendCount >= 54) continue;
    for (let k = 1; k < t.pts.length - 1 && bendCount < 54; k += 2) {
      const p = t.pts[k];
      if (boxes.some((b) => inRect(p.x, p.y, b, 10)) || (strip && inRect(p.x, p.y, strip, 10))) continue;
      addNode(p.x, p.y, 1.85, t.group);
      bendCount += 1;
    }
  }

  [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(([x, y]) => B.holes.push({ x, y }));
  if (intro) B.dims.push({ x: intro.x - 10, y: intro.y - 6, w: intro.w + 20, h: intro.h + 12 });
  if (introP) B.dims.push({ x: introP.x - 10, y: introP.y - 6, w: introP.w + 20, h: introP.h + 12 });
  if (idx) B.dims.push({ x: idx.x - 12, y: idx.y - 8, w: idx.w + 40, h: idx.h + 16 });

  for (let i = 0; i < nCards; i += 1) {
    B.hotTraces.push(B.traces.filter((t) => t.group.includes(i)));
    B.hotPads.push(B.pads.filter((p) => p.cards.includes(i)));
    B.hotVias.push(B.vias.filter((v) => v.cards.includes(i)));
    B.hotNodes.push(B.nodes.filter((n) => n.cards.includes(i)));
    B.hotBodies.push(B.bodies.filter((b) => b.cards.includes(i)));
  }
  return B;
}

/* ------------------------------------------------------------- STATIC */
function makePattern(size: number, draw: (c: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) draw(g);
  return c;
}

function drawStatic(ctx: CanvasRenderingContext2D, B: Board) {
  const { W, H } = B;
  const rand = rng(777);
  // 1 — substrate (FR4 / solder mask)
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#03101a");
  g.addColorStop(0.5, "#02090f");
  g.addColorStop(1, "#031019");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 26; i += 1) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 120 + rand() * 260;
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, rand() < 0.5 ? "rgba(10,70,96,.10)" : "rgba(6,52,64,.09)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const weave = makePattern(4, (c) => {
    c.fillStyle = "rgba(110,185,215,.035)";
    c.fillRect(0, 0, 2, 4);
    c.fillStyle = "rgba(110,185,215,.022)";
    c.fillRect(0, 0, 4, 2);
  });
  ctx.fillStyle = ctx.createPattern(weave, "repeat") ?? "transparent";
  ctx.fillRect(0, 0, W, H);

  // 2 — hatched copper pour
  const hatch = makePattern(8, (c) => {
    c.strokeStyle = "rgba(38,128,168,.30)";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(-1, 9); c.lineTo(9, -1);
    c.moveTo(-1, 1); c.lineTo(1, -1);
    c.moveTo(7, 9); c.lineTo(9, 7);
    c.stroke();
  });
  const hatchPat = ctx.createPattern(hatch, "repeat");
  B.pours.forEach((p) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 8);
    ctx.clip();
    ctx.globalAlpha = p.a ?? 0.55;
    if (hatchPat) { ctx.fillStyle = hatchPat; ctx.fillRect(p.x, p.y, p.w, p.h); }
    ctx.restore();
    ctx.strokeStyle = `rgba(44,140,182,${p.a ? 0.12 : 0.30})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 8);
    ctx.stroke();
  });
  const inPour = (x: number, y: number) => B.pours.some((p) => inRect(x, y, p, 0));

  // 3 — clearance halos cut into the pour
  ctx.save();
  ctx.fillStyle = "#02090f";
  ctx.strokeStyle = "#02090f";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  B.traces.forEach((t) => {
    if (!inPour(t.pts[0].x, t.pts[0].y)) return;
    ctx.lineWidth = t.w + 6;
    strokePts(ctx, t.pts);
  });
  B.vias.forEach((v) => {
    if (!inPour(v.x, v.y)) return;
    ctx.beginPath(); ctx.arc(v.x, v.y, v.r + 4, 0, Math.PI * 2); ctx.fill();
  });
  B.pads.forEach((p) => { if (inPour(p.x, p.y)) ctx.fillRect(p.x - 3.5, p.y - 3.5, p.w + 7, p.h + 7); });
  B.bodies.forEach((b) => { if (inPour(b.x, b.y)) ctx.fillRect(b.x - 12, b.y - 12, b.w + 24, b.h + 24); });
  ctx.restore();

  // 4 — traces: bottom layer first, then top-layer copper
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  B.traces.filter((t) => t.layer === 2).forEach((t) => {
    ctx.strokeStyle = "rgba(18,80,112,.42)";
    ctx.lineWidth = t.w + 2.2;
    strokePts(ctx, t.pts);
    ctx.strokeStyle = "rgba(38,128,170,.62)";
    ctx.lineWidth = t.w;
    strokePts(ctx, t.pts);
  });
  B.traces.filter((t) => t.layer === 1).forEach((t) => {
    ctx.strokeStyle = "rgba(14,84,120,.34)";
    ctx.lineWidth = t.w + 3;
    strokePts(ctx, t.pts);
    ctx.strokeStyle = "rgba(48,156,204,.92)";
    ctx.lineWidth = t.w;
    strokePts(ctx, t.pts);
    ctx.strokeStyle = "rgba(150,226,246,.30)";
    ctx.lineWidth = Math.max(0.5, t.w * 0.28);
    strokePts(ctx, t.pts.map((p) => ({ x: p.x - 0.3, y: p.y - 0.4 })));
  });

  // 5 — package bodies
  B.bodies.forEach((b) => {
    ctx.fillStyle = "rgb(4,15,23)";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    const bg = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
    bg.addColorStop(0, "rgba(90,180,215,.16)");
    bg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
    ctx.strokeStyle = "rgba(78,170,210,.72)";
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
    ctx.fillStyle = "rgba(120,215,245,.75)";
    ctx.beginPath();
    ctx.arc(b.x + 4, b.y + 4, 1.4, 0, Math.PI * 2);
    ctx.fill();
    if (b.w > 16) {
      ctx.strokeStyle = "rgba(70,150,190,.35)";
      ctx.lineWidth = 0.7;
      ctx.strokeRect(b.x + 3.5, b.y + 3.5, b.w - 7, b.h - 7);
    }
  });

  // 6 — pads and vias
  B.pads.forEach((p) => {
    ctx.fillStyle = "rgba(72,176,218,.95)";
    if (p.round) {
      ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + p.h / 2, Math.min(p.w, p.h) / 2, 0, Math.PI * 2); ctx.fill();
      if (p.w > 5) {
        ctx.fillStyle = "#02090f";
        ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + p.h / 2, Math.min(p.w, p.h) * 0.2, 0, Math.PI * 2); ctx.fill();
      }
    } else ctx.fillRect(p.x, p.y, p.w, p.h);
  });
  B.vias.forEach((v) => {
    ctx.fillStyle = "rgba(74,178,220,.95)";
    ctx.beginPath(); ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#02090f";
    ctx.beginPath(); ctx.arc(v.x, v.y, v.r * 0.42, 0, Math.PI * 2); ctx.fill();
  });

  // 7 — silkscreen
  B.silk.forEach((fn) => fn(ctx));

  // 8 — board outline + plated mounting holes
  ctx.strokeStyle = "rgba(96,196,232,.34)";
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.roundRect(5, 5, W - 10, H - 10, 10); ctx.stroke();
  ctx.strokeStyle = "rgba(96,196,232,.12)";
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(11, 11, W - 22, H - 22, 7); ctx.stroke();
  B.holes.forEach((h) => {
    ctx.fillStyle = "#02090f";
    ctx.beginPath(); ctx.arc(h.x, h.y, 13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(170,218,236,.32)";
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.arc(h.x, h.y, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(72,176,218,.9)";
    ctx.beginPath(); ctx.arc(h.x, h.y, 8.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#010508";
    ctx.beginPath(); ctx.arc(h.x, h.y, 4.4, 0, Math.PI * 2); ctx.fill();
  });

  // 9 — soft dim behind the headings so copy stays legible
  B.dims.forEach((d) => {
    for (let s = 5; s >= 0; s -= 1) {
      const m = s * 9;
      ctx.fillStyle = `rgba(2,9,15,${0.09 + (5 - s) * 0.018})`;
      ctx.fillRect(d.x - m, d.y - m, d.w + m * 2, d.h + m * 2);
    }
  });
}

/* ------------------------------------------------------------ COMPONENT */
export default function SkillsEngineeringCanvas() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const staticRef = useRef<HTMLCanvasElement | null>(null);
  const dynRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = wrap?.parentElement as HTMLElement | null;
    const sc = staticRef.current;
    const dc = dynRef.current;
    if (!wrap || !host || !sc || !dc) return;
    const sctx = sc.getContext("2d");
    const dctx = dc.getContext("2d");
    if (!sctx || !dctx) return;

    const reducedQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQ.matches;
    let board: Board | null = null;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let time = 0;
    let hv: number[] = [];
    let target: number[] = [];
    let pulses: Pulse[] = [];
    let spawnAcc = 0;
    let viaAcc = 0;
    let nodeAcc = 0;
    let hoverAcc = 0;
    const rand = rng(31337);

    // pre-rendered soft glow sprite for pulse heads / via flashes
    const glow = makePattern(32, (c) => {
      const gr = c.createRadialGradient(16, 16, 0, 16, 16, 16);
      gr.addColorStop(0, "rgba(190,246,255,1)");
      gr.addColorStop(0.25, "rgba(90,220,255,.55)");
      gr.addColorStop(1, "rgba(30,160,230,0)");
      c.fillStyle = gr;
      c.fillRect(0, 0, 32, 32);
    });

    const spawnIdle = () => {
      if (!board) return;
      const pool = board.traces.filter((t) => t.pulse);
      if (!pool.length) return;
      const t = pool[Math.floor(rand() * pool.length)];
      const r = rand();
      // mostly slow/medium, a few fast packets
      const v = r < 0.62 ? 28 + rand() * 24 : r < 0.93 ? 58 + rand() * 34 : 130 + rand() * 60;
      const dir: 1 | -1 = rand() < 0.5 ? 1 : -1;
      const a = t.layer === 2 ? 0.55 : 0.85;
      pulses.push({ t, d: dir === 1 ? 0 : t.len, dir, v, a, hover: false });
      if (rand() < 0.16) {
        // short packet burst: two trailing pulses
        for (let i = 1; i <= 2; i += 1) pulses.push({ t, d: dir === 1 ? -i * 16 : t.len + i * 16, dir, v, a: 0.7, hover: false });
      }
    };

    const spawnHover = (card: number) => {
      if (!board) return;
      const pool = board.hotTraces[card];
      if (!pool || !pool.length) return;
      const t = pool[Math.floor(rand() * pool.length)];
      const c = board.centers[card];
      const d0 = Math.hypot(t.pts[0].x - c.x, t.pts[0].y - c.y);
      const d1 = Math.hypot(t.pts[t.pts.length - 1].x - c.x, t.pts[t.pts.length - 1].y - c.y);
      const dir: 1 | -1 = d0 <= d1 ? 1 : -1;
      pulses.push({ t, d: dir === 1 ? 0 : t.len, dir, v: 120 + rand() * 90, a: 1, hover: true });
    };

    const step = (dt: number) => {
      if (!board) return;
      const currentBoard = board;
      time += dt;
      for (let i = 0; i < hv.length; i += 1) hv[i] += (target[i] - hv[i]) * Math.min(1, dt * 7);

      const goal = clamp(Math.round((board.W / 1440) * 48), 20, 56);
      const idleCount = pulses.reduce((n, p) => n + (p.hover ? 0 : 1), 0);
      spawnAcc += dt;
      if (idleCount < goal && spawnAcc > 0.055) { spawnAcc = 0; spawnIdle(); }

      hoverAcc += dt;
      if (hoverAcc > 0.09) {
        hoverAcc = 0;
        const hoverCount = pulses.reduce((n, p) => n + (p.hover ? 1 : 0), 0);
        target.forEach((v, i) => { if (v > 0 && hoverCount < 20) spawnHover(i); });
      }
      viaAcc += dt;
      if (viaAcc > 0.22) {
        viaAcc = 0;
        const v = board.vias[Math.floor(rand() * board.vias.length)];
        if (v) v.flash = 0.9;
      }
      board.vias.forEach((v) => { if (v.flash > 0) v.flash = Math.max(0, v.flash - dt * 1.6); });

      nodeAcc += dt;
      if (nodeAcc > 0.18 && board.nodes.length) {
        nodeAcc = 0;
        const node = board.nodes[Math.floor(rand() * board.nodes.length)];
        node.flash = 0.78;
      }
      board.nodes.forEach((n) => { if (n.flash > 0) n.flash = Math.max(0, n.flash - dt * 2.0); });
      target.forEach((lvl, i) => {
        if (lvl > 0.45) currentBoard.hotNodes[i].forEach((n) => { n.flash = Math.max(n.flash, 0.55 * lvl); });
      });

      pulses = pulses.filter((p) => {
        p.d += p.dir * p.v * dt;
        if (p.dir === 1 && p.d > p.t.len) {
          if (p.t.endVia) p.t.endVia.flash = 1;
          if (p.t.next) { p.d -= p.t.len; p.t = p.t.next; return true; }
          return false;
        }
        if (p.dir === -1 && p.d < 0) {
          if (p.t.startVia) p.t.startVia.flash = 1;
          if (p.t.prev) { p.t = p.t.prev; p.d += p.t.len; return true; }
          return false;
        }
        return true;
      });
    };

    const drawDyn = () => {
      if (!board) return;
      const B = board;
      const currentBoard = B;
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx.clearRect(0, 0, B.W, B.H);
      dctx.lineCap = "round";
      dctx.lineJoin = "round";
      const anyHover = hv.some((v) => v > 0.03);

      // hover activation: brighten the local circuit
      hv.forEach((lvl, i) => {
        if (lvl < 0.02) return;
        currentBoard.hotTraces[i].forEach((t) => {
          dctx.strokeStyle = `rgba(60,200,255,${0.16 * lvl})`;
          dctx.lineWidth = t.w + 6;
          strokePts(dctx, t.pts);
          dctx.strokeStyle = `rgba(130,236,255,${0.9 * lvl})`;
          dctx.lineWidth = t.w + 0.2;
          strokePts(dctx, t.pts);
        });
        currentBoard.hotPads[i].forEach((p) => {
          dctx.fillStyle = `rgba(150,240,255,${0.95 * lvl})`;
          if (p.round) { dctx.beginPath(); dctx.arc(p.x + p.w / 2, p.y + p.h / 2, Math.min(p.w, p.h) / 2 + 0.6, 0, Math.PI * 2); dctx.fill(); }
          else dctx.fillRect(p.x - 0.5, p.y - 0.5, p.w + 1, p.h + 1);
        });
        currentBoard.hotBodies[i].forEach((b) => {
          dctx.fillStyle = `rgba(40,150,200,${0.2 * lvl})`;
          dctx.fillRect(b.x, b.y, b.w, b.h);
          dctx.strokeStyle = `rgba(140,240,255,${0.95 * lvl})`;
          dctx.lineWidth = 1.4;
          dctx.strokeRect(b.x, b.y, b.w, b.h);
        });
        currentBoard.hotVias[i].forEach((v) => {
          dctx.globalAlpha = 0.9 * lvl;
          dctx.drawImage(glow, v.x - 10, v.y - 10, 20, 20);
          dctx.globalAlpha = 1;
          dctx.fillStyle = `rgba(190,248,255,${lvl})`;
          dctx.beginPath(); dctx.arc(v.x, v.y, v.r * 0.85, 0, Math.PI * 2); dctx.fill();
        });
        currentBoard.hotNodes[i].forEach((n) => {
          dctx.globalAlpha = 0.55 * lvl;
          dctx.drawImage(glow, n.x - 7, n.y - 7, 14, 14);
          dctx.globalAlpha = 1;
          dctx.fillStyle = `rgba(170,238,255,${0.55 + 0.45 * lvl})`;
          dctx.beginPath(); dctx.arc(n.x, n.y, n.r + 0.8, 0, Math.PI * 2); dctx.fill();
          dctx.fillStyle = `rgba(2,13,19,${0.95})`;
          dctx.beginPath(); dctx.arc(n.x, n.y, Math.max(0.8, n.r * 0.42), 0, Math.PI * 2); dctx.fill();
        });
      });

      // via flashes (pulses crossing vias / random activity)
      B.vias.forEach((v) => {
        if (v.flash < 0.03) return;
        dctx.globalAlpha = v.flash;
        dctx.drawImage(glow, v.x - 9, v.y - 9, 18, 18);
      });
      dctx.globalAlpha = 1;

      // connected junction nodes: subtle idle flash / brighter when active
      B.nodes.forEach((n) => {
        if (n.flash < 0.03) return;
        dctx.globalAlpha = n.flash;
        dctx.drawImage(glow, n.x - 7, n.y - 7, 14, 14);
        dctx.globalAlpha = 1;
        dctx.fillStyle = `rgba(175,240,255,${0.45 + n.flash * 0.55})`;
        dctx.beginPath();
        dctx.arc(n.x, n.y, n.r + n.flash * 0.7, 0, Math.PI * 2);
        dctx.fill();
        dctx.fillStyle = "rgba(2,13,19,.92)";
        dctx.beginPath();
        dctx.arc(n.x, n.y, Math.max(0.7, n.r * 0.42), 0, Math.PI * 2);
        dctx.fill();
      });

      // signal pulses (others stay active but subdued while a card is hovered)
      pulses.forEach((p) => {
        if (p.d < -2 || p.d > p.t.len + 2) return;
        const boost = p.hover ? 1 : Math.max(0, ...p.t.group.map((g) => hv[g] ?? 0));
        const a = p.hover ? p.a : p.a * (anyHover ? 0.6 + boost * 0.6 : 1);
        const tail = p.hover ? 26 : 20;
        const dNow = clamp(p.d, 0, p.t.len);
        const from = clamp(p.d - p.dir * tail, 0, p.t.len);
        const pts: P[] = [];
        const n = 5;
        for (let i = 0; i <= n; i += 1) pts.push(pointAt(p.t, from + ((dNow - from) * i) / n));
        dctx.strokeStyle = `rgba(70,215,255,${0.3 * a})`;
        dctx.lineWidth = p.t.w + 2.6;
        strokePts(dctx, pts);
        dctx.strokeStyle = `rgba(200,248,255,${0.95 * a})`;
        dctx.lineWidth = Math.max(1.2, p.t.w * 0.7);
        strokePts(dctx, pts.slice(Math.floor(n / 2)));
        const h = pointAt(p.t, p.d);
        dctx.globalAlpha = Math.min(1, a);
        dctx.drawImage(glow, h.x - 7, h.y - 7, 14, 14);
        dctx.globalAlpha = 1;
      });

      // status LEDs
      B.leds.forEach((l) => {
        const ph = ((time * 1000 + l.phase) % l.period) / l.period;
        const on = reduced ? 0.8 : ph < 0.14 ? 1 : ph < 0.22 ? 0.35 : 0.14;
        const boost = Math.max(0, ...l.cards.map((c) => hv[c] ?? 0));
        const lv = clamp(on + boost * 0.6, 0, 1);
        dctx.globalAlpha = lv;
        dctx.drawImage(glow, l.x - 8, l.y - 8, 16, 16);
        dctx.globalAlpha = 1;
        dctx.fillStyle = `rgba(190,248,255,${0.35 + lv * 0.65})`;
        dctx.fillRect(l.x - 1.6, l.y - 1.2, 3.2, 2.4);
      });
    };

    const rebuild = () => {
      const r = host.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const b = buildBoard(host);
      board = b;
      [sc, dc].forEach((c) => {
        c.width = Math.floor(b.W * dpr);
        c.height = Math.floor(b.H * dpr);
        c.style.width = `${b.W}px`;
        c.style.height = `${b.H}px`;
      });
      hv = new Array<number>(b.cardCount).fill(0);
      target = new Array<number>(b.cardCount).fill(0);
      pulses = [];
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, b.W, b.H);
      drawStatic(sctx, b);
      if (reduced) {
        // seed a handful of frozen pulses so the board still reads as powered
        for (let i = 0; i < 18; i += 1) {
          spawnIdle();
          const p = pulses[pulses.length - 1];
          if (p) p.d = rand() * p.t.len;
        }
        drawDyn();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      drawDyn();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onHover = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      const els = Array.from(host.querySelectorAll<HTMLElement>(".futuristic-skill-card"));
      const idx = els.findIndex((el) => el.dataset.skill === detail);
      target = target.map((_, i) => (detail && i === idx ? 1 : 0));
      if (reduced) { hv = target.slice(); drawDyn(); }
    };
    const onReduced = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      stop();
      rebuild();
      start();
    };
    const onVis = () => (document.hidden ? stop() : start());

    let rt = 0;
    const scheduleRebuild = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(rebuild, 90);
    };

    rebuild();
    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(host);
    const gridEl = host.querySelector(".futuristic-skills-grid");
    if (gridEl) ro.observe(gridEl);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { rootMargin: "120px" });
    io.observe(host);
    const late = window.setTimeout(rebuild, 700); // after webfonts settle card heights
    window.addEventListener("skill-card-hover", onHover as EventListener);
    document.addEventListener("visibilitychange", onVis);
    reducedQ.addEventListener("change", onReduced);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(rt);
      window.clearTimeout(late);
      window.removeEventListener("skill-card-hover", onHover as EventListener);
      document.removeEventListener("visibilitychange", onVis);
      reducedQ.removeEventListener("change", onReduced);
    };
  }, []);

  return (
    <div ref={wrapRef} className="skills-pcb-layer" aria-hidden="true">
      <canvas ref={staticRef} className="skills-pcb-static" />
      <canvas ref={dynRef} className="skills-pcb-dynamic" />
    </div>
  );
}