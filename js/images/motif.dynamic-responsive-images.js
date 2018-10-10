import "lazysizes";
import getAnimationFrame from './../utils/motif.animationFrame.es6.js';

const animationFrame = getAnimationFrame();

export default function (IMAGE_CLASS = 'js-dynamic-image', multiple = 1) {
  bindImages(IMAGE_CLASS, multiple);
}

function bindImages (IMAGE_CLASS, multiple) {
  document.addEventListener('lazybeforesizes', function (ev) {
    if (ev.defaultPrevented || !ev.target.classList.contains(IMAGE_CLASS)) {
      return;
    }

    const element = ev.target;
    const url = `${element.getAttribute('data-original')}&w=${element.parentElement.offsetWidth * multiple}&h=${element.parentElement.offsetHeight * multiple}`
    
    animationFrame(() => {
      element.setAttribute('data-src', url);
      element.setAttribute('src', url);
    });
  });
}
