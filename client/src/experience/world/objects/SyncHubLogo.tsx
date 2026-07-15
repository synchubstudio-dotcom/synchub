"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import GlassMaterial from "../materials/GlassMaterial";

interface RibbonFrameData {
  points: THREE.Vector3[];
  normalsU: THREE.Vector3[];
  normalsV: THREE.Vector3[];
}

function getRibbonFrameData(
  scale = 4.0,
  A = 0.6,
  B = 1.2,
  segments = 300
): RibbonFrameData {
  const points: THREE.Vector3[] = [];
  const tangents: THREE.Vector3[] = [];
  const normalsU: THREE.Vector3[] = [];
  const normalsV: THREE.Vector3[] = [];

  // 1. Generate points along the waving lemniscate curve in XY vertical plane with Z depth height
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;

    // Lemniscate of Bernoulli in XY plane (standing vertical facing camera)
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const x = (scale * Math.cos(t)) / denom;
    const y = (scale * Math.sin(t) * Math.cos(t)) / denom;
    
    // Waving height in Z (centered depth)
    const z = A * Math.sin(t) + B * Math.cos(2 * t) + A * 0.5;

    points.push(new THREE.Vector3(x, y, z));
  }

  // 2. Generate tangents and local frames (Tangent, Normal U, Normal V)
  for (let i = 0; i <= segments; i++) {
    const prev = points[i === 0 ? segments - 1 : i - 1];
    const next = points[i === segments ? 1 : i + 1];
    const tangent = new THREE.Vector3().subVectors(next, prev).normalize();
    tangents.push(tangent);

    // Normal U: vector perpendicular to tangent in XY plane (T x depth axis)
    const u = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1)).normalize();
    
    // Normal V: binormal vector pointing along Z depth axis (U x Tangent)
    const v = new THREE.Vector3().crossVectors(u, tangent).normalize();

    normalsU.push(u);
    normalsV.push(v);
  }

  return { points, normalsU, normalsV };
}

function buildInitialGeometry(
  frameData: RibbonFrameData,
  segments = 300
) {
  const vertices = new Float32Array((segments + 1) * 4 * 3);
  const normals = new Float32Array((segments + 1) * 4 * 3);
  const uvs = new Float32Array((segments + 1) * 4 * 2);
  const indices: number[] = [];

  // Generate UVs (U maps along the curve, V maps across the cross-section faces)
  for (let i = 0; i <= segments; i++) {
    const uCoord = i / segments;
    const uvOffset = i * 8;
    uvs[uvOffset + 0] = uCoord; uvs[uvOffset + 1] = 0.0;
    uvs[uvOffset + 2] = uCoord; uvs[uvOffset + 3] = 0.33;
    uvs[uvOffset + 4] = uCoord; uvs[uvOffset + 5] = 0.66;
    uvs[uvOffset + 6] = uCoord; uvs[uvOffset + 7] = 1.0;
  }

  // Generate indices for quad strip faces (8 triangles per segment)
  for (let i = 0; i < segments; i++) {
    const currIdx = i * 4;
    const nextIdx = (i + 1) * 4;

    // Face 1: Top (c1 -> c2)
    indices.push(currIdx + 0, currIdx + 1, nextIdx + 1);
    indices.push(currIdx + 0, nextIdx + 1, nextIdx + 0);

    // Face 2: Left/Inner (c2 -> c3)
    indices.push(currIdx + 1, currIdx + 2, nextIdx + 2);
    indices.push(currIdx + 1, nextIdx + 2, nextIdx + 1);

    // Face 3: Bottom (c3 -> c4)
    indices.push(currIdx + 2, currIdx + 3, nextIdx + 3);
    indices.push(currIdx + 2, nextIdx + 3, nextIdx + 2);

    // Face 4: Right/Outer (c4 -> c1)
    indices.push(currIdx + 3, currIdx + 0, nextIdx + 0);
    indices.push(currIdx + 3, nextIdx + 0, nextIdx + 3);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geom.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(indices);

  // Set large static bounds once so frustum culling doesn't cull the moving ribbon,
  // and we never have to run computeBoundingBox/Sphere on the CPU in the render loop.
  geom.boundingBox = new THREE.Box3(
    new THREE.Vector3(-6, -6, -6),
    new THREE.Vector3(6, 6, 6)
  );
  geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 6);

  return geom;
}

