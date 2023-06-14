import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StyledEngineProvider } from "@mui/material/styles";
import Layout from "./layout";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<StyledEngineProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</StyledEngineProvider>
	);
}
