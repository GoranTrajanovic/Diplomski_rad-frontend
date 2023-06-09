import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { chromium, devices } from "playwright";
import { useRouter } from "next/router";
import { makeURLsFromHrefs } from "@/helper_functions/makeURLsFromHrefs";
import ListOfURLs from "../components/ListOfURLs/ListOfURLs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type HomeProps = {
	fullURLs: string[];
};

export default function Home({ fullURLs }: HomeProps) {
	const [currentInputValue, setCurrentInputValue] = useState("");
	const [buttonClicked, setButtonClicked] = useState(false);
	const router = useRouter();

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCurrentInputValue(e.currentTarget.value);
		console.log(currentInputValue);
	}

	function handleSubmitButton(e: React.MouseEvent<HTMLButtonElement>) {
		console.log("Button clicked");
		setButtonClicked(() => true);
		router.push(`/?link=${currentInputValue}`);
	}

	console.log(fullURLs);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<div className={styles.link_form}>
					<TextField
						variant="outlined"
						label="Insert your link here..."
						className={styles.text_field}
					></TextField>
					<Button variant="outlined">Submit</Button>
				</div>

				<div>
					{/* <Form
						currentInputValue={currentInputValue}
						handleInputChange={handleInputChange}
						handleSubmitButton={handleSubmitButton}
					/> */}
				</div>

				<ListOfURLs fullURLs={fullURLs} />
				{/* {buttonClicked && <FetchedLinks />} */}
				{/* <BrowseAllButton /> */}
			</main>
		</>
	);
}

export async function getServerSideProps(context: { query: { link: string } }) {
	const link = context.query.link || "";
	const hrefs = [];
	let fullURLs: (string | undefined)[] = [];

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

		console.log(fullURLs);

		// console.log("Links from index.tsx:");
		fullURLs = makeURLsFromHrefs(link, hrefs);

		fullURLs = [
			...fullURLs.map(fullURL => {
				if (fullURL !== undefined) {
					if (fullURL.lastIndexOf("/") + 1 === fullURL.length)
						return fullURL.slice(0, fullURL.lastIndexOf("/"));
					else return fullURL;
				}
			}),
		];
		// takeScreenshotsForAllURLs(fullURLs);
	} catch (err) {
		console.log(err);
	}

	// Teardown
	await contextPW.close();
	await browser.close();

	return { props: { fullURLs } };
}
