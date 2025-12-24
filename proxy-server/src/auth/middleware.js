import { verifyToken } from "./jwt.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }

  const [, token] = authHeader.split(" ");
  try {
    console.log(`verify token ${token}`);
    const decoded = verifyToken(token);
    req.auth = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

}
