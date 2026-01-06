export interface Background {
	name: string;
	url: string;
}

export interface Icon {
	name: string;
	class: string;
}

export interface ImageGroup {
	groupName: string;
	images_url: { name: string; url: string }[];
}

export interface Brand {
	id: string;
	name: string;
	primaryColor: string;
	secondaryColor: string;
	tertiaryColor: string;
	textColor: string;
	textColor2: string;
	titleFont: string;
	textFont: string;
	tertiaryFont: string;
	logoUrl: string;
	backgrounds: Background[];
	icons: Icon[];
	imageGroups: ImageGroup[];
}
