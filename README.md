# Hórus — laboratório de design

**Componentes e referências visuais para a plataforma de inteligência audiovisual Hórus.**

Catálogo independente em React, TypeScript e Storybook para explorar identidade, temas, tipografia, componentes e navegação. O produto e sua implementação desktop estão no repositório [Hórus](https://github.com/yannbastos/horus).

## Papel deste repositório

Este é um laboratório de interface, não o aplicativo operacional. As histórias atuais ainda incluem demonstrações da proposta original de estudos. Elas servem como referência de design; não há Radar, produção, Hermes ou analytics conectados aqui.

O desktop atual usa C#/Avalonia. A primeira prévia audiovisual do desktop está na [branch de layout do Hórus](https://github.com/yannbastos/horus/tree/feat/layout-desktop-audiovisual), não neste catálogo. Componentes React não são incorporados automaticamente ao executável C#.

O planejamento da plataforma preserva [a fábrica Python independente](https://github.com/yannbastos/fabrica-canais) e [a base de estudos](https://github.com/yannbastos/estudos-videos-claude). Uma eventual migração da interface precisa ser decidida e validada; este repositório não comprova essa migração.

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
- **Telas:** Início, Lista, Leitura, Ajustes e aplicativo navegável.
- **Site:** proposta visual, sem publicação ou funcionalidades prometidas.

Os dados são fictícios. Busca, filtros, navegação e controles são interações locais de demonstração, sem banco de dados. As ações de estudo não executam operações reais.

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
3. Adaptar explicitamente para AXAML/C#; React não é incorporado ao aplicativo.

A paleta inicial em `src/horus/tokens.css` foi extraída de `HORUS App/src/Horus/Theme/Tokens.axaml`. Depois disso, mudanças não são sincronizadas automaticamente. O AXAML continua sendo a fonte dos tokens do app; este catálogo é o ambiente de experimentação.

Archivo Expanded e Geist Mono reutilizam os arquivos do próprio projeto, com licenças SIL OFL em `public/fonts/`. Inter é servido localmente pelo pacote `@fontsource/inter`. O movimento respeita `prefers-reduced-motion`.

## Observações do ambiente

A configuração global de npm desta máquina aponta para um registro corporativo e contém `allow-scripts`, incompatível com instalações locais no npm 11. A instalação foi feita com um arquivo temporário de configuração contendo apenas `registry=https://registry.npmjs.org`, sem alterar a configuração global. Se `npm ci` falhar nesse ambiente, use `npm ci --userconfig <caminho-de-um-npmrc-limpo>`.

A auditoria inicial apontou quatro avisos moderados na cadeia de desenvolvimento do Storybook (`glob`/`minimatch`). A correção automática sugerida regride a versão principal do Storybook, por isso não foi aplicada. Não há dependências dessa cadeia no executável C#.

## Repositórios

- Catálogo: https://github.com/yannbastos/horus-storybook
- Aplicativo C#/Avalonia: https://github.com/yannbastos/horus

O catálogo fica separado do aplicativo, na pasta `HORUS Storybook`. Não depende de arquivos externos para executar ou gerar os builds.
