import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import generateRoute from './routes/generate.js';

const app = express();

// Dynamic CORS policy
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [`chrome-extension://${process.env.EXT_ID}`]
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
      ];

// CORS — single source of truth
interface CorsCallback {
  (err: Error | null, allow?: boolean): void;
}

app.use(cors({
  origin: (origin: string | undefined, callback: CorsCallback): void => {
    // allow tools like curl / Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));

// Security
app.use(helmet());

// JSON parsing
app.use(express.json({ limit: '100kb' }));

// Rate limiter
const limiter = new RateLimiterMemory({
  points: 10,
  duration: 10,
});

app.use((req, res, next) => {
  const ip = req.ip || "anonymous";

  limiter.consume(ip)
    .then(() => next())
    .catch(() => res.status(429).json({ error: 'Too Many Requests' }));
});

// Routes
app.use('/api/generate', generateRoute);
console.log("Loaded router:", generateRoute);

app.listen(process.env.PORT || 3000, () =>
  console.log('Server running on', process.env.PORT || 3000)
);
