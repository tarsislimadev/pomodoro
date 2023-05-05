
class ApplicationError extends Error {
  extras = null

  constructor(messsage = 'Undefined error', extras = {}) {
    super(`${messsage} - ${JSON.stringify(extras, null, 4)}`)

    this.extras = extras
  }
}

class Contexter {
  cv = null
  _2d = null

  constructor(cv = document.querySelector('canvas')) {
    this.cv = cv
    this._2d = cv.getContext('2d')
  }

  background(color = 'white') {
    this._2d.fillStyle = color
    this._2d.fillRect(0, 0, this.cv.width, this.cv.height)

    return this
  }
}

class nCanvas {
  container = document.createElement('div')
  element = null
  ctx = null

  events = {
    setup: [],
    draw: [],
  }

  constructor(canvas) {
    this.element = canvas

    this.ctx = new Contexter(canvas)
  }

  append(el = document.body) {
    this.container.append(this.element)
    el.append(this.container)
    return this
  }

  setStyle(name, value = '') {
    this.element.style[name] = value

    return this
  }

  dispatch(name, data = {}) {
    const self = this
    this.events[name].forEach((fn) => fn(data))
    return self
  }

  onSetup(fn) {
    this.events.setup.push(fn)
    this.dispatch('setup', this)

    return this
  }

  onDraw(fn) {
    this.events.draw.push(fn)
    this.dispatch('draw', this)

    return this
  }
}

export class nContext {
  cv = null

  static createIn(id = 'app', {
    width = 100,
    height = 100,
  } = {}) {
    const el = document.getElementById(id)
    if (el === null) {
      throw new ApplicationError('Element not found', { id })
    }

    const cv = document.createElement('canvas')
    cv.width = width
    cv.height = height
    el.append(cv)

    return this.cv = new nCanvas(cv)
  }
}

export class Rect extends nContext {
  constructor() { }
}
