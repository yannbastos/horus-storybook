# Inventário do Design System — Hórus (`horus-storybook` × `horus/frontend`)

Data de referência: 2026-11-14

Este documento registra o diagnóstico inicial do catálogo visual (`horus-storybook`) em comparação com a interface operacional do aplicativo desktop (`horus/frontend`), mapeando tokens, componentes existentes, lacunas de cobertura dos 4 estados operacionais (`loading`, `error`, `empty`, `success`), problemas de acessibilidade e a proposta de consolidação incremental sem redesign.

---

## 1. Papel e Fronteira entre os Repositórios

- **Fonte operacional vigente da identidade**: `horus/frontend/src/styles/tokens.css`, `horus/frontend/src/styles/app.css` e os componentes React em `horus/frontend/src/components/` (o legado C#/Avalonia foi removido do repositório principal em `cd365b1`, HOR-010).
- **Papel do `horus-storybook`**: laboratório independente em React 19 + TypeScript + Storybook 10 para catalogar componentes, inspecionar os temas `light`, `dark` e `system`, validar os 4 estados operacionais (`loading`, `error`, `empty`, `success` — alinhados com `StatusMessage.tsx`) com dados fictícios e auditar acessibilidade (`@storybook/addon-a11y`) sem conexão com backend, fábrica ou serviços externos.

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

### 2.3. Tokens de Tipografia e Escala de Espaçamento (`:root` em `tokens.css`)

Além dos 14 tokens de cor por tema, `tokens.css` documenta formalmente a tríade tipográfica, a escala de texto e a escala de espaçamento:

- **Famílias tipográficas**:
  - `--FontDisplay: Archivo, Inter, sans-serif` (títulos `h1`–`h4` e marca `HORUS`)
  - `--FontSans: Inter, sans-serif` (corpo de leitura, roteiros e transcrições)
  - `--FontMono: Geist, monospace` (`.eyebrow`, `.tag`, `.button`, hashes SHA-256, timecodes e `.logs`)
- **Escala tipográfica**:
  - `--TextH1: 26px` · `--TextH2: 21px` · `--TextH3: 17px` · `--TextH4: 15px`
  - `--TextBody: 14px` · `--TextMeta: 12px` · `--TextCode: 11px` · `--TextSm: 10px` · `--TextXs: 9px`
- **Escala de espaçamento**:
  - `--Space1: 4px` · `--Space2: 6px` · `--Space3: 8px` · `--Space4: 10px` · `--Space5: 12px` · `--Space6: 14px`
  - `--Space7: 16px` · `--Space8: 20px` · `--Space9: 24px` · `--Space10: 28px` · `--Space11: 32px` · `--Space12: 36px`
- **Geometria e movimento**:
  - Cantos retos (`border-radius: 0` em botões, inputs, cards e tags) e linhas finas (`1px solid var(--Line)`).
  - Destaques de severidade com `border-left: 3px solid var(--Good | --Warn | --Bad)`.
  - Transições curtas (`0.14s ease`) e desativação integral sob `@media (prefers-reduced-motion: reduce)`.

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

### 3.3. Incremento 2 — Componentes do Fluxo de Produção e Revisão (4 estados) e Alinhamento Tipográfico

No segundo incremento (`FlowComponents.tsx` / `FlowComponents.stories.tsx`), todas as divergências tipográficas e de escala apontadas na seção 2.2 foram resolvidas adotando a fonte do app (`@fontsource/inter/latin-400.css` e `latin-600.css`, `h1`–`h4` em `--InkStrong` com escala `26px`/`21px`/`17px`, `.eyebrow` `10px/1.2` com `letter-spacing: 1.2px`, `.tag` `9px/1.45` e `.button` `min-height: 36px`), e foram adicionadas stories nos 4 estados (`loading`, `error`, `empty`, `success`) para os 6 componentes restantes do fluxo:

1. **Editor de Roteiro (`ScriptEditorPanel`)**:
   - Seção com cabeçalho, narração, direção visual, fontes vinculadas, contadores de palavras/caracteres e validação acionável (`422`).
2. **Linha de Voz com Prévia (`VoicePreviewRowPanel`)**:
   - Seleção de voz local (`Kokoro-82M · pf_dora`) com botão `Ouvir amostra`, estado `Gerando amostra…` (`aria-busy`), prévia WAV auditável e tratamento de falha de síntese.
3. **Painel de Qualidade Técnica — QC (`QualityReportPanelDemo`)**:
   - Inspeção de `quality-report.json` com checks `fail`, `warn` e `pass`, explicação em linguagem simples por check, método (`measured`) e botões de navegação por timecode.
4. **Painel de Licenças e Proveniência (`LicenseProvenancePanelDemo`)**:
   - Tabela de assets de `asset-provenance.json` (`local_tts_model`, `original_local`) com licença declarada, uso comercial (`allowed`/`unknown`), status (`verified`/`rejected`) e trilha humana.
5. **Progresso da Produção (`ProductionProgressPanelDemo`)**:
   - Trilha horizontal das 7 etapas (`Preparação`, `Narração`, `Cenas`, `Legendas`, `Render`, `Qualidade (QC)`, `Revisão`) com tempo decorrido e último evento do job.
6. **Bloco de Diagnóstico de Falha (`FailureDiagnosticsPanelDemo`)**:
   - Alerta acionável com `<details className="failure-diagnostics">`, metadados (`stage`, `code`, `duration`, `exit_code`), `stderr_tail` em `.logs` e cópia para a área de transferência.

### 3.4. Incremento 3 — Alinhamento com `StatusMessage` e Cobertura Integral do Fluxo de Produção

Neste incremento (`chore-hor-135-avalonia-cleanup-and-tokens`), o catálogo foi completado com:

0. **Componente `StatusMessage` (`StatusMessage` / `StatusMessagePanel`)**:
   - Paridade 1:1 com `horus/frontend/src/components/StatusMessage.tsx` nos 4 estados (`loading` com `role="status"` + `aria-live="polite"`, `error` com `role="alert"`, `empty` e `success`), modos inline (`<p>`) e em bloco (`eyebrow` em `.fact-item`), e tons `muted`, `good` e `plain`.
7. **Guia Meu Primeiro Vídeo (`FirstVideoGuideDemo`)**:
   - Checklist guiado das 4 etapas do primeiro vídeo (ambiente/voz, roteiro, produção e revisão) nos 4 estados operacionais.
8. **Filtros da Central e Avisos de Produção (`CenterFiltersAndNoticeDemo`)**:
   - Filtro por etapa/bloqueio e banner `.production-notice.{succeeded,failed,interrupted}` nos 4 estados.
9. **Comparar Versões do Roteiro (`ScriptComparePanelDemo`)**:
   - Comparação `v1 vs v2` com diff semântico de palavras (`.diff-added`, `.diff-removed`) e `.compare-grid` nos 4 estados.
10. **Voz e Qualidade do Piloto Local (`ProductionLaunchOptionsDemo`)**:
    - Seleção de provedor/voz local, tags de licença (`Apache-2.0`, uso comercial) e qualidade (`540×960` vs `1080×1920`) nos 4 estados.
11. **Revisão por Timecode e Linha de Palavras (`TimecodeReviewWorkspaceDemo`)**:
    - Navegação sincronizada por cenas, legendas, palavras (`word-timings.json`) e notas por segundo nos 4 estados.
12. **Comparação de Produções e Glossário (`ProductionComparePanelDemo`)**:
    - Tabela comparativa entre execuções (`.compare-row-changed`) e glossário técnico (`publishable`, `sha256`, `real_voice`, `speech_aligned`) nos 4 estados.
13. **Exportação Auditável Local (`ProductionExportPanelDemo`)**:
    - Geração de thumbnail `1080×1920`, metadados determinísticos com fontes/divulgações fixas e pacote ZIP verificado por SHA-256 nos 4 estados.

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

---

## 6. Auditoria v2 (HOR-135): Tokens completos, valores soltos e divergências

### 6.1. Auditoria de Tokens (`tokens.css` × `app.css` × `horus.css`)

| Categoria | Estado anterior | Padronização v2 (`tokens.css`) |
|---|---|---|
| **Cor** | 14 tokens semânticos idênticos nos temas `dark` e `light` | Mantidos 100%; 0 cores hex/rgba soltas no Storybook e no `horus/frontend` (`#123`/`#125` em `TimecodeReviewWorkspace.tsx` são identificadores de cena, não cores) |
| **Tipografia (`--Font*`, `--Text*`)** | `--FontDisplay`, `--FontSans`, `--FontMono` e `--TextXs`..`--TextH1` declarados, porém com literais `px` e `font-family: Geist, monospace` / `Inter, sans-serif` em `app.css`, `horus.css` e estilos inline (`fontSize: '10px'`/`'11px'`/`12`) | Substituição progressiva por `var(--Font*)` e `var(--Text*)` |
| **Espaçamento (`--Space*`)** | `--Space1` (4px) .. `--Space12` (36px) declarados; `app.css` tinha ~210 linhas com `px`, `narration.css` 8 linhas, `horus.css` ~116 linhas, além de estilos inline (`gap`, `marginTop`, `padding`) | Substituição por `var(--Space*)` e classes utilitárias/estruturais |
| **Raio** | Ausente de `tokens.css`; literais `border-radius: 0` e `50%` | Formalizados `--RadiusNone: 0px` e `--RadiusFull: 9999px` |
| **Sombra** | Ausente de `tokens.css`; `box-shadow` apenas em transição de input no `app.css` | Formalizado `--ShadowNone: none` |
| **Foco** | Ausente de `tokens.css`; literal `outline: 2px solid var(--AccentInk); outline-offset: 3px` | Formalizados `--FocusRingWidth: 2px`, `--FocusRingOffset: 3px`, `--FocusRingColor: var(--AccentInk)` |
| **Movimento** | Ausente de `tokens.css`; literais `.14s ease` e `.18s` | Formalizados `--MotionFast: 140ms`, `--MotionBase: 180ms`, `--MotionEase: ease`, `--MotionTransition: 140ms ease` (desativados sob `prefers-reduced-motion: reduce`) |

### 6.2. Valores soltos e padrões repetidos levantados

- **Botão compacto repetido inline**: `style={{ padding: '4px 10px', minHeight: '28px', fontSize: '10px' }}` duplicado em `ProductionCompare.tsx`, `QualityReportPanel.tsx`, `ScriptEditor.tsx`, `ScriptReview.tsx`, `FlowComponents.tsx` e `Horus.tsx` → padronizado como `.button.sm`.
- **Estilos inline de fonte**: `fontFamily: 'Geist, monospace', fontSize: '11px'` em `AssetProvenancePanel.tsx` e `AssetReviewForm.tsx` → substituir por classe CSS com `var(--FontMono)` e `var(--TextCode)`.
- **Espaçamentos inline repetidos**: `gap: 8/10/12/14/16`, `marginTop: '4px'/'8px'/'12px'` em telas (`EditorialWorkflows`, `PrivacySecurity`, `ProductionExportPanel`, `ScriptReview`, `Settings`, `WhisperModelsPanel`, `ReadinessPanel`).

### 6.3. Componentes duplicados ou divergentes (`horus` × `horus-storybook`)

1. **`StatusMessage`**: `horus/frontend/src/components/StatusMessage.tsx` possuía prop `ariaLabel` ausente no `Horus.tsx` do Storybook → alinhado 1:1.
2. **`Button`**: `app.css` e `Horus.tsx` não tinham variantes `.button.danger`, `.button.sm` nem estado `loading` (`aria-busy="true"`) padronizados → adicionados ao Design System v2.
3. **Campos de formulário, Listas, Abas e Diálogos**: existiam apenas como estilos locais dispersos (`label`, `.queue`, `.settings-tabs`, sem diálogo modal padronizado) → padronizados em `DesignSystem.tsx`, `DesignSystem.stories.tsx` e `DesignSystem.mdx`.
4. **Painéis espelhados**: `ReadinessPanel`, `WhisperModelsPanel`, `SecurityWidgets` e `Sections` possuem cópias de catálogo no Storybook com dados fictícios (mantidos isolados do backend por fronteira arquitetural).

