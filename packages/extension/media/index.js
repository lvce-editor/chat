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

  handleKeyDown: async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await rpc.invoke('handleEnter')
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

const isAtBottom = (element) => {
  const { scrollTop, scrollHeight, clientHeight } = element
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 10
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

const setValue = (name, value) => {
  const input = document.querySelector(`[name="${name}"]`)
  if (input && input instanceof HTMLTextAreaElement) {
    input.value = value
  }
}

const focusInput = () => {
  const input = document.querySelector('.Input')
  if (input) {
    // @ts-ignore
    input.focus()
  }
}

const rpc = globalThis.lvceRpc({
  setScrollPosition,
  checkIsBottom,
  setScrollTop,
  setValue,
  createObjectUrl: (blob) => {
    return URL.createObjectURL(blob)
  },
  render,
  focusInput,
})
