import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import type { ProjectSectionId } from '../navigation/project-sections'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

export function ProjectDetailSection({
  id,
  title,
  children,
  className,
}: {
  id: ProjectSectionId
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-8', className)}>
      <div className="relative isolate mb-6">
        <ConstructionFrame variant="title" />
        <h2 id={`${id}-title`} className="heading-detail">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
