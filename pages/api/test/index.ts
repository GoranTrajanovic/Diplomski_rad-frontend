import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

type Data = {
	msg: string;
};

/* 

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.status(200).json({ msg: `Done with ${req.body.i}` });
}
 */

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const client = new ApolloClient({
		uri: `${process.env.NEXT_PUBLIC_STRAPI_ROOT}/graphql`,
		cache: new InMemoryCache(),
	});

	try {
		const { data } = await client.mutate({
			mutation: gql`
				mutation createWebsite {
					createWebsite(
						data: { Root_URL: "https://googleee.com", Web_Vitals_Score: "15" }
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
		// console.log("from postSSs", data);
	} catch (e) {
		console.log("error", e);
	}

	res.status(200).json({ msg: "Done" });
}
