/**
 * Efizientia SaaS · server/middleware/auth.ts
 * Middleware de autenticación JWT via httpOnly cookie.
 * - requireAuth: verifica sesión activa, adjunta req.user
 * - requireAdmin: además verifica role === 'admin'
 * - requireOwnerOrAdmin: para comerciales que solo pueden tocar su propia ficha
 */

import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { Request, Response, NextFunction } from "express";

export interface AuthUser {
  id: number;
  email: string;
  role: "admin" | "comercial";
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

function extractToken(req: Request): string | null {
  // 1. Cookie httpOnly (producción normal)
  if (req.cookies?.auth_token) return req.cookies.auth_token;
  // 2. Bearer header (útil para pruebas con curl / Postman)
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: "No autenticado" });
  }
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Sesión expirada o inválida" });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado: se requiere rol admin" });
    }
    next();
  });
}

/** Middleware para rutas de panel de comercial.
 *  El admin puede acceder a cualquier perfil.
 *  El comercial solo puede acceder al profileId que le pertenece.
 *  Usar después de requireAuth, antes del handler.
 */
export function requireOwnerOrAdmin(profileUserId: number) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    if (req.user.role === "admin" || req.user.id === profileUserId) {
      return next();
    }
    return res.status(403).json({ error: "Solo puedes editar tu propia ficha" });
  };
}
