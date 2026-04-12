/**
 * Efizientia SaaS · server/db/index.ts
 * Abre la conexión SQLite (WASM, sin módulo nativo) y ejecuta el schema.
 * Exporta el singleton `db` para usar en los routes.
 *
 * COMPAT SHIM: node-sqlite3-wasm requiere parámetros como array ([a, b, c]),
 * no como spread (a, b, c). El wrapper `patchDb` convierte automáticamente
 * las llamadas spread → array para que el código de routes sea portable.
 */

import wasmSqlite from "node-sqlite3-wasm";
// node-sqlite3-wasm doesn't ship proper TS types; Database lives on the default export object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Database = (wasmSqlite as any).Database as new (path: string) => any;
import path from "path";
import { initSchema } from "./schema.js";
import { config } from "../config.js";

// Wraps every Statement returned by .prepare() so that spread args are
// automatically converted to the array form that node-sqlite3-wasm expects.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patchDb(rawDb: any): any {
  const origPrepare = rawDb.prepare.bind(rawDb);
  rawDb.prepare = (sql: string) => {
    const stmt = origPrepare(sql);
    const origRun = stmt.run.bind(stmt);
    const origGet = stmt.get.bind(stmt);
    const origAll = stmt.all.bind(stmt);
    // Convert spread args → array (node-sqlite3-wasm expects array for multi-params)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stmt.run = (...args: any[]) => origRun(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stmt.get = (...args: any[]) => origGet(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stmt.all = (...args: any[]) => origAll(args);
    return stmt;
  };
  return rawDb;
}

// Resuelve la ruta de la DB desde el directorio de trabajo del proceso,
// para que funcione igual en dev (raíz del proyecto) y en producción (dist/).
const DB_PATH = path.isAbsolute(config.DB_PATH)
  ? config.DB_PATH
  : path.resolve(process.cwd(), config.DB_PATH);

import { mkdirSync, rmSync, existsSync } from "fs";

// Asegurar que el directorio de datos existe
mkdirSync(path.dirname(DB_PATH), { recursive: true });

// ── Stale lock cleanup ────────────────────────────────────────────────────────
// node-sqlite3-wasm usa un VFS propio que protege la DB creando un directorio
// "<db>.lock". El problema en Railway: el contenedor anterior muere por SIGKILL
// (sin graceful shutdown) → el directorio .lock queda en el volumen para siempre
// → todos los deployments siguientes fallan con "database is locked" aunque no
// haya ningún proceso activo. Como solo hay UNA instancia, si el directorio
// existe al arrancar siempre es un lock huérfano: lo eliminamos.
const lockPath = `${DB_PATH}.lock`;
if (existsSync(lockPath)) {
  try {
    rmSync(lockPath, { recursive: true, force: true });
    console.log("[DB] Stale lock removed:", lockPath);
  } catch (e) {
    console.warn("[DB] Could not remove stale lock:", e);
  }
}

const _rawDb = new Database(DB_PATH);
export const db = patchDb(_rawDb);

// busy_timeout primero: 30 s de espera si hay contención real (rolling deploy breve)
db.exec("PRAGMA busy_timeout = 30000;");
db.exec("PRAGMA foreign_keys = ON;");

// WAL mode: necesita lock exclusivo para cambiar el modo → no-fatal si falla.
// Una vez que el contenedor anterior muere, el siguiente ciclo ya tendrá WAL.
try {
  db.exec("PRAGMA journal_mode = WAL;");
} catch (e) {
  console.warn("[DB] WAL mode not set (rolling deploy overlap?):", (e as Error).message);
}

// Crear tablas si no existen
initSchema(db);

console.log(`[DB] SQLite conectado en: ${DB_PATH}`);
