'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from '@/components/ui/theme/use-theme'
import { MathUtils, type Group } from 'three'
import { VoxelModel } from '../models/voxel-model'
import { VoxelWorkbench } from '../models/voxel-workbench'
import type { CompanionId } from '../models/voxel-flight-model'

function DisplayModel({ id, animated, reduced, onReady }: { id: CompanionId; animated: boolean; reduced: boolean; onReady: (id: CompanionId) => void }) {
  const root = useRef<Group>(null)
  useEffect(() => { onReady(id) }, [id, onReady])
  useFrame((_, delta) => {
    if (!root.current || !animated) return
    const scale = MathUtils.damp(root.current.scale.x, 1.8, 8, Math.min(delta, 0.1))
    root.current.scale.setScalar(scale)
  })
  return (
    <group ref={root} scale={reduced ? 1.8 : 1.4} position={[0, -0.05, 0]} rotation={[0, id === 'axolotl' ? -0.5 : Math.PI / 5, 0]}>
      <Center><VoxelModel id={id} animated={animated} /></Center>
    </group>
  )
}

export function CompanionDiorama({ id, active, loading }: { id: CompanionId; active: boolean; loading: string }) {
  const reduced = Boolean(useReducedMotion())
  const { resolvedTheme } = useTheme()
  const animated = active && !reduced
  const [loaded, setLoaded] = useState<CompanionId | null>(null)
  const onReady = useCallback((ready: CompanionId) => setLoaded(ready), [])
  return (
    <>
    {loaded !== id && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-mono text-xs text-subtle">{loading}</div>}
    <Canvas className="cursor-grab active:cursor-grabbing" camera={{ position: [-2.7, 0, -4.7], fov: 38 }} gl={{ antialias: true }} dpr={[1, 1.5]} shadows="percentage" frameloop={animated ? 'always' : 'demand'}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 6, 4]} intensity={1.8} castShadow shadow-mapSize={1024} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.001} />
      <directionalLight position={[-4, 2, -2]} intensity={0.55} color="#d6edf1" />
      <VoxelWorkbench light={resolvedTheme === 'light'} />
      <Suspense fallback={null}>
        <DisplayModel key={id} id={id} animated={animated} reduced={reduced} onReady={onReady} />
      </Suspense>
      <OrbitControls target={[0, -0.25, 0]} enabled={active} enableZoom={false} enablePan={false} enableDamping={!reduced} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 2.2} rotateSpeed={0.5} />
    </Canvas>
    </>
  )
}
