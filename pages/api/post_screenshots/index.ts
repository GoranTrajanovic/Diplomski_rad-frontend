// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	msg?: string;
	errorMsg?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const urlArray: string[] = req.body.urlArray;
	const authorsIDs: string[] = req.body.authorsIDs;
	// console.log("from post_ss", urlArray);
	try {
		const resExt = await fetch(
			`${process.env.BACKEND_SCREENSHOTS_PROCESSING_URL}`,
			{
				method: "POST",
				body: JSON.stringify({ urlArray, authorsIDs }),
				headers: { "content-type": "application/json" },
			}
		);

		if (!resExt.ok) {
			const error = await resExt.text();
			// throw new Error(error);
			console.log("Error occured with fetching... (post_screenshots/index.ts");
		}

		const data = await resExt.json();
		/* console.log(
			`Data received in Nextjs API call for posting screenshots: ${JSON.stringify(
				data
			)}`
		); */
		res.status(200).json({ msg: "Nextjs API - OK" });
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res.status(404).json({ errorMsg: "Error occured in Nextjs API." });
	}
}
