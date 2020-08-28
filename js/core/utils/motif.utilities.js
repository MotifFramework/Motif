export function uAddClass(el, classNames) {
  if (el !== null && el !== undefined) {
    el.classList.add(...uMakeClassArray(classNames));
  }
}

export function uRemoveClass(el, classNames) {
  if (el !== null && el !== undefined) {
    el.classList.remove(...uMakeClassArray(classNames));
  }
}

export function uToggleClass(el, classNames) {
  if (el !== null && el !== undefined) {
    uMakeClassArray(classNames).forEach(c => {
      el.classList.toggle(c);
    });
  }
}

export function uHasClass(el, classNames) {
  let truthy = false;

  uMakeClassArray(classNames).forEach(c => {
    if (el.classList.contains(c)) {
      truthy = true;
    }
  });
  return truthy;
}

function uMakeClassArray(classNames) {
  return classNames.split(" ");
}

export function uIs(el, selector) {
  return (
    el.matches ||
    el.matchesSelector ||
    el.msMatchesSelector ||
    el.mozMatchesSelector ||
    el.webkitMatchesSelector ||
    el.oMatchesSelector
  ).call(el, selector);
}

export function uSiblings(el, selector) {
  return Array.from(el.parentNode.children).filter(child => {
    return uIs(child, selector);
  }, []);
}

export function uStopPageScrollable() {
  window.utils = window.utils || {};
  // Set a global variable so we can access it when the page opens up again
  window.utils.currScrollPosition =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : document.body.scrollTop;

  uAddClass(document.body, "presentational__no-scroll");
  uAddClass(document.documentElement, "presentational__no-scroll");
}

export function uStartPageScrollable() {
  window.utils = window.utils || {};

  let needsScrollPos = uHasClass(document.body, "presentational__no-scroll");
  uRemoveClass(document.body, "presentational__no-scroll");
  uRemoveClass(document.documentElement, "presentational__no-scroll");

  if (needsScrollPos) {
    window.scrollTo(0, window.utils.currScrollPosition);
  }
}

export function uRemoveElement(el) {
  el.parentNode.removeChild(el);
}

export function uDebounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function uSetCookie(cname, cvalue = true, exdays = 7) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function uGetCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

export function uScrollTo(
  selector,
  behavior = "smooth",
  block = "start",
  inline = "nearest"
) {
  const target = document.querySelector(selector);

  if (document.contains(target)) {
    target.scrollIntoView({ behavior, block, inline });

    if (selector.indexOf("#") > -1) {
      window.history.replaceState({}, "", window.location.pathname + selector);
    }
  } else {
    console.error("uScrollTo Error: Target does not exist.");
  }
}

export function uScrollToElem(
  selector,
  offset = 0,
  behavior = "smooth",
  replaceState = false
) {
  const target =
    typeof selector === "string" ? document.querySelector(selector) : selector;

  if (document.body.contains(target)) {
    window.scrollTo({
      top: uGetCoords(target).top + offset,
      behavior
    });

    if (
      replaceState &&
      typeof selector === "string" &&
      selector.indexOf("#") > -1
    ) {
      window.history.replaceState({}, "", window.location.pathname + selector);
    }
  } else {
    console.error("uScrollToElem Error: Target does not exist.");
  }
}

export function uFlatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? uFlatten(toFlatten) : toFlatten
    );
  }, []);
}

export function uAjaxWithResponse(
  method = "GET",
  path = "",
  async = true,
  data = null,
  contentType = "charset=UTF-8"
) {
  return new Promise((resolve, reject) => {
    verifyParams(method, "method").catch(err => {
      reject(err);
    });
    verifyParams(path, "path").catch(err => {
      reject(err);
    });
    verifyParams(async, "async").catch(err => {
      reject(err);
    });

    let req = new XMLHttpRequest();
    req.open(method, path, async);
    req.setRequestHeader("Content-Type", contentType);

    // Response received
    req.onload = () => {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      } else {
        reject(req.statusText);
      }
    };

    // Error! Something went wrong
    req.onerror = () => {
      reject(req.statusText);
    };

    req.send(data);
  });
}

function verifyParams(param = "", type = "") {
  return new Promise((resolve, reject) => {
    switch (type) {
      case "method":
        param === "GET" || param === "POST"
          ? resolve(true)
          : reject(
            new Error("Must provide valid method of either GET or POST")
          );
        break;
      case "path":
        param.length && typeof param === "string"
          ? resolve(true)
          : reject(new Error("Must provide valid URL as a string"));
        break;
      case "async":
        typeof param === "boolean"
          ? resolve(true)
          : reject(new Error("Must provide async as boolean"));
        break;
      default:
        resolve(true);
    }
  });
}

export function uCreateCustomEvent(name, data = "") {
  if (typeof window.CustomEvent === "function") {
    return new CustomEvent(name, { detail: data });
  }

  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(name, true, true, data);

  return event;
}

export function uCreateEvent(name) {
  if (typeof Event === "function") {
    return new Event(name);
  }

  var event = document.createEvent("HTMLEvents");
  event.initEvent(name, true, false);

  return event;
}

export function uAddEventListener(el, name, callback) {
  el.addEventListener(name, e => {
    const { target } = e;

    if (el === target || el.contains(target)) {
      callback.call(this, e);
    }
  });
}

export function uGetScrollPosition() {
  if (window.pageYOffset !== undefined) {
    return window.pageYOffset;
  }

  if ((document.compatMode || "") === "CSS1Compat") {
    return document.documentElement.scrollTop;
  }

  return document.body.scrollTop;
}

export function uGetCoords(el) {
  let box = el.getBoundingClientRect();

  let body = document.body;
  let docEl = document.documentElement;

  let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let clientTop = docEl.clientTop || body.clientTop || 0;
  let clientLeft = docEl.clientLeft || body.clientLeft || 0;

  let top = box.top + scrollTop - clientTop;
  let left = box.left + scrollLeft - clientLeft;
  let bottom = box.bottom + scrollTop - clientTop;

  return {
    top: Math.round(top),
    left: Math.round(left),
    bottom: Math.round(bottom)
  };
}

/*
 * https://www.sitepoint.com/get-url-parameters-with-javascript/
 */
export function uGetUrlParams(url = window.location.href) {
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  var obj = {};

  if (queryString) {
    queryString = queryString.split("#")[0];
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split("=");

      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];

      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue.toLowerCase();

      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, "");
        if (!obj[key]) obj[key] = [];

        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
