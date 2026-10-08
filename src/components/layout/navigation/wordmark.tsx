import { Link } from '@/i18n/navigation'
import { BrandMark } from '@/components/ui/brand/brand-mark'

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="Mateus Neiva"
      className="inline-flex text-3xl text-ink transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none"
    >
      <BrandMark />
    </Link>
  )
}
