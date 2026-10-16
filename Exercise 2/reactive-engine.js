export const stateStore = [];

let stateCursor = 0;
let currentApp = null;
let currentRoot = null;

const delegatedActions = new Map();
const rootsWithDelegation = new WeakSet();

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

export function registerAction(name, handler) {
  delegatedActions.set(name, handler);
}

export function hasRootDelegation(root) {
  return Boolean(root && rootsWithDelegation.has(root));
}

export function attachRootDelegation(root) {
  if (!root || rootsWithDelegation.has(root)) return;

  const dispatch = (event) => {
    const control = event.target.closest?.("[data-action]");

    if (!control || !root.contains(control)) return;

    const handler = delegatedActions.get(control.dataset.action);

    if (handler) {
      handler(event, control);
    }
  };

  root.addEventListener("click", dispatch);
  root.addEventListener("input", dispatch);

  rootsWithDelegation.add(root);
}

export function renderApp(App, root) {
  currentApp = App;
  currentRoot = root;

  resetCursor();
  root.innerHTML = App();

  attachRootDelegation(root);
}
