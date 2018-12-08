const sleep = require('sleep-promise')
const EventEmitter = require('events')
const debug = require('debug')('auto-dec-counter:debug')

class AutoDecCounter {
  constructor(decIntervalMs=3000) {
    this._value = 0
    this.decIntervalMs = decIntervalMs
    this._timerRunning = false
    this._events = new EventEmitter()
  }

  get value() {
    return this._value
  }

  set value(val) {
    this._value = val
    debug('set value', this._value)
    this._startDecTimer()
    this._events.emit('value')
  }

  inc(incVal) {
    this.value += incVal
  }

  dec(decVal) {
    this.value -= Math.max(decVal, 0)
  }

  async _startDecTimer() {
    if (this._timerRunning) return
    this._timerRunning = true
    while (this._value > 0) {
      await sleep(this.decIntervalMs)
      this.dec(1)
    }
    this._timerRunning = false
  }

  async waitUpdate() {
    return new Promise((resolve) => {
      this._events.once('value', resolve)
    })
  }
}

module.exports = AutoDecCounter