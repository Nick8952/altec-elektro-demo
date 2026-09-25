// Einzige Stelle, an der Betriebsart, Unterpfad und öffentliche URL festgelegt werden.
// Wird von next.config.ts (Build) und von der Anwendung (Laufzeit) gelesen.
//
// Standard ohne Env-Variablen = GitHub-Pages-Demo unter dem Repository-Unterpfad.
// Für Vercel: DEPLOY_TARGET=vercel (dann kein Unterpfad, SITE_URL = Vercel-/Kundendomain).
// Unbekannte Werte brechen den Build ab: kein stilles Raten.
export type DeployZiel = "pages" | "vercel";

export const REPO_NAME = "altec-elektro-demo";
const GITHUB_KONTO = "nick8952";

const roh = (process.env.DEPLOY_TARGET ?? "").trim();
if (roh && roh !== "pages" && roh !== "vercel") {
  throw new Error(`DEPLOY_TARGET=«${roh}» ist unbekannt. Erlaubt: leer/«pages» (statischer Export) oder «vercel».`);
}
export const deployZiel: DeployZiel = roh === "vercel" ? "vercel" : "pages";

// BASE_PATH nicht gesetzt → Repository-Unterpfad; ausdrücklich leer ("") → Export an einer Domain-Wurzel.
export const basePath: string =
  deployZiel === "vercel" ? "" : (process.env.BASE_PATH ?? `/${REPO_NAME}`).trim().replace(/\/$/, "");

if (basePath && !/^\/[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(basePath)) {
  throw new Error(`BASE_PATH=«${basePath}» muss mit «/» beginnen, ohne Schluss-Schrägstrich (oder leer sein).`);
}
const siteUrlEnv = process.env.SITE_URL?.trim().replace(/\/$/, "");
if (siteUrlEnv) {
  try {
    const u = new URL(siteUrlEnv);
    if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
  } catch {
    throw new Error(`SITE_URL=«${siteUrlEnv}» ist keine gültige http(s)-URL.`);
  }
}
export const siteUrl: string =
  siteUrlEnv && siteUrlEnv.length > 0
    ? siteUrlEnv
    : deployZiel === "vercel"
      ? `https://${REPO_NAME}.vercel.app`
      : `https://${GITHUB_KONTO}.github.io${basePath}`;
