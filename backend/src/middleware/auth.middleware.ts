import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET nao configurado no .env");
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "PATIENT" | "PSYCHOLOGIST";
  };
}

interface TokenPayload extends JwtPayload {
  userId: string;
  role: "PATIENT" | "PSYCHOLOGIST";
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token nao informado",
    });
  }

  const token: string = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({
      message: "Token nao informado",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Token invalido ou expirado",
    });
  }
}