'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { VoxelFlightModel, type CompanionId } from '../models/voxel-flight-model'

export function VoxelStripCanvas({ id, active }: { id: CompanionId; active: boolean }) {
  const reduced = useReducedMotion()
  const animated = active && !reduced
  return (
    <Canvas orthographic camera={{ position: [0, 0, 20], zoom: 58, near: 0.1, far: 100 }} dpr={[1, 1.5]} frameloop={animated ? 'always' : 'demand'} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.25} />
      <directionalLight position={[3, 4, 6]} intensity={1.4} />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#d9eff4" />
      <Suspense fallback={null}><VoxelFlightModel id={id} animated={animated} /></Suspense>
    </Canvas>
  )
}
