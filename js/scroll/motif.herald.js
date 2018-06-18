/*!
 * Motif Herald v0.3.4
 * Fire off events depending on scroll position.
 * http://getmotif.com
 *
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */

/*globals jQuery, Motif */

(function ($, window, document, Motif, undefined) {

  "use strict";

  /**
   * @module Motif
   * @submodule apps
   * @class Herald
   * @constructor
   * @param elem {object}
   */
  var Herald = function (elem) {

    /**
     * Set element variables
     * @property {object} $window - The jQuery object of the windowed element
     * @property {object} window - The vanilla DOM object of the windowed element
     */
    this.$window = $(elem);
    this.window = this.$window[0];

    return this;
  };

  Herald.counter = 0;
  Herald.prototype = {

    /**
     * Define the default configuration options
     * @property {object} defaults
     */
    "defaults": {
      "throttle": 50,
      "events": []
    },

    /**
     * The entrypoint of the plugin that sets events into motion
     * @method init
     * @param {object} [userOptions]
     */
    "init": function init(userOptions) {

      /**
       * First, initialize our variables/properties
       */
      this.initVars(userOptions);

      /**
       * Bind the scroll events
       */
      this.bind(true);

      return this;
    },

    /**
     * Build out useful properties for our plugin
     * @method initVars
     * @param {object} [userOptions]
     */
    "initVars": function initVars(userOptions) {
      this.config = userOptions;
      this.identity = this.config.group || "herald-" + Herald.counter;
      this.config.events = this.nameEvents(this.config.events);
      this.options = $.extend(true, {}, this.defaults, this.config);
      this.oldPosition = this.$window.scrollTop();

      /**
       * Name our events, then sort them by trigger position
       */
      this.options.events = this.sortEvents();
      this.spliceQueue = [];
      this.isTesting = false;
      this.isSplicing = false;
    },

    /**
     * Bind the scroll and resize events
     * @method bind
     */
    "bind": function bind(forceRefresh) {
      var self = this;

      /**
       * Bind a namespaced scroll to the window to test the provided
       * array of Herald events
       */
      self.$window.on("scroll." + self.identity, function onHeraldChange(ev, force) {

        if (!self.isSplicing && !self.isTesting) {
          if (typeof self.options.throttle === "number") {
            self.isTesting = true;
            window.setTimeout($.proxy(function () {
              this.isTesting = false;
            }, self), self.options.throttle);
          }
          self.testAllEvents.call(self, force);
        }
      });

      /**
       * Bind a namespaced resize so that we can recalculate
       * our firing positions based on the refreshed layout
       */
      self.$window.on("orientationchange." + self.identity + " resize." + self.identity, function onHeraldResize() {
        if (!self.isSplicing && !self.isTesting) {
          self.refresh.call(self);
        }
      });

      if (forceRefresh) {

        /**
         * Go ahead and refresh now to begin with
         */
        self.refresh.call(self);
      }
    },

    /**
     * Suspend Herald's bound actions
     * @method suspend
     */
    "suspend": function suspend(name) {
      var identity = name || this.identity;

      this.$window.off("scroll." + identity);
      this.$window.off("resize." + identity);
      this.$window.off("orientationchange." + identity);
      this.suspendEvents(identity);
    },

    "suspendEvents": function suspendEvents(name) {
      var self = this,
        identity = name || self.identity,
        suspendedEvents = [];

      $.each(self.options.events, function eachEvent(i, v) {
        if (v.name && v.name === identity) {
          v.suspended = true;
          suspendedEvents = suspendedEvents.concat(self.options.events.slice(i, i + 1));
        }
      });

      return suspendedEvents;
    },

    /**
     * Alias to bind the scroll and resize events
     * (primarily used after suspending)
     * @method resume
     */
    "resume": function resume() {
      this.bind(true);
      this.resumeEvents();
    },

    "resumeEvents": function resumeEvents(name) {
      var self = this,
        identity = name || self.identity,
        resumedEvents = [];

      $.each(self.options.events, function eachEvent(i, v) {
        if (v.name && v.name === identity) {
          v.suspended = false;
          resumedEvents = resumedEvents.concat(self.options.events.slice(i, i + 1));
        }
      });

      return resumedEvents;
    },

    /**
     * Refresh the `oldPosition`
     * 
     * This addresses the need to re-check events when the browser
     * is resized and new elements come into view, as well as
     * accommodating for when a page is refreshed and the scroll 
     * position is reset to somewhere lower on the page.
     * 
     * @method refresh
     */
    "refresh": function refresh() {
      this.options.events = this.sortEvents();

      /**
       * Pretend like the `oldPosition` *is* the very top of
       * the page. This mimics the user scrolling down to the
       * current position.
       */
      this.oldPosition = 0;

      /**
       * Re-trigger the scroll event
       * @todo Just call `testAllEvents()`?
       */
      this.$window.trigger("scroll." + this.identity, true);
    },

    /**
     * Test the actual Herald events to see if they should be fired
     * @method testAllEvents
     */
    "testAllEvents": function testAllEvents(force) {
      var self = this,
        events = self.options.events,
        eventsLength = events.length,
        direction = "",
        i;

      /**
       * Set your current position as your window's
       * scroll position
       */
      this.currentPosition = this.$window.scrollTop();

      if (force && this.currentPosition === this.oldPosition) {
        this.currentPosition += 1;
      }

      /**
       * What direction are we moving in?
       */
      direction = this.getDirection(this.oldPosition, this.currentPosition);

      /**
       * Loop through the events array
       */

      /**
       * If we're moving down, analyze the array
       * from top to bottom
       */
      if (direction === "down") {
        for (i = 0; i < eventsLength; i += 1) {
          this.testEvent(events[i], i, direction);
        }

        /**
         * If we're moving up, analyze the array
         * from bottom to top
         */
      } else if (direction === "up") {
        for (i = eventsLength - 1; i >= 0; i -= 1) {
          this.testEvent(events[i], i, direction);
        }
      }

      this.spliceEvents();

      /**
       * When we're done with events, the new `oldPosition`
       * is the current position
       */
      this.oldPosition = this.currentPosition;
    },

    /**
     * Test whether the individual event should be fired
     * @method testEvent
     * @param {object} thisEvent - The current Herald event in the array
     * @param {number} eventNum - The object's position in the array
     * @param {string} direction - What direction we are moving
     */
    "testEvent": function testEvent(thisEvent, eventNum, direction) {
      var isTriggered = false,
        triggerPosition;

      if (thisEvent.suspended) {
        return false;
      }

      /**
       * Make sure the event either has not been fired or is
       * set to repeat
       */
      if ((typeof thisEvent.fired === "undefined" || !thisEvent.fired) || thisEvent.repeat) {

        /**
         * Get the trigger position by checking if it's a
         * function or a value
         */
        triggerPosition = thisEvent.persistent ? this.triggerType(thisEvent) : thisEvent.cache;


        /**
         * Is the event triggered?
         */
        isTriggered = this.testTrigger(triggerPosition);

        /**
         * If the event has triggered, launch the event
         */
        if (isTriggered) {
          this.triggerEvent(eventNum, direction);
        }
      }
    },

    /**
     * Check if the trigger is a function or a value
     * @method triggerType
     * @param {(number|function)} thisEvent
     * @returns {number}
     */
    "triggerType": function triggerType(thisEvent) {
      if (typeof thisEvent.trigger === "function") {
        return thisEvent.cache = thisEvent.trigger.call(this);
      } else {
        return thisEvent.cache = thisEvent.trigger;
      }
    },

    /**
     * Test the trigger position in relation to the current position
     * @method testTrigger
     * @param {number} triggerPosition
     * @return {boolean}
     */
    "testTrigger": function testTrigger(triggerPosition) {
      var position;

      if (typeof triggerPosition === "boolean") {
        return triggerPosition;
      }

      position = triggerPosition < 0 ? 0 : triggerPosition;

      /**
       * If the trigger position is above than the current position but
       * below than the old position, it means we passed it going down
       *
       * If the trigger is below the current position but above the old
       * position, it means we passed it going up
       */
      if (
        (position <= this.currentPosition && position >= this.oldPosition)
        ||
        (position >= this.currentPosition && position <= this.oldPosition)
      ) {
        return true;
      }
      return false;
    },

    /**
     * Execute the event once the trigger is met
     * @method triggerEvent
     * @param {number} eventNum - Our place in the events array
     * @param {string} direction - What direction we are moving
     */
    "triggerEvent": function triggerEvent(eventNum, direction) {
      var events = this.options.events,
        thisEvent = events[eventNum];

      /**
       * Call the event and pass on the direction we were moving
       */
      thisEvent.event.call(this, direction, this);

      /**
       * Extend the object to reflect that the event has been fired
       */
      thisEvent.fired = true;

      /**
       * If the event is not repeatable, remove the event
       * from the array
       */
      if (!thisEvent.repeat) {
        this.spliceQueue.push(eventNum);
      }
    },

    "spliceEvents": function spliceEvents() {
      this.isSplicing = true;

      $.each(this.spliceQueue, $.proxy(function eachSplice(i, v) {
        this.options.events.splice(v, 1);
      }, this));

      this.spliceQueue = [];
      this.isSplicing = false;
    },

    /**
     * Determine the direction we've been scrolling
     * @method getDirection
     * @param {number} old - The previous scroll position
     * @param {number} current - The new, current scroll position
     * @return {string} direction - Either "up" or "down"
     */
    "getDirection": function getDirection(old, current) {
      var oldPosition = old || this.oldPosition,
        currentPosition = current || this.currentPosition,
        direction;

      if (currentPosition >= oldPosition) {
        direction = "down";
      } else if (currentPosition < oldPosition) {
        direction = "up";
      }

      return direction;
    },

    "nameEvents": function nameEvents(events) {
      var self = this;

      $.each(events, function eachEvent(i, v) {
        v.name = self.identity;
      });

      return events;
    },

    /**
     * Sort the order of our events array by position
     * on the page
     * @method sortEvents
     * @return {array} Herald.options.events
     */
    "sortEvents": function sortEvents() {
      var self = this;

      self.options.events = this.cacheEvents();

      self.options.events.sort();

      return self.options.events;
    },

    "cacheEvents": function cacheEvents() {
      $.each(this.options.events, $.proxy(function (i, thisEvent) {
        this.triggerType(thisEvent);
      }, this));

      return this.options.events;
    },

    /**
     * Method to add more events to this instance of Herald,
     * rather than overriding it
     * @method addToHerald
     * @param {object} userOptions
     */
    "addToHerald": function addToHerald(userOptions) {
      if (userOptions.events && userOptions.events.length) {
        this.identity = userOptions.group || "herald-" + Herald.counter;
        userOptions.events = this.nameEvents(userOptions.events);
        /**
         * Let's supplement our events with the new ones
         * we've gotten
         */
        this.options.events = this.supplementEvents(userOptions.events);

        /**
         * Then let's re-sort the events
         */
        this.options.events = this.sortEvents();

        /**
         * Then refresh to catch any new triggers we
         * may have passed
         */
        this.bind();
      }
    },

    /**
     * Add new events to the current events array
     * @method supplementEvents
     * @param {array} newEvents
     * @param {array} [oldEvents]
     * @return {array} events
     */
    "supplementEvents": function supplementEvents(newEvents, oldEvents) {
      var events = oldEvents || this.options.events;

      return events.concat(newEvents);
    }

  };

  Herald.defaults = Herald.prototype.defaults;

  Motif.apps.Herald = Herald;

  /**
   * Extending jQuery's `fn`
   */
  $.fn.herald = function (userOptions) {
    var args = arguments,
      elemLength = this.length;

    if (elemLength) {
      return this.each(function eachThis(index) {

        // Check if this plugin already has an instance on this
        var instance = $.data(this, "herald");

        if (instance) {

          // If there are user options or no user options, call `init`
          if (typeof userOptions === "undefined" || typeof userOptions === "function") {
            instance.init(userOptions);

            /**
             * If we are passing options, we want to add them to our current ones
             */
          } else if (typeof userOptions === "object") {
            instance.addToHerald(userOptions);

            // Check if `userOptions` is a function of our instance
          } else if (typeof userOptions === "string" && typeof instance[userOptions] === "function") {

            // Copy arguments & remove function name
            args = Array.prototype.slice.call(args, 1);

            return instance[userOptions].apply(instance, args);

            // Otherwise, log error
          } else {
            console.log("Herald: Method " + userOptions + " does not exist on jQuery.");
          }
        } else {
          args = Array.prototype.slice.call(args);
          instance = $.data(this, "herald", new Herald(this));
          instance.init.apply(instance, args);
        }
        /**
         * If this is the last one of this group,
         * increment the Herald counter
         */
        if (elemLength - 1 === index) {
          Herald.counter += 1;
        }
      });
    }
  };

}(jQuery, window, document, window.Motif = window.Motif || {
  "utils": {},
  "apps": {}
}));
