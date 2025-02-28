export interface VirtualElement {
  type: string
  className?: string
  children?: readonly (VirtualElement | string)[]
  textContent?: string
  name?: string
  placeholder?: string
  inputType?: string
  value?: string
  accept?: string
  src?: string
  events?: {
    [key: string]: string
  }
}
