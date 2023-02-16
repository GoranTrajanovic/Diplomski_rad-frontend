import { useState } from "react";
import Head from "next/head";
import Form from "../components/Form/Form";
import styles from "../styles/Home.module.css";

export default function Home() {
	const [currentInputValue, setCurrentInputValue] = useState("");

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCurrentInputValue(e.currentTarget.value);
		console.log(currentInputValue);
	}

	function handleSubmitButton(e: React.MouseEvent<HTMLButtonElement>) {
		console.log("Button clicked");
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
				<Form
					currentInputValue={currentInputValue}
					handleInputChange={handleInputChange}
					handleSubmitButton={handleSubmitButton}
				/>
			</main>
		</>
	);
}
