import { parse } from "jsr:@std/yaml";
import { assertIsConfig, Rule } from "./types.ts";

const main = async (configPath: string, outfile: string): Promise<void> => {
  const configText = await Deno.readTextFile(configPath);
  const config = parse(configText);
  assertIsConfig(config);
  console.log(`parsed ${config.rules.length} rules from ${configPath}`);
  console.log();

  const arr = config.rules.flatMap(procRule);

  await Deno.writeTextFile(outfile, arr.join("\n"));
  console.log(`wrote ${arr.length} rules to ${outfile}`);
};

const procRule = (rule: Rule): string[] => {
  console.log(`processing ${rule.description}...`);

  const arr = rule.fontFamilies.flatMap((family) =>
    rule.sources.flatMap((src) => createFontFace(family, src))
  );

  console.log(`generated ${arr.length} rules!`);
  console.log();
  return arr;
};

const createFontFace = (
  fontFamily: string,
  source: Rule["sources"][number],
): string => {
  const arr: string[] = [];

  arr.push(`@font-face {`);
  arr.push(`    font-family: \"${fontFamily}\";`);

  if (source.weight) {
    arr.push(`    font-weight: ${source.weight};`);
  }
  if (source.style) {
    arr.push(`    font-style: ${source.style};`);
  }
  if (source.unicode_range) {
    arr.push(`    unicode-range: ${source.unicode_range};`);
  }

  const src = source.fullNames.map((name) => `local(\"${name}\")`).join(", ");
  arr.push(`    src: ${src};`);

  arr.push(`}`);

  return arr.join("\n") + "\n";
};

if (import.meta.main) {
  main(
    Deno.args[0] || "config/config.yml",
    Deno.args[1] || "output/output.css",
  );
}
