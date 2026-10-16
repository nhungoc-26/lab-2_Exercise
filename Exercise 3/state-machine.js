const VALID_STATES = ["IDLE", "LOADING", "SUCCESS", "ERROR"];

let state = { status: "IDLE" };
let requestId = 0;

const feedElement = document.querySelector("#feed");
const statusElement = document.querySelector("#status");
const loadButton = document.querySelector("#load-button");

function setState(nextState) {
  if (!VALID_STATES.includes(nextState.status)) {
    throw new Error(`Invalid state: ${nextState.status}`);
  }

  state = nextState;
  render();
}

function render() {
  statusElement.textContent = state.status;
  feedElement.innerHTML = "";

  switch (state.status) {
    case "IDLE":
      feedElement.innerHTML = `
        <p class="message">Ready to load data.</p>
      `;
      loadButton.disabled = false;
      loadButton.textContent = "Load Data";
      break;

    case "LOADING":
      feedElement.innerHTML = `
        <div class="skeleton-card" aria-label="Loading data">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line short"></div>
        </div>
        <div class="skeleton-card" aria-hidden="true">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line short"></div>
        </div>
      `;
      loadButton.disabled = true;
      loadButton.textContent = "Loading...";
      break;

    case "SUCCESS":
      feedElement.innerHTML = `
        <h3>Data loaded successfully</h3>
        <ul>
          ${state.data
            .map(
              (item) => `
            <li class="data-item">
              <strong>${escapeHTML(item.title)}</strong>
              <p>${escapeHTML(item.description)}</p>
            </li>
          `,
            )
            .join("")}
        </ul>
        <button id="reload-button" type="button">Reload Data</button>
      `;
      loadButton.disabled = false;
      loadButton.textContent = "Load Data";
      break;

    case "ERROR":
      feedElement.innerHTML = `
        <div class="error-message" role="alert">
          <h3>Unable to load data</h3>
          <p>${escapeHTML(state.error)}</p>
          <button id="retry-button" type="button">
            Retry Connection
          </button>
        </div>
      `;
      loadButton.disabled = false;
      loadButton.textContent = "Load Data";
      break;
  }
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

// Simulated asynchronous API request.
// About 20% of requests fail so the ERROR and Retry states can be tested.
async function fetchFeed() {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  if (Math.random() < 0.2) {
    throw new Error("Connection failed. Please try again.");
  }

  return [
    {
      id: 1,
      title: "Reactive State Machine",
      description: "Manages the four UI states safely.",
    },
    {
      id: 2,
      title: "Skeleton Loader",
      description: "Shows animated placeholders while loading.",
    },
    {
      id: 3,
      title: "Retry Connection",
      description: "Allows another attempt after an error.",
    },
  ];
}

async function loadData() {
  const currentRequestId = ++requestId;

  setState({ status: "LOADING" });

  try {
    const items = await fetchFeed();

    // Ignore stale responses from older requests.
    if (currentRequestId !== requestId) return;

    setState({ status: "SUCCESS", data: items });
  } catch (error) {
    // Ignore errors from older requests too.
    if (currentRequestId !== requestId) return;

    setState({
      status: "ERROR",
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
}

loadButton.addEventListener("click", loadData);

feedElement.addEventListener("click", (event) => {
  if (event.target.closest("#retry-button")) {
    loadData();
  }

  if (event.target.closest("#reload-button")) {
    loadData();
  }
});

render();
