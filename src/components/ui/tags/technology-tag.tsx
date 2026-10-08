import { technologies, type TechnologyName } from '@/data/technologies'
import { cn } from '@/lib/cn'
import { Tag } from './tag'

export function TechnologyTag({ name }: { name: TechnologyName }) {
  const technology = technologies[name]
  const { icon: Icon, color } = technology
  const iconSize = 'iconSize' in technology ? technology.iconSize : 16
  return (
    <Tag size="md" className="max-w-full items-center gap-1.5 px-2 sm:gap-2 sm:px-2.5">
      <span className={cn('flex h-[18px] w-[18px] shrink-0 items-center justify-center', color)} data-technology-icon aria-hidden="true">
        <Icon size={iconSize} focusable="false" />
      </span>
      <span className="min-w-0 [overflow-wrap:anywhere]" data-technology-label>{name}</span>
    </Tag>
  )
}
