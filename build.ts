import compileCSS from "./compile-css";

Bun.build({
  target: "bun",
  entrypoints: ["./index.tsx"],
  outdir: "./dist",
  plugins: [
    {
      name: "assets",
      setup(build) {
        build.onLoad({ filter: /\.(jpg|jpeg|png)$/ }, (args) => {
          return {
            contents: `export default "${args.path}";`,
            loader: "js",
          };
        });
      },
    },
    {
      name: "react-modules-svg",
      async setup(build) {
        build.onLoad({ filter: /\.svg$/ }, async (args) => {

          const [fs, toReact] = await Promise.all([
            import("fs"),
            // @ts-ignore
            import("svg-to-react"),
          ]);

          const contents = fs.readFileSync(args.path, "utf8");
          const res = toReact.convert(contents).toString();

          return {
            contents: `
            import React from "react"
            export default ${res}`,

            loader: "js",
          };
        });
      },
    },
    {
      name: "css-modules",
      async setup(build) {
        const [sass, fs] = await Promise.all([import("sass"), import("fs")]);
        build.onLoad({ filter: /\.css$/ }, (args) => {
          const contents = fs.readFileSync(args.path, "utf8");
          const isCssModule = args.path.endsWith(".module.css");
          return compileCSS(contents, args.path, {
            cssModules: isCssModule,
          });
        });
        build.onLoad({ filter: /\.scss$/ }, (args) => {
          const result = sass.compile(args.path);
          return compileCSS(result.css, args.path, {});
        });
      },
    },
  ],
}).catch(console.log);
