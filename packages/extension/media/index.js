// TODO use virtual dom in  worker

const initialize = async () => {
  const app = document.createElement('div')
  app.className = 'App'

  document.body.append(app)
  return {}
}

const rpc = globalThis.lvceRpc({
  initialize,
})
