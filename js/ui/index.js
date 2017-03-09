import $ from 'jquery'
import Reveal from 'motif-reveal'
import Tabs from 'motif-tabs'

export default function () {
  initReveals()
  initTabs()
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
