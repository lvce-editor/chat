export interface VirtualElement {
  type: string
  className?: string
  children?: (VirtualElement | string)[]
  textContent?: string
  name?: string
  placeholder?: string
  events?: {
    [key: string]: string
  }
}
