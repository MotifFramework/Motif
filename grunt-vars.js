'use strict';

var grunt = require('grunt');
var config = {};

// Package Info
config.pkg = grunt.file.readJSON("package.json");

// Base Direcories
config.project = config.pkg.name;
config.sourceDir = "";
config.distDir = config.sourceDir + "dist/";
config.buildDir = config.sourceDir + "build/";
config.projectDir = config.sourceDir + "../../";

// Distribution
config.distCss = config.distDir + "css/";
config.distFonts = config.distDir + "fonts/";
config.distJs = config.distDir + "js/";
config.distIcons = config.distDir + "icons/";

// Build - temporary directories
config.buildLess = config.buildDir + "less/";
config.buildCss = config.buildDir + "css/";
config.buildFonts = config.buildDir + "fonts/";
config.buildJs = config.buildDir + "js/";
config.buildIcons = config.buildDir + "icons/";

// Source
config.sourceLess = config.sourceDir + "less/";
config.sourceJs = config.sourceDir + "js/";
config.sourceFonts = config.sourceDir + "fonts/";
config.sourceIcons = config.sourceDir + "icons/";
config.sourceImages = config.sourceDir + "images/";

// Export Ver Config Object
module.exports = config;