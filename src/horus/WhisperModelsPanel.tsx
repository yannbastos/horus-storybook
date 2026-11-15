import { useState } from 'react';
import { StatusMessage } from './Horus';

export type WhisperModelsStoryState =
  | 'ready-cuda'
  | 'missing-cuda-unavailable'
  | 'download-preview'
  | 'download-progress'
  | 'download-error'
  | 'import-error'
  | 'disconnected';

type StoryModelItem = {
  model: string;
  installed: boolean;
  managed: boolean;
  sizeLabel: string;
  licenseLabel: string;
  sourceName: string | null;
  removable: boolean;
};

const INITIAL_MODELS: StoryModelItem[] = [
  {
    model: 'tiny',
    installed: true,
    managed: true,
    sizeLabel: '75 MB',
    licenseLabel: 'MIT · Confirmada · model card presente',
    sourceName: 'whisper-tiny-local',
    removable: true,
  },
  {
    model: 'base',
    installed: true,
    managed: false,
    sizeLabel: '145 MB',
    licenseLabel: 'MIT · Verificada · sem model card',
    sourceName: 'cache-externo',
    removable: false,
  },
  {
    model: 'small',
    installed: false,
    managed: false,
    sizeLabel: '—',
    licenseLabel: 'MIT (aguardando importação)',
    sourceName: null,
    removable: false,
  },
];

