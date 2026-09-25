import { useEffect, useRef } from "react";
import { getAnimationBudget } from "../utils/performance";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  depth: number;
}

interface Packet {
  a: number;
  b: number;
  t: number;
  speed: number;
}

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function AnimatedTechBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = media.matches;
    let raf = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let time = 0;
    let last = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let nodes: NodePoint[] = [];
    let packets: Packet[] = [];
    let budget = getAnimationBudget(window.innerWidth, window.innerHeight);
    let frameInterval = budget.frameInterval;
    let documentVisible = !document.hidden;
    let running = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      budget = getAnimationBudget(width, height);
      frameInterval = budget.frameInterval;
      dpr = budget.dpr;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = seeded(12031989);
      const count = budget.compact
        ? (budget.lowPower ? 22 : 30)
        : budget.tablet
          ? (budget.lowPower ? 46 : 58)
          : (budget.lowPower ? 72 : 88);
      nodes = Array.from({ length: count }, () => ({
        x: rand() * width,
        y: rand() * height,
        vx: (rand() - 0.5) * 0.07,
        vy: (rand() - 0.5) * 0.05,
        r: 0.6 + rand() * 1.8,
        phase: rand() * Math.PI * 2,
        depth: 0.3 + rand() * 0.7,
      }));
      packets = Array.from({ length: Math.max(8, Math.floor(count * (budget.lowPower ? 0.12 : 0.16))) }, () => ({
        a: Math.floor(rand() * count),
        b: Math.floor(rand() * count),
        t: rand(),
        speed: 0.00008 + rand() * 0.00012,
      }));
    };

    const pointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
      targetY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
    };

    const glow = (x: number, y: number, r: number, a: number) => {
      if (budget.lowPower || budget.compact) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0, 177, 255, ${a})`);
      g.addColorStop(0.5, `rgba(0, 99, 180, ${a * 0.35})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    const draw = (now: number) => {
      if (!documentVisible) { raf = 0; running = false; return; }
      if (now - last < frameInterval) { raf = requestAnimationFrame(draw); return; }
      const delta = Math.min(40, now - last);
      last = now;
      if (!reducedMotion) time += delta;
      pointerX += (targetX - pointerX) * 0.055;
      pointerY += (targetY - pointerY) * 0.055;

      ctx.clearRect(0, 0, width, height);

      glow(width * 0.72 + pointerX * 30, height * 0.2 + pointerY * 20, Math.max(width, height) * 0.62, 0.14);
      glow(width * 0.18 - pointerX * 15, height * 0.72 - pointerY * 12, Math.max(width, height) * 0.44, 0.06);

      const grid = width < 700 ? 34 : 48;
      const offset = reducedMotion ? 0 : (time * 0.006) % grid;
      ctx.save();
      ctx.translate(pointerX * 5, pointerY * 4);
      ctx.strokeStyle = "rgba(51, 149, 214, .052)";
      ctx.lineWidth = 1;
      for (let x = -grid + offset; x <= width + grid; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -grid + offset * 0.7; y <= height + grid; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Moving scan band.
      const scan = ((time * 0.03) % (height + 160)) - 80;
      ctx.fillStyle = "rgba(37, 172, 236, .018)";
      ctx.fillRect(0, scan, width, 86);

      const maxDistance = width < 700 ? 105 : 145;
      for (const node of nodes) {
        if (!reducedMotion) {
          node.x += node.vx * node.depth;
          node.y += node.vy * node.depth;
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > maxDistance) continue;
          const alpha = (1 - dist / maxDistance) * 0.26 * Math.min(a.depth, b.depth);
          ctx.strokeStyle = `rgba(31, 145, 216, ${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(a.x + pointerX * a.depth * 8, a.y + pointerY * a.depth * 5);
          ctx.lineTo(b.x + pointerX * b.depth * 8, b.y + pointerY * b.depth * 5);
          ctx.stroke();
        }
      }

      packets.forEach((packet) => {
        const a = nodes[packet.a];
        const b = nodes[packet.b];
        if (!a || !b) return;
        if (!reducedMotion) packet.t = (packet.t + packet.speed * delta) % 1;
        const x = a.x + (b.x - a.x) * packet.t;
        const y = a.y + (b.y - a.y) * packet.t;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(166, 235, 255, .92)";
        ctx.shadowBlur = budget.lowPower || budget.compact ? 0 : 11;
        ctx.shadowColor = "rgba(38, 185, 255, .8)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      for (const node of nodes) {
        const x = node.x + pointerX * node.depth * 8;
        const y = node.y + pointerY * node.depth * 5;
        const p = reducedMotion ? 0 : Math.sin(time * 0.0012 + node.phase) * 0.45;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(.8, node.r + p), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(51, 190, 255, .72)";
        ctx.shadowBlur = budget.lowPower || budget.compact ? 0 : 8;
        ctx.shadowColor = "rgba(24, 155, 255, .65)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Thin blueprint/circuit traces.
      ctx.save();
      ctx.translate(pointerX * 12, pointerY * 8);
      ctx.strokeStyle = "rgba(30, 136, 194, .13)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i += 1) {
        const y = height * (0.12 + i * 0.067);
        ctx.beginPath();
        ctx.moveTo(width * 0.02, y);
        ctx.lineTo(width * (0.18 + (i % 3) * 0.07), y);
        ctx.lineTo(width * (0.24 + (i % 2) * 0.06), y + 18);
        ctx.lineTo(width * (0.38 + (i % 4) * 0.05), y + 18);
        ctx.stroke();
      }
      ctx.restore();

      // On compact/mobile screens the background is intentionally a single static frame.
      // This keeps the project/resume pages responsive without a continuous canvas loop.
      if (reducedMotion || budget.compact || !documentVisible) {
        raf = 0;
        running = false;
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };
    const start = () => {
      if (running || !documentVisible || reducedMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const mediaChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      stop();
      if (!reducedMotion) start();
      else draw(performance.now());
    };
    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) start(); else stop();
    };

    resize();
    window.addEventListener("resize", resize);
    if (!budget.lowPower && window.matchMedia("(pointer:fine)").matches) {
      window.addEventListener("pointermove", pointerMove, { passive: true });
    }
    media.addEventListener("change", mediaChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (reducedMotion) draw(performance.now()); else start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      media.removeEventListener("change", mediaChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="tech-background" aria-hidden="true">
      <canvas ref={canvasRef} className="tech-network-canvas" />
      <div className="tech-grid" />
      <div className="tech-code tech-code-one">
        <span>const</span> system = build();<br />
        system.<span>test</span>();<br />
        system.<span>deploy</span>();
      </div>
      <div className="tech-code tech-code-two">
        ENGINEERING / LIVE<br />
        status: <span>active</span><br />
        systems: evolving
      </div>
      <div className="circuit circuit-one"><i /><i /><i /></div>
      <div className="circuit circuit-two"><i /><i /></div>
    </div>
  );
}
