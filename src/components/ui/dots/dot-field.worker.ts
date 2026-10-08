import { createDotRenderer, type DotFieldMessage, type DotFieldRenderer } from './dot-field-renderer'

let renderer: DotFieldRenderer | null = null

function createFromMessage(message: Extract<DotFieldMessage, { type: 'init' }>) {
  const context = message.canvas.getContext('2d')
  if (!context) throw new Error('Dot field worker could not get a 2D context.')
  return createDotRenderer(context, message.options, message.palette)
}

function apply(target: DotFieldRenderer, message: Exclude<DotFieldMessage, { type: 'init' }>) {
  switch (message.type) {
    case 'resize':
      target.resize(message.size)
      return
    case 'palette':
      target.setPalette(message.palette)
      return
    case 'pointer':
      target.setPointer(message.point)
      return
    case 'running':
      target.setRunning(message.running)
  }
}

self.onmessage = (event: MessageEvent<DotFieldMessage>) => {
  const message = event.data
  if (message.type === 'init') {
    renderer = createFromMessage(message)
    return
  }
  if (!renderer) throw new Error(`Dot field worker received "${message.type}" before "init".`)
  apply(renderer, message)
}
