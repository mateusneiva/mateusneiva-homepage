'use client'

import { Edges } from '@react-three/drei'

export function VoxelWorkbench({ light }: { light: boolean }) {
  return (
    <group>
      <mesh position={[0, -1.13, 0]} receiveShadow>
        <boxGeometry args={[3.8, 0.24, 2.6]} />
        <meshStandardMaterial color={light ? '#d7d9ca' : '#252c23'} roughness={1} />
        <Edges color={light ? '#a6ad96' : '#465040'} />
      </mesh>
      <gridHelper args={[3.8, 10, light ? '#b6bba9' : '#424b39', light ? '#c6cab9' : '#323b2c']} position={[0, -1.004, 0]} />
    </group>
  )
}
