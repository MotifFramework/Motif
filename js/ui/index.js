import Reveal from "./motif.reveal.es6";
import Slider from "./motif.slider";

export default function () {
  console.log('init default')
  initReveals();
  initTabs();
  initIcons();
  initSlider()
}

function initReveals() {
  new Reveal(".canvas-trigger", {
    type: "exclusive",
    activeClass: "is-active",
    visitedClass: "was-active"
  });
  new Reveal(".js-reveal", {
    type: "exclusive",
    activeClass: "is-revealed",
    visitedClass: "was-revealed"
  });
  new Reveal(".js-fade", {
    activeClass: "is-faded",
    visitedClass: "was-faded"
  });
  new Reveal(".js-expand", {
    type: "exclusive",
    activeClass: "is-expanded",
    visitedClass: "was-expanded"
  });
}

function initTabs() {
  new Reveal(".js-tabs", {
    type: "radio"
  });
}

function initIcons() {
  var request = new XMLHttpRequest();
  request.open("GET", "/resources/motif/dist/icons/icons-sprite.svg", true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      document.body.children[0].insertAdjacentHTML(
        "beforebegin",
        request.responseText
      );
    } else {
      console.error("Icons could not be fetched.");
    }
  };

  request.onerror = function () {
    console.error("Icons could not be fetched.");
  };

  request.send();
}

function initSlider() {
  console.log('initialize slider')
  ;[].forEach.call(document.querySelectorAll('.js-slider'), el => {
    console.log('SLIDER')
    return new Slider(el, {
      trigger: 'hover',
    })
  })
}
