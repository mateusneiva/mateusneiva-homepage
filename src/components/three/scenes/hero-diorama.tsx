'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from '@/components/ui/theme/use-theme'
import { VoxelModel } from '../models/voxel-model'
import { VoxelWorkbench } from '../models/voxel-workbench'

export function HeroDiorama({ active }: { active: boolean }) {
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()
  return (
    <Canvas className="cursor-grab active:cursor-grabbing" gl={{ antialias: true }} dpr={[1, 1.5]} shadows="percentage" frameloop="demand" camera={{ position: [-5.0, 0, 4.7], fov: 38 }}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 6, 4]} intensity={1.8} castShadow shadow-mapSize={1024} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.001} />
      <directionalLight position={[-4, 2, -2]} intensity={0.55} color="#d6edf1" />
      <Suspense fallback={null}>
        <VoxelWorkbench light={resolvedTheme === 'light'} />
        <group position={[0.25, -1.0, 0]}><VoxelModel id="computer" animated={false} /></group>
      </Suspense>
      <OrbitControls target={[0, 0.1, 0]} enabled={active} enableZoom={false} enablePan={false} enableDamping={!reduced} autoRotate={active && !reduced} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2.2} rotateSpeed={0.5} />
    </Canvas>
  )
}
