export default function getAnimationFrame() {
  return window.requestAnimationFrame ||
    function (callback, elem) {
      window.setTimeout(callback, 1000 / 60);
    };
}