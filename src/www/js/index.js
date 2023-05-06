const app = document.getElementById('app')

const state = {
  index: 0,
  clock: 0,
  intervalId: 0,
  startTime: 0,
  endTime: 0,
  totalTime: 0,
}

const timeInputs = []

const padLeft = (text, pad = ' ', length = 1) => {
  while (text.toString().length < length) {
    text = pad.toString() + text.toString()
  }

  return text.toString()
}

const calcTime = () => {
  const time = Math.floor((state.endTime - Date.now()) / 1e3)
  const hour = Math.floor(time / (60 * 60))
  const min = Math.floor(time / 60) - (hour * 60)
  const sec = time - (min * 60) - (hour * 60 * 60)

  return ({ hour, min, sec, })
}

const timeToString = () => {
  const { hour, min, sec } = calcTime()
  return [hour, min, sec].map((t) => padLeft(t, '0', 2)).join(':')
}

const startClock = () => {
  state.intervalId = window.setInterval(() => {
    timeSpan.innerText = timeToString()
  }, 1e3)
}

const stopClock = () => {
  window.clearInterval(state.intervalId)
}

const clearElement = (el = document.createElement('div')) => {
  while (el.children.length) {
    el.children[0].remove()
  }
}

// // //

const createElement = {
  input: (type = 'text') => {
    const el = document.createElement('input')
    el.type = type
    el.style.boxShadow = '0rem 0rem 0rem calc(1rem / 8) #000000'
    el.style.padding = 'calc(1rem / 4)'
    el.style.outline = 'none'
    el.style.border = 'none'
    el.style.margin = '0rem'
    return el
  },
  div: () => {
    const el = document.createElement('div')
    el.style.padding = 'calc(1rem / 2) 0rem'
    el.style.outline = 'none'
    el.style.border = 'none'
    el.style.margin = '0rem'
    return el
  },
  span: () => {
    const el = document.createElement('span')
    el.style.padding = 'calc(1rem / 2) 0rem'
    el.style.outline = 'none'
    el.style.border = 'none'
    el.style.margin = '0rem'
    return el
  },
  button: () => {
    const el = document.createElement('button')
    el.style.padding = 'calc(1rem / 2)'
    el.style.margin = 'calc(1rem / 4)'
    el.style.border = 'none'
    el.style.cursor = 'pointer'
    return el
  },
  image: ({ src, alt = 'image', width, height } = {}) => {
    const el = document.createElement('img')
    el.src = src
    el.alt = alt
    if (width) el.width = width
    if (height) el.height = height
    return el
  },
}

const createWorkTime = (num = 0) => {
  const els = []

  const workLabel = createElement.div()
  workLabel.innerText = `Working ${num}`
  els.push(workLabel)

  const workTime = createElement.input('number')
  workTime.value = 25
  workTime.dataset['type'] = 'working'
  els.push(workTime)

  const pauseLabel = createElement.div()
  pauseLabel.innerText = `Pause ${num}`
  els.push(pauseLabel)

  const pauseTime = createElement.input('number')
  pauseTime.value = 5
  pauseTime.dataset['type'] = 'pause'
  els.push(pauseTime)

  return els
}

const addTimeButton = createElement.button()
addTimeButton.innerText = 'Add time'
addTimeButton.addEventListener('click', () => {
  const els = createWorkTime(++state.index)
  els.map((el) => app.append(el))

  els.filter((el) => el.tagName === 'INPUT')
    .map(({ value, dataset }) => timeInputs.push({ type: dataset['type'], value, }))
})
app.append(addTimeButton)

const startButton = createElement.button()
startButton.innerText = 'Start'
startButton.style.margin = 'calc(1rem / 8) calc(1rem / 1)'
startButton.addEventListener('click', () => {
  clearElement(startButton)

  if (startButton.innerText === 'Start') {
    state.startTime = Date.now()

    const minutes = timeInputs.reduce((prev, cur) => +prev + +cur.value, 0)
    state.totalTime = minutes * 60 * 1000

    state.endTime = state.startTime + state.totalTime

    startClock()

    startButton.innerText = 'Stop'
  } else {
    stopClock()

    startButton.innerText = 'Start'
    timeSpan.innerText = 'Pause'
  }
})
app.append(startButton)

const timeSpan = createElement.span()
timeSpan.innerText = '00:00'
app.append(timeSpan)
