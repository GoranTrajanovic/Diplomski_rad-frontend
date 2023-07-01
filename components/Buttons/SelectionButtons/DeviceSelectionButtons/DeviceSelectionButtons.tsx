import { useState } from "react";
import styles from "../SelectionButtons.module.sass";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";

export default function DeviceSelectionButtons({
	selectedDevice,
	handleDeviceSelectionParent,
}: {
	selectedDevice: string;
	handleDeviceSelectionParent: (url: string) => void;
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

	function handleSelection(device: string) {
		if (device !== selectedDevice) {
			handleDeviceSelectionParent(device);
		}
	}

	return (
		<div className={styles.wrapper}>
			<button
				className={`${styles.button} ${
					selectedDevice === "desktop" ? styles.selected : ""
				}`}
				onClick={() => handleSelection("desktop")}
			>
				<DesktopWindowsOutlinedIcon />
				Desktop
			</button>
			<button
				className={`${styles.button} ${
					selectedDevice === "mobile" ? styles.selected : ""
				}`}
				onClick={() => handleSelection("mobile")}
			>
				<SmartphoneOutlinedIcon />
				Mobile
			</button>
		</div>
	);
}
