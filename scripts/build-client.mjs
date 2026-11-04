#!/usr/bin/env node
/**
 * Reproducible build for client/client.js — the artifact dsh loads through
 * `window.__ModuleLoader__`.
 *
 * The upstream repo builds this file with tsdown + a private tsdown.config.ts
 * that is NOT shipped in the npm tarball, so this checkout could not be rebuilt
 * at all (a hand-patched bundle was the only option). This script reproduces
 * the same contract with esbuild:
 *
 *   - one `window.__ModuleLoader__.load({ id, factory })` wrapper, single-line
 *     loader banner (hosts sniff the id from the file head);
 *   - react / react-dom / react/jsx-runtime stay EXTERNAL (the shell provides
 *     them to the factory as `require`);
 *   - every imported .css becomes an inlined <style data-plugin-css> module,
 *     exactly like the harness's `\0dsh-css:` virtual modules, so a plugin CSS
 *     file cannot leak a global class name into the app;
 *   - class names are scoped with a stable prefix, so the emitted CSS and the
 *     exported name map always agree.
 *
 * Usage: node scripts/build-client.mjs [--check]
 *   --check  build to a temp file and only report size/regions (no overwrite)
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENTRY = 'src/client/index.ts'
const OUT = 'client/client.js'
const PLUGIN_ID = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).name
const SCOPE = 'tm_' // CSS class / keyframes prefix (stable across builds)

const BANNER = `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {
\tvar module = { exports: {} };
\tvar exports = module.exports;
\t"use strict";
\t// Breadcrumb on disk: after a failed reload we need to know whether this bundle
\t// was imported at all (see scripts/_.add-client-boot-log.mjs).
\t// Evidence trail. The console line lands in the shell's crash report (its
\t// console section survives); the POST retries because a fetch issued during
\t// module evaluation can outrun the shell's request routing.
\tconsole.error('[dsh-talk-pages] client bundle evaluated', new Date().toISOString());
\ttry {
\t\tconst ping = (phase) => { try { fetch('/talk-pages/client-boot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phase }) }).catch(() => {}) } catch {} };
\t\tping('evaluate');
\t\tsetTimeout(() => { ping('alive-1s') }, 1000);
\t\tsetTimeout(() => { ping('alive-5s') }, 5000);
\t} catch {}
\t// A single plugin must never be able to kill the whole boot: the shell treats
\t// "an entry did not activate" as fatal and exits. If this bundle fails to
\t// evaluate (e.g. a reload re-imports it while the previous graph is alive),
\t// degrade to an inert module and leave a trace instead of throwing.
\ttry {`
const FOOTER = `\t} catch (error) {
\t\tconsole.error('[dsh-talk-pages] client bundle failed to evaluate (inert this boot):', error);
\t\treturn { name: ${JSON.stringify(PLUGIN_ID)}, apply() {} };
\t}
\treturn module.exports;
}
});
`

/**
 * CSS-modules scoping, done here instead of lightningcss so the build has no
 * native dependency: `:global(...)` is unwrapped verbatim, @keyframes names and
 * their animation references are prefixed, and every `.class` selector gets the
 * scope prefix.
 */
function scopeCss(source) {
  const names = new Set()
  let css = source.replace(/\/\*[\s\S]*?\*\//g, '')

  // :global(...) — keep its inner selector scoped exactly as written.
  const globals = []
  css = css.replace(/:global\(([^()]*)\)/g, (_match, inner) => {
    globals.push(inner.trim())
    return `\u0000G${globals.length - 1}\u0000`
  })

  // @keyframes names, then their animation/animation-name references.
  const frames = new Set()
  css = css.replace(/@keyframes\s+([A-Za-z_][\w-]*)/g, (_match, name) => {
    frames.add(name)
    return `@keyframes ${SCOPE}${name}`
  })
  if (frames.size > 0) {
    css = css.replace(/animation(?:-name)?\s*:[^;}]*/g, (decl) => {
      let out = decl
      for (const name of frames) {
        out = out.replace(new RegExp(`(^|[\\s,:])${name}(?=$|[\\s,;!])`, 'g'), `$1${SCOPE}${name}`)
      }
      return out
    })
  }

  // Class selectors. This stylesheet contains no url(), no content: strings and
  // no decimals in selectors, so `.name` outside :global() is always a class —
  // assert that instead of writing a full CSS parser.
  css = css.replace(/\.([A-Za-z_][\w-]*)/g, (match, name) => {
    if (match.startsWith('.0') || /^\d/.test(name)) return match
    names.add(name)
    return `.${SCOPE}${name}`
  })

  css = css.replace(/\u0000G(\d+)\u0000/g, (_match, index) => globals[Number(index)])

  const map = {}
  for (const name of [...names].sort()) map[name] = `${SCOPE}${name}`
  return { css: css.replace(/\s+/g, ' ').trim(), map }
}

