export function getGroupIdFromElem(elem, groupAttribute) {
  if (elem.hasAttribute(groupAttribute)) {
    return elem.getAttribute(groupAttribute);
  }
  return generateId();
}
export function generateId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(2, 10);
}
export function getTargetIdsFromElem(elem) {
  if (elem.hasAttribute("aria-controls")) {
    return elem.getAttribute("aria-controls").split(" ");
  }
  if (elem.hasAttribute("data-reveal")) {
    return elem.getAttribute("data-reveal").split(" ");
  }
  if (elem.hasAttribute("href")) {
    return [elem.getAttribute("href").substr(1)];
  }
  return [];
}
export function getTriggerIdFromElem(elem) {
  if (elem.hasAttribute("id")) {
    return elem.getAttribute("id");
  }
  return generateId();
}
