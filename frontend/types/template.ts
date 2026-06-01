import type { Brand } from "./brand";
import type { TemplateCategory } from "~/constants/categories";

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
	usage?: string;
}

export interface TemplateUsage {
	use_for?: string;
	dont_use_for?: string;
	tag?: string;
	group?: string;
}

export interface Template {
	id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	layout: TemplateLayout;
	tags: string[];
	isActive: boolean;
	html?: string;
	variables: Record<string, TemplateVariable | string>;
	usage?: TemplateUsage | null;
	brandVariables?: Record<string, string>;
	previewImage?: string;
	userId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