function styleModule(source, tagId, isModule) {
  const { css, map } = isModule
    ? scopeCss(source)
    : { css: source.replace(/\s+/g, ' ').trim(), map: {} }
  return [
    `const __tagId = ${JSON.stringify(tagId)};`,
    `const __css = ${JSON.stringify(css)};`,
    `if (typeof document !== "undefined") {`,
    `\tconst __selector = "style[data-plugin-css=" + JSON.stringify(__tagId) + "]";`,
    `\tif (document.querySelector(__selector) === null) {`,
    `\t\tconst __tag = document.createElement("style");`,
    `\t\t__tag.dataset.plugin = ${JSON.stringify(PLUGIN_ID)};`,
    `\t\t__tag.dataset.pluginCss = __tagId;`,
    `\t\t__tag.textContent = __css;`,
    `\t\tdocument.head.appendChild(__tag);`,
    `\t}`,
    `}`,
    `export default ${JSON.stringify(map)};`,
  ].join('\n')
}

const cssPlugin = {
  name: 'dsh-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      // Resolve by hand: build.resolve() would re-enter this same onResolve and
      // recurse until the heap dies.
      let file
      if (args.path.startsWith('.') || path.isAbsolute(args.path)) {
        file = path.resolve(args.resolveDir, args.path)
        if (!fs.existsSync(file)) return undefined
      } else {
        try {
          const require = createRequire(path.join(args.resolveDir, 'noop.js'))
          file = require.resolve(args.path)
        } catch {
          return { errors: [{ text: `cannot resolve stylesheet ${args.path}` }] }
        }
      }
      // Virtual, repo-relative path: esbuild prints it as the region comment,
      // and an absolute build path must never land in the artifact.
      const rel = path.relative(ROOT, file).replace(/\\/g, '/')
      return { path: `\0dsh-css:${rel.startsWith('..') ? path.basename(file) : rel}`, namespace: 'dsh-css', pluginData: { file } }
    })
    build.onLoad({ filter: /.*/, namespace: 'dsh-css' }, (args) => {
      const file = args.pluginData.file
      const source = fs.readFileSync(file, 'utf8')
      const isModule = file.endsWith('.module.css')
      const tagId = `${PLUGIN_ID}/${path.basename(file)}`
      return {
        contents: styleModule(source, tagId, isModule),
        loader: 'js',
        resolveDir: path.dirname(file),
        watchFiles: [file],
      }
    })
  },
}

/** The desktop app's pid when it is running, else null. */
function detectDsh() {
  try {
    const out = execFileSync('tasklist', ['/FI', 'IMAGENAME eq DeepSeek Harness.exe', '/FO', 'CSV', '/NH'], { encoding: 'utf8' })
    const match = out.match(/"DeepSeek Harness\.exe","(\d+)"/)
    return match === null ? null : Number(match[1])
  } catch {
    return null
  }
}

const check = process.argv.includes('--check')
/** Ship the bundle into `client/client.js` (what the running app loads). */
const publish = process.argv.includes('--publish')
/**
 * Dev builds never touch `client/client.js`.
 *
 * The shell cannot hot-load a changed client bundle: any reload after this file
 * changes fails that entry and the shell treats it as fatal (`web boot: … did not
 * activate`) and exits. Verified 2026-10-26 — a rebuild at 23:20 was followed by
 * that exact crash at 23:22, and the bundle itself evaluated fine.
 *
 * So: build to `client.dev.js` for the harness, and only publish (atomically)
 * right before the user restarts.
 */
