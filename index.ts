import { YAML } from "bun";
import { mkdir } from "node:fs/promises";
import { parseArgs } from "node:util";
import { assertIsConfig, type Rule, type Source } from "./src/types.ts";

const main = async (configPath: string, outfile: string): Promise<void> => {
	const configText = await Bun.file(configPath).text();

	const config = YAML.parse(configText);
	console.log({ config });

	assertIsConfig(config);

	console.log(`parsed ${config.rules.length} rules from '${configPath}'`);
	console.log();

	const arr = config.rules.flatMap(procRule);

	await mkdir(outfile.split("/").slice(0, -1).join("/"), { recursive: true });

	await Bun.write(outfile, arr.join("\n"));
	console.log(`wrote ${arr.length} rules to ${outfile}`);
};

const procRule = (rule: Rule): string[] => {
	console.log(`processing ${rule.description}...`);

	const arr = rule.fontFamilies.flatMap((family) =>
		rule.sources.flatMap((src) => {
			if (src.weights) {
				return src.weights.map((weight) => createFontFace(family, src, weight));
			}
			return createFontFace(family, src);
		}),
	);

	console.log(`generated ${arr.length} rules!`);
	console.log();
	return arr;
};

const createFontFace = (
	fontFamily: string,
	source: Source,
	weight?: number | string,
): string => {
	const arr: string[] = [];

	arr.push("@font-face {");
	arr.push(`\tfont-family: "${fontFamily}";`);

	if (weight) {
		arr.push(`\tfont-weight: ${weight};`);
	}
	if (source.style) {
		arr.push(`\tfont-style: ${source.style};`);
	}
	if (source.unicode_range) {
		arr.push(`\tunicode-range: ${source.unicode_range};`);
	}

	const src = source.fullNames.map((name) => `local("${name}")`).join(", ");
	arr.push(`\tsrc: ${src};`);

	arr.push("}");

	return `${arr.join("\n")}\n`;
};

if (import.meta.main) {
	const { values } = parseArgs({
		args: Bun.argv,
		options: {
			config: {
				type: "string",
				short: "c",
				default: "config/config.yaml",
			},
			outfile: {
				type: "string",
				short: "o",
				default: "output/output.css",
			},
		},
		strict: true,
		allowPositionals: true,
	});

	const { config, outfile } = values;
	console.log({ values });

	await main(config, outfile);
}
