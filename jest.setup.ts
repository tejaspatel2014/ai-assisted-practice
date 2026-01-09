import "@testing-library/jest-dom";

// JSDOM does not implement canvas. Prevent noisy console errors by stubbing getContext.
if (typeof HTMLCanvasElement !== "undefined") {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    // Return null like a failed context acquisition rather than throwing
    value: jest.fn(() => null),
  });
}
