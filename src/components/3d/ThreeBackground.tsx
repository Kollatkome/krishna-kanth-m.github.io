import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check device capability
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return; // Respect accessibility
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    currentMount.appendChild(renderer.domElement);

    // Particle field
    const particleCount = isMobile ? 350 : 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorBright = new THREE.Color('#ffffff');   // pure white
    const colorMid    = new THREE.Color('#a3a3a3');   // medium grey
    const colorDim    = new THREE.Color('#525252');   // dark grey

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const randomChoice = Math.random();
      const chosenColor = randomChoice > 0.6 ? colorBright : randomChoice > 0.25 ? colorMid : colorDim;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle ambient geometry
    const icosahedronGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05
    });
    const polyMesh = new THREE.Mesh(icosahedronGeo, wireframeMat);
    polyMesh.position.set(4, -1, -2);
    scene.add(polyMesh);

    // Animation & Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.rotation.y = elapsedTime * 0.03 + targetX * 0.4;
      particles.rotation.x = elapsedTime * 0.015 - targetY * 0.4;

      polyMesh.rotation.x = elapsedTime * 0.05;
      polyMesh.rotation.y = elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      icosahedronGeo.dispose();
      wireframeMat.dispose();
      renderer.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        aria-hidden="true" 
      />

      {/* Ambient Glowing Mesh Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-36 -left-36 w-[560px] h-[560px] blob-violet rounded-full blur-3xl animate-blob opacity-70" />
        <div className="absolute top-1/3 -right-40 w-[620px] h-[620px] blob-indigo rounded-full blur-3xl animate-blob-slow opacity-60" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 left-1/4 w-[520px] h-[520px] blob-cyan rounded-full blur-3xl animate-blob opacity-50" style={{ animationDelay: '6s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-45" />
      </div>
    </>
  );
};
