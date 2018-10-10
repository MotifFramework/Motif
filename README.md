Motif
====


The Philosophy
----

Motif was created and developed to aid and promote front-end systems that are purposeful, efficient, adaptive, and reusable. Borrowing ideals, ideas, and methods from the likes of progressive enhancement, [Object Oriented CSS](https://github.com/stubbornella/oocss), [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), and countless others, the framework encourages an iterative, modular, agile style of development, from sketch to final code and then all over again.

### Lego Bricks

One way we like to look at the code we create with Motif is pretending we were creating Lego bricks. If we were in charge of creating low-level bricks, bricks that would become the building blocks for larger structures, how would we go about creating them?

This thought process encourages you to think about how specific and how modular you want your CSS and JavaScript to be, and when they ought to be that way. The 2x2 Lego brick can go a long way and help create countless creations, but there are some instances where a 2x4 brick makes life easier. Similarly, creating very DRY or OOCSS classes allow you to be very flexible, mixing and matching classes, but when you're creating classes that a client may need to use inside a WYSIWYG editor, some less modular classes might be better for the job.

As you see the different pieces of Motif come together, take notice of how that Lego Brick thought process plays out.

### Separate Structure from Skin

An idea popularized by Nicole Sullivan and OOCSS ([which we'll quote from](https://github.com/stubbornella/oocss/wiki#separate-structure-and-skin)), separating structure from skin

> [...] means to define repeating visual features (like background and border styles) as separate “skins” that you can mix-and-match with your various objects to achieve a large amount of visual variety without much code.

What this traditionally translates to are CSS classes that represent the structure...

```css
.panels {
    margin: 20px 0 0;
    padding: 20px;
    border: 1px solid;
}
```

...and some modifying "skin" classes:

```css
.panels__alert {
    background: pink;
    border-color: red;
}
```

Both classes would be applied to the HTML element:

```html
<div class="panels panels__alert">...</div>
```

We do things slightly different in Motif's stylesheet. Using the magic of some of the more advanced CSS attribute selectors, we accomplish the same technique but without requiring multiple classes:

```css
[class*="panels__"] {
    margin: 20px 0 0;
    padding: 20px;
    border: 1px solid;
}
.panels__alert {
    background: pink;
    border-color: red;
}
.panels__success {
    background: yellow;
    border-color: green;
}
```

```html
<div class="panels__alert">...</div>
```

(To learn more about this technique, read the excellent 24 Ways article, [A Harder-Working Class](http://24ways.org/2012/a-harder-working-class/).)

There's a lot more to how Motif was built, and this section will continue to grow, but these are some of the key philosophies behind how this framework was built and what we hope it encourages.

Installation and Dependencies
----

### Distribution Files

If you download Motif's pre-compiled distribution files, you receive:

-  **Coming Soon:** Motif Base CSS *without* Prototype Styles (minified and non-minified)
- Motif Base CSS + Prototype Styles (minified and non-minified)
- Motif jQuery Plugins (minified)

The Motif jQuery Plugins all (obviously) require the jQuery framework (at least v1.11.0), which you can reference from a CDN or download from [the jQuery website](http://jquery.com).

Include references to the stylesheets and plugins in your HTML, and you're ready to go!

```html
<link href="/path/to/css/motif.min.css" rel="stylesheet">
...
<script src="http://path/to/cdn/jquery-1.11.0.min.js"></script>
<script src="/path/to/js/motif.gauntlet.min.js"></script>
<script src="/path/to/js/actions.min.js"></script>
```

[Learn more about Motif's jQuery Plugins](https://github.com/MotifFramework/Motif/blob/master/js/README.md)

### Source Files

To work with the Motif source files (what we recommend, especially for production projects), grab the latest code.

#### Less

The stylesheet of Motif is written for the Less preprocessor, allowing us to take advantage of variables, mixins, organization, and a slew of other nifty features and tricks. You can [learn more about Less at its website](http://lesscss.org). To learn about how Motif's styles, check out [Motif's Less Documentation](https://github.com/MotifFramework/Motif/blob/master/less/README.md).

#### Grunt

Less must eventually be compiled to straight CSS, and while you can use a number of tools to accomplish this, by default, Motif source files are compiled and combined using [Grunt](http://gruntjs.com), a task runner for NodeJS. Motif uses it to compile Less into CSS, to concatenate and minify JavaScript files (including framework plugins and third-party plugins and libraries), and to compile SVG files into an icon webfont.

#### Icon Font

Motif comes bundled with a small starter icon font created from 30+ SVG icons. From social icons to those useful in responsive prototyping, they can all be found in the `/fonts/motif-icons/svg/` folder. As noted before, Motif uses a Grunt plugin to compile those SVGs into a font, meaning you can add and remove SVGs to and from that folder and Grunt will re-create the font with the updated glyphs. [Learn more about the Grunt Webfont plugin](https://github.com/sapegin/grunt-webfont).

#### What You'll Need

- Command line terminal
- [NodeJS](http://nodejs.org) (which includes NPM, the Node Package Manager)

#### Installation

In the terminal, navigate to the directory you've placed the Motif source files and get NPM to grab all of the dependencies:

	npm install

Once that has finished, build Motif from the source files:

	grunt build

Look in the `/dist/` folder and you should see folders and files for Motif's styles, scripts, and font. Congrats!


#### Grunt Tasks

Aside from the `grunt build` task, Motif comes with some other useful tasks:

Command            | Description
-------------------|-------------------
`grunt`            | The default task compiles Less, concatenates JS.
`grunt build`      | Compiles Less, concatenates JS, re-creates icon webfont.
`grunt dist`       | The task we use to create distribution files for Motif. Might not be useful in your project, but it does the same thing as `grunt build` except it compresses and minifies the code.
`grunt watch`      | Watches Less, JS, and SVG files for changes and recompiles automatically. If you have the LiveReload extension installed, it will appropriately refresh you page.
`grunt less-build` | Compiles Less.
`grunt fonts`      | Creates icon webfont.
`grunt js`         | Concatenates JS.


Motif Documentation
----

- [Motif's Less Documentation](https://github.com/MotifFramework/Motif/blob/master/less/README.md)
- [Motif's jQuery Plugins](https://github.com/MotifFramework/Motif/blob/master/js/README.md)


Acknowledgements
----

A big thank you to the innovative geniuses behind these awesome technologies and ideas that Motif depends on:

- [Less](http://lesscss.org)
- [jQuery](http://jquery.com)
- [Modernizr](http://modernizr.com)
- [NodeJS](http://nodejs.org)
- [Grunt](http://gruntjs.com)
- [Normalize.css](http://necolas.github.io/normalize.css/)
- [OOCSS](https://github.com/stubbornella/oocss)
- [BEM](http://bem.info/method/)

## MIT Open Source License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
