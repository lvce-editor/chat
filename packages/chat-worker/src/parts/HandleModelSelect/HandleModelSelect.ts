import * as Update from '../Update/Update.ts'

export const handleModelSelect = async (id: number, modelId: string): Promise<void> => {
  await Update.update(id, {
    modelId,
  })
}
