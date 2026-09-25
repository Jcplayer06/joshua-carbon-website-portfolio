import { useEffect, useRef } from "react";
import referenceImage from "../assets/reference/portfolio-hero-reference.png";

const NAV_CROP = 70;
const IMAGE_WIDTH = 1731;
const IMAGE_HEIGHT = 909;
const HERO_SOURCE_HEIGHT = IMAGE_HEIGHT - NAV_CROP;

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute vec2 aUv;

uniform vec2 uCoverScale;
uniform vec2 uPointer;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 p = aPosition;

  float driftX = sin(uTime * 0.18 + p.y * 2.6) * 0.0022;
  float driftY = cos(uTime * 0.14 + p.x * 2.2) * 0.0018;

  p.x += driftX + uPointer.x * 0.008;
  p.y += driftY + uPointer.y * 0.006;

  p *= uCoverScale;
  gl_Position = vec4(p, 0.0, 1.0);
  vUv = aUv;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform vec2 uPointer;
uniform float uTime;

varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
  float imageAspect = uImageResolution.x / max(uImageResolution.y, 1.0);

  vec2 scale = vec2(1.0);
  if (canvasAspect > imageAspect) {
    scale.y = imageAspect / canvasAspect;
  } else {
    scale.x = canvasAspect / imageAspect;
  }

  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv);

  vec2 pointer = uPointer * 0.5;
  vec2 centered = uv - 0.5;

  // The entire reference scene subtly breathes, drifts and responds to the cursor.
  vec2 sceneWarp = vec2(
    sin(uv.y * 18.0 + uTime * 0.32) * 0.0018,
    cos(uv.x * 13.0 - uTime * 0.24) * 0.0015
  );

  sceneWarp += pointer * 0.0045;

  // Localized globe-region motion makes the baked world feel like a live rotating system,
  // while preserving the surrounding composition rather than adding a second globe.
  vec2 globeCenter = vec2(0.61, 0.47);
  float globeDistance = distance(uv, globeCenter);
  float globeMask = 1.0 - smoothstep(0.17, 0.27, globeDistance);

  float globeWave = sin(uv.y * 44.0 + uTime * 0.9) * 0.0018;
  float globeSweep = sin(uTime * 0.38 + centered.x * 9.0) * 0.0012;
  sceneWarp.x += (globeWave + globeSweep) * globeMask;
  sceneWarp.y += cos(uv.x * 31.0 + uTime * 0.6) * 0.0010 * globeMask;

  vec2 sampleUv = clamp(uv + sceneWarp, 0.001, 0.999);
  vec4 color = texture2D(uTexture, sampleUv);

  // Mask the obsolete reference statistics strip. The HTML learning panel occupies this exact region.
  float statsRectX = smoothstep(0.055, 0.075, uv.x) * (1.0 - smoothstep(0.36, 0.385, uv.x));
  float statsRectY = smoothstep(0.775, 0.79, uv.y) * (1.0 - smoothstep(0.875, 0.895, uv.y));
  float statsMask = statsRectX * statsRectY;
  vec3 maskedColor = mix(color.rgb, vec3(0.008, 0.023, 0.040), statsMask * 0.98);
  color.rgb = maskedColor;

  // Moving cyan illumination embedded into the scene rather than a DOM effect.
  float lightX = fract(0.23 + uTime * 0.018);
  float light = exp(-pow((uv.x - lightX) * 7.0, 2.0));
  float globeLight = exp(-globeDistance * 11.0) * (0.65 + 0.35 * sin(uTime * 0.55));

  color.rgb += vec3(0.0, 0.028, 0.06) * light * 0.34;
  color.rgb += vec3(0.0, 0.02, 0.045) * globeLight * 0.22;

  // Fine moving scan texture makes the environment feel rendered/live instead of flat.
  float scan = sin(uv.y * uResolution.y * 0.7 + uTime * 2.8) * 0.004;
  color.rgb += scan;

  // Soft vignette that remains subtle enough not to change the reference hierarchy.
  float vignette = smoothstep(0.95, 0.25, length(centered * vec2(0.88, 1.0)));
  color.rgb *= 0.90 + vignette * 0.10;

  gl_FragColor = color;
}
`;

type GlProgram = {
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  uvBuffer: WebGLBuffer;
  texture: WebGLTexture;
  locations: {
    position: number;
    uv: number;
    coverScale: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    imageResolution: WebGLUniformLocation | null;
    pointer: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    texture: WebGLUniformLocation | null;
  };
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "Unknown shader compilation error.";
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program.");

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || "Unknown program linking error.";
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}

function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Unable to create WebGL texture.");

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}

function createProgramState(gl: WebGLRenderingContext, image: HTMLImageElement): GlProgram {
  const program = createProgram(gl);
  const positionBuffer = gl.createBuffer();
  const uvBuffer = gl.createBuffer();
  if (!positionBuffer || !uvBuffer) throw new Error("Unable to create WebGL buffers.");

  // Full-screen quad.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]),
    gl.STATIC_DRAW,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0,
    ]),
    gl.STATIC_DRAW,
  );

  const texture = createTexture(gl, image);

  const position = gl.getAttribLocation(program, "aPosition");
  const uv = gl.getAttribLocation(program, "aUv");

  return {
    program,
    positionBuffer,
    uvBuffer,
    texture,
    locations: {
      position,
      uv,
      coverScale: gl.getUniformLocation(program, "uCoverScale"),
      resolution: gl.getUniformLocation(program, "uResolution"),
      imageResolution: gl.getUniformLocation(program, "uImageResolution"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      time: gl.getUniformLocation(program, "uTime"),
      texture: gl.getUniformLocation(program, "uTexture"),
    },
  };
}

export default function ReferenceHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new Image();
    image.decoding = "async";
    image.src = referenceImage;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = media.matches;
    let raf = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let gl: WebGLRenderingContext | null = null;
    let state: GlProgram | null = null;
    let fallbackCtx: CanvasRenderingContext2D | null = null;
    let disposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));

      if (gl && state) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const updateCoverScale = () => {
      if (!gl || !state) return;
      const canvasAspect = canvas.width / Math.max(canvas.height, 1);
      const imageAspect = IMAGE_WIDTH / HERO_SOURCE_HEIGHT;
      const scaleX = canvasAspect > imageAspect ? 1 : imageAspect / canvasAspect;
      const scaleY = canvasAspect > imageAspect ? canvasAspect / imageAspect : 1;
      gl.uniform2f(state.locations.coverScale, scaleX, scaleY);
    };

    const drawFallback = (time: number) => {
      if (!fallbackCtx || !image.complete) return;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const coverScale = Math.max(width / IMAGE_WIDTH, height / HERO_SOURCE_HEIGHT);
      const drawWidth = IMAGE_WIDTH * coverScale;
      const drawHeight = HERO_SOURCE_HEIGHT * coverScale;
      const pointerOffsetX = reducedMotion ? 0 : pointerX * 8;
      const pointerOffsetY = reducedMotion ? 0 : pointerY * 6;
      const driftX = reducedMotion ? 0 : Math.sin(time * 0.00016) * 3;
      const driftY = reducedMotion ? 0 : Math.cos(time * 0.00013) * 2;

      fallbackCtx.clearRect(0, 0, width, height);
      fallbackCtx.fillStyle = "#020811";
      fallbackCtx.fillRect(0, 0, width, height);
      fallbackCtx.save();
      fallbackCtx.translate(width / 2, height / 2);
      fallbackCtx.scale(1.012, 1.012);
      fallbackCtx.translate(-width / 2, -height / 2);
      fallbackCtx.drawImage(
        image,
        0,
        NAV_CROP,
        IMAGE_WIDTH,
        HERO_SOURCE_HEIGHT,
        (width - drawWidth) / 2 + pointerOffsetX + driftX,
        (height - drawHeight) / 2 + pointerOffsetY + driftY,
        drawWidth,
        drawHeight,
      );
      fallbackCtx.restore();

      const sweepX = ((time * 0.03) % (width + 220)) - 110;
      const sweep = fallbackCtx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
      sweep.addColorStop(0, "rgba(21, 172, 255, 0)");
      sweep.addColorStop(0.5, "rgba(21, 172, 255, .035)");
      sweep.addColorStop(1, "rgba(21, 172, 255, 0)");
      fallbackCtx.fillStyle = sweep;
      fallbackCtx.fillRect(0, 0, width, height);
    };

    const render = (time: number) => {
      if (disposed) return;

      pointerX += (pointerTargetX - pointerX) * 0.045;
      pointerY += (pointerTargetY - pointerY) * 0.045;
      updateCoverScale();

      if (gl && state) {
        gl.clearColor(0.008, 0.025, 0.048, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(state.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, state.positionBuffer);
        gl.enableVertexAttribArray(state.locations.position);
        gl.vertexAttribPointer(state.locations.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, state.uvBuffer);
        gl.enableVertexAttribArray(state.locations.uv);
        gl.vertexAttribPointer(state.locations.uv, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, state.texture);
        gl.uniform1i(state.locations.texture, 0);
        gl.uniform2f(state.locations.resolution, canvas.width, canvas.height);
        gl.uniform2f(state.locations.imageResolution, IMAGE_WIDTH, HERO_SOURCE_HEIGHT);
        gl.uniform2f(state.locations.pointer, reducedMotion ? 0 : pointerX, reducedMotion ? 0 : pointerY);
        gl.uniform1f(state.locations.time, reducedMotion ? 0 : time * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        drawFallback(time);
      }

      raf = window.requestAnimationFrame(render);
    };

    const initialize = () => {
      try {
        gl = canvas.getContext("webgl", {
          antialias: true,
          alpha: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
        });

        if (gl) {
          state = createProgramState(gl, image);
          resize();
          updateCoverScale();
        } else {
          fallbackCtx = canvas.getContext("2d");
          resize();
        }
      } catch {
        gl = null;
        state = null;
        fallbackCtx = canvas.getContext("2d");
        resize();
      }

      raf = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTargetX = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      pointerTargetY = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };

    const onPointerLeave = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const onMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    const onResize = () => resize();

    image.onload = initialize;
    image.onerror = () => {
      fallbackCtx = canvas.getContext("2d");
      resize();
      raf = window.requestAnimationFrame(render);
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    media.addEventListener("change", onMotionPreference);

    if (image.complete && image.naturalWidth > 0) {
      initialize();
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", onMotionPreference);
      if (gl && state) {
        gl.deleteTexture(state.texture);
        gl.deleteBuffer(state.positionBuffer);
        gl.deleteBuffer(state.uvBuffer);
        gl.deleteProgram(state.program);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="reference-hero-scene" aria-hidden="true" />;
}
