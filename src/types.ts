import * as z from "zod";

export const Source = z
	.object({
		fullNames: z.array(z.string()).readonly(),
		weights: z
			.array(z.union([z.number(), z.string()]))
			.optional()
			.readonly(),
		style: z.string().optional(),
		unicode_range: z.string().optional(),
	})
	.readonly();
export type Source = z.infer<typeof Source>;

export const Rule = z
	.object({
		description: z.string(),
		fontFamilies: z.array(z.string()).readonly(),
		sources: z.array(Source).readonly(),
	})
	.readonly();
export type Rule = z.infer<typeof Rule>;

export const Config = z.object({ rules: z.array(Rule).readonly() }).readonly();
export type Config = z.infer<typeof Config>;

export function assertIsConfig(object: unknown): asserts object is Config {
	Config.parse(object);
}
