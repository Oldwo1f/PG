import {
  StoredTemplateVariable,
  Template,
  TemplateUsage,
  TemplateVariableInput,
} from './entities/template.entity';

export interface CatalogTemplateVariable {
  example_value: string;
  usage?: string;
}

export interface TemplateCatalogEntry {
  templateName: string;
  description: string;
  category: string;
  layout: Template['layout'];
  previewImage?: string;
  usage?: TemplateUsage;
  templateVariables: Record<string, CatalogTemplateVariable>;
}

function inferType(value: string): string {
  return value.includes('\n') ? 'textarea' : 'text';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeSingleVariable(raw: TemplateVariableInput): StoredTemplateVariable {
  if (typeof raw === 'string') {
    return { value: raw, type: inferType(raw) };
  }

  if (!isRecord(raw)) {
    return { value: String(raw), type: 'text' };
  }

  const exampleValue =
    typeof raw.example_value === 'string'
      ? raw.example_value
      : typeof raw.value === 'string'
        ? raw.value
        : raw.example_value === null || raw.example_value === undefined
          ? raw.value === null || raw.value === undefined
            ? ''
            : String(raw.value)
          : String(raw.example_value);

  const type =
    typeof raw.type === 'string' && raw.type ? raw.type : inferType(exampleValue);

  const usage = typeof raw.usage === 'string' ? raw.usage : undefined;

  return { value: exampleValue, type, ...(usage ? { usage } : {}) };
}

export function normalizeVariablesForStorage(
  raw?: Record<string, TemplateVariableInput> | null,
): Record<string, StoredTemplateVariable> {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  const result: Record<string, StoredTemplateVariable> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!key.trim()) continue;
    result[key] = normalizeSingleVariable(value);
  }
  return result;
}

export function variablesToCatalog(
  raw?: Record<string, TemplateVariableInput> | null,
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

export function toCatalogEntry(template: Template): TemplateCatalogEntry {
  return {
    templateName: template.name,
    description: template.description ?? '',
    category: template.category ?? '',
    layout: template.layout,
    ...(template.previewImage ? { previewImage: template.previewImage } : {}),
    ...(template.usage ? { usage: template.usage } : {}),
    templateVariables: variablesToCatalog(template.variables),
  };
}

export function flattenTemplateVariablesForRender(
  vars?: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!vars || typeof vars !== 'object') {
    return {};
  }

  const result: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(vars)) {
    if (!key.trim()) continue;

    if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
      result[key] = raw;
      continue;
    }

    if (isRecord(raw)) {
      if (typeof raw.example_value === 'string') {
        result[key] = raw.example_value;
        continue;
      }
      if ('value' in raw) {
        result[key] = raw.value;
        continue;
      }
    }

    result[key] = raw;
  }
  return result;
}

export function normalizeTemplateUsage(raw?: TemplateUsage | null): TemplateUsage | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }

  const usage: TemplateUsage = {};
  if (typeof raw.use_for === 'string' && raw.use_for.trim()) {
    usage.use_for = raw.use_for.trim();
  }
  if (typeof raw.dont_use_for === 'string' && raw.dont_use_for.trim()) {
    usage.dont_use_for = raw.dont_use_for.trim();
  }
  if (typeof raw.tag === 'string' && raw.tag.trim()) {
    usage.tag = raw.tag.trim();
  }
  if (typeof raw.group === 'string' && raw.group.trim()) {
    usage.group = raw.group.trim();
  }

  return Object.keys(usage).length > 0 ? usage : undefined;
}
