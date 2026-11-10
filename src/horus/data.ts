export const statuses = ['PENDENTE', 'EM ANDAMENTO', 'CONCLUÍDO'] as const;
const titles = ['Pauta: transformação urbana', 'Roteiro: o oceano profundo', 'Entrega: energia do futuro', 'Short: um detalhe invisível', 'Narração: caminhos da ciência', 'Revisão: cidades do amanhã'];
export const cards = titles.map((title, i) => ({ number: String(i + 1).padStart(2, '0'), title, description: 'Produção fictícia para avaliar componentes e estados do catálogo audiovisual.', status: statuses[i % 3], meta: 'DEMONSTRAÇÃO · SEM EXECUÇÃO REAL' }));
