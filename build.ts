await Bun.build({
  target: "bun",
  entrypoints: ["./index.ts"],
  outdir: "./dist",
  plugins: [
    {
      name: "assets",
      async setup(build) {
        build.onLoad({ filter: /\.(jpg|jpeg|png)$/ }, async (args) => {
          return {
            contents: `export default "${args.path}";`,
            loader: "js",
          };
        });
      },
    },
    {
      name: "react-svg",
      async setup(build) {
        build.onLoad({ filter: /\.svg$/ }, async (args) => {
          return {
            contents: `export default () => <svg></svg>;`,
            loader: "js",
          };
        });
      },
    },
    {
      name: "css-modules",
      async setup(build) {
        build.onLoad({ filter: /\.module\.(css|scss)$/ }, async (args) => {
          return {
            contents: `export default {}`,
            loader: "js",
          };
        });
      },
    },
  ],
}).catch(console.error);
