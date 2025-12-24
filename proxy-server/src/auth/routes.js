import express from "express";
import rateLimit from "express-rate-limit";
import { signToken } from "./jwt.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});

router.get("/bootstrap", limiter, (req, res) => {
  const origin = req.headers.host.split(':')[0];
  const token = signToken({
    origin,
    ua: req.headers["user-agent"]
  });

  res.json({ token });
});

export default router;
