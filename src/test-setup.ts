// Polyfills for running unit tests under jsdom (the default Vitest environment).
// Ionic components such as ion-menu and ion-split-pane query `window.matchMedia`,
// which jsdom does not implement.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Polyfill for Ionic components that use scrollTo() during unit tests.
// jsdom does not implement scrollTo() by default.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function (
    _x?: number | ScrollToOptions,
    _y?: number
  ): void {
    // No scrolling is needed in the unit test environment.
  };
}


