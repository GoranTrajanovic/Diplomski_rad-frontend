// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs, { mkdirSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium, firefox, webkit, devices } from "playwright";

type Data = {
	url?: string;
	errorMsg?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const URLForProcessing: string = req.body.url;
	const URLWithoutHttps = URLForProcessing.substring(
		URLForProcessing.indexOf("//") + 2
	);
	const rootURL = URLWithoutHttps.substring(0, URLWithoutHttps.indexOf("/"));
	let URLSubpath = URLWithoutHttps.substring(URLWithoutHttps.indexOf("/") + 1);
	URLSubpath = URLSubpath === "" ? "root" : URLSubpath;

	let timeAtStart = Date.now();
	let today = new Date();
	let date =
		today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	let time =
		today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
	let dateTimeFilename = date + "--" + time;

	let dir = `app/screenshots/${dateTimeFilename}--${rootURL}`;

	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

	try {
		let browser = await chromium.launch();
		let context = await browser.newContext();
		let page = await context.newPage();
		await page.goto(URLForProcessing);
		await page.screenshot({
			path: `${dir}/${URLSubpath}_-_chromium_-_desktop.png`,
			fullPage: true,
		});

		console.log("Processing screenshot: Chromium Desktop");

		browser = await firefox.launch();
		context = await browser.newContext();
		page = await context.newPage();
		await page.goto(URLForProcessing);
		await page.screenshot({
			path: `${dir}/${URLSubpath}_-_firefox_-_desktop.png`,
			fullPage: true,
		});

		console.log("Processing screenshot: Firefox Desktop");

		browser = await webkit.launch();
		context = await browser.newContext();
		page = await context.newPage();
		await page.goto(URLForProcessing);
		await page.screenshot({
			path: `${dir}/${URLSubpath}_-_webkit_-_desktop.png`,
			fullPage: true,
		});

		console.log("Processing screenshot: Webkit Desktop");

		// mobile

		browser = await chromium.launch();
		context = await browser.newContext(devices["iPhone 11"]);
		page = await context.newPage();
		await page.goto(URLForProcessing);
		await page.screenshot({
			path: `${dir}/${URLSubpath}_-_chromium_-_mobile.png`,
			fullPage: true,
		});

		console.log("Processing screenshot: Chromium Mobile");

		// firefox mobile not supported

		/* browser = await firefox.launch();
		context = await browser.newContext(devices["iPhone 11"]);
		page = await context.newPage();
		await page.goto(URLForProcessing);
		await page.screenshot({
			path: `${dir}/${URLSubpath}_-_firefox_-_mobile.png`,
			fullPage: true,
		});

		console.log("Processing screenshot: Firefox Mobile"); */

		browser = await webkit.launch();
		context = await browser.newContext(devices["iPhone 11"]);
		page = await context.newPage();
		await page.goto(URLForProcessing);
		await page.screenshot({
			path: `${dir}/${URLSubpath}_-_webkit_-_mobile.png`,
			fullPage: true,
		});

		console.log("Processing screenshot: Webkit Mobile");

		/* 
		setTimeout(() => {
			res.status(200).json({ url: req.body.url });
		}, Math.floor(Math.random() * 5000) + 1000);
		*/

		res.status(200).json({ url: req.body.url });
		console.log(
			`It took ${
				(Date.now() - timeAtStart) / 1000
			} seconds to complete ${URLWithoutHttps}`
		);
	} catch (err) {
		console.log(err);
		res.status(404).json({ errorMsg: "Error occured." });
	}
}
