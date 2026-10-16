export const stateStore = [];

let stateCursor = 0;
let currentApp = null;
let currentRoot = null;

export function resetCursor() {
  stateCursor = 0;
}

export function useState(initialValue) {
  const cursor = stateCursor;

  if (!(cursor in stateStore)) {
    stateStore[cursor] = initialValue;
  }

  const setState = (nextValue) => {
    stateStore[cursor] =
      typeof nextValue === "function"
        ? nextValue(stateStore[cursor])
        : nextValue;

    if (currentApp && currentRoot) {
      renderApp(currentApp, currentRoot);
    }
  };

  stateCursor++;
  return [stateStore[cursor], setState];
}

export function renderApp(App, root) {
  currentApp = App;
  currentRoot = root;

  resetCursor();
  root.innerHTML = App();
}
