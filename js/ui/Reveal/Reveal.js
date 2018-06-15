import {
  getDataStore,
  createTargets,
  createTrigger,
  getTriggerById,
  getTargetById
} from "./data";
import { getTargetIdsFromElem, getTriggerIdFromElem } from "./utils";

export default class Reveal {
  constructor(elem, group = {}) {
    getDataStore();
    this.elem = elem;
    this.targetIds = getTargetIdsFromElem(this.elem);
    this.group = group;
    this.data = this.createRevealItemData();
    this.init();
  }
  init() {
    this.ariaAttr();
    this.bindEvents();
  }
  getData() {
    this.data = getTriggerById(this.data.id);
    return this.data;
  }
  getTargets() {
    return this.targetIds.map(targetId => getTargetById(targetId));
  }
  createRevealItemData() {
    const targets = createTargets(this.targetIds);
    const triggerId = getTriggerIdFromElem(this.elem);

    return createTrigger(
      {
        id: triggerId,
        elem: this.elem,
        targetIds: targets.map(target => target.id),
        current: false,
        groupId: this.group.data.id
      },
      this.group.data
    );
  }
  ariaAttr() {
    if (!this.elem.hasAttribute("aria-controls")) {
      this.elem.setAttribute("aria-controls", this.getData().targetIds[0]);
    }
  }
  bindEvents() {
    this.elem.addEventListener("click", this.handleTriggerClick.bind(this));
  }
  handleTriggerClick(ev) {
    this.group.updateRevealsStates(this.getData());
    ev.preventDefault();
  }
  renderReveal() {
    this.getData();
    this.renderTrigger();
    this.renderTargets();
  }
  renderTrigger() {
    renderElem(this.elem, this.data.current);
  }
  renderTargets() {
    const targets = this.getTargets();

    targets.forEach(target => {
      renderElem(target.elem, this.data.current);
    });
  }
}

function renderElem(elem, current) {
  if (current) {
    showElem(elem);
  } else {
    hideElem(elem);
  }
  manageAria(elem, current);
}

function showElem(elem) {
  window.requestAnimationFrame(() => {
    if (!elem.classList.contains("is-revealed")) {
      elem.classList.add("is-revealed");
    }
  });
}

function hideElem(elem) {
  window.requestAnimationFrame(() => {
    if (elem.classList.contains("is-revealed")) {
      elem.classList.remove("is-revealed");
    }
  });
}

// https://raw.githubusercontent.com/Twikito/easy-toggle-state/master/dist/easy-toggle-state.es6.js
function manageAria(elem, current) {
  const config = {
    "aria-checked": current,
    "aria-expanded": current,
    "aria-hidden": !current,
    "aria-selected": current
  };
  Object.keys(config).forEach(
    key => elem.hasAttribute(key) && elem.setAttribute(key, config[key])
  );
}

/*

{
  triggerTarget: {
    byId: {
      1: {
        id: 1,
        triggerId: 1,
        targetId: 1
      }
    }
  }
  triggerGroup: {
    byId: {
      1: {
        id: 1,
        triggerId: 1,
        groupId: 1
      }
    }
  }



  "triggers": {
    1: {
      id: 1,
      elem: <>,
      targetIds: [
        1, 2, 3
      ] ,
      forIds: [
        1
      ],
      current: true
    }
  }
  "fors": {
    1: {
      id: 1,
      elem: <>,
      triggerId: 1
    }
  },
  "groups": {
    1: {
      id: 1,
      typeId: 1
    }
  },
  types: {
    1: {
      id: 1,
      type: 'exclusive'
    }
  }
  targets: {
    1: {
      id: 1,
      elem: <>,
      triggerIds: [

      ]
    }
  }
}

*/

/*
  {
    id: Number,
    elem: Object,
    targetIds: Number[],
    current: Boolean,
    groupId: String
  }
*/
/*
  Create Group Data
  {
    id: String,
    typeId: Number,
    triggerIds: Number[]
  }
*/

/*
  Create Type Data
  {
    id: Number,
    type: String
  }
*/

// Create Target Data
/*
  {
    id: Number,
    elem: Object
  }

*/
