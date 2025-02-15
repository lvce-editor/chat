export class ParseLinesStream extends TransformStream<string, any> {
  constructor() {
    super({
      transform(chunk: string, controller) {
        if (!chunk.startsWith('data: ')) {
          return
        }
        const dataString = chunk.slice('data: '.length)
        const parsed = JSON.parse(dataString)
        controller.enqueue(parsed)
      },
    })
  }
}
