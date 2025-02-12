// TODO use virtual dom in  worker

const submitForm = async (target) => {
  const formData = new FormData(target)
  const input = formData.get('Input')
  // @ts-ignore
  await rpc.invoke('handleSubmit', input)
}

const handleSubmit = async (event) => {
  event.preventDefault()
  await submitForm(event.target)
}

const handleKeyDown = async (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    await submitForm(event.target.closest('form'))
  }
}

const initialize = async () => {
  const app = document.createElement('div')
  app.className = 'App'

  const output = document.createElement('div')
  output.className = 'Output'

  const form = document.createElement('form')
  form.className = 'Form'
  form.addEventListener('submit', handleSubmit)

  const formContent = document.createElement('div')
  formContent.className = 'FormContent'

  const input = document.createElement('textarea')
  input.className = 'Input'
  input.name = 'Input'
  input.placeholder = 'Message...'
  input.addEventListener('keydown', handleKeyDown)
  input.addEventListener('input', adjustHeight)

  const button = document.createElement('button')
  button.type = 'submit'
  button.className = 'Button'
  button.textContent = 'Send'
  button.name = 'Submit'

  formContent.append(input, button)
  form.append(formContent)
  app.append(output, form)
  document.body.append(app)
  return {}
}

const fixScroll = (output) => {
  output.scrollTop = output.scrollHeight
}

const addMessage = (message, isHuman = false) => {
  const output = document.querySelector('.Output')
  const $Message = document.createElement('div')
  $Message.className = `Message ${isHuman ? 'human' : 'ai'}`
  $Message.textContent = message
  output?.append($Message)
  if (!output || !(output instanceof HTMLElement)) {
    return
  }
  fixScroll(output)
}

const appendMessage = (partialMessage) => {
  const output = document.querySelector('.Output')
  const last = output?.lastElementChild
  if (last) {
    last.textContent += partialMessage
  }
  fixScroll(output)
}

const setError = (message) => {
  const output = document.querySelector('.Output')
  const $Message = document.createElement('div')
  $Message.className = 'Message Error'
  $Message.textContent = message
  output?.append($Message)
}

const clear = () => {
  const input = document.querySelector('.Input')
  if (!input) {
    return
  }
  // @ts-ignore
  input.value = ''
}

const adjustHeight = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const rpc = globalThis.lvceRpc({
  initialize,
  addMessage,
  appendMessage,
  setError,
  clear,
})