export function WhisperModelsPanelPreview({ state }: { state: WhisperModelsStoryState }) {
  const [models, setModels] = useState<StoryModelItem[]>(INITIAL_MODELS);
  const [importingModel, setImportingModel] = useState<string | null>(null);
  const [sourceDir, setSourceDir] = useState('C:\\modelos\\whisper-small');
  const [confirmLicense, setConfirmLicense] = useState(false);
  const [previewModel, setPreviewModel] = useState<string | null>(
    state === 'download-preview' ? 'small' : null
  );
  const [confirmDownload, setConfirmDownload] = useState(false);
  const [downloadingModel, setDownloadingModel] = useState<string | null>(
    state === 'download-progress' ? 'small' : null
  );
  const [confirmDeleteModel, setConfirmDeleteModel] = useState<string | null>(null);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(
    state === 'import-error'
      ? {
          kind: 'error',
          text: 'Pasta de modelo inválida (Missing model.bin in source directory). Selecione uma pasta com os arquivos completos do modelo Whisper.',
        }
      : state === 'download-error'
        ? {
            kind: 'error',
            text: 'Falha no download do modelo "small": Checksum SHA-256 divergente. Verifique sua conexão ou tente a importação de pasta local.',
          }
        : null
  );

  const isConnected = state !== 'disconnected';
  const cudaAvailable = state === 'ready-cuda';

  function handleImport(modelName: string) {
    if (!sourceDir.trim() || !confirmLicense) return;
    setModels(prev =>
      prev.map(item =>
        item.model === modelName
          ? {
              ...item,
              installed: true,
              managed: true,
              sizeLabel: '485 MB',
              licenseLabel: 'MIT · Confirmada · model card presente',
              sourceName: sourceDir.trim(),
              removable: true,
            }
          : item
      )
    );
    setImportingModel(null);
    setConfirmLicense(false);
    setFeedback({ kind: 'success', text: `Modelo "${modelName}" importado e validado com licença MIT.` });
  }

  function handleConfirmDownload(modelName: string) {
    if (!confirmDownload) return;
    setPreviewModel(null);
    setConfirmDownload(false);
    setModels(prev =>
      prev.map(item =>
        item.model === modelName
          ? {
              ...item,
              installed: true,
              managed: true,
              sizeLabel: '485 MB',
              licenseLabel: 'MIT · Verificada · model card presente',
              sourceName: 'huggingface.co',
              removable: true,
            }
          : item
      )
    );
    setFeedback({
      kind: 'success',
      text: `Modelo "${modelName}" baixado, verificação concluída (SHA-256 validado) e pronto para uso local.`,
    });
  }

  function handleDelete(modelName: string) {
    if (!deleteChecked) return;
    setModels(prev =>
      prev.map(item =>
        item.model === modelName
          ? {
              ...item,
              installed: false,
              managed: false,
              sizeLabel: '—',
              licenseLabel: 'MIT (aguardando importação)',
              sourceName: null,
              removable: false,
            }
          : item
      )
    );
    setConfirmDeleteModel(null);
    setDeleteChecked(false);
    setFeedback({ kind: 'success', text: `Modelo "${modelName}" removido do armazenamento local.` });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
      {isConnected && (
        <section className="card sunken" aria-label="Runtime CUDA">
          <div className="row spread">
            <div>
              <p className="eyebrow accent">ACELERAÇÃO GPU</p>
              <h3>Runtime CUDA</h3>
            </div>
            <span className={cudaAvailable ? 'tag good' : 'tag warn'}>
              {cudaAvailable ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
            </span>
          </div>
          <StatusMessage state={cudaAvailable ? 'success' : 'empty'} tone={cudaAvailable ? 'good' : 'muted'}>
            {cudaAvailable
              ? 'GPU NVIDIA pronta para aceleração CUDA (CUDA 12 · cuDNN 9 · Origem: nvidia_driver).'
              : 'Biblioteca cublas64_12.dll não encontrada; a transcrição usará CPU.'}
          </StatusMessage>
        </section>
      )}

      <section className="card" aria-label="Modelos de transcrição">
        <div className="row spread">
          <div>
            <p className="eyebrow">TRANSCRIÇÃO LOCAL · WHISPER</p>
            <h2>Modelos de transcrição</h2>
          </div>
        </div>
        <p className="muted">
          A transcrição usa somente modelos Whisper locais. Nenhum modelo é baixado pela rede.
        </p>

        {!isConnected && (
          <StatusMessage state="empty">
            Conecte o backend local para listar, importar ou remover modelos Whisper.
          </StatusMessage>
        )}

        {feedback && (
          <StatusMessage state={feedback.kind} tone={feedback.kind === 'success' ? 'good' : 'muted'}>
            {feedback.text}
          </StatusMessage>
        )}

        {isConnected && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {models.map(item => (
              <li
                key={item.model}
                style={{
                  padding: 12,
                  border: '1px solid var(--Line)',
                  background: 'var(--Sunken)',
                  display: 'grid',
                  gap: 8,
                }}
              >
                <div className="row spread" style={{ flexWrap: 'wrap' }}>
                  <div className="row" style={{ flexWrap: 'wrap' }}>
                    <strong>{item.model}</strong>
                    <span className={item.installed ? 'tag good' : 'tag warn'}>
                      {item.installed ? 'INSTALADO' : 'AUSENTE'}
                    </span>
                    {item.installed && !item.managed && <span className="tag">LEGADO EXTERNO</span>}
                  </div>
                  <div className="actions">
                    {!item.installed && (
                      <button
                        type="button"
                        className="button primary"
                        disabled={downloadingModel !== null}
                        onClick={() => {
                          setConfirmDeleteModel(null);
                          setImportingModel(null);
                          setPreviewModel(item.model);
                          setConfirmDownload(false);
                        }}
                      >
                        BAIXAR MODELO
                      </button>
                    )}
                    {!item.installed && (
                      <button
                        type="button"
                        className="button"
                        disabled={downloadingModel !== null}
                        onClick={() => {
                          setConfirmDeleteModel(null);
                          setPreviewModel(null);
                          setImportingModel(item.model);
                          setConfirmLicense(false);
                        }}
                      >
                        IMPORTAR DE PASTA
                      </button>
                    )}
                    {item.installed && item.removable && (
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          setImportingModel(null);
                          setConfirmDeleteModel(item.model);
                          setDeleteChecked(false);
                        }}
                      >
                        REMOVER
                      </button>
                    )}
                  </div>
                </div>
                <p className="muted">
                  Tamanho: {item.sizeLabel} · Licença: {item.licenseLabel}
                  {item.sourceName ? ` · Origem: ${item.sourceName}` : ''}
                </p>

                {previewModel === item.model && (
                  <div className="card" role="region" aria-label={`Prévia de download do modelo ${item.model}`}>
                    <p className="eyebrow">PRÉVIA OBRIGATÓRIA DE DOWNLOAD · {item.model.toUpperCase()}</p>
                    <p><strong>Modelo:</strong> {item.model}</p>
                    <p><strong>Tamanho:</strong> 485 MB</p>
                    <p><strong>Origem / Host:</strong> huggingface.co</p>
                    <p>
                      <strong>Licença:</strong>{' '}
                      <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer noopener">
                        MIT (ver licença)
                      </a>
                    </p>
                    <p><strong>Destino:</strong> Dados locais do Hórus / whisper / {item.model}</p>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: 'row' }}>
                      <input
                        type="checkbox"
                        checked={confirmDownload}
                        onChange={e => setConfirmDownload(e.target.checked)}
                        style={{ width: 'auto', marginTop: 3 }}
                      />
                      <span>
                        Confirmo o download explícito deste modelo a partir de huggingface.co sob licença MIT para o destino local indicado.
                      </span>
                    </label>
                    <div className="actions">
                      <button
                        type="button"
                        className="button primary"
                        disabled={!confirmDownload}
                        onClick={() => handleConfirmDownload(item.model)}
                      >
                        CONFIRMAR DOWNLOAD
                      </button>
                      <button type="button" className="button" onClick={() => setPreviewModel(null)}>
                        CANCELAR
                      </button>
                    </div>
                  </div>
                )}

                {downloadingModel === item.model && (
                  <div className="card" role="region" aria-label={`Progresso do download do modelo ${item.model}`}>
                    <p className="eyebrow">BAIXANDO MODELO · {item.model.toUpperCase()}</p>
                    <StatusMessage state="loading" ariaLive="polite">
                      Baixando arquivos do modelo… (45%)
                    </StatusMessage>
                    <progress
                      aria-label={`Progresso do download do modelo ${item.model}`}
                      max={100}
                      value={45}
                    />
                    <div className="actions">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          setDownloadingModel(null);
                          setFeedback({ kind: 'error', text: `Download do modelo "${item.model}" cancelado.` });
                        }}
                      >
                        CANCELAR DOWNLOAD
                      </button>
                    </div>
                  </div>
                )}

                {importingModel === item.model && (
                  <div className="card">
                    <p className="eyebrow">IMPORTAR MODELO LOCAL · {item.model.toUpperCase()}</p>
                    <label>
                      Pasta local do modelo
                      <input
                        type="text"
                        value={sourceDir}
                        onChange={e => setSourceDir(e.target.value)}
                      />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: 'row' }}>
                      <input
                        type="checkbox"
                        checked={confirmLicense}
                        onChange={e => setConfirmLicense(e.target.checked)}
                        style={{ width: 'auto', marginTop: 3 }}
                      />
                      <span>
                        Confirmo que este modelo Whisper está licenciado sob licença MIT (ou compatível) e foi obtido localmente.
                      </span>
                    </label>
                    <div className="actions">
                      <button
                        type="button"
                        className="button primary"
                        disabled={!sourceDir.trim() || !confirmLicense}
                        onClick={() => handleImport(item.model)}
                      >
                        CONFIRMAR IMPORTAÇÃO
                      </button>
                      <button type="button" className="button" onClick={() => setImportingModel(null)}>
                        CANCELAR
                      </button>
                    </div>
                  </div>
                )}

                {confirmDeleteModel === item.model && (
                  <div className="card">
                    <p className="eyebrow">CONFIRMAÇÃO DUPLA · REMOVER {item.model.toUpperCase()}</p>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: 'row' }}>
                      <input
                        type="checkbox"
                        checked={deleteChecked}
                        onChange={e => setDeleteChecked(e.target.checked)}
                        style={{ width: 'auto', marginTop: 3 }}
                      />
                      <span>Confirmo que desejo remover este modelo localmente.</span>
                    </label>
                    <div className="actions">
                      <button
                        type="button"
                        className="button primary"
                        disabled={!deleteChecked}
                        onClick={() => handleDelete(item.model)}
                      >
                        CONFIRMAR REMOÇÃO
                      </button>
                      <button type="button" className="button" onClick={() => setConfirmDeleteModel(null)}>
                        CANCELAR
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
