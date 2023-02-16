/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(`[vue-router] ${message}`)
  }
}

function warn (condition, message) {
  if (!condition) {
    typeof console !== 'undefined' && console.warn(`[vue-router] ${message}`);
  }
}

export { assert, warn };
