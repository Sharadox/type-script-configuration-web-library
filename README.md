# @sharadox/type-script-configuration-web-library

Shared TypeScript configurations for every Sharadox project. Paths use TypeScript's `${configDir}`, so the include and output folders are always relative to **your** `tsconfig.json`.

## Install

```sh
pnpm add -D typescript @types/node @sharadox/type-script-configuration-web-library
```

## Configurations

| File                       | For                                            | Adds to `base.json`                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base.json`                | everything                                     | ES2024, `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `noEmit`, the `sharadox-source` export condition, Node types; includes `source/**` and root `*.ts`; leaves out `node_modules`, `distribution`, `documentation`, `coverage` and `source/**/test-fixture` |
| `node.json`                | tools, GitHub actions, server-only libraries   | `module`/`moduleResolution: nodenext`                                                                                                                                                                                                                                                                                     |
| `react-library.json`       | React libraries consumed by bundlers (Next.js) | DOM types, `moduleResolution: bundler`, `jsx: react-jsx`, and types for CSS and Sass modules (`import styles from "./index.module.css"`)                                                                                                                                                                                  |
| `next-js-application.json` | Next.js applications (`src/`)                  | DOM, bundler resolution, JSX, `incremental`, the `next` plugin, `next-env.d.ts` and `.next/types`; no `sharadox-source` condition (apps use published builds)                                                                                                                                                             |
| `library-build.json`       | the build of any library                       | emits `source/` to `distribution/` with declarations and source maps, leaving out unit, benchmark and end-to-end tests and fixtures                                                                                                                                                                                       |

## Use

```jsonc
// tsconfig.json (a React library)
{ "extends": "@sharadox/type-script-configuration-web-library/react-library.json" }
```

```jsonc
// tsconfig.build.json (the library's build): your settings first, then the build settings
{ "extends": ["./tsconfig.json", "@sharadox/type-script-configuration-web-library/library-build.json"] }
```

```jsonc
// tsconfig.json (a Next.js application with an import alias)
{
  "extends": "@sharadox/type-script-configuration-web-library/next-js-application.json",
  "compilerOptions": { "paths": { "@sharadox/my-web-application/*": ["./src/*"] } },
}
```

Anything you set in your own `tsconfig.json` overrides the shared value.

## Develop

Tests compile small fixture projects (`source/configuration/test-fixture/`) with each configuration and check what TypeScript resolves. `pnpm verify` runs formatting, lint, type-check and tests. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## Licence

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
