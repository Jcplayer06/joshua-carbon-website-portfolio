import { useEffect, useRef } from "react";
import { getAnimationBudget } from "../utils/performance";

type VerticalStream = {
  x: number;
  y: number;
  speed: number;
  length: number;
  size: number;
  opacity: number;
  chars: string[];
  phase: number;
  glow: number;
};

type HorizontalStream = {
  x: number;
  y: number;
  speed: number;
  length: number;
  size: number;
  opacity: number;
  chars: string[];
  phase: number;
  direction: 1 | -1;
};

const alphabet = "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>[]{}+=*/#@:$%_-";

function createRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function randomChars(rand: () => number, length: number) {
  return Array.from({ length }, () => alphabet[Math.floor(rand() * alphabet.length)]);
}

function createVerticalStream(rand: () => number, width: number, height: number): VerticalStream {
  const length = 12 + Math.floor(rand() * 26);
  return {
    x: rand() * width,
    y: -rand() * height,
    speed: 18 + rand() * 92,
    length,
    size: 9 + rand() * 6,
    opacity: 0.12 + rand() * 0.26,
    chars: randomChars(rand, length),
    phase: rand() * Math.PI * 2,
    glow: 0.15 + rand() * 0.42,
  };
}

function createHorizontalStream(rand: () => number, width: number, height: number): HorizontalStream {
  const length = 14 + Math.floor(rand() * 28);
  return {
    x: rand() > 0.5 ? -rand() * width * 0.6 : width + rand() * width * 0.6,
    y: rand() * height,
    speed: 16 + rand() * 110,
    length,
    size: 9 + rand() * 4,
    opacity: 0.08 + rand() * 0.17,
    chars: randomChars(rand, length),
    phase: rand() * Math.PI * 2,
    direction: rand() > 0.5 ? 1 : -1,
  };
}

