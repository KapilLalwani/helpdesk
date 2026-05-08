import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { requireAuth } from "./middleware/requireAuth.js";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
}

const app = express();
const PORT = process.env.PORT ?? 3000;

const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(cors({ origin: trustedOrigins, credentials: true }));

// Better Auth handler must come before express.json()
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/auth", limiter);
}
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/me", requireAuth, (_req, res) => {
  const { id, name, email, role } = res.locals.session.user;
  res.json({ id, name, email, role });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
