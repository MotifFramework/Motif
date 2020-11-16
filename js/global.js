// core
import reveal from "./core/ui/reveal";
import icons from "./core/ui/icons";
import dynamicImages from "./core/images/dynamicImages";
import orientation from './core/images/orientation';
import hoverIntent from './core/vendor/hoverIntent'
import forms from './core/forms/forms'
import carousels from './core/ui/carousels'
import sliders from './core/ui/sliders'
import gridlines from "./core/ui/motif.gridlines";

// pages

// shared

class App {
  constructor() {
    this.core();
    this.pages();
    this.shared();
  }

  core() {
    reveal()
    icons()
    dynamicImages()
    orientation()
    hoverIntent()
    forms()
    carousels()
    sliders()
    gridlines()
  }

  pages() {
    // page functions
  }

  shared() {
    // shared functions
  }
}

const app = new App();

window.Motif = window.Motif || {};
window.Motif.app = app;

export default app;
