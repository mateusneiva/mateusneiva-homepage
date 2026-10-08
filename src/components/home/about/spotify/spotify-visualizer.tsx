export function SpotifyVisualizer() {
  return (
    <span aria-hidden="true" data-spotify-visualizer className="inline-flex h-3 w-3.5 shrink-0 items-end gap-0.5">
      {[
        'h-2 [animation-delay:-0.3s]',
        'h-3 [animation-delay:-0.7s] [animation-duration:850ms]',
        'h-2.5 [animation-delay:-0.5s] [animation-duration:1150ms]',
        'h-1.5 [animation-delay:-0.9s]',
      ].map((className) => (
        <span key={className} className={`w-0.5 origin-bottom animate-spotify-bar bg-accent motion-reduce:animate-none ${className}`} />
      ))}
    </span>
  )
}
