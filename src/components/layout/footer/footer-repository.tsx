import { getTranslations } from 'next-intl/server'
import { FiGitBranch, FiGithub, FiStar } from 'react-icons/fi'
import { getRepositoryStats, repositoryUrl } from '@/lib/github/repository'

export async function FooterRepository() {
  const [t, stats] = await Promise.all([
    getTranslations('Footer'),
    getRepositoryStats(),
  ])
  const className = 'inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-muted focus-visible:text-muted motion-reduce:transition-none'
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2" data-footer-repository>
      <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className={className}>
        <FiGithub size={12} aria-hidden="true" />
        <span>mateusneiva-homepage</span>
      </a>
      
      {stats && (
        <>
          <a href={`${repositoryUrl}/stargazers`} target="_blank" rel="noopener noreferrer" className={className} aria-label={t('repositoryStars', { count: stats.stargazers_count })}>
            <FiStar size={12} aria-hidden="true" />
            <span>{stats.stargazers_count} {t('stars')}</span>
          </a>
          <a href={`${repositoryUrl}/forks`} target="_blank" rel="noopener noreferrer" className={className} aria-label={t('repositoryForks', { count: stats.forks_count })}>
            <FiGitBranch size={12} aria-hidden="true" />
            <span>{stats.forks_count} forks</span>
          </a>
        </>
      )}
    </div>
  )
}
