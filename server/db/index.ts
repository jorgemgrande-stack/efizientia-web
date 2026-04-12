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

// Asegurar que el directorio existe (necesario en Railway y otros entornos)
import { mkdirSync } from "fs";
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const _rawDb = new Database(DB_PATH);
export const db = patchDb(_rawDb);

// WAL mode: lecturas concurrentes mientras se escribe
db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");

// Crear tablas si no existen
initSchema(db);

console.log(`[DB] SQLite conectado en: ${DB_PATH}`);
