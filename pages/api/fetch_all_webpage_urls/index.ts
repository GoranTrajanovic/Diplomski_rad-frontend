// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";
import { makeURLsFromHrefs } from "@/misc/makeURLsFromHrefs";
import { fetcher } from "../../../misc/fetcher";
import { isJsxAttributes } from "typescript";

type Data = {
	fullURLs: string[];
	errorMsg?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const rootURL: string = req.body.rootURL || "";
	let fullURLs: string[] = new Array();
	let hrefs: string[] = new Array();
	// console.log("from post_ss", urlArray);
	try {
		const browser = await chromium.launch();
		const contextPW = await browser.newContext();
		// const context = await browser.newContext(devices["iPhone 11"]);
		const page = await contextPW.newPage();

		try {
			await page.goto(rootURL);
			const links = await page.locator("a");
			const linksCount = await links.count();

			for (let i = 0; i < linksCount; i++) {
				let link = await links.nth(i).getAttribute("href");
				if (link) hrefs.push(link);
			}

			// console.log("Links from index.tsx:");
			fullURLs = makeURLsFromHrefs(rootURL, hrefs);

			fullURLs = fullURLs.map(fullURL => {
				if (fullURL.lastIndexOf("/") + 1 === fullURL.length) {
					let tempURL = fullURL.slice(0, fullURL.lastIndexOf("/"));
					if (tempURL !== undefined) return tempURL;
					else return "undefined";
				} else return fullURL;
			});
			// takeScreenshotsForAllURLs(fullURLs);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				fullURLs: [],
				errorMsg: "Error occured in Nextjs API (fetch_all_webpage_urls).",
			});
		}

		// Teardown
		await contextPW.close();
		await browser.close();
		res.status(200).json({
			fullURLs,
		});
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			fullURLs: [],
			errorMsg: "Error occured in Nextjs API (fetch_all_webpage_urls).",
		});
	}
}
