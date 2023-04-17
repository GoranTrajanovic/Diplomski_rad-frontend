import { fetcher } from "../api/fetcher/fetcher";

export default function TestProjects() {
	return <p>Yo</p>;
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
