const fs = require("fs");
const path = require("path");

const target = process.argv[2];
const manifestTarget = ["chrome", "edge", "brave", "opera"].includes(target) ? "chrome" : target;
if (!["chrome", "firefox", "edge", "brave", "opera"].includes(target)) {
  console.error("Usage: node build.js <chrome|firefox|edge|brave|opera>");
  process.exit(1);
}

const root = __dirname;
const out = path.join(root, "dist", target);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copy(source, destination = source) {
  const from = path.join(root, source);
  const to = path.join(out, destination);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
}

copy("src");
copy("rules");
copy("popup");
copy("options");
copy("assets");
copy(`manifest.${manifestTarget}.json`, "manifest.json");
console.log(`Built ${target} extension in ${path.relative(root, out)}`);
