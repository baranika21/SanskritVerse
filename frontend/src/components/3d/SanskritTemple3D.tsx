// ==============================================================================
// SANSKRITVERSE 3D Sanskrit Temple / Learning World (Śikhara & Kakṣas)
// Stylized futuristic learning temple with 6 interactive sacred chambers
// ==============================================================================

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { PageView } from '../../types';

interface ChamberProps {
  position: [number, number, number];
  color: string;
  nameSanskrit: string;
  nameEnglish: string;
  view: PageView;
  icon: string;
}

const ChamberPillar: React.FC<ChamberProps> = ({ position, color, nameSanskrit, nameEnglish, view, icon }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { navigateTo } = useAppStore();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={position}>
      <group
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
        scale={hovered ? 1.2 : 1.0}
      >
        {/* Sacred Chamber Base */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.4, 12]} />
          <meshStandardMaterial
            color="#1B1536"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Glowing Crystal Shrine */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.45, 0.5, 0.8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.2 : 0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Golden Pinnacle / Kalasha */}
        <mesh position={[0, 1.0, 0]}>
          <coneGeometry args={[0.35, 0.55, 8]} />
          <meshStandardMaterial
            color="#FDE047"
            emissive="#D97706"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
};

export const SanskritTemple3D: React.FC = () => {
  const templeSpireRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { navigateTo } = useAppStore();

  useFrame((state, delta) => {
    if (templeSpireRef.current) {
      templeSpireRef.current.rotation.y += delta * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.15;
    }
  });

  const chambers: ChamberProps[] = [
    { position: [0, 0, 2.6], color: '#F59E0B', nameSanskrit: 'ज्ञान कक्ष', nameEnglish: 'Knowledge Room', view: 'lessons', icon: '📖' },
    { position: [2.3, 0, 1.3], color: '#3B82F6', nameSanskrit: 'व्याकरण कक्ष', nameEnglish: 'Grammar Room', view: 'grammar', icon: '🧠' },
    { position: [2.3, 0, -1.3], color: '#10B981', nameSanskrit: 'शब्द कक्ष', nameEnglish: 'Vocabulary Room', view: 'vocabulary', icon: '📚' },
    { position: [0, 0, -2.6], color: '#EC4899', nameSanskrit: 'उच्चारण कक्ष', nameEnglish: 'Pronunciation Room', view: 'pronunciation', icon: '🎙️' },
    { position: [-2.3, 0, -1.3], color: '#EAB308', nameSanskrit: 'संवाद कक्ष', nameEnglish: 'Conversation Room', view: 'acharya', icon: '💬' },
    { position: [-2.3, 0, 1.3], color: '#8B5CF6', nameSanskrit: 'अभ्यास कक्ष', nameEnglish: 'Practice Room', view: 'practice', icon: '🎯' }
  ];

  return (
    <div className="relative w-full h-[520px] rounded-2xl glass-card overflow-hidden border border-amber-500/30 bg-gradient-to-b from-[#080B14] via-[#120F24] to-[#080B14]">
      <Canvas camera={{ position: [0, 5.2, 6.8], fov: 48, near: 0.1, far: 1000 }}>
        {/* Balanced Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} color="#FFFBEB" />
        <pointLight position={[0, 4, 0]} intensity={2.5} color="#FBBF24" distance={15} />
        <hemisphereLight groundColor="#0f172a" color="#fef08a" intensity={0.8} />

        {/* Stylized Central Temple Sanctum / Śikhara */}
        <group position={[0, 0, 0]}>
          {/* Base Plinth */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[3.2, 3.6, 0.45, 24]} />
            <meshStandardMaterial color="#18132B" roughness={0.5} metalness={0.6} />
          </mesh>

          {/* Stepped Inner Terrace */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[2.2, 2.5, 0.3, 16]} />
            <meshStandardMaterial color="#2E1A47" roughness={0.4} metalness={0.7} />
          </mesh>

          {/* Mandala Energy Ring */}
          <mesh ref={ringRef} position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.7, 3.0, 32]} />
            <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>

          {/* Central Sanctum Tower (Śikhara) */}
          <mesh ref={templeSpireRef} position={[0, 1.2, 0]}>
            <octahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#D97706"
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Golden Amalaka Disc */}
          <mesh position={[0, 2.3, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 16]} />
            <meshStandardMaterial color="#FDE047" emissive="#F59E0B" emissiveIntensity={0.8} metalness={1.0} roughness={0.1} />
          </mesh>

          {/* Glowing Sacred Kalasha Spire */}
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#FDE047" emissive="#FBBF24" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* 6 Interactive Learning Kakṣas */}
        {chambers.map((c, i) => (
          <ChamberPillar key={i} {...c} />
        ))}

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={12}
          autoRotate={true}
          autoRotateSpeed={0.6}
        />
      </Canvas>

      {/* Top Banner */}
      <div className="absolute top-3 left-4 text-xs text-amber-300 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 pointer-events-none flex items-center gap-2 shadow-md">
        <span>🏛️</span>
        <span className="font-semibold font-sanskrit">3D मन्दिर-परिसरः (Sanskrit Learning Temple)</span>
        <span className="text-[10px] text-slate-400">• Drag to rotate • Click chambers</span>
      </div>

      {/* Bottom Interactive Chamber Quick Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
        {chambers.map((c, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo(c.view)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 backdrop-blur-md text-xs font-semibold transition-all whitespace-nowrap"
          >
            <span>{c.icon}</span>
            <span className="font-sanskrit">{c.nameSanskrit}</span>
            <span className="text-[10px] text-slate-400">({c.nameEnglish})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
