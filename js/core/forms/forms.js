import InputFilled from './motif.input-filled'
import Gauntlet from './motif.gauntlet.es6'

export default function () {
  ;[].forEach.call(document.querySelectorAll('.js-input-filled'), el => {
    return new InputFilled(el, {})
  })

  ;[].forEach.call(document.querySelectorAll('.js-gauntlet'), el => {
    return new Gauntlet(el, {})
  })
}
