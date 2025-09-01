export type SeoProps = {
	title?: string;
	description?: string;
	image?: string;
	canonical?: string;
	author?: string;
	url?: string;
	type?: string;
	siteName?: string;
	themeColor?: string;
	icons?: {
		rel?: string;
		href?: string;
		sizes?: string;
		type?: string;
	}[];
	twitter?: {
		card?: string;
		site?: string;
		author?: string;
		title?: string;
		description?: string;
		image?: string;
		url?: string;
	};
	og?: {
		title?: string;
		description?: string;
		images?: {
			url?: string;
			secureUrl?: string;
			type?: string;
			width?: number;
			height?: number;
			alt?: string;
		}[];
		url?: string;
		type?: string;
		siteName?: string;
	};
};
