Motif jQuery Plugins
====

Motif features JavaScript plugins that depend on the [jQuery framework](http://jquery.com) -- jQuery plugins, if you will. You'll want to make sure that one way or another, jQuery v1.11.0 is included in your site to take advantage of the plugins. From core, infinitely configurable plugins to more specific use-case plugins built on top of them, these plugins are built with the intent of progressively enhancing a visitor's web experience.

**Note:** All Motif jQuery Plugins require `/utils/motif.utils.plugins.js` for initialization.

## Forms

**Location:** `/forms/`

### Gauntlet

**Version:** 1.0.0

**Location:** `/forms/motif.gauntlet.js`

A form validation plugin that depends on HTML5 syntax.

[See the full documentation of Gauntlet](https://github.com/MotifFramework/Motif/blob/master/js/forms/GauntletREADME.md).

### Conditioner

**Version:** 0.3.0

**Location:** `/forms/motif.conditioner.js`

Conditionally enable and disable form elements.

*Documentation coming soon!*

### Ajax Submission

**Version:** 0.2.0

**Location:** `/forms/motif.ajax-submission.js`

A simple plugin to aid in Ajax form submission, with callback messages and form reseting. (Requires **Gauntlet**.)

*Documentation coming soon!*

## UI

**Location:** `/ui/`

### Reveal

**Version:** 2.0.0

**Location:** `/ui/motif.reveal.js`

Show and hide things with class(es).

*Documentation coming soon!*

## Scroll

**Location:** `/scroll/`

### Herald

**Version:** 0.2.0

**Location:** `/scroll/motif.herald.js`

Fire off events depending on scroll position.

*Documentation coming soon!*

### Sidekick

**Version:** 0.1.1

**Location:** `/scroll/motif.sidekick.js`

A basic sticky sidebar. (Requires **Herald**.)

*Documentation coming soon!*

**June 26th, 2018**
Addition of the ability to pass how much Throttle should be applied to your listener for when to apply/remove Sticky. Default is 50ms. If you see flickers, lessen this number.

```
$(".js-stickey-element").sidekick({
	"minWidth": 768,
	"throttle": 0
})
```

### Scroll Patrol

**Version:** 0.1.0

**Location:** `/scroll/motif.scroll-patrol.js`

A basic navigation scroll "spy". (Requires **Herald**.)

*Documentation coming soon!*

## Utilities

**Location:** `/utils/`

### Load Script

**Version:** 1.0.0

**Location:** `/utils/motif.utils.load-script.js`

Slightly modified version of https://gist.github.com/niftylettuce/3620903. (*Does not* require jQuery.)

### Plugin Utilities

**Version:** 0.2.0

**Location:** `/utils/motif.utils.plugins.js`

Not a plugin in itself, but a set of tool for initializing plugins safely.

*Documentation coming soon!*