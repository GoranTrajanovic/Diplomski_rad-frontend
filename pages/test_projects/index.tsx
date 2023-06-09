import { fetcher } from "../api/fetcher/fetcher";

export default function TestProjects() {
	return (
		<div style={{ display: "flex", width: "100vw" }}>
			<img
				src="./news_-_chromium_-_desktop.png"
				alt="image"
				style={{ width: "33%" }}
			/>
			;
			<img
				src="./news_-_firefox_-_desktop.png"
				alt="image"
				style={{ width: "33%" }}
			/>
			;
			<img
				src="./news_-_webkit_-_desktop.png"
				alt="image"
				style={{ width: "33%" }}
			/>
			;
		</div>
	);
}

export async function getStaticProps() {
	const projectsRepsonse = await fetcher(
		`${process.env.NEXT_PUBLIC_STRAPI_URL}/projects`
	);
	console.log(projectsRepsonse);
	return {
		props: {
			projects: projectsRepsonse,
		},
	};
}
