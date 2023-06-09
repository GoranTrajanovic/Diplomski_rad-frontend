import { useRef, useState, useEffect } from "react";
import LoadingSpinner from "../AnimatedIcons/LoadingSpinner/LoadingSpinner";
import SuccessIcon from "../AnimatedIcons/SuccessIcon/SuccessIcon";
import ErrorIcon from "../AnimatedIcons/ErrorIcon/ErrorIcon";
import styles from "./ListOfURLs.module.css";
import io from "socket.io-client";

let socket;

type ListOfURLsProps = {
	fullURLs: string[];
};

type URLprocessingProgressPropsObj = {
	url: string;
	currentStep: -1 | 0 | 1 | 2 | 3 | 4 | 5 | number;
};

type URLsStatusProps = ("unselected" | "processing" | "succeeded" | "error")[];

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
	const ref = useRef<HTMLInputElement[]>([]);

	// console.log("Rendered...");
	// console.log(URLprocessingProgress);

	useEffect(() => {
		socketInitializer();
	}, []);

	async function socketInitializer() {
		const res = await fetch("/api/connect_socket");

		socket = io();

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
			/* setURLprocessingProgress(prevState => {
				return [...prevState, { url: data.url, currentStep: data.currentStep }];
			}); */
		});

		socket.on("no_root", data => {
			console.log("Ok, no root.");
		});
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (selectedURLs.includes(event.target.value)) {
			setSelectedURLs(s => s.filter(item => item !== event.target.value));
		} else {
			setSelectedURLs(s => [...s, event.target.value]);
		}
	}

	function handleChangeAll() {
		if (allURLsSelected) {
			setAllURLsSelected(false);
			for (let i = 0; i < ref.current.length; i++) {
				ref.current[i].checked = false;
			}
			setSelectedURLs([]);
		} else {
			setAllURLsSelected(true);
			for (let i = 0; i < ref.current.length; i++) {
				ref.current[i].checked = true;
				setSelectedURLs(ref.current.map(item => item.value));
			}
		}
	}

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

	return (
		<div>
			<label>
				<input type="checkbox" name="selectAll" onChange={handleChangeAll} />
				Select all
			</label>
			{fullURLs.map((item, index) => (
				<div className={styles.wrapper}>
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
				</div>
			))}
			<button onClick={e => handleProcessButton(e)}>Process</button>
		</div>
	);
}
