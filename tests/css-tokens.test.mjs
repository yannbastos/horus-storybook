import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

function findCssFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCssFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      results.push(full);
    }
  }
  return results;
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Parses top-level and nested (@media, @supports, etc.) CSS rule blocks.
 * Returns array of { selector, declarations: [{ prop, value }], file }.
 */
function parseCssRules(css, file) {
  const clean = stripComments(css);
  const rules = [];

  function walk(text, atContext = '') {
    let i = 0;
    while (i < text.length) {
      while (i < text.length && /\s/.test(text[i])) i++;
      if (i >= text.length) break;

      // Find next '{' or ';' (for @import etc.)
      let braceIdx = -1;
      let semiIdx = -1;
      let inStr = null;
      for (let j = i; j < text.length; j++) {
        const ch = text[j];
        if (inStr) {
          if (ch === inStr && text[j - 1] !== '\\') inStr = null;
          continue;
        }
        if (ch === '"' || ch === "'") {
          inStr = ch;
        } else if (ch === '{') {
          braceIdx = j;
          break;
        } else if (ch === ';') {
          semiIdx = j;
          break;
        }
      }

      if (semiIdx !== -1 && (braceIdx === -1 || semiIdx < braceIdx)) {
        i = semiIdx + 1;
        continue;
      }
      if (braceIdx === -1) break;

      const prelude = text.slice(i, braceIdx).trim();

      // Match closing '}'
      let depth = 1;
      let k = braceIdx + 1;
      inStr = null;
      while (k < text.length && depth > 0) {
        const ch = text[k];
        if (inStr) {
          if (ch === inStr && text[k - 1] !== '\\') inStr = null;
        } else if (ch === '"' || ch === "'") {
          inStr = ch;
        } else if (ch === '{') {
          depth++;
        } else if (ch === '}') {
          depth--;
        }
        k++;
      }

      const body = text.slice(braceIdx + 1, k - 1);

      if (prelude.startsWith('@')) {
        if (!prelude.startsWith('@keyframes') && !prelude.startsWith('@font-face')) {
          walk(body, prelude);
        }
      } else {
        const declarations = parseDeclarations(body);
        rules.push({ selector: prelude, declarations, atContext, file });
      }

      i = k;
    }
  }

  walk(clean);
  return rules;
}

function parseDeclarations(body) {
  const decls = [];
  let current = '';
  let depth = 0;
  let inStr = null;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inStr) {
      current += ch;
      if (ch === inStr && body[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      current += ch;
    } else if (ch === '(') {
      depth++;
      current += ch;
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1);
      current += ch;
    } else if (ch === ';' && depth === 0) {
      pushDecl(current, decls);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) pushDecl(current, decls);
  return decls;
}

function pushDecl(raw, decls) {
  const colonIdx = raw.indexOf(':');
  if (colonIdx === -1) return;
  const prop = raw.slice(0, colonIdx).trim();
  const value = raw.slice(colonIdx + 1).trim();
  if (prop && value) decls.push({ prop, value });
}

/**
 * Extracts all var(--Name[, fallback]) calls from a CSS value, preserving nesting.
 * Returns [{ name, fallback, hasFallback }].
 */
function extractVarCalls(value) {
  const calls = [];
  let idx = 0;
  while (idx < value.length) {
    const match = value.slice(idx).match(/\bvar\s*\(/);
    if (!match) break;
    const start = idx + match.index;
    const openParen = start + match[0].length - 1;
    let depth = 1;
    let p = openParen + 1;
    let commaIdx = -1;
    let inStr = null;

    while (p < value.length && depth > 0) {
      const ch = value[p];
      if (inStr) {
        if (ch === inStr && value[p - 1] !== '\\') inStr = null;
      } else if (ch === '"' || ch === "'") {
        inStr = ch;
      } else if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
      } else if (ch === ',' && depth === 1 && commaIdx === -1) {
        commaIdx = p;
      }
      p++;
    }

    const inner = value.slice(openParen + 1, p - 1);
    const name = (commaIdx === -1 ? inner : value.slice(openParen + 1, commaIdx)).trim();
    const hasFallback = commaIdx !== -1;
    const fallback = hasFallback ? value.slice(commaIdx + 1, p - 1).trim() : '';

    if (name.startsWith('--')) {
      calls.push({ name, hasFallback, fallback });
    }
    if (hasFallback) {
      calls.push(...extractVarCalls(fallback));
    }
    idx = p;
  }
  return calls;
}

