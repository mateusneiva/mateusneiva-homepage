'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SceneBoundary } from './scene-boundary'
import { useViewportActivity } from '@/components/ui/motion/use-viewport-activity'
import { useWebglSupport } from './hooks/use-webgl-support'
import type { CompanionId } from './models/voxel-flight-model'

const VoxelStripCanvas = dynamic(() => import('./scenes/voxel-strip-canvas').then((module) => module.VoxelStripCanvas), { ssr: false })

export function MinecraftCompanion({ id, className }: { id: CompanionId; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useViewportActivity(ref)
  const supported = useWebglSupport()
  const activated = useInView(ref, { once: true })
  return <div ref={ref} aria-hidden="true" data-minecraft-companion={id} className={cn('pointer-events-none absolute top-0 z-10 h-16 sm:h-20', className)}><SceneBoundary>{activated && supported && <VoxelStripCanvas id={id} active={active} />}</SceneBoundary></div>
}
