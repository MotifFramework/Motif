/*!
 * Motif Reveal v2.3.0 (2018-6-15)
 * Show and hide things with class(es)
 *
 * Reveal accepts single or multiple IDs of target elements and, on click or 
 * hover, adds and removes classes from those target elements as well as the 
 * triggering element. It can group "reveals" so that you can dictate whether 
 * multiple targets can be active at the same time.
 *
 * Reveal keeps track of all these triggers and targets and states by creating
 * a "reference" in a `window.Reveal` object. You can see a model of that
 * reference at the bottom of the `motif.reveal-trigger.es6.js` file. This 
 * allows us to be able to track and manipulate these reveals outside of this
 * plugin. In future development, we will also be able to guarantee that
 * targets of multiple reveals and groups will retain their appropriate state.
 * 
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */

import {customEvent} from '../utils/motif.events.es6';
import RevealTrigger from './motif.reveal-trigger.es6';

const queueDoneEvent = customEvent("reveal/queue/done");

export default class Reveal {
    constructor(elems, userOptions) {
        if (typeof elems === "string") {
            elems = document.querySelectorAll(elems);
        }
        if (elems.length) {
            elems = [].slice.call(elems);
        } else {
            elems = [elems];
        }

        this.revealTriggers = elems.map(elem => {
            return new RevealTrigger(elem, userOptions);
        });

        this.executeQueue();
    }

    /**
     * Execute the queue for this reveal group
     */
    executeQueue() {
        const queue = window.Reveal.queue;

        /**
         * If there's anything in the queue, loop through it
         * and trigger a show for each one
         */
        if (queue.length) {
            queue.forEach(queueEvent => {
                document.dispatchEvent(queueEvent);
            });
        }

        // Clear queue
        window.Reveal.queue = [];

        document.dispatchEvent(queueDoneEvent);
    }
}
