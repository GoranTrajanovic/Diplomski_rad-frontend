// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";
import { makeURLsFromHrefs } from "@/helper_functions/makeURLsFromHrefs";
import { fetcher } from "../fetcher/fetcher";
import { isJsxAttributes } from "typescript";

type Data = {
	newWebpageURLs: string[];
	numOfStoredURLs: number;
	errorMsg?: string;
};

type webpageProp = {
	attributes: { URL: string };
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const rootURL: string = req.body.rootURL || "";
	const websiteID: number = req.body.websiteID;

	const hrefs = [];
	let allWebpageURLs: string[] = [];
	let newWebpageURLs: string[] = [];
	let numOfStoredURLs: number = 0;
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
			const texts = await page.getByRole("link").allTextContents();

			for (let i = 0; i < linksCount; i++) {
				hrefs.push(await links.nth(i).getAttribute("href"));
			}

			// console.log("Links from index.tsx:");
			allWebpageURLs = makeURLsFromHrefs(rootURL, hrefs);
			// takeScreenshotsForAllURLs(allWebpageURLs);

			const { data } = await fetcher(
				`${process.env.NEXT_PUBLIC_STRAPI_URL}/websites/${websiteID}?populate=*`
			);

			const storedWebpageURLs = data.attributes.webpages.data.map(
				(obj: webpageProp) => "https://" + obj.attributes.URL
			);
			numOfStoredURLs = storedWebpageURLs.length;
			storedWebpageURLs.push(rootURL);

			console.log("storedWebpageURLs", storedWebpageURLs);
			newWebpageURLs = allWebpageURLs.filter(
				url => !storedWebpageURLs.includes(url)
			);
		} catch (err) {
			console.log(err);
		}

		// Teardown
		await contextPW.close();
		await browser.close();
		res.status(200).json({
			newWebpageURLs,
			numOfStoredURLs,
		});
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res.status(404).json({
			newWebpageURLs: [],
			numOfStoredURLs: 0,
			errorMsg: "Error occured in Nextjs API (check_webpage_urls).",
		});
	}
}
