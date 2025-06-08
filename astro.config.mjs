// @ts-check
import { defineConfig, envField} from "astro/config";

import node from "@astrojs/node";

import backgroundScript from "./integrations/deviceMonitoring";

// https://astro.build/config
export default defineConfig({
    output: "server",

    adapter: node({mode: "standalone"}),

    env: {
      schema: {
        DATABASE_NAME: envField.string({
          context: "client",
          access: "public",
        }),

        TABLE_NAME: envField.string({
          context: "client",
          access: "public",
        }),

      },
    },

    integrations: [backgroundScript()]
});
