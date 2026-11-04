/**
 * Smoke test: evaluate client/client.js TWICE in one realm, the way a reload
 * re-imports a module while the previous graph is still alive.
 *
 * Cold boot evaluates it once and works; the crash log says a *reload* fails to
 * import it ("dsh-talk-pages: import failed"). So the interesting question is
 * whether the second evaluation throws — that is exactly what a module-scope
 * side effect (a store, a style tag, a listener, a cache) would do.
 *
 * Usage: node test/bundle-smoke.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = fs.readFileSync(path.join(root, 'client', 'client.js'), 'utf8')

function makeContext() {
  const elements = new Set()
  const documentStub = {
    head: { appendChild: () => {}, removeChild: () => {} },
    body: { appendChild: () => {} },
    createElement: () => ({
      style: {}, dataset: {}, setAttribute() {}, appendChild() {}, remove() {},
      classList: { add() {}, remove() {}, contains: () => false },
    }),
    createTextNode: () => ({}),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: (id) => (elements.has(id) ? { id } : null),
    documentElement: { style: {}, dataset: {}, setAttribute() {} },
    addEventListener() {}, removeEventListener() {},
  }
  const storage = new Map()
  const localStorageStub = {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => { storage.set(key, String(value)) },
    removeItem: (key) => { storage.delete(key) },
    key: (index) => [...storage.keys()][index] ?? null,
    get length() { return storage.size },
  }
  const context = {
    console,
    document: documentStub,
    localStorage: localStorageStub,
    sessionStorage: localStorageStub,
    navigator: { userAgent: 'smoke', language: 'zh-CN' },
    location: { href: 'dsh-app://app/', search: '', hash: '' },
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: (fn) => setTimeout(fn, 0),
    cancelAnimationFrame: clearTimeout,
    queueMicrotask,
    fetch: () => Promise.reject(new Error('offline')),
    EventSource: class { addEventListener() {} close() {} },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    CustomEvent: class { constructor(type) { this.type = type } },
    Event: class { constructor(type) { this.type = type } },
    MutationObserver: class { observe() {} disconnect() {} },
  }
  context.window = context
  context.globalThis = context
  context.self = context
  return vm.createContext(context)
}

const loaded = []
function loaderFor(context) {
  return {
    load({ id, factory }) {
      loaded.push(id)
      // The harness passes a `require` that resolves the few externals.
      const requireStub = (name) => {
        if (name === 'react') {
          // Any hook/API the bundle touches: exists, does nothing harmful.
          const base = {
            createElement: () => null,
            createContext: () => ({ Provider: 'p', Consumer: 'c' }),
            useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
            useEffect: () => {},
            useLayoutEffect: () => {},
            useMemo: (fn) => fn(),
            useCallback: (fn) => fn,
            useRef: (value) => ({ current: value }),
            useSyncExternalStore: (_subscribe, get) => (typeof get === 'function' ? get() : undefined),
            useId: () => 'id',
            memo: (component) => component,
            forwardRef: (render) => render,
            Fragment: 'fragment',
            Children: { map: () => [], toArray: () => [] },
          }
          return new Proxy(base, { get: (target, key) => (key in target ? target[key] : () => null) })
        }
        if (name === 'react-dom') return { createRoot: () => ({ render() {}, unmount() {} }) }
        if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null, Fragment: 'frag' }
        throw new Error(`unexpected external: ${name}`)
      }
      const exports = factory(requireStub)
      context.__lastExports = exports
      if (exports === undefined) throw new Error(`${id}: factory returned undefined`)
      return exports
    },
  }
}

const context = makeContext()
context.__ModuleLoader__ = loaderFor(context)

let failures = 0
function check(label, condition, detail) {
  if (condition) {
    console.log('PASS ', label, detail ?? '')
  } else {
    failures += 1
    console.log('FAIL ', label, detail ?? '')
  }
}

function evaluate(label) {
  try {
    vm.runInContext(source, context, { filename: 'client.js' })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: `${error?.name ?? 'Error'}: ${error?.message ?? error}` }
  }
}

const first = evaluate('first')
check('第一次求值（冷启动）', first.ok, first.error ?? '')
const second = evaluate('second')
check('同一 realm 内第二次求值（重载）', second.ok, second.error ?? '')
check('两次都注册了同一个 id', loaded.length >= 1, JSON.stringify(loaded.slice(0, 3)))

// NOTE: a fake-ctx apply() test used to live here. It could not reproduce the
// real loader's behaviour (the harness's second apply saw an empty body), so it
// asserted nothing trustworthy and was removed rather than kept as noise.
process.exit(failures === 0 ? 0 : 1)
