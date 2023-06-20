import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type webSitesStateProps = {
	rootWebsiteURL: string;
	webPagesURLsFromDB: string[];
};

export interface WebPagesFromDBstate {
	webSites: webSitesStateProps[];
	setWebPagesURLsFromDB: (webSites: webSitesStateProps[]) => void;
	updateWebPagesURLsFromDB: (rootWebsiteURL: string, newURL: string) => void;
}

export const useWebPagesFromDB = create<WebPagesFromDBstate>()(
	devtools(set => ({
		webSites: [],
		setWebPagesURLsFromDB: webSites =>
			set(_s => ({
				webSites: webSites,
			})),
		// updateWebPagesURLsFromDB: (rootWebsiteURL, URLs) =>
		// 	set(_s => ({
		// 		webSites: [
		// 			..._s.webSites.map(v => {
		// 				if (v.rootWebsiteURL === rootWebsiteURL) {
		// 					return {
		// 						rootWebsiteURL: rootWebsiteURL,
		// 						webPagesURLsFromDB: URLs,
		// 					};
		// 				} else return v;
		// 			}),
		// 		],
		// 	})),
		updateWebPagesURLsFromDB: (rootWebsiteURL, newURL) =>
			set(_s => ({
				webSites: [
					..._s.webSites.map(v => {
						if (v.rootWebsiteURL === rootWebsiteURL) {
							return {
								rootWebsiteURL: rootWebsiteURL,
								webPagesURLsFromDB: [...v.webPagesURLsFromDB, newURL],
							};
						} else return v;
					}),
				],
			})),
	}))
);
