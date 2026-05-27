const fs = require("fs");
const { execSync } = require("child_process");

try {
	const commit = execSync("git rev-parse --short HEAD").toString().trim();
	fs.writeFileSync("src/commit.json", JSON.stringify({ commit }));
} catch (e) {
	fs.writeFileSync("src/commit.json", JSON.stringify({ commit: "unknown" }));
}
