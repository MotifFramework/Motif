Motif Less Documentation
====

## Table of Contents

- [Leveraging Attribute Selectors](#leveraging-attribute-selectors)
- [File Structure and Naming Convention Overview](#file-structure-and-naming-convention-overview)
- [The File Structure](#the-file-structure)
- [Naming Convention](#naming-convention)
- [Responsive Styling](#responsive-styling)
- [Configuration File](#configuration-file)
- [Mixins](#mixins)
- [Variables](#variables)
- [Helper Classes](#helper-classes)
- [Reusable Modules](#reusable-modules)
- [Typography](#typography)
- [Interactive](#interactive)
- [Forms](#forms)
- [Layout](#layout)
- [Furniture](#furniture)
- [Responsive Breakpoints](#responsive-breakpoints)
- [Prototype](#prototype)

## Leveraging Attribute Selectors

As mentioned in the [Getting Started section](https://github.com/MotifFramework/Motif/blob/master/README.md), Motif's core styles are built in a way that encourages separation of structure from skin. As a reminder, separating structure from skin, an idea popularized by Nicole Sullivan and OOCSS ([which we'll quote from](https://github.com/stubbornella/oocss/wiki#separate-structure-and-skin)),

> [...] means to define repeating visual features (like background and border styles) as separate “skins” that you can mix-and-match with your various objects to achieve a large amount of visual variety without much code.

What this traditionally translates to are CSS classes that represent the structure...

```css
.panel {
    margin: 20px 0 0;
    padding: 20px;
    border: 1px solid;
}
```

...and some modifying "skin" classes:

```css
.panel__alert {
    background: pink;
    border-color: red;
}
```

Both classes would be applied to the HTML element:

```html
<div class="panel panel__alert">...</div>
```

We do things slightly different in Motif's stylesheet. Using the magic of some of the more advanced CSS attribute selectors, we accomplish the same technique but without requiring multiple classes:

```css
[class*="panel__"] {
    margin: 20px 0 0;
    padding: 20px;
    border: 1px solid;
}
.panel__alert {
    background: pink;
    border-color: red;
}
.panel__success {
    background: yellow;
    border-color: green;
}
```

```html
<div class="panel__alert">...</div>
```

(To learn more about this technique, read the excellent 24 Ways article, [A Harder-Working Class](http://24ways.org/2012/a-harder-working-class/).)

You'll see a lot of this in Motif's core. We encourage you to also take advantage of this technique, which maintains that organizational and efficient spirit of separating structure from skin, but reduces the amount of classes needed to execute. Be extra careful in how you execute this, as the class attribute selector can be greedy.

```css
[class*="button"] {
    ...
}
```

The example above matches `.button`, `.button__primary`, `.button__primary--modifier`, and so on.

## File Structure and Naming Convention Overview

Motif follows methodologies that assist in managing teams or multiple developers working within the same codebase. During our own development, we've noticed consistent issues with developers struggling to find specific styles in large codebases, which sometimes results in duplicate styles being created if the existing ones were too difficult to find. The first step towards eliminating that pain point is establishing a unified approach to where styles live and how they are named.

Some benefits to following this methodology are:

- Reduced risk of accidentally overriding an old style and inadvertently breaking the site.
- Scalability for multiple people working within the same codebase over an extended period of time.
- Ease and predictability when creating new templates, styles, and scripts.
- Easier onboarding for developers new to the project.


## The File Structure

Motif's Less is organized into folders based on the type of styles we are creating. By default, there are three main directories:

```
+ less
    + core
    + pages
    + shared
```

Files within the `core/` directory contain styles that are independent of any particular template and can be used anywhere. Files within the `pages/` directory are directly related to a particular page template. Files within the `shared/` directory are tied directly to a template that can be used across multiple other templates.

Motif comes with default core styles that are already organized into this directory structure:

```
+ less
    + core
        + config
        + forms
        + furniture
        + interactive
        + layout
        + media
        + mixins
        + modules
        + site
        + type
        - global.less
    + pages
    + shared
```

For the `pages/` and `shared/` directories, we recommend following the same path structure as the corresponding template. This eliminates any guesswork of where a style should live and keeps your template and style structure consistent.

```
// Template Path
views/pages/home/home.view

// Style Path
less/pages/home/home.less
```

This section of the site should give you a great overview of Motif's built-in modules and ideas, but be sure to get into the actual code for more granular comments and explanations.

## Naming Convention

Motif previously followed the [BEM](http://getbem.com/) methodology, but in application on long-running large projects, the class names became very long and difficult to keep unique. There are many advantages to using BEM we did not want to loose, so our nomenclature pulls it's roots from there.

```css
.fileName__element--modifier
```

We start our classes with the name of the file the style was created in. In application, this will commonly match up with a template name (ie: `basicCard`). The filename is followed by two underscores, then the element name (ie: `title`). If there is a variation for that style, we follow the element name with two dashes and then the modifier name (ie: `large`).

```html
<!-- From example template: /views/shared/cards/basicCard/basicCard.view -->
<a href="#" class="basicCard__link">Click Me</a>
```

```less
// From example less: /less/shared/cards/basicCard/basicCard.less
.basicCard__link {}
```

## Responsive Styling

The site's main (and perhaps only) stylesheet is compiled through `global.less`. All supporting Less files are imported into and compiled from here, creating a file named after your `name` in the Motif `package.json` file (`[name].css`). Consider this a responsive stylesheet by default, as the partials will contain breakpoints among themselves (we'll get into the default breakpoints later).

## Configuration File

**Location:** `config/config.less`

Breakpoint, color, typographic, and other settings. Motif's Less configuration file houses groups of Less variables that are used in the other partials. This is where you edit and define new color hex codes into easy-to-remember variables, condense font stack strings into short variables, keep the font sizes of your typographic hierarchy, and edit the default responsive breakpoints. Some examples:

```less
// Responsive Breakpoints
@bp-small-width: 480;
@bp-medium-width: 768;
@bp-large-width: 992;
@bp-x-large-width: 1240;

// Blues
@blue: #1f75ae;
@dark-blue: darken(@blue, 15%);
@light-blue: lighten(@blue, 15%);

// Brands
@facebook-blue: #3b5998;
@twitter-blue: #00a0d1;

// Font Declarations
@stack-sans-serif: Helvetica, Arial, "Arial Unicode", "Lucida Sans Unicode", sans-serif;
@source-sans-regular: "Source Sans Pro", @stack-sans-serif;
```

As Motif continues to grow, the configuration file will become more powerful.

## Mixins
// TODO: Add /core to all of these
**Location:** `/mixins/`

Motif uses its own set of Less mixing, some that fill in browser vendor prefixes on CSS3 attributes, and others that aid in the framework's type scaling and vertical rhythm. There are also some more presentational mixins, like an accessibility-friendly hiding class and a clearfix. Mixin files are prefixed with `m-` to help differentiate mixins at a glance.

## Variables

**Location:** `config/vars.less`

The `vars.less` file houses a slew of useful Less variables. These are different than those found in the configuration file in that they're not really meant to be altered, just placed somewhere readily accessible for every partial. These include some spacing variables...

```less
@full-vertical: 1rem * (@base-vertical / @root-text-size);
```

...our media query variables...

```less
@small-screens-min: ~"all and (min-width: @{mq-small-min})";
```

...handy variables of pixel lengths translated into relative ems...


```less
@10px: ( 1rem * ( 10 / @root-text-size ) );
@15px: ( 1rem * ( 15 / @root-text-size ) );
@20px: ( 1rem * ( 20 / @root-text-size ) );
```

...and even some great easing variables handy in CSS3 transitions (hat top to [Robert Penner](http://robertpenner.com/)):

```less
// Cubic
@easeInCubic: cubic-bezier(0.550, 0.055, 0.675, 0.190);
@easeOutCubic: cubic-bezier(0.215, 0.610, 0.355, 1.000);
@easeInOutCubic: cubic-bezier(0.645, 0.045, 0.355, 1.000);
```

## Helper Classes

### Spacing

**Location:** `/layout/spacing.less`

Spacing helpers are quick but powerful classes that add margin or padding to any given element. These classes are `!important`, so they override all other styles.

* `p`, `m`                          =   "padding", "margin"  
* `a`, `t`, `r`, `b`, `l`, `h`, `v` =   "all", "top", "right", "bottom", "left", "horizontal", "vertical"  
* `s`, `m`, `l`, `x`, `n`                =   "small" (~`5px`), "medium" (~`10px`), "large" (~`20px`), "x-large" (~`40px`), "none" (`0`)

For example: `.spacing__pam` means "padding all medium".

**Note:** These are all based on the current element's font size and the project's vertical rhythm (even on the sides, to provide uniform spacing). As such, they require `config/vars.less`.

Hat tip: [Nicole Sullivan](http://stubbornella.org)

### Presentational

**Location:** `/layout/presentational.less`

Some basic, Lego-level classes to allow quick adjustment in the HTML.

#### Text Align

Simple classes to adjust your text alignment. They can be added to individual elements or on wrapping elements (an outer `div`, perhaps) to adjust the alignment of all the child elements.

Classes          | Description
-----------------|-----------------
`presentational__align-left`    | Left-aligned
`presentational__align-center`  | Center-aligned
`presentational__align-right`   | Right-aligned
`presentational__align-sub`     | Vertical-aligned: sub
`presentational__align-middle`  | Vertical-aligned: middle
`presentational__align-top`     | Vertical-aligned: top

```html
<p class="presentational__align-center">I am centered.</p>
```

#### Floats

Next, we have classes for floating elements.

Classes          | Description
-----------------|-----------------
`presentational__float-left`    | Floated to the left
`presentational__float-center`  | Faux-center floating via `auto` margin on the left and right
`presentational__float-right`   | Floated to the right
`presentational__float-none`    | Removes floating

```html
<div class="presentational__float-right">...</div>
```

#### "New Line"

Turns an `inline` or `inline-block` element into a `block` one.

```html
<p>
    Some text with
    <em class="presentational__new-line">emphasis</em>
</p>
```

#### "Is Hidden"

Visually hides content in a way that leaves it accessible to screen readers. Like more magic, makes the visible invisible.

```html
<p>
    You can see me<span class="presentational__is-hidden"> but you can't see me</span>.
</p>
```

Classes            | Description
-------------------|-------------------
`presentational__is-hidden`        | Visually hides on all viewports
`presentational__is-hidden-small`  | Visually hides within "small" breakpoints
`presentational__is-hidden-medium` | Visually hides within "medium" breakpoints
`presentational__is-hidden-large`  | Visually hides within "large" breakpoints


## Reusable Modules

**Location:** `/modules/`

### Lists

**Location:** `/modules/lists.less`

#### Horizontal List

The basic `.lists__horizontal` module simply removes bullets from lists and inlines the list items, making the link `inline-block`. The idea is to give the skeleton of a horizontal list/navigation without adding too much style (yet).

```html
<ul class="lists__horizontal">
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
</ul>
```

#### Horizontal List (Forceful)

Rather than making the list `inline-block`, it floats the list elements (except on the smallest screen sizes, where it remains vertical). More precise than the default Horizontal List.

```html
<ul class="lists__horizontal--forceful">
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
</ul>
```

#### Link List

A basic extension of the Horizontal List, this adds some margin to the links in the list for a more pleasant looking list of links.

```html
<ul class="lists__horizontal--links">
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
</ul>
```

**Note:** Because we are using the `[class*=""]` attribute selector, using the `.lists__horizontal--links` class takes advantage of the `lists__horizontal` module we declared earlier, as well as the Forceful variation (`.lists__horizontal--forceful`) without having to declare *both* `.lists__horizontal` and `.lists__horizontal--links` in our HTML.

#### Pagination

An extension of the basic `.lists__horizontal` module that simply adds enough padding on the links for pagination.

```html
<ul class="lists__horizontal--pgs">
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
    <li>
        <a href="#">Basic Link</a>
    </li>
</ul>
```

#### Breadcrumb

Another extension of the `.lists__horizontal` module, adding a breadcrumb `label` and floating it and the ordered list.

```html
<nav class="breadcrumb" role="navigation">
    <h3 class="breadcrumb__label">You Are Here:</h3>
    <ul class="lists__breadcrumb">
        <li>
            <a href="#">Basic Link</a>
        </li>
        <li>
            <a href="#">Basic Link</a>
        </li>
        <li>
            <a href="#">Basic Link</a>
        </li>
    </ul>
</nav>
```

#### Unstyled List

A basic stripping of list styles.

```html
<ul class="lists__unstyled">
    <li>List Item</li>
    <li>List Item</li>
    <li>List Item</li>
</ul>
```

### Media

**Location:** `/media/media.less`

#### Media Object

The Media Object is an image (or media-type) to the left with (typically) descriptive content to the right. The media object can be whatever size it wants, the basic format will remain the same. (Text will **not** wrap.)  This has any number of applications, such as a checkbox next to a label with lots of text.

See: [The Media Object Saves Hundreds of Lines of Code](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/)

```html
<div class="media__media-object">
    <div class="media__media-object__figure">
        <img src="http://placehold.it/200" alt="A media object image">
    </div>
    <div class="media__media-object__desc">
        <p>He is here. No! Alderaan is peaceful. We have no weapons. You can't possibly&hellip; Kid, I've flown from one side of this galaxy to the other. I've seen a lot of strange stuff, but I've never seen anything to make me believe there's one all-powerful Force controlling everything. There's no mystical energy field that controls my destiny. It's all a lot of simple tricks and nonsense. I can't get involved! I've got work to do! It's not that I like the Empire, I hate it, but there's nothing I can do about it right now. It's such a long way from here. I'm surprised you had the courage to take the responsibility yourself. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.</p>
    </div>
</div>
```

#### Figures

Great for integrating images into bodies of text, the `.media__figure` class is modified by the `--left` and `--right` keywords depending on where you would like it placed.

```html
<!-- Basic Figure -->
<figure class="media__figure">
    <img src="http://placehold.it/800x444" alt="A full-width photo">
</figure>

<!-- Figure floating left -->
<figure class="media__figure--left">
    <img src="http://placehold.it/300x200" alt="A photo floating left">
</figure>

<!-- Figure floating right -->
<figure class="media__figure--right">
    <img src="http://placehold.it/300x200" alt="A photo floating left">
</figure>

<!-- Figure with caption -->
<figure class="media__figure">
    <img src="http://placehold.it/800x444" alt="A full-width photo with a caption">
    <figcaption class="figcaption">This caption enhances the photo above. It should only be a brief sentence or two long.</figcaption>
</figure>
```

### Ratios

**Location:** `/modules/ratios.less`

Ratios are used primarily for objects that must scale in both width and height proportionally, such as embedded videos.

See: [Uncle Dave's Ol' Padded Box](http://daverupert.com/2012/04/uncle-daves-ol-padded-box/)

The `.ratios__` dimension class is placed on a wrapping element, with its child contents wrapped by the `.ratios__content` class.

```html
<div class="ratios__square">
    <div class="ratios__content">
        ...
    </div>
</div>
```

For embedded videos, use the `.ratios__video` class, and it will assume an `iframe` is the direct child:

```html
<div class="ratios__video">
    <iframe src="http://youtube.com/myVidEmbed"></iframe>
</div>
```

Classes                         | Description
--------------------------------|------------------------------
`ratios__video`                 | 16x9 with child `iframe` assumption
`ratios__square`, `ratios__1x1` | Square ratio
`ratios__1x2`                   | Proportional box twice as tall as it is wide
`ratios__2x1`                   | Proportional box twice as wide as it is tall

### Wrapper

**Location:** `/layout/wrappers.less`

This is the site-wide containing class. Put it around anything you want to be contained in the "site width". By default, caps off at `1150px`.

```html
<body>
    <div class="wrappers__wrapper">
        ...
    </div>
</body>
```

### Scripts

**Location:** `/scripts/`

#### Animated Revealing/Hiding Block Modules

When JavaScript is enabled, these blocks are used (most easily in conjunction with Motif Reveal jQuery plugins) to reveal and hide blocks of content, sometimes accompanied by CSS3 animations.

##### Reveal Target

`.reveal__target` is a simple class that is accessibly hidden by default. dd the `.is-revealed` class to show it.

```html
<!-- Inactive -->
<div class="reveal__target">
    I am hidden.
</div>

<!-- Active -->
<div class="reveal__target is-revealed">
    I am no longer hidden.
</div>
```

##### Expand Target

`.expand__target` has a maximum height of `0` by default, and once it receives the `.is-expanded` class, animates in height to its maximum value. This is the cheap CSS way of expanding animation, as in collapsible accordions. More precise timing most likely requires JS enhancement.

```html
<!-- Inactive -->
<div class="expand__target">
    I am hidden from view.
</div>

<!-- Active -->
<div class="expand__target is-expanded">
    I have expanded into view.
</div>
```

##### Fade Target

`.fade__target` is the same as `.expand__target` (in that it grows in height), but it adds opacity fading to the mix.

```html
<!-- Inactive -->
<div class="fade__target">
    I am hidden.
</div>

<!-- Active -->
<div class="fade__target is-faded">
    I have faded and expanded into view.
</div>
```

#### Main Nav Module

A minor enhancement to the Reveal or Expand Target modules if added to the main navigation bar. This snippet, on Medium screens and larger, makes sure the expandable Nav (on smaller screens) is no longer hidden, and that the Menu Title (be it "Main Menu", the hamburger icon, etc.) is hidden from view.

```html
<nav class="proto__nav-bar--menu" role="navigation">
    <h3 class="proto__nav-bar-title pre-icon--rows js-expand" id="reveal-main-nav">
        Main Menu
    </h3>
    <ul class="proto__nav-bar-list expand__target" id="main-nav-list">
        ...
    </ul>
</nav>
```

#### Tabs

The tabs module (and accompanying plugin) creates a very basic widget that allows embedding and basic styling.

```html
<section class="tabs">
    <nav role="navigation">
        <ul class="tabs__list--x">
            <li>
                <a class="tabs__list-item" href="#first-tab">
                    First Tab
                </a>
            </li>
            <li>
                <a class="tabs__list-item" href="#second-tab">
                    Second Tab
                </a>
            </li>
        </ul>
    </nav>
    <div class="tabs__section">
        <section class="tab" id="first-tab">
            <h3>First Tab</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </section>
        <section class="tab" id="second-tab">
            <h3>Second Tab</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </section>
    </div>
</section>
```

## Typography

**Location:** `/type/`

### Webfonts

**Location:** `/type/font-face.less`

Using the `.m-type__web-font` and `.m-type__web-font-svg` mixins, declare webfonts using the "bulletproof" `@font-face` syntax.

See: [Further Hardening of the Bulletproof Syntax](http://www.fontspring.com/blog/further-hardening-of-the-bulletproof-syntax/)

### Styles

**Location:** `/type/styles.less`

Each font family and weight used in the site is given its own LEGO-block class to enable quick use and modularity.

#### Heading Styles

In Motif, typography is broken into pieces that separate skin from structure. In this case, that means the font sizing (structure) is separate from the styling (skin) -- which includes font family, color, etc.

Heading styles are some of the type skins, and we start out with `.styles__primary-heading` (which is also the `h`-tag default) and `.styles__secondary-heading`. Add as necessary.

##### Primary Heading

```html
<h1 class="styles__primary-heading">Primary Heading</h1>
```

##### Secondary Heading

```html
<h2 class="styles__secondary-heading">Secondary Heading</h2>
```

#### Body Text

Another type style, but this mimicks the default body text of the site.

```html
<p>This is a paragraph of text. Some of the text may be <em>emphasised</em> and some it might even be <strong>strongly emphasised</strong>. Occasionally <q>quoted text</q> may be found within a paragraph &hellip;and of course <a href="#">a link</a> may appear at any point in the text. The average paragraph contains five or six sentences although some may contain as little or one or two while others carry on for anything up to ten sentences and beyond.</p>
```

#### Blockquote

A basic blockquote.

```html
<figure class="styles__blockquote">
    <blockquote>
        At last we will reveal ourselves to the the Jedi. At last we will have our revenge.
    </blockquote>
    <figcaption class="styles__blockquote-cite">Darth Maul</figcaption>
</figure>
```

### Hierarchy

**Location:** `/type/hierarchy.less`

The building blocks for the site's type sizes. Almost exclusively, an element's font size is assigned with one of these classes. If a new size is needed, a new class is created here so it can be used and reused elsewhere.

The list of type sizes can grow or shrink, but be vigilant in keeping the number of sizes to a minimum. A nice rule of thumb is that no two sizes can one pixel in difference (forcing you to choose one over the other, giving you one class where you previously had two).

```html
<p class="hierarchy__canon-text">Canon Text (38px)</p>
<p class="hierarchy__paragon-text">Paragon Text (30px)</p>
<p class="hierarchy__primer-text">Primer Text (24px)</p>
<p class="hierarchy__tertia-text">Tertia Text (18px)</p>
<p class="hierarchy__normal-text">Normal Text (14px)</p>
<p class="hierarchy__petite-text">Petite Text (12px)</p>
```

#### Long Modifiers

The type sizes are given the `--long` modifier, allowing you to use each type size with varying line heights.

```html
<p class="hierarchy__petite-text">I'm just a small bit of text, my `line-height` can be tight.</p>
<p class="hierarchy__petite-text--long">I'm a longer paragraph, so my `line-height` should be longer to enhance legibility.</p>
```

### Icons

Motif comes bundled with a small starter icon sprite created from 30+ SVG icons. From social icons to those useful in responsive prototyping, they can all be found in the `/icons/` folder. Motif uses a Grunt plugin to compile those SVGs into a larger SVG sprite, meaning you can add and remove SVGs to and from that folder and Grunt will re-create the sprite with the updated glyphs. [Learn more about the Grunt SVG Store plugin](https://github.com/FWeinb/grunt-svgstore).

Motif automatically fetches the icon sprite and injects it at the top of the page's `<body>` element, making it available for the rest of the page to use. The ID for the corresponding icon will be its original filename.

```html
<!-- Using `nav-right.svg` -->
<svg class="icon">
    <use xlink:href="#nav-right"></use>
</svg>
```

Motif also provides the `icon` class to size the icon relative to its font size and fill it with the current text color. This allows you to style it much like you would an icon font:

```html
<a class="action-link" href="/other/page.html">
    Learn more
    <svg class="action-link__icon">
        <use xlink:href="#nav-right"></use>
    </svg>
</a>
```

```less
.action-link__icon {
    &:extend(.icon);
    color: @red;
    font-size: 1.25em;
    margin-left: 0.25em;
}
```

## Interactive Elements

**Location:** `/interactive/`

### Buttons

**Location:** `/interactive/button.less`

Default interactive button styles. This `.button` class can be applied to `<a>`, `<button>`, or `<input>` elements. Button color and style classes can be combined with size classes, much like the type modules.

```html
<!-- Regular button -->
<a class="button" href="#">Default</a>
<a class="button__primary" href="#">Primary</a>
<a class="button__secondary" href="#">Secondary</a>

<!-- Tiny button -->
<a class="button__tiny" href="#">Tiny Button</a>
<a class="button__tiny button__primary" href="#">Tiny Button Primary</a>
<a class="button__tiny button__secondary" href="#">Tiny Button Secondary</a>

<!-- Small button -->
<a class="button__small" href="#">Small Button</a>
<a class="button__small button__primary" href="#">Small Button Primary</a>
<a class="button__small button__secondary" href="#">Small Button Secondary</a>

<!-- Large button -->
<a class="button__large" href="#">Large Button</a>
<a class="button__large button__primary" href="#">Large Button Primary</a>
<a class="button__large button__secondary" href="#">Large Button Secondary</a>
```

#### Button Styles

Classes        | Description
---------------|---------------
`button`            | Default button style
`button__primary`   | A button that calls attention to the primary focus of the page, form, etc.
`button__secondary` | A button for secondary actions or buttons that are not a main CTA.

#### Button Size Variations

Classes      | Description
-------------|-------------
`button__tiny`  | Tiny button (smaller than default)
`button__small` | Small button (smaller than default)
`button__large` | Large button (larger than default)

#### Other Variations

Classes           | Description
------------------|------------------
`button__full-width` | Extends button the full-width of its container

### Links

**Location:** `/interactive/_links.less`

Very basic stuff. The primary link color can be altered in the `_config.less` file. Hover, focus, and current states are accounted for.

#### Unlink

Basic class to remove some link styling.

```html
<a class="unlink" href="#">I look less like a link than I did before</a>
```

## Forms

**Location:** `/forms/`

### Elements

**Location:** `/forms/_elements.less`

Inputs and textareas are set to `width: 100%` to adapt to the width of their wrapper. (Great for grids.) Select boxes are set to the width of their content, maxing out at `100%`.

Almost all the form elements in Motif are best used inside a `label`.

```html
<label>
    Text Field
    <input type="text" name="text" required>
</label>
```

#### Input Label Elements

Child form elements of the `.input-label` class are given a little bit of  spacing to separate them from the label text.

(For label text styling, see also how `.input-label` is handled in the `/forms/_type.less` file.)

```html
<label class="input-label">
    Text Field
    <input type="text" name="text" placeholder="Placeholder text" required>
</label>
<label class="input-label">
    Textarea
    <textarea name="textarea" placeholder="Placeholder text"></textarea>
</label>
<label class="input-label">
    Select
    <select name="select">
        <option value="">Please Choose...</option>
    </select>
</label>
```

#### Input Widths

While you are encouraged to use the responsive grid system in conjunction with your form styles, sometimes it's useful to have form field widths that are simply consistent across viewports. These are those.

```html
<label class="input-label">
    Text Field
    <input class="input--xs" type="text" name="text" required>
</label>
```

### Type

**Location:** `/forms/_type.less`

#### Input Label

The `.input-label` class should be added to form labels that want a little extra styling for the label text.

(You may need to do some fancy things with hidden or altered labels, which is why these styles aren't added to the `label` element by default.)

```html
<label class="input-label">
    Text Field
    <input type="text" name="text" required>
</label>
```

There are also input descriptions, which go directly underneath the label text, and input hints that typically go underneath the input field.

```html
<label class="input-label">
    Text Field

    <small class="input-desc">
        This is a small description of the field.
    </small>

    <input type="text" name="text" required>

    <strong class="input-hint">
        This is an important hint.
    </strong>
</label>
```

#### Checkbox List

Lists of radio or checkbox inputs should typically be just that: lists. In Motif, you're encouraged to mark up your input lists as semantically as possible, meaning a fieldset, with a legend, and a list of inputs:

```html
<fieldset>
    <legend>
        <b class="input-label">This is a question for a radio list?</b>
    </legend>

    <ul class="checkbox-list">
        <li>
            <label class="media-object">
                <input class="media-object__figure"
                 type="radio"
                 name="radioList"
                 value="Yes">

                <b class="media-object__desc">
                    Yes
                </b>
            </label>
        </li>
        <li>
            <label class="media-object">
                <input class="media-object__figure"
                 type="radio"
                 name="radioList"
                 value="No">

                <b class="media-object__desc">
                    No
                </b>
            </label>
        </li>
    </ul>
</fieldset>
```

### Messaging

**Location:** `/forms/_messaging.less`

#### Input States

A couple of classes added to inputs (typically by a JS Validation plugin) that alter the child elements to convey states of success and error.

```html
<label class="input-label is-erroneous">
    Text Field
    <input type="text" name="text" required>
</label>
```

#### Form Messaging

Within labels, there are input alerts that apply to individual fields.

```html
<label class="input-label is-erroneous">
    Text Field
    <input type="text" name="text" required>
    <strong class="input-alert--error">
        This field is required.
    </strong>
</label>
```

## Layout

**Location:** `/layout/`

### Grid

**Location:** `/layout/_grid.less`

The default responsive grid in Motif is built with a few rules in mind:

1. Each row of columns must be wrapped in a row element
2. There's no need to specify if a column is first or last

With that in mind, there is a basic syntax to learn for what classes to use. Our breakpoints are classified as:

- Base
- Small
- Medium
- Large
- Extra Large

Our default responsive grid system only uses 3 grids to cover all of our bases:

- `grid, small` covers Base and Small viewports, but cuts off at Medium
- `grid, medium` covers only Medium
- `grid, large` starts at Large and covers Extra Large as well (there is no max cutoff value for `grid, large`)

Understanding that, the syntax should be easy to understand. In these examples, we will talk about `grid, small`:

- **Rows**: `.gs-row` (Grid, Small, Row)
- **Columns**: `.gcs` (Grid, Column, Small)
- **Column Width**: `.gs-half` (Grid, Small, Half-Width)

In practice:

```html
<div class="gs-row">
    <div class="gcs gs-half">...</div>
    <div class="gcs gs-half">...</div>
</div>
```

However, to be slightly more succinct, you can use the condensed column syntax:

**Columns (Condensed)**: `.gcs-half` (Grid, Column, Small, Half-Width)

```html
<div class="gs-row">
    <div class="gcs-half">...</div>
    <div class="gcs-half">...</div>
</div>
```

In brief, the way the grid works is that `.gcs` floats the element to the left (by default), and adds padding to both the left and the right. `-half` gives it a width of `50%`. The combined padding of the two columns bumped up against each other form the full "gutter". The `.gs-row` then clears the floats and has a *negative* margin on both the left and the right that pops the columns out to the sides the exact width of their paddings, meaning the column content lines up with the site boundaries on the left and right without the need to specify "first" or "last" column classes.

To use this responsively, then, you just add the classes by breakpoint:

```html
<!-- These will be rows on all breakpoints -->
<div class="gs-row gm-row gl-row">

    <!-- Small: 50%; Medium: 33%; Large: 25% -->
    <div class="gcs-half gcm-third gcl-quarter">
        ...
    </div>

    <!-- Small: 50%; Medium: 67%; Large: 75% -->
    <div class="gcs-half gcm-two-thirds gcl-three-quarters">
        ...
    </div>
</div>
```

By default, the column breakdown of each grid breakpoint:

- **Small Grid:** 4 columns
- **Medium Grid:** 9 columns
- **Large Grid:** 12 columns

For the larger grids, the classes follow the numbers closely...

- `.gcl-10of12`
- `.gcm-4of9`

...in just about every combination (based on their total column number), but all of the grids also have a few "fuzzy" shortcuts as well:

- `-half`
- `-third`
- `-quarter`
- `-three-quarters`
- `-two-thirds`


#### Media Grid

The Media Grid allows you to place a grid of photos or videos (catalog or retail products, etc.) without floating them, alleviating the need to concern yourself with clearing the floats with rows should an object extend further than another. Also, because they are not floating, it allows you to align the entire group center, making sure any "orphaned" grid entries are centered.

The syntax is simply the same as the regular responsive grid system, except the row class has a `--flex` modifier.

```html
<!-- Rows with the `--flex` modifier turn a grid into a flexible media grid -->
<ul class="gs-row--flex gm-row--flex gl-row--flex">
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
            <figcaption>Alderaan is peaceful. We have no weapons.</figcaption>
        </figure>
    </li>
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
        </figure>
    </li>
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
            <figcaption>Alderaan is peaceful. We have no weapons.</figcaption>
        </figure>
    </li>
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
        </figure>
    </li>
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
            <figcaption>Alderaan is peaceful. We have no weapons.</figcaption>
        </figure>
    </li>
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
        </figure>
    </li>
    <li class="gcs-half gcm-third gcl-third">
        <figure class="figure">
            <img src="http://placehold.it/400">
        </figure>
    </li>
</ul>
```

### Off-Canvas (Small Screens Only)

**Location:** `/layout/_off-canvas.less`

The Off-Canvas Trigger is a simple way of pushing a column of content off-canvas and sliding it on upon trigger. In this case, the `is-active` class is placed on the `.off-canvas` wrapping element so that it can adjust both child elements.

```html
<!-- Only the primary canvas is showing -->
<div class="off-canvas">
    <div class="canvas__primary">
        ...
    </div>
    <div class="canvas__secondary">
        ...
    </div>
</div>

<!-- Now only the secondary canvas is showing -->
<div class="off-canvas is-active">
    <div class="canvas__primary">
        ...
    </div>
    <div class="canvas__secondary">
        ...
    </div>
</div>
```

## Furniture

**Location:** `/furniture/`

### Tables

**Location:** `/furniture/_tables.less`

Simple, clean default styles. Just mark it up like a normal table. Undoes table to more of a definition list on smaller viewports. (Hat tip: [Aaron Gustafson](http://codepen.io/aarongustafson/pen/ucJGv))

```html
<table>
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Language</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td data-th="#">1</td>
            <td data-th="First Name">Some</td>
            <td data-th="Last Name">One</td>
            <td data-th="Language">English</td>
        </tr>
        <tr>
            <td data-th="#">2</td>
            <td data-th="First Name">Joe</td>
            <td data-th="Last Name">Sixpack</td>
            <td data-th="Language">English</td>
        </tr>
        <tr>
            <td data-th="#">3</td>
            <td data-th="First Name">Stu</td>
            <td data-th="Last Name">Dent</td>
            <td data-th="Language">Code</td>
        </tr>
    </tbody>
</table>
```

### panel

**Location:** `/furniture/_panel.less`

Used to provide messaging to the user, whether it be direct or through calls to action. The panel typically indicates a visual separation and implied sub-grouping of its content.

```html
<!-- Panel -->
<div class="panel">
    <h3>This is a Panel</h3>
    <p>This is a <a href="#">feedback message</a> for the user.</p>
    <p><a href="#" class="btn">User Action</a></p>
</div>

<!-- Panel with no heading -->
<div class="panel">
    <p>This is a feedback panel with no heading.</p>
</div>
```

Classes          | Description
-----------------|-----------------
`panel`          | Default callout panel
`panel--alt`     | An alternate panel style
`panel--inverse` | A change-of-pace panel with inverse styles

#### Alert Panel

This variation of the standard `.panel` is used specifically for delivering direct messages to the user, whether they be informative, complementary, or preventative. (Forms being the primary use case.)

```html
<!-- Alert panel with block content -->
<div class="alert-panel--info">
    <h3>This is a Panel</h3>
    <p>This is an <a href="#">alert message</a> for the user.</p>
    <p><a href="#" class="btn">User Action</a></p>
</div>
<div class="alert-panel--error">
    <h3>This is a Panel</h3>
    <p>This is an <a href="#">alert message</a> for the user.</p>
    <p><a href="#" class="btn">User Action</a></p>
</div>
<div class="alert-panel--success">
    <h3>This is a Panel</h3>
    <p>This is an <a href="#">alert message</a> for the user.</p>
    <p><a href="#" class="btn">User Action</a></p>
</div>

<!-- Alert panel with just text -->
<p class="alert-panel--info">
    This is an alert panel with no heading.
</p>
<p class="alert-panel--error">
    This is an alert panel with no heading.
</p>
<p class="alert-panel--success">
    This is an alert panel with no heading.
</p>
```

Classes                | Description
-----------------------|-----------------------
`alert-panel--info`    | Informational alert
`alert-panel--error`   | Indicative of errors and warnings
`alert-panel--success` | A success alert

### WYSIWYG

**Location:** `/furniture/_wysiwyg.less`

Though we keep our styles as flexible and modular as possible, there may be times, as when using a WYSIWYG editor, when some styles need to be baked in. Here, we specify a `.wysiwyg` class that wraps around that content, and hardcode some of those styles

```html
<div class="wysiwyg">
    [WYSIWYG Content]
</div>
```

## Responsive Breakpoints

**Location:** `/site/`

By default, Motif starts out with five key viewport breakpoints:


Name        | Default Breakpoint | Description
------------|--------------------|--------------------
Base        | `0px`              | From `0px` and upward, this covers everything
Small       | `480px`            | Tends to cover landscape or wider mobile-sized viewports
Medium      | `768px`            | Sized to benefit most tablet-sized viewports
Large       | `992px`            | The traditional desktop viewport, convenient for those 960 sites with a little padding on the sides
Extra Large | `1240px`           | Our widescreen breakpoint

**Note:** The default breakpoint units are stated in pixels, but are actually rendered in the equivalent `em` unit in the framework for better responsiveness through relative measurement.

## Prototype

**Location:** `/site/_proto.less`

Motif's prototype styles add some visual interest, distinction, and polish without looking too "final". They're included in the `global.less` file by default, and we encourage you to leverage them as you prototype.

Once you're ready to move from prototype to production code, nixing the proto styles is a piece of cake. Simply remove this line near the bottom of `global.less`:

```less
/**
 * Prototype Styles
 * REMOVE WHEN BEGINNING PRODUCTION
 */
@import "site/_proto.less";
```
