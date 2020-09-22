/*!
 * Motif Gauntlet v2.1.0 (2019-06)
 * Trials and tribulations to validate your forms
 * http://getmotif.com
 *
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 * @author Travis Self <travis@lifeblue.com>
 */

import { uClosest, uIs } from '../utils/motif.utilities'

const DEFAULT_MESSAGES = {
  email: "Please make sure you've entered a valid email.",
  emailConfirm: 'Please check that your email addresses match.',
  text: 'Please complete this required field.',
  totals: "Please check that your totals don't exceed the limit",
  tel: "Please make sure you've entered a valid phone number.",
  search: 'Please enter a search term.',
  number: 'Please enter a valid number.',
  error: 'There was an error.',
  password: 'Please check that your password matches the criteria.',
  passwordConfirm: 'Please check that your passwords match.',
  radio: 'Please choose one of the options above.',
  checkbox: 'Please check at least one option.',
  select: 'Please select an option.',
}

const DEFAULT_PATTERNS = {
  tel: '^((([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+)*$',
}

const DEFAULT_OPTIONS = {
  alertClasses: {
    error: 'is-invalid',
    success: 'is-valid',
  },
  labelClasses: {
    error: 'is-invalid',
    success: 'is-valid',
  },
  inputClasses: {
    error: 'is-invalid',
    success: 'is-valid',
  },
  submitClasses: {
    enabled: 'enabled',
    disabled: 'disabled',
  },
  report: true,
  reportSuccess: false,
  ajaxSubmit: null,
  scrollToError: true,
  addTest: [],
  disableSubmit: false,
}

export default class Gauntlet {
  constructor(elem, options = {}) {
    this.form = elem
    this.inputs = this.getInputs()
    this.submits = this.getSubmits()
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.patterns = { ...DEFAULT_PATTERNS, ...options.patterns }
    this.messages = { ...DEFAULT_MESSAGES, ...options.messages }
    this.addTests = this.options.addTests || []
    this.prepForm()
    this.bindEvents()
    this.form.noValidate = true
    this.validateForm()
  }

  /**
   * Gets validation-eligible form elements in an Array
   *
   * @return {Array}
   */
  getInputs() {
    return Array.from(this.form.elements).filter(elem =>
      uIs(elem, 'input:not([type=submit]), select, textarea')
    )
  }

  /**
   * Gets `submit` elements in an Array
   *
   * @return {Array}
   */
  getSubmits() {
    return Array.from(this.form.querySelectorAll('[type=submit]')).filter(
      submit => submit.form && submit.form === this.form
    )
  }

  /**
   * Loops through eligible inputs and updates them
   * for extra functionality
   */
  prepForm() {
    this.getInputs().map(input => {
      this.prepInputPattern(input)
      this.prepConfirmInputs(input)
    })
  }

  /**
   * Updates the `pattern` property to leverage browser-
   * native pattern validation
   *
   * @param {HTMLElement} input
   * @return {HTMLElement}
   */
  prepInputPattern(input) {
    if (!input.pattern && this.patterns[input.type]) {
      input.pattern = this.patterns[input.type]
    }
    return input
  }

  /**
   * If an element is confirming another input, mark the
   * _other_ input as being "confirmed-by". Not a fan
   * of the side effects here
   *
   * @param {HTMLElement} input
   * @return {HTMLElement}
   */
  prepConfirmInputs(input) {
    if (this.confirms(input)) {
      const confirms = this.getConfirmedInput(input)

      if (confirms && input.id) {
        confirms.setAttribute('data-gauntlet-confirmedby', input.id)
      } else {
        input.removeAttribute('data-gauntlet-confirms')
      }
    }
    return input
  }

  /**
   * Does this input confirm another?
   *
   * @param {HTMLElement} input
   * @return {Boolean}
   */
  confirms(input) {
    return input.hasAttribute('data-gauntlet-confirms')
  }

  /**
   * Get the input being _confirmed_ by another element
   *
   * @param {HTMLElement} input
   * @return {HTMLElement|Boolean}
   */
  getConfirmedInput(input) {
    const confirms = this.getInputs().filter(otherInput => {
      if (otherInput.id) {
        return otherInput.id === input.getAttribute('data-gauntlet-confirms')
      }
    })

    if (confirms.length) {
      return confirms[0]
    }

    return false
  }

