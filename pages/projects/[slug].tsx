import { fetcher } from "../../misc/fetcher";
import type {
	webSitesResponseProps,
	websiteDataProps,
	webPagesResponseProps,
} from "../../misc/types";
import WebpageSelectionButtons from "../../components/Buttons/SelectionButtons/WebpageSelectionButtons/WebpageSelectionButtons";
import styles from "./projectIndividual.module.sass";
import Image from "next/image";
import { useEffect, useState } from "react";
import DeviceSelectionButtons from "@/components/Buttons/SelectionButtons/DeviceSelectionButtons/DeviceSelectionButtons";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import UpdateAuthorsModal from "@/components/Modals/UpdateAuthorsModal/UpdateAuthorsModal";
import { IconButton } from "@mui/material";
import ReactImageMagnify from "react-image-magnify";

type webPagesImagesURIsProps = {
	id: number;
	order: number;
	width: number;
	height: number;
	uri: string;
}[];

const IMAGES_ORDER_BY_BROWSER = ["chromium", "webkit", "firefox"];

export default function WebSite({
	webSiteData,
	webPagesImagesURIs,
}: {
	webSiteData: websiteDataProps;
	webPagesImagesURIs: webPagesImagesURIsProps;
}) {
	const [selectedURL, setSelectedURL] = useState("/root");
	const [selectedDevice, setSelectedDevice] = useState("desktop");
	const {
		Root_URL,
		Web_Vitals_Score,
		webpages,
		Screenshots,
		slug,
		website_authors,
	} = webSiteData.attributes;
	let allRootImagesURIs: webPagesImagesURIsProps = Screenshots.data.map(
		(screenshot, index) => {
			const order = screenshot.attributes.url.includes(
				IMAGES_ORDER_BY_BROWSER[0]
			)
				? 0
				: screenshot.attributes.url.includes(IMAGES_ORDER_BY_BROWSER[1])
				? 1
				: 2;
			return {
				id: screenshot.id,
				order,
				uri: screenshot.attributes.url,
				width: screenshot.attributes.width,
				height: screenshot.attributes.height,
			};
		}
	);

	allRootImagesURIs = allRootImagesURIs.sort((a, b) => a.order - b.order);

	const [URIsOfImagesToShow, setURIsOfImagesToShow] =
		useState(allRootImagesURIs);

	const webPagesURLs = webpages.data.map(webpage => webpage.attributes.URL);
	const webPagesURLsWithoutRoot: string[] = [
		"/root",
		...webPagesURLs.map((url): string => url.slice(url.indexOf("/"))),
	];

	webPagesImagesURIs = [...allRootImagesURIs, ...webPagesImagesURIs];

	useEffect(() => {
		setURIsOfImagesToShow(
			webPagesImagesURIs.filter(
				({ uri }) => uri.includes(selectedURL) && uri.includes(selectedDevice)
			)
		);
	}, [selectedURL, selectedDevice]);

	function handleSelectPreviousURL() {
		if (window.scrollY >= 250) window.scrollTo({ top: 0, behavior: "smooth" });
		setSelectedURL(prevState => {
			return webPagesURLsWithoutRoot[
				webPagesURLsWithoutRoot.indexOf(prevState) - 1
			];
		});
	}

	function handleSelectNextURL() {
		if (window.scrollY >= 250) window.scrollTo({ top: 0, behavior: "smooth" });
		setSelectedURL(prevState => {
			return webPagesURLsWithoutRoot[
				webPagesURLsWithoutRoot.indexOf(prevState) + 1
			];
		});
	}

	let websiteAuthors = "";
	for (let i = 0; i < website_authors.data.length - 1; i++) {
		const obj = website_authors.data[i];
		websiteAuthors += `${obj.attributes.Name} ${obj.attributes.Surname}, `;
	}
	websiteAuthors += `${
		website_authors.data[website_authors.data.length - 1].attributes.Name
	} ${
		website_authors.data[website_authors.data.length - 1].attributes.Surname
	}`;
	const websiteAuthorsFormated = website_authors.data.map(author => {
		return `${author.attributes.Name} ${author.attributes.Surname} (${author.id})`;
	});

	return (
		<div className={styles.wrapper}>
			<div className={styles.top_wrapper}>
				<h1>{Root_URL}</h1>
				<p className={styles.authors}>
					{websiteAuthors}{" "}
					<UpdateAuthorsModal websiteAuthors={websiteAuthorsFormated} />
				</p>
				<DeviceSelectionButtons
					selectedDevice={selectedDevice}
					handleDeviceSelectionParent={setSelectedDevice}
				/>
				<WebpageSelectionButtons
					webPagesURLs={webPagesURLsWithoutRoot}
					selectedURL={selectedURL}
					handleURLSelectionParent={setSelectedURL}
				/>
			</div>
			{selectedURL !== "/root" && (
				<IconButton
					className={styles.arrow_left_container}
					id="arrow-left"
					aria-label="arrow-left"
					onClick={() => handleSelectPreviousURL()}
				>
					<ArrowLeftIcon />
					<span>
						{
							webPagesURLsWithoutRoot[
								webPagesURLsWithoutRoot.indexOf(selectedURL) - 1
							]
						}
					</span>
				</IconButton>
			)}

			<div
				className={`${styles.images_wrapper} ${
					selectedDevice === "mobile" ? styles.mobile : ""
				}`}
			>
				{URIsOfImagesToShow.map(({ id, uri, width, height }) => {
					const imgObj = uri.includes("chromium")
						? { alt: "chromium logo", src: "/chromium_logo.png" }
						: uri.includes("webkit")
						? { alt: "webkit logo", src: "/webkit_logo.png" }
						: { alt: "firefox logo", src: "/firefox_logo.png" };
					return (
						<div className={styles.image_container} key={id}>
							<Image alt={imgObj.alt} src={imgObj.src} width="60" height="60" />
							<ReactImageMagnify
								smallImage={{
									alt: "yo",
									isFluidWidth: true,
									src: process.env.NEXT_PUBLIC_STRAPI_ROOT + uri,
								}}
								largeImage={{
									src: process.env.NEXT_PUBLIC_STRAPI_ROOT + uri,
									width,
									height,
								}}
								enlargedImagePosition="over"
								isHintEnabled={true}
								style={{ cursor: "zoom-in" }}
							/>
						</div>
					);
				})}
			</div>
			{selectedURL !==
				webPagesURLsWithoutRoot[webPagesURLsWithoutRoot.length - 1] && (
				<IconButton
					className={styles.arrow_right_container}
					id="arrow-right"
					aria-label="arrow-right"
					onClick={() => handleSelectNextURL()}
				>
					<span>
						{
							webPagesURLsWithoutRoot[
								webPagesURLsWithoutRoot.indexOf(selectedURL) + 1
							]
						}
					</span>
					<ArrowRightIcon />
				</IconButton>
			)}
		</div>
	);
}

