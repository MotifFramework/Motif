import { uIs, uAddClass, uRemoveClass } from '../utils/motif.utilities'

export default class InputFilled {
    constructor(element, options) {
        this.element = element // Javascript
        const defaults = {
            stateClasses: {
                filled: 'isnt-empty',
                empty: 'is-empty',
                focused: 'focus',
                disabled: 'disabled'
            },
            fieldsSelector: 'input:not([type=submit]):not([type=hidden]), textarea, select',
            checkboxSelector: 'input[type=checkbox]'
        }
        this._defaults = defaults
        this.settings = { ...defaults, ...options }


        this.init()
    }

    init() {
        this.fieldEmptiness()
        window.addEventListener('pageshow', ev => {
            this.fieldEmptiness()
        })
    }

    fieldEmptiness(elem = this.element) {
        this.bindEvents(elem)
        this.applyState(elem)
        this.addRequired(elem)
    }
    bindEvents() {
        this.element.addEventListener('change', ev => this.applyState())
        this.element.addEventListener('focusin', ev => this.applyFocusedState())
        this.element.addEventListener('focusout', ev => this.applyUnfocusedState())
    }
    applyState(elem = this.element) {
        let emptyCheck = this.isEmpty(elem)
        let test = 'default'

        if (uIs(elem, this.settings.checkboxSelector)) {
            emptyCheck = this.isEmptyCheckbox(elem)
            test = "checkbox"
        }

        if (emptyCheck) {
            this.applyEmptyState(elem)
        } else {
            this.applyFilledState(elem)
        }
    }
    applyFilledState(elem = this.element) {
        window.requestAnimationFrame(() => {
            if (elem.classList.contains(this.settings.stateClasses.empty)) {
                elem.classList.remove(this.settings.stateClasses.empty)
            }
            if (!elem.classList.contains(this.settings.stateClasses.filled)) {
                elem.classList.add(this.settings.stateClasses.filled)
            }
        })
    }
    applyEmptyState(elem = this.element) {
        window.requestAnimationFrame(() => {
            if (elem.classList.contains(this.settings.stateClasses.filled)) {
                elem.classList.remove(this.settings.stateClasses.filled)
            }
            if (!elem.classList.contains(this.settings.stateClasses.empty)) {
                elem.classList.add(this.settings.stateClasses.empty)
            }
        })
    }

    isEmpty(elem = this.element) {

        if (!uIs(elem, this.settings.fieldsSelector)) {
            elem = elem.querySelector(this.settings.fieldsSelector)
        }
        if (elem) {
            return elem.value.trim() === ''
        }
        return true
    }

    isEmptyCheckbox(elem = this.element) {
        if (!uIs(elem, this.settings.checkboxSelector)) {
            elem = elem.querySelector(this.settings.checkboxSelector)
        }
        if (elem) {
            return elem.checked ? false : true
        }
        return false
    }

    applyFocusedState(elem = this.element) {
        window.requestAnimationFrame(() => {
            if (!elem.classList.contains(this.settings.stateClasses.focused)) {
                elem.classList.add(this.settings.stateClasses.focused)
            }
        })
    }
    applyUnfocusedState(elem = this.element) {
        window.requestAnimationFrame(() => {
            if (elem.classList.contains(this.settings.stateClasses.focused)) {
                elem.classList.remove(this.settings.stateClasses.focused)
            }

            //special case for password hints
            this.passwordHint = elem.querySelector('.woocommerce-password-hint')
            this.passwordLabel = elem.querySelector('.woocommerceForms__password-label')
            this.passwordInput = elem.querySelector('.woocommerceForms__password-input')
            this.registerBtn = document.querySelector('.woocommerce-form-register__submit')
            if (elem.contains(this.passwordHint)) {
                uRemoveClass(this.passwordLabel, 'is-valid')
                uAddClass(this.passwordLabel, 'is-invalid')
                uRemoveClass(this.passwordInput, 'is-valid')
                uAddClass(this.passwordInput, 'is-invalid')
                this.registerBtn.setAttribute("disabled", true);
            }
        })
    }

    //This is a special case for the woocommerce forms

    addRequired(elem = this.element) {
        var required = elem.querySelector('.required')
        var input = elem.querySelector('input')
        var select = elem.querySelector('select')

        if (required) {
            if (input) {
                input.required = true
            }
            if (select) {
                select.required = true
            }
        }
    }
}
