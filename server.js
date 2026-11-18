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
    const { pathname } = parsedUrl;

    // If request comes to root without basePath, redirect to /shop
    if (basePath && (pathname === "/" || pathname === "")) {
      res.writeHead(301, { Location: `${basePath}/` });
      res.end();
      return;
    }

    // Ensure basePath is present for Next.js router if Passenger stripped it
    if (basePath && !parsedUrl.pathname.startsWith(basePath)) {
      req.url = `${basePath}${req.url.startsWith("/") ? "" : "/"}${req.url}`;
      parsedUrl.pathname = `${basePath}${parsedUrl.pathname.startsWith("/") ? "" : "/"}${parsedUrl.pathname}`;
    }

    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js listening on port ${port} (basePath: ${basePath})`);
  });
});

