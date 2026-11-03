/// <reference path="./worker-configuration.d.ts" />
import { gererContact } from "./contact.mjs";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const chemin = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
    if (chemin === "/contact" && request.method === "POST") {
      return gererContact(request, env, { ctx });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
