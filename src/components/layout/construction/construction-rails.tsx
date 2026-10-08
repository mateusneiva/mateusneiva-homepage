export function ConstructionRails({ highlighted = false }: { highlighted?: boolean }) {
  const rail = `absolute inset-y-0 w-px ${highlighted ? 'bg-accent/50' : 'bg-ink/[0.065]'}`
  const minorTicks =
    'absolute inset-y-0 w-2 bg-[repeating-linear-gradient(to_bottom,rgb(var(--color-ink)/0.085)_0_1px,transparent_1px_24px)]'
  const majorTicks =
    'absolute inset-y-0 w-3 bg-[repeating-linear-gradient(to_bottom,rgb(var(--color-ink)/0.10)_0_1px,transparent_1px_120px)]'
  return (
    <div className="page-container absolute inset-0">
      <div className="relative h-full">
        <span className={`${rail} left-0`} />
        <span className={`${rail} right-0`} />
        {[25, 50, 75].map((position) => (
          <span
            key={position}
            className={`absolute inset-y-0 hidden w-px lg:block ${position === 25 ? 'left-1/4' : position === 50 ? 'left-1/2' : 'left-3/4'} ${highlighted ? 'bg-accent/20' : 'bg-ink/[0.025]'}`}
          />
        ))}
        {!highlighted && (
          <>
            <span className={`${minorTicks} -left-2`} />
            <span className={`${minorTicks} -right-2`} />
            <span className={`${majorTicks} -left-3`} />
            <span className={`${majorTicks} -right-3`} />
            <span className="absolute left-0 top-24 h-3 w-3 border-l border-t border-ink/[0.15]" />
            <span className="absolute right-0 top-24 h-3 w-3 border-r border-t border-ink/[0.15]" />
            <span className="absolute -left-10 top-32 hidden rotate-180 font-mono text-[8px] uppercase tracking-[0.18em] text-subtle/50 [writing-mode:vertical-rl] xl:block">
              Grid / 24 px
            </span>
            <span className="absolute -right-10 top-32 hidden font-mono text-[8px] uppercase tracking-[0.18em] text-subtle/50 [writing-mode:vertical-rl] xl:block">
              Layout / 1200
            </span>
          </>
        )}
      </div>
    </div>
  )
}
