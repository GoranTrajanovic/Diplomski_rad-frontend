import { useState, useEffect } from "react";
import SuccessIcon from "../AnimatedIcons/SuccessIcon/SuccessIcon";
import ErrorIcon from "../AnimatedIcons/ErrorIcon/ErrorIcon";
import styles from "./ListOfURLs.module.css";
import io from "socket.io-client";

import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

let socket;

type ListOfURLsProps = {
	fullURLs: string[];
	authors: string[];
	handleModalOpen: () => void;
};

type URLprocessingProgressPropsObj = {
	url: string;
	currentStep: -1 | 0 | 1 | 2 | 3 | 4 | 5 | number;
};

type URLsStatusProps = ("unselected" | "processing" | "succeeded" | "error")[];

export default function ListOfURLs({
	fullURLs,
	authors,
	handleModalOpen,
}: ListOfURLsProps) {
	const [selectedURLs, setSelectedURLs] = useState<string[]>([]);
	const [allURLsSelected, setAllURLsSelected] = useState<boolean>(false);
	const [URLprocessingProgress, setURLprocessingProgress] = useState<
		URLprocessingProgressPropsObj[]
	>(
		fullURLs.map(url => {
			const obj: URLprocessingProgressPropsObj = {
				url,
				currentStep: -1,
			};
			return obj;
		})
	);
	const [URLsStatus, setURLsStatus] = useState<URLsStatusProps>(
		fullURLs.map(() => "unselected")
	);

	useEffect(() => {
		socketInitializer();
	}, []);

	async function socketInitializer() {
		const res = await fetch("/api/connect_socket");

		if (!res.ok) {
			const error = await res.text();
			console.log("ERROR - connecting sockets", error);
		} else {
			socket = io();

			socket.on("progress", data => {
				setURLprocessingProgress(prevState => {
					return prevState.map(obj => {
						return obj.url === data.url
							? { url: obj.url, currentStep: ++obj.currentStep }
							: { url: obj.url, currentStep: obj.currentStep };
					});
				});

				if (data.currentStep === 5) {
					setURLsStatus(prevState => {
						for (let i = 0; i < fullURLs.length; i++) {
							const url = fullURLs[i];
							if (url === data.url) prevState[i] = "succeeded";
						}
						return [...prevState];
					});
				}
			});

			socket.on("no_root", data => {
				console.log("Ok, no root.");
				handleModalOpen();
			});

			socket.on("error_in_processing", data => {
				console.log("Error received on UI socket: " + JSON.stringify(data));
				setURLsStatus(prevState => {
					const tempArray: URLsStatusProps = [];
					for (let i = 0; i < fullURLs.length; i++) {
						const url = fullURLs[i];
						if (url === data.url) tempArray.push("error");
						else tempArray.push(prevState[i]);
					}
					return [...tempArray];
				});
			});
		}
	}

	const handleChange = (url: string) => () => {
		if (selectedURLs.includes(url)) {
			setSelectedURLs(s => s.filter(item => item !== url));
			setAllURLsSelected(false);
		} else {
			setSelectedURLs(s => [...s, url]);
		}
	};

	const handleChangeAll = () => () => {
		if (allURLsSelected) {
			setAllURLsSelected(false);

			setSelectedURLs([]);
		} else {
			setAllURLsSelected(true);
			setSelectedURLs([...fullURLs]);
		}
	};

	async function handleProcessButton(e: React.MouseEvent<HTMLButtonElement>) {
		setURLsStatus(
			fullURLs.map(url =>
				selectedURLs.includes(url) ? "processing" : "unselected"
			)
		);

		setURLprocessingProgress(
			fullURLs.map(url => {
				const obj: URLprocessingProgressPropsObj = {
					url,
					currentStep: selectedURLs.includes(url) ? 0 : -1,
				};
				return obj;
			})
		);

		const authorsIDs: (string | undefined)[] = authors.map(author => {
			const res = author.match(/\(([0-9]+)\)/);
			if (res) return res[1];
		});

		const res = await fetch("/api/post_screenshots", {
			method: "POST",
			body: JSON.stringify({ urlArray: selectedURLs, authorsIDs }),
			headers: { "content-type": "application/json" },
		});

		if (!res.ok) {
			const error = await res.text();
			console.log("ERROR - posting screenshots", error);
		} else {
			const data = await res.json();
		}
	}

	const URLlist = (
		<>
			<List className={styles.list}>
				<ListItem
					key={0}
					secondaryAction={
						<IconButton edge="end" aria-label="comments"></IconButton>
					}
					onClick={handleChangeAll()}
					disablePadding
					className={styles.select_all_list_item}
				>
					<ListItemButton role={undefined} dense>
						<ListItemIcon>
							<Checkbox
								edge="start"
								checked={selectedURLs.length === 5}
								tabIndex={-1}
								disableRipple
								inputProps={{ "aria-labelledby": "select-all" }}
							/>
						</ListItemIcon>
						<ListItemText id={"select-all"} primary={"Select all"} />
					</ListItemButton>
				</ListItem>
				{fullURLs.map((url, index) => {
					const labelId = url;

					return (
						<ListItem
							key={index}
							secondaryAction={
								<IconButton edge="end" aria-label="comments"></IconButton>
							}
							onClick={handleChange(url)}
							disablePadding
							/* ref={element => {
								ref.current[index] = element!;
							}} */
						>
							<ListItemButton role={undefined} dense>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={selectedURLs.includes(url)}
										tabIndex={-1}
										disableRipple
										inputProps={{ "aria-labelledby": labelId }}
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={url} />
								<ListItemIcon className={styles.spinnerIcon}>
									{URLsStatus[index] === "processing" ? (
										URLprocessingProgress[index].currentStep === 0 ? (
											<CircularProgress
												className={styles.loading_spinner}
												size="2.1rem"
											/>
										) : (
											<div className={styles.progressContainer}>
												<CircularProgress
													className={styles.progress_spinner}
													size="2.1rem"
													variant="determinate"
													value={URLprocessingProgress[index].currentStep * 20}
												/>
												<span className={styles.progressText}>
													{URLprocessingProgress[index].currentStep * 20}%
												</span>
											</div>
										)
									) : null}
									{URLsStatus[index] === "succeeded" ? <SuccessIcon /> : null}
									{URLsStatus[index] === "error" ? <ErrorIcon /> : null}
								</ListItemIcon>
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</>
	);
	return (
		<div>
			{fullURLs.length ? URLlist : null}
			{fullURLs.length ? (
				<Button
					variant="contained"
					className={styles.button_emphasised}
					onClick={e => handleProcessButton(e)}
				>
					Process URLs
				</Button>
			) : null}
		</div>
	);
}
