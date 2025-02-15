import { ParseLinesStream } from '../ParseLinesStream/ParseLinesStream.ts'
import { SplitLinesStream } from '../SplitLinesStream/SplitLinesStream.ts'

export const eventStream = (stream: ReadableStream): ReadableStream<any> => {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new SplitLinesStream()).pipeThrough(new ParseLinesStream())
}
