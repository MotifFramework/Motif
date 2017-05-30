import $ from 'jquery'
import Reveal from 'motif-reveal'
import Tabs from 'motif-tabs'

export default function () {
  initReveals()
  initTabs()
  initIcons()
}

function initReveals () {
  $('.canvas-trigger').reveal({
    'type': 'exclusive',
    'activeClass': 'is-active',
    'visitedClass': 'was-active'
  })
  $('.js-reveal').reveal({
    'type': 'exclusive',
    'activeClass': 'is-revealed',
    'visitedClass': 'was-revealed'
  })
  $('.js-fade').reveal({
    'activeClass': 'is-faded',
    'visitedClass': 'was-faded'
  })
  $('.js-expand').reveal({
    'type': 'exclusive',
    'activeClass': 'is-expanded',
    'visitedClass': 'was-expanded'
  })
}

function initTabs () {
  $('.js-tabs').tabs({
    'cssTransition': Modernizr.csstransitions
  })
}

function initIcons () {
  var request = new XMLHttpRequest()
  request.open('GET', '/resources/motif/dist/icons/icons-sprite.svg', true)

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      document.body.children[0].insertAdjacentHTML('beforebegin', request.responseText)
    } else {
      console.error('Icons could not be fetched.')
    }
  }

  request.onerror = function () {
    console.error('Icons could not be fetched.')
  }

  request.send()
}
