import { useState, useEffect } from "react";
import Head from "next/head";
import Form from "../components/Form/Form";
import styles from "../styles/Home.module.css";
import { chromium, devices } from "playwright";
import { useRouter } from "next/router";
import FetchedLinks from "./api/FetchedLinks";
import { makeURLsFromHrefs } from "@/helper_functions/makeURLsFromHrefs";
import ListOfURLs from "../components/ListOfURLs/ListOfURLs";
import BrowseAllButton from "../components/BrowseAllButton/BrowseAllButton";
import io from "socket.io-client";

let socket;

type HomeProps = {
	fullURLs: string[];
};

export default function Home({ fullURLs }: HomeProps) {
	const [currentInputValue, setCurrentInputValue] = useState("");
	const [buttonClicked, setButtonClicked] = useState(false);
	const router = useRouter();

	useEffect(() => {
		socketInitializer();
		console.log("UseEffect fired");
	}, []);

	async function socketInitializer() {
		await fetch("/api/connect_socket");

		socket = io();

		socket.on("newIncomingMessage", msg => {
			console.log(msg);
		});
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCurrentInputValue(e.currentTarget.value);
		console.log(currentInputValue);
	}

	function handleSubmitButton(e: React.MouseEvent<HTMLButtonElement>) {
		console.log("Button clicked");
		setButtonClicked(() => true);
		router.push(`/?link=${currentInputValue}`);
		// router.push(`/?link=${currentInputValue}`, undefined, { shallow: true });
		/* (async () => {
			const browser = await chromium.launch();
			const context = await browser.newContext();
			// const context = await browser.newContext(devices["iPhone 11"]);
			const page = await context.newPage();

			await page.goto(currentInputValue);

			const links = await page.locator("a");
			console.log("Links from getLinks.ts:");
			console.dir(links);

			// Teardown
			await context.close();
			await browser.close();
		})(); */

		// console.dir(getLinks(currentInputValue));
	}

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<div>
					<Form
						currentInputValue={currentInputValue}
						handleInputChange={handleInputChange}
						handleSubmitButton={handleSubmitButton}
					/>
				</div>

				<ListOfURLs fullURLs={fullURLs} />
				{/* {buttonClicked && <FetchedLinks />} */}
				<BrowseAllButton />
			</main>
		</>
	);
}

export async function getServerSideProps(context: { query: { link: string } }) {
	const link = context.query.link || "";
	const hrefs = [];
	let fullURLs: string[] = [];

	// console.log("This is link from getServerSideProps");
	// console.log(link);

	const browser = await chromium.launch();
	const contextPW = await browser.newContext();
	// const context = await browser.newContext(devices["iPhone 11"]);
	const page = await contextPW.newPage();

	try {
		await page.goto(link);
		const links = await page.locator("a");
		const linksCount = await links.count();
		const texts = await page.getByRole("link").allTextContents();

		for (let i = 0; i < linksCount; i++) {
			hrefs.push(await links.nth(i).getAttribute("href"));
		}

		console.log("Links from index.tsx:");
		fullURLs = makeURLsFromHrefs(link, hrefs);
		// takeScreenshotsForAllURLs(fullURLs);
	} catch (err) {
		console.log(err);
	}

	// Teardown
	await contextPW.close();
	await browser.close();

	return { props: { fullURLs } };
}
