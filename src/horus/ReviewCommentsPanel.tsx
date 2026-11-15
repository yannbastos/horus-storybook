import { useState } from 'react';

export type ReviewCommentsStoryState = 'populated' | 'empty' | 'error';

type StoryComment = {
  id: string;
  artifact_sha256: string;
  at_seconds: number;
  text: string;
  author: string;
  status: 'open' | 'resolved';
  created_at: string;
  trail: Array<{
    action: 'created' | 'resolved' | 'reopened';
    author: string;
    at: string;
    note?: string;
  }>;
};

const CURRENT_SHA = '30ab612eba3e7345e9b3cae3620b672aed985aa4199473fa8416d7a79647c0b2';
const OTHER_SHA = '99ab612eba3e7345e9b3cae3620b672aed985aa4199473fa8416d7a79647c0ff';

const INITIAL_COMMENTS: StoryComment[] = [
  {
    id: 'c1',
    artifact_sha256: CURRENT_SHA,
    at_seconds: 1.5,
    text: 'Ajustar corte inicial da cena 1 para evitar pausa longa.',
    author: 'Yann',
    status: 'open',
    created_at: '15/11/2026, 10:10',
    trail: [{ action: 'created', author: 'Yann', at: '15/11/2026, 10:10' }],
  },
  {
    id: 'c2',
    artifact_sha256: OTHER_SHA,
    at_seconds: 4.25,
    text: 'Áudio estava baixo na versão anterior.',
    author: 'Ana',
    status: 'resolved',
    created_at: '15/11/2026, 09:50',
    trail: [
      { action: 'created', author: 'Ana', at: '15/11/2026, 09:50' },
      {
        action: 'resolved',
        author: 'Yann',
        at: '15/11/2026, 10:05',
        note: 'Normalizado na nova renderização.',
      },
    ],
  },
];

