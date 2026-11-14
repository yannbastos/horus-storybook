# Inventário do Design System — Hórus (`horus-storybook` × `horus/frontend`)

Data de referência: 2026-11-14

Este documento registra o diagnóstico inicial do catálogo visual (`horus-storybook`) em comparação com a interface operacional do aplicativo desktop (`horus/frontend`), mapeando tokens, componentes existentes, lacunas de cobertura dos 4 estados operacionais (`loading`, `error`, `empty`, `success`), problemas de acessibilidade e a proposta de consolidação incremental sem redesign.

---

## 1. Papel e Fronteira entre os Repositórios

- **Fonte operacional vigente da identidade**: `horus/frontend/src/styles/tokens.css` e `horus/frontend/src/styles/app.css` (derivados originalmente de `src/Horus/Theme/Tokens.axaml`).
- **Papel do `horus-storybook`**: laboratório independente em React 19 + TypeScript + Storybook 10 para catalogar componentes, inspecionar os temas `light`, `dark` e `system`, validar os 4 estados operacionais com dados fictícios e auditar acessibilidade (`@storybook/addon-a11y`) sem conexão com backend, fábrica ou serviços externos.

---

## 2. Comparação de Tokens (`tokens.css`, Tipografia e Espaçamento)

### 2.1. Tokens de Cor (`src/horus/tokens.css` vs `horus/frontend/src/styles/tokens.css`)

Os 14 tokens semânticos de cor estão **100% idênticos** entre `horus-storybook/src/horus/tokens.css` e `horus/frontend/src/styles/tokens.css` nos dois temas:

| Token | Tema Escuro (`[data-theme="dark"]`) | Tema Claro (`[data-theme="light"]`) | Papel semântico na interface |
|---|---|---|---|
| `--Background` | `#111122` | `#F1F0F8` | Superfície principal de página e cards primários |
| `--Sunken` | `#0B0B18` | `#E7E6F0` | Superfície rebaixada (`sidebar`, `.fact-item`, `.info-block`, inputs, tabelas) |
| `--Ink` | `#F1F0F8` | `#19182B` | Texto principal de leitura |
| `--InkStrong` | `#FFFFFF` | `#000000` | Títulos (`h1`–`h3`) e ênfases fortes |
| `--Muted` | `#B3B1C8` | `#545168` | Rótulos secundários, metadados, cabeçalhos de tabela e descrições auxiliares |
| `--Faint` | `#9996B2` | `#625E77` | Estados desabilitados e texto terciário |
| `--Line` | `#F2F1EE26` | `#10101429` | Bordas estruturais de cards, tabelas, divisores e painéis |
| `--LineStrong` | `#F2F1EE66` | `#10101466` | Bordas de controles interativos (`.button`, `input`, `select`, `textarea`) |
| `--AccentInk` | `#AAA5FF` | `#4939B8` | Cor de destaque (foco, navegação ativa, `.eyebrow.accent`, `.tag.simulated`) |
| `--InvertBackground` | `#AAA5FF` | `#4939B8` | Fundo de ação primária (`.button.primary`, `.steps li.done`) |
| `--InvertForeground` | `#0B0B0C` | `#F1F0F8` | Texto sobre `--InvertBackground` |
| `--Good` | `#3FD6B8` | `#0A7563` | Sucesso, aprovação, check validado (`.good`, `.tag.good`, `.summary-banner.allowed`) |
| `--Warn` | `#FFC14D` | `#8A5800` | Alerta, em execução, ressalva de QC/licença (`.tag.warn`, `.tag.demo`, `.blocker-item.warning`) |
| `--Bad` | `#FF6259` | `#B3261E` | Erro, falha, bloqueio crítico (`.error`, `.tag.bad`, `.summary-banner.blocked`, `.blocker-item.critical`) |

### 2.2. Tipografia e Divergências entre `horus.css` e `app.css`

Ambos os repositórios utilizam a mesma tríade tipográfica local (`Archivo Expanded SemiBold`, `Inter 400/600` e `Geist Mono Medium`), mas apresentam divergências pontuais nas folhas de estilo:

