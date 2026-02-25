import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const db = new Database("compatibility.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/results", (req, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Data is required" });
    
    const id = uuidv4();
    const stmt = db.prepare("INSERT INTO results (id, data) VALUES (?, ?)");
    stmt.run(id, JSON.stringify(data));
    
    res.json({ id });
  });

  app.get("/api/results/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("SELECT data FROM results WHERE id = ?");
    const row = stmt.get(id) as { data: string } | undefined;
    
    if (!row) return res.status(404).json({ error: "Result not found" });
    
    res.json(JSON.parse(row.data));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
