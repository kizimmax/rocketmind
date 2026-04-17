"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "../../lib/utils";

export interface WaveAnimationProps {
  /** Fixed width in px. If omitted, the component fills the parent container. */
  width?: number;
  /** Fixed height in px. If omitted, the component fills the parent container. */
  height?: number;
  pointSize?: number;
  waveSpeed?: number;
  waveIntensity?: number;
  particleColor?: string;
  gridDistance?: number;
  /** Depth (distance from camera) where fade starts. Default 20. */
  fadeNear?: number;
  /** Depth where fade reaches 0. Default 200. */
  fadeFar?: number;
  className?: string;
}

export function WaveAnimation({
  width,
  height,
  pointSize = 1.5,
  waveSpeed = 2.0,
  waveIntensity = 8.0,
  particleColor = "#ffffff",
  gridDistance = 5,
  fadeNear = 20,
  fadeFar = 200,
  className,
}: WaveAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fixed = typeof width === "number" && typeof height === "number";
    const initialW = fixed ? (width as number) : container.clientWidth || 1;
    const initialH = fixed ? (height as number) : container.clientHeight || 1;

    const fov = 60;
    const dpr = window.devicePixelRatio;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(initialW, initialH);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, initialW / initialH, 1, 4000);
    camera.position.set(0, 0, 10);

    const geo = new THREE.BufferGeometry();

    const buildPositions = (w: number, h: number) => {
      const positions: number[] = [];
      const gridWidth = 400 * (w / h);
      const depth = 400;
      for (let x = 0; x < gridWidth; x += gridDistance) {
        for (let z = 0; z < depth; z += gridDistance) {
          positions.push(-gridWidth / 2 + x, -30, -depth / 2 + z);
        }
      }
      return new THREE.Float32BufferAttribute(positions, 3);
    };

    geo.setAttribute("position", buildPositions(initialW, initialH));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        u_time: { value: 0.0 },
        u_point_size: { value: pointSize },
        u_color: { value: new THREE.Color(particleColor) },
        u_fade_near: { value: fadeNear },
        u_fade_far: { value: fadeFar },
      },
      vertexShader: `
        #define M_PI 3.1415926535897932384626433832795
        precision mediump float;
        uniform float u_time;
        uniform float u_point_size;
        uniform float u_fade_near;
        uniform float u_fade_far;
        varying float v_alpha;

        void main() {
          vec3 p = position;
          p.y += (
            cos(p.x / M_PI * ${waveIntensity.toFixed(1)} + u_time * ${waveSpeed.toFixed(1)}) +
            sin(p.z / M_PI * ${waveIntensity.toFixed(1)} + u_time * ${waveSpeed.toFixed(1)})
          );
          vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
          float depth = -mvPos.z;
          v_alpha = 1.0 - smoothstep(u_fade_near, u_fade_far, depth);
          gl_PointSize = u_point_size;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform vec3 u_color;
        varying float v_alpha;
        void main() {
          gl_FragColor = vec4(u_color, v_alpha);
        }
      `,
    });

    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animationId = 0;

    const render = () => {
      mat.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };
    render();

    const resize = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const next = buildPositions(w, h);
      geo.setAttribute("position", next);
      geo.attributes.position.needsUpdate = true;
    };

    let observer: ResizeObserver | null = null;
    const onWindowResize = () => {
      resize(window.innerWidth, window.innerHeight);
    };

    if (!fixed) {
      observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width: w, height: h } = entry.contentRect;
        resize(w, h);
      });
      observer.observe(container);
    } else if (!width && !height) {
      window.addEventListener("resize", onWindowResize);
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", onWindowResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, [
    width,
    height,
    pointSize,
    waveSpeed,
    waveIntensity,
    particleColor,
    gridDistance,
    fadeNear,
    fadeFar,
  ]);

  const hasFixedSize = typeof width === "number" && typeof height === "number";

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      style={
        hasFixedSize
          ? { width, height }
          : { width: "100%", height: "100%" }
      }
    />
  );
}
