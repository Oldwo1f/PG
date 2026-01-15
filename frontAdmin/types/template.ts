export interface TemplateElement {
	id: string;
	type: "text" | "image" | "shape" | "icon";
	x: number;
	y: number;
	width: number;
	height: number;
	properties: Record<string, unknown>;
}

export interface TemplateLayout {
	width: number;
	height: number;
	elements: TemplateElement[];
}

export interface TemplateVariable {
	value: string;
	type: "text" | "textarea";
}

export interface Template {
	id: string;
	name: string;
	description?: string;
	category?: string;
	layout: TemplateLayout;
	tags: string[];
	isActive: boolean;
	html?: string;
	variables?: Record<string, string | TemplateVariable>;
	brandVariables?: Record<string, string>;
	previewImage?: string;
	userId?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export type UpdateTemplateInput = Partial<
	Pick<
		Template,
		| "name"
		| "description"
		| "category"
		| "layout"
		| "tags"
		| "isActive"
		| "html"
		| "variables"
		| "previewImage"
	>
>;