  /**
   * Bind submit and delegated change events
   * on the form element
   */
  bindEvents() {
    this.form.addEventListener('change', ev => {
      const input = ev.target
      if (!uIs(input, 'input, select, textarea')) {
        return true
      }

      this.testInput(input)
      this.validateForm()
    })
    this.form.addEventListener('focusout', ev => {
      const input = ev.target
      if (!uIs(input, 'input, select, textarea')) {
        return true
      }

      this.testInput(input)
      this.validateForm()
    })
    this.form.addEventListener('click', ev => {
      const submit = uClosest(ev.target, '[type="submit"]')
      if (submit && submit.form && submit.form === this.form) {
        this.clearValidation()
        const report = this.validateForm(true)

        if (report.invalid.length) {
          ev.preventDefault()
        }
      }
    })
  }

  /**
   * Sequence of events involved in testing a
   * single input
   *
   * @param {HTMLElement} input
   */
  testInput(input) {
    this.clearInputValidation(input)

    let isValid = this.testInputValidity(input)

    if (isValid && input.value !== '') {
      this.setInputAsValid(input)
    } else if (!isValid) {
      this.setInputAsInvalid(input)
    }
  }

  /**
   * Removes classes and messaging around validation
   * of a single input
   *
   * @param {HTMLElement} input
   */
  clearInputValidation(input) {
    const { inputClasses, labelClasses } = this.options
    const label = this.getLabel(input)

    if (input.classList.contains(inputClasses.error)) {
      input.classList.remove(inputClasses.error)
    }
    if (input.classList.contains(inputClasses.success)) {
      input.classList.remove(inputClasses.success)
    }
    if (label) {
      if (label.classList.contains(labelClasses.error)) {
        label.classList.remove(labelClasses.error)
      }
      if (label.classList.contains(labelClasses.success)) {
        label.classList.remove(labelClasses.success)
      }
    }

    if (this.options.report) {
      this.removeReportMessage(input)
    }
  }

  /**
   * Removes validation message from DOM
   *
   * @param {HTMLElement} input
   */
  removeReportMessage(input) {
    const needsGroupTest = this.needsGroupTest(input)
    let wrapper
    let messageContainer

    if (needsGroupTest && uClosest(input, 'fieldset')) {
      wrapper = uClosest(input, 'fieldset')
    } else if (this.getLabel(input)) {
      wrapper = this.getLabel(input)
    } else {
      wrapper = input.parentElement
    }

    if(input.dataset.gauntletErrorContainer) {
      messageContainer = document.querySelector(input.dataset.gauntletErrorContainer)
      messageContainer.classList.remove(this.options.inputClasses.error)
    } else {
      messageContainer = wrapper.querySelector('[aria-live]')
    }

    if (messageContainer) {
      messageContainer.innerHTML = ''
    } else {
      if (needsGroupTest) {
        const inputMessage = wrapper.querySelector('.elements__input-alert-msg')
        if (inputMessage) {
          inputMessage.parentElement.removeChild(inputMessage)
        }
      } else if (
        input.nextElementSibling &&
        uIs(input.nextElementSibling, '.elements__input-alert-msg')
      ) {
        input.parentNode.removeChild(input.nextElementSibling)
      }
    }
  }

  /**
   * Determines if the input needs to be validated as
   * part of a group
   *
   * @param {HTMLElement} input
   */
  needsGroupTest(input) {
    return input.type === 'checkbox' || input.type === 'radio'
  }

  /**
   * Actual validation of a single input
   *
   * @param {HTMLElement} input
   * @return {Boolean} Is the input valid or invalid?
   */
  testInputValidity(input) {
    let isValid = input.checkValidity()

    if (uIs(input, 'select') && !isValid && input.disabled) {
      return true
    }

    if (!this.needsGroupTest(input) && !isValid) {
      return false
    }

    if (!this.needsConfirmation(input) && input.value === '') {
      return true
    }
    const tests = this.getInputTests(input)

    if (tests.length) {
      isValid = tests.reduce((prev, test, index) => {
        if (typeof test === 'function' && !test.call(this, input)) {
          return false
        }

        if (typeof test === 'string' && !this[test].call(this, input)) {
          return false
        }

        return true
      }, isValid)
    }

    return isValid
  }

