'use client'

import { useRef } from 'react'
import { Center } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { VoxelModel } from './voxel-model'
import { voxelAssets, type VoxelAssetId } from './voxel-assets'

export type CompanionId = Exclude<VoxelAssetId, 'computer'>

export function VoxelFlightModel({ id, animated }: { id: CompanionId; animated: boolean }) {
  const root = useRef<Group>(null)
  const elapsed = useRef(0)
  useFrame(({ viewport }, delta) => {
    if (!animated || id === 'axolotl' || !root.current) return
    const step = Math.min(delta, 0.05)
    elapsed.current += step
    const time = elapsed.current * (id === 'bee' ? 0.3 : 0.22) + (id === 'bee' ? -Math.PI / 2 : 0)
    const distance = Math.max(0, viewport.width / 2 - voxelAssets[id].size)
    root.current.position.x = Math.sin(time) * distance
    root.current.rotation.y = MathUtils.damp(root.current.rotation.y, Math.cos(time) >= 0 ? Math.PI / 3 : -Math.PI / 3, 4, step)
  })
  return <group ref={root} rotation={[0, id === 'axolotl' ? -0.45 : Math.PI / 3, 0]}><Center><VoxelModel id={id} animated={animated} /></Center></group>
}
