// ==============================================================================
// SANSKRITVERSE 3D Interactive Sanskrit Knowledge Tree
// Built with Three.js, React Three Fiber & Drei
// ==============================================================================

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { PageView } from '../../types';

interface Node3DProps {
  position: [number, number, number];
  color: string;
  titleSanskrit: string;
  titleEnglish: string;
  view: PageView;
}

const BranchNode3D: React.FC<Node3DProps> = ({ position, color, titleSanskrit, titleEnglish, view }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { navigateTo } = useAppStore();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group position={position}>
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(view);
          }}
          scale={hovered ? 1.3 : 1.0}
        >
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.9 : 0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Outer Orbiting Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.02, 16, 64]} />
          <meshBasicMaterial color={color} opacity={0.6} transparent />
        </mesh>

        {/* 3D HTML Label */}
        <Html distanceFactor={8} position={[0, -0.65, 0]} center>
          <div
            onClick={() => navigateTo(view)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold select-none transition-all duration-200 pointer-events-auto cursor-pointer ${
              hovered
                ? 'bg-amber-500 text-black shadow-gold-glow scale-110'
                : 'bg-black/70 backdrop-blur-md text-amber-200 border border-amber-500/30'
            }`}
          >
            <div className="text-[13px] font-bold font-sanskrit text-center">{titleSanskrit}</div>
            <div className="text-[10px] opacity-80 text-center">{titleEnglish}</div>
          </div>
        </Html>
      </Float>
    </group>
  );
};

const TreeTrunk: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.3;
      ringRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Gyroscope Rings */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.35, 0.03, 16, 100]} />
        <meshStandardMaterial color="#FDE047" emissive="#F59E0B" emissiveIntensity={0.7} />
      </mesh>

      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.65, 0.025, 16, 100]} />
        <meshBasicMaterial color="#8B5CF6" opacity={0.5} transparent />
      </mesh>

      {/* Center Label */}
      <Html distanceFactor={7} position={[0, 0, 0]} center>
        <div className="text-center select-none pointer-events-none">
          <div className="text-2xl font-bold font-sanskrit text-amber-200 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
            ज्ञानवृक्षः
          </div>
          <div className="text-[9px] uppercase tracking-widest text-amber-400 font-medium">
            Knowledge Tree
          </div>
        </div>
      </Html>
    </group>
  );
};

export const KnowledgeTree3D: React.FC = () => {
  const nodes: Array<Node3DProps> = [
    { position: [0, 2.3, 0.2], color: '#F59E0B', titleSanskrit: 'शब्दावली', titleEnglish: 'Vocabulary', view: 'vocabulary' },
    { position: [2.2, 1.2, 0.5], color: '#3B82F6', titleSanskrit: 'व्याकरणम्', titleEnglish: 'Grammar', view: 'grammar' },
    { position: [2.0, -1.3, -0.2], color: '#EC4899', titleSanskrit: 'उच्चारणम्', titleEnglish: 'Pronunciation', view: 'pronunciation' },
    { position: [0, -2.2, 0.4], color: '#10B981', titleSanskrit: 'अनुवादः', titleEnglish: 'Translation', view: 'translation' },
    { position: [-2.0, -1.2, -0.4], color: '#8B5CF6', titleSanskrit: 'भाषाविज्ञानम्', titleEnglish: 'Linguistics', view: 'linguistics' },
    { position: [-2.2, 1.2, 0.3], color: '#EAB308', titleSanskrit: 'सम्भाषणम्', titleEnglish: 'Acharya AI', view: 'acharya' },
    { position: [0, 0.2, 2.1], color: '#F97316', titleSanskrit: 'प्रश्नोत्तरी', titleEnglish: 'Quizzes', view: 'practice' }
  ];

  return (
    <div className="relative w-full h-[480px] rounded-2xl glass-card overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 48 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FDE047" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8B5CF6" />

        <TreeTrunk />

        {nodes.map((n, idx) => (
          <BranchNode3D key={idx} {...n} />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={9}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      <div className="absolute top-4 left-4 text-[11px] text-amber-400 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/20 pointer-events-none">
        🪐 Rotate 3D Tree • Click branches to enter
      </div>
    </div>
  );
};
