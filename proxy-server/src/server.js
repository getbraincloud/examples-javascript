import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import authRoutes from "./auth/routes.js";
import { requireAuth } from "./auth/middleware.js";
import bcRoutes from './braincloud/routes.js';

const app = express();

app.use(bodyParser.json());

app.use(cors());


app.use("/auth", authRoutes);
app.use("/bc", requireAuth, bcRoutes);

app.get("/test", requireAuth, (req, res) => {
  res.json({
    ok: true,
    auth: req.auth
  });
});

const PORT = process.env.PORT || 3015;

app.listen(PORT, () => {
  console.log(`brainCloud proxy running on port ${PORT}`);
});
