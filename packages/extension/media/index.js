// TODO use virtual dom in  worker

let isScrolledToBottom = true

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

const shouldSubmit = (event) => {
  return (event.ctrlKey && event.key === 'Enter') || (event.key === 'Enter' && !event.shiftKey)
}

const handleKeyDown = async (event) => {
  if (shouldSubmit(event)) {
    event.preventDefault()
    await submitForm(event.target.closest('form'))
  }
}

const handleScroll = () => {
  const wrapper = document.querySelector('.ContentWrapper')
  if (!wrapper) {
    return
  }
  isScrolledToBottom = isAtBottom(wrapper)
  // @ts-ignore
  rpc.invoke('handleScroll', wrapper.scrollTop)
}

const initialize = async () => {
  const app = document.createElement('div')
  app.className = 'App'

  const header = document.createElement('div')
  header.className = 'Header'

  const newChatButton = document.createElement('button')
  newChatButton.className = 'NewChatButton'
  newChatButton.textContent = 'New Chat'
  newChatButton.addEventListener('click', async () => {
    await rpc.invoke('handleNewChat')
  })

  header.append(newChatButton)

  const contentWrapper = document.createElement('div')
  contentWrapper.className = 'ContentWrapper'

  const output = document.createElement('div')
  output.className = 'Output'

  contentWrapper.append(output)
  contentWrapper.addEventListener('scroll', handleScroll, { passive: true })

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

  formContent.append(input)
  form.append(formContent)
  app.append(header, contentWrapper, form)
  document.body.append(app)
  updateNewChatButtonState()
  return {}
}

const isAtBottom = (element) => {
  const { scrollTop, scrollHeight, clientHeight } = element
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 10
}

const fixScroll = (wrapper) => {
  if (isScrolledToBottom) {
    const contentWrapper = document.querySelector('.ContentWrapper')
    if (contentWrapper) {
      contentWrapper.scrollTop = contentWrapper.scrollHeight
    }
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
  const contentWrapper = document.querySelector('.ContentWrapper')
  const $Message = renderMessage(message, role)
  output?.append($Message)
  if (!contentWrapper || !(contentWrapper instanceof HTMLElement)) {
    return
  }
  fixScroll(contentWrapper)
  updateNewChatButtonState()
}

const updateMessage = (blocks) => {
  const output = document.querySelector('.Output')
  const contentWrapper = document.querySelector('.ContentWrapper')
  const last = output?.lastElementChild
  if (last) {
    const newMessage = renderMessage(blocks, 'ai')
    last.replaceWith(newMessage)
  }
  fixScroll(contentWrapper)
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

const clearMessages = () => {
  const output = document.querySelector('.Output')
  if (!output) {
    return
  }
  output.innerHTML = ''
  updateNewChatButtonState()
}

const updateNewChatButtonState = () => {
  const output = document.querySelector('.Output')
  const newChatButton = document.querySelector('.NewChatButton')
  if (!output || !newChatButton) {
    return
  }
  // @ts-ignore
  newChatButton.disabled = output.children.length === 0
}

const setScrollPosition = (scrollOffset) => {
  const output = document.querySelector('.Output')
  if (!output) {
    return
  }
  output.scrollTop = scrollOffset
}

const rpc = globalThis.lvceRpc({
  initialize,
  addMessage,
  updateMessage,
  setError,
  clear,
  clearMessages,
  setScrollPosition,
})
