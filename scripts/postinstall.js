import { execSync } from "node:child_process";

try {
  execSync("npm install", { stdio: "ignore" });
  console.log("[postinstall] Dependencies synchronized");
} catch {
  console.warn("[postinstall] npm install failed, continuing...");
}
