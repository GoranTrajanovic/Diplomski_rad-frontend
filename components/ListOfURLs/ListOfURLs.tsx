import { useRef, useState } from "react";
import { chromium, devices } from "playwright";
import takeScreenshotsForAllURLs from "@/helper_functions/takeScreenshotsForAllURLs";
import LoadingSpinner from "../AnimatedIcons/LoadingSpinner/LoadingSpinner";
import SuccessIcon from "../AnimatedIcons/SuccessIcon/SuccessIcon";
import ErrorIcon from "../AnimatedIcons/ErrorIcon/ErrorIcon";
import styles from "./ListOfURLs.module.css";

type ListOfURLsProps = {
	fullURLs: string[];
};

type URLsStatusProps = ("unselected" | "processing" | "succeeded" | "error")[];

export default function ListOfURLs({ fullURLs }: ListOfURLsProps) {
	const [selectedURLs, setSelectedURLs] = useState<string[]>([]);
	const [allURLsSelected, setAllURLsSelected] = useState<boolean>(false);
	const [URLsStatus, setURLsStatus] = useState<URLsStatusProps>(
		fullURLs.map(url => "unselected")
	);
	const ref = useRef<HTMLInputElement[]>([]);

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

		selectedURLs.forEach(async url => {
			const res = await fetch("/api/post_screenshots", {
				method: "POST",
				body: JSON.stringify({ url }),
				headers: { "content-type": "application/json" },
			});

			if (!res.ok) {
				setURLsStatus(state =>
					fullURLs.map((urlTwo, index) => {
						return url === urlTwo ? "error" : state[index];
					})
				);
				// const error = await res.text();
				// throw new Error(error);
			}

			const data = await res.json();

			setURLsStatus(state =>
				fullURLs.map((url, index) => {
					return url === data.url ? "succeeded" : state[index];
				})
			);
		});
	}

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
								// ref.current[index] = ref.current[index] === null ? element : null;
							}}
						/>
						{item}
					</label>
					{URLsStatus[index] === "processing" ? <LoadingSpinner /> : null}
					{URLsStatus[index] === "succeeded" ? <SuccessIcon /> : null}
					{URLsStatus[index] === "error" ? <ErrorIcon /> : null}
					{/* <ErrorIcon /> */}
				</div>
			))}
			<button onClick={e => handleProcessButton(e)}>Process</button>
		</div>
	);
}
