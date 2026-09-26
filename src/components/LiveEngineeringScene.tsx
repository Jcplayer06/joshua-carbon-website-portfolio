import { useEffect, useRef } from "react";
import earthTextureUrl from "../assets/earth-night-texture.webp";

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
  phase: number;
  speedFactor: number;
  speedPxPerSecond: number;
  kind: "slow" | "normal" | "fast" | "superfast" | "meteor";
  trail: TrailPoint[];
}

interface Packet {
  a: number;
  b: number;
  t: number;
  speed: number;
}

interface OrbitTracer {
  orbit: number;
  t: number;
  speed: number;
  phase: number;
}

interface GlowSprite {
  canvas: HTMLCanvasElement;
  size: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function createSeeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program.");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown program error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

function buildSphereMesh(latSegments = 48, lonSegments = 96) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let lat = 0; lat <= latSegments; lat += 1) {
    const v = lat / latSegments;
    const phi = (v - 0.5) * Math.PI;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    for (let lon = 0; lon <= lonSegments; lon += 1) {
      const u = lon / lonSegments;
      const theta = u * Math.PI * 2;
      const x = cosPhi * Math.cos(theta);
      const y = sinPhi;
      const z = cosPhi * Math.sin(theta);
      positions.push(x, y, z);
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

function createGlowSprite(
  size: number,
  center: string,
  mid: string,
): GlowSprite {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { canvas, size };
  const r = size / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, center);
  gradient.addColorStop(0.28, mid);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return { canvas, size };
}

export default function LiveEngineeringScene() {
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const globeRef = useRef<HTMLCanvasElement | null>(null);
  const globeHitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const backgroundCanvas = backgroundRef.current;
    const globeCanvas = globeRef.current;
    const globeHit = globeHitRef.current;
    if (!backgroundCanvas || !globeCanvas || !globeHit) return;

    const bgContext = backgroundCanvas.getContext("2d", { alpha: true });
    const gl = globeCanvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!bgContext || !gl) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let elapsed = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    const philippinesLongitude = 121.774;
    const philippinesLatitude = 12.8797;
    // Default view centers the globe on the Philippines (approx. 121.8E, 12.9N).
    const philippinesYaw = (philippinesLongitude - 90) * Math.PI / 180;
    let globeYaw = philippinesYaw;
    const philippinesPitch = -(philippinesLatitude * Math.PI / 180);
    let globePitch = philippinesPitch;
    let targetGlobeYaw = philippinesYaw;
    let targetGlobePitch = philippinesPitch;
    let draggingGlobe = false;
    let globeSelected = false;
    let pointerMovedDuringGesture = false;
    let selectionBeforeGesture = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartYaw = 0;
    let dragStartPitch = 0;
    let activePointerId: number | null = null;
    let heroVisible = false;
    let documentVisible = !document.hidden;
    let nodes: NodePoint[] = [];
    let packets: Packet[] = [];
    let orbitTracers: OrbitTracer[] = [];
    let staticLayer: HTMLCanvasElement | null = null;
    let staticLayerWidth = 0;
    let staticLayerHeight = 0;
    let lastFrameRender = 0;

    const nodeGlow = createGlowSprite(64, "rgba(178,244,255,.95)", "rgba(25,183,255,.36)");
    const meteorGlow = createGlowSprite(96, "rgba(230,252,255,1)", "rgba(52,201,255,.46)");
    const packetGlow = createGlowSprite(54, "rgba(210,250,255,1)", "rgba(32,186,255,.42)");
    const tracerGlow = createGlowSprite(50, "rgba(191,246,255,1)", "rgba(35,184,255,.34)");

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
        p = vec3(
          p.x,
          cp * p.y - sp * p.z,
          sp * p.y + cp * p.z
        );

        float focal = 1.16;
        float perspective = focal / (focal + p.z * 0.18);
        vec2 px = u_center + p.xy * u_radius * perspective;
        vec2 clip = (px / u_resolution) * 2.0 - 1.0;
        clip.y *= -1.0;

        gl_Position = vec4(clip, -p.z * 0.4, 1.0);
        v_uv = a_uv;
        v_normal = normalize(p);
        v_depth = p.z;
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform vec2 u_light;
      varying vec2 v_uv;
      varying vec3 v_normal;
      varying float v_depth;

      void main() {
        vec3 tex = texture2D(u_texture, v_uv).rgb;
        vec3 n = normalize(v_normal);
        vec3 lightDir = normalize(vec3(u_light.x, 0.42, 1.0));
        float lighting = max(dot(n, lightDir), 0.0);
        float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.4);
        float front = smoothstep(-0.15, 0.35, v_depth);
        float scan = 0.5 + 0.5 * sin(u_time * 0.0015 + (v_uv.x + v_uv.y) * 24.0);

        vec3 electric = vec3(0.02, 0.32, 0.68);
        vec3 blue = vec3(0.0, 0.52, 1.0);
        vec3 color = tex * (0.48 + lighting * 1.08);
        color += electric * rim * 0.72;
        color += blue * scan * rim * 0.07;
        color += blue * max(front, 0.0) * 0.12;

        float alpha = smoothstep(-0.82, -0.08, v_depth) * 0.98;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    let program: WebGLProgram;
    try {
      program = createProgram(gl, vertexSource, fragmentSource);
    } catch {
      return undefined;
    }

    const mesh = buildSphereMesh();
    const positionBuffer = gl.createBuffer();
    const uvBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!positionBuffer || !uvBuffer || !indexBuffer) return undefined;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    const texture = gl.createTexture();
    if (!texture) return undefined;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const textureImage = new Image();
    textureImage.decoding = "async";
    textureImage.src = earthTextureUrl;
    let textureReady = false;
    textureImage.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
      gl.generateMipmap(gl.TEXTURE_2D);
      textureReady = true;
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
    const uLight = gl.getUniformLocation(program, "u_light");

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const globeGeometry = () => {
      const mobile = width < 820;
      return {
        cx: width * (mobile ? 0.63 : 0.61),
        cy: height * (mobile ? 0.47 : 0.48),
        radius: Math.min(width * (mobile ? 0.28 : 0.235), height * 0.33),
      };
    };

    const rebuildStaticLayer = () => {
      staticLayer = document.createElement("canvas");
      staticLayer.width = Math.max(1, Math.floor(width * dpr));
      staticLayer.height = Math.max(1, Math.floor(height * dpr));
      staticLayerWidth = width;
      staticLayerHeight = height;
      const ctx = staticLayer.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#020814");
      bg.addColorStop(0.48, "#031321");
      bg.addColorStop(1, "#01050a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const gridStep = width < 700 ? 30 : 42;
      ctx.strokeStyle = "rgba(65,160,220,.045)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width + gridStep; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
        ctx.stroke();
      }
      for (let y = 0; y < height + gridStep; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();
      }

      for (let i = 0; i < 46; i += 1) {
        const x = (i / 46) * width;
        const h = height * (0.08 + ((i * 17) % 14) * 0.012);
        const y = height * 0.91 - h;
        const w = 4 + ((i * 19) % 11);
        ctx.fillStyle = `rgba(${7 + (i % 3) * 4},${26 + (i % 4) * 9},${43 + (i % 5) * 13},${0.34 + (i % 5) * 0.04})`;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "rgba(41,145,200,.1)";
        ctx.strokeRect(x + 0.5, y + 0.5, Math.max(1, w - 1), Math.max(1, h - 1));
      }

      const baseY = height * 0.89;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, baseY);
      for (let i = 0; i <= 26; i += 1) {
        const x = (i / 26) * width;
        const bump = (i % 4 === 0 ? height * 0.065 : 0) + ((i * 11) % 6) * height * 0.009;
        ctx.lineTo(x, baseY - bump);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const terrain = ctx.createLinearGradient(0, baseY, 0, height);
      terrain.addColorStop(0, "rgba(4,17,29,.88)");
      terrain.addColorStop(0.55, "rgba(2,10,18,.98)");
      terrain.addColorStop(1, "rgba(1,4,8,1)");
      ctx.fillStyle = terrain;
      ctx.fill();
      ctx.strokeStyle = "rgba(20,147,212,.23)";
      ctx.stroke();
    };

    const resize = () => {
      const rect = backgroundCanvas.parentElement?.getBoundingClientRect();
      width = Math.max(1, rect?.width ?? window.innerWidth);
      height = Math.max(1, rect?.height ?? window.innerHeight);

      // Prioritize smooth desktop rendering while retaining conservative scaling for
      // tablets/phones so the same visual system can be reused there later.
      const pixelRatio = window.devicePixelRatio || 1;
      const targetDpr = width < 700 ? 1 : width < 1100 ? 1.15 : 1.35;
      dpr = Math.min(pixelRatio, targetDpr);

      backgroundCanvas.width = Math.floor(width * dpr);
      backgroundCanvas.height = Math.floor(height * dpr);
      globeCanvas.width = Math.floor(width * dpr);
      globeCanvas.height = Math.floor(height * dpr);
      backgroundCanvas.style.width = `${width}px`;
      backgroundCanvas.style.height = `${height}px`;
      globeCanvas.style.width = `${width}px`;
      globeCanvas.style.height = `${height}px`;
      bgContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      gl.viewport(0, 0, Math.floor(width * dpr), Math.floor(height * dpr));

      const geometry = globeGeometry();
      globeHit.style.left = `${geometry.cx - geometry.radius * 1.04}px`;
      globeHit.style.top = `${geometry.cy - geometry.radius * 1.04}px`;
      globeHit.style.width = `${geometry.radius * 2.08}px`;
      globeHit.style.height = `${geometry.radius * 2.08}px`;

      rebuildStaticLayer();

      const rand = createSeeded(20260922 + Math.floor(width));
      const density = width < 700 ? 78 : width < 1100 ? 138 : 200;
      nodes = Array.from({ length: density }, () => {
        const roll = rand();
        const kind: NodePoint["kind"] =
          roll < 0.34 ? "slow"
          : roll < 0.72 ? "normal"
          : roll < 0.88 ? "fast"
          : roll < 0.945 ? "superfast"
          : "meteor";
        const speedPxPerSecond =
          kind === "slow" ? 7 + rand() * 6
          : kind === "normal" ? 14 + rand() * 12
          : kind === "fast" ? 34 + rand() * 36
          : kind === "superfast" ? 85 + rand() * 70
          : 150 + rand() * 120;
        const angle = rand() * Math.PI * 2;
        const cluster = rand() < 0.68;
        return {
          x: cluster ? width * (0.42 + rand() * 0.48) : rand() * width,
          y: cluster ? height * (0.10 + rand() * 0.78) : rand() * height,
          vx: Math.cos(angle),
          vy: Math.sin(angle),
          r: kind === "meteor" ? 1.2 + rand() * 1.3 : kind === "superfast" ? 1.0 + rand() * 1.15 : kind === "fast" ? 0.9 + rand() * 1.1 : 0.65 + rand() * 1.1,
          depth: 0.35 + rand() * 0.65,
          phase: rand() * Math.PI * 2,
          speedFactor: 0.90 + rand() * 0.22,
          speedPxPerSecond,
          kind,
          trail: [],
        };
      });

      const packetCount = width < 700 ? 18 : width < 1100 ? 28 : 36;
      packets = Array.from({ length: packetCount }, () => ({
        a: Math.floor(rand() * density),
        b: Math.floor(rand() * density),
        t: rand(),
        speed: 0.00004 + rand() * 0.00006,
      }));
      orbitTracers = Array.from({ length: 12 }, (_, i) => ({
        orbit: i,
        t: rand(),
        speed: 0.000012 + rand() * 0.000018,
        phase: rand() * Math.PI * 2,
      }));
    };

    const deselectGlobe = () => {
      draggingGlobe = false;
      activePointerId = null;
      pointerMovedDuringGesture = false;
      globeSelected = false;
      globeHit.classList.remove("is-selected");
      globeHit.setAttribute("aria-pressed", "false");
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / Math.max(width, 1);
      const y = event.clientY / Math.max(height, 1);
      targetPointerX = clamp((x - 0.5) * 2, -1, 1);
      targetPointerY = clamp((y - 0.5) * 2, -1, 1);

      if (!globeSelected || !draggingGlobe || activePointerId !== event.pointerId) return;
      const dxTotal = event.clientX - dragStartX;
      const dyTotal = event.clientY - dragStartY;
      if (Math.abs(dxTotal) + Math.abs(dyTotal) > 4) pointerMovedDuringGesture = true;
      targetGlobeYaw = dragStartYaw + dxTotal * 0.0038;
      targetGlobePitch = clamp(dragStartPitch + dyTotal * 0.0026, -0.72, 0.72);
    };

    const onGlobePointerDown = (event: PointerEvent) => {
      event.stopPropagation();
      if (event.button !== 0 && event.pointerType === "mouse") return;

      selectionBeforeGesture = globeSelected;
      if (!globeSelected) {
        globeSelected = true;
        globeHit.classList.add("is-selected");
        globeHit.setAttribute("aria-pressed", "true");
      }

      draggingGlobe = true;
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartYaw = globeYaw;
      dragStartPitch = globePitch;
      pointerMovedDuringGesture = false;
      globeHit.setPointerCapture?.(event.pointerId);
    };

    const finishGlobePointer = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;
      const moved = pointerMovedDuringGesture;
      draggingGlobe = false;
      activePointerId = null;
      globeHit.releasePointerCapture?.(event.pointerId);

      // First click selects. A second click without dragging deselects.
      if (selectionBeforeGesture && !moved && event.type === "pointerup") {
        deselectGlobe();
      }
      selectionBeforeGesture = false;
    };

    const onWheel = () => {
      // Scrolling is a strong signal that the user wants to leave globe interaction.
      deselectGlobe();
    };

    const onWindowScroll = () => {
      deselectGlobe();
    };

    const onWindowPointerDown = (event: PointerEvent) => {
      if (!globeHit.contains(event.target as Node)) deselectGlobe();
    };

    const drawSprite = (sprite: GlowSprite, x: number, y: number, scale: number, alpha = 1) => {
      bgContext.globalAlpha = alpha;
      bgContext.drawImage(sprite.canvas, x - (sprite.size * scale) / 2, y - (sprite.size * scale) / 2, sprite.size * scale, sprite.size * scale);
      bgContext.globalAlpha = 1;
    };

    const drawBackground = (time: number, deltaMs: number) => {
      if (!staticLayer || staticLayerWidth !== width || staticLayerHeight !== height) rebuildStaticLayer();
      bgContext.clearRect(0, 0, width, height);

      const driftX = pointerX * 24;
      const driftY = pointerY * 18;
      if (staticLayer) bgContext.drawImage(staticLayer, driftX * 0.03, driftY * 0.02, staticLayer.width / dpr, staticLayer.height / dpr);

      // A few large ambient glows. These use cached sprites instead of creating gradients every frame.
      drawSprite(nodeGlow, width * 0.61 + driftX, height * 0.44 + driftY, Math.min(width, height) * 0.018, 0.11);
      drawSprite(nodeGlow, width * 0.89 - driftX * 0.2, height * 0.22, Math.min(width, height) * 0.010, 0.055);

      // Update nodes using real elapsed time. Trails are only kept for fast/meteor nodes.
      for (const node of nodes) {
        const previousX = node.x;
        const previousY = node.y;
        if (!reducedMotion) {
          const motionScale = (deltaMs / 1000) * node.speedPxPerSecond * node.depth * node.speedFactor;
          node.x += node.vx * motionScale;
          node.y += node.vy * motionScale;
          if (node.x < -30) node.x = width + 30;
          if (node.x > width + 30) node.x = -30;
          if (node.y < -30) node.y = height + 30;
          if (node.y > height + 30) node.y = -30;

          const moved = Math.hypot(node.x - previousX, node.y - previousY);
          if (node.kind === "superfast" || node.kind === "meteor") {
            if (moved > 0.05 && Math.abs(node.x - previousX) < width * 0.5) {
              node.trail.unshift({
                x: node.x,
                y: node.y,
                life: node.kind === "meteor" ? 1.55 : 0.78,
              });
            }
          }
        }

        const trailDecay = node.kind === "meteor" ? 1.18 : 1.55;
        for (let i = node.trail.length - 1; i >= 0; i -= 1) {
          node.trail[i].life -= reducedMotion ? 1 : (deltaMs / 1000) * trailDecay;
          if (node.trail[i].life <= 0) node.trail.splice(i, 1);
        }
        const trailMax = node.kind === "meteor" ? 30 : node.kind === "superfast" ? 16 : 0;
        if (node.trail.length > trailMax) node.trail.length = trailMax;
      }

      // AI-style motion trails: only superfast and meteor particles leave these.
      for (const node of nodes) {
        if ((node.kind !== "superfast" && node.kind !== "meteor") || node.trail.length < 2) continue;
        const start = node.trail[0];
        const end = node.trail[node.trail.length - 1];
        const gradient = bgContext.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, node.kind === "meteor" ? "rgba(226,252,255,.96)" : "rgba(114,232,255,.68)");
        gradient.addColorStop(0.35, node.kind === "meteor" ? "rgba(68,202,255,.55)" : "rgba(49,174,238,.22)");
        gradient.addColorStop(1, "rgba(30,130,210,0)");
        bgContext.beginPath();
        bgContext.moveTo(start.x + pointerX * node.depth * 7, start.y + pointerY * node.depth * 5);
        for (let i = 1; i < node.trail.length; i += 1) {
          const point = node.trail[i];
          bgContext.lineTo(point.x + pointerX * node.depth * 7, point.y + pointerY * node.depth * 5);
        }
        bgContext.strokeStyle = gradient;
        bgContext.lineWidth = node.kind === "meteor" ? 1.45 : 0.9;
        bgContext.lineCap = "round";
        bgContext.stroke();
      }

      // Spatial hash: avoid the old O(N²) all-pairs network calculation.
      const connectionDistance = width < 700 ? 112 : width < 1100 ? 140 : 168;
      const cellSize = connectionDistance;
      const buckets = new Map<string, number[]>();
      const cellKey = (x: number, y: number) => `${Math.floor(x / cellSize)}:${Math.floor(y / cellSize)}`;
      for (let i = 0; i < nodes.length; i += 1) {
        const key = cellKey(nodes[i].x, nodes[i].y);
        const bucket = buckets.get(key);
        if (bucket) bucket.push(i);
        else buckets.set(key, [i]);
      }

      const lineBuckets: Path2D[] = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      const connectionCounts = new Uint8Array(nodes.length);
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        const cx = Math.floor(a.x / cellSize);
        const cy = Math.floor(a.y / cellSize);
        for (let ox = -1; ox <= 1; ox += 1) {
          for (let oy = -1; oy <= 1; oy += 1) {
            const bucket = buckets.get(`${cx + ox}:${cy + oy}`);
            if (!bucket) continue;
            for (const j of bucket) {
              if (j <= i) continue;
              const b = nodes[j];
              if (connectionCounts[i] >= 4 || connectionCounts[j] >= 4) continue;
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const distanceSquared = dx * dx + dy * dy;
              if (distanceSquared > connectionDistance * connectionDistance) continue;
              const distance = Math.sqrt(distanceSquared);
              const strength = (1 - distance / connectionDistance) * Math.min(a.depth, b.depth);
              const bucketIndex = Math.min(3, Math.max(0, Math.floor(strength * 4)));
              const path = lineBuckets[bucketIndex];
              path.moveTo(a.x + pointerX * a.depth * 7, a.y + pointerY * a.depth * 5);
              path.lineTo(b.x + pointerX * b.depth * 7, b.y + pointerY * b.depth * 5);
              connectionCounts[i] += 1;
              connectionCounts[j] += 1;
            }
          }
        }
      }

      // Two simple passes over the batched paths replace thousands of save/restore/shadow calls.
      bgContext.lineCap = "round";
      bgContext.lineWidth = 2.15;
      bgContext.strokeStyle = "rgba(31,160,235,.10)";
      for (const path of lineBuckets) bgContext.stroke(path);
      bgContext.lineWidth = 0.72;
      for (let i = 0; i < lineBuckets.length; i += 1) {
        bgContext.strokeStyle = `rgba(73,186,244,${0.10 + i * 0.055})`;
        bgContext.stroke(lineBuckets[i]);
      }

      // Moving data packets use cached glow sprites and only a few packets at once.
      for (const packet of packets) {
        const a = nodes[packet.a];
        const b = nodes[packet.b];
        if (!a || !b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy > connectionDistance * connectionDistance) continue;
        packet.t = reducedMotion ? packet.t : (packet.t + packet.speed * deltaMs) % 1;
        const x = a.x + (b.x - a.x) * packet.t;
        const y = a.y + (b.y - a.y) * packet.t;
        const tx = a.x + (b.x - a.x) * Math.max(0, packet.t - 0.12);
        const ty = a.y + (b.y - a.y) * Math.max(0, packet.t - 0.12);
        bgContext.beginPath();
        bgContext.moveTo(tx, ty);
        bgContext.lineTo(x, y);
        bgContext.strokeStyle = "rgba(92,212,255,.26)";
        bgContext.lineWidth = 1.05;
        bgContext.stroke();
        drawSprite(packetGlow, x, y, 0.30, 0.42);
      }

      // Nodes: cached glow sprite + simple core circle (no per-node shadowBlur).
      for (const node of nodes) {
        const x = node.x + pointerX * node.depth * 7;
        const y = node.y + pointerY * node.depth * 5;
        const pulse = reducedMotion ? 0 : Math.sin(time * 0.0008 + node.phase) * 0.22;
        const isMeteor = node.kind === "meteor";
        const isSuperfast = node.kind === "superfast";
        const glow = isMeteor ? meteorGlow : nodeGlow;
        drawSprite(
          glow,
          x,
          y,
          isMeteor ? 0.46 + node.depth * 0.09 : isSuperfast ? 0.30 + node.depth * 0.08 : 0.22 + node.depth * 0.07,
          isMeteor ? 0.9 : isSuperfast ? 0.58 : 0.34,
        );
        bgContext.beginPath();
        bgContext.arc(x, y, Math.max(0.85, node.r + pulse), 0, Math.PI * 2);
        bgContext.fillStyle = isMeteor ? "rgba(230,252,255,.98)" : isSuperfast ? "rgba(133,231,255,.96)" : "rgba(79,214,255,.86)";
        bgContext.fill();
      }

      // Orbit field around the live globe.
      const { cx, cy, radius } = globeGeometry();
      for (let i = 0; i < 7; i += 1) {
        const angle = (i / 7) * Math.PI;
        const rx = radius * (1.18 + (i % 3) * 0.11);
        const ry = radius * (0.32 + (i % 4) * 0.13);
        bgContext.save();
        bgContext.translate(cx, cy);
        bgContext.rotate(angle + (reducedMotion ? 0 : time * (0.000008 + i * 0.000001)));
        bgContext.beginPath();
        bgContext.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        bgContext.strokeStyle = `rgba(31,175,255,${0.13 + (i % 3) * 0.025})`;
        bgContext.lineWidth = 0.65;
        bgContext.stroke();
        bgContext.restore();
      }

      orbitTracers.forEach((tracer) => {
        tracer.t = reducedMotion ? tracer.t : (tracer.t + tracer.speed * deltaMs) % 1;
        const angle = tracer.t * Math.PI * 2 + tracer.phase;
        const rx = radius * (1.16 + (tracer.orbit % 3) * 0.11);
        const ry = radius * (0.32 + (tracer.orbit % 4) * 0.13);
        const rotation = tracer.orbit * 0.32 + (reducedMotion ? 0 : time * 0.000008);
        const xLocal = Math.cos(angle) * rx;
        const yLocal = Math.sin(angle) * ry;
        const x = cx + xLocal * Math.cos(rotation) - yLocal * Math.sin(rotation);
        const y = cy + xLocal * Math.sin(rotation) + yLocal * Math.cos(rotation);
        drawSprite(tracerGlow, x, y, 0.22, 0.48);
        bgContext.beginPath();
        bgContext.arc(x, y, 1.65, 0, Math.PI * 2);
        bgContext.fillStyle = "rgba(153,236,255,.96)";
        bgContext.fill();
      });

      const scanY = (time * 0.020) % (height + 140) - 70;
      bgContext.fillStyle = "rgba(59,178,241,.018)";
      bgContext.fillRect(0, scanY, width, 70);

      for (let i = 0; i < 44; i += 1) {
        const x = (i * 173.2 + time * 0.0005 * (i % 2 ? 1 : -1)) % width;
        const y = (i * 97.4 + time * 0.00035 * (i % 3 ? 1 : -1)) % height;
        bgContext.beginPath();
        bgContext.arc(x, y, 0.65 + (i % 3) * 0.25, 0, Math.PI * 2);
        bgContext.fillStyle = "rgba(86,211,255,.28)";
        bgContext.fill();
      }
    };

    const drawPhilippinesMarker = (cx: number, cy: number, radius: number) => {
      const lat = philippinesLatitude * Math.PI / 180;
      // The sphere mesh maps u=0 to -180° longitude, so convert geographic longitude
      // to the same theta convention used by the mesh before applying globe rotation.
      const lonTheta = philippinesLongitude * Math.PI / 180 + Math.PI;
      const x0 = Math.cos(lat) * Math.cos(lonTheta);
      // The globe mesh uses +Y for north latitude; keep the marker in the same geographic convention.
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.sin(lonTheta);

      const sy = Math.sin(globeYaw);
      const cyaw = Math.cos(globeYaw);
      const x1 = cyaw * x0 + sy * z0;
      const z1 = -sy * x0 + cyaw * z0;
      const sp = Math.sin(globePitch);
      const cp = Math.cos(globePitch);
      const y1 = cp * y0 - sp * z1;
      const z2 = sp * y0 + cp * z1;
      if (z2 > -0.18) return;

      const focal = 1.16;
      const perspective = focal / (focal + z2 * 0.18);
      const x = cx + x1 * radius * perspective;
      const y = cy + y1 * radius * perspective;
      const pulse = 1 + Math.sin(elapsed * 0.004) * 0.18;

      bgContext.beginPath();
      bgContext.arc(x, y, 5.5 * pulse, 0, Math.PI * 2);
      bgContext.strokeStyle = 'rgba(67, 213, 255, .72)';
      bgContext.lineWidth = 1;
      bgContext.stroke();
      bgContext.beginPath();
      bgContext.arc(x, y, 2.1, 0, Math.PI * 2);
      bgContext.fillStyle = 'rgba(214, 252, 255, .98)';
      bgContext.shadowColor = 'rgba(25, 191, 255, .85)';
      bgContext.shadowBlur = 10;
      bgContext.fill();
      bgContext.shadowBlur = 0;

      const labelX = x + 11;
      const labelY = y - 8;
      bgContext.strokeStyle = 'rgba(60, 191, 255, .5)';
      bgContext.lineWidth = 0.8;
      bgContext.beginPath();
      bgContext.moveTo(x + 4, y - 2);
      bgContext.lineTo(labelX, labelY);
      bgContext.stroke();
      bgContext.font = '700 7px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      bgContext.fillStyle = 'rgba(111, 225, 255, .95)';
      bgContext.fillText('PHILIPPINES', labelX + 3, labelY - 1);
      bgContext.font = '600 5.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      bgContext.fillStyle = 'rgba(132, 213, 255, .68)';
      bgContext.fillText('MANILA / PH', labelX + 3, labelY + 8);
    };

    const drawGlobe = (time: number, deltaMs: number) => {
      const { cx, cy, radius } = globeGeometry();
      globeHit.style.left = `${cx - radius * 1.04}px`;
      globeHit.style.top = `${cy - radius * 1.04}px`;
      globeHit.style.width = `${radius * 2.08}px`;
      globeHit.style.height = `${radius * 2.08}px`;
      const pixelW = Math.floor(width * dpr);
      const pixelH = Math.floor(height * dpr);
      gl.viewport(0, 0, pixelW, pixelH);
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

      // Default state: the globe continuously auto-rotates.
      // Clicking the globe selects manual mode and stops auto-rotation; clicking
      // again deselects it and resumes the automatic rotation.
      if (!reducedMotion && !globeSelected && !draggingGlobe) {
        globeYaw += deltaMs * 0.00034;
        targetGlobeYaw = globeYaw;
      }

      globeYaw += (targetGlobeYaw - globeYaw) * 0.19;
      globePitch += (targetGlobePitch - globePitch) * 0.19;

      gl.uniform1f(uYaw, globeYaw);
      gl.uniform1f(uPitch, globePitch);
      gl.uniform1f(uRadius, radius * dpr);
      gl.uniform2f(uCenter, cx * dpr, cy * dpr);
      gl.uniform2f(uResolution, pixelW, pixelH);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uLight, Math.cos(globeYaw * 0.9), 0.38);

      if (textureReady) gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

      // Default view is centered on the Philippines with a subtle live location marker.
      // The marker uses the same longitude/latitude convention as the equirectangular texture.
      drawPhilippinesMarker(cx, cy, radius);

      const shell = bgContext.createRadialGradient(
        cx - radius * 0.24,
        cy - radius * 0.25,
        radius * 0.02,
        cx,
        cy,
        radius * 1.16,
      );
      shell.addColorStop(0, "rgba(0,174,255,.04)");
      shell.addColorStop(0.55, "rgba(0,125,220,.035)");
      shell.addColorStop(1, "rgba(0,0,0,0)");
      bgContext.fillStyle = shell;
      bgContext.fillRect(cx - radius * 1.2, cy - radius * 1.2, radius * 2.4, radius * 2.4);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    const render = (now: number) => {
      if (!heroVisible || !documentVisible) {
        stop();
        return;
      }

      const minFrameInterval = width < 1100 ? 20 : 16.7;

      if (now - lastFrameRender < minFrameInterval) {
        raf = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min(40, now - last);
      last = now;
      lastFrameRender = now;

      if (!reducedMotion) elapsed += delta;

      pointerX += (targetPointerX - pointerX) * 0.055;
      pointerY += (targetPointerY - pointerY) * 0.055;

      drawBackground(elapsed, delta);
      drawGlobe(elapsed, delta);

      raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (running || !heroVisible || !documentVisible) return;

      running = true;
      last = performance.now();
      lastFrameRender = 0;
      raf = requestAnimationFrame(render);
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        heroVisible = entries.some((entry) => entry.isIntersecting);

        if (heroVisible) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(backgroundCanvas.parentElement ?? backgroundCanvas);

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;

      if (documentVisible) {
        start();
      } else {
        stop();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    globeHit.addEventListener("pointerdown", onGlobePointerDown);
    globeHit.addEventListener("pointerup", finishGlobePointer);
    globeHit.addEventListener("pointercancel", finishGlobePointer);
    window.addEventListener("pointerdown", onWindowPointerDown);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    reducedMotionQuery.addEventListener("change", onMotionPreferenceChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      globeHit.removeEventListener("pointerdown", onGlobePointerDown);
      globeHit.removeEventListener("pointerup", finishGlobePointer);
      globeHit.removeEventListener("pointercancel", finishGlobePointer);
      window.removeEventListener("pointerdown", onWindowPointerDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onWindowScroll);
      reducedMotionQuery.removeEventListener("change", onMotionPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="live-engineering-scene" aria-hidden="true">
      <canvas ref={backgroundRef} className="live-scene-background" />
      <canvas ref={globeRef} className="live-scene-globe" />
      <div
        ref={globeHitRef}
        className="globe-interaction-target"
        role="button"
        tabIndex={0}
        aria-label="Interactive globe: click to select, drag to rotate, click again to deselect"
        aria-pressed="false"
      />
      <div className="live-scene-vignette" />
    </div>
  );
}
