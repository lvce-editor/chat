export class ParseOpenRouterStream extends TransformStream<string, any> {
  constructor() {
    super({
      transform(chunk: string, controller) {
        if (!chunk.startsWith('data: ')) {
          return
        }
        const dataString = chunk.slice('data: '.length)
        if (dataString === '[DONE]') {
          return
        }
        const parsed = JSON.parse(dataString)
        controller.enqueue(parsed)
      },
    })
  }
}
