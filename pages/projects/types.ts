export type WebSitesFetchedProps = {
	webSitesFetched: websiteDataProps[];
};

export type webSitesResponseProps = {
	data: websiteDataProps[];
	meta: Object;
};

export type webPagesResponseProps = {
	data: {
		attributes: {
			Screenshots: Screenshots;
		};
	};
}[];

export type webPagesProps = {
	data: {
		id: number;
		attributes: { URL: string };
	}[];
};

export type Screenshots = {
	data: {
		id: number;
		attributes: { url: string; width: number; height: number };
	}[];
};

export type websiteDataProps = {
	id: number;
	attributes: {
		Frontpage_Screenshot: {
			data: {
				id: number;
				attributes: {
					url: string;
				};
			};
		};
		Root_URL: string;
		Web_Vitals_Score: number;
		created_at: string;
		updated_at: string;
		webpages: webPagesProps;
		Screenshots: Screenshots;
		slug: string;
	};
};
