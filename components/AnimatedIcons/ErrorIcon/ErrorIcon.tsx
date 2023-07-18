import styles from "./error.module.css";

export default function ErrorIcon() {
	return (
		<div className={styles["svg-box"]}>
			<svg className={styles.circular}>
				<circle
					className={styles.path}
					cx="75"
					cy="75"
					r="10"
					fill="none"
					strokeWidth="2"
					strokeMiterlimit="10"
				/>
			</svg>
			<svg className={styles.cross}>
				<g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)">
					<path
						className={styles["first-line"]}
						d="M634.087,300.805L673.361,261.53"
						fill="none"
					/>
				</g>
				<g transform="matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)">
					<path
						className={styles["second-line"]}
						d="M634.087,300.805L673.361,261.53"
					/>
				</g>
			</svg>
		</div>
	);
}
