// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";
import { makeURLsFromHrefs } from "@/helper_functions/makeURLsFromHrefs";

type Data = {
	fullURLs?: string[];
	errorMsg?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const link: string = req.body.link || "";

	console.log("Link is, ", link);

	const hrefs = [];
	let fullURLs: string[] = [];
	// console.log("from post_ss", urlArray);
	try {
		const browser = await chromium.launch();
		const contextPW = await browser.newContext();
		// const context = await browser.newContext(devices["iPhone 11"]);
		const page = await contextPW.newPage();

		try {
			await page.goto(link);
			const links = await page.locator("a");
			const linksCount = await links.count();
			const texts = await page.getByRole("link").allTextContents();

			console.log(linksCount);

			for (let i = 0; i < linksCount; i++) {
				hrefs.push(await links.nth(i).getAttribute("href"));
			}

			// console.log("Links from index.tsx:");
			fullURLs = makeURLsFromHrefs(link, hrefs);
			console.log("fullURLs", fullURLs);
			// takeScreenshotsForAllURLs(fullURLs);
		} catch (err) {
			console.log(err);
		}

		// Teardown
		await contextPW.close();
		await browser.close();
		res.status(200).json({ fullURLs });
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res
			.status(404)
			.json({ errorMsg: "Error occured in Nextjs API (check_webpage_urls)." });
	}
}
