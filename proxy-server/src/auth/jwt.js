import jwt from "jsonwebtoken";
import { SECURITY } from "../config/security.js";

export function signToken(payload) {
  return jwt.sign(payload, SECURITY.JWT_SECRET, {
    expiresIn: SECURITY.JWT_EXPIRY
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECURITY.JWT_SECRET);
}