function formatTimecode(seconds: number): string {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe - mins * 60;
  return `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
}

function shortHash(sha: string): string {
  return `${sha.slice(0, 12)}…`;
}

export function ReviewCommentsPanelPreview({
  state = 'populated',
}: {
  state?: ReviewCommentsStoryState;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [versionFilter, setVersionFilter] = useState<'all' | string>('all');
  const [comments, setComments] = useState<StoryComment[]>(INITIAL_COMMENTS);
  const [draftText, setDraftText] = useState('');
  const [lastSeek, setLastSeek] = useState<number | null>(null);

  const visible =
    state !== 'populated'
      ? []
      : comments.filter(c => {
          if (statusFilter !== 'all' && c.status !== statusFilter) return false;
          if (versionFilter !== 'all' && c.artifact_sha256 !== versionFilter) return false;
          return true;
        });

  const openCount = comments.filter(c => c.status === 'open').length;
  const resolvedCount = comments.filter(c => c.status === 'resolved').length;

  return (
    <div className="horus-frame">
      <div
        className="info-block"
        role="region"
        aria-label="Comentários por timecode e versão"
        style={{ gap: '12px' }}
      >
        <div className="row spread" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span className="eyebrow accent">
              COMENTÁRIOS POR TIMECODE E VERSÃO (HOR-088)
            </span>
            <small className="muted" style={{ display: 'block', marginTop: '2px' }}>
              Versão em revisão: <code>{shortHash(CURRENT_SHA)}</code> · Trilha append-only
              {lastSeek !== null ? ` · Player em ${formatTimecode(lastSeek)}` : ''}
            </small>
          </div>
          <div className="row" style={{ gap: '6px', flexWrap: 'wrap' }}>
            <span className="tag warn">ABERTOS: {state === 'populated' ? openCount : 0}</span>
            <span className="tag good">RESOLVIDOS: {state === 'populated' ? resolvedCount : 0}</span>
          </div>
        </div>

        <div className="fact-item" style={{ gap: '8px' }}>
          <span className="eyebrow">
            NOVO COMENTÁRIO NA VERSÃO EM REVISÃO ({shortHash(CURRENT_SHA)})
          </span>
          <div className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <input
              aria-label="Texto do comentário por timecode"
              type="text"
              placeholder="Descreva o ajuste ou observação para este instante do vídeo…"
              value={draftText}
              onChange={e => setDraftText(e.target.value)}
              style={{ flex: '1 1 240px' }}
            />
            <button
              type="button"
              className="button primary"
              onClick={() => {
                if (!draftText.trim()) return;
                setComments(prev => [
                  ...prev,
                  {
                    id: `c-${prev.length + 1}`,
                    artifact_sha256: CURRENT_SHA,
                    at_seconds: lastSeek ?? 2.0,
                    text: draftText.trim(),
                    author: 'Operador',
                    status: 'open',
                    created_at: '15/11/2026, 10:20',
                    trail: [{ action: 'created', author: 'Operador', at: '15/11/2026, 10:20' }],
                  },
                ]);
                setDraftText('');
              }}
            >
              Adicionar comentário
            </button>
          </div>
        </div>

        <div className="row spread" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div className="row" role="group" aria-label="Filtrar comentários por status" style={{ gap: '6px' }}>
            <button
              type="button"
              className={`button sm ${statusFilter === 'all' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              Todos ({openCount + resolvedCount})
            </button>
            <button
              type="button"
              className={`button sm ${statusFilter === 'open' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'open'}
              onClick={() => setStatusFilter('open')}
            >
              Abertos ({openCount})
            </button>
            <button
              type="button"
              className={`button sm ${statusFilter === 'resolved' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'resolved'}
              onClick={() => setStatusFilter('resolved')}
            >
              Resolvidos ({resolvedCount})
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="eyebrow">Versão:</span>
            <select
              aria-label="Filtrar comentários por versão do vídeo"
              value={versionFilter}
              onChange={e => setVersionFilter(e.target.value)}
            >
              <option value="all">Todas as versões</option>
              <option value={CURRENT_SHA}>Versão em revisão ({shortHash(CURRENT_SHA)})</option>
              <option value={OTHER_SHA}>Outra versão ({shortHash(OTHER_SHA)})</option>
            </select>
          </label>
        </div>

        {state === 'error' && (
          <p className="error" role="alert">
            O arquivo de comentários desta produção está ilegível; nada foi alterado.
          </p>
        )}

        {state === 'empty' && (
          <p className="muted">Nenhum comentário encontrado para os filtros selecionados.</p>
        )}

        {state === 'populated' && visible.length > 0 && (
          <div role="list" aria-label="Lista de comentários por timecode" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {visible.map(comment => {
              const isCurrent = comment.artifact_sha256 === CURRENT_SHA;
              return (
                <div key={comment.id} role="listitem" className="fact-item" style={{ gap: '6px' }}>
                  <div className="row spread" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    <div className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="button sm"
                        onClick={() => setLastSeek(comment.at_seconds)}
                      >
                        {formatTimecode(comment.at_seconds)}
                      </button>
                      <span className={`tag ${comment.status === 'open' ? 'warn' : 'good'}`}>
                        {comment.status === 'open' ? 'ABERTO' : 'RESOLVIDO'}
                      </span>
                      <span className={`tag ${isCurrent ? 'good' : 'bad'}`}>
                        {isCurrent
                          ? `Versão em revisão (${shortHash(comment.artifact_sha256)})`
                          : `Outra versão (${shortHash(comment.artifact_sha256)})`}
                      </span>
                    </div>
                  </div>
                  {!isCurrent && (
                    <small className="error" role="note">
                      Atenção: este comentário pertence a outra versão do vídeo (SHA-256{' '}
                      <code>{shortHash(comment.artifact_sha256)}</code>), diferente da versão atual em revisão.
                    </small>
                  )}
                  <p style={{ margin: 0 }}>{comment.text}</p>
                  <small className="muted">
                    Autor: <strong>{comment.author}</strong> (human) · {comment.created_at}
                  </small>
                  <div style={{ paddingTop: '6px', borderTop: '1px solid var(--Line)' }}>
                    <span className="eyebrow">TRILHA DE DECISÕES ({comment.trail.length})</span>
                    <ol style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                      {comment.trail.map((t, idx) => (
                        <li key={idx}>
                          <small className="muted">
                            {t.action === 'created' ? 'Criado' : t.action === 'resolved' ? 'Resolvido' : 'Reaberto'} por{' '}
                            {t.author} em {t.at}
                            {t.note ? ` — "${t.note}"` : ''}
                          </small>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
