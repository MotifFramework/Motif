/**
 * SyncInput
 *
 * * * * * * *
 *
 * A simple plugin to "sync" two elements together on a page. There are two elements:
 *     Initiator -> The element that the values will come from
 *     Target -> The element that will be updated by the value of the initiator
 *
 *
 *
 * Requirements
 *     - Initiator must be of type `<input>` or `<select>` or `<textarea>`
 *     - data-sync-type attribute must reference either a "name" or "id" attribute
 *     - You can reference multiple elements by separating the classes/ids with spaces
 *
 *
 *
 * Markup
 * Input -> input:
 *     <input class="js-sync-input" data-sync-input="example">
 *     <input name="example">
 *
 * Input -> HTML element
 *     <input class="js-sync-input" data-sync-input="example">
 *     <p id="example"></p>
 *
 * Input -> multiple elements
 *     <input class="js-sync-input" data-sync-input="example-id example-name">
 *     <input name="example-name">
 *     <p id="example-id">
 *
 *  Input -> custom attribute on element
 *     <input class="js-sync-input" data-sync-input="example" data-sync-input-attr="data-set">
 *     <div id="example" data-set="">
 *
 */

import { uCreateEvent, uFlatten } from '../utils/motif.utilities'

const defaults= {
  dispatchChange: true
}
export default class SyncInput {
  constructor(element, options) {
    this.element   = element
    this.settings  = {...defaults, ...options}
    this._defaults = defaults

    this.init()
  }

  init() {
    window.utils = window.utils || {}
    window.utils.syncInput = window.utils.syncInput || []

    const targetNames = this.element.getAttribute('data-sync-input').split(" ")

    this.allTargets = []

    ;[].forEach.call(targetNames, (n, i) => {
      this.allTargets[i] = []
      ;[].forEach.call(document.querySelectorAll('[name="'+n+'"]'), el => {
        this.allTargets[i].push(el)
      })

      if (!this.allTargets[i].length || this.allTargets[i] === undefined) {
        this.allTargets[i].push(document.getElementById(n))
      }
    })

    if (!this.allTargets[0].length) {
      console.log(new Error('SyncInput: Target element(s) not found.'))
    } else {
      this.allTargets = uFlatten(this.allTargets)
    }

    this.element.addEventListener('change', this.handleChange.bind(this))

    let storeElement = true
    // First time load
    if (
      (!this.element.hasAttribute('data-sync-input-on-load') || this.element.getAttribute('data-sync-input-on-load') == "true") &&
      (!this.element.hasAttribute('name') || window.utils.syncInput.indexOf(this.element.getAttribute('name')) < 0) &&
      this.settings.dispatchChange
    ) {

      // we don't want to dispatch an event on an unchanged radio button
      if (this.element.type == 'radio') {

        if (this.element.checked) {
          this.element.dispatchEvent(uCreateEvent('change'))
        } else {
          storeElement = false
        }
      } else {
        this.element.dispatchEvent(uCreateEvent('change'))
      }
    }

    if (this.element.hasAttribute('name') && storeElement) {
      window.utils.syncInput.push(this.element.getAttribute('name'))
    }
  }

  handleChange(e) {
    ;[].forEach.call(this.allTargets, el => {
      if (this.element.hasAttribute('data-sync-input-attr')) {
        el.setAttribute(this.element.getAttribute('data-sync-input-attr'), this.element.value)
      }
      else if (el.tagName == "INPUT" || el.tagName == "SELECT" || el.tagName == "TEXTAREA") {
        el.value = this.element.value
      } else {
        el.innerHTML = this.element.value
      }

      if (this.settings.dispatchChange) {
        el.dispatchEvent(uCreateEvent('change'))
      }
    })
  }
}
