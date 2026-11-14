import { useState } from 'react';
import { StatusMessage } from './Horus';

export type ReadinessStoryState = 'disconnected' | 'missing' | 'error' | 'present';

type OptionalComponentSpec = {
  id: 'whisper' | 'kokoro' | 'yt-dlp' | 'ffmpeg';
  title: string;
  pickLabel: string;
  placeholder: string;
  envVar: string;
  whatItUnlocks: string;
  installSteps: string;
  commandHint: string;
};

const COMPONENTS: OptionalComponentSpec[] = [
  {
    id: 'whisper',
    title: 'Whisper (transcrição e legendas)',
    pickLabel: 'Selecionar pasta do modelo',
    placeholder: 'C:\\Modelos\\faster-whisper-small',
    envVar: 'HORUS_ALIGNMENT_MODEL',
    whatItUnlocks: 'Transcreve áudios e vídeos offline para texto e alinha legendas palavra por palavra.',
    installSteps:
      'Instale Python com faster-whisper localmente e baixe o modelo small para uma pasta no computador (nenhum download automático é feito pelo Hórus).',
    commandHint: 'pip install faster-whisper',
  },
  {
    id: 'kokoro',
    title: 'Kokoro (narração neural local)',
    pickLabel: 'Selecionar pasta do Kokoro',
    placeholder: 'C:\\Ferramentas\\kokoro-models',
    envVar: 'HORUS_KOKORO_MODEL_DIR',
    whatItUnlocks: 'Gera narração local com vozes neurais sem depender de nuvem ou API paga.',
    installSteps:
      'Prepare o ambiente Python do Kokoro e a pasta com os pesos e vozes oficiais; depois aponte HORUS_KOKORO_PYTHON e HORUS_KOKORO_MODEL_DIR.',
    commandHint: 'setx HORUS_KOKORO_MODEL_DIR "<pasta-do-kokoro>"',
  },
  {
    id: 'yt-dlp',
    title: 'yt-dlp (download de referências)',
    pickLabel: 'Selecionar arquivo yt-dlp.exe',
    placeholder: 'C:\\Ferramentas\\yt-dlp.exe',
    envVar: 'PATH',
    whatItUnlocks: 'Permite baixar vídeos de referência autorizados por você para transcrição local.',
    installSteps:
      'Baixe o executável yt-dlp.exe manualmente ou instale pelo winget/pip e mantenha-o acessível no PATH do Windows.',
    commandHint: 'winget install yt-dlp.yt-dlp',
  },
  {
    id: 'ffmpeg',
    title: 'FFmpeg (áudio, vídeo e render final)',
    pickLabel: 'Selecionar arquivo ffmpeg.exe',
    placeholder: 'C:\\Ferramentas\\ffmpeg\\bin\\ffmpeg.exe',
    envVar: 'HORUS_FFMPEG',
    whatItUnlocks: 'Converte mídia, mescla áudio/vídeo e renderiza legendas finais em 1080×1920.',
    installSteps:
      'Baixe uma compilação do FFmpeg com suporte a libass/subtitles (com ffprobe.exe na mesma pasta) e aponte HORUS_FFMPEG para o executável.',
    commandHint: 'winget install Gyan.FFmpeg',
  },
];

