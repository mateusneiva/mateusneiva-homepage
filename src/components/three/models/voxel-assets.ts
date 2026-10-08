export type VoxelAssetId = 'computer' | 'allay' | 'bee' | 'axolotl'
export type VectorTuple = [number, number, number]

export const voxelAssets: Record<VoxelAssetId, { path: string; size: number; animation?: string }> = {
  computer: { path: '/computer.glb', size: 2.05 },
  allay: { path: '/minecraft_allay.glb', size: 0.85, animation: 'animation.juhih.fly' },
  bee: { path: '/bee_minecraft.glb', size: 0.72, animation: 'Animation' },
  axolotl: { path: '/minecraft_axolotl.glb', size: 1.05, animation: 'Take 001' },
}
