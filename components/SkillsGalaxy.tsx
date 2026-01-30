"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface SkillsGalaxyProps {
  skills: { name: string; level: number }[];
  userName: string;
}

// Color palette based on Nexus theme
const COLORS = [
  '#22d3ee', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f472b6', // Pink
  '#fbbf24', // Amber
];

function SkillNode({ position, name, level, color, index }: { position: [number, number, number], name: string, level: number, color: string, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  // Animate floating
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;

      // Gentle pulsation
      const t = state.clock.getElapsedTime();
      const scale = (level * 0.2) + Math.sin(t * 2 + index) * 0.1 + (hovered ? 0.5 : 0);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
        {/* Connection Line to Center */}

      </mesh>
      <Text
        position={[position[0], position[1] + (level * 0.3) + 1, position[2]]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        {name} ({level})
      </Text>
    </Float>
  );
}

function CentralCore({ name }: { name: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000"
      >
        {name}
      </Text>
    </group>
  )
}

function GalaxyScene({ skills, userName }: SkillsGalaxyProps) {
  // Distribute skills in a sphere around the center
  const nodes = useMemo(() => {
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    return skills.map((skill, i) => {
      const y = 1 - (i / (skills.length - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const r = 8 + (Math.random() * 4); // Distance from center
      const x = Math.cos(theta) * radius * r;
      const z = Math.sin(theta) * radius * r;

      return {
        ...skill,
        position: [x, y * r, z] as [number, number, number],
        color: COLORS[i % COLORS.length]
      };
    });
  }, [skills]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <CentralCore name={userName} />

      {nodes.map((node, i) => (
        <group key={i}>
          {/* Draw line to center */}
          <line>
            <bufferGeometry attach="geometry" onUpdate={geo => {
              geo.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node.position)])
            }} />
            <lineBasicMaterial attach="material" color={node.color} opacity={0.3} transparent />
          </line>
          <SkillNode
            index={i}
            position={node.position}
            name={node.name}
            level={node.level}
            color={node.color}
          />
        </group>
      ))}

      <OrbitControls autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function SkillsGalaxy({ skills, userName }: SkillsGalaxyProps) {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden bg-black/40 border border-white/10 relative">
      <div className="absolute top-4 left-4 z-10 bg-black/60 p-2 rounded-lg backdrop-blur-md">
        <h3 className="text-white text-xs font-bold uppercase tracking-wider">3D Skill Matrix</h3>
        <p className="text-gray-400 text-[10px]">Interactive Visualization</p>
      </div>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <GalaxyScene skills={skills} userName={userName} />
      </Canvas>
    </div>
  );
}
