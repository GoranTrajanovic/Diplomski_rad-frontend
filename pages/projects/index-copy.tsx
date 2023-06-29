import { fetcher } from "../api/fetcher/fetcher";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import styles from "./projects.module.sass";
import styles2 from "../../styles/Home.module.css";

import IconButton from "@mui/material/IconButton";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreURLsActionButton from "../../components/Buttons/MoreURLsActionButton/MoreURLsActionButton";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

type WebSitesFetchedProps = {
	webSitesFetched: websiteDataProps[];
};

type webSitesResponseProps = {
	data: websiteDataProps[];
	meta: Object;
};

type websiteDataProps = {
	id: number;
	attributes: {
		Frontpage_Screenshot: {
			data: {
				attributes: {
					url: string;
				};
			};
		};
		Root_URL: string;
		Web_Vitals_Score: number;
		created_at: string;
		updated_at: string;
		webpages: webPagesProps;
		Screenshots: Screenshots;
	};
};

type webPagesProps = {
	data: {
		id: number;
		attributes: { URL: string };
	}[];
};

type webPagesPopulatedProps = {
	data: {
		attributes: { Screenshots: Screenshots };
	};
};

type Screenshots = { data: { id: number }[] };

export default function WebSites({ webSitesFetched }: WebSitesFetchedProps) {
	const [numOfStoredURLs, setNumOfStoredURLs] = useState<
		{
			rootWebsiteURL: string;
			numOfWebpages: number;
		}[]
	>([{ rootWebsiteURL: "initialized", numOfWebpages: 0 }]);

	useEffect(() => {
		setNumOfStoredURLs(prepareWebsitesArrayForNumOfURLs(webSitesFetched));
	}, []);

	const handleDelete = async (
		id: number,
		webpages: webPagesProps,
		Screenshots: Screenshots
	) => {
		// fetch IDs for images
		// fetch IDs for webpages
		// fetch IDs for website
		const webPagesIDs = webpages.data.map(({ id }) => id);
		let allImagesIDs: (number | void)[] = [];
		let webSiteImagesIDs: number[] = [];
		let webPagesImagesIDs: void | number[] = [];

		Screenshots.data.map(({ id }) => webSiteImagesIDs.push(id));

		fetchAllWebPagesImagesIDs(webPagesIDs)
			.then(res => {
				console.log(res);
			})
			.then(data => {
				console.log(data);
			});

		// allImagesIDs = [...webSiteImagesIDs, ...webPagesImagesIDs];
	};

	return (
		<div className={`${styles.main} ${styles2.main}`}>
			{webSitesFetched.map(webSite => {
				const {
					Root_URL,
					Frontpage_Screenshot,
					Web_Vitals_Score,
					webpages,
					Screenshots,
				} = webSite.attributes;

				const finalNumberOfStoredURLs = numOfStoredURLs.filter(obj => {
					return Object.values(obj)[Object.keys(obj).indexOf(Root_URL)] !== -1;
				})[0].numOfWebpages;

				return (
					<Card
						sx={{ maxWidth: 345 }}
						className={styles.webSiteCard}
						// onClick={handleClick}
					>
						<CardActionArea>
							<CardMedia
								component="img"
								height="140"
								image={
									process.env.NEXT_PUBLIC_STRAPI_ROOT +
									Frontpage_Screenshot.data.attributes.url
								}
								alt={Root_URL}
							/>
							<CardContent>
								<h3>{Root_URL}</h3>
								<p>
									<b>WVS: </b>
									{Web_Vitals_Score}
								</p>
								<p>
									<b>Processed webpages: </b>
									{finalNumberOfStoredURLs}
								</p>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<div style={{ margin: "0 .6em .6em" }}>
								<MoreURLsActionButton
									rootURL={Root_URL}
									websiteID={webSite.id}
									setNumOfStoredURLs={setNumOfStoredURLs}
								/>

								<div
									onClick={() =>
										handleDelete(webSite.id, webpages, Screenshots)
									}
									style={{ display: "inline" }}
								>
									<IconButton aria-label="delete">
										<DeleteForeverIcon className={styles.delete_button} />
									</IconButton>
								</div>
							</div>
						</CardActions>
					</Card>
				);
			})}
		</div>
	);
}

export async function getStaticProps() {
	let webSitesResponse: webSitesResponseProps;
	let webSitesFetched: websiteDataProps[] = [];

	try {
		webSitesResponse = await fetcher(
			`${process.env.NEXT_PUBLIC_STRAPI_URL}/websites?populate=*`
		);
		webSitesFetched = [...webSitesResponse.data];
		// console.log(webSites[0].attributes.webpages);
	} catch (err) {
		console.log(err);
	}

	return {
		props: {
			webSitesFetched,
		},
	};
}

function prepareWebsitesArrayForNumOfURLs(websitesArray: websiteDataProps[]) {
	return websitesArray.map(website => {
		return {
			rootWebsiteURL: website.attributes.Root_URL,
			numOfWebpages: website.attributes.webpages.data.length,
		};
	});
}

async function fetchAllWebPagesImagesIDs(webPagesIDs: number[]) {
	let webPageResponse: webPagesPopulatedProps;
	let imagesIDsBuffer: number[] = [];

	try {
		/* webPagesIDs.map(async id => {
			webPageResponse = await fetcher(
				`${process.env.NEXT_PUBLIC_STRAPI_URL}/webpages/${id}?populate=*`
			);
			imagesIDsBuffer = [
				...imagesIDsBuffer,
				...webPageResponse.data.attributes.Screenshots.data.map(({ id }) => id),
			];
		}); */

		Promise.all([
			webPagesIDs.map(async id => {
				return fetcher(
					`${process.env.NEXT_PUBLIC_STRAPI_URL}/webpages/${id}?populate=*`
				);
			}),
		]).then(res => {
			res[0].map(pro => {
				pro.then(data => {
					imagesIDsBuffer = [
						...imagesIDsBuffer,
						...data.data.attributes.Screenshots.data.map(
							({ id }: { id: number }) => id
						),
					];
				});
			});
			return imagesIDsBuffer;
			// res.then(res => {
			// 	res.map(data => {
			// 		console.log(data.attributes.Screenshots.data);
			// 	});
			// });
		});
	} catch (err) {
		console.log(err);
	}
}
