import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface URLfetchState {
	siteURL: string;
	fetchedLinks: string[];
	setSiteURL: (URL: string) => void;
	setFetchedLinks: (links: string[]) => void;
}

export const useURLfetch = create<URLfetchState>()(
	devtools(set => ({
		siteURL: "",
		fetchedLinks: [],
		setSiteURL: URL => set(_s => ({ siteURL: URL })),
		setFetchedLinks: links =>
			set(_s => ({
				fetchedLinks: links,
			})),
	}))
);
