// @ts-check
import { defineConfig } from "astro/config";
import backgroundScript from "./integrations/deviceMonitoring";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    output: "server",

    adapter: node({mode: "standalone"}),

    integrations: [backgroundScript()]
});
