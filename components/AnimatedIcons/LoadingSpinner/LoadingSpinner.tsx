import styles from "./spinner.module.css";

export default function LoadingSpinner() {
	return (
		<>
			<div className={styles["lds-ring"]}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</>
	);
}
