// TODO use virtual dom in  worker

let isScrolledToBottom = true

const handlers = {
  handleSubmit: async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const input = formData.get('Input')
    await rpc.invoke('handleSubmit', input)
    event.target.reset()
  },

  handleKeyDown: (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      const form = event.target.closest('.Form')
      if (form) {
        const submitEvent = new Event('submit', { cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    }
  },

  handleNewChat: async () => {
    await rpc.invoke('handleNewChat')
  },

  adjustHeight: (event) => {
    const textarea = event.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  },
}

const createDomElement = (vdom) => {
  if (typeof vdom === 'string') {
    return document.createTextNode(vdom)
  }

  const element = document.createElement(vdom.type)

  if (vdom.className) {
    element.className = vdom.className
  }

  if (vdom.textContent) {
    element.textContent = vdom.textContent
  }

  if (vdom.name) {
    element.name = vdom.name
  }

  if (vdom.placeholder) {
    element.placeholder = vdom.placeholder
  }

  if (vdom.events) {
    for (const [event, handlerName] of Object.entries(vdom.events)) {
      element.addEventListener(event, handlers[handlerName])
    }
  }

  if (vdom.children) {
    for (const child of vdom.children) {
      element.appendChild(createDomElement(child))
    }
  }

  return element
}

const initialize = async (vdom) => {
  const app = createDomElement(vdom)
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
  $Message.className = role === 'human' ? 'MessageHuman' : 'MessageAi'

  if (role === 'human') {
    $Message.textContent = message
    return $Message
  }

  for (const block of message) {
    if (block.type === 'code') {
      const pre = document.createElement('pre')
      pre.className = `CodeBlock language-${block.language}`
      const code = document.createElement('code')
      code.className = 'CodeText'
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
  // newChatButton.disabled = output.children.length === 0
}

const setScrollPosition = (scrollOffset) => {
  const output = document.querySelector('.Output')
  if (!output) {
    return
  }
  output.scrollTop = scrollOffset
}

const checkIsBottom = () => {
  const contentWrapper = document.querySelector('.ContentWrapper')
  if (!contentWrapper) {
    return false
  }
  return isAtBottom(contentWrapper)
}

const setScrollTop = () => {
  const contentWrapper = document.querySelector('.ContentWrapper')
  if (contentWrapper) {
    contentWrapper.scrollTop = contentWrapper.scrollHeight
  }
}

const rpc = globalThis.lvceRpc({
  initialize,
  addMessage,
  updateMessage,
  setError,
  clear,
  clearMessages,
  setScrollPosition,
  checkIsBottom,
  setScrollTop,
  updateNewChatButtonState,
})
