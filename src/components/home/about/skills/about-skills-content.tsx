import { useTranslations } from 'next-intl'
import { skillGroups } from '@/data/skills'
import { TechnologyTag } from '@/components/ui/tags/technology-tag'
import { Reveal } from '@/components/ui/motion/reveal'
import type { TechnologyName } from '@/data/technologies'

function SkillList({ skills, labelledBy }: { skills: readonly TechnologyName[]; labelledBy: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5 sm:gap-2" aria-labelledby={labelledBy}>
      {skills.map((skill) => (
        <li key={skill} className="min-w-0 max-w-full">
          <TechnologyTag name={skill} />
        </li>
      ))}
    </ul>
  )
}

export function AboutSkillsContent({ expanded = false }: { expanded?: boolean }) {
  const t = useTranslations('About')

  return (
    <div className="space-y-4">
      {skillGroups.map((group, index) => (
        <div
          key={group.label}
          className="min-w-0 py-4 last:pb-0 sm:bg-surface sm:p-6 sm:last:pb-6"
          role="region"
          aria-labelledby={`skills-${!expanded ? 'summary-' : ''}${group.label}`}
          data-skill-group={group.label}
        >
          <Reveal delay={index * 0.1}>
            <h3
              id={`skills-${!expanded ? 'summary-' : ''}${group.label}`}
              className="heading-card mb-1.5"
            >
              {t(group.label)}
            </h3>

            <p className="mb-4 font-sans text-[13px] leading-5 text-muted" data-skill-description>
              {t(`skillDescriptions.${group.label}`)}
            </p>

            {!expanded && <SkillList skills={group.primary} labelledBy={`skills-summary-${group.label}`} />}

            {expanded && (
              <div className="space-y-4">
                {group.subgroups.map((subgroup) => (
                  <div key={subgroup.label}>
                    <h4
                      id={`skills-${group.label}-${subgroup.label}`}
                      className="mb-2 font-mono text-xs font-medium leading-5 text-muted"
                    >
                      {t(subgroup.titleKey)}
                    </h4>

                    <SkillList
                      skills={subgroup.skills}
                      labelledBy={`skills-${group.label}-${subgroup.label}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      ))}
    </div>
  )
}
