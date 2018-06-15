import { getDataStore, getGroupData, updateTrigger } from "./data";
import Reveal from "./Reveal";

const DEFAULTS = {
  type: "default",
  groupAttribute: "data-reveal-group"
};

/**
 * Generates a group of Reveal items
 * @class
 */
export default class RevealGroup {
  constructor(elems, options) {
    getDataStore();
    this.elems = getRevealGroupElems(elems);
    this.options = Object.assign({}, DEFAULTS, options);
    this.data = getGroupData(this.elems, this.options);
    this.revealObjects = this.initReveals();
  }
  initReveals() {
    return this.elems.map(elem => new Reveal(elem, this));
  }
  updateRevealsStates(triggerToChange) {
    const currentData = Object.assign({}, triggerToChange);

    if (
      !currentData.current ||
      (currentData.current && this.data.type !== "radio")
    ) {
      updateTrigger(currentData.id, {
        current: !currentData.current
      });
    }
    if (!currentData.current && this.data.type !== "default") {
      this.revealObjects
        .filter(revealObject => revealObject.data.id !== currentData.id)
        .forEach(revealObject => {
          updateTrigger(revealObject.data.id, {
            current: false
          });
        });
    }
    this.renderReveals();
  }
  renderReveals() {
    this.revealObjects.forEach(revealObject => {
      revealObject.renderReveal();
    });
  }
}

function getRevealGroupElems(elems) {
  if (typeof elems === "string") {
    elems = document.querySelectorAll(elems);
  }
  return [].slice.call(elems);
}
