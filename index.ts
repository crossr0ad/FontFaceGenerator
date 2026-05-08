import { mkdir } from "node:fs/promises";
import { parseArgs } from "node:util";
import { YAML } from "bun";
import { assertIsConfig, type Rule, type Source } from "./src/types.ts";

const main = async (
	configPath: string,
	outfile: string,
	version: string,
): Promise<void> => {
	const configText = await Bun.file(configPath).text();

	const config = YAML.parse(configText);
	assertIsConfig(config);
	console.log(`parsed ${config.rules.length} rules from '${configPath}'`);
	console.log();

	const header = `/* ==UserStyle==
@name Font Substitution
@namespace https://github.com/crossr0ad/FontFaceGenerator/
@version ${version}
==/UserStyle== */
`;

	const arr = config.rules.flatMap(procRule);

	await mkdir(outfile.split("/").slice(0, -1).join("/"), { recursive: true });

	await Bun.write(outfile, `${header}\n${arr.join("\n")}`);
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
				default: "output/output.user.css",
			},
			version: {
				type: "string",
				short: "v",
				default: "0.0.1",
			},
		},
		strict: true,
		allowPositionals: true,
	});

	const { config, outfile, version } = values;
	console.log({ values });

	await main(config, outfile, version);
}
