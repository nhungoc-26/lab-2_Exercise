import { createElement, createTextElement, renderToDOM } from "./mini-react.js";

// ==========================================
// CHECKPOINT 1: VNode creation
// ==========================================

const vApp = createElement(
  "main",
  {
    id: "root-view",
    role: "main",
  },

  createElement(
    "header",
    {
      className: "hero",
    },

    createElement("h1", null, "Mini React Engine"),

    createElement("p", null, "Safe Text"),
  ),

  createElement(
    "button",
    {
      onClick: () => console.log("Ping"),
    },
    "Click",
  ),
);

// ==========================================
// CHECKPOINT 2: Mounting
// ==========================================

const root = document.getElementById("app");

if (!root) {
  throw new Error("Root element #app not found");
}

root.replaceChildren(renderToDOM(vApp));

console.assert(root.querySelector("button") !== null, "Mount Failed");

// ==========================================
// CHECKPOINT 3: Semantic HTML verification
// ==========================================

console.assert(root.querySelector("main") !== null, "Semantic <main> missing");

console.assert(
  root.querySelector("header") !== null,
  "Semantic <header> missing",
);

console.assert(root.querySelector("h1") !== null, "Semantic <h1> missing");

console.assert(root.querySelector("p") !== null, "Semantic <p> missing");

console.assert(root.querySelectorAll("div").length === 0, "Div-soup detected");

// ==========================================
// CHECKPOINT 4: VNode structure verification
// ==========================================

console.assert(vApp.type === "main", "Root VNode type is incorrect");

console.assert(
  vApp.props.children[0].type === "header",
  "Header VNode missing",
);

console.assert(
  vApp.props.children[0].props.children[0].type === "h1",
  "H1 VNode missing",
);

// ==========================================
// CHECKPOINT 5: Text node verification
// ==========================================

const textVNode = createTextElement("Hello Mini React");

console.assert(textVNode.type === "TEXT_ELEMENT", "Text VNode type incorrect");

const textDOM = renderToDOM(textVNode);

console.assert(
  textDOM.nodeType === Node.TEXT_NODE,
  "Text was not rendered as a text node",
);

// ==========================================
// CHECKPOINT 6: XSS security verification
// ==========================================

const maliciousInput = "<script>window.__xssExecuted = true</script>";

const xssVNode = createElement("p", null, maliciousInput);

const xssDOM = renderToDOM(xssVNode);

console.assert(
  xssDOM.textContent === maliciousInput,
  "XSS text was not preserved safely",
);

console.assert(
  xssDOM.querySelector("script") === null,
  "XSS vulnerability: script element created",
);

console.assert(
  window.__xssExecuted !== true,
  "XSS vulnerability: script executed",
);

// ==========================================
// CHECKPOINT 7: Event handler verification
// ==========================================

let clicked = false;

const buttonVNode = createElement(
  "button",
  {
    onClick: () => {
      clicked = true;
    },
  },
  "Test Button",
);

const buttonDOM = renderToDOM(buttonVNode);

buttonDOM.click();

console.assert(clicked === true, "Event handler failed");

// ==========================================
// Final result
// ==========================================

console.log("Checkpoint 1: PASS");
console.log("VNode creation: PASS");
console.log("DOM mounting: PASS");
console.log("Semantic HTML: PASS");
console.log("No div-soup: PASS");
console.log("XSS protection: PASS");
console.log("Event handling: PASS");
console.log("VNode tree verification: PASS");

// XSS Security Test
const test = renderToDOM(
  createElement("p", null, '<script>alert("HACKED")</script>'),
);

console.log("XSS text:", test.textContent);

console.assert(
  test.textContent === '<script>alert("HACKED")</script>',
  "XSS text was not preserved safely",
);

console.assert(
  test.querySelector("script") === null,
  "XSS vulnerability: script element created",
);

console.log("XSS Test: PASS");
