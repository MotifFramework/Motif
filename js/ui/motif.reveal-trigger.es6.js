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
 * reference at the bottom of this file. This allows us to be able to track
 * and manipulate these reveals outside of this plugin. In future development,
 * we will also be able to guarantee that targets of multiple reveals and 
 * groups will retain their appropriate state.
 * 
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */

import getAnimationFrame from "../utils/motif.animationFrame.es6";
import {customEvent} from "../utils/motif.events.es6";

const DEFAULTS = {
    trigger: "click",
    type: "default",
    target: "data-reveal",

    // Classes
    activeClass: "is-current",
    visitedClass: "is-visited",

    // Callbacks
    onInit: null,
    beforeReveal: null,
    onShow: null,
    onHide: null,
    returns: false
};

const GROUP_ATTR = "data-reveal-group";
const CURRENT_ATTR = "data-reveal-current";
const HIDE_ATTR = "data-reveal-hide";
const FOR_ATTR = "data-reveal-for";
const OPTIONS_ATTR = "data-reveal-options";

let counter = 0;
const animationFrame = getAnimationFrame();

export default class RevealTrigger {
    constructor(elem, userOptions) {
        // Init Vars
        this.elem = elem;
        this.identity = this.elem.hasAttribute("id")
            ? this.elem.id
            : `reveal-trigger-${counter}`;
        this.group = this.elem.hasAttribute(GROUP_ATTR)
            ? this.elem.getAttribute(GROUP_ATTR)
            : false;
        this.reference = false;
        this.config = userOptions;
        this.metadata = this.elem.hasAttribute(OPTIONS_ATTR)
            ? JSON.parse(this.elem.getAttribute(OPTIONS_ATTR))
            : {};
        this.options = Object.assign({}, DEFAULTS, this.config, this.metadata);
        this.events = {
            beforeShow: customEvent(`reveal/${this.identity}/before/show`),
            afterShow: customEvent(`reveal/${this.identity}/after/show`),
            show: customEvent(`reveal/${this.identity}/show`),
            beforeHide: customEvent(`reveal/${this.identity}/before/hide`),
            afterHide: customEvent(`reveal/${this.identity}/after/hide`),
            hide: customEvent(`reveal/${this.identity}/hide`),
            init: customEvent(`reveal/${this.identity}/init`)
        };
        this.init();
    }

    /**
     * Create a new target for the reference
     * @param  {object} elem
     * @return {object}
     */
    newReferenceTarget(elem) {
        return {
            elem: elem,
            targets: [],
            fors: [],
            hide: [],
            current: false
        };
    }

    /**
     * Create a new group for the reference
     * @return {object}
     */
    newReferenceGroup() {
        return {
            type: this.options.type,
            triggers: []
        };
    }

    /**
     * Initialize the instance
     * @return {object}
     */
    init() {
        // Create window.Reveal reference table
        this.createReference.call(this);

        // Bind optional callbacks
        this.bindCallbacks.call(this);

        // Bind this reveal trigger
        this.bindTrigger.call(this);

        // Make sure trigger targets are listening
        this.bindTargets.call(this);

        // Initialize this trigger
        this.initTrigger.call(this);

        // Update the reveal counter, which we use
        // for naming in the reference table
        counter += 1;

        // Finally, trigger this reveal as initialized
        // for any listening callbacks
        document.dispatchEvent(this.events.init);

        return this;
    }

    /**
     * Create the Reveal reference in the window
     */
    createReference() {
        // If the reference table doesn't exist...
        if (!window.Reveal) {
            // Create it
            window.Reveal = {
                triggers: {},
                groups: {},
                queue: []
            };
        }
    }

