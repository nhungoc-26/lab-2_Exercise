// Create a text VNode
export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(text),
      children: [],
    },
  };
}

// Create an element VNode
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...(props || {}),
      children: children
        .flat()
        .map((child) =>
          typeof child === "object" ? child : createTextElement(child),
        ),
    },
  };
}
git add "Exercise 1/mini-react.js"
git commit -m "feat(core): implement createElement factory"
