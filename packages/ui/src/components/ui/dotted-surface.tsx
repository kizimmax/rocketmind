'use client';
import { cn } from '../../lib/utils';
import React, { useEffect, useRef } from 'react';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const cleanupRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		let cancelled = false;

		import('three').then((THREE) => {
			if (cancelled || !container) return;

			const width = container.clientWidth;
			const height = container.clientHeight;
			if (width === 0 || height === 0) return;

			const SEPARATION = 150;
			const AMOUNTX = 40;
			const AMOUNTY = 60;

			const scene = new THREE.Scene();

			const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
			camera.position.set(0, 355, 1220);
			camera.lookAt(0, 0, 0);

			const renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
			});
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(width, height);
			renderer.setClearColor(0x000000, 0);

			container.appendChild(renderer.domElement);

			const positions: number[] = [];
			const colors: number[] = [];
			const geometry = new THREE.BufferGeometry();

			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
					const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
					positions.push(x, 0, z);
					colors.push(0.78, 0.78, 0.78);
				}
			}

			geometry.setAttribute(
				'position',
				new THREE.Float32BufferAttribute(positions, 3),
			);
			geometry.setAttribute(
				'color',
				new THREE.Float32BufferAttribute(colors, 3),
			);

			const material = new THREE.PointsMaterial({
				size: 8,
				vertexColors: true,
				transparent: true,
				opacity: 0.8,
				sizeAttenuation: true,
			});

			const points = new THREE.Points(geometry, material);
			scene.add(points);

			let count = 0;
			let animationId = 0;

			const animate = () => {
				animationId = requestAnimationFrame(animate);

				const positionAttribute = geometry.attributes.position;
				const pos = positionAttribute.array as Float32Array;

				let i = 0;
				for (let ix = 0; ix < AMOUNTX; ix++) {
					for (let iy = 0; iy < AMOUNTY; iy++) {
						const index = i * 3;
						pos[index + 1] =
							Math.sin((ix + count) * 0.3) * 50 +
							Math.sin((iy + count) * 0.5) * 50;
						i++;
					}
				}

				positionAttribute.needsUpdate = true;
				renderer.render(scene, camera);
				count += 0.0333;
			};

			const handleResize = () => {
				const w = container.clientWidth;
				const h = container.clientHeight;
				if (w === 0 || h === 0) return;
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
				renderer.setSize(w, h);
			};

			window.addEventListener('resize', handleResize);
			animate();

			cleanupRef.current = () => {
				window.removeEventListener('resize', handleResize);
				cancelAnimationFrame(animationId);

				scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((mat) => mat.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				renderer.dispose();

				if (container && renderer.domElement.parentNode === container) {
					container.removeChild(renderer.domElement);
				}
			};
		});

		return () => {
			cancelled = true;
			cleanupRef.current?.();
			cleanupRef.current = null;
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0', className)}
			{...props}
		/>
	);
}
