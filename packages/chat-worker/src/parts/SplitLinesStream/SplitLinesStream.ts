export class SplitLinesStream extends TransformStream<string, string> {
  constructor() {
    super({
      transform(chunk: string, controller) {
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (!line) {
            continue
          }
          controller.enqueue(line)
        }
      },
    })
  }
}
