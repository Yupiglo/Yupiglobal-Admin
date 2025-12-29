const https = require("https");
const fs = require("fs");
const path = require("path");
const next = require("next");
const express = require("express");
const helmet = require("helmet");
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
const { setCookie } = require("cookies-next");
const bodyParser = require("body-parser");
app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.use("/api/setCookie", (req, res) => {
    const options = {
      req,
      res,
      httpOnly: true, //Set to true only if you’re using HTTPS in production./
      path: "/" /**to ensure it’s available throughout your application. */,
      sameSite: "strict" /** restricting cookies sent to different origins. */,
      secure: true /** to prevent it from being set over a non-secure connection. */,
    };
    const { cookieName, cookieValue } = req.body;
    setCookie(cookieName, cookieValue, { req, res, ...options });
    return res.status(200).json({ message: "Cookie set!" });
  });
  server.use("/api/deleteCookie", (req, res) => {
    const cookieNames = ["token", "pan"];
    console.log(req);
    const cookies = cookieNames.map(
      (name) =>
        `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
    );

    res.setHeader("Set-Cookie", cookies);
    return res.status(200).json({ message: "Cookie deleted!" });
  });
  // Health check api defined
  //   server.get("/health", (req, res) => {
  //     const healthStatus = {
  //       uptime: process.uptime(),
  //       status: 'Status OK',
  //       timeStamp: Data.now()
  //     }
  //     try {
  //       res.status(200).send(healthStatus);
  //     } catch (error) {
  //       healthcheck.message = error;
  //       res.status(503).send();
  //     }

  //   });
  server.use("/api", (req, res) => {
    return handle(req, res);
  });

  server.use(
    express.static(path.join(__dirname, "public"), {
      setHeaders: (res, path) => {
        if (path.endsWith(".map")) {
          res.setHeader("Content-Type", "text/plain");
          res.status(403).send("Source maps are not allowed");
        }
      },
    })
  );
  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.use(helmet());

  // Additional Helmet configuration
  server.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "http://localhost:5001",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "http://localhost:5001",
        ],
        fontSrc: [
          "'self'",
          "http://localhost:5001",
        ],
        frameAncestors: ["http://localhost:5001",],
        blockAllMixedContent: [],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [], // Helps enforce HTTPS connections
      },
    })
  );

  // Add Referrer-Policy
  server.use(helmet.referrerPolicy({ policy: "no-referrer" }));

  // CORS Middleware
  const allowCrossDomain = function (req, res, next) {
    res.header("X-Content-Type-Options", "nosniff");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("X-Frame-Options", "SAMEORIGIN");
    next();
  };

  server.use(allowCrossDomain);
  https.createServer(httpsOptions, server).listen(5000, () => {
    console.log("Server running in staging");
  });
});