    /**
     * Subscribe to Reveal events if the user has
     * passed any callbacks
     */
    bindCallbacks() {
        // Check if any of the callbacks are actual
        // functions, then have the document watch
        // for their triggers
        if (typeof this.options.onInit === "function") {
            document.addEventListener(
                `reveal/${this.identity}/init`,
                this.options.onInit.bind(
                    this,
                    this.elem,
                    this.reference.targets
                )
            );
        }
        if (typeof this.options.onShow === "function") {
            document.addEventListener(
                `reveal/${this.identity}/after/show`,
                this.options.onShow.bind(
                    this,
                    this.elem,
                    this.reference.targets
                )
            );
        }
        if (typeof this.options.onHide === "function") {
            document.addEventListener(
                `reveal/${this.identity}/after/hide`,
                this.options.onHide.bind(
                    this,
                    this.elem,
                    this.reference.targets
                )
            );
        }
    }

    /**
     * Bind the user-specified trigger (click or hover)
     * to process on activation
     */
    bindTrigger() {
        // If we have a click trigger...
        if (this.options.trigger === "click") {
            // Bind this trigger on click
            this.elem.addEventListener("click", () => {
                // HERE

                // ...to process the trigger
                this.processBeforeTrigger();

                // ...and return based on the user's preference
                return this.options.returns;
            });

            // Otherwise, if it's a hover trigger...
        } else if (this.options.trigger === "hover") {
            // ... Do a simple bind...
            this.elem.addEventListener("mouseenter", () => {
                this.processBeforeTrigger();
            });
            this.elem.addEventListener("mouseleave", () => {
                this.processBeforeTrigger();
            });
        }
    }

    /**
     * Determine what kind of action we are
     * about to take
     * @return {boolean|string}
     */
    getAction() {
        // If this trigger is already current...
        if (this.reference.current === true) {
            // Check if it's a radio
            if (this.options.type === "radio") {
                // If it is, let's ignore and bail
                return false;
            }
            // If it's NOT a radio...
            // ...we should hide
            return "hide";
        }
        // If it's NOT current
        // ...let's show
        return "show";
    }

    /**
     * Set a promise if user has specified a `beforeReveal` check
     */
    processBeforeTrigger() {
        const action = this.getAction();

        /**
         * Bail early if the trigger results in no action
         */
        if (!action) {
            return true;
        }
        if (typeof this.options.beforeReveal === "function") {
            /**
             * Set a promise before triggering the reveal
             */
            this.promiseBeforeTrigger(this.options.beforeReveal, action)
                .then(() => {
                    this.processTrigger(action);
                })
                .catch(() => {
                    return false;
                });
        } else {
            /**
             * Otherwise process the trigger right away
             */
            this.processTrigger(action);
        }
    }

    /**
     * Determine whether to publish or unpublish
     * @param  {string} action - Either "show" or "hide"
     */
    processTrigger(action) {
        if (action === "show") {
            this.publish();
        } else if (action === "hide") {
            this.unpublish();
        }
    }

    /**
     * "Publish" a reveal while unpublishing old ones
     */
    publish() {
        // If this is part of a group and it's either
        // exclusive or radio...
        // @TODO: Move this up to processTrigger()?
        if (this.group && this.options.type !== "default") {
            // Get the "old" current elements
            const oldCurrents = this.getCurrent(
                window.Reveal.groups[this.group].triggers
            );

            // Go through each "old" current
            oldCurrents.forEach(oldCurrent => {
                // Trigger a hide event for each of them.
                // We don't want them no more.
                this.unpublish(oldCurrent);
            });
        }

        // Turn new current on
        document.dispatchEvent(this.events.show);
    }

    /**
     * Unpublish the reveal
     * @param  {string} val
     */
    unpublish(val) {
        // If a value was passed, use it,
        // otherwise, use the identity value
        const hideEvent = val
            ? customEvent(`reveal/${val}/hide`)
            : this.events.hide;

        // Trigger hide on this identity
        document.dispatchEvent(hideEvent);
    }

    /**
     * Bind the internal custom show/hide events
     */
    bindTargets() {
        // When this identity has triggered to show...
        document.addEventListener(
            `reveal/${this.identity}/show`,
            this.showSequence.bind(this)
        );

        // When this identity has triggered to hide...
        document.addEventListener(
            `reveal/${this.identity}/hide`,
            this.hideSequence.bind(this)
        );
    }

