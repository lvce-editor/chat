import * as Update from '../Update/Update.ts'

export const handleRemoveImage = async (id: number) => {
  await Update.update(id, {
    images: [],
    previewImageUrl: '',
  })
}
