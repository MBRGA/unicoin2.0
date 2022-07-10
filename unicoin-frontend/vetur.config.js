// vetur.config.js

const path = require("path");

/** @type { import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true,
    "typescript.tsdk": path.resolve(__dirname, ".yarn/sdks/typescript/bin"),
  },
};
