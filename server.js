// cPanel Phusion Passenger Next.js entry point
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/shop";

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // If Passenger stripped basePath from req.url, restore it so Next.js matches its basePath
    if (basePath && !parsedUrl.pathname.startsWith(basePath)) {
      const slash = req.url.startsWith("/") ? "" : "/";
      req.url = `${basePath}${slash}${req.url}`;
      parsedUrl.pathname = `${basePath}${slash}${parsedUrl.pathname}`;
    }

    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js listening on port ${port} (basePath: ${basePath})`);
  });
});

