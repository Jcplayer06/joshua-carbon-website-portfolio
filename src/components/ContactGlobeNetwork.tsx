import { useEffect, useRef } from "react";
import { getAnimationBudget } from "../utils/performance";
import earthTextureUrl from "../assets/earth-night-texture.webp";

type Vec3 = [number, number, number];
type Geo = { name: string; lon: number; lat: number };
type Projected = { x: number; y: number; z: number; visible: boolean };

type RadarTarget = {
  angle: number;
  distance: number;
  size: number;
  appearAt: number;
  fadeInMs: number;
  holdMs: number;
  fadeOutMs: number;
  echo: number;
};

type GlobalRoute = {
  a: number;
  b: number;
  appearAt: number;
  fadeInMs: number;
  holdMs: number;
  fadeOutMs: number;
  arc: number;
  packetOffset: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function buildSphereMesh(latSegments = 48, lonSegments = 96) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let lat = 0; lat <= latSegments; lat += 1) {
    const v = lat / latSegments;
    const phi = (v - 0.5) * Math.PI;
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);

    for (let lon = 0; lon <= lonSegments; lon += 1) {
      const u = lon / lonSegments;
      const theta = u * Math.PI * 2;
      positions.push(cp * Math.cos(theta), sp, cp * Math.sin(theta));
      uvs.push(u, v);
    }
  }

  const row = lonSegments + 1;
  for (let lat = 0; lat < latSegments; lat += 1) {
    for (let lon = 0; lon < lonSegments; lon += 1) {
      const a = lat * row + lon;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  };
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(error);
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create program");

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) ?? "Unknown link error";
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    throw new Error(error);
  }

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
}

// All endpoints are real land-based cities. Routes are generated between these
// fixed geographic anchors so connection endpoints always terminate on land.
const GEO: Geo[] = [
  { name: "MANILA", lon: 120.9842, lat: 14.5995 },
  { name: "TOKYO", lon: 139.6917, lat: 35.6895 },
  { name: "SEOUL", lon: 126.978, lat: 37.5665 },
  { name: "SINGAPORE", lon: 103.8198, lat: 1.3521 },
  { name: "SYDNEY", lon: 151.2093, lat: -33.8688 },
  { name: "MUMBAI", lon: 72.8777, lat: 19.076 },
  { name: "DUBAI", lon: 55.2708, lat: 25.2048 },
  { name: "LONDON", lon: -0.1276, lat: 51.5072 },
  { name: "PARIS", lon: 2.3522, lat: 48.8566 },
  { name: "FRANKFURT", lon: 8.6821, lat: 50.1109 },
  { name: "NEW YORK", lon: -74.006, lat: 40.7128 },
  { name: "TORONTO", lon: -79.3832, lat: 43.6532 },
  { name: "SAN FRANCISCO", lon: -122.4194, lat: 37.7749 },
  { name: "SAO PAULO", lon: -46.6333, lat: -23.5505 },
];

function geoToVector(lon: number, lat: number): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180 + Math.PI;
  return [
    Math.cos(phi) * Math.cos(theta),
    Math.sin(phi),
    Math.cos(phi) * Math.sin(theta),
  ];
}

// Small deterministic PRNG keeps the animation organic but reproducible.
function makeRng(seed: number) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RADAR_SLOT_COUNT = 12;
const ROUTE_SLOT_COUNT = 16;

function rerollRadarTarget(
  rng: () => number,
  now: number,
  extraDelay: number,
): RadarTarget {
  return {
    // Fully polar placement: no target is locked to a predetermined ring.
    angle: rng() * Math.PI * 2,
    distance: 0.12 + rng() * 0.80,
    size: 1.4 + rng() * 2.4,
    appearAt: now + extraDelay + rng() * 850,
    fadeInMs: 250 + rng() * 350,
    holdMs: 3800 + rng() * 4700,
    fadeOutMs: 650 + rng() * 900,
    echo: 0,
  };
}

function rerollRoute(
  rng: () => number,
  now: number,
  extraDelay: number,
): GlobalRoute {
  const a = Math.floor(rng() * GEO.length);
  let b = Math.floor(rng() * GEO.length);
  let attempts = 0;

  while (a === b && attempts < 8) {
    b = Math.floor(rng() * GEO.length);
    attempts += 1;
  }

  return {
    a,
    b,
    appearAt: now + extraDelay + rng() * 480,
    fadeInMs: 340 + rng() * 500,
    holdMs: 1800 + rng() * 2400,
    fadeOutMs: 550 + rng() * 800,
    arc: 0.035 + rng() * 0.075,
    packetOffset: rng(),
  };
}