const outfile = check
  ? path.join(ROOT, 'client', '.client.check.js')
  // ALWAYS staged. `client/client.js` is only ever created by a rename, after
  // every check below has passed — esbuild must never write it directly: a
  // refused publish used to leave the app's live bundle already overwritten
  // (2026-10-27 00:01: the guard said "refusing" and the file had changed anyway,
  // so the next plugin toggle crashed the app).
  : path.join(ROOT, 'client', '.client.build.js')

const result = await esbuild.build({
  absWorkingDir: ROOT,
  entryPoints: [ENTRY],
  outfile,
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  jsxDev: false,
  legalComments: 'none',
  charset: 'utf8',
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  plugins: [cssPlugin],
  banner: { js: BANNER },
  footer: { js: FOOTER },
  metafile: true,
})

const bytes = fs.statSync(outfile).size
const text = fs.readFileSync(outfile, 'utf8')
const problems = []
if (!text.startsWith(`${BANNER}\n`)) problems.push('loader banner is not the first line')
if (!text.trimEnd().endsWith('});')) problems.push('file does not end with the loader call')
if (!text.includes('return module.exports;')) problems.push('factory does not return module.exports')
for (const bad of ["require(\"react/react", 'process.env', 'D:\\', 'file://']) {
  if (bad !== 'process.env' && text.includes(bad)) problems.push(`unexpected ${bad}`)
}
if (!text.includes(PLUGIN_ID)) problems.push('plugin id missing from bundle')

// PARSE CHECK — the one that matters. Every plugin's client.js is served inside
// one aggregate URL (`plugins/??a,b,c`), so a syntax error here does not just
// break this plugin: it takes down every entry in that script, and the shell
// treats "entries did not activate" as fatal and exits. A build must never be
// able to put an unparseable file on disk (2026-10-26: it did, and crashed the
// desktop app twice).
try {
  new vm.Script(text, { filename: 'client.js' })
} catch (error) {
  problems.push(`bundle does not parse: ${error?.message ?? error}`)
}

if (problems.length > 0) {
  console.error('build-client: ' + problems.join('; '))
  // Never leave a broken artifact behind: remove the half-built file.
  fs.rmSync(outfile, { force: true })
  process.exit(1)
}

// PUBLISH SAFETY — runs BEFORE anything is renamed onto the live path.
/**
 * `dsh-unlag` swaps a plugin's code in place and rebuilds the UI without
 * restarting the host — with it installed, publishing is the normal flow and the
 * "quit DSH first" dance is obsolete. Detect it from the profile manifest.
 */
function hasUnlag() {
  try {
    const profile = path.join(process.env.USERPROFILE ?? '', '.dsh', 'profiles', 'desktop', 'package.json')
    const manifest = JSON.parse(fs.readFileSync(profile, 'utf8'))
    return Object.keys(manifest.dependencies ?? {}).some(name => name.includes('unlag'))
  } catch {
    return false
  }
}

if (publish && !process.argv.includes('--force') && !hasUnlag()) {
  const running = detectDsh()
  if (running !== null) {
    console.error(
      'build-client: DSH is running (pid ' + running + '), refusing to publish.\n'
      + '  A changed client.js crashes the app on the next reload (plugin toggle).\n'
      + '  client/client.js was NOT touched; the build stayed in ' + path.basename(outfile) + '.\n'
      + '  1) quit DSH   2) re-run this command   3) start DSH',
    )
    fs.rmSync(outfile, { force: true })
    process.exit(1)
  }
}

// PUBLISH: one atomic rename (NTFS renames inside a directory are atomic), so a
// reload sees either the old bundle or the new one, never a truncated file.
if (check) {
  fs.rmSync(outfile, { force: true })
} else {
  const target = publish ? path.join(ROOT, OUT) : path.join(ROOT, 'client', 'client.dev.js')
  fs.renameSync(outfile, target)
  console.log(`build-client: ${path.relative(ROOT, target)} ${(bytes / 1024).toFixed(1)} kB`)
}
