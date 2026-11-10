# Hórus — laboratório de design

**Componentes e referências visuais para a plataforma de inteligência audiovisual Hórus.**

Catálogo independente em React, TypeScript e Storybook para explorar identidade, temas, tipografia, componentes e navegação. O produto e sua implementação desktop estão no repositório [Hórus](https://github.com/yannbastos/horus).

## Papel deste repositório

Este é um laboratório de interface, não o aplicativo operacional. As histórias apresentam exemplos de produções, fila e briefing audiovisual com dados fictícios. Elas servem como referência de design; não há Radar, produção, Hermes ou analytics conectados aqui.

O desktop principal usa React/TypeScript e Tauri 2 com backend FastAPI/SQLite. O Avalonia permanece para transcrição durante a migração. Este catálogo é separado da interface operacional.

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

## Verificar e gerar

```powershell
npm run build
npm run lint
npm run build-storybook
```

O catálogo estático fica em `storybook-static/`. `npm run dev` abre o protótipo navegável fora do Storybook.

## Fluxo de decisão

1. Comparar as histórias nos temas claro/escuro e em larguras diferentes.
2. Ajustar componentes e documentar decisões aprovadas.
3. Adaptar explicitamente à interface React do aplicativo; não há sincronização automática.

A paleta inicial em `src/horus/tokens.css` foi extraída de `HORUS App/src/Horus/Theme/Tokens.axaml`. Depois disso, mudanças não são sincronizadas automaticamente. O AXAML continua sendo a fonte dos tokens do app; este catálogo é o ambiente de experimentação.

Archivo Expanded e Geist Mono reutilizam os arquivos do próprio projeto, com licenças SIL OFL em `public/fonts/`. Inter é servido localmente pelo pacote `@fontsource/inter`. O movimento respeita `prefers-reduced-motion`.

## Observações do ambiente

A configuração global de npm desta máquina aponta para um registro corporativo e contém `allow-scripts`, incompatível com instalações locais no npm 11. A instalação foi feita com um arquivo temporário de configuração contendo apenas `registry=https://registry.npmjs.org`, sem alterar a configuração global. Se `npm ci` falhar nesse ambiente, use `npm ci --userconfig <caminho-de-um-npmrc-limpo>`.

A auditoria inicial apontou quatro avisos moderados na cadeia de desenvolvimento do Storybook (`glob`/`minimatch`). A correção automática sugerida regride a versão principal do Storybook, por isso não foi aplicada. Não há dependências dessa cadeia no executável C#.

## Repositórios

- Catálogo: https://github.com/yannbastos/horus-storybook
- Aplicativo audiovisual: https://github.com/yannbastos/horus

O catálogo fica separado do aplicativo, na pasta `HORUS Storybook`. Não depende de arquivos externos para executar ou gerar os builds.
