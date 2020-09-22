import Slider from './motif.slider';

export default function () { 
    ;[].forEach.call(document.querySelectorAll('.js-slider'), el => {
        return new Slider(el, {})
    })
}