// Pre-allocate temporary vector objects to avoid garbage collection/memory churn in the render loop
const _W = new THREE.Vector3();
const _H = new THREE.Vector3();
const _c1 = new THREE.Vector3();
const _c2 = new THREE.Vector3();
const _c3 = new THREE.Vector3();
const _c4 = new THREE.Vector3();
const _n1 = new THREE.Vector3();
const _n2 = new THREE.Vector3();
const _n3 = new THREE.Vector3();
const _n4 = new THREE.Vector3();

function updateGeometryData(
  geometry: THREE.BufferGeometry,
  frameData: RibbonFrameData,
  twistOffset: number,
  squeezeOffset: number,
  baseWidth = 1.1,
  baseThickness = 0.18,
  squeezeFrequency = 4.0,
  squeezeAmount = 0.2,
  segments = 300
) {
  const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
  const normalAttribute = geometry.getAttribute("normal") as THREE.BufferAttribute;

  const positions = positionAttribute.array as Float32Array;
  const normals = normalAttribute.array as Float32Array;

  const { points, normalsU, normalsV } = frameData;

  for (let i = 0; i <= segments; i++) {
    const p = points[i];
    const u = normalsU[i];
    const v = normalsV[i];
    const t_curve = (i / segments) * Math.PI * 2;

    // Twist angle: standing vertical at ends, flat horizontal at center, twisting slowly over time
    const theta = Math.PI * 0.5 - t_curve + twistOffset;

    // Squeezing wave (organic volume-preserving compression and stretching along the path)
    const squeezeWave = Math.sin(t_curve * squeezeFrequency - squeezeOffset);
    const currentWidth = baseWidth * (1.0 + squeezeWave * squeezeAmount);
    const currentThickness = baseThickness * (1.0 - squeezeWave * squeezeAmount);

    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    // Width (W) and Thickness (H) vectors rotated by theta
    _W.set(0, 0, 0)
      .addScaledVector(u, cosTheta)
      .addScaledVector(v, sinTheta)
      .normalize();

    _H.set(0, 0, 0)
      .addScaledVector(u, -sinTheta)
      .addScaledVector(v, cosTheta)
      .normalize();

    // 4 corners of the cross-section (displacedP used as origin)
    const wHalf = currentWidth * 0.5;
    const hHalf = currentThickness * 0.5;

    _c1.copy(p).addScaledVector(_W, wHalf).addScaledVector(_H, hHalf);
    _c2.copy(p).addScaledVector(_W, -wHalf).addScaledVector(_H, hHalf);
    _c3.copy(p).addScaledVector(_W, -wHalf).addScaledVector(_H, -hHalf);
    _c4.copy(p).addScaledVector(_W, wHalf).addScaledVector(_H, -hHalf);

    // Write positions into the buffer attribute array
    const posOffset = i * 12;
    positions[posOffset + 0] = _c1.x;
    positions[posOffset + 1] = _c1.y;
    positions[posOffset + 2] = _c1.z;

    positions[posOffset + 3] = _c2.x;
    positions[posOffset + 4] = _c2.y;
    positions[posOffset + 5] = _c2.z;

    positions[posOffset + 6] = _c3.x;
    positions[posOffset + 7] = _c3.y;
    positions[posOffset + 8] = _c3.z;

    positions[posOffset + 9] = _c4.x;
    positions[posOffset + 10] = _c4.y;
    positions[posOffset + 11] = _c4.z;

    // Approximate normals for each corner
    _n1.addVectors(_W, _H).normalize();
    _n2.subVectors(_H, _W).normalize(); // -W + H
    _n3.addVectors(_W, _H).negate().normalize(); // -W - H
    _n4.subVectors(_W, _H).normalize(); // W - H

    // Write normals into the buffer attribute array
    normals[posOffset + 0] = _n1.x;
    normals[posOffset + 1] = _n1.y;
    normals[posOffset + 2] = _n1.z;

    normals[posOffset + 3] = _n2.x;
    normals[posOffset + 4] = _n2.y;
    normals[posOffset + 5] = _n2.z;

    normals[posOffset + 6] = _n3.x;
    normals[posOffset + 7] = _n3.y;
    normals[posOffset + 8] = _n3.z;

    normals[posOffset + 9] = _n4.x;
    normals[posOffset + 10] = _n4.y;
    normals[posOffset + 11] = _n4.z;
  }

  positionAttribute.needsUpdate = true;
  normalAttribute.needsUpdate = true;
}

