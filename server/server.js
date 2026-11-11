// Dev-only backend (Exercise 6): serves the case files read-only under /api.
// Not deployed: GitHub Pages still serves the static files in public/data.
import express from "express";

const PORT = 3000;
const DATA_FOLDER = import.meta.dirname + "/../public/data";

const app = express();

// For testing loading and error states, on every endpoint:
//   ?delay=2000  waits 2 seconds before answering
//   ?fail=1      answers with HTTP 500 instead of the data
app.use(async (req, res, next) => {
  const delay = Number(req.query.delay ?? 0);
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  if (req.query.fail) {
    res.status(500).json({ error: "Simulated server error" });
    return;
  }
  next();
});

// one GET endpoint per resource, each sends the unchanged JSON file
app.get("/api/case", (req, res) => res.sendFile("case.json", { root: DATA_FOLDER }));
app.get("/api/evidence", (req, res) => res.sendFile("evidence.json", { root: DATA_FOLDER }));
app.get("/api/people", (req, res) => res.sendFile("people.json", { root: DATA_FOLDER }));
app.get("/api/locations", (req, res) => res.sendFile("locations.json", { root: DATA_FOLDER }));
app.get("/api/timeline", (req, res) => res.sendFile("timeline.json", { root: DATA_FOLDER }));

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}/api/evidence`);
});
