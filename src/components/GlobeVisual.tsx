import { useEffect, useRef } from "react";

// Rough continent silhouettes approximated as blobs in lon/lat degrees.
// [lon, lat, rx, ry] — used only to decide which sample points count as "land".
const LAND_BLOBS: [number, number, number, number][] = [
  [-110, 55, 24, 18], // Canada / N. America
  [-100, 38, 22, 14], // USA
  [-102, 22, 10, 10], // Mexico
  [-42, 74, 11, 9],   // Greenland
  [-62, -6, 13, 16],  // N. South America
  [-68, -30, 9, 13],  // S. South America (Andes taper)
  [10, 50, 15, 10],   // Europe
  [35, 55, 12, 9],    // E. Europe
  [20, 5, 17, 26],    // Africa
  [30, -25, 10, 10],  // S. Africa
  [45, 25, 12, 10],   // Middle East
  [60, 45, 22, 14],   // W. Asia / Kazakhstan
  [95, 55, 35, 16],   // Siberia
  [105, 32, 24, 14],  // China
  [80, 22, 14, 13],   // India
  [102, 12, 16, 10],  // SE Asia
  [115, -2, 10, 6],   // Indonesia
  [138, 37, 5, 7],    // Japan
  [134, -25, 15, 10], // Australia
];

interface HubNode {
  lon: number;
  lat: number;
}

const HUBS: HubNode[] = [
  { lon: 121, lat: 14.6 }, // Manila
  { lon: -122, lat: 37.8 }, // San Francisco
  { lon: -0.1, lat: 51.5 }, // London
  { lon: 139.7, lat: 35.7 }, // Tokyo
  { lon: 151, lat: -33.9 }, // Sydney
  { lon: 77.2, lat: 28.6 }, // Delhi
];

const ARCS: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 2],
  [2, 5],
  [3, 4],
  [0, 4],
];

const DEG = Math.PI / 180;

function isLand(lon: number, lat: number) {
  for (const [blon, blat, rx, ry] of LAND_BLOBS) {
    let dlon = lon - blon;
    if (dlon > 180) dlon -= 360;
    if (dlon < -180) dlon += 360;
    const dlat = lat - blat;
    if ((dlon / rx) ** 2 + (dlat / ry) ** 2 <= 1) return true;
  }
  return false;
}

// Build a static list of land sample points once.
const LAND_POINTS: { lon: number; lat: number }[] = (() => {
  const points: { lon: number; lat: number }[] = [];
  for (let lat = -80; lat <= 80; lat += 4.2) {
    // fewer samples near poles, more near equator (roughly area-correct)
    const step = 4.2 / Math.max(Math.cos(lat * DEG), 0.18);
    for (let lon = -180; lon < 180; lon += step) {
      if (isLand(lon, lat)) points.push({ lon, lat });
    }
  }
  return points;
})();

export default function GlobeVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = media.matches;

    let size = 0;
    let dpr = 1;
    let rot = 0.4;
    let tiltTarget = 0;
    let tilt = 0.12;
    let rAF = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      size = Math.max(rect?.width || canvas.clientWidth || 400, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (lon: number, lat: number, R: number, cx: number, cy: number) => {
      const visLon = lon * DEG - rot;
      const effLat = lat * DEG + tilt;
      const cosLat = Math.cos(effLat);
      const depth = Math.cos(visLon) * cosLat;
      const x = cx + R * cosLat * Math.sin(visLon);
      const y = cy - R * Math.sin(effLat);
      return { x, y, depth };
    };

    const slerpPoint = (a: HubNode, b: HubNode, t: number) => {
      const toVec = (p: HubNode) => {
        const lonR = p.lon * DEG;
        const latR = p.lat * DEG;
        return [
          Math.cos(latR) * Math.cos(lonR),
          Math.cos(latR) * Math.sin(lonR),
          Math.sin(latR),
        ];
      };
      const v0 = toVec(a);
      const v1 = toVec(b);
      const dot = Math.max(-1, Math.min(1, v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]));
      const omega = Math.acos(dot) || 0.0001;
      const s0 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const s1 = Math.sin(t * omega) / Math.sin(omega);
      const v = [
        v0[0] * s0 + v1[0] * s1,
        v0[1] * s0 + v1[1] * s1,
        v0[2] * s0 + v1[2] * s1,
      ];
      const lat = Math.asin(v[2]) / DEG;
      const lon = Math.atan2(v[1], v[0]) / DEG;
      return { lon, lat };
    };

    const draw = (time: number) => {
      const R = size * 0.42;
      const cx = size / 2;
      const cy = size / 2;

      ctx.clearRect(0, 0, size, size);

      // sphere backdrop shading
      const sphereGrad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.05, cx, cy, R);
      sphereGrad.addColorStop(0, "rgba(24, 140, 255, .10)");
      sphereGrad.addColorStop(0.7, "rgba(6, 60, 110, .06)");
      sphereGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // faint latitude/longitude graticule
      ctx.strokeStyle = "rgba(60, 170, 255, .12)";
      ctx.lineWidth = 0.6;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = project(lon, lat, R, cx, cy);
          if (p.depth < -0.02) { started = false; continue; }
          if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let lon = -150; lon <= 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 4) {
          const p = project(lon, lat, R, cx, cy);
          if (p.depth < -0.02) { started = false; continue; }
          if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // land dots
      for (let i = 0; i < LAND_POINTS.length; i += 1) {
        const { lon, lat } = LAND_POINTS[i];
        const p = project(lon, lat, R, cx, cy);
        if (p.depth < 0.02) continue;
        const twinkle = reducedMotion ? 0 : Math.sin(time * 0.0012 + i * 0.7) * 0.15;
        const alpha = Math.min(1, 0.22 + p.depth * 0.85 + twinkle);
        const radius = 0.7 + p.depth * 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 205, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // hub nodes + connecting arcs with a travelling pulse
      ARCS.forEach(([ai, bi], arcIndex) => {
        const a = HUBS[ai];
        const b = HUBS[bi];
        ctx.beginPath();
        let started = false;
        const steps = 40;
        for (let s = 0; s <= steps; s += 1) {
          const mid = slerpPoint(a, b, s / steps);
          const p = project(mid.lon, mid.lat, R, cx, cy);
          if (p.depth < -0.02) { started = false; continue; }
          if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(45, 190, 255, .35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (!reducedMotion) {
          const t = ((time * 0.00018) + arcIndex * 0.18) % 1;
          const pulse = slerpPoint(a, b, t);
          const pp = project(pulse.lon, pulse.lat, R, cx, cy);
          if (pp.depth > 0.02) {
            ctx.beginPath();
            ctx.arc(pp.x, pp.y, 2.1, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(180, 235, 255, .95)";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(90, 200, 255, .9)";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      HUBS.forEach((hub) => {
        const p = project(hub.lon, hub.lat, R, cx, cy);
        if (p.depth < 0.02) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6 + p.depth, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(190, 240, 255, .95)";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(60, 190, 255, .9)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // rim highlight
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(80, 190, 255, .25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reducedMotion) {
        rot += 0.00035;
      }
      tilt += (tiltTarget - tilt) * 0.02;

      rAF = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const parent = canvas.parentElement?.parentElement; // hero section
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      tiltTarget = ny * -0.25;
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    resize();
    rAF = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    media.addEventListener("change", handleMotionChange);

    return () => {
      window.cancelAnimationFrame(rAF);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      media.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div className="hero-globe-canvas-wrap">
      <canvas ref={canvasRef} className="hero-globe-canvas" />
    </div>
  );
}
