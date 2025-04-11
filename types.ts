import { z } from "https://deno.land/x/zod@v3.24.1/mod.ts";

export const Rule = z.object({
	description: z.string(),
	fontFamilies: z.array(z.string()),
	sources: z.array(
		z.object({
			fullNames: z.array(z.string()),
			weights: z.array(z.union([z.number(), z.string()])).optional(),
			style: z.string().optional(),
			unicode_range: z.string().optional(),
		}),
	),
});

export const Config = z.object({ rules: z.array(Rule) });
export type Config = z.infer<typeof Config>;

export type Rule = Config["rules"][number];

export function assertIsConfig(object: unknown): asserts object is Config {
	Config.parse(object);
}
