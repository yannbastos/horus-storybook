export type BadgeState = 'active' | 'blocked' | 'unverified' | 'unavailable';

const BADGE_META: Record<BadgeState, { label: string; tone: string; meaning: string }> = {
  active: { label: 'ATIVO', tone: 'good', meaning: 'O diagnóstico confirma que está em vigor.' },
  blocked: { label: 'BLOQUEADO', tone: 'bad', meaning: 'O Hórus impede esta ação.' },
  unverified: {
    label: 'NÃO VERIFICADO',
    tone: 'warn',
    meaning: 'O diagnóstico não confirmou; nenhuma proteção é presumida.',
  },
  unavailable: {
    label: 'NÃO DISPONÍVEL',
    tone: '',
    meaning: 'Ainda não implementado nesta versão; sem controles.',
  },
};

export function StatusBadge({ state, reason }: { state: BadgeState; reason?: string }) {
  const meta = BADGE_META[state];
  return (
    <span className={`tag status-badge ${meta.tone}`.trim()} data-state={state} title={reason}>
      {meta.label}
    </span>
  );
}

export function UnverifiedBadge({ reason }: { reason?: string }) {
  return (
    <span className="unverified-badge-wrapper">
      <StatusBadge state="unverified" />
      {reason && <span className="muted small unverified-reason">{reason}</span>}
    </span>
  );
}

export function StatusLegend() {
  const states: BadgeState[] = ['active', 'blocked', 'unverified', 'unavailable'];
  return (
    <section className="status-legend" aria-labelledby="status-legend-title">
      <h2 id="status-legend-title" className="legend-title">
        Legenda dos selos
      </h2>
      <dl className="legend-list">
        {states.map(state => (
          <div key={state} className="legend-item">
            <dt>
              <StatusBadge state={state} />
            </dt>
            <dd className="muted small">{BADGE_META[state].meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SecurityWidgetsShowcase({ state }: { state: BadgeState }) {
  return (
    <div className="page">
      <section className="card" style={{ gap: 16 }}>
        <p className="eyebrow accent">SEGURANÇA E PRIVACIDADE</p>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <StatusBadge state={state} />
          <UnverifiedBadge reason="Perfil local ainda não inspecionado." />
        </div>
        <StatusLegend />
      </section>
    </div>
  );
}
