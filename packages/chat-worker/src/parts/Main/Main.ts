import * as CommandMap from '../CommandMap/CommandMap.ts'
import { listen, commandMap } from '@lvce-editor/extension-host-sub-worker/api'

export const main = async () => {
  await listen({ ...commandMap, ...CommandMap.commandMap })
}
