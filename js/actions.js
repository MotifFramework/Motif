import ui from "./ui";
import images from "./images";
import forms from "./forms";

class App {
  constructor() {
    ui();
    images();
    forms();
  }
}

const app = new App();

window.Motif = window.Motif || {};
window.Motif.app = app;

export default app;
