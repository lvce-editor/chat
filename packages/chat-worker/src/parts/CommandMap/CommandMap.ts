import * as Create from '../Create/Create.ts'
import * as HandleEnter from '../HandleEnter/HandleEnter.ts'
import * as HandleImageUpload from '../HandleImageUpload/HandleImageUpload.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleModelSelect from '../HandleModelSelect/HandleModelSelect.ts'
import * as HandleNewChat from '../HandleNewChat/HandleNewChat.ts'
import * as HandleRemoveImage from '../HandleRemoveImage/HandleRemoveImage.ts'
import * as HandleScroll from '../HandleScroll/HandleScroll.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as WrapCommand from '../WrapCommand/WrapCommand.ts'

export const commandMap = {
  handleEnter: WrapCommand.wrapCommand(HandleEnter.handleEnter),
  handleImageUpload: WrapCommand.wrapCommand(HandleImageUpload.handleImageUpload),
  handleInput: WrapCommand.wrapCommand(HandleInput.handleInput),
  handleModelSelect: WrapCommand.wrapCommand(HandleModelSelect.handleModelSelect),
  handleNewChat: WrapCommand.wrapCommand(HandleNewChat.handleNewChat),
  handleRemoveImage: WrapCommand.wrapCommand(HandleRemoveImage.handleRemoveImage),
  handleScroll: WrapCommand.wrapCommand(HandleScroll.handleScroll),
  handleSubmit: WrapCommand.wrapCommand(HandleSubmit.handleSubmit),
  'WebView.create': Create.create,
  'WebView.saveState': SaveState.saveState,
}
