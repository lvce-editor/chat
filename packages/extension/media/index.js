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

const isAtBottom = (output) => {
  const { scrollTop, scrollHeight, clientHeight } = output
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 10
}

const fixScroll = (output) => {
  if (isAtBottom(output)) {
    output.scrollTop = output.scrollHeight
  }
}

const renderMessage = (message, role) => {
  const $Message = document.createElement('div')
  $Message.className = `Message ${role}`

  if (role === 'human') {
    $Message.textContent = message
    return $Message
  }

  for (const block of message) {
    if (block.type === 'code') {
      const pre = document.createElement('pre')
      pre.className = `code-block language-${block.language}`
      const code = document.createElement('code')
      code.textContent = block.content
      pre.appendChild(code)
      $Message.appendChild(pre)
    } else {
      const p = document.createElement('p')
      p.textContent = block.content
      $Message.appendChild(p)
    }
  }
  return $Message
}

const addMessage = (message, role = 'ai') => {
  const output = document.querySelector('.Output')
  const $Message = renderMessage(message, role)
  output?.append($Message)
  if (!output || !(output instanceof HTMLElement)) {
    return
  }
  fixScroll(output)
}

const updateMessage = (blocks) => {
  const output = document.querySelector('.Output')
  const last = output?.lastElementChild
  if (last) {
    const newMessage = renderMessage(blocks, 'ai')
    last.replaceWith(newMessage)
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
  updateMessage,
  setError,
  clear,
})
