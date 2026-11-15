import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const STATIC_DIR = path.join(ROOT_DIR, 'storybook-static');
const AXE_PATH = require.resolve('axe-core/axe.min.js');

const THEMES = ['light', 'dark'];
const MIN_OUTLINE_CONTRAST = 3.0;
const MAX_TABS_PER_STORY = 30;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
};

function startStaticServer(dir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let relPath = decodeURIComponent(reqUrl.pathname);
      if (relPath === '/') relPath = '/index.html';
      const filePath = path.resolve(dir, `.${relPath}`);
      if (!filePath.startsWith(dir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

function loadStories() {
  const indexPath = path.join(STATIC_DIR, 'index.json');
  assert.ok(
    fs.existsSync(indexPath),
    `storybook-static/index.json não encontrado em ${indexPath}. Execute "npm run build-storybook" antes.`
  );
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  return Object.values(index.entries).filter((entry) => entry.type === 'story');
}

describe('Storybook: foco por teclado (contraste >= 3:1) e axe-core nos temas claro e escuro', () => {
  let server;
  let baseUrl;
  let browser;
  let stories;

  before(async () => {
    stories = loadStories();
    assert.ok(stories.length > 0, 'Nenhuma story encontrada em storybook-static/index.json');
    const started = await startStaticServer(STATIC_DIR);
    server = started.server;
    baseUrl = started.baseUrl;
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await browser?.close();
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('todas as stories passam no axe-core e stories interativas têm outline de foco visível com contraste >= 3:1 nos dois temas', async () => {
    const axeSource = fs.readFileSync(AXE_PATH, 'utf8');
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    const axeFailures = [];
    const focusFailures = [];
    let interactiveStoriesChecked = 0;
    let focusableElementsChecked = 0;

    try {
      for (const story of stories) {
        for (const theme of THEMES) {
          const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=theme:${theme}`;
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          await page.waitForSelector(`.horus[data-theme="${theme}"]`, { timeout: 15000 });
          await page.evaluate(() => document.fonts?.ready);

          // 1) axe-core em todas as stories nos dois temas
          const hasAxe = await page.evaluate(() => Boolean(window.axe));
          if (!hasAxe) {
            await page.addScriptTag({ content: axeSource });
          }
          let axeResult;
          for (let attempt = 0; attempt < 40; attempt++) {
            try {
              axeResult = await page.evaluate(async () => {
                const root = document.getElementById('storybook-root') || document.body;
                return window.axe.run(root);
              });
              break;
            } catch (err) {
              if (err instanceof Error && err.message.includes('Axe is already running') && attempt < 39) {
                await page.waitForTimeout(50);
                continue;
              }
              throw err;
            }
          }

          if (axeResult.violations.length > 0) {
            for (const v of axeResult.violations) {
              const targets = v.nodes
                .slice(0, 3)
                .map((n) => `${n.target.join(' ')} (${n.failureSummary || ''})`)
                .join(' | ');
              axeFailures.push(
                `[${theme}] ${story.id} -> axe "${v.id}" (${v.impact}): ${v.help} :: ${targets}`
              );
            }
          }

          // 2) Foco por teclado (Tab) e contraste de outline >= 3:1
          const hasInteractive = await page.evaluate(() => {
            const root = document.getElementById('storybook-root');
            if (!root) return false;
            const selector = [
              'a[href]',
              'button:not(:disabled)',
              'input:not(:disabled):not([type="hidden"])',
              'select:not(:disabled)',
              'textarea:not(:disabled)',
              'summary',
              '[tabindex]:not([tabindex="-1"])',
              'video[controls]',
              'audio[controls]',
            ].join(',');
            return Array.from(root.querySelectorAll(selector)).some((el) => {
              const style = getComputedStyle(el);
              return (
                el.offsetWidth > 0 &&
                el.offsetHeight > 0 &&
                style.visibility !== 'hidden' &&
                style.display !== 'none'
              );
            });
          });

          if (!hasInteractive) continue;
          interactiveStoriesChecked++;

          // Reset focus to document body before keyboard Tab navigation
          await page.evaluate(() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          });

          const visitedIds = new Set();
          let focusedInStory = 0;

          for (let step = 0; step < MAX_TABS_PER_STORY; step++) {
            await page.keyboard.press('Tab');
            const info = await page.evaluate(() => {
              const el = document.activeElement;
              const root = document.getElementById('storybook-root');
              if (!el || !root || !root.contains(el) || el === document.body) {
                return { outside: true };
              }

              // Tag element with a temporary weak index via dataset or path
              if (!el.dataset.__focusTestId) {
                el.dataset.__focusTestId = Math.random().toString(36).slice(2);
              }

              function parseRgba(str) {
                const m = str.match(/rgba?\(([^)]+)\)/i);
                if (!m) return null;
                const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
                return {
                  r: parts[0] ?? 0,
                  g: parts[1] ?? 0,
                  b: parts[2] ?? 0,
                  a: parts.length >= 4 ? parts[3] : 1,
                };
              }

              function compositeOver(fg, bg) {
                const a = fg.a;
                return {
                  r: fg.r * a + bg.r * (1 - a),
                  g: fg.g * a + bg.g * (1 - a),
                  b: fg.b * a + bg.b * (1 - a),
                  a: 1,
                };
              }

              function getEffectiveBackground(node) {
                const layers = [];
                let cur = node.parentElement;
                while (cur) {
                  const bg = parseRgba(getComputedStyle(cur).backgroundColor);
                  if (bg && bg.a > 0) layers.push(bg);
                  cur = cur.parentElement;
                }
                let result = { r: 255, g: 255, b: 255, a: 1 };
                for (let i = layers.length - 1; i >= 0; i--) {
                  result = compositeOver(layers[i], result);
                }
                return result;
              }

              function relLuminance({ r, g, b }) {
                const toLin = (c) => {
                  const s = c / 255;
                  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
                };
                return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
              }

              function contrastRatio(c1, c2) {
                const l1 = relLuminance(c1);
                const l2 = relLuminance(c2);
                const lighter = Math.max(l1, l2);
                const darker = Math.min(l1, l2);
                return (lighter + 0.05) / (darker + 0.05);
              }

              const cs = getComputedStyle(el);
              const outlineStyle = cs.outlineStyle;
              const outlineWidth = parseFloat(cs.outlineWidth) || 0;
              const rawOutlineColor = parseRgba(cs.outlineColor);
              const bgColor = getEffectiveBackground(el);
              const outlineColor = rawOutlineColor ? compositeOver(rawOutlineColor, bgColor) : null;
              const contrast = outlineColor ? contrastRatio(outlineColor, bgColor) : 0;

              return {
                outside: false,
                id: el.dataset.__focusTestId,
                tag: el.tagName.toLowerCase(),
                text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
                outlineStyle,
                outlineWidth,
                outlineColorCss: cs.outlineColor,
                outlineAlpha: rawOutlineColor?.a ?? 0,
                bgColorRgb: `rgb(${Math.round(bgColor.r)}, ${Math.round(bgColor.g)}, ${Math.round(bgColor.b)})`,
                contrast,
              };
            });

            if (info.outside) break;
            if (visitedIds.has(info.id)) break;
            visitedIds.add(info.id);
            focusedInStory++;
            focusableElementsChecked++;

            if (
              info.outlineStyle === 'none' ||
              info.outlineStyle === 'hidden' ||
              info.outlineWidth < 1 ||
              info.outlineAlpha <= 0
            ) {
              focusFailures.push(
                `[${theme}] ${story.id} <${info.tag}> "${info.text}": outline invisível (style=${info.outlineStyle}, width=${info.outlineWidth}px, color=${info.outlineColorCss})`
              );
            } else if (info.contrast < MIN_OUTLINE_CONTRAST) {
              focusFailures.push(
                `[${theme}] ${story.id} <${info.tag}> "${info.text}": contraste do outline ${info.contrast.toFixed(2)}:1 < ${MIN_OUTLINE_CONTRAST}:1 (outline=${info.outlineColorCss}, fundo=${info.bgColorRgb})`
              );
            }
          }

          if (focusedInStory === 0) {
            focusFailures.push(
              `[${theme}] ${story.id}: story tem elementos interativos visíveis, mas Tab não focou nenhum elemento`
            );
          }
        }
      }
    } finally {
      await context.close();
    }

    assert.ok(interactiveStoriesChecked > 0, 'Nenhuma story interativa foi verificada');
    assert.ok(focusableElementsChecked > 0, 'Nenhum elemento focável foi verificado');

    const allErrors = [];
    if (focusFailures.length > 0) {
      allErrors.push(`Falhas de foco/contraste (${focusFailures.length}):\n  - ${focusFailures.join('\n  - ')}`);
    }
    if (axeFailures.length > 0) {
      allErrors.push(`Violações axe-core (${axeFailures.length}):\n  - ${axeFailures.join('\n  - ')}`);
    }
    assert.equal(allErrors.length, 0, allErrors.join('\n\n'));
  });
});
