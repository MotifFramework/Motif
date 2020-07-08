/*!
 * @author Travis Self
 * @author Jonathan Pacheco
 */

import { uHasClass, uAddClass, uRemoveClass } from '../utils/motif.utilities'

export default class LoadingButton {
    constructor(element, options) {
        this.element = element
        const defaults = {
            loadingClass: 'is-loading',
            loadingText: 'Loading...',
            trigger: 'submit',
            event: ''
        }
        this.settings = { ...defaults, ...options }

        if (this.element) {
            this.init()
        }
    }

    init() {
        this.prepButton()
        this.bindEvents()
    }

    prepButton() {
        this.element.innerHTML = `
      <span class="loadingButton__reset">${this.element.innerHTML}</span>
      <span class="loadingButton__loader">
        <span class="loadingButton__text">
            ${this.settings.loadingText}
        </span>
      </span>
    `
    }

    bindEvents() {
        if (this.settings.trigger == 'click') {
            this.element.addEventListener('click', ev => {
                this.initLoading()
            })
        } else if (this.settings.trigger == 'event') {
            document.addEventListener(this.settings.event, ev => {
                this.initLoading()
            })
        } else {
            this.element.form.addEventListener('submit', ev => {
                this.initLoading()
            })
        }
    }

    initLoading() {
        this.disableButton()
        this.addLoadingStyles()
    }

    disableButton() {
        this.element.disabled = true
    }

    enableButton() {
        this.element.disabled = false
    }

    addLoadingStyles() {
        if (!uHasClass(this.element, this.settings.loadingClass)) {
            uAddClass(this.element, this.settings.loadingClass)
        }
    }

    removeLoadingStyles() {
        if (uHasClass(this.element, this.settings.loadingClass)) {
            uRemoveClass(this.element, this.settings.loadingClass)
        }
    }

    reset() {
        this.enableButton()
        this.removeLoadingStyles()
    }
}
