import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const fixture = (name: string) => fileURLToPath(new URL(`./test-fixture/${name}/`, import.meta.url));
const typeScript = fileURLToPath(new URL("../../node_modules/typescript/bin/tsc", import.meta.url));
const tsc = (...options: string[]) => execFileSync("node", [typeScript, ...options], { encoding: "utf8" });
/** The options TypeScript actually uses after following `extends`, and the project's own files (relative). */
const resolved = (project: string) => {
  const { compilerOptions } = JSON.parse(tsc("--showConfig", "-p", project)) as {
    compilerOptions: Record<string, unknown>;
  };
  const root = project.endsWith(".json") ? project.slice(0, project.lastIndexOf("/") + 1) : project;
  const files = tsc("--listFilesOnly", "-p", project)
    .split("\n")
    .filter((file) => file.startsWith(root))
    .map((file) => `./${file.slice(root.length)}`);
  return { compilerOptions, files };
};

describe("base (through every configuration)", () => {
  test.each(["node", "react-library", "next-js-application"])("%s is strict and checks indexes", (name) => {
    const { compilerOptions } = resolved(fixture(name));
    expect(compilerOptions).toMatchObject({
      strict: true,
      noUncheckedIndexedAccess: true,
      erasableSyntaxOnly: true,
      verbatimModuleSyntax: true,
      noEmit: true,
    });
  });
});

describe("node", () => {
  test("resolves like Node and compiles", () => {
    const { compilerOptions, files } = resolved(fixture("node"));
    expect(compilerOptions).toMatchObject({ module: "nodenext", moduleResolution: "nodenext", target: "es2024" });
    expect(files).toContain("./source/index.ts");
    expect(() => tsc("-p", fixture("node"))).not.toThrow();
  });
});

describe("react-library", () => {
  test("resolves like a bundler, knows the DOM and compiles JSX", () => {
    const { compilerOptions } = resolved(fixture("react-library"));
    expect(compilerOptions).toMatchObject({
      moduleResolution: "bundler",
      jsx: "react-jsx",
      customConditions: ["sharadox-source"],
    });
    expect(compilerOptions.lib).toEqual(expect.arrayContaining(["es2024", "dom"]));
  });
});

describe("next-js-application", () => {
  test("covers src/ and the Next.js plugin, without the library condition", () => {
    const { compilerOptions, files } = resolved(fixture("next-js-application"));
    expect(compilerOptions).toMatchObject({
      jsx: "react-jsx",
      incremental: true,
      plugins: [{ name: "next" }],
      customConditions: [],
    });
    expect(files).toContain("./src/index.tsx");
  });
});

describe("library-build", () => {
  test("emits source/ into distribution/ with declarations, leaving tests out", () => {
    const { compilerOptions, files } = resolved(`${fixture("library-build")}tsconfig.build.json`);
    expect(compilerOptions).toMatchObject({
      noEmit: false,
      declaration: true,
      rootDir: "./source",
      outDir: "./distribution",
    });
    expect(files).toEqual(["./source/index.ts"]);
  });
});

test("every published entry exists", () => {
  const manifest = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as {
    exports: Record<string, string>;
  };
  for (const target of Object.values(manifest.exports)) {
    expect(existsSync(new URL(`../../${target}`, import.meta.url))).toBe(true);
  }
});