| Aspecto | `horus-storybook/src/horus/horus.css` | `horus/frontend/src/styles/app.css` | Impacto / Observação |
|---|---|---|---|
| Import do Inter | `@fontsource/inter/400.css` e `600.css` | `@fontsource/inter/latin-400.css` e `latin-600.css` | O app carrega apenas o subset `latin` (menor bundle) |
| Cor de `h1, h2, h3` | Herda `var(--Ink)` | `color: var(--InkStrong); font-weight: 600` | No app, títulos têm contraste reforçado com `--InkStrong` |
| Escala de títulos | `h1`: `clamp(26px, 3vw, 40px)`, `h2`: `24px`, `h3`: `16px` | `h1`: `26px`, `h2`: `21px`, `h3`: `17px` | O Storybook mistura escala de landing page (`Website`) com escala desktop |
| `.eyebrow` | `11px`, `letter-spacing: 1px`, `text-transform: uppercase` | `500 10px/1.2 Geist, monospace`, `letter-spacing: 1.2px` | Pequena diferença de tamanho e tracking |
| `.tag` | `11px`, apenas variante neutra | `500 9px/1.45 Geist, monospace`, `letter-spacing: 1.2px`, com `.good`, `.warn`, `.bad`, `.simulated`, `.demo` | Variantes semânticas de status estavam ausentes no Storybook |
| `.button` | `padding: 10px 18px`, sem `min-height` explícito | `padding: 9px 20px`, `min-height: 36px`, `letter-spacing: 1.2px` | `min-height: 36px` no app garante alvo de clique consistente |

### 2.3. Espaçamento, Bordas e Movimento

- **Geometria**: cantos retos (`border-radius: 0` em botões, inputs, cards e tags) e linhas finas (`1px solid var(--Line)`).
- **Destaques de severidade**: no app operacional, banners de prontidão e bloqueadores usam `border-left: 3px solid var(--Good | --Warn | --Bad)` para sinalizar severidade sem depender apenas de cor no texto.
- **Movimento**: transições curtas (`0.14s ease`) e desativação integral sob `@media (prefers-reduced-motion: reduce)`.

---

## 3. Inventário de Componentes e Cobertura de Estados (`loading`, `error`, `empty`, `success`)

### 3.1. Componentes existentes no `horus-storybook` antes deste incremento

| Componente / Story | Arquivo | Escopo anterior | Limitações identificadas |
|---|---|---|---|
| `Button` | `src/horus/Horus.tsx` / `Components.stories.tsx` | Variantes `primary`, `secondary` e `disabled` | Sem estado `loading` (`aria-busy`), sem variante `.active`, e com bug de contraste no `:hover` de `.button.primary` |
| `Tag` | `src/horus/Horus.tsx` / `Components.stories.tsx` | Apenas tag neutra (`PENDENTE`) | Ausência das variantes semânticas `.good`, `.warn`, `.bad`, `.simulated`, `.demo` usadas em todas as telas do app |
| `ProductionCard` | `src/horus/Horus.tsx` / `Components.stories.tsx` | Card demonstrativo de grade (`01`..`06`) | Não reflete os containers operacionais `.card`, `.fact-item` e `.info-block` usados em Produção, Roteiro, Narração e Revisão |
| `Orbit` / `Hero` | `src/horus/Horus.tsx` / `Motion.stories.tsx` | Faixa de abertura com SVG orbital | Completo para abertura institucional |
| `Home`, `List`, `Briefing`, `Settings`, `Desktop` | `src/horus/Horus.tsx` / `Screens.stories.tsx` | Protótipos iniciais de navegação | Não cobriam os padrões de tabela `.data-table`, blocos `.fact-item`, banners `.summary-banner`/`.blocker-item` nos 4 estados |

### 3.2. Componentes operacionais mais usados no app adicionados ao catálogo

Na **Central de Produção**, **Roteiro**, **Narração** e **Revisão**, a interface operacional do Hórus apoia-se em cinco blocos reutilizáveis que agora contam com componentes e stories dedicados nos 4 estados (`loading`, `error`, `empty`, `success`):

