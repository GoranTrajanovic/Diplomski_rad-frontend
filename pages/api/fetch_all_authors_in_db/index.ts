// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetcher } from "../fetcher/fetcher";
import { isJsxAttributes } from "typescript";
import { resolveMx } from "dns";

type Data = {
	authorsArray: string[];
	errorMsg?: string;
};

type ResData = {
	data: {
		id: number;
		attributes: {
			Name: string;
			Surname: string;
		};
	}[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	try {
		const authorsArray: string[] = [];
		const apiResponse: ResData = await fetcher(
			`${process.env.NEXT_PUBLIC_STRAPI_URL}/website-authors?populate=*`
		);

		apiResponse.data.map(obj => {
			authorsArray.push(
				`${obj.attributes.Name} ${obj.attributes.Surname} (${obj.id})`
			);
		});

		res.status(200).json({ authorsArray });
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res.status(404).json({
			authorsArray: [],
			errorMsg: "Error occured in Nextjs API (fetch_all_authors_in_db).",
		});
	}
}
