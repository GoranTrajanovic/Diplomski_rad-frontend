import fs from "fs";
import { chromium, devices } from "playwright";

export default async function takeScreenshotsForAllURLs(arrayOfURLs) {
	console.log("received arrayofurls:");
	console.log(arrayOfURLs);
	/* const browser = await chromium.launch();
	const contextPW = await browser.newContext();
	// const context = await browser.newContext(devices["iPhone 11"]);
	const page = await contextPW.newPage();

	try {
		await page.goto(link);
		const links = await page.locator("a");
		const linksCount = await links.count();
		const texts = await page.getByRole("link").allTextContents();

		for (let i = 0; i < linksCount; i++) {
			hrefs.push(await links.nth(i).getAttribute("href"));
		}

		console.log("Links from index.tsx:");
		fullURLs = makeURLsFromHrefs(link, hrefs);
		// takeScreenshotsForAllURLs(fullURLs);
	} catch (err) {
		console.log(err);
	} */
}
