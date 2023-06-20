import { useRef, useState, useEffect } from "react";
import LoadingSpinner from "../AnimatedIcons/LoadingSpinner/LoadingSpinner";
import SuccessIcon from "../AnimatedIcons/SuccessIcon/SuccessIcon";
import ErrorIcon from "../AnimatedIcons/ErrorIcon/ErrorIcon";
import styles from "./ListOfURLs.module.css";
import { io, Socket } from "socket.io-client";

import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { useWebPagesFromDB } from "@/stores/useWebPagesFromDB/useWebPagesFromDB";

type ListOfURLsProps = {
	fullURLs: string[];
};

type URLprocessingProgressPropsObj = {
	url: string;
	currentStep: -1 | 0 | 1 | 2 | 3 | 4 | 5 | number;
};

type URLsStatusProps = ("unselected" | "processing" | "succeeded" | "error")[];

type ServerToClientEvents = {
	progress: (data: { error: string; url: string; currentStep: number }) => void;
	no_root: (data: string) => void;
	error_in_processing: (data: { url: string; error: Boolean }) => void;
};

// let socket = io();
let socket: Socket<ServerToClientEvents>;

export default function ListOfURLs({ fullURLs }: ListOfURLsProps) {
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
	const updateWebPagesURLsFromDB = useWebPagesFromDB(
		s => s.updateWebPagesURLsFromDB
	);
	const ref = useRef<HTMLInputElement[]>([]);

	// console.log("Rendered...");
	// console.log(URLprocessingProgress);

	useEffect(() => {
		socket = io();
		return () => {
			console.log("Closing socket...");
			socket.close();
		};
	}, []);

	async function socketInitializer() {
		/* function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		// console.log("value", Object.values(event.target));
		// console.log("value", Object.values(event));
		const parentHTML = event.target.outerHTML;
		const value = parentHTML.slice(
			parentHTML.indexOf("https"),
			parentHTML.length - 2
		);
		if (selectedURLs.includes(value)) {
			setSelectedURLs(s => s.filter(item => item !== value));
		} else {
			setSelectedURLs(s => [...s, value]);
		}
	} */
		/* setURLprocessingProgress(prevState => {
			return [...prevState, { url: data.url, currentStep: data.currentStep }];
		}); */
	}

	if (socket) {
		socket.on("progress", data => {
			// console.log("from UI in LoURLs", data);
			// console.log("from UI in LoURLs", URLprocessingProgress);
			setURLprocessingProgress(prevState => {
				return prevState.map(obj => {
					return obj.url === data.url
						? { url: obj.url, currentStep: ++obj.currentStep }
						: { url: obj.url, currentStep: obj.currentStep };
				});
			});

			if (data.currentStep === 5) {
				/* const targetIndex: number = (_data: any) => {
					for (let i = 0; i < fullURLs.length; i++) {
						const url = fullURLs[i];
						if (url === data.url) return i;
						else return -1;
					}
				}; */
				let rootURL = data.url.slice(
					data.url.indexOf("//") + 2,
					data.url.lastIndexOf("/")
				);

				updateWebPagesURLsFromDB(rootURL, data.url);

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
		});

		socket.on("error_in_processing", data => {
			console.log("Error received on UI socket: " + JSON.stringify(data));
			setURLsStatus(prevState => {
				for (let i = 0; i < fullURLs.length; i++) {
					const url = fullURLs[i];
					if (url === data.url) prevState[i] = "error";
				}
				return [...prevState];
			});
		});
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

	// function handleChangeAll() {
	// 	if (allURLsSelected) {
	// 		setAllURLsSelected(false);
	// 		for (let i = 0; i < ref.current.length; i++) {
	// 			ref.current[i].checked = false;
	// 		}
	// 		setSelectedURLs([]);
	// 	} else {
	// 		setAllURLsSelected(true);
	// 		for (let i = 0; i < ref.current.length; i++) {
	// 			ref.current[i].checked = true;
	// 			setSelectedURLs(ref.current.map(item => item.value));
	// 		}
	// 	}
	// }

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

		const res = await fetch("/api/post_screenshots", {
			method: "POST",
			body: JSON.stringify({ urlArray: selectedURLs }),
			headers: { "content-type": "application/json" },
		});

		if (!res.ok) {
			const error = await res.text();
			// throw new Error(error);
			console.log("ERROR", error);
		} else {
			const data = await res.json();
		}
	}

	const progressLabelClassName = (index: number) => {
		return URLprocessingProgress[index].currentStep === 5
			? "progressCounterCompleted"
			: URLprocessingProgress[index].currentStep >= 0
			? "progressCounterInProgress"
			: "progressCounterHidden";
	};

	const handleToggle = (num: number) => {
		console.log(num);
	};

	console.log("selectedURLs", selectedURLs);

	const URLlist = (
		<>
			<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
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

			{/* <div className={styles.wrapper}>
				<label>
					<input
						type="checkbox"
						name="link"
						value={item}
						onChange={handleChange}
						ref={element => {
							ref.current[index] = element!;
						}}
					/>
					{item}
				</label>
				<label className={styles[progressLabelClassName(index)]}>
					{URLprocessingProgress[index].currentStep}/5
				</label>

				{URLsStatus[index] === "processing" ? <LoadingSpinner /> : null}
				{URLsStatus[index] === "succeeded" ? <SuccessIcon /> : null}
				{URLsStatus[index] === "error" ? <ErrorIcon /> : null}
			</div> */}
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
