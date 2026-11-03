import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import type { ProjectSectionId } from '../navigation/project-sections'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { AnchoredHeading } from '@/components/ui/typography/anchored-heading'

export function ProjectDetailSection({
  id,
  title,
  children,
  className,
}: {
  id: ProjectSectionId | 'project-links'
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-8', className)}>
      <div className="relative isolate mb-6">
        <ConstructionFrame variant="title" />
        <AnchoredHeading as="h2" id={`${id}-title`} anchor={id} className="heading-detail">
          {title}
        </AnchoredHeading>
      </div>
      {children}
    </section>
  )
}
