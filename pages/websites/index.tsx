import { fetcher } from "../api/fetcher/fetcher";
import styles from "./websites.module.sass";

type WebSitesProps = {
	webSites: dataProps[];
};

type webSitesResponseProps = {
	data: dataProps[];
	meta: Object;
};

type dataProps = {
	id: number;
	attributes: webSitesObjProps;
};

type webPagesProps = {
	data: dataProps[];
};

type webSitesObjProps = {
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
};

export default function WebSites({ webSites }: WebSitesProps) {
	console.log(webSites);
	return (
		<div style={{ display: "flex", flexDirection: "row" }}>
			{webSites.map(webSite => {
				const { Root_URL, Frontpage_Screenshot, Web_Vitals_Score, webpages } =
					webSite.attributes;
				return (
					<div key={webSite.id} className={styles.webSiteCard}>
						<h2>{Root_URL}</h2>
						<img
							src={
								process.env.NEXT_PUBLIC_STRAPI_ROOT +
								Frontpage_Screenshot.data.attributes.url
							}
							alt={"Image for " + Root_URL}
						/>
						<br />
						Pages: {webpages.data.length}
						<br />
						WVS: {Web_Vitals_Score}
					</div>
				);
			})}
		</div>
	);
}

export async function getStaticProps() {
	let webSitesResponse: webSitesResponseProps;
	let webSites: dataProps[] = [];

	try {
		webSitesResponse = await fetcher(
			`${process.env.NEXT_PUBLIC_STRAPI_URL}/websites?populate=*`
		);
		console.log(webSitesResponse);
		webSites = [...webSitesResponse.data];
		console.log(webSites[0].attributes.webpages.data);
		// console.log(webSites[0].attributes.webpages);
	} catch (err) {
		console.log(err);
	}

	return {
		props: {
			webSites,
		},
	};
}
