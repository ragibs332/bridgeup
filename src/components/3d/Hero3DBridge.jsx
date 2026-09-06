import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DBridge({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for entire 3D Bridge world
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Bridge Roadway (Curved Deck)
    const deckCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, -2, -4),
      new THREE.Vector3(-6, 0.5, -1),
      new THREE.Vector3(0, 1.2, 0),
      new THREE.Vector3(6, 0.5, 1),
      new THREE.Vector3(12, -2, 4)
    ]);
    const deckGeometry = new THREE.TubeGeometry(deckCurve, 64, 0.6, 8, false);
    const deckMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d5c5b,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x083e3d,
      emissiveIntensity: 0.3
    });
    const deckMesh = new THREE.Mesh(deckGeometry, deckMaterial);
    worldGroup.add(deckMesh);

    // 2. Glowing Bridge Arch Cables
    const archCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, -2, -4.5),
      new THREE.Vector3(-6, 4.5, -1.2),
      new THREE.Vector3(0, 6.2, 0),
      new THREE.Vector3(6, 4.5, 1.2),
      new THREE.Vector3(12, -2, 4.5)
    ]);
    const archGeometry = new THREE.TubeGeometry(archCurve1, 64, 0.15, 8, false);
    const archMaterial = new THREE.MeshStandardMaterial({
      color: 0x48c9b0,
      emissive: 0x2dd4bf,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const archMesh = new THREE.Mesh(archGeometry, archMaterial);
    worldGroup.add(archMesh);

    // Parallel Second Arch Cable
    const archCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, -2, -3.5),
      new THREE.Vector3(-6, 4.5, -0.8),
      new THREE.Vector3(0, 6.2, 0),
      new THREE.Vector3(6, 4.5, 0.8),
      new THREE.Vector3(12, -2, 3.5)
    ]);
    const archMesh2 = new THREE.Mesh(
      new THREE.TubeGeometry(archCurve2, 64, 0.15, 8, false),
      archMaterial
    );
    worldGroup.add(archMesh2);

    // 3. Vertical Suspension Cables (Harp Strings)
    const cableCount = 18;
    for (let i = 1; i < cableCount; i++) {
      const t = i / cableCount;
      const ptDeck = deckCurve.getPoint(t);
      const ptArch = archCurve1.getPoint(t);

      const cableGeo = new THREE.CylinderGeometry(0.04, 0.04, ptArch.y - ptDeck.y, 6);
      const cableMat = new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.6 });
      const cable = new THREE.Mesh(cableGeo, cableMat);
      cable.position.set(ptDeck.x, (ptArch.y + ptDeck.y) / 2, ptDeck.z);
      worldGroup.add(cable);
    }

    // 4. Central Rising Star / Heart Emblem (Warm Amber 3D Icosahedron & Ring)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 3.8, 0);

    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Orbiting 3D Ring around Core
    const ringGeo = new THREE.TorusGeometry(2.2, 0.06, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x48c9b0,
      emissive: 0x2dd4bf,
      emissiveIntensity: 0.6,
      metalness: 0.9
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.04, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.7 })
    );
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = -Math.PI / 6;
    coreGroup.add(ringMesh2);

    worldGroup.add(coreGroup);

    // 5. 3D Floating Community Particles (Citizens, NGOs, Donors)
    const particleCount = 70;
    const particleGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const particleMat1 = new THREE.MeshStandardMaterial({
      color: 0x48c9b0,
      emissive: 0x48c9b0,
      emissiveIntensity: 1
    });
    const particleMat2 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 1
    });

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const mat = i % 2 === 0 ? particleMat1 : particleMat2;
      const particle = new THREE.Mesh(particleGeo, mat);
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 8;
      const y = -2 + Math.random() * 8;

      particle.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * (radius * 0.6)
      );

      particle.userData = {
        speed: 0.003 + Math.random() * 0.008,
        radius: radius,
        angle: angle,
        yBase: y,
        yOffset: Math.random() * Math.PI * 2
      };

      worldGroup.add(particle);
      particles.push(particle);
    }

    // 6. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x48c9b0, 2.5);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 2.0);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x2dd4bf, 3, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop using performance.now()
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth damping rotation based on mouse
      worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.05;
      worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.05;

      // Subtle continuous float
      worldGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.35;

      // Core rotation
      coreMesh.rotation.y = elapsedTime * 0.8;
      coreMesh.rotation.x = elapsedTime * 0.4;
      ringMesh1.rotation.z = elapsedTime * 0.6;
      ringMesh2.rotation.z = -elapsedTime * 0.5;

      // Particle orbiting animation
      particles.forEach((p) => {
        p.userData.angle += p.userData.speed;
        p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
        p.position.z = Math.sin(p.userData.angle) * (p.userData.radius * 0.65);
        p.position.y = p.userData.yBase + Math.sin(elapsedTime * 2 + p.userData.yOffset) * 0.4;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[480px] overflow-hidden ${className}`}
    />
  );
}
