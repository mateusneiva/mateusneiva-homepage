import { tv, type VariantProps } from 'tailwind-variants'
import { Badge } from './Badge'

const card = tv({
  slots: {
    container:
      'flex flex-col border border-gray-700 transition hover:-translate-x-1 hover:-translate-y-1 hover:border-yellow-400 hover:bg-gray-800 hover:shadow-[5px_5px_0px_#FACC15]',
    badgesWrapper: 'pt-3 flex flex-wrap gap-1',
  },
})

type CardVariants = VariantProps<typeof card>

const { container, badgesWrapper } = card()

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardVariants {
  title: string
  description: string
  videoSrc: string
  badges: string[]
}

export function Card({
  title,
  description,
  videoSrc,
  badges,
  ...props
}: CardProps) {
  return (
    <div className={container()} {...props}>
      <video
        src={videoSrc}
        preload="none"
        autoPlay
        loop
        muted
        disablePictureInPicture
      />

      <div className="px-4 pb-4 pt-3">
        <div className="flex flex-col gap-1">
          <p className="text-white">{title}</p>
          <p>{description}</p>
        </div>

        <div className={badgesWrapper()}>
          {badges.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
