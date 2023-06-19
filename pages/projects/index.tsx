import { fetcher } from "../api/fetcher/fetcher";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions, Divider } from "@mui/material";
import styles from "./projects.module.sass";
import styles2 from "../../styles/Home.module.css";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import FindInPageIcon from "@mui/icons-material/FindInPage";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import PreviewIcon from "@mui/icons-material/Preview";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreURLsActionButton from "../../components/Buttons/MoreURLsActionButton/MoreURLsActionButton";

type WebSitesProps = {
	webSites: websiteDataProps[];
};

type webSitesResponseProps = {
	data: websiteDataProps[];
	meta: Object;
};

type websiteDataProps = {
	id: number;
	attributes: webSitesObjProps;
};

type webpageDataProps = {
	id: number;
	attributes: { URL: string };
};

type webPagesProps = {
	data: webpageDataProps[];
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
	if (webSites.length === 1) {
		webSites = [...webSites, ...webSites, ...webSites];
	}

	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setOpen(previousOpen => !previousOpen);
	};

	const handleClickAway = () => {
		console.log("called!");
		setOpen(false);
	};

	const canBeOpen = open && Boolean(anchorEl);
	const id = canBeOpen ? "transition-popper" : undefined;

	return (
		<div className={`${styles.main} ${styles2.main}`}>
			{webSites.map(webSite => {
				const { Root_URL, Frontpage_Screenshot, Web_Vitals_Score, webpages } =
					webSite.attributes;
				/* const webPagesURLsStored: { id: number; attributes: { URL: string } } =
					webpages.data; */
				console.log("webpages.data", webpages.data);
				return (
					<Card
						sx={{ maxWidth: 345 }}
						className={styles.webSiteCard}
						onClick={handleClick}
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
									{webpages.data.length}
								</p>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<div style={{ margin: "0 .6em .6em" }}>
								<MoreURLsActionButton
									link={Root_URL}
									URLsInDBasObj={webpages.data}
								/>

								<IconButton aria-label="delete">
									<DeleteForeverIcon className={styles.delete_button} />
								</IconButton>
							</div>
						</CardActions>
					</Card>
				);
			})}
		</div>
	);
}

{
	/* <div key={webSite.id} className={styles.webSiteCard}>
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
					</div>  */
}

export async function getStaticProps() {
	let webSitesResponse: webSitesResponseProps;
	let webSites: websiteDataProps[] = [];

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
