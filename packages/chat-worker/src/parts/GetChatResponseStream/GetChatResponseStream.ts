import * as EventStream from '../EventStream/EventStream.ts'

export const getChatResponseStream = (stream: ReadableStream<Uint8Array<ArrayBufferLike>>) => {
  return EventStream.eventStream(stream)
}
