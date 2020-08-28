import Reveal from "./motif.reveal.es6.js";
import { uStopPageScrollable, uStartPageScrollable } from "../utils/motif.utilities.js";

export default function () {
    new Reveal(".js-reveal", {
        type: "exclusive",
        activeClass: "is-revealed",
        visitedClass: "was-revealed"
    });

    new Reveal(".js-reveal-tab", {
        type: "radio",
        activeClass: "is-revealed",
        visitedClass: "was-revealed"
    });

    new Reveal(".js-castle-menu-reveal", {
        type: "exclusive",
        activeClass: "is-revealed",
        visitedClass: "was-revealed"
    });

    new Reveal(".js-mobile-nav-reveal", {
        type: "exclusive",
        activeClass: "is-revealed",
        visitedClass: "was-revealed",
        onShow: function () {
            uStopPageScrollable()
        },
        onHide: function () {
            uStartPageScrollable()
        }
    });
}
