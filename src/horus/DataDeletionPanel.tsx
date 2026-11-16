import { useId, useState } from 'react';
import { StatusMessage } from './Horus';

export type DataDeletionStoryState = 'preview_ready' | 'preview_blocked' | 'deleted_production' | 'audit_history';

export function DataDeletionPanelPreview({ state }: { state: DataDeletionStoryState }) {
  const [phrase, setPhrase] = useState('');
  const hintId = useId();
  const inputId = useId();
  const expectedPhrase = 'APAGAR producao aabbccdd';

  if (state === 'deleted_production') {
    return (
      <div className="page">
        <section className="card" aria-label="Produção com arquivos excluídos" style={{ gap: 'var(--Space4)' }}>
          <div className="row spread" style={{ flexWrap: 'wrap', gap: 'var(--Space3)' }}>
            <div>
              <p className="eyebrow">EXECUÇÃO DE PRODUÇÃO · ROTEIRO v1</p>
              <h2>Produção aabbccdd11223344</h2>
            </div>
            <div className="row" style={{ gap: 'var(--Space2)' }}>
              <span className="tag warn">Arquivos excluídos</span>
            </div>
          </div>
          <StatusMessage state="empty" eyebrow="ARQUIVOS EXCLUÍDOS · QUARENTENA">
            Os arquivos locais desta produção foram movidos para a quarentena em 15/11/2026 12:10:00.
            Prévia de artefatos, exportação e novos comentários ficam indisponíveis até a restauração
            em Ajustes → Privacidade e Segurança.
          </StatusMessage>
        </section>
      </div>
    );
  }

  if (state === 'audit_history') {
    return (
      <div className="page">
        <section className="card" aria-label="Histórico de exclusões locais" style={{ gap: 'var(--Space4)' }}>
          <div>
            <p className="eyebrow">EXCLUSÃO SEGURA DE DADOS</p>
            <h2>Histórico de exclusões locais e quarentena</h2>
            <p className="muted">
              Registro encadeado de exclusões em quarentena recuperável. Você pode restaurar arquivos
              movidos para a quarentena.
            </p>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--Space2)' }}>
            <li className="fact-item" style={{ display: 'grid', gap: 'var(--Space2)' }}>
              <div className="row spread" style={{ flexWrap: 'wrap', gap: 'var(--Space2)' }}>
                <div className="row" style={{ gap: 'var(--Space2)' }}>
                  <span className="tag warn">Exclusão concluída (em quarentena)</span>
                  <strong>Produção · aabbccdd</strong>
                </div>
                <button type="button" className="button">
                  Restaurar
                </button>
              </div>
              <small className="muted">4 arquivo(s) (2,0 MB) · Backup: pre-exclusao-20261115.zip</small>
            </li>
            <li className="fact-item" style={{ display: 'grid', gap: 'var(--Space2)' }}>
              <div className="row spread" style={{ flexWrap: 'wrap', gap: 'var(--Space2)' }}>
                <div className="row" style={{ gap: 'var(--Space2)' }}>
                  <span className="tag good">Restaurado da quarentena</span>
                  <strong>Projeto importado · 11223344</strong>
                </div>
                <small className="muted">15/11/2026 11:40:00</small>
              </div>
            </li>
          </ul>
        </section>
      </div>
    );
  }

  const isBlocked = state === 'preview_blocked';

  return (
    <div className="page">
      <section className="card" aria-label="Prévia da exclusão segura de dados locais" style={{ gap: 'var(--Space4)' }}>
        <div>
          <p className="eyebrow warn">EXCLUSÃO SEGURA DE DADOS LOCAIS</p>
          <h2>Excluir arquivos locais</h2>
          <p className="muted">Produção: aabbccdd11223344</p>
        </div>

        <div className="fact-item" role="note" style={{ borderColor: 'var(--Warn)', display: 'grid', gap: 'var(--Space2)' }}>
          <span className="eyebrow warn">BACKUP AUTOMÁTICO E QUARENTENA RECUPERÁVEL</span>
          <p>
            Antes de remover qualquer arquivo, o Hórus cria e verifica um pacote de backup automático
            (<code>pre-exclusao-*.zip</code>) fora da pasta de dados.
          </p>
          <p className="muted">
            O pacote de backup inclui apenas banco e manifestos JSON; vídeos e exports ficam preservados na
            quarentena recuperável.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 'var(--Space2)' }}>
          <div className="row spread">
            <span className="eyebrow">O QUE SAI DA PASTA ATIVA (VAI PARA A QUARENTENA)</span>
            <span className="tag">4 arquivo(s) · 2,0 MB</span>
          </div>
          <div className="fact-item">
            <div className="row spread">
              <strong>Pasta da produção</strong>
              <span>4 arquivo(s) · 2,0 MB</span>
            </div>
            <small className="muted">productions/aabbccdd11223344556677889900aabb</small>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'var(--Space2)' }}>
          <span className="eyebrow">O QUE PERMANECE NO BANCO DE DADOS E POR QUÊ</span>
          <div className="fact-item">
            <div className="row spread">
              <strong>Revisões de licença (license_reviews)</strong>
              <span className="tag">2 registro(s)</span>
            </div>
            <small className="muted">append-only: não pode ser apagado nem alterado</small>
          </div>
        </div>

        {isBlocked ? (
          <StatusMessage state="error">
            Há 1 tarefa(s) ativa(s); aguarde terminar ou cancele antes de excluir.
          </StatusMessage>
        ) : (
          <div className="fact-item" style={{ display: 'grid', gap: 'var(--Space2)' }}>
            <p id={hintId}>Digite exatamente a frase abaixo para confirmar:</p>
            <code>{expectedPhrase}</code>
            <label htmlFor={inputId}>
              Frase de confirmação
              <input
                id={inputId}
                type="text"
                value={phrase}
                placeholder={expectedPhrase}
                aria-describedby={hintId}
                onChange={e => setPhrase(e.target.value)}
              />
            </label>
            <div className="actions">
              <button type="button" className="button" disabled={phrase !== expectedPhrase}>
                Confirmar exclusão
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
