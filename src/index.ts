import express from "express";

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hi from TypeScript!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});

