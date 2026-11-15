import { useState } from 'react';

export type ErrorCenterStoryState = 'populated' | 'empty' | 'error' | 'disconnected';

type StoryErrorItem = {
  id: string;
  kind: 'production' | 'workflow_step' | 'job';
  status: 'failed' | 'blocked' | 'interrupted';
  code: string;
  stage: string;
  at: string;
  title: string;
  message_pt: string;
  suggested_action_pt: string;
  refLabel: string;
  duration_seconds: number | null;
  exit_code: number | null;
};

const STORY_ITEMS: StoryErrorItem[] = [
  {
    id: 'production:prod-101',
    kind: 'production',
    status: 'failed',
    code: 'render_failed',
    stage: 'render',
    at: '15/11/2026, 08:15',
    title: 'Falha no render',
    message_pt: 'A produção prod-101 falhou na etapa «render». Falha no render.',
    suggested_action_pt: 'Abra o Diagnóstico técnico da produção e crie nova produção após corrigir a causa.',
    refLabel: 'Abrir produção',
    duration_seconds: 18.4,
    exit_code: 1,
  },
  {
    id: 'workflow_step:step-202',
    kind: 'workflow_step',
    status: 'blocked',
    code: 'workflow_step_blocked',
    stage: 'analysis',
    at: '15/11/2026, 07:50',
    title: 'Etapa da análise bloqueada',
    message_pt: 'A etapa da análise step-202 foi bloqueado na etapa «analysis». Etapa da análise bloqueada.',
    suggested_action_pt: 'Abra a análise, confira a causa mostrada e use «tentar de novo».',
    refLabel: 'Abrir workflow',
    duration_seconds: null,
    exit_code: null,
  },
  {
    id: 'job:job-303',
    kind: 'job',
    status: 'interrupted',
    code: 'factory_interrupted',
    stage: 'prepare',
    at: '15/11/2026, 07:20',
    title: 'Operação da fábrica interrompida',
    message_pt: 'A tarefa job-303 foi interrompido na etapa «prepare». Operação da fábrica interrompida.',
    suggested_action_pt: 'Repita a operação.',
    refLabel: 'Abrir tarefa',
    duration_seconds: 4.2,
    exit_code: 130,
  },
];

const KIND_LABELS: Record<string, string> = {
  production: 'Produção',
  workflow_step: 'Etapa da análise',
  job: 'Tarefa',
};

const STATUS_LABELS: Record<string, string> = {
  failed: 'FALHOU',
  blocked: 'BLOQUEADO',
  interrupted: 'INTERROMPIDO',
};

const STAGE_LABELS: Record<string, string> = {
  render: 'Render',
  analysis: 'Análise',
  prepare: 'Preparação',
};

export function ErrorCenterPreview({ state = 'populated' }: { state?: ErrorCenterStoryState }) {
  const [codeFilter, setCodeFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  if (state === 'disconnected') {
    return (
      <section className="error-center" aria-labelledby="story-error-center-title">
        <div className="error-center-header">
          <div>
            <p className="eyebrow accent">DIAGNÓSTICO AGREGADO</p>
            <h2 id="story-error-center-title">Central de erros</h2>
          </div>
        </div>
        <p className="muted" role="status">
          Conecte o backend local em Ajustes para consultar a Central de erros.
        </p>
      </section>
    );
  }

  const filtered = state === 'populated'
    ? STORY_ITEMS.filter(item => (!codeFilter || item.code === codeFilter) && (!stageFilter || item.stage === stageFilter))
    : [];

  return (
    <section className="error-center" aria-labelledby="story-error-center-title">
      <div className="error-center-header">
        <div>
          <p className="eyebrow accent">DIAGNÓSTICO AGREGADO</p>
          <h2 id="story-error-center-title">Central de erros</h2>
          <p className="muted">
            Falhas, bloqueios e interrupções registrados em produções, workflows e tarefas locais, com ação sugerida.
          </p>
        </div>
        <div className="actions">
          <button type="button" className="button">Atualizar</button>
          {(codeFilter || stageFilter) && (
            <button
              type="button"
              className="button"
              onClick={() => {
                setCodeFilter('');
                setStageFilter('');
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {state === 'populated' && (
        <div className="error-center-summary" aria-label="Resumo de falhas por causa e etapa">
          <article className="card error-center-kpi">
            <p className="eyebrow">TOTAL NO PERÍODO</p>
            <p className="error-center-total">{STORY_ITEMS.length}</p>
            <p className="muted">Ocorrências registradas</p>
          </article>
          <article className="card error-center-breakdown">
            <p className="eyebrow">POR CAUSA</p>
            <div className="error-center-chips" role="group" aria-label="Filtrar por causa">
              {STORY_ITEMS.map(item => {
                const active = codeFilter === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    className={`error-center-chip${active ? ' active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setCodeFilter(prev => (prev === item.code ? '' : item.code))}
                  >
                    <span>{item.title}</span>
                    <span className="tag">1</span>
                  </button>
                );
              })}
            </div>
          </article>
          <article className="card error-center-breakdown">
            <p className="eyebrow">POR ETAPA</p>
            <div className="error-center-chips" role="group" aria-label="Filtrar por etapa">
              {(['render', 'analysis', 'prepare'] as const).map(stage => {
                const active = stageFilter === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    className={`error-center-chip${active ? ' active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setStageFilter(prev => (prev === stage ? '' : stage))}
                  >
                    <span>{STAGE_LABELS[stage]}</span>
                    <span className="tag">1</span>
                  </button>
                );
              })}
            </div>
          </article>
        </div>
      )}

      {state === 'error' && (
        <div className="card">
          <p className="error" role="alert">Falha ao consultar GET /v1/errors (HTTP 500).</p>
          <div className="actions">
            <button type="button" className="button">Tentar novamente</button>
          </div>
        </div>
      )}

      {state === 'empty' && (
        <div className="empty-state">
          <span className="tag good">OPERAÇÃO ESTÁVEL</span>
          <h3>Nenhuma falha registrada</h3>
          <p className="muted">As execuções recentes não registraram falhas, bloqueios ou interrupções.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="error-center-list" aria-label="Lista de falhas">
          {filtered.map(item => (
            <article key={item.id} className="card error-center-item">
              <div className="error-center-item-top">
                <div className="error-center-item-badges">
                  <span className={item.status === 'failed' ? 'tag bad' : 'tag warn'}>
                    {STATUS_LABELS[item.status]}
                  </span>
                  <span className="tag">{KIND_LABELS[item.kind]}</span>
                  <span className="tag">{STAGE_LABELS[item.stage]}</span>
                </div>
                <span className="muted error-center-time">{item.at}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.message_pt}</p>
              <div className="error-center-action-callout">
                <p className="eyebrow accent">AÇÃO SUGERIDA</p>
                <p>{item.suggested_action_pt}</p>
              </div>
              <div className="error-center-item-footer">
                <div className="error-center-meta muted">
                  <code>{item.code}</code>
                  {item.duration_seconds !== null && <span>· {item.duration_seconds.toFixed(1)} s</span>}
                  {item.exit_code !== null && <span>· Código de saída: {item.exit_code}</span>}
                </div>
                <button type="button" className="button primary">{item.refLabel}</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
