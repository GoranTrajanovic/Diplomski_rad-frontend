import { usePathname } from "next/navigation";
import styles from "./Navigation.module.sass";
import Button from "@mui/material/Button";

export default function Navigation() {
	const pathname = usePathname();
	return (
		<nav className={styles.nav}>
			<Button
				className={`${styles.link_button} ${
					pathname === "/" ? styles.active : ""
				}`}
				href="/"
			>
				Process URLs
			</Button>
			<Button
				className={`${styles.link_button} ${
					pathname === "/projects" ? styles.active : ""
				}`}
				href="./projects"
			>
				Projects
			</Button>
			<Button
				className={`${styles.link_button} ${
					pathname === "/test.com" ? styles.active : ""
				}`}
			>
				test.com
			</Button>
		</nav>
	);
}
