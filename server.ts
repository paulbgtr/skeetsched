import { createServer } from "http";
import { parse } from "url";
import next from "next";
import cron from "node-cron";

const port = parseInt(process.env.PORT || "3001", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const scheduler = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/send-scheduled-posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.text();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );

  cron.schedule("* * * * *", () => {
    scheduler();
  });
});
