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
	const url: string = req.body.url;
	try {
		const resExt = await fetch(
			`${process.env.BACKEND_SCREENSHOTS_PROCESSING_URL}`,
			{
				method: "POST",
				body: JSON.stringify({ url }),
				headers: { "content-type": "application/json" },
			}
		);

		if (!resExt.ok) {
			const error = await resExt.text();
			throw new Error(error);
		}

		const data = await resExt.json();
		console.log(
			`Data received in Nextjs API call for posting screenshots: ${JSON.stringify(
				data
			)}`
		);
		res.status(200).json({ msg: "Nextjs API - OK" });
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res.status(404).json({ errorMsg: "Error occured in Nextjs API." });
	}
}

/* async function uploadToBackend(dir: string, URLWithoutHttps: string) {
	const client = new ApolloClient({
		uri: `${process.env.NEXT_PUBLIC_STRAPI_ROOT}/graphql`,
		cache: new InMemoryCache(),
	});

	const { data } = await client.mutate({
		mutation: gql`
			mutation createWebsite {
				createWebsite(
					data: { Root_URL: "https://googleeeeeee.com", Web_Vitals_Score: "15" }
				) {
					data {
						attributes {
							Root_URL
						}
					}
				}
			}
		`,
	});

	console.log("from postSSs", data);

	return { props: { data } };
}
 */
