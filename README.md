# Hórus — laboratório de design

**Componentes e referências visuais para a plataforma de inteligência audiovisual Hórus.**

Catálogo independente em React, TypeScript e Storybook para explorar identidade, temas, tipografia, componentes e navegação. O produto e sua implementação desktop estão no repositório [Hórus](https://github.com/yannbastos/horus).

## Papel deste repositório

Este é um laboratório de interface, não o aplicativo operacional. As histórias apresentam exemplos de produções, fila e briefing audiovisual com dados fictícios. Elas servem como referência de design; não há Radar, produção, Hermes ou analytics conectados aqui.

O desktop principal usa React/TypeScript e Tauri 2 com backend FastAPI/SQLite (o legado C#/Avalonia foi removido em `cd365b1`). A referência visual canônica é `frontend/src/styles/tokens.css` e os componentes React do aplicativo. Este catálogo é separado da interface operacional.

A produção será executada pela [fábrica Python independente](https://github.com/yannbastos/fabrica-canais). O catálogo não executa operações reais nem contém backend de produção.

## Executar

Requer Node.js 24 e npm.

```powershell
cd "HORUS Storybook"
npm ci
npm run storybook
```

Abra http://localhost:6006. A barra superior oferece Sistema, Claro e Escuro. O painel Controls permite editar as propriedades dos componentes. A aba Accessibility oferece inspeção automatizada; isso não substitui revisão manual.

- **Fundamentos:** paleta, tipografia e temas lado a lado.
- **Componentes:** botões, estados, tag, card e faixa de abertura.
- **Movimento:** olho orbital com entrada finita e versão estática.
- **Telas:** Início, Produção, Briefing, Ajustes e aplicativo navegável.
- **Site:** proposta visual, sem publicação ou funcionalidades prometidas.

Os dados são fictícios. Busca, filtros, navegação e controles são interações locais de demonstração, sem banco de dados. Os botões não acionam a fábrica ou serviços pagos.

## Verificar, testar e gerar

```powershell
npm run build
npm run lint
npm run build-storybook
npm test
```

O catálogo estático fica em `storybook-static/`. `npm run dev` abre o protótipo navegável fora do Storybook.

`npm test` executa `lint`, `build`, a verificação estática de escopo de variáveis CSS (`npm run test:tokens`), `build-storybook` e a suíte Playwright sobre `storybook-static/` (`npm run test:storybook`), cobrindo:

- **Escopo de tokens CSS (`tests/css-tokens.test.mjs`):** garante que todo `var(--X)` em `src/**/*.css` esteja definido no escopo em que é resolvido (falhando, por exemplo, se `:root` referenciar tokens exclusivos de `[data-theme="light"]`/`[data-theme="dark"]`).
- **Foco por teclado e contraste (`tests/storybook.test.mjs`):** navega por `Tab` nos componentes interativos de cada story nos temas claro e escuro e exige outline visível com contraste ≥ 3:1 contra o fundo efetivo.
- **Acessibilidade com axe-core (`tests/storybook.test.mjs`):** executa `axe-core` em todas as stories nos temas claro e escuro.

Se os binários do Chromium do Playwright ainda não estiverem instalados nesta máquina, execute `npx playwright install chromium`.

## Fluxo de decisão

1. Comparar as histórias nos temas claro/escuro e em larguras diferentes.
2. Ajustar componentes e documentar decisões aprovadas.
3. Adaptar explicitamente à interface React do aplicativo; não há sincronização automática.

Os tokens em `src/horus/tokens.css` seguem a referência canônica de `frontend/src/styles/tokens.css` e dos componentes React do aplicativo principal (o legado C#/Avalonia foi removido em `cd365b1`). Mudanças não são sincronizadas automaticamente entre os repositórios; este catálogo é o ambiente de experimentação e documentação do design system.

Archivo Expanded e Geist Mono reutilizam os arquivos do próprio projeto, com licenças SIL OFL em `public/fonts/`. Inter é servido localmente pelo pacote `@fontsource/inter`. O movimento respeita `prefers-reduced-motion`.

## Observações do ambiente

A configuração global de npm desta máquina aponta para um registro corporativo e contém `allow-scripts`, incompatível com instalações locais no npm 11. A instalação foi feita com um arquivo temporário de configuração contendo apenas `registry=https://registry.npmjs.org`, sem alterar a configuração global. Se `npm ci` falhar nesse ambiente, use `npm ci --userconfig <caminho-de-um-npmrc-limpo>`.

A auditoria inicial apontou quatro avisos moderados na cadeia de desenvolvimento do Storybook (`glob`/`minimatch`). A correção automática sugerida regride a versão principal do Storybook, por isso não foi aplicada. Não há dependências dessa cadeia no aplicativo operacional React/Tauri/FastAPI.

## Repositórios

- Catálogo: https://github.com/yannbastos/horus-storybook
- Aplicativo audiovisual: https://github.com/yannbastos/horus

O catálogo fica separado do aplicativo, na pasta `HORUS Storybook`. Não depende de arquivos externos para executar ou gerar os builds.
