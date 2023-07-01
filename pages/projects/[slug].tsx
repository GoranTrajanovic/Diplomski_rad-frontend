import { fetcher } from "../api/fetcher/fetcher";
import type {
	webSitesResponseProps,
	websiteDataProps,
	webPagesResponseProps,
} from "./types";
import WebpageSelectionButtons from "../../components/Buttons/SelectionButtons/WebpageSelectionButtons/WebpageSelectionButtons";
import styles from "./project.module.sass";
import Image from "next/image";
import { useEffect, useState } from "react";
import DeviceSelectionButtons from "@/components/Buttons/SelectionButtons/DeviceSelectionButtons/DeviceSelectionButtons";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { IconButton } from "@mui/material";
import ReactImageMagnify from "react-image-magnify";

type webPagesImagesURIsProps = {
	width: number;
	height: number;
	uri: string;
}[];

export default function WebSite({
	webSiteData,
	webPagesImagesURIs,
}: {
	webSiteData: websiteDataProps;
	webPagesImagesURIs: webPagesImagesURIsProps;
}) {
	const [selectedURL, setSelectedURL] = useState("/root");
	const [selectedDevice, setSelectedDevice] = useState("desktop");
	const { Root_URL, Web_Vitals_Score, webpages, Screenshots, slug } =
		webSiteData.attributes;
	const allRootImagesURIs: webPagesImagesURIsProps = Screenshots.data.map(
		screenshot => {
			return {
				uri: screenshot.attributes.url,
				width: screenshot.attributes.width,
				height: screenshot.attributes.height,
			};
		}
	);
	const [URIsOfImagesToShow, setURIsOfImagesToShow] =
		useState(allRootImagesURIs);

	const webPagesURLs = webpages.data.map(webpage => webpage.attributes.URL);
	const webPagesURLsWithoutRoot: string[] = [
		"/root",
		...webPagesURLs.map((url): string => url.slice(url.indexOf("/"))),
	];

	webPagesImagesURIs = [...allRootImagesURIs, ...webPagesImagesURIs];

	useEffect(() => {
		const arrowLeftElement = document.getElementById("arrow-left");
		const arrowRightElement = document.getElementById("arrow-right");

		if (window.innerHeight <= 1100) {
			if (arrowLeftElement) arrowLeftElement.style.opacity = "1";
			if (arrowRightElement) arrowRightElement.style.opacity = "1";
		}

		function scrollListener() {
			let y = window.scrollY;
			if (y <= 600) {
				if (arrowLeftElement) arrowLeftElement.style.opacity = "1";
				if (arrowRightElement) arrowRightElement.style.opacity = "1";
			} else {
				if (arrowLeftElement) arrowLeftElement.style.opacity = "0";
				if (arrowRightElement) arrowRightElement.style.opacity = "0";
			}
		}

		window.addEventListener("scroll", scrollListener);
		return () => {
			window.removeEventListener("scroll", scrollListener);
		};
	}, []);

	useEffect(() => {
		const arrowLeftElement = document.getElementById("arrow-left");
		const arrowRightElement = document.getElementById("arrow-right");

		if (window.innerHeight <= 1100) {
			if (arrowLeftElement) arrowLeftElement.style.opacity = "1";
			if (arrowRightElement) arrowRightElement.style.opacity = "1";
		}
		setURIsOfImagesToShow(
			webPagesImagesURIs.filter(
				({ uri, width, height }) =>
					uri.includes(selectedURL) && uri.includes(selectedDevice)
			)
		);
	}, [selectedURL, selectedDevice]);

	function handleSelectPreviousURL() {
		if (window.scrollY >= 700) window.scrollTo({ top: 0, behavior: "smooth" });
		setSelectedURL(prevState => {
			return webPagesURLsWithoutRoot[
				webPagesURLsWithoutRoot.indexOf(prevState) - 1
			];
		});
	}

	function handleSelectNextURL() {
		if (window.scrollY >= 700) window.scrollTo({ top: 0, behavior: "smooth" });
		setSelectedURL(prevState => {
			return webPagesURLsWithoutRoot[
				webPagesURLsWithoutRoot.indexOf(prevState) + 1
			];
		});
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.top_wrapper}>
				<h1>{Root_URL}</h1>
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
				{URIsOfImagesToShow.map(({ uri, width, height }) => {
					return (
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
						/>
					);
					// return <img src={process.env.NEXT_PUBLIC_STRAPI_ROOT + uri} alt="" />;
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

	console.log(webPagesResponse[0].data.attributes.Screenshots.data);

	const webPagesImagesURIs: webPagesImagesURIsProps = [];

	webPagesResponse.map(obj => {
		obj.data.attributes.Screenshots.data.map(
			(img: { attributes: { url: string; width: number; height: number } }) =>
				webPagesImagesURIs.push({
					width: img.attributes.width,
					height: img.attributes.height,
					uri: img.attributes.url,
				})
		);
	});

	return {
		props: {
			webSiteData: websiteToDisplay,
			webPagesImagesURIs,
		},
	};
}
