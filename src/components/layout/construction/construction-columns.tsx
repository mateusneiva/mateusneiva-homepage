import { cn } from '@/lib/cn'

export type ConstructionColumnLayout = 'projects' | 'posts' | 'split' | 'split-lg' | 'split-about'

const guttersByLayout: Record<ConstructionColumnLayout, readonly string[]> = {
  split: ['left-1/2 hidden md:block'],
  'split-lg': ['left-1/2 hidden lg:block'],
  'split-about': ['left-[calc(45%_+_0.15rem)] hidden lg:block'],
  projects: [
    'left-[calc(33.333%_-_0.208333rem)] hidden md:block',
    'left-[calc(66.667%_+_0.208333rem)] hidden md:block',
  ],
  posts: [
    'left-1/2 hidden md:block lg:hidden',
    'left-[calc(33.333%_-_0.208333rem)] hidden lg:block',
    'left-[calc(66.667%_+_0.208333rem)] hidden lg:block',
  ],
}

function Gutter({ className }: { className: string }) {
  return (
    <span className={cn('absolute inset-y-0 w-5 -translate-x-1/2', className)}>
      <span className="absolute inset-y-0 left-1/2 w-px bg-ink/[0.07] [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]" />
    </span>
  )
}

export function ConstructionColumns({ layout }: { layout: ConstructionColumnLayout }) {
  return (
    <div className="absolute inset-x-4 inset-y-2 sm:inset-x-6">
      {guttersByLayout[layout].map((className) => (
        <Gutter key={className} className={className} />
      ))}
    </div>
  )
}
