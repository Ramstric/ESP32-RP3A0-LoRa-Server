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
        SQL_HOST: envField.string({
          context: "client",
          access: "public",
        }),

        SQL_USER: envField.string({
          context: "client",
          access: "public",
        }),

        SQL_PASSWORD: envField.string({
          context: "client",
          access: "public",
        }),

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
