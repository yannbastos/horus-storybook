import { useState } from 'react';
import { StatusMessage } from './Horus';

export type UpdaterStoryState =
  | 'disabled'
  | 'up_to_date'
  | 'available'
  | 'confirm_dialog'
  | 'blocked_job'
  | 'downloading'
  | 'error_signature'
  | 'error_downgrade'
  | 'error_network';

export function UpdaterPanelPreview({ state }: { state: UpdaterStoryState }) {
  const [autoCheck, setAutoCheck] = useState(state !== 'disabled');
  const [confirmOpen, setConfirmOpen] = useState(state === 'confirm_dialog');

  const isDisabled = state === 'disabled';
  const showAvailable =
    state === 'available' || state === 'confirm_dialog' || state === 'blocked_job';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--Space5)', maxWidth: 720 }}>
      {state === 'available' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--Space4)',
            flexWrap: 'wrap',
            padding: 'var(--Space4) var(--Space6)',
            border: '1px solid var(--Line)',
            borderLeft: '3px solid var(--AccentInk)',
            background: 'var(--Sunken)',
          }}
        >
          <div className="row" style={{ gap: 'var(--Space3)', flexWrap: 'wrap' }}>
            <span className="tag">ATUALIZAÇÃO</span>
            <span>
              Nova versão <strong>0.2.0</strong> disponível para instalação manual.
            </span>
          </div>
          <div className="row" style={{ gap: 'var(--Space2)' }}>
            <button type="button" className="button primary">
              Ver atualização
            </button>
            <button type="button" className="button">
              Fechar
            </button>
          </div>
        </div>
      )}

      <section className="card" aria-label="Atualizações">
        <p className="eyebrow">ATUALIZAÇÕES</p>
        <h2>{isDisabled ? 'Atualizações desativadas neste build.' : 'Atualizações do aplicativo.'}</h2>

        {isDisabled ? (
          <>
            <p className="muted">
              Este build não possui um canal de atualização configurado. Nenhuma verificação ou
              download automático será realizado.
            </p>
            <p className="muted">
              Versão instalada: <strong className="mono">0.1.0</strong>
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--Space4)',
              }}
            >
              <div className="fact-item">
                <p className="eyebrow">VERSÃO INSTALADA</p>
                <p className="mono">0.1.0</p>
              </div>
              <div className="fact-item">
                <p className="eyebrow">ÚLTIMA VERIFICAÇÃO</p>
                <p>16/11/2026, 12:00:00</p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--Space5)',
                padding: 'var(--Space4) var(--Space5)',
                border: '1px solid var(--Line)',
                background: 'var(--Sunken)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--Space1)', flex: '1 1 260px' }}>
                <strong style={{ color: 'var(--InkStrong)' }}>Verificar atualizações ao iniciar</strong>
                <span className="muted">
                  Consulta o canal ao abrir o aplicativo. Downloads e instalações sempre dependem de
                  sua confirmação.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoCheck}
                className={`button ${autoCheck ? 'active' : ''}`}
                disabled={state === 'downloading'}
                onClick={() => setAutoCheck(prev => !prev)}
              >
                {autoCheck ? 'ATIVADO' : 'DESATIVADO'}
              </button>
            </div>

            <div className="row">
              <button type="button" className="button" disabled={state === 'downloading'}>
                VERIFICAR AGORA
              </button>
            </div>

            {state === 'up_to_date' && (
              <StatusMessage state="success" ariaLive="polite">
                Você já está na versão mais recente.
              </StatusMessage>
            )}

            {state === 'downloading' && (
              <div className="card sunken" role="status" aria-live="polite">
                <p className="loading">Baixando atualização (0.2.0)…</p>
                <progress value={52} max={100} aria-label="Progresso do download da atualização" />
                <p className="muted">5.0 MB de 10.0 MB (52%)</p>
              </div>
            )}

            {showAvailable && (
              <div className="card sunken">
                <div className="row spread">
                  <div>
                    <p className="eyebrow accent">NOVA VERSÃO DISPONÍVEL</p>
                    <h3>Versão 0.2.0</h3>
                  </div>
                  <span className="tag">16/11/2026</span>
                </div>
                <p className="muted">
                  Correções na fila de renderização e melhoria de estabilidade na transcrição local.
                </p>

                {state === 'blocked_job' && (
                  <div
                    role="status"
                    aria-live="polite"
                    style={{
                      padding: 'var(--Space4) var(--Space5)',
                      border: '1px solid var(--Warn)',
                      borderLeftWidth: 3,
                      background: 'var(--Sunken)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--Space2)',
                    }}
                  >
                    <strong>Atualização aguardando conclusão de tarefa</strong>
                    <p className="muted">
                      A atualização aguarda o fim de renderizações, transcrições ou outras tarefas
                      em andamento.
                    </p>
                  </div>
                )}

                <div className="row">
                  <button
                    type="button"
                    className="button primary"
                    disabled={state === 'blocked_job'}
                    onClick={() => setConfirmOpen(true)}
                  >
                    BAIXAR E INSTALAR
                  </button>
                </div>
              </div>
            )}

            {state === 'error_signature' && (
              <div className="card sunken">
                <StatusMessage state="error">
                  A assinatura digital do pacote de atualização é inválida. A instalação foi recusada
                  por segurança.
                </StatusMessage>
                <p className="muted">Detalhe técnico (signature_invalid): assinatura minisign divergente</p>
              </div>
            )}

            {state === 'error_downgrade' && (
              <div className="card sunken">
                <StatusMessage state="error">
                  A versão informada pelo canal é igual ou inferior à instalada e foi recusada por
                  segurança.
                </StatusMessage>
                <p className="muted">Detalhe técnico (downgrade_refused): manifest version 0.0.9 &lt;= 0.1.0</p>
              </div>
            )}

            {state === 'error_network' && (
              <div className="card sunken">
                <StatusMessage state="error">
                  Não foi possível consultar ou baixar a atualização por erro de rede. Verifique sua
                  conexão e tente novamente.
                </StatusMessage>
                <div className="row">
                  <button type="button" className="button">
                    TENTAR NOVAMENTE
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {confirmOpen && showAvailable && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Confirmação de atualização"
          style={{
            border: '1px solid var(--LineStrong)',
            background: 'var(--Background)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: 'var(--Space5) var(--Space6)',
              borderBottom: '1px solid var(--Line)',
              background: 'var(--Sunken)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--Space4)',
            }}
          >
            <div>
              <p className="eyebrow accent">CONFIRMAÇÃO DE ATUALIZAÇÃO</p>
              <h3>Instalar versão 0.2.0?</h3>
            </div>
            <button type="button" className="button" onClick={() => setConfirmOpen(false)}>
              Fechar
            </button>
          </div>
          <div style={{ padding: 'var(--Space5) var(--Space6)', display: 'flex', flexDirection: 'column', gap: 'var(--Space3)' }}>
            <p>
              Você está prestes a atualizar o Hórus da versão <strong>0.1.0</strong> para a versão{' '}
              <strong>0.2.0</strong>:
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--Space2)' }}>
              <li className="fact-item">
                <strong>1. Backup dos dados locais</strong>
                <span className="muted">Cópia de segurança antes de qualquer alteração.</span>
              </li>
              <li className="fact-item">
                <strong>2. Download do pacote</strong>
                <span className="muted">Baixa o instalador da versão 0.2.0.</span>
              </li>
              <li className="fact-item">
                <strong>3. Verificação da assinatura digital</strong>
                <span className="muted">Valida a integridade e autenticidade do pacote.</span>
              </li>
              <li className="fact-item">
                <strong>4. Reinício do aplicativo</strong>
                <span className="muted">Encerra e reinicia o app para concluir a instalação.</span>
              </li>
            </ul>
          </div>
          <div
            style={{
              padding: 'var(--Space4) var(--Space6)',
              borderTop: '1px solid var(--Line)',
              background: 'var(--Sunken)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--Space3)',
            }}
          >
            <button type="button" className="button" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </button>
            <button type="button" className="button primary" onClick={() => setConfirmOpen(false)}>
              Confirmar e instalar
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
