import Carousel from './motif.carousel';

export default function () { 
    ;[].forEach.call(document.querySelectorAll('.js-carousel'), el => {
        return new Carousel(el, {})
    })
}
