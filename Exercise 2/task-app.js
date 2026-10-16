import { useState, renderApp, registerAction } from "./reactive-engine.js";

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

export function TaskApp() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review PR", completed: false },
    { id: 2, title: "Verify AST", completed: false },
  ]);

  const [filter, setFilter] = useState("ALL");
  const [draft, setDraft] = useState("");

  registerAction("update-draft", (_event, input) => {
    setDraft(input.value);
  });

  registerAction("add-task", () => {
    const title = draft.trim();

    if (!title) return;

    setTasks((previous) => [
      ...previous,
      {
        id: Date.now() + Math.random(),
        title,
        completed: false,
      },
    ]);

    setDraft("");
  });

  registerAction("filter-all", () => setFilter("ALL"));
  registerAction("filter-active", () => setFilter("ACTIVE"));
  registerAction("filter-completed", () => setFilter("COMPLETED"));

  registerAction("toggle-task", (_event, button) => {
    const id = Number(button.dataset.id);

    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  });

  registerAction("delete-task", (_event, button) => {
    const id = Number(button.dataset.id);

    setTasks((previous) => previous.filter((task) => task.id !== id));
  });

  const visibleTasks = tasks.filter((task) => {
    if (filter === "ACTIVE") return !task.completed;
    if (filter === "COMPLETED") return task.completed;
    return true;
  });

  return `
    <section class="task-card">
      <p>EXERCISE 02 · STATE ENGINE</p>
      <h1>Reactive Task Manager</h1>
      <p>One-way data flow. One root event hub.</p>

      <div class="add-row">
        <input
          data-action="update-draft"
          aria-label="New task"
          placeholder="Add a task..."
          value="${escapeHTML(draft)}"
        >

        <button
          type="button"
          data-action="add-task"
        >
          Add task
        </button>
      </div>

      <nav class="filters">
        <button data-action="filter-all" type="button">ALL</button>
        <button data-action="filter-active" type="button">ACTIVE</button>
        <button data-action="filter-completed" type="button">
          COMPLETED
        </button>
      </nav>

      <ul class="task-list">
        ${visibleTasks
          .map(
            (task) => `
          <li class="task-item ${task.completed ? "done" : ""}">
            <span>${escapeHTML(task.title)}</span>

            <button
              type="button"
              data-action="toggle-task"
              data-id="${task.id}"
            >
              ${task.completed ? "Undo" : "Complete"}
            </button>

            <button
              type="button"
              data-action="delete-task"
              data-id="${task.id}"
            >
              Delete
            </button>
          </li>
        `,
          )
          .join("")}

        ${visibleTasks.length === 0 ? "<li>No tasks in this filter.</li>" : ""}
      </ul>

      <footer>
        <span>${tasks.length} total tasks</span>
        <span>Current filter: <strong>${filter}</strong></span>
      </footer>
    </section>
  `;
}

const root = document.querySelector("#app");

if (root) {
  renderApp(TaskApp, root);
}
