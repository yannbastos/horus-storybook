export type SectionInfo = {
  caption: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  features: [string, string][];
};

export const DEMO_SECTION: SectionInfo = {
  caption: '06 / HISTÓRICO OPERACIONAL',
  title: 'Cada produção deixa um registro.',
  description: 'Execuções, revisões e decisões da operação audiovisual.',
  emptyTitle: 'Rastreie o caminho até a entrega.',
  emptyDescription:
    'Esta área consolidada ainda não está integrada. As tarefas técnicas e seus logs já podem ser consultados em Produção.',
  features: [
    ['Execuções', 'Etapas, falhas e novas tentativas por vídeo.'],
    ['Revisões', 'Decisões editoriais associadas à versão aprovada.'],
    ['Resultados', 'Custos e métricas das produções, quando disponíveis.'],
  ],
};

export function SectionHeaderPreview({ section }: { section: SectionInfo }) {
  return (
    <div className="section-heading">
      <p className="eyebrow accent">{section.caption}</p>
      <h1>{section.title}</h1>
      <p className="muted description">{section.description}</p>
    </div>
  );
}

export function SectionEmptyPreview({ section }: { section: SectionInfo }) {
  return (
    <div className="page">
      <SectionHeaderPreview section={section} />
      <div className="empty-state">
        <span className="tag">PRÉVIA DE LAYOUT · EM PREPARAÇÃO</span>
        <h2>{section.emptyTitle}</h2>
        <p className="muted">{section.emptyDescription}</p>
      </div>
      <p className="eyebrow">O QUE ESTE ESPAÇO VAI REUNIR</p>
      <div className="three-columns">
        {section.features.map(([title, description]) => (
          <article key={title} className="card">
            <h3>{title}</h3>
            <p className="muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
