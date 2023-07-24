import { useState } from "react";
import styles from "../selectionButtons.module.sass";

export default function WebpageSelectionButtons({
	webPagesURLs,
	selectedURL,
	handleURLSelectionParent,
}: {
	webPagesURLs: string[];
	selectedURL: string;
	handleURLSelectionParent: (url: string) => void;
}) {
	/* const chosenCategoryForFilter = useLibraryStore(
		s => s.chosenCategoryForFilter
	);
	const categories = useLibraryStore(s => s.allCategories);
	const setChosenCategoryForFilter = useLibraryStore(
		s => s.setChosenCategoryForFilter
	);

	const categorySelectionHandler = category => {
		setChosenCategoryForFilter(category);
	}; */

	function handleSelection(url: string) {
		if (url !== selectedURL) {
			handleURLSelectionParent(url);
		}
	}

	return (
		<div className={styles.wrapper}>
			{webPagesURLs.map(url => {
				return (
					<button
						className={`${styles.button}  ${styles.button_websites}  ${
							url === selectedURL ? styles.selected : ""
						}`}
						key={url}
						onClick={() => handleSelection(url)}
					>
						{url.slice(url.indexOf("/"))}
					</button>
				);
			})}
		</div>
	);
}
