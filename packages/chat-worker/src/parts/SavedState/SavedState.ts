export interface SavedState {
  readonly currentInput: string
  readonly focused: boolean
  readonly inputSource: number
  readonly messages: readonly any[]
  readonly scrollOffset: number
}
