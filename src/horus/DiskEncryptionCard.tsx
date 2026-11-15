import { StatusMessage } from './Horus';
import { StatusBadge } from './SecurityWidgets';

export type DiskEncryptionStoryState = 'encrypted' | 'not_encrypted' | 'unverified' | 'missing';

const GUIDANCE_LINES = [
  'O que é: a criptografia de disco (BitLocker no Windows Pro/Enterprise/Education; "criptografia de dispositivo" no Windows Home e em alguns computadores) embaralha todo o volume para que ninguém leia os arquivos sem a chave.',
  'Por que importa: o Hórus guarda roteiros, mídia, comentários, o banco de dados e a conexão do Hermes na pasta de dados, sem criptografia própria. A criptografia do volume protege esses dados se o computador for perdido ou roubado.',
  'Como ativar: no Windows Pro/Enterprise/Education, abra Configurações > Privacidade e segurança > Criptografia de dispositivo, ou Painel de Controle > Sistema e Segurança > BitLocker. No Windows Home, use Configurações > Privacidade e segurança > Criptografia de dispositivo (em computadores compatíveis, com conta Microsoft). Guarde a chave de recuperação fora do computador.',
];

export function DiskEncryptionCardPreview({ state }: { state: DiskEncryptionStoryState }) {
  const volumeLabel = state === 'not_encrypted' ? 'Volume D:' : state === 'missing' ? null : 'Volume C:';

  return (
    <div className="page">
      <section className="card" aria-label="Criptografia do Volume" style={{ gap: 'var(--Space4)' }}>
        <div className="row spread" style={{ flexWrap: 'wrap', gap: 'var(--Space3)' }}>
          <div>
            <p className="eyebrow">PROTEÇÃO DO DISCO</p>
            <h2>Criptografia do Volume</h2>
            <p className="muted">
              Consulta somente leitura do volume onde ficam os dados locais do Hórus. Nunca bloqueia produções.
            </p>
          </div>
          <div className="row" style={{ gap: 'var(--Space3)', flexWrap: 'wrap' }}>
            {volumeLabel && <span className="tag">{volumeLabel}</span>}
            {state === 'encrypted' ? (
              <StatusBadge state="active" reason="Criptografia de disco ligada no volume dos dados." />
            ) : state === 'not_encrypted' ? (
              <span className="tag warn" data-state="not_encrypted">
                SEM CRIPTOGRAFIA
              </span>
            ) : (
              <StatusBadge
                state="unverified"
                reason={
                  state === 'missing'
                    ? 'Criptografia do disco não informada no diagnóstico.'
                    : 'Não foi possível confirmar a criptografia do volume.'
                }
              />
            )}
          </div>
        </div>

        {state === 'missing' && (
          <StatusMessage state="empty">
            Estado da criptografia do disco não informado por este backend. Nenhuma função do Hórus é bloqueada.
          </StatusMessage>
        )}

        {state === 'encrypted' && (
          <StatusMessage state="success" tone="good">
            Volume C: com criptografia de disco ligada.
          </StatusMessage>
        )}

        {state === 'not_encrypted' && (
          <>
            <StatusMessage state="empty" role="status">
              Volume D: com proteção de criptografia desligada (sem criptografia ou suspensa).
            </StatusMessage>
            <p className="muted small">
              Esta verificação apenas informa e não impede nenhuma operação ou produção no Hórus.
            </p>
            <div className="fact-item" style={{ display: 'grid', gap: 'var(--Space2)' }}>
              <p className="eyebrow">COMO PROTEGER SEUS DADOS</p>
              {GUIDANCE_LINES.map((line, index) => (
                <p key={index} className="muted small">
                  {line}
                </p>
              ))}
            </div>
          </>
        )}

        {state === 'unverified' && (
          <StatusMessage state="empty" role="status">
            Não foi possível confirmar se o volume C: está criptografado.
          </StatusMessage>
        )}

        {state !== 'not_encrypted' && (
          <details>
            <summary className="small" style={{ cursor: 'pointer' }}>
              Como verificar ou ativar a criptografia de disco no Windows
            </summary>
            <div style={{ display: 'grid', gap: 'var(--Space2)', marginTop: 'var(--Space3)' }}>
              {GUIDANCE_LINES.map((line, index) => (
                <p key={index} className="muted small">
                  {line}
                </p>
              ))}
            </div>
          </details>
        )}
      </section>
    </div>
  );
}
