import { useRef, useState } from "react";
import LoadingSpinner from "../AnimatedIcons/LoadingSpinner/LoadingSpinner";
import SuccessIcon from "../AnimatedIcons/SuccessIcon/SuccessIcon";
import ErrorIcon from "../AnimatedIcons/ErrorIcon/ErrorIcon";
import styles from "./ListOfURLs.module.css";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";

type ListOfURLsProps = {
	fullURLs: string[];
};

type URLsStatusProps = ("unselected" | "processing" | "succeeded" | "error")[];

export default function ListOfURLs({ fullURLs }: ListOfURLsProps) {
	const [selectedURLs, setSelectedURLs] = useState<string[]>([]);
	const [allURLsSelected, setAllURLsSelected] = useState<boolean>(false);
	const [URLsStatus, setURLsStatus] = useState<URLsStatusProps>(
		fullURLs.map(() => "unselected")
	);
	const ref = useRef<HTMLInputElement[]>([]);

	console.log("Rendered...");

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

		selectedURLs.map(url => {
			if (isRootURL(url)) {
				const client = new ApolloClient({
					uri: `${process.env.NEXT_PUBLIC_STRAPI_ROOT}/graphql`,
					cache: new InMemoryCache(),
				});

				const ROOT_WEB_MUTATION = gql`
					mutation createWebsite($url: String!) {
						createWebsite(data: { Root_URL: $url, Web_Vitals_Score: "15" }) {
							data {
								attributes {
									Root_URL
								}
							}
						}
					}
				`;

				const [mutateFunction, { loading, error, data }] = useMutation(
					ROOT_WEB_MUTATION,
					{
						variables: {
							url,
						},
					}
				);

				try {
					console.log("from LOURLs", data);
				} catch (e) {
					console.log("error from LOURLs", e);
				}
			}
		});

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
				const error = await res.text();
				throw new Error(error);
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
							}}
						/>
						{item}
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

function isRootURL(url: string) {
	const cleanURL = url.slice(url.indexOf("//") + 2);
	if (
		cleanURL.indexOf("/") === -1 ||
		cleanURL.slice(cleanURL.indexOf("/") + 1) === ""
	)
		return true;
	else return false;
}

async function uploadRootWebPageToBackend(url: string) {
	const client = new ApolloClient({
		uri: `${process.env.NEXT_PUBLIC_STRAPI_ROOT}/graphql`,
		cache: new InMemoryCache(),
	});

	const ROOT_WEB_MUTATION = gql`
		mutation createWebsite($url: String!) {
			createWebsite(data: { Root_URL: $url, Web_Vitals_Score: "15" }) {
				data {
					attributes {
						Root_URL
					}
				}
			}
		}
	`;

	const [mutateFunction, { loading, error, data }] = useMutation(
		ROOT_WEB_MUTATION,
		{
			variables: {
				url,
			},
		}
	);

	try {
		// const { data } = await client.mutate({
		// 	mutation: gql`
		// 		mutation createWebsite($url: String!) {
		// 			createWebsite(data: { Root_URL: $url, Web_Vitals_Score: "15" }) {
		// 				data {
		// 					attributes {
		// 						Root_URL
		// 					}
		// 				}
		// 			}
		// 		}
		// 	`,
		// });

		console.log("from LOURLs", data);
	} catch (e) {
		console.log("error from LOURLs", e);
	}
}
