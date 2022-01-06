const videoStreamConfig = {
  // eslint-disable-next-line no-restricted-globals
  width: process.env.VIDEO_WIDTH,
  // eslint-disable-next-line no-restricted-globals
  height: process.env.VIDEO_HEIGHT,
  aspectRatio: process.env.VIDEO_WIDTH / process.env.VIDEO_HEIGHT,
  frameRate: {
    min: process.env.STREAM_FRAME_RATE_MIN,
    ideal: process.env.STREAM_FRAME_RATE_IDEAL,
  },
  latency: process.env.STREAM_LATENCY,
};

const imageMimeType = process.env.IMAGE_MIME_TYPE;

const userFacingCameraLabel = process.env.USER_FACING_CAMERA_LABEL;

module.exports = {
  videoStreamConfig,
  imageMimeType,
  userFacingCameraLabel,
};
