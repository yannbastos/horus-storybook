import './horus.css';

export type ShortcutsHelpStoryState = 'enabled' | 'disabled';

type ShortcutEntry = {
  id: string;
  label: string;
  description: string;
  parts: string[];
};

const GROUPS: { title: string; items: ShortcutEntry[] }[] = [
  {
    title: 'Geral',
    items: [
      { id: 'help.open', label: 'Ajuda de atalhos', description: 'Abre ou fecha este painel de referência rápida.', parts: ['?'] },
      { id: 'notifications.toggle', label: 'Notificações', description: 'Abre ou fecha a central de notificações.', parts: ['Alt', 'N'] },
    ],
  },
  {
    title: 'Navegação entre seções',
    items: [
      { id: 'nav.overview', label: 'Ir para Visão geral', description: 'Abre a tela inicial de visão geral.', parts: ['Alt', '1'] },
      { id: 'nav.library', label: 'Ir para Biblioteca', description: 'Abre a biblioteca de mídia local.', parts: ['Alt', '3'] },
      { id: 'nav.production-center', label: 'Ir para Central de Produção', description: 'Abre a Central de Produção.', parts: ['Alt', '5'] },
      { id: 'nav.transcription', label: 'Ir para Transcrição', description: 'Abre a ferramenta de transcrição local.', parts: ['Alt', '8'] },
      { id: 'nav.settings', label: 'Ir para Ajustes', description: 'Abre as configurações locais do Hórus.', parts: ['Alt', '9'] },
    ],
  },
  {
    title: 'Ações contextuais',
    items: [
      { id: 'library.search', label: 'Buscar na Biblioteca', description: 'Abre a Biblioteca e foca o campo de busca.', parts: ['Ctrl', 'K'] },
      { id: 'transcription.save', label: 'Salvar transcrição (.txt)', description: 'Salva o texto atual quando estiver na tela de Transcrição.', parts: ['Ctrl', 'S'] },
    ],
  },
];

export function ShortcutsHelpPreview({ state = 'enabled' }: { state?: ShortcutsHelpStoryState }) {
  const enabled = state === 'enabled';

  return (
    <div className="horus" style={{ padding: 24 }}>
      <section
        className="shortcuts-modal"
        role="region"
        aria-labelledby="story-shortcuts-title"
      >
        <header className="shortcuts-modal-header">
          <div>
            <p className="eyebrow accent">PRODUTIVIDADE E ACESSIBILIDADE</p>
            <div className="row" style={{ gap: 'var(--Space3)', marginTop: 4, flexWrap: 'wrap' }}>
              <h2 id="story-shortcuts-title">Atalhos de teclado</h2>
              <span className={enabled ? 'tag good' : 'tag warn'}>
                {enabled ? 'ATIVADOS' : 'DESATIVADOS'}
              </span>
            </div>
            <p className="muted">
              Atalhos com modificador ou <kbd className="shortcut-kbd">?</kbd> fora de campos de texto, preservando digitação e leitores de tela.
            </p>
          </div>
          <div className="actions">
            <button type="button" className="button">Configurar em Ajustes</button>
            <button type="button" className="button primary">Fechar</button>
          </div>
        </header>

        <div className="shortcuts-modal-body" tabIndex={0} aria-label="Lista de atalhos">
          {!enabled && (
            <div className="card sunken" role="status">
              <p className="muted" style={{ margin: 0 }}>
                Os atalhos globais estão desativados nas suas preferências locais. Você pode reativá-los em Ajustes.
              </p>
            </div>
          )}

          {GROUPS.map(group => (
            <section key={group.title} className="shortcuts-group" aria-label={group.title}>
              <h3 className="eyebrow">{group.title}</h3>
              <ul className="shortcuts-list">
                {group.items.map(item => (
                  <li key={item.id} className="shortcut-row">
                    <div className="shortcut-info">
                      <strong>{item.label}</strong>
                      <span className="muted">{item.description}</span>
                    </div>
                    <div className="shortcut-keys">
                      {item.parts.map((part, idx) => (
                        <span key={`${item.id}-${idx}`} className="shortcut-key-wrap">
                          {idx > 0 && <span className="muted" aria-hidden="true">+</span>}
                          <kbd className="shortcut-kbd">{part}</kbd>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
