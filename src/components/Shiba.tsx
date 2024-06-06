// @ts-ignore
// @ts-nocheck

'use client'

import { Suspense } from 'react'
import { Canvas, type GroupProps, type MeshProps } from '@react-three/fiber'
import { SoftShadows, OrbitControls, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import { motion as motion3d } from 'framer-motion-3d'

function Model(props: GroupProps) {
  const { nodes, materials } = useGLTF('/shiba.glb')

  return (
    <group {...props} dispose={null}>
      <motion3d.mesh
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
        }}
        geometry={nodes.Shiba_inu.geometry}
        material={materials.DIF}
        position={[0.08, 0.02, -0.02]}
        rotation={[2.881, -1.439, -0.306]}
        scale={0.01}
        castShadow
        receiveShadow
      />
    </group>
  )
}

useGLTF.preload('/shiba.glb')

function Floor(props: MeshProps) {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, -0.6, 0]}
      receiveShadow
      {...props}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <shadowMaterial attach="material" opacity={0.3} />
    </mesh>
  )
}

export function Shiba() {
  return (
    <motion.div className="h-[300px] w-full">
      <Canvas
        gl={{ antialias: true }}
        shadows
        camera={{ position: [0, 1, 4], fov: 30 }}
      >
        <OrbitControls
          maxPolarAngle={Math.PI / 3.5}
          minPolarAngle={Math.PI / 2.5}
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={2.5}
          rotateSpeed={0.5}
        />

        <SoftShadows />

        <ambientLight intensity={1} />
        <directionalLight
          castShadow
          position={[2, 6, 3]}
          color="white"
          intensity={1}
          shadow-mapSize={1024}
        />

        <spotLight position={[0, 1, 1.2]} intensity={2} />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Model position={[0, -0.6, 0]} rotation={[0, 5, 0, 'XYZ']} />

            <Floor />
          </group>
        </Suspense>
      </Canvas>
    </motion.div>
  )
}