  /**
   * Does this input need to actively confirm
   * another input?
   *
   * @param {HTMLElement} input
   * @return {Boolean}
   */
  needsConfirmation(input) {
    if (this.confirms(input)) {
      const confirms = this.getConfirmedInput(input)
      if (confirms) {
        if (confirms.required || confirms.value !== '') {
          return true
        }
      }
    }
    return false
  }

  /**
   * Get input that is _confirming_ the current
   * input
   *
   * @param {HTMLElement} input
   * @return {HTMLElement|Boolean}
   */
  getConfirmedByInput(input) {
    const confirmedBy = this.getInputs().filter(otherInput => {
      if (otherInput.id) {
        return otherInput.id === input.getAttribute('data-gauntlet-confirmedby')
      }
    })
    if (confirmedBy.length) {
      return confirmedBy[0]
    }
    return false
  }

  /**
   * Gather extra tests to run against this input
   *
   * @param {HTMLElement} input
   * @return {Array}
   */
  getInputTests(input) {
    let tests = []
    if (this.confirms(input)) {
      tests.push('confirmTest')
    }
    if (this.needsGroupTest(input)) {
      tests.push('checkboxTest')
    }
    if (this.addTests.length) {
      let userTests = this.addTests.reduce((prev, test, index) => {
        if (test.condition.call(this, input)) {
          return [...prev, test.test]
        }
        return prev
      }, [])

      tests = [...tests, ...userTests]
    }
    return tests
  }

  /**
   * Applies classes and messaging for a single valid input
   *
   * @param {HTMLElement} input
   * @param {Boolean} report - Should we report the validity with a message?
   */
  setInputAsValid(input, report = this.options.reportSuccess) {
    const { inputClasses, labelClasses } = this.options
    const label = this.getLabel(input)

    input.classList.add(inputClasses.success)
    input.removeAttribute('aria-invalid')

    if (label) {
      label.classList.add(labelClasses.success)
    }

    if (report) {
      this.addReportMessage(
        input,
        this.createReportMessage('success', 'Good job!')
      )
    }
  }

  /**
   * Drop a validation (valid or invalid) message next
   * to the input element
   *
   * @param {HTMLElement} input
   * @param {HTMLElement} message - Feedback message for the input
   */
  addReportMessage(input, message) {
    const needsGroupTest = this.needsGroupTest(input)
    let wrapper
    let messageContainer

    if (needsGroupTest && uClosest(input, 'fieldset')) {
      wrapper = uClosest(input, 'fieldset')
    } else if (this.getLabel(input)) {
      wrapper = this.getLabel(input)
    } else {
      wrapper = input.parentElement
    }

    if(input.dataset.gauntletErrorContainer) {
      messageContainer = document.querySelector(input.dataset.gauntletErrorContainer)
      messageContainer.classList.add(this.options.inputClasses.error)
    } else {
      messageContainer = wrapper.querySelector('[aria-live]')
    }

    if (messageContainer) {
      messageContainer.innerHTML = message.innerHTML
    } else {
      if (needsGroupTest) {
        wrapper.appendChild(message)
      } else {
        input.insertAdjacentHTML('afterend', message.outerHTML)
      }
    }
  }

  /**
   * Construct a feedback message element
   *
   * @param {String} type - "error" or "success"
   * @param {String} message - Feedback message text
   * @return {HTMLElement}
   */
  createReportMessage(type, message) {
    const messageElem = document.createElement('strong')
    const classes =
      type === 'error'
        ? ['elements__input-alert-msg', 'elements__input-alert-msg']
        : ['elements__input-alert-msg', 'elements__input-alert-msg']
    messageElem.classList.add(...classes)
    messageElem.innerHTML = message
    return messageElem
  }

