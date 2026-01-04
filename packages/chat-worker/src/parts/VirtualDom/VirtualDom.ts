export interface VirtualElement {
  accept?: string
  children?: readonly (VirtualElement | string)[]
  className?: string
  events?: {
    [key: string]: string
  }
  inputType?: string
  name?: string
  placeholder?: string
  src?: string
  textContent?: string
  type: string
  value?: string
}
