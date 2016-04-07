var paths = require("../grunt-vars");

module.exports = {
    // Icons
    iconsBuild: {

        // Source SVGs
        src: paths.sourceFonts + paths.project + "-icons/svg/*.svg",

        // Destination Folder
        dest: paths.buildFonts + paths.project + "-icons/",

        // Destination CSS
        destCss: paths.sourceLess + "type/",
        options: {
            engine: "node",
            autoHint: false,
            font: paths.project + "-icons",
            types: "eot,woff,ttf,svg",
            hashes: false,
            relativeFontPath: "../fonts/" + paths.project + "-icons/",
            template: paths.sourceFonts + paths.project + "-icons/template/template.css",
            stylesheet: "less",
            destHtml: paths.buildFonts + paths.project + "-icons/",
            startCodepoint: 0xF101
        }
    },
    iconsDist: {

        // Source SVGs
        src: paths.sourceFonts + paths.project + "-icons/svg/*.svg",

        // Destination Folder
        dest: paths.distFonts + paths.project + "-icons/",

        // Destination CSS
        destCss: paths.sourceLess + "type/",
        options: {
            engine: "node",
            autoHint: false,
            font: paths.project + "-icons",
            types: "eot,woff,ttf,svg",
            hashes: false,
            relativeFontPath: "../fonts/" + paths.project + "-icons/",
            template: paths.sourceFonts + paths.project + "-icons/template/template.css",
            stylesheet: "less",
            destHtml: paths.distFonts + paths.project + "-icons/",
            startCodepoint: 0xF101
        }
    }
};