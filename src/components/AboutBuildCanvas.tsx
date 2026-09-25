import { useEffect, useRef } from "react";

type BuildBlock = {
  x: number;
  y: number;
  w: number;
  h: number;
  progress: number;
  speed: number;
  label: string;
};

const CODE = [
  "const system = build();",
  "input.map(problem => solution)",
  "test(solution);",
  "debug();",
  "integrate(hardware, software);",
  "learn();",
  "improve();",
  "ship();",
];

const MODULES = ["INPUT", "DESIGN", "TEST", "INTEGRATE", "BUILD", "IMPROVE"];

export default function AboutBuildCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedQuery.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let blocks: BuildBlock[] = [];
    let visible = true;
    let documentVisible = !document.hidden;
    let lastFrameRender = 0;

    const setup = () => {
      width = Math.max(320, window.innerWidth);
      height = Math.max(560, window.innerHeight * 0.92);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      blocks = MODULES.map((label, index) => ({
        x: width * (0.57 + (index % 3) * 0.12),
        y: height * (0.26 + Math.floor(index / 3) * 0.31) + (index % 2 ? 10 : -6),
        w: 118 + (index % 3) * 16,
        h: 56,
        progress: (index * 0.17) % 1,
        speed: 0.00007 + (index % 4) * 0.000025,
        label,
      }));
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = ((event.clientX / Math.max(window.innerWidth, 1)) - 0.5) * 2;
      targetY = ((event.clientY / Math.max(window.innerHeight, 1)) - 0.5) * 2;
    };

    const drawText = (text: string, x: number, y: number, alpha: number, size: number, weight = 500) => {
      context.font = `${weight} ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.fillStyle = `rgba(64, 203, 255, ${alpha})`;
      context.fillText(text, x, y);
    };

    const draw = (now: number) => {
      if (!visible || !documentVisible) {
        raf = 0;
        return;
      }

      const minFrameInterval = width < 900 ? 33.3 : 16.7;
      if (now - lastFrameRender < minFrameInterval) {
        raf = requestAnimationFrame(draw);
        return;
      }

      lastFrameRender = now;
      const delta = Math.min(40, now - last);
      last = now;
      if (!reducedMotion) time += delta;
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;

      context.clearRect(0, 0, width, height);

      const ambient = context.createRadialGradient(width * 0.79, height * 0.52, 0, width * 0.79, height * 0.52, width * 0.42);
      ambient.addColorStop(0, "rgba(21, 183, 255, .11)");
      ambient.addColorStop(.65, "rgba(16, 111, 171, .035)");
      ambient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = ambient;
      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(pointerX * 7, pointerY * 5);

      // Active editor/code fragments.
      CODE.forEach((line, index) => {
        const x = width * (0.56 + (index % 3) * 0.13);
        const y = height * (0.13 + index * 0.055);
        const drift = reducedMotion ? 0 : Math.sin(time * 0.00075 + index) * 4;
        drawText(line, x + drift, y, 0.075 + (index % 3) * 0.012, 10 + (index % 2));
      });

      // Build modules are explicit enough to read as a construction pipeline.
      blocks.forEach((block, index) => {
        if (!reducedMotion) block.progress = (block.progress + delta * block.speed) % 1;
        const phase = block.progress < 0.5 ? block.progress * 2 : 2 - block.progress * 2;
        const x = block.x + Math.sin(time * 0.00028 + index) * 5;
        const y = block.y + Math.cos(time * 0.00022 + index) * 4;
        const active = 0.18 + phase * 0.34;
        const cx = x + block.w * 0.5;

        context.strokeStyle = `rgba(31, 180, 250, ${active})`;
        context.lineWidth = 1.1;
        context.strokeRect(x, y, block.w, block.h);
        context.strokeStyle = `rgba(82, 219, 255, ${0.15 + phase * 0.55})`;
        context.beginPath();
        context.moveTo(x + 10, y + 39);
        context.lineTo(x + 10 + (block.w - 20) * phase, y + 39);
        context.stroke();

        drawText(`0${index + 1}`, x + 9, y + 16, 0.22, 8, 700);
        drawText(block.label, x + 28, y + 17, 0.20 + phase * 0.38, 9, 700);
        drawText(index < 3 ? "ASSEMBLE" : "REFINE", x + 28, y + 29, 0.10 + phase * 0.16, 7, 500);

        const glow = context.createRadialGradient(x + block.w * phase, y + 39, 0, x + block.w * phase, y + 39, 18);
        glow.addColorStop(0, "rgba(110, 231, 255, .45)");
        glow.addColorStop(1, "rgba(31, 191, 255, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x + block.w * phase, y + 39, 18, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "rgba(109, 234, 255, .88)";
        context.beginPath();
        context.arc(cx, y + block.h + 10, 2.2, 0, Math.PI * 2);
        context.fill();
      });

      // Construction bus linking the modules.
      const busY = height * 0.70;
      context.strokeStyle = "rgba(31, 180, 245, .22)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(width * 0.56, busY);
      context.lineTo(width * 0.94, busY);
      context.stroke();
      for (let i = 0; i < MODULES.length; i += 1) {
        const x = width * (0.57 + (i % 3) * 0.12) + 48;
        context.beginPath();
        context.moveTo(x, busY - 18);
        context.lineTo(x, busY + 18);
        context.stroke();
        drawText(`0${i + 1}`, x - 8, busY + 30, 0.10, 8, 700);
      }

      // Small status rails.
      for (let i = 0; i < 4; i += 1) {
        const y = height * (0.14 + i * 0.09);
        const active = Math.sin(time * 0.001 + i * 1.8) > 0;
        context.fillStyle = active ? "rgba(85, 222, 255, .75)" : "rgba(45, 126, 166, .23)";
        context.fillRect(width * 0.92, y, 5, 5);
        drawText(active ? "BUILD" : "IDLE", width * 0.934, y + 5, active ? 0.11 : 0.055, 8, 700);
      }

      context.restore();

      const scanY = ((time * 0.021) % (height + 170)) - 85;
      const scan = context.createLinearGradient(0, scanY, 0, scanY + 90);
      scan.addColorStop(0, "rgba(41, 205, 255, 0)");
      scan.addColorStop(.5, "rgba(41, 205, 255, .075)");
      scan.addColorStop(1, "rgba(41, 205, 255, 0)");
      context.fillStyle = scan;
      context.fillRect(0, scanY, width, 90);

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!visible || !documentVisible || raf) return;
      last = performance.now();
      lastFrameRender = 0;
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
      },
      { rootMargin: "120px" },
    );

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) start(); else stop();
    };

    const onReducedChange = (event: MediaQueryListEvent) => { reducedMotion = event.matches; };

    setup();
    observer.observe(canvas);
    window.addEventListener("resize", setup);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reducedQuery.addEventListener("change", onReducedChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", setup);
      window.removeEventListener("pointermove", onPointerMove);
      reducedQuery.removeEventListener("change", onReducedChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="about-build-canvas" aria-hidden="true" />;
}
