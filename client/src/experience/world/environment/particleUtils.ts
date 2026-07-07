import * as THREE from "three";

export function createParticlePositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * radius * 0.7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * radius;
  }

  return new THREE.BufferAttribute(positions, 3);
}