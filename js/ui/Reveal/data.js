import { getGroupIdFromElem } from "./utils";

const initialTriggerData = {
  byId: {},
  allIds: []
};

const initialTargetData = {
  byId: {},
  allIds: []
};

const initialGroupData = {
  byId: {},
  allIds: []
};

export function getDataStore() {
  if (!revealDataExists()) {
    return createRevealData();
  }
  return revealDataExists();
}
function revealDataExists() {
  return window.Reveal;
}
function createRevealData() {
  // is creating the triggers necessary?
  return (window.Reveal = createInitialData());
}

// Groups
export function getGroupData(elems, options) {
  let groupId = options.group;

  if (!groupId) {
    groupId = getGroupIdFromElem(elems[0], options.groupAttribute);
  }

  let groupData = getGroupById(groupId);

  if (!groupData) {
    groupData = addGroupToGroups(groupId, options, getGroups());
  }

  return groupData;
}

function createInitialData() {
  return {
    triggers: Object.assign({}, initialTriggerData),
    targets: Object.assign({}, initialTargetData),
    groups: Object.assign({}, initialGroupData)
  };
}

// Low-level data-fetching functions
function getData(data = window.Reveal) {
  if (!data) {
    data = createInitialData();
  }
  return data;
}

// Get Data: Groups
function getGroups(data = window.Reveal) {
  return getData(data).groups;
}
function getGroupById(id, data = window.Reveal) {
  return getGroups(data).byId[id];
}

// Get Data: Targets
function getTargets(data = window.Reveal) {
  return getData(data).targets;
}
export function getTargetById(id) {
  return getTargets().byId[id];
}

// Get Data: Triggers
function getTriggers(data = window.Reveal) {
  return getData(data).triggers;
}
export function getTriggerById(id, data) {
  return getTriggers(data).byId[id];
}

// Low-level data-setting functions
function setData(data) {
  window.Reveal = Object.assign({}, window.Reveal, data);
}

// Set Data: Groups
function addGroupToGroups(id, options, groups) {
  try {
    groups.byId[id] = {
      id,
      type: options.type,
      triggerIds: []
    };
    groups.allIds.push(id);
  } catch (err) {
    console.error("Couldn't add group to groups:", err);
  }
  return groups.byId[id];
}

// Set Data: Targets
export function createTargets(targetIds) {
  const targetsData = createTargetsData(targetIds);
  return addTargets(targetsData);
}
export function createTargetsData(targetIds = []) {
  return targetIds.map(targetId => {
    return {
      id: targetId,
      elem: document.getElementById(targetId)
    };
  });
}
function addTargetToTargets(target, targets) {
  try {
    targets.byId[target.id] = target;
    targets.allIds.push(target.id);
  } catch (err) {
    console.error(err);
  }
}
function addTarget(target) {
  if (!getTargetById(target.id)) {
    const newData = Object.assign({}, getData());
    const targets = getTargets(newData);
    addTargetToTargets(target, targets);
    setData(newData);
  }
}
function addTargets(targets) {
  targets.forEach(target => {
    addTarget(target);
  });
  return targets;
}

// Set Data: Triggers
export function createTrigger(trigger, group) {
  addTrigger(trigger);
  addTriggerToGroup(trigger.id, group);
  return trigger;
}
function addTriggerToTriggers(trigger, triggers) {
  try {
    triggers.byId[trigger.id] = trigger;
    triggers.allIds.push(trigger.id);
  } catch (err) {
    console.error("Couldn't add trigger to triggers:", err);
  }
}
function addTriggerToGroup(triggerId, group) {
  const newData = Object.assign({}, getData());
  let newGroup = getGroupById(group.id, newData);

  try {
    newGroup.triggerIds.push(triggerId);
  } catch (err) {
    console.error("Couldn't add trigger to group:", err);
  }

  setData(newData);
}
function addTrigger(trigger) {
  if (!getTriggerById(trigger.id)) {
    const newData = Object.assign({}, getData());
    const triggers = getTriggers(newData);
    addTriggerToTriggers(trigger, triggers);
    setData(newData);
  }
}
export function updateTrigger(triggerId, triggerData) {
  const newData = Object.assign({}, getData());
  const triggers = getTriggers(newData);
  const trigger = getTriggerById(triggerId, newData);

  triggers.byId[triggerId] = Object.assign({}, trigger, triggerData);
  setData(newData);
}
