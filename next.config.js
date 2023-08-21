/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
	reactStrictMode: false,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
		prependData: `@import "styles/globals.sass"`,
	},
};

module.exports = nextConfig;
