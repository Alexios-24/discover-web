"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const PARTICLE_COUNT = 50000;
const BG_COLOR = 0x030305;

const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uPointScale;

  attribute vec3 aRandom;
  attribute float aIndex;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vMouseProximity;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 getPosSphere(float idx) {
    float phi = acos(-1.0 + (2.0 * idx) / ${PARTICLE_COUNT}.0);
    float theta = sqrt(${PARTICLE_COUNT}.0 * 3.1415926) * phi;
    float r = 14.0 + aRandom.x * 3.0;
    return vec3(r * sin(phi) * cos(theta), r * sin(phi) * sin(theta), r * cos(phi));
  }

  void main() {
    float t = uTime * 0.15;

    vec3 noiseBase = vec3(
      snoise(vec3(aIndex * 0.01, t * 0.2, 0.0)),
      snoise(vec3(aIndex * 0.01, 0.0, t * 0.2)),
      snoise(vec3(0.0, aIndex * 0.01, t * 0.2))
    );

    vec3 pos = getPosSphere(aIndex) + noiseBase * 4.0;

    if (uMouse.x > -90.0) {
      float d = distance(pos, uMouse);
      float scatter = smoothstep(6.0, 0.0, d);
      pos += normalize(pos - uMouse) * scatter * 1.2;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.5 + aRandom.y * 2.0) * (30.0 / -mvPosition.z) * uPointScale;
    gl_Position = projectionMatrix * mvPosition;

    float depthFade = smoothstep(60.0, 10.0, -mvPosition.z);
    vAlpha = depthFade * (0.2 + aRandom.z * 0.6);
    vColor = pos;
    vMouseProximity = 0.0;
  }
`;

const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vMouseProximity;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.5);

    vec3 col = mix(uColor1, uColor2, smoothstep(-20.0, 20.0, vColor.x + vColor.y));
    gl_FragColor = vec4(col, vAlpha * glow);
  }
`;

const outputShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uRGBShift: { value: 0.002 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uRGBShift;
    varying vec2 vUv;

    float random(vec2 p) {
      return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      float dist = distance(uv, vec2(0.5));
      vec2 offset = (uv - 0.5) * dist * uRGBShift;

      float r = texture2D(tDiffuse, uv + offset).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - offset).b;

      vec3 color = vec3(r, g, b);
      float noise = (random(uv + uTime) - 0.5) * 0.04;
      color += noise;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export function ParticleCanvas({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vw = window.innerWidth;
    const isMobile = vw < 768;

    const particleCount = isMobile ? 25000 : PARTICLE_COUNT;
    const cameraZ = isMobile ? 40 : 28;

    // Renderer — use pixelRatio 1 so particle density is DPR-independent
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: true,
    });
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG_COLOR, 0.02);
    scene.background = new THREE.Color(BG_COLOR);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      200,
    );
    camera.position.z = cameraZ;

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = 0.15;
    bloomPass.strength = 0.85;
    bloomPass.radius = 0.7;
    composer.addPass(bloomPass);

    const finalPass = new ShaderPass(outputShader);
    composer.addPass(finalPass);

    // Particle geometry
    const geometry = new THREE.BufferGeometry();
    const indices = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      indices[i] = i;
      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3).fill(0), 3),
    );
    geometry.setAttribute("aIndex", new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));

    // Inject actual count into shaders
    const vertSrc = particleVertexShader.replaceAll(
      `${PARTICLE_COUNT}.0`,
      `${particleCount}.0`,
    );

    const REF_WIDTH = 1440;
    const pointScale = isMobile ? 1.0 : REF_WIDTH / Math.max(vw, REF_WIDTH);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(-100, 0, 0) },
        uColor1: { value: new THREE.Color("#818cf8") },
        uColor2: { value: new THREE.Color("#2dd4bf") },
        uPointScale: { value: pointScale },
      },
      vertexShader: vertSrc,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse state
    const mouseTarget = new THREE.Vector3(-100, 0, 0);
    const mouseSmooth = new THREE.Vector3(-100, 0, 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const isOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (isOutside) {
        mouseTarget.set(-100, 0, 0);
        return;
      }

      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseTarget.set(x * 20, y * 12, 12);
    };
    const onMouseLeave = () => {
      mouseTarget.set(-100, 0, 0);
    };

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation
    const clock = new THREE.Clock();
    let time = 0;
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      material.uniforms.uTime.value = time;
      finalPass.uniforms.uTime.value = time;

      // Smooth mouse lerp
      mouseSmooth.lerp(mouseTarget, 0.12);
      material.uniforms.uMouse.value.copy(mouseSmooth);

      // Camera sway
      const zTarget = cameraZ + Math.sin(time * 0.5) * 2;
      camera.position.z += (zTarget - camera.position.z) * 0.02;
      camera.position.x = Math.sin(time * 0.2) * 2;
      camera.position.y = Math.cos(time * 0.15) * 2;
      camera.lookAt(0, 0, 0);

      composer.render();
    };

    animate();

    cleanupRef.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    return () => cleanupRef.current?.();
  }, []);

  return <div ref={containerRef} className={className} />;
}
