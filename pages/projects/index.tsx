import Link from "next/link";
import { useEffect, useState } from "react";
import { fetcher } from "../api/fetcher/fetcher";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import styles from "./projects.module.sass";
import styles2 from "../../styles/Home.module.css";

import MoreURLsActionButton from "../../components/Buttons/MoreURLsActionButton/MoreURLsActionButton";
import ModalCheckDeletion from "../../components/ModalCheckDeletion/ModalCheckDeletion";

import type {
	WebSitesFetchedProps,
	webSitesResponseProps,
	websiteDataProps,
} from "./types";

export default function WebSites({ webSitesFetched }: WebSitesFetchedProps) {
	const [numOfStoredURLs, setNumOfStoredURLs] = useState<
		{
			rootWebsiteURL: string;
			numOfWebpages: number;
		}[]
	>([{ rootWebsiteURL: "initialized", numOfWebpages: 0 }]);
	let finalNumberOfStoredURLs = 0;

	useEffect(() => {
		setNumOfStoredURLs(prepareWebsitesArrayForNumOfURLs(webSitesFetched));
	}, []);

	return (
		<div className={`${styles.main} ${styles2.main}`}>
			{webSitesFetched.map(webSite => {
				const {
					Root_URL,
					Frontpage_Screenshot,
					Web_Vitals_Score,
					webpages,
					Screenshots,
					slug,
				} = webSite.attributes;

				for (let i = 0; i < numOfStoredURLs.length; i++) {
					const obj = numOfStoredURLs[i];
					if (obj.rootWebsiteURL === Root_URL) {
						finalNumberOfStoredURLs = obj.numOfWebpages;
						break;
					}
				}
				return (
					<Card
						sx={{ maxWidth: 345 }}
						className={styles.webSiteCard}
						key={webSite.id}
					>
						<CardActionArea>
							<Link href={`/projects/${slug}`}>
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
							</Link>
						</CardActionArea>
						<CardActions>
							<div style={{ margin: "0 .6em .6em" }}>
								<MoreURLsActionButton
									rootURL={Root_URL}
									websiteID={webSite.id}
									setNumOfStoredURLs={setNumOfStoredURLs}
								/>

								<ModalCheckDeletion
									webSiteRootURL={Root_URL}
									webSiteID={webSite.id}
									webpages={webpages}
									frontPageScreenshot={Frontpage_Screenshot}
									screenshots={Screenshots}
								/>
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
	let tempArray = [];
	tempArray = websitesArray.map(website => {
		return {
			rootWebsiteURL: website.attributes.Root_URL,
			numOfWebpages: website.attributes.webpages.data.length,
		};
	});

	return tempArray;
}
