const esbuild = require("esbuild");

if (require.main === module) {
  (async () => {
    const __APOLLO_DEVTOOLS_SUBSCRIBER__ = (
      await esbuild.build({
        entryPoints: ["src/subscriber/index.tsx"],
        write: false,
        minify: false,
        bundle: true,
        format: "esm",
        sourcemap: true,
        watch: false,
      })
    ).outputFiles[0].text;

    return esbuild.build({
      entryPoints: ["src/publisher/index.ts"],
      write: true,
      bundle: true,
      minify: false,
      watch: false,
      sourcemap: true,
      outfile: "playground/public/apollo-devtools.js",
      format: "iife",
      define: {
        __APOLLO_DEVTOOLS_SUBSCRIBER__: JSON.stringify(
          __APOLLO_DEVTOOLS_SUBSCRIBER__
        ),
      },
    });
  })();
}
