(() => {
  const root = document.querySelector("[data-hero-art]");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;
  const isNarrow = () => window.matchMedia("(max-width: 820px)").matches;
  const interactive = !reduceMotion && finePointer && canHover && !isNarrow();

  const rootAttr = document.body?.dataset?.root ?? "";
  const textureUrl = `${rootAttr}images/art/hero-glass.png`;

  const canvas = document.createElement("canvas");
  canvas.className = "hero-art-canvas";
  canvas.setAttribute("aria-hidden", "true");
  root.appendChild(canvas);

  const gl =
    canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    }) ||
    canvas.getContext("experimental-webgl", { alpha: true, antialias: true });

  /* Static image fallback when WebGL unavailable */
  const showImageFallback = () => {
    root.classList.add("is-fallback");
    root.style.backgroundImage = `url("${textureUrl}")`;
    root.style.backgroundSize = "cover";
    root.style.backgroundRepeat = "no-repeat";
    root.style.backgroundPosition = "center 42%";
    root.classList.add("is-ready");
    canvas.remove();
  };

  if (!gl) {
    showImageFallback();
    return;
  }

  const vsSource = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = vec2(aPos.x * 0.5 + 0.5, aPos.y * 0.5 + 0.5);
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  /* Sample glass art texture + pointer-follow liquid refraction */
  const fsSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTex;
    uniform vec2 uRes;
    uniform vec2 uMouse;
    uniform vec2 uVel;
    uniform float uTime;
    uniform float uLiquid;
    uniform float uCover;
    uniform float uZoom;
    uniform float uYBias;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vUv;
      /* Cover-fit + zoom so glass fills more of the hero */
      float canvasAspect = uRes.x / max(uRes.y, 1.0);
      float texAspect = uCover;
      vec2 tuv = uv;
      if (canvasAspect > texAspect) {
        float h = texAspect / canvasAspect;
        tuv.y = (uv.y - 0.5) * h + 0.5;
      } else {
        float w = canvasAspect / texAspect;
        tuv.x = (uv.x - 0.5) * w + 0.5;
      }
      tuv = (tuv - 0.5) / max(uZoom, 0.01) + 0.5;
      tuv.y += uYBias;

      vec2 m = uMouse;
      float dist = distance(uv, m);
      float influence = smoothstep(0.55, 0.0, dist) * uLiquid;
      float ripple = sin(dist * 34.0 - uTime * 5.0) * 0.018
                   + sin(dist * 62.0 - uTime * 7.5) * 0.008;
      vec2 dir = normalize(uv - m + 0.0001);
      float n = noise(uv * 7.0 + uTime * 0.35);
      vec2 warp = dir * (ripple + influence * 0.05) * (0.7 + n * 0.6);
      warp += uVel * influence * 0.08;
      /* chromatic watery split */
      vec2 uvR = tuv + warp * 1.08;
      vec2 uvG = tuv + warp;
      vec2 uvB = tuv + warp * 0.92;

      vec4 cR = texture2D(uTex, uvR);
      vec4 cG = texture2D(uTex, uvG);
      vec4 cB = texture2D(uTex, uvB);
      vec4 col = vec4(cR.r, cG.g, cB.b, cG.a);

      /* Soft edge fade — keep type readable near center-top */
      float edge = smoothstep(0.0, 0.05, tuv.x) * smoothstep(1.0, 0.95, tuv.x)
                 * smoothstep(0.0, 0.08, tuv.y) * smoothstep(1.0, 0.88, tuv.y);
      /* Light dip under headline so glass stays visible around the words */
      float centerSoft = 1.0 - smoothstep(0.22, 0.62, distance(uv, vec2(0.5, 0.28))) * 0.28;
      col.a *= edge * centerSoft * (0.94 + influence * 0.06);

      /* Outside texture bounds */
      if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) {
        col.a = 0.0;
      }

      gl_FragColor = col;
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("[hero-art]", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, vsSource);
  const fs = compile(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    showImageFallback();
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    showImageFallback();
    return;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTex = gl.getUniformLocation(program, "uTex");
  const uRes = gl.getUniformLocation(program, "uRes");
  const uMouse = gl.getUniformLocation(program, "uMouse");
  const uVel = gl.getUniformLocation(program, "uVel");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uLiquid = gl.getUniformLocation(program, "uLiquid");
  const uCover = gl.getUniformLocation(program, "uCover");
  const uZoom = gl.getUniformLocation(program, "uZoom");
  const uYBias = gl.getUniformLocation(program, "uYBias");

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const texture = gl.createTexture();
  let texAspect = 2.4;
  let texReady = false;

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    texAspect = img.naturalWidth / Math.max(img.naturalHeight, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    texReady = true;
    root.classList.add("is-ready");
    kick();
  };
  img.onerror = () => showImageFallback();
  img.src = textureUrl;

  const mouse = { x: 0.5, y: 0.48, tx: 0.5, ty: 0.48 };
  const vel = { x: 0, y: 0 };
  let raf = 0;
  const start = performance.now();

  const resize = () => {
    const rect = root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const draw = (now) => {
    if (!texReady) return;
    resize();
    mouse.x += (mouse.tx - mouse.x) * 0.14;
    mouse.y += (mouse.ty - mouse.y) * 0.14;
    vel.x *= 0.88;
    vel.y *= 0.88;

    const liquid = interactive ? 1 : 0;
    const t = reduceMotion ? 0 : (now - start) * 0.001;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uTex, 0);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouse.x, 1 - mouse.y);
    gl.uniform2f(uVel, vel.x, -vel.y);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uLiquid, liquid);
    gl.uniform1f(uCover, texAspect);
    gl.uniform1f(uZoom, isNarrow() ? 1.22 : 1.55);
    gl.uniform1f(uYBias, isNarrow() ? 0.04 : 0.1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    const moving =
      interactive ||
      Math.abs(mouse.tx - mouse.x) > 0.0004 ||
      Math.abs(mouse.ty - mouse.y) > 0.0004 ||
      (!reduceMotion && document.visibilityState === "visible");

    if (moving) raf = requestAnimationFrame(draw);
    else raf = 0;
  };

  const kick = () => {
    if (!raf && texReady) raf = requestAnimationFrame(draw);
  };

  const hero = root.closest("[data-hero]") || root;
  if (interactive) {
    hero.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        const rect = root.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        vel.x += (nx - mouse.tx) * 2.2;
        vel.y += (ny - mouse.ty) * 2.2;
        mouse.tx = Math.min(1, Math.max(0, nx));
        mouse.ty = Math.min(1, Math.max(0, ny));
        kick();
      },
      { passive: true }
    );
    hero.addEventListener(
      "pointerleave",
      () => {
        mouse.tx = 0.5;
        mouse.ty = 0.48;
        kick();
      },
      { passive: true }
    );
  }

  window.addEventListener("resize", kick, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") kick();
  });
})();