    /**
     * Create the Promise object, call the user's function,
     * passing on the Promise, then return that Promise
     * @param  {function} fn
     * @param  {string}   action
     * @return {object}
     */
    promiseBeforeTrigger(fn, action) {
        return new Promise((resolve, reject) => {
            fn.call(this, this.elem, action, {
                resolve,
                reject
            });
        });
    }

    /**
     * Sequence of the events to "show" our target
     */
    showSequence() {
        document.dispatchEvent(this.events.beforeShow);

        // Make this trigger current in the reference
        this.makeCurrent();

        // Show this trigger visually
        this.showTrigger();

        // Show the targets visually
        this.showTargets();

        // Show the Fors visually
        this.showFors();

        // Trigger onShow
        document.dispatchEvent(this.events.afterShow);
    }

    /**
     * Sequence of events to "hide" our target
     */
    hideSequence() {
        // Trigger onHide
        document.dispatchEvent(this.events.beforeHide);

        // Make this trigger no longer current in the reference
        this.unmakeCurrent();

        // Visually hide the trigger
        this.hideTrigger();

        // Visually hide the targets
        this.hideTargets();

        // Visually hide the Fors
        this.hideFors();

        // Trigger onHide
        document.dispatchEvent(this.events.afterHide);
    }

    /**
     * Sets this reveal as "current" on init
     */
    initCurrent() {
        // This element has the current attribute set to true...
        if (
            this.elem.hasAttribute(CURRENT_ATTR) &&
            this.elem.getAttribute(CURRENT_ATTR) === "true"
        ) {
            this.setCurrent();
        }
    }

    /**
     * Reveals the current element, unless it's part of a
     * group. Then it pushes it into a queue until all of
     * the group has been accounted for, so that they can
     * listen
     */
    setCurrent() {
        if (this.group) {
            window.Reveal.queue.push(this.events.show);
        } else {
            // Make it Current
            this.makeCurrent();

            // Then publish
            this.publish();
        }
    }

    /**
     * Update the reference to make current true
     */
    makeCurrent() {
        this.updateReference({
            current: true
        });
    }

    /**
     * Update the reference to make current false
     */
    unmakeCurrent() {
        this.updateReference({
            current: false
        });
    }

    /**
     * Get the "current" out of this Reveal group
     * @param  {array} triggers
     * @return {array}
     */
    getCurrent(triggers) {
        const reference = window.Reveal.triggers;

        /**
         * In this group, if the reference has any
         * of these triggers as true, push it into
         * the currents gorup
         */
        return triggers.filter(triggerName => {
            return reference[triggerName].current;
        });
    }

    /**
     * Initialize this new trigger
     */
    initTrigger() {
        /**
         * Create a new reference for this trigger
         * and check if it is "current"
         */
        this.updateReference({
            targets: this.gatherTargets(),
            fors: this.gatherForTriggers(),
            hide: this.gatherHideTriggers()
        });
        this.initCurrent();
    }

    gatherTargets() {
        let targets;

        if (
            this.options.target.constructor === Array &&
            this.options.target.length
        ) {
            targets = this.options.target;
        } else if (typeof this.options.target === "function") {
            targets = this.options.target;
        } else {
            if (!this.elem.hasAttribute(this.options.target)) {
                console.error("Reveal couldn't find a target for this trigger");
                return false;
            }
            const targetStrings = this.elem
                .getAttribute(this.options.target)
                .split(" ");

            targets = targetStrings.map(targetString => {
                let target = document.getElementById(targetString);

                if (!target) {
                    target = function() {
                        const elem = document.getElementById(targetString);
                        if (elem) {
                            return elem;
                        }
                        return false;
                    };
                }
                return target;
            });
        }

        return targets;
    }

    gatherForTriggers() {
        const allFors = Array.from(
            document.querySelectorAll(`[${FOR_ATTR}="${this.identity}"]`)
        );

        allFors.forEach(forTrigger => {
            this.bindFors(forTrigger);
        });

        return allFors;
    }

