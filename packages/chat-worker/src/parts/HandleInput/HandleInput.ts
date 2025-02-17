import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const handleInput = async (id: number, input: string): Promise<void> => {
  await WebViewStates.update(id, {
    currentInput: input,
    inputSource: InputSource.User,
  })
}
