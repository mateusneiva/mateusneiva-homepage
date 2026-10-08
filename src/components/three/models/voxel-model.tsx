'use client'

import { useEffect, useRef } from 'react'
import { useAnimations } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { useVoxelModel } from '../hooks/use-voxel-model'
import type { VoxelAssetId } from './voxel-assets'

export function VoxelModel({ id, animated, speed = 1 }: { id: VoxelAssetId; animated: boolean; speed?: number }) {
  const root = useRef<Group>(null)
  const { object, scale, offset, animations, clipName } = useVoxelModel(id)
  const { actions } = useAnimations(animations, root)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    if (!clipName) return
    const action = actions[clipName]
    if (!action) return
    action.reset().play()
    invalidate()
    return () => { action.stop() }
  }, [actions, clipName, invalidate])

  useEffect(() => {
    const action = clipName ? actions[clipName] : null
    if (action) action.setEffectiveTimeScale(animated ? speed : 0)
    invalidate()
  }, [actions, animated, clipName, invalidate, speed])

  return <group ref={root} scale={scale}><group position={offset}><primitive object={object} dispose={null} /></group></group>
}