    bindFors(forTrigger) {
        forTrigger.addEventListener("click", () => {
            this.processBeforeTrigger();
            return this.options.returns;
        });
    }

    gatherHideTriggers() {
        const allHides = Array.from(
            document.querySelectorAll(`[${HIDE_ATTR}="${this.identity}"]`)
        );

        allHides.forEach(hideTrigger => {
            this.bindHides(hideTrigger);
        });

        return allHides;
    }

    bindHides(hideTrigger) {
        hideTrigger.addEventListener("click", () => {
            if (this.reference.current && this.options.type !== "radio") {
                document.dispatchEvent(this.events.hide);
            }
            return this.options.returns;
        });
    }

    gatherGroup() {
        this.group = false;
        if (this.elem.hasAttribute(GROUP_ATTR)) {
            const groupName = this.elem.getAttribute(GROUP_ATTR);
            this.group = document.querySelectorAll(
                `[${GROUP_ATTR}="${groupName}"]`
            );
        }
    }

    addClass(elem, userClass) {
        animationFrame(function() {
            elem.classList.add(userClass);
        });
    }

    removeClass(elem, userClass) {
        animationFrame(function() {
            elem.classList.remove(userClass);
        });
    }

    show(elem) {
        this.addClass(elem, this.options.activeClass);
    }

    showTargets() {
        const targets =
            typeof this.reference.targets === "function"
                ? this.reference.targets.call(this)
                : this.reference.targets;

        targets.forEach(target => {
            this.show(target);
        });
    }

    showFors() {
        this.reference.fors.forEach(forTrigger => {
            this.show(forTrigger);
        });
    }

    showTrigger() {
        this.show(this.elem);
    }

    hide(elem) {
        this.removeClass(elem, this.options.activeClass);

        if (!elem.classList.contains(this.options.visitedClass)) {
            this.addClass(elem, this.options.visitedClass);
        }
    }

    hideTargets() {
        const targets =
            typeof this.reference.targets === "function"
                ? this.reference.targets.call(this)
                : this.reference.targets;

        targets.forEach(target => {
            this.hide(target);
        });
    }

    hideFors() {
        this.reference.fors.forEach(forTrigger => {
            this.hide(forTrigger);
        });
    }

    hideTrigger() {
        this.hide(this.elem);
    }

    updateReference(updates = {}) {
        const reference = window.Reveal;
        let referenceGroup = this.group ? reference.groups[this.group] : false;
        let referenceTrigger = reference.triggers[this.identity];

        // If it is part of a group
        // @TODO: Break out group and trigger reference builder
        if (this.group) {
            if (!referenceGroup) {
                reference.groups[this.group] = this.newReferenceGroup();
                referenceGroup = reference.groups[this.group];
            }
            if (referenceGroup.triggers.indexOf(this.identity) < 0) {
                referenceGroup.triggers.push(this.identity);
            }
        }

        if (!referenceTrigger) {
            reference.triggers[this.identity] = this.newReferenceTarget(
                this.elem
            );
            referenceTrigger = reference.triggers[this.identity];
        }

        reference.triggers[this.identity] = Object.assign(
            {},
            referenceTrigger,
            updates
        );

        this.reference = reference.triggers[this.identity];

        return this.reference;
    }
}

/*

Model of what the Reveal Reference will look like:

window: {
    Reveal: {
        "triggers": {
            "TRIGGER": {
                "elem": $object,
                "targets": [
                    "TARGET",
                    "TARGET",
                    "TARGET"
                ],
                "for": [
                    $object
                ],
                "current": true
            },
            "TRIGGER": {
                "elem": $object,
                "targets": [
                    "TARGET",
                    "TARGET",
                    "TARGET"
                ],
                "for": null,
                "current": false
            }
        },
        "groups": {
            "GROUPNAME": {
                "type": exclusive,
                "triggers": [
                    "TRIGGER",
                    "TRIGGER",
                    "TRIGGER",
                    "TRIGGER"
                ]
            }
        },
        queue: []
    }
}

*/
