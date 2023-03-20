/* import { chromium, devices } from "playwright";

export async function getLinks(siteURL: string) {
	//Setup
	const browser = await chromium.launch();
	const context = await browser.newContext();
	// const context = await browser.newContext(devices["iPhone 11"]);
	const page = await context.newPage();

	await page.goto(siteURL);

	const links = await page.locator("a");
	const linksCount = await links.count();
	// console.dir(links);

	const hrefs = [];
	for (let i = 0; i < linksCount; i++) {
		hrefs.push(await links.nth(i).getAttribute("href"));
	}

	console.log("Links from getLinks.ts:");
	console.log(hrefs);

	// Teardown
	await context.close();
	await browser.close();

	return links;
}
 */
