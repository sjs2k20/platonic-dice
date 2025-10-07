module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" }, // Jest runs in Node
        modules: "commonjs", // force CJS output
      },
    ],
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./packages/core/src"],
      },
    ],
  ],
};
