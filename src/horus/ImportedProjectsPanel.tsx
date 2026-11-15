import { useState } from 'react';
import { StatusMessage } from './Horus';

export type ImportedProjectsStoryState =
  | 'empty'
  | 'with-detail'
  | 'import-conflict'
  | 'invalid-package';

const SAMPLE_IMPORT = {
  id: 'imp-2026-001',
  productionId: 'prod-orig-42',
  title: 'Episódio Piloto — IA Local',
  importedAt: '14/11/2026 20:15',
  horusVersion: '0.1.0',
};

export function ImportedProjectsPanelPreview({ state }: { state: ImportedProjectsStoryState }) {
  const [selected, setSelected] = useState(state === 'with-detail');
  const hasItems = state !== 'empty';

  return (
    <section
      className="card"
      aria-label="Projetos importados"
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div className="row spread" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="eyebrow">HISTÓRICO DE PACOTES EXPORTADOS</p>
          <h2>Projetos importados</h2>
          <p className="muted">
            Consulte pacotes .zip exportados anteriormente com vídeo, legendas, roteiro, QC e licenças originais.
          </p>
        </div>
        <div className="actions">
          <button type="button" className="button primary">
            Importar pacote
          </button>
          <button type="button" className="button">
            Atualizar importados
          </button>
        </div>
      </div>

      {state === 'invalid-package' && (
        <StatusMessage state="error">
          Pacote inválido: Manifesto ausente ou checksum divergente no pacote.
        </StatusMessage>
      )}

      {state === 'import-conflict' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatusMessage state="error">
            Este pacote já foi importado anteriormente.
          </StatusMessage>
          <div className="actions">
            <button type="button" className="button" onClick={() => setSelected(true)}>
              Abrir projeto já importado
            </button>
          </div>
        </div>
      )}

      {!hasItems && (
        <div className="card sunken">
          <StatusMessage state="empty" role="status">
            Nenhum projeto importado ainda. Use &quot;Importar pacote&quot; para consultar um arquivo .zip exportado.
          </StatusMessage>
        </div>
      )}

      {hasItems && (
        <ul
          aria-label="Lista de projetos importados"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          <li>
            <button
              type="button"
              className={`card ${selected ? 'selected' : ''}`}
              aria-current={selected ? 'true' : undefined}
              style={{ width: '100%', textAlign: 'left' }}
              onClick={() => setSelected(true)}
            >
              <div className="row spread" style={{ gap: 8, flexWrap: 'wrap' }}>
                <strong>{SAMPLE_IMPORT.title}</strong>
                <span className="tag warn">Importado — somente consulta</span>
              </div>
              <span className="muted">
                Importado em: {SAMPLE_IMPORT.importedAt} · Produção original: {SAMPLE_IMPORT.productionId} · Horus{' '}
                {SAMPLE_IMPORT.horusVersion}
              </span>
            </button>
          </li>
        </ul>
      )}

      {hasItems && selected && (
        <article
          className="card sunken"
          aria-label={`Detalhes do projeto importado ${SAMPLE_IMPORT.title}`}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div className="row spread" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="tag warn">Importado — somente consulta</span>
                <span className="tag">Horus {SAMPLE_IMPORT.horusVersion}</span>
              </div>
              <h3 style={{ marginTop: 8 }}>{SAMPLE_IMPORT.title}</h3>
            </div>
            <button type="button" className="button" onClick={() => setSelected(false)}>
              Fechar detalhes
            </button>
          </div>

          <div className="fact-item" role="note" aria-label="Aviso de modo somente consulta">
            <p className="eyebrow">MODO SOMENTE CONSULTA</p>
            <p className="muted">
              Este projeto é um registro histórico importado: não pode ser aprovado, reexportado nem publicado.
            </p>
          </div>

          <div className="card" aria-label="Prévia de vídeo e legendas">
            <p className="eyebrow">PRÉVIA DE VÍDEO E LEGENDAS (SOMENTE CONSULTA)</p>
            <p className="muted">Player de vídeo com legendas originais do pacote carregado.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            <section className="card" aria-label="Roteiro original">
              <p className="eyebrow">ROTEIRO ORIGINAL (HISTÓRICO)</p>
              <p className="muted">Abertura: Bem-vindo ao episódio piloto produzido localmente.</p>
            </section>
            <section className="card" aria-label="QC original">
              <p className="eyebrow">QC ORIGINAL (HISTÓRICO)</p>
              <span className="tag good">APROVADO NO QC</span>
            </section>
            <section className="card" aria-label="Licenças originais">
              <p className="eyebrow">LICENÇAS E PROVENIÊNCIA (HISTÓRICO)</p>
              <p className="muted">Trilha ambiente CC0 (CC0-1.0) · publicação bloqueada.</p>
            </section>
            <section className="card" aria-label="Revisão e manifesto">
              <p className="eyebrow">REVISÃO E MANIFESTO (HISTÓRICO)</p>
              <p className="muted">Decisão original: approve · Schema v1</p>
            </section>
          </div>
        </article>
      )}
    </section>
  );
}