export default function SyncHubLogo() {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const introTime = useRef(0);

  useEffect(() => {
    // Reset intro complete state on mount to ensure we hide the navbar during the starting zoom-out
    useExperienceStore.getState().setIntroComplete(false);

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1 (matching Three.js state.pointer)
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Statically compute the points and local frames along the lemniscate
  const frameData = useMemo(() => {
    return getRibbonFrameData();
  }, []);

  // Initialize the geometry buffer structure
  const geometry = useMemo(() => {
    return buildInitialGeometry(frameData);
  }, [frameData]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);

    // Automatic intro zoom timer (completes in 2.0 seconds)
    const introDuration = 2.0;
    if (introTime.current < introDuration) {
      introTime.current += dt;
    }
    const introProgress = Math.min(1.0, introTime.current / introDuration);
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(introProgress);
    const localIntroComplete = introTime.current >= introDuration;
    if (localIntroComplete && !useExperienceStore.getState().isIntroComplete) {
      useExperienceStore.getState().setIntroComplete(true);
    }

    // Update geometry dynamically on the CPU with a slower, gentler wringing and squeezing effect
    updateGeometryData(
      geometry,
      frameData,
      t * 0.15, // Slower, elegant twist (wringing)
      t * 0.35, // Slower wave propagation (squeezing)
      1.1,      // Base ribbon width
      0.18,     // Base ribbon thickness
      3.0,      // Squeezing wave frequency along the loop (fewer waves = smoother)
      0.10,     // Subtle squeeze deformation amount (up to 10% instead of 20% to prevent wonky distortions)
      300       // Segments
    );

    // Determine if logo is visible and active on screen
    const sp = useExperienceStore.getState().scrollProgress;

    // Slow, low-amplitude rocking and floating animation (low and slow)
    const baseRotY = Math.sin(t * 0.15) * 0.12;
    const baseRotX = Math.cos(t * 0.18) * 0.06;
    const baseRotZ = Math.sin(t * 0.12) * 0.04;
    const basePosY = Math.sin(t * 0.22) * 0.05;

    // Global Quadrant Avoidance/Push-away logic (tracks pointer globally via window - minimal micro-displacement):
    // Slide position to the opposite side of the cursor (ultra-subtle micro-slide)
    const targetPosX = -mouse.current.x * 0.06; // ultra-subtle left-right slide
    const targetPosY = -mouse.current.y * 0.04; // ultra-subtle up-down slide

    // Tilt rotation away from the cursor (ultra-subtle push-tilt effect)
    const targetTiltX = mouse.current.y * 0.02;  // ultra-subtle X tilt
    const targetTiltY = -mouse.current.x * 0.03; // ultra-subtle Y tilt

    // Damp positions and rotations using LERP for smooth organic transitions
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetPosX, dt * 6.0);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, basePosY + targetPosY, dt * 6.0);

    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, baseRotX + targetTiltX, dt * 6.0);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, baseRotY + targetTiltY, dt * 6.0);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, baseRotZ, dt * 6.0);

    // Reusing the scrollProgress variable (sp) declared at the beginning of useFrame hook

    let targetScale = 0.5;
    let targetOpacity = 1.0;

    if (!localIntroComplete) {
      // Automatic zoom-out transition on page load (from close-up 20.0 down to 0.5)
      targetScale = 20.0 - easedProgress * 19.5;
      targetOpacity = 1.0;
    } else {
      // Normal scroll progress layout once intro is complete
      if (sp < 3.0) {
        targetScale = 0.5;
        targetOpacity = 1.0;
      } else if (sp >= 3.0 && sp < 4.0) {
        const p = sp - 3.0;
        targetScale = 0.5 + p * 19.5; // Zoom out / scale up to 20
        targetOpacity = Math.max(0.0, 1.0 - p); // Fade out to 0.0
      } else {
        targetScale = 20.0;
        targetOpacity = 0.0;
      }
    }

    // Set current layout scale
    group.current.scale.setScalar(targetScale);

    if (materialRef.current) {
      materialRef.current.opacity = targetOpacity;
      materialRef.current.visible = targetOpacity > 0.001;
    }
  });

  return (
    <group>
      {/* Dynamic Group that scales and rotates */}
      <group ref={group} scale={0.5}>
        <mesh
          geometry={geometry}
          castShadow
          receiveShadow
        >
          <GlassMaterial ref={materialRef} />
        </mesh>
      </group>
    </group>
  );
}
