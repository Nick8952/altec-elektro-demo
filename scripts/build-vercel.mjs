// Vercel-Build mit garantiertem Aufräumen: Server-Routen kopieren, dynamicParams=true, next build, danach Arbeitsbaum zurücksetzen
// (auch bei Fehlern, mit dem Exit-Code des Builds). Auf Vercel selbst ist das Zurücksetzen harmlos: .next ist dann schon gebaut.
import { spawnSync } from "node:child_process";
const lauf = (args) => spawnSync(process.execPath, args, { stdio: "inherit", env: { ...process.env, DEPLOY_TARGET: "vercel" } }).status ?? 1;
let code = lauf(["scripts/vercel-routen.mjs"]);
if (code === 0) code = spawnSync("npx", ["next", "build"], { stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, DEPLOY_TARGET: "vercel" } }).status ?? 1;
const aufraeumen = lauf(["scripts/vercel-routen.mjs", "--entfernen"]);
process.exit(code !== 0 ? code : aufraeumen);
