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
	variables: Record<string, TemplateVariable>;
	brandVariables?: Record<string, string>;
	previewImage?: string;
	userId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
