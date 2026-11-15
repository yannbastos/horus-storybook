import { useState } from 'react';
import { StatusMessage } from './Horus';

export type NotificationsStoryState = 'populated' | 'filtered-empty' | 'loading' | 'error' | 'empty';

export type StoryNotificationItem = {
  id: string;
  kind: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  at: string;
  ref: { kind: 'production' | 'script' | 'workflow'; id: string };
  pending: boolean;
  read: boolean;
};

const KIND_LABELS: Record<string, string> = {
  'production.succeeded': 'Produção concluída',
  'production.failed': 'Falha na produção',
  'production.interrupted': 'Produção interrompida',
  'script.awaiting_review': 'Roteiro aguardando revisão',
  'workflow.awaiting_approval': 'Workflow aguardando aprovação',
  'workflow.awaiting_authorization': 'Workflow aguardando autorização',
};

const KIND_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'production.succeeded', label: KIND_LABELS['production.succeeded'] },
  { value: 'production.failed', label: KIND_LABELS['production.failed'] },
  { value: 'production.interrupted', label: KIND_LABELS['production.interrupted'] },
  { value: 'script.awaiting_review', label: KIND_LABELS['script.awaiting_review'] },
  { value: 'workflow.awaiting_approval', label: KIND_LABELS['workflow.awaiting_approval'] },
  { value: 'workflow.awaiting_authorization', label: KIND_LABELS['workflow.awaiting_authorization'] },
];

const INITIAL_ITEMS: StoryNotificationItem[] = [
  {
    id: 'notif-1',
    kind: 'workflow.awaiting_approval',
    severity: 'warning',
    title: 'Proposta aguardando aprovação',
    message: 'Revise a proposta editorial antes de gerar o roteiro.',
    at: '2026-11-14T10:15:00Z',
    ref: { kind: 'workflow', id: 'wf-01' },
    pending: true,
    read: false,
  },
  {
    id: 'notif-2',
    kind: 'script.awaiting_review',
    severity: 'info',
    title: 'Roteiro pronto para revisão',
    message: 'A versão 1 do roteiro aguarda sua decisão editorial.',
    at: '2026-11-14T10:10:00Z',
    ref: { kind: 'script', id: 'sc-01' },
    pending: true,
    read: false,
  },
  {
    id: 'notif-3',
    kind: 'production.failed',
    severity: 'error',
    title: 'Falha na produção',
    message: 'FFmpeg retornou código 1 durante a sobreposição de legendas.',
    at: '2026-11-14T10:06:00Z',
    ref: { kind: 'production', id: 'pr-01' },
    pending: false,
    read: false,
  },
  {
    id: 'notif-4',
    kind: 'production.succeeded',
    severity: 'success',
    title: 'Produção concluída',
    message: 'Render de rascunho finalizado e pronto para revisão.',
    at: '2026-11-14T10:05:00Z',
    ref: { kind: 'production', id: 'pr-02' },
    pending: false,
    read: true,
  },
];

function severityTagClass(severity: StoryNotificationItem['severity']): string {
  if (severity === 'success') return 'tag good';
  if (severity === 'error') return 'tag bad';
  if (severity === 'warning') return 'tag warn';
  return 'tag';
}

function getNavigateActionLabel(refKind: StoryNotificationItem['ref']['kind']): string {
  if (refKind === 'production') return 'Abrir produção';
  if (refKind === 'script') return 'Abrir roteiro';
  return 'Abrir workflow';
}

