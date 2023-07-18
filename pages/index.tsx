import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import ListOfURLs from "../components/ListOfURLs/ListOfURLs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SuccessIcon from "@/components/AnimatedIcons/SuccessIcon/SuccessIcon";
import ErrorIcon from "@/components/AnimatedIcons/ErrorIcon/ErrorIcon";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";
import IconButton from "@mui/material/IconButton";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

type Data = {
	fullURLs: string[];
	errorMsg?: string;
};

export default function Home() {
	const [currentInputValue, setCurrentInputValue] = useState("");
	const [rootURLsubmissionStatus, setRootURLsubmissionStatus] =
		useState("unsubmitted");
	const [fullURLs, setFullURLs] = useState<string[]>([]);
	const [modalOpen, setModalOpen] = useState(false);

	const router = useRouter();

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCurrentInputValue(e.currentTarget.value);
		setRootURLsubmissionStatus("unsubmitted");
	}

	async function handleSubmitButton(e: React.MouseEvent<HTMLButtonElement>) {
		router.push(`/?link=${currentInputValue}`);
		setRootURLsubmissionStatus("loading");

		const res = await fetch("/api/fetch_all_webpage_urls", {
			method: "POST",
			body: JSON.stringify({ rootURL: currentInputValue }),
			headers: { "content-type": "application/json" },
		});

		if (!res.ok) {
			const error = await res.text();
			setRootURLsubmissionStatus("error");
		} else {
			const data: Data = await res.json();
			setRootURLsubmissionStatus("complete");
			setFullURLs([...data.fullURLs]);
		}
	}

	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);

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
						autoComplete="on"
						name="URL"
						value={currentInputValue}
						onChange={handleInputChange}
					></TextField>
					<Button
						variant="outlined"
						type="submit"
						onClick={handleSubmitButton}
						className={styles[`submit-button-${rootURLsubmissionStatus}`]}
					>
						{rootURLsubmissionStatus === "loading" ? (
							<CircularProgress
								className={styles.loading_spinner}
								size="1.8rem"
							/>
						) : rootURLsubmissionStatus === "complete" ? (
							<SuccessIcon />
						) : rootURLsubmissionStatus === "error" ? (
							<ErrorIcon />
						) : (
							"Submit"
						)}
					</Button>

					<IconButton
						aria-label="delete"
						className={
							styles[
								rootURLsubmissionStatus === "error" ? "repeat-button" : "hidden"
							]
						}
						onClick={handleSubmitButton}
					>
						<ReplayIcon />
					</IconButton>
				</div>
				<div className={styles.processing_status}>
					<span>
						{rootURLsubmissionStatus === "loading"
							? "Processing: "
							: rootURLsubmissionStatus === "complete"
							? "Processed: "
							: rootURLsubmissionStatus === "error"
							? "Error in processing: "
							: null}
					</span>
					<span className={styles.bold}>
						{rootURLsubmissionStatus === "unsubmitted"
							? null
							: currentInputValue}
					</span>
				</div>

				<ListOfURLs fullURLs={fullURLs} handleModalOpen={handleModalOpen} />

				<Modal
					open={modalOpen}
					onClose={handleModalClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box className={styles.modal_box}>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
							className={styles.modal_title}
						>
							No Root Selected
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							Please select root URL for <b>{currentInputValue}</b> as there is
							not one in database already. <br />
							<br />
							<u>All webpages are connected to the root webpage.</u>
						</Typography>
						<Button variant="text" onClick={handleModalClose}>
							Ok
						</Button>
					</Box>
				</Modal>
			</main>
		</>
	);
}