export async function getStaticPaths() {
	const websites: webSitesResponseProps = await fetcher(
		`${process.env.NEXT_PUBLIC_STRAPI_URL}/websites?populate=*`
	);

	const paths = websites.data.map(website => {
		return { params: { slug: website.attributes.slug } };
	});

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
	// fetching websiteToDisplay (root) and all connected webpages, separately
	const websites: webSitesResponseProps = await fetcher(
		`${process.env.NEXT_PUBLIC_STRAPI_URL}/websites?populate=*`
	);

	const websiteToDisplay = websites.data.filter(
		website => website.attributes.slug === params.slug
	)[0];

	const webPages = websiteToDisplay.attributes.webpages.data.map(
		async webpage => {
			return await fetcher(
				`${process.env.NEXT_PUBLIC_STRAPI_URL}/webpages/${webpage.id}?populate=*`
			);
		}
	);
	const webPagesResponse: webPagesResponseProps = await Promise.all(webPages);

	let webPagesImagesURIs: webPagesImagesURIsProps = [];

	/* PART 1 beginning: sometimes there are no screenshots stored (unknown bug) for a webpage */
	/* this code doesn't display such webpages */
	let webPagesWithoutScreenshots = webPagesResponse.filter(
		obj => !obj.data.attributes.Screenshots.data
	);
	let webPagesWithoutScreenshotsIDs: number[] = webPagesWithoutScreenshots.map(
		obj => obj.data.id
	);

	websiteToDisplay.attributes.webpages.data =
		websiteToDisplay.attributes.webpages.data.filter(
			obj => !webPagesWithoutScreenshotsIDs.includes(obj.id)
		);
	/* PART 1 end */

	webPagesResponse.map(obj => {
		if (!obj.data.attributes.Screenshots.data) return; // sometimes there are no screenshots stored (unknown bug)
		obj.data.attributes.Screenshots.data.map(
			(img: {
				id: number;
				attributes: { url: string; width: number; height: number };
			}) => {
				const order = img.attributes.url.includes(IMAGES_ORDER_BY_BROWSER[0])
					? 0
					: img.attributes.url.includes(IMAGES_ORDER_BY_BROWSER[1])
					? 1
					: 2;
				webPagesImagesURIs.push({
					id: img.id,
					order,
					width: img.attributes.width,
					height: img.attributes.height,
					uri: img.attributes.url,
				});
			}
		);
	});

	webPagesImagesURIs = webPagesImagesURIs.sort((a, b) => a.order - b.order);

	return {
		props: {
			webSiteData: websiteToDisplay,
			webPagesImagesURIs,
		},
	};
}
