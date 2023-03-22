// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium, devices } from "playwright";

type Data = {
	msg: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const URLSforProcessing: string[] = req.body.selectedURLs;
	console.log(URLSforProcessing);

	const browser = await chromium.launch();
	const contextPW = await browser.newContext();
	// const context = await browser.newContext(devices["iPhone 11"]);
	const page = await contextPW.newPage();

	try {
		await page.goto(URLSforProcessing[0]);
		await page.screenshot({ path: "newimg.png", fullPage: true });

		res.status(200).json({ msg: `Done with ${URLSforProcessing.length}` });
		/*
		const links = await page.locator("a");
		const linksCount = await links.count();
		const texts = await page.getByRole("link").allTextContents();

		for (let i = 0; i < linksCount; i++) {
			hrefs.push(await links.nth(i).getAttribute("href"));
		}

		console.log("Links from index.tsx:");
		fullURLs = makeURLsFromHrefs(link, hrefs);
	} */
		// takeScreenshotsForAllURLs(fullURLs);
	} catch (err) {
		console.log(err);
	}
}
