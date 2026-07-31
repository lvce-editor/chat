import { activate as activateExtensionApi } from '@lvce-editor/api'

const state = {
  isActivated: false,
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()
}

export const deactivate = (): void => {}
