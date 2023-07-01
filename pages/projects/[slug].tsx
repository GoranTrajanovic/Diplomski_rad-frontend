import { fetcher } from "../api/fetcher/fetcher";
import type { webSitesResponseProps, websiteDataProps } from "./types";
import WebpageSelectionButtons from "../../components/Buttons/SelectionButtons/WebpageSelectionButtons/WebpageSelectionButtons";
import styles from "./project.module.sass";
import Image from "next/image";
import { useEffect, useState } from "react";
import DeviceSelectionButtons from "@/components/Buttons/SelectionButtons/DeviceSelectionButtons/DeviceSelectionButtons";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { IconButton } from "@mui/material";

export default function WebSite({
	webSiteData,
	webPagesImagesURIs,
}: {
	webSiteData: websiteDataProps;
	webPagesImagesURIs: string[];
}) {
	const [selectedURL, setSelectedURL] = useState("/root");
	const [selectedDevice, setSelectedDevice] = useState("desktop");
	const { Root_URL, Web_Vitals_Score, webpages, Screenshots, slug } =
		webSiteData.attributes;
	const allRootImagesURIs = Screenshots.data.map(
		screenshot => screenshot.attributes.url
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
				uri => uri.includes(selectedURL) && uri.includes(selectedDevice)
			)
		);
	}, [selectedURL, selectedDevice]);

	function handleSelectPreviousURL() {
		setSelectedURL(prevState => {
			return webPagesURLsWithoutRoot[
				webPagesURLsWithoutRoot.indexOf(prevState) - 1
			];
		});
	}

	function handleSelectNextURL() {
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
				{URIsOfImagesToShow.map(uri => {
					return <img src={process.env.NEXT_PUBLIC_STRAPI_ROOT + uri} alt="" />;
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
	const webPagesResponse = await Promise.all(webPages);

	const webPagesImagesURIs: string[] = [];

	webPagesResponse.map(obj => {
		obj.data.attributes.Screenshots.data.map(
			(img: { attributes: { url: any } }) =>
				webPagesImagesURIs.push(img.attributes.url)
		);
	});

	return {
		props: {
			webSiteData: websiteToDisplay,
			webPagesImagesURIs,
		},
	};
}
