import { ParseOpenRouterStream } from '../ParseOpenRouterStream/ParseOpenRouterStream.ts'
import { SplitLinesStream } from '../SplitLinesStream/SplitLinesStream.ts'

export const openRouterEventStream = (stream: ReadableStream): ReadableStream<any> => {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new SplitLinesStream()).pipeThrough(new ParseOpenRouterStream())
}