export function ReadinessPanelPreview({ state }: { state: ReadinessStoryState }) {
  const [selectedPaths, setSelectedPaths] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPath, setDraftPath] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isConnected = state !== 'disconnected';
  const allPresent = state === 'present';

  function saveManualPath(id: string) {
    const trimmed = draftPath.trim();
    if (trimmed) {
      setSelectedPaths(prev => ({ ...prev, [id]: trimmed }));
    }
    setEditingId(null);
    setDraftPath('');
  }

  return (
    <div className="page">
      <section className="card sunken" aria-labelledby="first-run-readiness-title">
        <div className="row spread">
          <div>
            <p className="eyebrow accent">PRIMEIRA EXECUÇÃO · PRONTIDÃO LOCAL</p>
            <h2 id="first-run-readiness-title">O que já funciona e o que é opcional</h2>
          </div>
          <div className="actions">
            {isConnected && (
              <button type="button" className="button">
                VERIFICAR NOVAMENTE
              </button>
            )}
            <button type="button" className="button">
              ABRIR AJUSTES
            </button>
          </div>
        </div>

        {state === 'disconnected' && (
          <StatusMessage state="empty">
            Conecte o backend local em Ajustes para verificar quais componentes opcionais (Whisper,
            Kokoro, yt-dlp e FFmpeg) já estão instalados neste computador.
          </StatusMessage>
        )}

        {state === 'error' && (
          <StatusMessage state="error">
            Não foi possível consultar o diagnóstico local: Falha temporária ao ler /v1/diagnostics.
          </StatusMessage>
        )}

        {(state === 'missing' || state === 'present') && (
          <>
            <div className="card" style={{ gap: 10 }}>
              <p className="eyebrow">JÁ FUNCIONA AGORA</p>
              <p className="muted">
                Interface local, Biblioteca de mídia, organização de produções e preparação de
                roteiros já funcionam sem downloads adicionais.
                {allPresent
                  ? ' Componentes prontos neste computador: Whisper, Kokoro, yt-dlp, FFmpeg.'
                  : ' Nenhum dos 4 componentes opcionais foi detectado ainda — você pode instalar apenas os que precisar.'}
              </p>
            </div>

            <StatusMessage state={allPresent ? 'success' : 'empty'}>
              {allPresent
                ? 'Tudo pronto: Whisper, Kokoro, yt-dlp e FFmpeg estão disponíveis localmente.'
                : '4 de 4 componentes opcionais ainda não instalados (Whisper, Kokoro, yt-dlp, FFmpeg). Nenhum download automático é executado; siga as instruções abaixo para instalar localmente.'}
            </StatusMessage>

            <div style={{ display: 'grid', gap: 12 }}>
              {COMPONENTS.map(spec => {
                const savedPath = selectedPaths[spec.id];
                const isEditing = editingId === spec.id;
                return (
                  <article key={spec.id} className="card">
                    <div className="row spread">
                      <h3>{spec.title}</h3>
                      <span className={allPresent ? 'tag good' : 'tag warn'}>
                        {allPresent ? 'DISPONÍVEL' : 'OPCIONAL AUSENTE'}
                      </span>
                    </div>
                    <p className="muted">{spec.whatItUnlocks}</p>
                    {!allPresent && (
                      <>
                        <p className="small-text">{spec.installSteps}</p>
                        <div className="row spread" style={{ flexWrap: 'wrap', gap: 8 }}>
                          <code className="eyebrow" style={{ letterSpacing: 0.4 }}>
                            {spec.commandHint}
                          </code>
                          <div className="actions">
                            <button
                              type="button"
                              className="button"
                              onClick={() => {
                                setCopiedId(spec.id);
                                setTimeout(() => setCopiedId(curr => (curr === spec.id ? null : curr)), 1500);
                              }}
                            >
                              {copiedId === spec.id ? 'COPIADO' : 'COPIAR COMANDO'}
                            </button>
                            <button
                              type="button"
                              className="button"
                              onClick={() => {
                                setEditingId(spec.id);
                                setDraftPath(savedPath ?? '');
                              }}
                            >
                              {spec.pickLabel.toUpperCase()}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {savedPath && (
                      <StatusMessage state="success" tone="plain">
                        Caminho anotado para {spec.envVar}: {savedPath}
                      </StatusMessage>
                    )}
                    {isEditing && (
                      <form
                        className="row"
                        style={{ flexWrap: 'wrap', gap: 8 }}
                        onSubmit={event => {
                          event.preventDefault();
                          saveManualPath(spec.id);
                        }}
                      >
                        <label style={{ flex: '1 1 260px' }}>
                          Caminho local ({spec.envVar})
                          <input
                            value={draftPath}
                            onChange={e => setDraftPath(e.target.value)}
                            placeholder={spec.placeholder}
                            autoComplete="off"
                          />
                        </label>
                        <button type="submit" className="button primary">
                          SALVAR CAMINHO
                        </button>
                        <button type="button" className="button" onClick={() => setEditingId(null)}>
                          CANCELAR
                        </button>
                      </form>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
