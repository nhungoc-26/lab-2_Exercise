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

// Convert a VNode into a real DOM node
export function renderToDOM(vnode) {
  if (!vnode || typeof vnode !== "object") {
    throw new TypeError("Invalid VNode");
  }

  // Render text safely
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  // Only allow valid HTML element names
  if (typeof vnode.type !== "string") {
    throw new TypeError("VNode type must be a string");
  }

  const element = document.createElement(vnode.type);

  const props = vnode.props || {};

  for (const [name, value] of Object.entries(props)) {
    if (name === "children") {
      continue;
    }

    // Event handler: onClick -> click
    if (name.startsWith("on") && typeof value === "function") {
      const eventName = name.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
      continue;
    }

    // className -> class
    if (name === "className") {
      element.setAttribute("class", value);
      continue;
    }

    // Prevent dangerous HTML injection
    if (name === "dangerouslySetInnerHTML") {
      throw new Error("dangerouslySetInnerHTML is not supported");
    }

    // Do not allow javascript: URLs
    if (
      (name === "href" || name === "src") &&
      typeof value === "string" &&
      value.trim().toLowerCase().startsWith("javascript:")
    ) {
      throw new Error("Unsafe URL blocked");
    }

    element.setAttribute(name, value);
  }

  // Recursively mount children
  for (const child of props.children || []) {
    element.appendChild(renderToDOM(child));
  }

  return element;
}
