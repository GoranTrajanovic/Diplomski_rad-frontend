import Link from "next/link";
import styles from "./BrowseAllButton.module.sass";

export default function BrowseAllButton() {
	return (
		<Link href="/websites">
			<button className={styles.BrowseAllButton}>Browse All</button>
		</Link>
	);
}
