"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform sampler2D u_text_texture;
uniform float u_time;
uniform float u_circleSize;
uniform float u_effect_active;
uniform float u_gradient_strength;

// Pseudo-random hash
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// 2D Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
    vec2 uv = v_texcoord;
    
    // Map mouse position to [0, 1] UV space
    vec2 normMouse = u_mouse / (u_resolution / u_pixelRatio);
    normMouse.y = 1.0 - normMouse.y;

    // Aspect ratio correction for circular mouse interaction
    float aspect = u_resolution.x / u_resolution.y;
    vec2 distVec = (uv - normMouse);
    distVec.x *= aspect;
    float dist = length(distVec);

    // Hover spotlight radius
    float radius = u_circleSize; // e.g. 0.15
    
    // Calculate the hover circle spotlight strength (sdfCircle)
    // Fades out smoothly from 1.0 at center to 0.0 at radius + 0.35
    float sdfCircle = 1.0 - smoothstep(0.0, radius + 0.35, dist);
    
    // Morphing warp offset using noise and time (similar to wiggling in reactbits)
    float n = noise(uv * 12.0 + u_time * 2.0);
    vec2 warp = vec2(
        cos(u_time * 2.5 + uv.y * 10.0 + n * 4.0),
        sin(u_time * 2.5 + uv.x * 10.0 + n * 4.0)
    ) * 0.012; // Wiggle offset amplitude

    // Set warp strength based on hover distance and active strength
    float warpStrength = sdfCircle * u_effect_active;
    
    // Calculate mipmap bias for a perfectly smooth, ghost-free blur on hover
    float bias = sdfCircle * 3.5 * u_effect_active;
    
    // Sample the text texture with the warp and mipmap bias (NO offset loop, NO ghosting!)
    vec2 sampleUV = uv + warp * warpStrength;
    sampleUV = clamp(sampleUV, vec2(0.001), vec2(0.999));
    vec4 textCol = texture2D(u_text_texture, sampleUV, bias);

    // Blend between solid white and gradient color based on u_gradient_strength
    vec3 flatColor = vec3(0.98, 0.98, 0.98); 
    vec3 finalColor = mix(flatColor, textCol.rgb, u_gradient_strength);
    
    // Make hovered/wiggling parts slightly brighter for a premium glow
    if (sdfCircle > 0.0) {
        finalColor = mix(finalColor, vec3(1.0), sdfCircle * 0.3);
    }
    
    float alpha = textCol.a;
    if (sdfCircle > 0.0) {
        alpha = mix(alpha, min(1.0, alpha * 1.25), sdfCircle);
    }
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

interface ShapeBlurProps {
  className?: string;
  circleSize?: number;
  effectActive?: number;
  gradientStrength?: number;
}

export default function ShapeBlur({
  className = "",
  circleSize = 0.2,
  effectActive = 0.0,
  gradientStrength = 0.0,
}: ShapeBlurProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const effectActiveRef = useRef(effectActive);
  const gradientStrengthRef = useRef(gradientStrength);

  useEffect(() => {
    effectActiveRef.current = effectActive;
  }, [effectActive]);

  useEffect(() => {
    gradientStrengthRef.current = gradientStrength;
  }, [gradientStrength]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let active = true;
    let animationFrameId: number;
    let time = 0;
    let lastTime = 0;

    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const vResolution = new THREE.Vector2();

    let w = 1;
    let h = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const geo = new THREE.PlaneGeometry(1, 1);
    
    // Create empty initial texture
    const initialCanvas = document.createElement("canvas");
    initialCanvas.width = 1024;
    initialCanvas.height = 256;
    const textTexture = new THREE.CanvasTexture(initialCanvas);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: 1.5 },
        u_text_texture: { value: textTexture },
        u_time: { value: 0 },
        u_circleSize: { value: circleSize },
        u_effect_active: { value: effectActiveRef.current },
        u_gradient_strength: { value: gradientStrengthRef.current },
      },
      transparent: true,
    });

    const quad = new THREE.Mesh(geo, material);
    scene.add(quad);

    const initTexture = () => {
      const fillCanvas = document.createElement("canvas");
      fillCanvas.width = 1024;
      fillCanvas.height = 256;
      const fillCtx = fillCanvas.getContext("2d");
      if (fillCtx) {
        // Draw the text using a vertical gradient from white (top) to charcoal/black (bottom)
        const grad = fillCtx.createLinearGradient(0, 60, 0, 196);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.55, "#808080");
        grad.addColorStop(1, "#121212");
        
        fillCtx.fillStyle = grad;
        fillCtx.font = "bold 120px Noorliza, sans-serif";
        fillCtx.textAlign = "center";
        fillCtx.textBaseline = "middle";
        fillCtx.fillText("SyncHub", 512, 128);
      }
      const fillTexture = new THREE.CanvasTexture(fillCanvas);
      material.uniforms.u_text_texture.value = fillTexture;
      material.uniforms.u_text_texture.value.needsUpdate = true;
    };

    // Load font texture
    if (document.fonts) {
      document.fonts.ready.then(() => {
        initTexture();
      });
    } else {
      setTimeout(initTexture, 200);
    }

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const scaleX = rect.width / (mount.clientWidth || 1);
      const scaleY = rect.height / (mount.clientHeight || 1);
      vMouse.set(
        (e.clientX - rect.left) / scaleX,
        (e.clientY - rect.top) / scaleY
      );
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      if (!active || !mount) return;
      w = mount.clientWidth;
      h = mount.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);

      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);

      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      quad.scale.set(w, h, 1);
      vResolution.set(w, h).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };

    resize();
    window.addEventListener("resize", resize);

    const ro = new ResizeObserver(() => {
      if (!active) return;
      resize();
    });
    ro.observe(mount);

    const update = () => {
      if (!active) return;
      time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;
      
      vMouseDamp.x = vMouse.x;
      vMouseDamp.y = vMouse.y;
      material.uniforms.u_time.value = time;
      material.uniforms.u_effect_active.value = effectActiveRef.current;
      material.uniforms.u_gradient_strength.value = gradientStrengthRef.current;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      active = false;

      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      if (mount) {
        mount.innerHTML = "";
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [circleSize]);

  return <div className={className} ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
