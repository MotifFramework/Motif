export function customEvent(name, data) {
  if (typeof window.CustomEvent === "function") {
      return new CustomEvent(name, { detail: data });
  }

  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(name, true, true, data);

  return event;
}