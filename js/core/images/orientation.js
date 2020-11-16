import { uAddClass } from '../utils/motif.utilities'

export default function () {
    ;[].forEach.call(document.querySelectorAll('.js-orientation'), el => {
        return new Orientation(el)
    })
}

class Orientation {
    constructor(element, options = {}) {
        this.element = element
        this._defaults = {}
        this.settings = { ...this._defaults, ...options }

        this.init()
    }

    init() {

        if (this.element.src.length) {
            this.getOrientation()
        } else {
            this.element.onload = this.getOrientation()
        }
    }

    getOrientation() {
        let s = this.element.naturalWidth >= this.element.naturalHeight ? 'orientation__horizontal' : 'orientation__vertical'

        uAddClass(this.element, s)
        uAddClass(this.element.parentNode, s)
    }
}
