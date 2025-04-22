const express = require("express");
const http = require("http");
const https = require("https");
const { URL } = require("url");
const getRawBody = require("raw-body");

const app = express();

app.all("/api/*", async (req, res) => {
  const targetUrl = `https://www.ulip.dpiit.gov.in${req.originalUrl.replace(
    /^\/api/,
    ""
  )}`;
  const parsedUrl = new URL(targetUrl);

  const isHttps = parsedUrl.protocol === "https:";
  const client = isHttps ? https : http;

  try {
    const rawBody = await getRawBody(req);

    const options = {
      method: req.method,
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        ...req.headers,
        host: parsedUrl.hostname,
        "content-length": rawBody.length,
      },
    };

    const proxyReq = client.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy request failed.");
    });

    proxyReq.write(rawBody);
    proxyReq.end();
  } catch (err) {
    console.error("Body parse error:", err);
    res.status(400).send("Invalid request body.");
  }
});

app.listen(5001, () => {
  console.log("Custom proxy server running on port 5001");
});
