const {
  imageMimeType,
  userFacingCameraLabel,
  videoStreamConfig,
} = require("./constants");

const mediaStreamConstraints = {
  audio: false,
  video: {
    ...videoStreamConfig,
  },
};

const initializeCamera = (navigator, videoElement, cameraLabel) => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const targetDeviceInfo = devices.find((deviceInfo) => {
          return (
            deviceInfo.kind === "videoinput" &&
            deviceInfo.label.includes(cameraLabel)
          );
        });

        // eslint-disable-next-line promise/always-return
        if (targetDeviceInfo) {
          // eslint-disable-next-line promise/no-nesting
          navigator.mediaDevices
            .getUserMedia({
              ...mediaStreamConstraints,
              video: {
                ...mediaStreamConstraints.video,
                deviceId: targetDeviceInfo.deviceId,
              },
            })
            // eslint-disable-next-line promise/always-return
            .then((stream) => {
              videoElement.srcObject = stream;
              resolve(true);
            })
            .catch(() => {
              reject();
            });
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};

const initializeUserFacingCamera = (navigator, videoElement) => {
  return initializeCamera(navigator, videoElement, userFacingCameraLabel);
};

function disconnectCamera(videoElement) {
  return new Promise((resolve) => {
    if (!videoElement.srcObject) {
      resolve(true);
    }

    let mediaStream = videoElement.srcObject;

    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = undefined;
    videoElement.src = "";

    resolve(true);
  });
}

function captureBytesFromLiveCanvas(canvasElement) {
  return canvasElement.toDataURL(imageMimeType);
}

function captureToCanvas(videoElement, canvasElement) {
  const context = canvasElement.getContext("2d");

  if (!context) {
    return;
  }

  const ratio = videoStreamConfig.width / videoStreamConfig.height;
  const height = videoElement.videoWidth / ratio;
  const yOffset = (videoElement.videoHeight - height) / 2;

  context.setTransform(-1, 0, 0, 1, canvasElement.width, 0);

  context.drawImage(
    videoElement,
    0,
    yOffset,
    videoElement.videoWidth,
    height,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
}

module.exports = {
  initializeUserFacingCamera,
  disconnectCamera,
  captureBytesFromLiveCanvas,
  captureToCanvas,
};
