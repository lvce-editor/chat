import * as InputSource from '../InputSource/InputSource.ts'
import * as Update from '../Update/Update.ts'

export const handleInput = async (id: number, input: string): Promise<void> => {
  await Update.update(id, {
    currentInput: input,
    inputSource: InputSource.User,
  })
}