export default function AboutMatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reduceMotionQuery.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let animationFrame = 0;
    let last = performance.now();
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let verticalStreams: VerticalStream[] = [];
    let horizontalStreams: HorizontalStream[] = [];
    let budget = getAnimationBudget(window.innerWidth, window.innerHeight);
    let frameInterval = budget.frameInterval;
    let visible = false;
    let documentVisible = !document.hidden;
    const pointerFine = window.matchMedia("(pointer:fine)").matches;

    const setup = () => {
      width = window.innerWidth;
      height = Math.max(window.innerHeight * 0.98, 760);
      budget = getAnimationBudget(width, height);
      frameInterval = budget.frameInterval;
      dpr = budget.dpr;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = createRandom(20260923);
      const verticalCount = budget.compact
        ? (budget.lowPower ? 16 : 20)
        : width >= 1500
          ? (budget.lowPower ? 56 : 72)
          : width >= 1000
            ? (budget.lowPower ? 46 : 60)
            : (budget.lowPower ? 32 : 44);
      const horizontalCount = budget.compact
        ? (budget.lowPower ? 4 : 5)
        : width >= 1500
          ? (budget.lowPower ? 14 : 20)
          : width >= 1000
            ? (budget.lowPower ? 11 : 16)
            : (budget.lowPower ? 8 : 10);

      verticalStreams = Array.from({ length: verticalCount }, () => createVerticalStream(rand, width, height));
      horizontalStreams = Array.from({ length: horizontalCount }, () => createHorizontalStream(rand, width, height));

      verticalStreams.forEach((stream, index) => {
        const lane = index % 6;
        if (lane === 0 || lane === 1) stream.x = width * (0.012 + rand() * 0.16);
        else if (lane === 2) stream.x = width * (0.38 + rand() * 0.10);
        else if (lane === 3) stream.x = width * (0.52 + rand() * 0.10);
        else stream.x = width * (0.82 + rand() * 0.17);
        stream.y = -rand() * height * 1.4;
      });

      horizontalStreams.forEach((stream, index) => {
        const lane = index % 4;
        if (lane === 0) stream.y = height * (0.10 + rand() * 0.16);
        else if (lane === 1) stream.y = height * (0.42 + rand() * 0.12);
        else if (lane === 2) stream.y = height * (0.67 + rand() * 0.14);
        else stream.y = height * (0.84 + rand() * 0.10);
        stream.x = stream.direction === 1 ? -rand() * width : width + rand() * width;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = ((event.clientX / Math.max(width, 1)) - 0.5) * 2;
      targetY = ((event.clientY / Math.max(height, 1)) - 0.5) * 2;
    };

    const isProtectedZone = (x: number, y: number) => {
      const nx = x / width;
      const ny = y / height;
      const leftHeadline = nx > 0.08 && nx < 0.42 && ny > 0.18 && ny < 0.90;
      const rightCopy = nx > 0.44 && nx < 0.93 && ny > 0.16 && ny < 0.86;
      return leftHeadline || rightCopy;
    };

    const drawGlowPoint = (x: number, y: number, radius: number, alpha: number) => {
      if (budget.lowPower || budget.compact) {
        context.fillStyle = `rgba(64, 204, 255, ${Math.min(0.32, alpha)})`;
        context.beginPath();
        context.arc(x, y, Math.min(2.5, radius * 0.22), 0, Math.PI * 2);
        context.fill();
        return;
      }
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, `rgba(141, 235, 255, ${alpha})`);
      glow.addColorStop(0.25, `rgba(39, 193, 255, ${alpha * 0.52})`);
      glow.addColorStop(1, "rgba(39, 193, 255, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const draw = (now: number) => {
      if (!visible || !documentVisible) {
        animationFrame = 0;
        return;
      }
      if (now - last < frameInterval) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }
      const delta = Math.min(40, now - last);
      last = now;
      if (!reducedMotion) time += delta;

      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";

      const grid = 44;
      const driftX = pointerX * 7;
      const driftY = pointerY * 5;
      context.save();
      context.translate(driftX, driftY);
      context.strokeStyle = "rgba(28, 156, 214, .045)";
      context.lineWidth = 1;
      for (let x = -grid; x < width + grid; x += grid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = -grid; y < height + grid; y += grid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.restore();

      const scanY = (time * 0.022) % (height + 180) - 90;
      const scan = context.createLinearGradient(0, scanY, 0, scanY + 100);
      scan.addColorStop(0, "rgba(30, 197, 255, 0)");
      scan.addColorStop(0.5, "rgba(30, 197, 255, .065)");
      scan.addColorStop(1, "rgba(30, 197, 255, 0)");
      context.fillStyle = scan;
      context.fillRect(0, scanY, width, 100);

      verticalStreams.forEach((stream, streamIndex) => {
        if (!reducedMotion) {
          stream.y += (stream.speed * delta) / 1000;
          if (stream.y > height + stream.length * 22) {
            stream.y = -stream.length * 24 - ((streamIndex % 7) * 46);
          }
          const slot = Math.floor((time / (160 + (streamIndex % 4) * 50) + stream.phase) % stream.chars.length);
          stream.chars[slot] = alphabet[Math.floor((time + stream.phase * 10000 + streamIndex * 17) % alphabet.length)];
        }

        for (let i = 0; i < stream.length; i += 1) {
          const x = stream.x + Math.sin(stream.phase + time * 0.00025) * 2 + pointerX * 8;
          const y = stream.y + i * (stream.size * 1.82) + pointerY * 6;
          if (y < -24 || y > height + 24) continue;

          const fade = Math.max(0.16, 1 - Math.abs(y - height * 0.5) / (height * 0.74));
          const protectedAlpha = isProtectedZone(x, y) ? 0.20 : 1;
          const head = Math.max(0, 1 - i / 5);
          const alpha = stream.opacity * fade * protectedAlpha * (0.72 + head * 0.46);

          context.font = `700 ${Math.round(stream.size)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          context.textBaseline = "top";
          context.fillStyle = `rgba(64, 204, 255, ${Math.min(0.58, alpha * 1.6)})`;
          context.shadowBlur = budget.lowPower || budget.compact ? 0 : head > 0.1 ? 7 + head * (8 + stream.glow * 14) : 0;
          context.shadowColor = `rgba(52, 208, 255, ${0.28 + stream.glow * 0.55})`;
          context.fillText(stream.chars[i] || "0", x, y);
        }
        context.shadowBlur = 0;

        const leadY = stream.y + pointerY * 6;
        if (leadY > -20 && leadY < height + 20) {
          drawGlowPoint(stream.x + pointerX * 8, leadY, 11 + stream.glow * 8, 0.28 + stream.glow * 0.34);
        }
      });

      horizontalStreams.forEach((stream, streamIndex) => {
        if (!reducedMotion) {
          stream.x += (stream.direction * stream.speed * delta) / 1000;
          if (stream.direction === 1 && stream.x > width + stream.length * 14) {
            stream.x = -stream.length * 14 - streamIndex * 22;
          }
          if (stream.direction === -1 && stream.x < -stream.length * 14) {
            stream.x = width + stream.length * 14 + streamIndex * 22;
          }
          const slot = Math.floor((time / (180 + (streamIndex % 3) * 60) + stream.phase) % stream.chars.length);
          stream.chars[slot] = alphabet[Math.floor((time + stream.phase * 10000 + streamIndex * 23) % alphabet.length)];
        }

        for (let i = 0; i < stream.length; i += 1) {
          const spacing = stream.size * 1.62;
          const x = stream.direction === 1
            ? stream.x + i * spacing + pointerX * 8
            : stream.x - i * spacing + pointerX * 8;
          const y = stream.y + Math.sin(stream.phase + time * 0.0003) * 1.5 + pointerY * 5;
          if (x < -28 || x > width + 28 || y < -24 || y > height + 24) continue;

          const protectedAlpha = isProtectedZone(x, y) ? 0.16 : 1;
          const head = Math.max(0, 1 - i / 6);
          const alpha = stream.opacity * protectedAlpha * (0.68 + head * 0.5);

          context.font = `700 ${Math.round(stream.size)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          context.textBaseline = "top";
          context.fillStyle = `rgba(75, 214, 255, ${Math.min(0.46, alpha * 1.45)})`;
          context.shadowBlur = budget.lowPower || budget.compact ? 0 : head > 0.1 ? 6 + head * 8 : 0;
          context.shadowColor = "rgba(31, 193, 255, .42)";
          context.fillText(stream.chars[i] || "1", x, y);
        }
        context.shadowBlur = 0;

        const leadX = stream.direction === 1 ? stream.x : stream.x;
        const leadY = stream.y + pointerY * 5;
        if (leadX > -20 && leadX < width + 20 && leadY > -20 && leadY < height + 20) {
          drawGlowPoint(leadX + pointerX * 8, leadY, 9, 0.2);
        }
      });

      // Quiet AI-style geometry remains, but without a circular core or large label.
      const cx = width * 0.79 + pointerX * 14;
      const cy = height * 0.52 + pointerY * 10;
      context.save();
      context.translate(cx, cy);
      context.rotate(time * 0.00004);
      context.strokeStyle = "rgba(35, 182, 242, .055)";
      context.lineWidth = 1;
      context.setLineDash([8, 12]);
      for (const radius of [120, 178, 236]) {
        context.beginPath();
        context.ellipse(0, 0, radius, radius * 0.4, 0, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();

      context.restore();
      animationFrame = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const start = () => {
      if (animationFrame || reducedMotion || !visible || !documentVisible) return;
      last = performance.now();
      animationFrame = requestAnimationFrame(draw);
    };
    const renderStatic = () => {
      if (visible) draw(performance.now());
    };

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      stop();
      if (reducedMotion) renderStatic();
      else start();
    };
    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) start(); else stop();
    };

    setup();
    const section = canvas.closest(".about-live-section") ?? canvas.parentElement ?? canvas;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (reducedMotion) renderStatic(); else start();
      } else {
        stop();
      }
    }, { rootMargin: "0px" });
    io.observe(section);
    window.addEventListener("resize", setup);
    if (pointerFine && !budget.lowPower) window.addEventListener("pointermove", onPointerMove, { passive: true });
    reduceMotionQuery.addEventListener("change", onReducedMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", setup);
      if (pointerFine && !budget.lowPower) window.removeEventListener("pointermove", onPointerMove);
      reduceMotionQuery.removeEventListener("change", onReducedMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="about-matrix-canvas" />;
}
