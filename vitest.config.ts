import { defineConfig } from "vitest/config";
// import { esbuildDecorators } from 'esbuild-decorators'

export default defineConfig({
  test: {
    include: ["./__test__/**/*.test.ts"],
    coverage: {
      provider: "v8",
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [
  //       esbuildDecorators(),
  //     ]
  //   }
  // }
});
