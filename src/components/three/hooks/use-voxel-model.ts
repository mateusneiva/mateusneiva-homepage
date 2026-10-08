'use client'

import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Mesh, Vector3, Texture, NearestFilter } from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { voxelAssets, type VoxelAssetId, type VectorTuple } from '../models/voxel-assets'

export function useVoxelModel(id: VoxelAssetId) {
  const asset = voxelAssets[id]
  const { scene, animations } = useGLTF(asset.path)
  const fitted = useMemo(() => {
    const object = SkeletonUtils.clone(scene)
    object.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true
        node.receiveShadow = true
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          if ('map' in material && material.map instanceof Texture && material.map.magFilter !== NearestFilter) {
            material.map.magFilter = NearestFilter
            material.map.minFilter = NearestFilter
            material.map.needsUpdate = true
          }
        }
      }
    })
    object.updateMatrixWorld(true)
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    return {
      object,
      scale: asset.size / Math.max(size.x, size.y, size.z, 0.001),
      offset: [-center.x, -box.min.y, -center.z] as VectorTuple,
    }
  }, [asset.size, scene])
  const clip = animations.find((animation) => animation.duration > 0 && animation.name === asset.animation)
    ?? animations.find((animation) => animation.duration > 0)
  return { ...fitted, animations, clipName: clip?.name }
}
