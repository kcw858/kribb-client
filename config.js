var path = require("path");

var root = path.join(__dirname);

var config = {
	rootDir: root,
	// Targets ========================================================
	serveDir: path.join(root, ".serve"),
	distDir: path.join(root, "dist"),
	clientManifestFile: "manifest.webpack.json",
	clientStatsFile: "stats.webpack.json",

	// Source Directory ===============================================
	srcDir: path.join(root, "app"),
	srcServerDir: path.join(root, "server"),

	// HTML Layout ====================================================
	srcHtmlLayout: path.join(root, "app", "index.html"),

	// Site Config ====================================================
	siteTitle: "Odor Monitoring",
	siteDescription: "Default Dashboard ready for Development",
	siteCannonicalUrl: "http://localhost:4100",
	siteKeywords: "react dashboard seed bootstrap",
	scssIncludes: [],

	apiHost: process.env.NODE_ENV === "development" ? "http://175.208.89.113:8800" : "http://175.208.89.113:8800",

	wsHost: process.env.NODE_ENV === "development" ? "ws://175.208.89.113:7000" : "ws://175.208.89.113:7000",
};

module.exports = config;
