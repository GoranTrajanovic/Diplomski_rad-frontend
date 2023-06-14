import Navigation from "@/modules/Navigation/Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navigation />
			{children}
		</>
	);
}
