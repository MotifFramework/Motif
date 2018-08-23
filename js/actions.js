import ui from "./ui";
import forms from "./forms";

class App {
  constructor() {
    ui();
    forms();
  }
}

const app = new App();

window.Motif = window.Motif || {};
window.Motif.app = app;

export default app;
