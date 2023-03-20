/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
		prependData: `@import "styles/globals.sass"`,
	},
	experimental: {
		appDir: true,
	},
};

module.exports = nextConfig;
