export function customEvent(name, data) {
  if (window.CustomEvent) {
      return new CustomEvent(name, { detail: data });
  }

  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(name, true, true, data);

  return event;
}