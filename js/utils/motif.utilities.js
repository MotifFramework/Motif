export function uAddClass (el, classNames) {
  if (el !== null && el !== undefined) {
    el.classList.add(...uMakeClassArray(classNames))
  }
}

export function uRemoveClass (el, classNames) {
  if (el !== null && el !== undefined) {
    el.classList.remove(...uMakeClassArray(classNames))
  }
}

export function uToggleClass (el, classNames) {
  if (el !== null && el !== undefined) {
    uMakeClassArray(classNames).forEach(c => {
      el.classList.toggle(c)
    })
  }
}

export function uHasClass (el, classNames) {
  let truthy = false

  uMakeClassArray(classNames).forEach(c => {
    if (el.classList.contains(c)) { truthy = true }
  })
  return truthy
}

function uMakeClassArray (classNames) {
  return classNames.split(' ')
}

export function uIs (el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
}

export function uSiblings (el, selector) {
  return Array.from(el.parentNode.children).filter(child => {
    return uIs(child, selector)
  }, [])
}

export function uStopPageScrollable () {
  window.utils = window.utils || {}
  // Set a global variable so we can access it when the page opens up again
  window.utils.currScrollPosition = window.pageYOffset !== undefined ? window.pageYOffset : document.body.scrollTop

  uAddClass(document.body, 'presentational__no-scroll')
  uAddClass(document.documentElement, 'presentational__no-scroll')
}

export function uStartPageScrollable () {
  window.utils = window.utils || {}
  uRemoveClass(document.body, 'presentational__no-scroll')
  uRemoveClass(document.documentElement, 'presentational__no-scroll')
  window.scrollTo(0, window.utils.currScrollPosition)
}

export function uRemoveElement (el) {
  el.parentNode.removeChild(el)
}

export function uDebounce(func, wait, immediate) {
  let timeout
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function uSetCookie(cname, cvalue = true, exdays = 7) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays*24*60*60*1000))
  const expires = "expires="+ d.toUTCString()
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

export function uGetCookie(cname) {
  const name = cname + "="
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return false
}

export function uScrollTo(selector, behavior = "smooth", block = "start", inline = "nearest") {
  const target = document.querySelector(selector)

  if (document.contains(target)) {
    target.scrollIntoView({ behavior, block, inline })

    if (selector.indexOf('#') > -1) {
      window.history.replaceState({},"", window.location.pathname + selector)
    }
  } else {
    console.error("uScrollTo Error: Target does not exist.")
  }
}

export function uFlatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? uFlatten(toFlatten) : toFlatten);
  }, [])
}

export function uAjaxWithResponse (method = 'GET', path = '', async = true, data = null, contentType = 'charset=UTF-8') {
  return new Promise((resolve, reject) => {
    verifyParams(method, 'method').catch(err => {
      reject(err)
    })
    verifyParams(path, 'path').catch(err => {
      reject(err)
    })
    verifyParams(async, 'async').catch(err => {
      reject(err)
    })

    let req = new XMLHttpRequest()
    req.open(method, path, async)
    req.setRequestHeader('Content-Type', contentType)

    // Response received
    req.onload = () => {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response)
      } else {
        reject(req.statusText)
      }
    }

    // Error! Something went wrong
    req.onerror = () => {
      reject(req.statusText)
    }

    req.send(data)
  })
}

function verifyParams (param = '', type = '') {
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'method':
        (param === 'GET' || param === 'POST') ? resolve(true) : reject(new Error('Must provide valid method of either GET or POST'))
        break
      case 'path':
        (param.length && typeof param === 'string') ? resolve(true) : reject(new Error('Must provide valid URL as a string'))
        break
      case 'async':
        (typeof param === 'boolean') ? resolve(true) : reject(new Error('Must provide async as boolean'))
        break
      default:
        resolve(true)
    }
  })
}

export function uCreateCustomEvent(name, data = "") {
  if (typeof window.CustomEvent === "function") {
    return new CustomEvent(name, { detail: data })
  }

  const event = document.createEvent("CustomEvent")
  event.initCustomEvent(name, true, true, data)

  return event
}

export function uCreateEvent(name) {
  if (typeof(Event) === 'function') {
    return new Event(name)
  }

  var event = document.createEvent('HTMLEvents');
  event.initEvent(name, true, false)

  return event
}
