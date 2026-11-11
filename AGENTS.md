# Instruções para agentes

Este repositório é o laboratório visual React/Storybook do HORUS. O aplicativo React/Tauri/FastAPI, com transcrição Avalonia preservada, está em outro repositório: https://github.com/yannbastos/horus.

Leia [CARTA-AO-CODEX.md](CARTA-AO-CODEX.md) para o planejamento audiovisual sobre Hermes. O usuário autorizou alinhar catálogo e aplicativo ao foco exclusivo audiovisual, preservando o design. Não conectar operações reais neste catálogo.

- Leia o README antes de alterar. Mantenha documentação em pt-BR.
- Use tokens de `src/horus/tokens.css`, fontes locais e temas claro/escuro/sistema.
- Preserve acessibilidade, responsividade e `prefers-reduced-motion`.
- Dados e telas são exemplos. Use somente exemplos de mídia, briefings, produção e canais. Não reintroduzir propostas anteriores.
- Não sincronize ou altere o aplicativo C# sem autorização.
- Para alterações de código/interface, execute `npm run build`, `npm run lint` e `npm run build-storybook` quando o ambiente permitir. Para documentação, confira diff, formatação e links, sem suites sem relação com a mudança.
- Não invente resultados de testes ou verificações visuais.
- Não escolha licença. Preserve as licenças das fontes.
- Não crie commits, faça push/merge ou crie remotos automaticamente sem autorização expressa para a tarefa ou política explícita previamente aprovada que defina repositórios, operações e branches. Pedidos pontuais anteriores não são autorização permanente.
- Quando houver fluxo Git de escrita autorizado, use uma branch por tarefa; tipos em inglês e descrições de branches e commits em português. A principal atual é `main`; confirme o estado real antes de operar.
- Peça aprovação antes de mudanças significativas de arquitetura, escopo ou dependências.

## Autonomia no catálogo

- Leia, crie, edite e reorganize arquivos pontualmente dentro da tarefa aprovada; não peça confirmação para cada ajuste rotineiro.
- Investigue problemas, implemente correções, execute checks e consulte documentação técnica quando necessário e permitido. Preserve os padrões existentes e evite mudanças desnecessárias.
- Identifique os repositórios afetados e suas instruções. O acesso a outros diretórios não autoriza alterações fora do escopo.
- Confira `git status` e `git diff` antes de editar. Não sobrescreva, descarte ou reverta alterações de terceiros; avance nas partes independentes e peça decisão se houver sobreposição impeditiva.
- Não conecte o catálogo a serviços reais, envie mensagens, execute chamadas pagas ou publique por iniciativa própria.
- Não altere configurações globais de segurança do Codex, sandbox, aprovações ou listas de comandos permitidos. Restrições reais devem ser tratadas pelo mecanismo de aprovação da ferramenta, sem contorno.

## Aprovação humana obrigatória

- Exclusão em massa, perda de dados ou operações irreversíveis no Git, incluindo force push, reset destrutivo e remoção de branches remotas.
- Mudanças na arquitetura principal, contratos entre repositórios, identidade visual ou experiência do produto fora do que já foi aprovado.
- Alterações de credenciais, permissões e configurações sensíveis.
- Publicação, deploy, releases ou alterações em produção; build local não autoriza publicação.
- Instalação/atualização de dependências com riscos relevantes ou mudanças significativas no projeto ou no ambiente global.

Se a ação já estiver expressamente autorizada no escopo vigente, não solicite a mesma aprovação novamente. Caso contrário, prepare primeiro o trabalho reversível e independente, apresente o resultado e aguarde antes da ação dependente.

## Método e conclusão

Entenda a tarefa, faça um plano curto quando for complexa e implemente por incrementos. Execute verificações pertinentes, corrija falhas do escopo, valide o resultado e atualize a documentação relacionada. Ao concluir, informe mudanças, verificações executadas e não executadas, limitações e pendências. Não apresente build aprovado como validação visual completa.
