// TODO use virtual dom in  worker

const initialize = async () => {
  const app = document.createElement('div')
  app.className = 'App'

  const output = document.createElement('div')
  output.className = 'Output'

  const form = document.createElement('form')
  form.className = 'Form'
  const input = document.createElement('textarea')
  input.className = 'Input'

  const button = document.createElement('button')
  button.type = 'submit'
  button.textContent = 'Send'
  form.append(input, button)
  app.append(output, form)

  document.body.append(app)
  return {}
}

const rpc = globalThis.lvceRpc({
  initialize,
})