  /**
   * Applies classes and messaging for a single invalid input
   *
   * @param {HTMLElement} input
   * @param {Boolean} report - Should we report the invalidity with a message?
   */
  setInputAsInvalid(input, report = this.options.report) {
    const { inputClasses, labelClasses } = this.options
    const label = this.getLabel(input)

    input.classList.add(inputClasses.error)
    input.setAttribute('aria-invalid', true)

    if (label) {
      label.classList.add(labelClasses.error)
    }

    if (report) {
      const message = this.getMessage(input)
      this.addReportMessage(input, this.createReportMessage('error', message))
    }
  }

  setSubmitsAsEnabled() {
    const { enabled, disabled } = this.options.submitClasses

    this.submits.map(button => {
      if (button.classList.contains(disabled)) {
        button.classList.remove(disabled)
      }

      if (!button.classList.contains(enabled)) {
        button.classList.add(enabled)
      }

      if (this.options.disableSubmit) {
        button.disabled = false
      }
    })
  }

  setSubmitsAsDisabled() {
    const { enabled, disabled } = this.options.submitClasses

    this.submits.map(button => {
      if (button.classList.contains(enabled)) {
        button.classList.remove(enabled)
      }

      if (!button.classList.contains(disabled)) {
        button.classList.add(disabled)
      }

      if (this.options.disableSubmit) {
        button.disabled = true
      }
    })
  }

  /**
   * Get the corresponding feedback message based
   * on the type of input
   *
   * @param {HTMLElement} input
   * @return {String}
   */
  getMessage(input) {
    if (input.hasAttribute('data-gauntlet-error')) {
      return input.getAttribute('data-gauntlet-error')
    }

    let inputType = this.getInputType(input)
    if (this.confirms(input)) {
      inputType = `${inputType}Confirm`
    }
    return this.messages[inputType] || this.messages['text']
  }

  /**
   * Get input "type"
   *
   * @param {HTMLElement} input
   * @return {String}
   */
  getInputType(input) {
    let inputType = input.type

    if (!inputType || inputType === 'select-one') {
      if (uIs(input, 'select')) {
        return 'select'
      }
      if (uIs(input, 'textarea')) {
        return 'textarea'
      }
      return 'text'
    }

    return inputType
  }

  /**
   * Clear validation on the entire form
   */
  clearValidation() {
    this.getInputs().map(input => {
      this.clearInputValidation(input)
    })
  }

  /**
   * Run through validation for every eligible
   * element in the form
   *
   * @return {Object} A report of all valid and invalid elements
   */
  validateForm(reportFullForm = false) {
    const invalidElems = this.getInputs().filter(input => {
      return !this.testInputValidity(input)
    })
    const validElems = this.getInputs().filter(input => {
      return this.testInputValidity(input) && input.value !== ''
    })

    if (this.submits.length) {
      if (invalidElems.length) {
        this.setSubmitsAsDisabled()
      } else {
        this.setSubmitsAsEnabled()
      }
    }

    if (reportFullForm && invalidElems.length) {
      invalidElems.map(invalidElem => {
        this.setInputAsInvalid(invalidElem)
      })
    }

    if (validElems.length) {
      validElems.map(validElem => {
        this.setInputAsValid(validElem)
      })
    }

    return {
      valid: validElems,
      invalid: invalidElems,
    }
  }

  /**
   * Test whether _at least one_ input of the group
   * is valid
   *
   * @param {HTMLElement} input
   * @return {Boolean}
   */
  checkboxTest(input) {
    if (!input.required) {
      return true
    }

    const validCheckboxes = this.getInputs().filter(otherInput => {
      return (
        otherInput.type === input.type &&
        otherInput.name === input.name &&
        otherInput.checkValidity()
      )
    })

    return !!validCheckboxes.length
  }

  /**
   * Checks if input's value matches that of the
   * input it's meant to confirm
   *
   * @param {HTMLElement} input
   * @return {Boolean}
   */
  confirmTest(input) {
    return input.value === this.getConfirmedInput(input).value
  }

  getLabel(el) {
    if (el.labels && el.labels.length) {
      return el.labels[0]
    }

    const closestLabel = uClosest(el, 'label')

    if (closestLabel) {
      return closestLabel
    }

    return false
  }
}
