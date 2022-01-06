// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const replaceElementInnerTextByIdSelector = (selector, text) => {
  const elements = document.getElementsByClassName(selector);

  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].innerText = text;
    }
  }
};
