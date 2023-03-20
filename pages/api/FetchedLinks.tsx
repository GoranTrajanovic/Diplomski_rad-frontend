export default function FetchedLinks() {
	return (
		<>
			<p>Fecthing links...</p>
		</>
	);
}

export async function getServerSideProps(context: { query: any }) {
	const link = context.query;
	console.log("This is link from FetchedLinks.tsx:");
	console.log(link);
}
