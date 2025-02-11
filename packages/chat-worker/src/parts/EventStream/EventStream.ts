export const eventStream = (stream: ReadableStream): ReadableStream<any> => {
  const splitLines = new TransformStream({
    transform(chunk, controller) {
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (!line) {
          continue
        }
        controller.enqueue(line)
      }
    },
  })

  const parseLines = new TransformStream({
    transform(chunk, controller) {
      if (!chunk.startsWith('data: ')) {
        return
      }
      const dataString = chunk.slice('data: '.length)
      const parsed = JSON.parse(dataString)
      controller.enqueue(parsed)
    },
  })
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(splitLines).pipeThrough(parseLines)
}
