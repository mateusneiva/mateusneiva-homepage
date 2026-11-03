import { useTranslations } from 'next-intl'
import { FiGitBranch, FiStar } from 'react-icons/fi'
import type { RepositoryStats } from '@/lib/github/repository'
import { cn } from '@/lib/cn'

type ProjectStatsProps = { stats?: RepositoryStats | null; labeled?: boolean; className?: string }

export function ProjectStats({ stats, labeled = false, className }: ProjectStatsProps) {
  const t = useTranslations('Projects')
  if (!stats) return null
  return (
    <ul className={cn('flex items-center gap-4 font-mono text-xs text-muted', className)}>
      <li className="inline-flex items-center gap-1.5" aria-label={t('repositoryStars', { count: stats.stargazers_count })}>
        <FiStar size={12} aria-hidden="true" />
        <span aria-hidden="true">{stats.stargazers_count}{labeled && ` ${t('stars')}`}</span>
      </li>
      <li className="inline-flex items-center gap-1.5" aria-label={t('repositoryForks', { count: stats.forks_count })}>
        <FiGitBranch size={12} aria-hidden="true" />
        <span aria-hidden="true">{stats.forks_count}{labeled && ` ${t('forks')}`}</span>
      </li>
    </ul>
  )
}
