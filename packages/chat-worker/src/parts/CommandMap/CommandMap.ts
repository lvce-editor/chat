import * as Create from '../Create/Create.ts'
import * as HandleImageUpload from '../HandleImageUpload/HandleImageUpload.ts'
import * as HandleNewChat from '../HandleNewChat/HandleNewChat.ts'
import * as HandleScroll from '../HandleScroll/HandleScroll.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as WrapCommand from '../WrapCommand/WrapCommand.ts'

export const commandMap = {
  'WebView.create': Create.create,
  'WebView.saveState': SaveState.saveState,
  handleSubmit: WrapCommand.wrapCommand(HandleSubmit.handleSubmit),
  handleNewChat: WrapCommand.wrapCommand(HandleNewChat.handleNewChat),
  handleScroll: WrapCommand.wrapCommand(HandleScroll.handleScroll),
  handleImageUpload: WrapCommand.wrapCommand(HandleImageUpload.handleImageUpload),
}
