import * as Create from '../Create/Create.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as SaveState from '../SaveState/SaveState.ts'

export const commandMap = {
  'WebView.create': Create.create,
  'WebView.saveState': SaveState.saveState,
  handleSubmit: HandleSubmit.handleSubmit,
}
