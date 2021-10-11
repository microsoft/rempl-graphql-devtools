const esbuild = require("esbuild");

if (require.main === module) {
  (async () => {
    const __APOLLO_DEVTOOLS_SUBSCRIBER__ = (
      await esbuild.build({
        entryPoints: ["src/subscriber/index.tsx"],
        write: false,
        minify: true,
        bundle: true,
        format: "esm",
        sourcemap: true,
        watch: true,
      })
    ).outputFiles[0].text;

    return esbuild.build({
      entryPoints: ["src/publisher/index.ts"],
      write: true,
      bundle: true,
      minify: true,
      watch: true,
      sourcemap: true,
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
