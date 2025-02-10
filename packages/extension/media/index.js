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
    await submitForm(event.target.parentNode)
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
  const input = document.createElement('textarea')
  input.className = 'Input'
  input.name = 'Input'
  input.addEventListener('keydown', handleKeyDown)

  const button = document.createElement('button')
  button.type = 'submit'
  button.textContent = 'Send'
  button.name = 'Submit'
  form.append(input, button)
  app.append(output, form)

  document.body.append(app)
  return {}
}

const addMessage = (message) => {
  const output = document.querySelector('.Output')
  const $Message = document.createElement('div')
  $Message.className = 'Message'
  $Message.textContent = message
  output?.append($Message)
  if (!output || !(output instanceof HTMLElement)) {
    return
  }
  output.scrollTop = output.scrollHeight
}

const setError = (message) => {
  const output = document.querySelector('.Output')
  const $Message = document.createElement('div')
  $Message.className = 'Message'
  $Message.textContent = message
  output?.append(message)
}

const clear = () => {
  const input = document.querySelector('.Input')
  if (!input) {
    return
  }
  // @ts-ignore
  input.value = ''
}

const rpc = globalThis.lvceRpc({
  initialize,
  addMessage,
  setError,
  clear,
})
