import { dirname, resolve } from "node:path";
import { fromNodeMiddleware } from "nitro/h3";
import serveStatic from "serve-static";

// The Node entry is .output/server/index.mjs. Resolve from that entry so the
// self-contained .output directory also works when launched from another cwd.
const publicDir = resolve(dirname(process.argv[1]), "../public");

const assets = serveStatic(publicDir, {
  dotfiles: "deny",
  index: false,
  redirect: false,
});

export default fromNodeMiddleware((req, res, next) => {
  assets(req, res, (error) => {
    // H3 masks forwarded Connect errors as HTTP 500. Finish expected client
    // errors here so invalid ranges retain HTTP 416 and Content-Range.
    if (error?.statusCode >= 400 && error.statusCode < 500) {
      res.statusCode = error.statusCode;
      for (const [name, value] of Object.entries(error.headers ?? {})) {
        res.setHeader(name, value);
      }
      res.end();
      return;
    }
    next(error);
  });
});