function ContactGlobeNetwork() {
  const globeRef = useRef<HTMLCanvasElement | null>(null);
  const networkRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const globeCanvas = globeRef.current;
    const networkCanvas = networkRef.current;
    if (!globeCanvas || !networkCanvas) return;

    const initialBudget = getAnimationBudget(window.innerWidth, window.innerHeight);
    const gl = globeCanvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: initialBudget.lowPower ? "default" : "high-performance",
    });
    const ctx = networkCanvas.getContext("2d");
    if (!gl || !ctx) return;

    const reducedQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQ.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let frameInterval = initialBudget.frameInterval;
    let budget = initialBudget;
    let visible = false;
    let documentVisible = !document.hidden;
    let running = false;
    let textureLoadStarted = false;
    let yaw = -2.6008;
    const pitch = -0.13;
    let textureReady = false;
    let texture: WebGLTexture | null = null;
    let resizeTimer = 0;
    let hoveredPort: string | null = null;
    let hoverStart = 0;

    const onContactHover = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string | null }>).detail;
      const key = detail?.key ?? null;
      if (key !== hoveredPort) {
        hoveredPort = key;
        hoverStart = elapsed;
      }
    };

    window.addEventListener("contact-radar-hover", onContactHover);

    const vertexSource = `
      attribute vec3 a_position;
      attribute vec2 a_uv;
      uniform float u_yaw;
      uniform float u_pitch;
      uniform float u_radius;
      uniform vec2 u_center;
      uniform vec2 u_resolution;
      varying vec2 v_uv;
      varying vec3 v_normal;
      varying float v_depth;

      void main() {
        float sy = sin(u_yaw);
        float cy = cos(u_yaw);
        vec3 p = vec3(
          cy * a_position.x + sy * a_position.z,
          a_position.y,
          -sy * a_position.x + cy * a_position.z
        );

        float sp = sin(u_pitch);
        float cp = cos(u_pitch);
        p = vec3(p.x, cp * p.y - sp * p.z, sp * p.y + cp * p.z);

        float focal = 1.18;
        float perspective = focal / (focal + p.z * 0.18);
        vec2 px = u_center + p.xy * u_radius * perspective;
        vec2 clip = (px / u_resolution) * 2.0 - 1.0;
        clip.y *= -1.0;

        gl_Position = vec4(clip, -p.z * 0.45, 1.0);
        v_uv = a_uv;
        v_normal = normalize(p);
        v_depth = p.z;
      }
    `;

    // Keep the Earth cinematic and realistic: physical-looking day/night tone,
    // city-light emphasis on the night side, and a thin atmospheric limb.
    const fragmentSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      varying vec2 v_uv;
      varying vec3 v_normal;
      varying float v_depth;

      void main() {
        vec3 tex = texture2D(u_texture, v_uv).rgb;
        vec3 n = normalize(v_normal);
        vec3 sunDir = normalize(vec3(0.42, 0.30, 0.86));
        float sunFacing = dot(n, sunDir);
        float dayMix = smoothstep(-0.22, 0.28, sunFacing);

        vec3 dayTone = vec3(1.06, 1.03, 0.97);
        vec3 nightTone = vec3(0.82, 0.90, 1.05);
        float lightsMask = smoothstep(0.08, 0.0, sunFacing);

        vec3 lit = tex * mix(nightTone, dayTone, dayMix);
        lit += tex * tex * lightsMask * 1.15;

        float fres = pow(
          1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0),
          4.2
        );
        vec3 atmosphere = vec3(0.35, 0.62, 0.95) * fres * (0.55 + dayMix * 0.55);

        // Very subtle animated sunlight variation; geography itself remains stable.
        float slowPulse = 0.5 + 0.5 * sin(u_time * 0.00014);
        vec3 color = lit * (0.30 + dayMix * 0.55);
        color += atmosphere * (0.94 + slowPulse * 0.06);

        float alpha = smoothstep(-0.88, -0.10, v_depth) * 0.98;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    let program: WebGLProgram;
    try {
      program = createProgram(gl, vertexSource, fragmentSource);
    } catch {
      return;
    }

    const mesh = buildSphereMesh(initialBudget.compact ? 28 : initialBudget.tablet ? 36 : 48, initialBudget.compact ? 56 : initialBudget.tablet ? 72 : 96);
    const positionBuffer = gl.createBuffer();
    const uvBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!positionBuffer || !uvBuffer || !indexBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    texture = gl.createTexture();
    if (!texture) return;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (!texture) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      gl.generateMipmap(gl.TEXTURE_2D);
      textureReady = true;
    };
    const ensureTextureLoaded = () => {
      if (textureLoadStarted) return;
      textureLoadStarted = true;
      image.src = earthTextureUrl;
    };

    const aPosition = gl.getAttribLocation(program, "a_position");
    const aUv = gl.getAttribLocation(program, "a_uv");
    const uYaw = gl.getUniformLocation(program, "u_yaw");
    const uPitch = gl.getUniformLocation(program, "u_pitch");
    const uRadius = gl.getUniformLocation(program, "u_radius");
    const uCenter = gl.getUniformLocation(program, "u_center");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTexture = gl.getUniformLocation(program, "u_texture");
    const uTime = gl.getUniformLocation(program, "u_time");

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const layout = () => {
      const mobile = width < 760;
      const base = Math.min(width, height);

      if (mobile) {
        // Mobile uses a deliberate vertical composition. Keeping the radar and
        // globe in separate zones prevents the geometry from pushing the Earth
        // beyond the viewport on narrow phones.
        const radarRadius = Math.min(base * 0.30, width * 0.30, height * 0.25);
        const earthRadius = Math.min(base * 0.40, width * 0.43, height * 0.31);
        return {
          radar: { cx: width * 0.31, cy: height * 0.27, radius: radarRadius },
          earth: { cx: width * 0.68, cy: height * 0.69, radius: earthRadius },
        };
      }

      // Desktop / tablet: keep radar and globe in distinct horizontal zones.
      const gap = Math.max(54, width * 0.035);
      const radarRadius = Math.min(base * 0.43, width * 0.27, height * 0.45);
      const radarCx = Math.max(radarRadius + 18, width * 0.34);
      const radarCy = height * 0.52;
      const earthRadius = Math.min(base * 0.50, width * 0.32, height * 0.50);
      const minimumEarthCx = radarCx + radarRadius + gap + earthRadius;
      const earthCx = Math.max(width * 0.83, minimumEarthCx);
      const earthCy = height * 0.51;

      return {
        earth: { cx: earthCx, cy: earthCy, radius: earthRadius },
        radar: { cx: radarCx, cy: radarCy, radius: radarRadius },
      };
    };

    const starSeed = (() => {
      let value = 17321;
      return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
      };
    })();

    const stars = Array.from({ length: initialBudget.compact ? 90 : initialBudget.lowPower ? 150 : 220 }, () => ({
      x: starSeed(),
      y: starSeed(),
      r: 0.30 + starSeed() * 1.25,
      phase: starSeed() * Math.PI * 2,
      speed: 0.28 + starSeed() * 0.95,
      bright: starSeed() > 0.935,
      blue: starSeed() > 0.30,
    }));

    const targetRng = makeRng(90210);
    const radarTargets: RadarTarget[] = Array.from(
      { length: RADAR_SLOT_COUNT },
      (_, i) => rerollRadarTarget(targetRng, 0, i * 180),
    );

    const routeRng = makeRng(44041);
    const routes: GlobalRoute[] = Array.from(
      { length: ROUTE_SLOT_COUNT },
      (_, i) => rerollRoute(routeRng, 0, i * 260),
    );

    const resize = () => {
      const host = networkCanvas.parentElement?.getBoundingClientRect();
      width = Math.max(1, host?.width ?? 1);
      height = Math.max(1, host?.height ?? 1);
      budget = getAnimationBudget(width, height);
      frameInterval = budget.frameInterval;
      dpr = budget.dpr;

      globeCanvas.width = Math.floor(width * dpr);
      globeCanvas.height = Math.floor(height * dpr);
      networkCanvas.width = Math.floor(width * dpr);
      networkCanvas.height = Math.floor(height * dpr);

      globeCanvas.style.width = `${width}px`;
      globeCanvas.style.height = `${height}px`;
      networkCanvas.style.width = `${width}px`;
      networkCanvas.style.height = `${height}px`;

      gl.viewport(
        0,
        0,
        Math.floor(width * dpr),
        Math.floor(height * dpr),
      );
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rotatePoint = (v: Vec3): Vec3 => {
      const sy = Math.sin(yaw);
      const cy = Math.cos(yaw);
      const x = cy * v[0] + sy * v[2];
      let z = -sy * v[0] + cy * v[2];
      const sp = Math.sin(pitch);
      const cp = Math.cos(pitch);
      const y = cp * v[1] - sp * z;
      z = sp * v[1] + cp * z;
      return [x, y, z];
    };

    const projectVector = (v: Vec3): Projected => {
      const [x, y, z] = rotatePoint(v);
      const g = layout().earth;
      const focal = 1.18;
      const perspective = focal / (focal + z * 0.18);
      return {
        x: g.cx + x * g.radius * perspective,
        y: g.cy + y * g.radius * perspective,
        z,
        visible: z > -0.12,
      };
    };

    const project = (geo: Geo): Projected =>
      projectVector(geoToVector(geo.lon, geo.lat));

    const slerp = (a: Vec3, b: Vec3, t: number): Vec3 => {
      const dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -0.9995, 0.9995);
      const theta = Math.acos(dot);
      if (theta < 0.0001) {
        return normalize([
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t,
          a[2] + (b[2] - a[2]) * t,
        ]);
      }
      const sinTheta = Math.sin(theta);
      const wa = Math.sin((1 - t) * theta) / sinTheta;
      const wb = Math.sin(t * theta) / sinTheta;
      return normalize([
        a[0] * wa + b[0] * wb,
        a[1] * wa + b[1] * wb,
        a[2] * wa + b[2] * wb,
      ]);
    };

    const routeScreenPoint = (
      route: GlobalRoute,
      t: number,
    ): Projected => {
      const a = geoToVector(GEO[route.a].lon, GEO[route.a].lat);
      const b = geoToVector(GEO[route.b].lon, GEO[route.b].lat);
      const base = slerp(a, b, t);
      const lift = 1 + route.arc * Math.pow(Math.sin(Math.PI * t), 1.35);
      return projectVector([base[0] * lift, base[1] * lift, base[2] * lift]);
    };

    const lifecycleAlpha = (
      age: number,
      fadeInMs: number,
      holdMs: number,
      fadeOutMs: number,
    ) => {
      if (age < 0) return 0;
      if (age < fadeInMs) return clamp(age / fadeInMs, 0, 1);
      if (age < fadeInMs + holdMs) return 1;
      return clamp(
        1 - (age - fadeInMs - holdMs) / fadeOutMs,
        0,
        1,
      );
    };

    const drawSpace = (now: number) => {
      // IMPORTANT: this is an OVERLAY canvas above the WebGL Earth.
      // Keep the background transparent so the realistic globe remains visible.
      // The Contact section itself supplies the deep-space base color.
      const hazeA = ctx.createRadialGradient(
        width * 0.28,
        height * 0.42,
        0,
        width * 0.28,
        height * 0.42,
        Math.max(width, height) * 0.56,
      );
      hazeA.addColorStop(0, "rgba(17,66,126,.055)");
      hazeA.addColorStop(0.50, "rgba(5,35,74,.028)");
      hazeA.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hazeA;
      ctx.fillRect(0, 0, width, height);

      const hazeB = ctx.createRadialGradient(
        width * 0.70,
        height * 0.68,
        0,
        width * 0.70,
        height * 0.68,
        Math.max(width, height) * 0.52,
      );
      hazeB.addColorStop(0, "rgba(0,88,145,.040)");
      hazeB.addColorStop(0.65, "rgba(0,33,64,.018)");
      hazeB.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hazeB;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        const twinkle = reduced
          ? 0.60
          : 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(now * 0.001 * star.speed + star.phase));
        const alpha = Math.min(0.92, twinkle * (star.bright ? 0.78 : 0.50));
        const radius = star.r * (star.bright ? 1.0 + twinkle * 0.55 : 1);
        const c = star.blue ? "157,221,255" : "220,239,255";

        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${alpha})`;
        ctx.fill();

        // Occasional tiny four-point glint on brighter stars, no movement.
        if (star.bright && twinkle > 0.86) {
          const x = star.x * width;
          const y = star.y * height;
          const ray = 2.2 + twinkle * 2.3;
          ctx.strokeStyle = `rgba(193,234,255,${alpha * 0.50})`;
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(x - ray, y);
          ctx.lineTo(x + ray, y);
          ctx.moveTo(x, y - ray);
          ctx.lineTo(x, y + ray);
          ctx.stroke();
        }
      });
    };

    const drawGlobalRoutes = (now: number, deltaMs: number) => {
      const projected = GEO.map(project);

      const routeLimit = budget.compact ? 9 : budget.lowPower ? 11 : 16;
      routes.forEach((route, routeIndex) => {
        if (routeIndex >= routeLimit) return;
        const total = route.fadeInMs + route.holdMs + route.fadeOutMs;
        const age = now - route.appearAt;

        if (age > total) {
          routes[routeIndex] = rerollRoute(
            routeRng,
            now,
            160 + (routeIndex % 4) * 120 + routeRng() * 760,
          );
          return;
        }

        const alpha = lifecycleAlpha(
          age,
          route.fadeInMs,
          route.holdMs,
          route.fadeOutMs,
        );
        if (alpha <= 0.015) return;

        const steps = 28;
        let previous: Projected | null = null;
        let packetPoint: Projected | null = null;
        const packetAge = Math.max(0, age - route.fadeInMs);
        const packetProgress = route.holdMs
          ? (packetAge / route.holdMs + route.packetOffset) % 1
          : route.packetOffset;

        for (let i = 0; i <= steps; i += 1) {
          const t = i / steps;
          const p = routeScreenPoint(route, t);

          if (
            Math.abs(t - packetProgress) < 1 / steps &&
            p.visible
          ) {
            packetPoint = p;
          }

          if (!p.visible) {
            previous = null;
            continue;
          }

          if (previous) {
            const segmentAlpha = alpha * (0.17 + 0.10 * (p.z + 1));
            ctx.beginPath();
            ctx.moveTo(previous.x, previous.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(65,200,255,${clamp(segmentAlpha, 0.03, 0.34)})`;
            ctx.lineWidth = 1.05;
            ctx.stroke();
          }

          previous = p;
        }

        // Exact land-anchored endpoints are always emphasized.
        const a = projected[route.a];
        const b = projected[route.b];
        [a, b].forEach((p, endpointIndex) => {
          if (!p.visible) return;
          const pulse = reduced
            ? 0.45
            : 0.50 + 0.50 * Math.sin(now * 0.002 + routeIndex * 0.9 + endpointIndex);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.25 + pulse * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,250,255,${0.60 * alpha + 0.30})`;
          ctx.shadowColor = "rgba(41,205,255,.78)";
          ctx.shadowBlur = 8 + pulse * 5;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        if (!reduced && packetPoint && age > route.fadeInMs) {
          const packetScale = 2.2 + 0.7 * Math.sin(age * 0.01);
          ctx.beginPath();
          ctx.arc(packetPoint.x, packetPoint.y, packetScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239,254,255,${0.92 * alpha})`;
          ctx.shadowColor = "rgba(64,211,255,.95)";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // A few geographic points remain visible even without an active route.
      projected.forEach((p, index) => {
        if (!p.visible) return;
        const selected = index === 0 || index === 1 || index === 7 || index === 10;
        const r = selected ? 3.2 : 2.0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = selected ? "rgba(222,251,255,.94)" : "rgba(90,204,255,.76)";
        ctx.shadowColor = "rgba(38,196,255,.70)";
        ctx.shadowBlur = selected ? 9 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;

      });

      void deltaMs;
    };

    const drawRadar = (now: number, deltaMs: number) => {
      const r = layout().radar;
      ctx.save();
      ctx.translate(r.cx, r.cy);

      // Subtle radar glass/background.
      const radarFill = ctx.createRadialGradient(0, 0, 0, 0, 0, r.radius);
      radarFill.addColorStop(0, "rgba(7,45,69,.20)");
      radarFill.addColorStop(0.68, "rgba(2,22,38,.10)");
      radarFill.addColorStop(1, "rgba(0,7,14,.015)");
      ctx.fillStyle = radarFill;
      ctx.beginPath();
      ctx.arc(0, 0, r.radius, 0, Math.PI * 2);
      ctx.fill();

      // Fine range rings.
      const ringCount = budget.compact ? 5 : 8;
      for (let ring = 1; ring <= ringCount; ring += 1) {
        const rr = (r.radius * ring) / ringCount;
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.strokeStyle =
          ring === ringCount
            ? "rgba(126,211,251,.48)"
            : `rgba(71,170,224,${0.075 + ring * 0.006})`;
        ctx.lineWidth = ring === 8 ? 1.45 : ring % 2 === 0 ? 0.85 : 0.55;
        ctx.stroke();
      }

      // 10-degree radial web + stronger cardinal/45-degree axes.
      const webStep = budget.compact ? 15 : 10;
      for (let deg = 0; deg < 360; deg += webStep) {
        const a = (deg * Math.PI) / 180;
        const inner = r.radius * (deg % 30 === 0 ? 0.18 : 0.34);
        const outer = r.radius * 0.995;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        ctx.strokeStyle =
          deg % 90 === 0
            ? "rgba(109,219,255,.40)"
            : deg % 30 === 0
              ? "rgba(95,195,243,.26)"
              : "rgba(74,166,219,.12)";
        ctx.lineWidth = deg % 90 === 0 ? 1.05 : deg % 30 === 0 ? 0.72 : 0.45;
        ctx.stroke();
      }

      // Outer bearing marks.
      const tickStep = budget.compact ? 10 : 5;
      for (let deg = 0; deg < 360; deg += tickStep) {
        const a = (deg * Math.PI) / 180;
        const tickOuter = r.radius * 1.015;
        const tickInner =
          r.radius * (deg % 30 === 0 ? 0.935 : deg % 10 === 0 ? 0.96 : 0.977);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * tickInner, Math.sin(a) * tickInner);
        ctx.lineTo(Math.cos(a) * tickOuter, Math.sin(a) * tickOuter);
        ctx.strokeStyle = deg % 30 === 0
          ? "rgba(148,228,255,.68)"
          : "rgba(78,171,220,.28)";
        ctx.lineWidth = deg % 30 === 0 ? 1.0 : 0.48;
        ctx.stroke();
      }

      ctx.font = "700 9.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(178,232,251,.82)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let deg = 0; deg < 360; deg += 30) {
        const a = (deg * Math.PI) / 180;
        const rr = r.radius * 1.08;
        ctx.fillText(
          String(deg).padStart(3, "0"),
          Math.cos(a) * rr,
          Math.sin(a) * rr,
        );
      }

      const sweepDurationMs = 3000;
      const sweepAngle = reduced
        ? -0.85
        : ((now % sweepDurationMs) / sweepDurationMs) * Math.PI * 2;
      const radarPulse = reduced
        ? 0.9
        : 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(now * 0.0016));

      // Fading sweep tail like a PPI display.
      const sweepSpan = 0.70;
      const sweepSegments = budget.compact ? 10 : 20;
      for (let s = 0; s < sweepSegments; s += 1) {
        const t0 = (s / sweepSegments) * sweepSpan;
        const t1 = ((s + 1) / sweepSegments) * sweepSpan;
        const trailAlpha = Math.pow(1 - s / sweepSegments, 1.75);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r.radius, sweepAngle - t1, sweepAngle - t0);
        ctx.closePath();
        ctx.fillStyle = `rgba(54,196,255,${0.085 * radarPulse * trailAlpha})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(sweepAngle) * r.radius,
        Math.sin(sweepAngle) * r.radius,
      );
      ctx.strokeStyle = `rgba(121,232,255,${0.94 * radarPulse})`;
      ctx.lineWidth = 1.45;
      ctx.shadowColor = "rgba(55,205,255,.86)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // PPI persistence: targets exist faintly, but the sweep produces a strong
      // return/echo which decays gradually after the antenna passes it.
      const radarLimit = budget.compact ? 7 : budget.lowPower ? 9 : 12;
      radarTargets.forEach((target, slot) => {
        if (slot >= radarLimit) return;
        const total = target.fadeInMs + target.holdMs + target.fadeOutMs;
        const age = now - target.appearAt;

        if (age > total) {
          radarTargets[slot] = rerollRadarTarget(
            targetRng,
            now,
            160 + (slot % 4) * 90 + targetRng() * 800,
          );
          return;
        }

        if (age < 0) return;

        const lifecycle = lifecycleAlpha(
          age,
          target.fadeInMs,
          target.holdMs,
          target.fadeOutMs,
        );
        if (lifecycle <= 0.005) return;

        const rr = target.distance * r.radius * 0.90;
        const x = Math.cos(target.angle) * rr;
        const y = Math.sin(target.angle) * rr;
        const delta = Math.abs(
          Math.atan2(
            Math.sin(sweepAngle - target.angle),
            Math.cos(sweepAngle - target.angle),
          ),
        );
        const sweepHit = Math.max(0, 1 - delta / 0.14);

        if (sweepHit > 0.82 && !reduced) {
          target.echo = Math.max(target.echo, sweepHit);
        } else if (reduced) {
          target.echo = Math.max(target.echo, 0.48 * lifecycle);
        }

        target.echo *= Math.exp(-deltaMs / 1050);

        const softMemory = lifecycle * 0.18;
        const echo = clamp(target.echo, 0, 1);
        const brightness = clamp(softMemory + echo * 0.98, 0, 1);
        if (brightness <= 0.015) return;

        const targetRadius = target.size * (1 + echo * 0.55);
        ctx.beginPath();
        ctx.arc(x, y, targetRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,252,255,${0.20 + brightness * 0.73})`;
        ctx.shadowColor = "rgba(40,205,255,.92)";
        ctx.shadowBlur = 5 + echo * 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (echo > 0.58) {
          ctx.beginPath();
          ctx.arc(x, y, targetRadius * (2.2 + echo * 1.8), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(94,221,255,${0.18 * echo})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Tiny bearing/range return line for stronger targets.
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(77,194,240,${0.035 * echo})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      });

      // Cardinal crosshair.
      ctx.beginPath();
      ctx.moveTo(-r.radius, 0);
      ctx.lineTo(r.radius, 0);
      ctx.moveTo(0, -r.radius);
      ctx.lineTo(0, r.radius);
      ctx.strokeStyle = "rgba(91,198,244,.21)";
      ctx.lineWidth = 0.68;
      ctx.stroke();

      // Fixed contact ports around the radar. These remain independent of the
      // randomly generated radar returns.
      const portRadius = r.radius * 0.82;
      const ports = [
        { x: 0, y: -portRadius, text: "EMAIL", icon: "✉", key: "email" },
        { x: -portRadius, y: 0, text: "PHONE", icon: "⌕", key: "phone" },
        { x: portRadius, y: 0, text: "LINKEDIN", icon: "in", key: "linkedin" },
        { x: 0, y: portRadius, text: "GITHUB", icon: "◉", key: "github" },
      ];

      ports.forEach((port) => {
        const active = hoveredPort === port.key;
        const portRadiusLocal = active ? 13 : 10.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(port.x, port.y);
        ctx.strokeStyle = active
          ? "rgba(151,240,255,.98)"
          : "rgba(61,189,242,.46)";
        ctx.lineWidth = active ? 1.75 : 0.8;
        if (active) {
          ctx.shadowColor = "rgba(69,220,255,.8)";
          ctx.shadowBlur = 8;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(port.x, port.y, portRadiusLocal, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(1,13,22,.94)";
        ctx.fill();
        ctx.strokeStyle = active
          ? "rgba(178,248,255,1)"
          : "rgba(64,193,247,.76)";
        ctx.lineWidth = active ? 1.6 : 1;
        if (active) {
          ctx.shadowColor = "rgba(80,220,255,.95)";
          ctx.shadowBlur = 15;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = "700 10px Inter, Arial, sans-serif";
        ctx.fillStyle = active ? "rgba(255,255,255,1)" : "rgba(229,250,255,.97)";
        ctx.fillText(port.icon, port.x, port.y + 0.5);

        ctx.font = "700 8.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.fillStyle = active ? "rgba(198,247,255,1)" : "rgba(126,222,250,.88)";
        ctx.fillText(
          port.text,
          port.x,
          port.y + (port.y < 0 ? -19 : 23),
        );

        if (active && !reduced) {
          const t = ((now - hoverStart) % 900) / 900;
          const px = port.x * t;
          const py = port.y * t;
          ctx.beginPath();
          ctx.arc(px, py, 3.1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(235,254,255,.98)";
          ctx.shadowColor = "rgba(74,221,255,.95)";
          ctx.shadowBlur = 13;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Central PPI well + JC hub drawn in the same coordinate system as radar.
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, r.radius * 0.24);
      coreGlow.addColorStop(0, "rgba(28,196,255,.25)");
      coreGlow.addColorStop(0.55, "rgba(0,117,193,.10)");
      coreGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, r.radius * 0.30, 0, Math.PI * 2);
      ctx.fill();

      for (const scale of [0.08, 0.12, 0.17]) {
        ctx.beginPath();
        ctx.arc(0, 0, r.radius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(101,214,255,${scale === 0.12 ? 0.56 : 0.23})`;
        ctx.lineWidth = scale === 0.12 ? 1.05 : 0.7;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(0, 0, r.radius * 0.115, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(2,18,30,.96)";
      ctx.fill();
      ctx.strokeStyle = "rgba(144,236,255,.92)";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = "rgba(48,207,255,.85)";
      ctx.shadowBlur = 11;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = "700 22px Inter, Arial, sans-serif";
      ctx.fillStyle = "#eafaff";
      ctx.fillText("JC", 0, 1);
      ctx.font = "700 7.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(117,212,242,.74)";
      ctx.fillText("RADAR ACTIVE", 0, r.radius * 0.205);

      // North / east / south / west labels emphasize the bearing orientation.
      ctx.font = "700 8px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(183,235,253,.72)";
      ctx.fillText("N", 0, -r.radius * 0.925);
      ctx.fillText("E", r.radius * 0.925, 0);
      ctx.fillText("S", 0, r.radius * 0.925);
      ctx.fillText("W", -r.radius * 0.925, 0);

      ctx.restore();
    };

    const drawNetwork = (now: number, deltaMs: number) => {
      ctx.clearRect(0, 0, width, height);
      drawSpace(now);

      const layoutState = layout();
      const earth = layoutState.earth;

      // A fixed, subtle atmospheric halo around the Earth.
      const atmo = ctx.createRadialGradient(
        earth.cx,
        earth.cy,
        earth.radius * 0.94,
        earth.cx,
        earth.cy,
        earth.radius * 1.15,
      );
      atmo.addColorStop(0, "rgba(120,180,255,0)");
      atmo.addColorStop(0.55, "rgba(110,175,255,.12)");
      atmo.addColorStop(1, "rgba(90,160,255,0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(earth.cx, earth.cy, earth.radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      drawGlobalRoutes(now, deltaMs);
      drawRadar(now, deltaMs);
    };

    const drawGlobe = (now: number, deltaMs: number) => {
      const g = layout().earth;

      // Extremely slow rotation: Earth remains cinematic, not distracting.
      if (!reduced) yaw += deltaMs * 0.000075;

      gl.viewport(
        0,
        0,
        Math.floor(width * dpr),
        Math.floor(height * dpr),
      );
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTexture, 0);
      gl.uniform1f(uYaw, yaw);
      gl.uniform1f(uPitch, pitch);
      gl.uniform1f(uRadius, g.radius * dpr);
      gl.uniform2f(uCenter, g.cx * dpr, g.cy * dpr);
      gl.uniform2f(uResolution, width * dpr, height * dpr);
      gl.uniform1f(uTime, now);

      if (textureReady) {
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
      }

      drawNetwork(now, deltaMs);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };
    const render = (now: number) => {
      if (!visible || !documentVisible) {
        raf = 0;
        running = false;
        return;
      }
      if (now - last < frameInterval) {
        raf = requestAnimationFrame(render);
        return;
      }
      const delta = Math.min(50, now - last);
      last = now;

      if (!reduced) {
        elapsed += delta;
      }

      drawGlobe(elapsed, delta);
      raf = requestAnimationFrame(render);
    };
    const start = () => {
      if (running || !visible || !documentVisible) return;
      running = true;
      ensureTextureLoaded();
      last = performance.now();
      raf = requestAnimationFrame(render);
    };

    resize();

    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 60);
    });
    ro.observe(networkCanvas.parentElement ?? networkCanvas);

    const onReduced = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      stop();
      if (visible) {
        ensureTextureLoaded();
        drawGlobe(elapsed, 0);
        if (!reduced && documentVisible) start();
      }
    };
    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) start(); else stop();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        ensureTextureLoaded();
        if (reduced) drawGlobe(elapsed, 0);
        else start();
      } else {
        stop();
      }
    }, { rootMargin: "180px 0px" });
    io.observe(networkCanvas.parentElement ?? networkCanvas);
    reducedQ.addEventListener("change", onReduced);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      reducedQ.removeEventListener("change", onReduced);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("contact-radar-hover", onContactHover);

      if (texture) gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="contact-globe-network" aria-hidden="true">
      <canvas ref={globeRef} className="contact-globe-earth" />
      <canvas ref={networkRef} className="contact-globe-overlay" />
    </div>
  );
}

export default ContactGlobeNetwork;