1. **`StatusTag` (`.tag` + `.status-dot`)**:
   - Variantes `neutral`, `good`, `warn`, `bad`, `simulated` e `demo`.
   - Cobre estados de fila (`Na fila`, `Em execução`), validação (`Pronto para produzir`, `Aprovado na revisão final`), avisos (`Ressalva de QC`, `publishable: false`) e falhas (`Falhou`, `Bloqueado`).
2. **`ActionButton` (`.button` / ação assíncrona)**:
   - Cobre estado padrão (`idle`), em execução (`loading` com `disabled` e `aria-busy="true"`), concluído (`success`), erro recuperável (`error` com nova tentativa) e selecionado (`active`).
3. **`FactPanel` (`.fact-item` / `.info-block`)**:
   - Painel estruturado com `eyebrow`, título, metadados técnicos (ex.: hash SHA-256, provedor de voz Kokoro/SAPI, timecode, seção de roteiro) e ações contextuais nos estados `loading`, `error`, `empty` e `success`.
4. **`AlertBanner` (`.summary-banner` / `.blocker-item`)**:
   - Bloco de prontidão, diagnóstico de falha e avisos de revisão humana (`role="status"` para verificação/prontidão e `role="alert"` para erros/bloqueios críticos) nos 4 estados.
5. **`DataTable` (`.data-table-container` + `.data-table`)**:
   - Tabela operacional usada para vídeos na Central de Produção, artefatos verificados por SHA-256 e comparação de execuções, cobrindo `loading`, `error`, `empty` e `success`.

---

## 4. Problemas de Acessibilidade Identificados e Endereçados

1. **Contraste inválido em `.button.primary:hover:not(:disabled)` (Crítico — Corrigido)**:
   - **Causa**: em `src/horus/horus.css`, a regra `.button:hover:not(:disabled)` definia `background: var(--Sunken)`, enquanto `.button.primary:hover:not(:disabled)` aplicava apenas `filter: brightness(1.08)`. No tema escuro, o fundo passava para `#0B0B18` (`--Sunken`) mantendo o texto em `#0B0B0C` (`--InvertForeground`), resultando em contraste **1.00:1** (texto ilegível ao passar o mouse).
   - **Correção aplicada**: alinhado com `horus/frontend/src/styles/app.css`, preservando `background: var(--InvertBackground); color: var(--InvertForeground); border-color: var(--Ink); filter: brightness(1.08)` no hover de `.button.primary`.
2. **Anúncio de estados assíncronos para leitores de tela (`role="status"` vs `role="alert"`)**:
   - Estados de carregamento e vazio utilizam `role="status"` com `aria-live="polite"`, enquanto falhas de execução e bloqueios utilizam `role="alert"`, evitando anúncios intrusivos em estados normais e garantindo leitura imediata em falhas.
3. **Tabelas operacionais acessíveis**:
   - Toda `.data-table` inclui `aria-label` descritivo na `<table>` e `<th scope="col">` nos cabeçalhos em caixa alta (`Geist Mono`).

---

## 5. Proposta de Consolidação da Identidade Formal (Sem Redesign)

Como a identidade visual já possui paleta semântica consolidada em `tokens.css` e critérios visuais definidos em `docs/ARCHITECTURE.md` no repositório principal, propõe-se a seguinte evolução incremental (sem alterar cores, fontes ou geometria):

1. **Formalizar tokens secundários de tipografia e superfície em `tokens.css`** (após aprovação):
   - `--FontDisplay: Archivo, Inter, sans-serif;`
   - `--FontSans: Inter, sans-serif;`
   - `--FontMono: Geist, monospace;`
2. **Unificar a folha de componentes base entre `horus-storybook` e `horus/frontend`**:
   - Manter `.tag.{good,warn,bad,simulated,demo}`, `.fact-item`, `.info-block`, `.summary-banner.{allowed,blocked}`, `.blocker-item.{critical,warning}` e `.data-table` com a mesma assinatura de classes CSS nos dois repositórios.
3. **Verificação automatizada de paridade de `tokens.css`**:
   - Manter `src/horus/tokens.css` do Storybook idêntico a `frontend/src/styles/tokens.css` do aplicativo principal.
