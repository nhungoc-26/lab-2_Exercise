import { renderApp, hasRootDelegation } from "./reactive-engine.js";

import { TaskApp } from "./task-app.js";

function check(name, passed) {
  return { name, passed: Boolean(passed) };
}

export function runCheckpoint2Audit() {
  const root = document.querySelector("#app");
  const results = document.querySelector("#audit-results");

  if (!root || !results) return;

  renderApp(TaskApp, root);

  const before = root.querySelectorAll(".task-item").length;

  const input = root.querySelector('[data-action="update-draft"]');
  input.value = "Checkpoint task";

  input.dispatchEvent(new Event("input", { bubbles: true }));

  const addButton = root.querySelector('[data-action="add-task"]');
  addButton.click();

  const after = root.querySelectorAll(".task-item").length;

  const checks = [
    check("State update and re-render", after === before + 1),
    check("Root event delegation attached", hasRootDelegation(root)),
    check("Task count updated", after === before + 1),
  ];

  results.innerHTML = checks
    .map(
      (item) => `
    <li>
      ${item.passed ? "PASS" : "FAIL"} — ${item.name}
    </li>
  `,
    )
    .join("");

  console.table(checks);
}

document
  .querySelector("#run-audit")
  ?.addEventListener("click", runCheckpoint2Audit);
