import type { Project } from '@/data/projects'
import Image from 'next/image'
import { cn } from '@/lib/cn'

const backgrounds = {
  softness: 'bg-[#d7d4cd] text-[#252520]',
  polaris: 'bg-[#29253e] text-stone-200',
  shiva: 'bg-[#1a3025] text-stone-200',
}

export function ProjectVisual({
  id,
  image,
  className,
  sizes = '(min-width: 1280px) 360px, (min-width: 768px) calc((100vw - 120px) / 3), calc(100vw - 48px)',
}: {
  id: Project['id']
  image?: Project['image']
  className?: string
  sizes?: string
}) {
  if (image) {
    return (
      <div aria-hidden="true" className={cn('relative h-52 overflow-hidden bg-surface', className)}>
        <Image src={image} alt="" fill sizes={sizes} className="object-contain" />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={cn('flex h-52 items-center justify-center overflow-hidden', backgrounds[id], className)}
    >
      {id === 'softness' && (
        <div className="text-center">
          <div className="mb-3 text-[10px] tracking-[0.4em]">LESS NOISE. MORE YOU.</div>
          <span className="text-5xl font-bold tracking-[-0.08em]">softness®</span>
          <div className="mx-auto mt-5 h-1 w-12 bg-stone-800" />
        </div>
      )}
      {id === 'polaris' && (
        <div className="w-48 bg-[#171b2d] p-4">
          <div className="mb-4 flex gap-1.5">
            <span className="h-1.5 w-1.5 bg-violet-300" />
            <span className="h-1.5 w-1.5 bg-white/20" />
            <span className="h-1.5 w-1.5 bg-white/20" />
          </div>
          <span className="text-2xl text-violet-200">✳</span>
          <div className="mt-3 flex gap-2">
            <span className="bg-violet-300 px-3 py-2 text-[10px] text-violet-950">Polaris Kit</span>
            <span className="bg-white/10 px-3 py-2 text-[10px]">⌘ K</span>
          </div>
          <div className="mt-3 h-2 w-2/3 bg-white/10" />
        </div>
      )}
      {id === 'shiva' && (
        <div className="w-56 bg-[#0d1915] p-5 font-mono text-[11px]">
          <div className="mb-5 text-stone-500">shiva / toolbox</div>
          <p className="text-emerald-300">
            <span className="text-stone-500">$ </span>/status
          </p>
          <p className="mt-2 text-stone-400">
            modules initialized<span className="ml-2 text-emerald-300">✓</span>
          </p>
          <div className="mt-5 flex items-center gap-2 text-emerald-300">
            <span className="h-1.5 w-1.5 bg-emerald-300" />
            ready to connect<span className="ml-auto">_</span>
          </div>
        </div>
      )}
    </div>
  )
}