function classifyScope(selector) {
  const normalized = selector.replace(/\s+/g, ' ').trim();
  if (/(^|,|\s)(:root|html|body|\*)(\s|,|$)/.test(normalized) && !normalized.includes('data-theme')) {
    return 'root';
  }
  if (/\[data-theme=["']?dark["']?\]/.test(normalized)) {
    return 'dark';
  }
  if (/\[data-theme=["']?light["']?\]/.test(normalized)) {
    return 'light';
  }
  return 'component';
}

export function validateCssVarScopes(rules) {
  const rootVars = new Set();
  const darkVars = new Set();
  const lightVars = new Set();
  const localComponentVars = new Set();

  for (const rule of rules) {
    const scope = classifyScope(rule.selector);
    for (const decl of rule.declarations) {
      if (!decl.prop.startsWith('--')) continue;
      if (scope === 'root') rootVars.add(decl.prop);
      else if (scope === 'dark') darkVars.add(decl.prop);
      else if (scope === 'light') lightVars.add(decl.prop);
      else localComponentVars.add(decl.prop);
    }
  }

  const errors = [];

  const isDefinedInScope = (varName, scope) => {
    if (scope === 'root') return rootVars.has(varName);
    if (scope === 'dark') return rootVars.has(varName) || darkVars.has(varName);
    if (scope === 'light') return rootVars.has(varName) || lightVars.has(varName);
    // Component rules render inside .horus[data-theme="light|dark"]
    return (
      rootVars.has(varName) ||
      (darkVars.has(varName) && lightVars.has(varName)) ||
      localComponentVars.has(varName)
    );
  };

  for (const rule of rules) {
    const scope = classifyScope(rule.selector);
    for (const decl of rule.declarations) {
      const calls = extractVarCalls(decl.value);
      for (const call of calls) {
        if (scope === 'root') {
          if (!rootVars.has(call.name)) {
            const definedInThemes = darkVars.has(call.name) || lightVars.has(call.name);
            errors.push(
              `${path.basename(rule.file)} (${rule.selector} -> ${decl.prop}): ` +
                `var(${call.name}) não está definido em :root` +
                (definedInThemes
                  ? ' (está definido apenas em seletores de tema, o que falha na resolução em :root)'
                  : '')
            );
          }
          continue;
        }

        if (!call.hasFallback) {
          if (!isDefinedInScope(call.name, scope)) {
            const missingIn = [];
            if (!rootVars.has(call.name)) {
              if (!darkVars.has(call.name)) missingIn.push('dark');
              if (!lightVars.has(call.name)) missingIn.push('light');
            }
            errors.push(
              `${path.basename(rule.file)} (${rule.selector} -> ${decl.prop}): ` +
                `var(${call.name}) sem fallback não está definido no escopo ${scope}` +
                (missingIn.length ? ` (ausente em: ${missingIn.join(', ')})` : '')
            );
          }
        } else {
          // Optional override token with fallback: fallback itself must resolve in scope
          const fallbackCalls = extractVarCalls(call.fallback);
          for (const fb of fallbackCalls) {
            if (!fb.hasFallback && !isDefinedInScope(fb.name, scope)) {
              errors.push(
                `${path.basename(rule.file)} (${rule.selector} -> ${decl.prop}): ` +
                  `fallback var(${fb.name}) de var(${call.name}, ...) não está definido no escopo ${scope}`
              );
            }
          }
          // Also fail if the primary var is defined in only one theme
          if (
            scope === 'component' &&
            !rootVars.has(call.name) &&
            darkVars.has(call.name) !== lightVars.has(call.name)
          ) {
            errors.push(
              `${path.basename(rule.file)} (${rule.selector} -> ${decl.prop}): ` +
                `var(${call.name}) está definido em apenas um tema`
            );
          }
        }
      }
    }
  }

  return errors;
}

describe('CSS custom properties e escopo de temas', () => {
  it('todos os var(--X) usados em src/**/*.css resolvem no escopo em que são avaliados', () => {
    const cssFiles = findCssFiles(SRC_DIR);
    assert.ok(cssFiles.length > 0, 'Nenhum arquivo CSS encontrado em src/');

    const allRules = cssFiles.flatMap((file) =>
      parseCssRules(fs.readFileSync(file, 'utf8'), file)
    );
    const errors = validateCssVarScopes(allRules);
    assert.deepEqual(errors, [], `Erros de escopo CSS encontrados:\n${errors.join('\n')}`);
  });

  it('detecta regressão quando :root referencia token exclusivo de tema (ex.: --FocusRingColor: var(--AccentInk))', () => {
    const buggyCss = `
      :root { --FocusRingColor: var(--AccentInk); }
      [data-theme="dark"] { --AccentInk: #AAA5FF; }
      [data-theme="light"] { --AccentInk: #4939B8; }
      :focus-visible { outline: 2px solid var(--FocusRingColor); }
    `;
    const errors = validateCssVarScopes(parseCssRules(buggyCss, 'tokens.css'));
    assert.ok(
      errors.some((e) => e.includes('--FocusRingColor') && e.includes('--AccentInk')),
      `Esperava erro para --FocusRingColor -> --AccentInk em :root, obteve: ${errors.join('; ')}`
    );
  });
});
