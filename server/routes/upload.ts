/**
 * Efizientia SaaS · server/routes/upload.ts
 * POST /api/upload/avatar — sube foto de avatar (máx 2MB, solo imágenes)
 * Requiere autenticación. Devuelve { url: "/uploads/avatars/filename.jpg" }
 */

import { Router } from "express";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "server/uploads/avatars");
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${nanoid(10)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpg, png, webp…)"));
    }
  },
});

router.post("/avatar", requireAuth, (req, res) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message ?? "Error al subir imagen" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }
    const url = `/uploads/avatars/${req.file.filename}`;
    return res.json({ url });
  });
});

export default router;
