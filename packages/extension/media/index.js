// TODO use virtual dom in  worker

let isScrolledToBottom = true

const handlers = {
  handleSubmit: async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const input = formData.get('Input')
    await rpc.invoke('handleSubmit', input)
    const previewWrapper = document.querySelector('.ImagePreviewWrapper')
    if (previewWrapper) {
      previewWrapper.classList.add('Hidden')
    }
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

  handleImageUpload: async (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }
    await rpc.invoke('handleImageUpload', file)
  },

  handleRemoveImage: async (event) => {
    event.preventDefault()
    await rpc.invoke('handleRemoveImage')
  },

  handleInput: async (event) => {
    const input = event.target.value
    await rpc.invoke('handleInput', input)
  },

  handleDragOver: (event) => {
    event.preventDefault()
    event.stopPropagation()
    const dropZone = event.currentTarget.querySelector('.DropZone')
    dropZone?.classList.remove('Hidden')
  },

  handleDragLeave: (event) => {
    event.preventDefault()
    event.stopPropagation()
    const dropZone = event.currentTarget.querySelector('.DropZone')
    dropZone?.classList.add('Hidden')
  },

  handleDrop: async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const dropZone = event.currentTarget.querySelector('.DropZone')
    dropZone?.classList.add('Hidden')

    const file = event.dataTransfer?.files[0]
    if (!file || !file.type.startsWith('image/')) {
      return
    }

    await rpc.invoke('handleImageUpload', file)
  },
}

const render = (vdom) => {
  const newApp = createDomElement(vdom)
  const oldApp = document.querySelector('.App')

  if (oldApp) {
    const activeElement = document.activeElement
    const wasAtBottom = isAtBottom(document.querySelector('.ContentWrapper'))

    // Store input value and cursor position
    const oldInput = oldApp.querySelector('[name="Input"]')
    // @ts-ignore
    const inputValue = oldInput?.value || ''
    const selectionStart = activeElement instanceof HTMLTextAreaElement ? activeElement.selectionStart : null
    const selectionEnd = activeElement instanceof HTMLTextAreaElement ? activeElement.selectionEnd : null

    oldApp.replaceWith(newApp)

    // Restore input value and focus
    const newInput = newApp.querySelector('[name="Input"]')
    if (newInput) {
      newInput.value = inputValue
      if (activeElement === oldInput) {
        newInput.focus()
        if (selectionStart !== null) {
          newInput.selectionStart = selectionStart
          newInput.selectionEnd = selectionEnd
        }
      }
    }

    if (wasAtBottom) {
      setScrollTop()
    }
  } else {
    document.body.append(newApp)
  }
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
  if (vdom.src) {
    element.src = vdom.src
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
  if (vdom.inputType === 'file') {
    element.type = 'file'
    element.accept = 'image/*'
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

const appendMessage = (vdom) => {
  const output = document.querySelector('.Output')
  const messageElement = createDomElement(vdom)
  output?.append(messageElement)
}

const updateMessage = (vdom) => {
  const output = document.querySelector('.Output')
  const contentWrapper = document.querySelector('.ContentWrapper')
  const last = output?.lastElementChild
  if (last) {
    const newMessage = createDomElement(vdom)
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

const updateForm = (vdom) => {
  const oldForm = document.querySelector('.FormContent')
  const newForm = createDomElement(vdom)
  if (oldForm) {
    oldForm.replaceWith(newForm)
  }
}

const rpc = globalThis.lvceRpc({
  initialize,
  appendMessage,
  updateMessage,
  setError,
  clear,
  clearMessages,
  setScrollPosition,
  checkIsBottom,
  setScrollTop,
  updateNewChatButtonState,
  updateForm,
  createObjectUrl: (blob) => {
    return URL.createObjectURL(blob)
  },
  render,
})

export const setValue = (element, name, value) => {
  const input = element.querySelector(`[name="${name}"]`)
  if (input) {
    input.value = value
  }
}
