export interface TemplateUsage {
	use_for?: string;
	dont_use_for?: string;
	tag?: string;
	group?: string;
}

export interface StoredTemplateVariable {
	value: string;
	type?: string;
	usage?: string;
}

export type TemplateVariableInput =
	| string
	| StoredTemplateVariable
	| { example_value: string; usage?: string; type?: string; value?: string };

export interface CatalogTemplateVariable {
	example_value: string;
	usage?: string;
}

function inferType(value: string): "text" | "textarea" {
	return value.includes("\n") ? "textarea" : "text";
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeSingleVariable(raw: TemplateVariableInput): StoredTemplateVariable {
	if (typeof raw === "string") {
		return { value: raw, type: inferType(raw) };
	}

	if (!isRecord(raw)) {
		return { value: String(raw), type: "text" };
	}

	const exampleValue =
		typeof raw.example_value === "string"
			? raw.example_value
			: typeof raw.value === "string"
				? raw.value
				: raw.example_value === null || raw.example_value === undefined
					? raw.value === null || raw.value === undefined
						? ""
						: String(raw.value)
					: String(raw.example_value);

	const type =
		raw.type === "textarea" || raw.type === "text"
			? raw.type
			: inferType(exampleValue);

	const usage = typeof raw.usage === "string" ? raw.usage : undefined;

	return { value: exampleValue, type, ...(usage ? { usage } : {}) };
}

const BUNDLE_META_KEYS = new Set(["templateName", "brandName"]);

function isUsageMetadata(value: unknown): value is TemplateUsage {
	if (!isRecord(value)) return false;
	return (
		typeof value.use_for === "string" ||
		typeof value.dont_use_for === "string" ||
		typeof value.group === "string" ||
		typeof value.tag === "string"
	);
}

/** Detect catalog / generate request bundle pasted as a single JSON blob. */
export function isTemplateBundle(
	raw: unknown
): raw is Record<string, unknown> & { templateVariables: Record<string, unknown> } {
	return isRecord(raw) && isRecord(raw.templateVariables);
}

/**
 * Split a flat map, catalog bundle, or mixed paste into usage + real template variables.
 */
export function unwrapTemplatePayload(raw: unknown): {
	usage?: TemplateUsage | null;
	variables: Record<string, TemplateVariableInput>;
} {
	if (!isRecord(raw)) {
		return { variables: {} };
	}

	if (isTemplateBundle(raw)) {
		return {
			usage: normalizeTemplateUsage(raw.usage as TemplateUsage),
			variables: raw.templateVariables as Record<string, TemplateVariableInput>,
		};
	}

	let usage: TemplateUsage | null | undefined;
	const variables: Record<string, TemplateVariableInput> = {};

	for (const [key, value] of Object.entries(raw)) {
		if (!key.trim() || BUNDLE_META_KEYS.has(key)) continue;

		if (key === "usage" && isUsageMetadata(value)) {
			usage = normalizeTemplateUsage(value);
			continue;
		}

		if (key === "templateVariables" && isRecord(value)) {
			const inner = value as Record<string, unknown>;
			const isVariableMap = Object.values(inner).some(
				(v) =>
					typeof v === "string" ||
					(isRecord(v) &&
						("example_value" in v ||
							"value" in v ||
							"usage" in v ||
							"type" in v))
			);
			if (isVariableMap) {
				for (const [innerKey, innerVal] of Object.entries(inner)) {
					if (innerKey.trim()) {
						variables[innerKey] = innerVal as TemplateVariableInput;
					}
				}
			} else {
				variables[key] = value as TemplateVariableInput;
			}
			continue;
		}

		variables[key] = value as TemplateVariableInput;
	}

	return { usage, variables };
}

export function normalizeVariablesForStorage(
	raw?: Record<string, TemplateVariableInput> | unknown | null
): Record<string, StoredTemplateVariable> {
	const { variables } = unwrapTemplatePayload(raw ?? {});

	const result: Record<string, StoredTemplateVariable> = {};
	for (const [key, value] of Object.entries(variables)) {
		if (!key.trim()) continue;
		result[key] = normalizeSingleVariable(value);
	}
	return result;
}

export function variablesToCatalog(
	raw?: Record<string, TemplateVariableInput> | unknown | null
): Record<string, CatalogTemplateVariable> {
	const normalized = normalizeVariablesForStorage(raw);
	const result: Record<string, CatalogTemplateVariable> = {};

	for (const [key, variable] of Object.entries(normalized)) {
		result[key] = {
			example_value: variable.value,
			...(variable.usage ? { usage: variable.usage } : {}),
		};
	}
	return result;
}

export function normalizeTemplateUsage(
	raw?: TemplateUsage | null
): TemplateUsage | null {
	if (!raw || typeof raw !== "object") {
		return null;
	}

	const usage: TemplateUsage = {};
	if (typeof raw.use_for === "string" && raw.use_for.trim()) {
		usage.use_for = raw.use_for.trim();
	}
	if (typeof raw.dont_use_for === "string" && raw.dont_use_for.trim()) {
		usage.dont_use_for = raw.dont_use_for.trim();
	}
	if (typeof raw.tag === "string" && raw.tag.trim()) {
		usage.tag = raw.tag.trim();
	}
	if (typeof raw.group === "string" && raw.group.trim()) {
		usage.group = raw.group.trim();
	}

	return Object.keys(usage).length > 0 ? usage : null;
}

/** Studio: API/DB variables → editable { value, type } map. */
export function studioVariablesFromApi(
	raw?: Record<string, TemplateVariableInput> | unknown | null
): Record<string, { value: string; type: "text" | "textarea" }> {
	const normalized = normalizeVariablesForStorage(raw);
	const result: Record<string, { value: string; type: "text" | "textarea" }> = {};
	for (const [key, variable] of Object.entries(normalized)) {
		result[key] = {
			value: variable.value,
			type: variable.type === "textarea" ? "textarea" : "text",
		};
	}
	return result;
}