export function NotificationsCenterPreview({
  state = 'populated',
}: {
  state?: NotificationsStoryState;
}) {
  const [items, setItems] = useState<StoryNotificationItem[]>(() =>
    state === 'populated' ? INITIAL_ITEMS : [],
  );
  const [unreadOnly, setUnreadOnly] = useState(state === 'filtered-empty');
  const [kindFilter, setKindFilter] = useState(
    state === 'filtered-empty' ? 'production.interrupted' : '',
  );
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const visibleItems =
    state === 'populated'
      ? items.filter(item => {
          if (unreadOnly && item.read) return false;
          if (kindFilter && item.kind !== kindFilter) return false;
          return true;
        })
      : [];

  const unreadCount =
    state === 'populated' ? items.filter(item => !item.read).length : 0;

  return (
    <div className="horus" style={{ padding: 24, display: 'grid', gap: 16 }}>
      <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="notifications-bell-button"
          aria-expanded="true"
        >
          <span className="notifications-bell-label">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2a4 4 0 0 0-4 4v2.6L2.7 10.7a.5.5 0 0 0 .43.75h9.74a.5.5 0 0 0 .43-.75L12 8.6V6a4 4 0 0 0-4-4Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 12.2a1.6 1.6 0 0 0 3 0"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span>Notificações</span>
          </span>
          {unreadCount > 0 && (
            <>
              <span className="notifications-badge">{unreadCount}</span>
              <span className="sr-only">
                {` não ${unreadCount === 1 ? 'lida' : 'lidas'}`}
              </span>
            </>
          )}
        </button>
      </div>

      <section
        className="notifications-panel"
        style={{ width: '100%', maxWidth: 560, height: 'auto', border: '1px solid var(--LineStrong)' }}
        aria-labelledby="story-notifications-title"
      >
        <header className="notifications-panel-header">
          <div className="notifications-panel-heading">
            <div>
              <p className="eyebrow accent">CENTRAL DE NOTIFICAÇÕES</p>
              <div className="row" style={{ gap: 8, marginTop: 4 }}>
                <h2 id="story-notifications-title">Notificações</h2>
                {unreadCount > 0 && (
                  <span className="tag warn">
                    {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                  </span>
                )}
              </div>
            </div>
            <div className="actions">
              <button
                type="button"
                className="button"
                disabled={unreadCount === 0}
                onClick={() => {
                  setItems(prev => prev.map(item => ({ ...item, read: true })));
                  setLiveAnnouncement('Todas as notificações marcadas como lidas.');
                }}
              >
                Marcar todas como lidas
              </button>
            </div>
          </div>

          <div className="notifications-filters" role="group" aria-label="Filtros de notificações">
            <button
              type="button"
              className={`button${unreadOnly ? ' active' : ''}`}
              aria-pressed={unreadOnly}
              onClick={() => setUnreadOnly(prev => !prev)}
            >
              Somente não lidas
            </button>
            <label className="notifications-kind-filter">
              <span className="sr-only">Filtrar por tipo</span>
              <select
                aria-label="Filtrar por tipo"
                value={kindFilter}
                onChange={event => setKindFilter(event.target.value)}
              >
                {KIND_OPTIONS.map(option => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        <div className="notifications-panel-body">
          {state === 'loading' && (
            <StatusMessage state="loading">Carregando notificações…</StatusMessage>
          )}
          {state === 'error' && (
            <div className="notifications-error-box">
              <StatusMessage state="error">
                Não foi possível carregar as notificações (500).
              </StatusMessage>
              <button type="button" className="button">
                Tentar novamente
              </button>
            </div>
          )}
          {(state === 'empty' ||
            state === 'filtered-empty' ||
            (state === 'populated' && visibleItems.length === 0)) && (
            <StatusMessage state="empty">
              {unreadOnly || kindFilter !== ''
                ? 'Nenhuma notificação corresponde aos filtros.'
                : 'Nenhuma notificação no momento.'}
            </StatusMessage>
          )}

          {visibleItems.length > 0 && (
            <ul className="notifications-list" aria-label="Lista de notificações">
              {visibleItems.map(item => (
                <li
                  key={item.id}
                  className={`notification-item${!item.read ? ' unread' : ''}${item.pending ? ' pending' : ''}`}
                >
                  <div className="notification-item-meta">
                    <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                      <span className={severityTagClass(item.severity)}>
                        {KIND_LABELS[item.kind] ?? item.kind}
                      </span>
                      {item.pending && <span className="tag warn">PENDENTE</span>}
                      {!item.read && <span className="tag">NÃO LIDA</span>}
                    </div>
                    <time className="muted notification-time" dateTime={item.at}>
                      14/11 10:15
                    </time>
                  </div>
                  <div className="notification-item-content">
                    <h3>{item.title}</h3>
                    <p className="muted">{item.message}</p>
                  </div>
                  <div className="actions">
                    <button type="button" className="button primary">
                      {getNavigateActionLabel(item.ref.kind)}
                    </button>
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        const nextRead = !item.read;
                        setItems(prev =>
                          prev.map(entry =>
                            entry.id === item.id ? { ...entry, read: nextRead } : entry,
                          ),
                        );
                        setLiveAnnouncement(
                          nextRead
                            ? 'Notificação marcada como lida.'
                            : 'Notificação marcada como não lida.',
                        );
                      }}
                    >
                      {item.read ? 'Marcar como não lida' : 'Marcar como lida'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
