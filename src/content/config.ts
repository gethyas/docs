import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection, z, type CollectionEntry } from 'astro:content';

export const baseSchema = z.object({
	type: z.literal('base').optional().default('base'),
	i18nReady: z.boolean().default(false),
	githubURL: z.string().url().optional(),
	hasREADME: z.boolean().optional(),
	// Extends Starlight’s default `hero` schema with custom fields.
	/*
	hero: z
		.object({
			facepile: z.object({
				tagline: z.string(),
				linkText: z.string(),
				link: z.string(),
			}),
		})
		.optional(),
	*/
});

export const deploySchema = baseSchema.extend({
	type: z.literal('deploy'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const backendSchema = baseSchema.extend({
	type: z.literal('backend'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const cmsSchema = baseSchema.extend({
	type: z.literal('cms'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const analyticsSchema = baseSchema.extend({
	type: z.literal('analytics'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const themeSchema = baseSchema.extend({
	type: z.literal('themes'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const integrationSchema = baseSchema.extend({
	type: z.literal('integration'),
	title: z
	.string()
	.refine(
		(title) => title.startsWith('@hyas/'),
		'"title" must start with "@hyas/" for integration docs.'
	),
	stub: z.boolean().default(false),
	service: z.string(),
	category: z.enum(['renderer', 'theme', 'other']),
});

export const migrationSchema = baseSchema.extend({
	type: z.literal('migration'),
	framework: z.string(),
	stub: z.boolean().default(false),
});

export const tutorialSchema = baseSchema.extend({
	type: z.literal('tutorial'),
	unitTitle: z.string().optional(),
});

export const recipeSchema = baseSchema.extend({
	type: z.literal('recipe'),
	description: z.string(),
});

export const docsCollectionSchema = z.union([
	baseSchema,
	backendSchema,
	cmsSchema,
	analyticsSchema,
	themeSchema,
	integrationSchema,
	migrationSchema,
	tutorialSchema,
	deploySchema,
	recipeSchema,
]);

export type DocsEntryData = z.infer<typeof docsCollectionSchema>;

export type DocsEntryType = DocsEntryData['type'];

export type DocsEntry<T extends DocsEntryType> = CollectionEntry<'docs'> & {
	data: Extract<DocsEntryData, { type: T }>;
};

export function createIsDocsEntry<T extends DocsEntryType>(type: T) {
	return (entry: CollectionEntry<'docs'>): entry is DocsEntry<T> => entry.data.type === type;
}

export type DeployEntry = DocsEntry<'deploy'>;

export type BackendEntry = DocsEntry<'backend'>;

export type CmsEntry = DocsEntry<'cms'>;

export type AnalyticsEntry = DocsEntry<'analytics'>;

export type ThemeEntry = DocsEntry<'themes'>;

export type IntegrationEntry = DocsEntry<'integration'>;

export type MigrationEntry = DocsEntry<'migration'>;

export type TutorialEntry = DocsEntry<'tutorial'>;

export type RecipeEntry = DocsEntry<'recipe'>;

export type IntegrationCategory = z.infer<typeof integrationSchema>['category'];

export const isBackendEntry = createIsDocsEntry('backend');

export const isCmsEntry = createIsDocsEntry('cms');

export const isAnalyticsEntry = createIsDocsEntry('analytics');

export const isThemeEntry = createIsDocsEntry('themes');

export const isDeployEntry = createIsDocsEntry('deploy');

export const isIntegrationEntry = createIsDocsEntry('integration');

export const isTutorialEntry = createIsDocsEntry('tutorial');

export const isMigrationEntry = createIsDocsEntry('migration');

export const isRecipeEntry = createIsDocsEntry('recipe');

export function createIsLangEntry(lang: string) {
	return (entry: CollectionEntry<'docs'>): boolean => entry.slug.startsWith(lang + '/');
}

export const isEnglishEntry = createIsLangEntry('en');
export const isKoreanEntry = createIsLangEntry('ko');

export const collections = {
	docs: defineCollection({ schema: docsSchema({ extend: docsCollectionSchema }) }),
};
