// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {
  VIDEO_EL,
  CANVAS_EL,
  IMAGE_EL,
  CAPTURE_BTN,
  CAPTURE_AGAIN_BTN,
} = require("./elements");
const { videoStreamConfig } = require("./constants");
const {
  initializeUserFacingCamera,
  disconnectCamera,
  captureBytesFromLiveCanvas,
  captureToCanvas,
} = require("./camera");

(function initialSetup() {
  VIDEO_EL.width = videoStreamConfig.width;
  VIDEO_EL.height = videoStreamConfig.height;
  VIDEO_EL.aspectRatio = videoStreamConfig.aspectRatio;

  CANVAS_EL.width = videoStreamConfig.width;
  CANVAS_EL.height = videoStreamConfig.height;

  IMAGE_EL.width = videoStreamConfig.width;
  IMAGE_EL.height = videoStreamConfig.height;
  IMAGE_EL.hidden = true;

  CAPTURE_BTN.disabled = false;
  CAPTURE_AGAIN_BTN.disabled = true;

  initializeUserFacingCamera(navigator, VIDEO_EL).then(() => {
    console.log("Camera Initialized!!");
  });
})();

CAPTURE_BTN.addEventListener("click", () => {
  console.log("Capturing Image!!");

  CAPTURE_BTN.disabled = true;
  CAPTURE_AGAIN_BTN.disabled = false;

  captureToCanvas(VIDEO_EL, CANVAS_EL);
  IMAGE_EL.src = captureBytesFromLiveCanvas(CANVAS_EL);

  VIDEO_EL.hidden = true;
  IMAGE_EL.hidden = false;

  disconnectCamera(VIDEO_EL).then(() => {
    console.log("Camera Disconnected!!");
  });
});

CAPTURE_AGAIN_BTN.addEventListener("click", () => {
  console.log("Capturing Again!!");

  CAPTURE_BTN.disabled = true;
  CAPTURE_AGAIN_BTN.disabled = true;

  initializeUserFacingCamera(navigator, VIDEO_EL).then(() => {
    console.log("Camera Initialized!!");

    VIDEO_EL.hidden = false;
    IMAGE_EL.hidden = true;

    IMAGE_EL.src = "";

    CAPTURE_BTN.disabled = false;
  });
});
