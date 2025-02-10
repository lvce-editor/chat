// TODO use virtual dom in  worker

const handleTimeUpdated = async (event) => {
  const { target } = event
  const { currentTime } = target
  await rpc.invoke('handleTimeUpdate', currentTime)
}

const waitForVideoReady = (video) => {
  const handleError = (event) => {
    cleanup(event)
  }

  const handleLoad = (event) => {
    cleanup(event)
  }

  // @ts-ignore
  const { resolve, promise } = Promise.withResolvers()
  const cleanup = (event) => {
    video.removeEventListener('error', handleError)
    video.removeEventListener('loadeddata', handleLoad)
    resolve(event)
  }

  video.addEventListener('error', handleError)
  video.addEventListener('loadeddata', handleLoad)
  return promise
}

const serializeErrorEvent = (event) => {
  const { target } = event
  const { error } = target
  const { code, message } = error
  return {
    type: 'error',
    code,
    message,
  }
}

const serializeLoadEvent = (event) => {
  return {
    type: 'load',
  }
}

const serializeEvent = (event) => {
  if (event.type === 'error') {
    return serializeErrorEvent(event)
  }
  return serializeLoadEvent(event)
}

const initialize = async (remoteUrl, time) => {
  const app = document.createElement('div')
  app.className = 'App'

  const videoContent = document.createElement('div')
  videoContent.className = 'VideoContent'

  const video = document.createElement('video')
  video.className = 'VideoElement'
  video.src = remoteUrl
  video.controls = true
  if (time) {
    video.currentTime = time
  }
  video.addEventListener('timeupdate', handleTimeUpdated)

  videoContent.append(video)
  app.append(videoContent)

  document.body.append(app)

  const event = await waitForVideoReady(video)
  const serializedEvent = serializeEvent(event)
  return serializedEvent
}

const setError = (message) => {
  document.body.textContent = ''
  const $Error = document.createElement('div')
  $Error.className = 'Error'
  $Error.textContent = message
  document.body.append($Error)
}

const rpc = globalThis.lvceRpc({
  initialize,
  setError,
})
