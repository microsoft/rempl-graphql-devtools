const esbuild = require("esbuild");

if (require.main === module) {
  (async () => {
    const __APOLLO_DEVTOOLS_SUBSCRIBER__ = await esbuild.buildSync({
      entryPoints: ["src/subscriber/index.tsx"],
      write: false,
      minify: true,
      bundle: true,
      format: "esm",
      sourcemap: false,
    }).outputFiles[0].text;

    return esbuild.buildSync({
      entryPoints: ["src/publisher/index.ts"],
      write: true,
      bundle: true,
      minify: true,
      sourcemap: false,
      outfile: "dist/apollo-devtools.js",
      format: "iife",
      define: {
        __APOLLO_DEVTOOLS_SUBSCRIBER__: JSON.stringify(
          __APOLLO_DEVTOOLS_SUBSCRIBER__
        ),
      },
    });
  })();
}
