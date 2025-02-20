export interface SavedState {
  readonly messages: readonly any[]
  readonly scrollOffset: number
  readonly currentInput: string
  readonly focused: boolean
  readonly inputSource: number
}
