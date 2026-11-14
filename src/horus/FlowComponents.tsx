import { Button, Tag } from './Horus';
import type { OperationalState } from './Horus';

const PRODUCTION_STAGES = [
  { id: 'prepare', label: 'Preparação' },
  { id: 'narration', label: 'Narração' },
  { id: 'scenes', label: 'Cenas' },
  { id: 'subtitles', label: 'Legendas' },
  { id: 'render', label: 'Render' },
  { id: 'quality', label: 'Qualidade (QC)' },
  { id: 'review', label: 'Revisão' },
] as const;

export function ScriptEditorPanel({ state = 'success' }: { state?: OperationalState }) {
  return (
    <article
      className="card"
      role="region"
      aria-label={`Editor de roteiro (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">ETAPA DE ROTEIRO · EDITOR POR SEÇÕES</span>
          <h3>Estrutura narrativa, narração e direção visual</h3>
        </div>
        <div className="row">
          <Tag
            tone={
              state === 'success'
                ? 'good'
                : state === 'error'
                  ? 'bad'
                  : state === 'loading'
                    ? 'warn'
                    : 'neutral'
            }
          >
            {state === 'success'
              ? 'APROVADO (VERSÃO 2)'
              : state === 'error'
                ? 'ERRO DE VALIDAÇÃO (422)'
                : state === 'loading'
                  ? 'CARREGANDO ROTEIRO…'
                  : 'RASCUNHO VAZIO'}
          </Tag>
        </div>
      </div>

      {state === 'loading' && (
        <div className="loading" role="status" aria-live="polite">
          Carregando versão mais recente do roteiro e histórico de revisão…
        </div>
      )}

      {state === 'empty' && (
        <div className="empty-state" role="status">
          <span className="eyebrow">NENHUMA SEÇÃO NO ROTEIRO</span>
          <h3>Comece adicionando a primeira seção do vídeo</h3>
          <p className="muted">
            Cada seção define o cabeçalho, o texto que será narrado localmente e a direção visual
            para a fábrica.
          </p>
          <div className="actions">
            <Button variant="primary">Adicionar primeira seção</Button>
          </div>
        </div>
      )}

      {(state === 'success' || state === 'error') && (
        <>
          <label>
            <span className="row spread">
              <span>Título do roteiro</span>
              <small className={state === 'error' ? 'error' : 'muted'}>
                {state === 'error' ? '0/100 (obrigatório)' : '39/100 caracteres'}
              </small>
            </span>
            <input
              type="text"
              aria-label={`Título do roteiro (${state})`}
              readOnly
              value={
                state === 'error' ? '' : 'Como garantir sincronismo real no Hórus'
              }
              placeholder="Informe o título do roteiro…"
            />
          </label>

          <div
            className="fact-item"
            role="region"
            aria-label={`Seção 1 do roteiro (${state})`}
          >
            <div className="row spread">
              <span className="eyebrow accent">SEÇÃO #1 · GANCHO INICIAL</span>
              <small className={state === 'error' ? 'error' : 'muted'}>
                {state === 'error'
                  ? '0 palavras · narração obrigatória'
                  : '24 palavras · 162/2000 caracteres · ~10 s estimados'}
              </small>
            </div>
            <label>
              Cabeçalho da seção
              <input
                type="text"
                aria-label={`Cabeçalho da seção 1 (${state})`}
                readOnly
                value="Abertura: por que o tempo medido importa"
              />
            </label>
            <label>
              Texto da narração
              <textarea
                rows={3}
                aria-label={`Texto da narração da seção 1 (${state})`}
                readOnly
                value={
                  state === 'error'
                    ? ''
                    : 'Para evitar legendas adiantadas ou atrasadas, o Hórus mede a duração real de cada trecho de voz sintética local antes de montar as cenas.'
                }
              />
            </label>
            <div className="row spread">
              <small className="muted">
                Fontes vinculadas: <code>src_horus_arch</code> · Direção visual: Diagrama de blocos
                1080×1920
              </small>
              <div className="actions">
                <Button>{state === 'error' ? 'Preencher seção' : 'Adicionar seção abaixo'}</Button>
              </div>
            </div>
          </div>

          {state === 'error' ? (
            <p className="error" role="alert">
              Validação do roteiro (422): informe um título não vazio e preencha o texto de
              narração em todas as seções antes de salvar ou aprovar.
            </p>
          ) : (
            <div className="actions">
              <Button variant="primary">Salvar nova versão</Button>
              <Button>Aprovar roteiro (v2)</Button>
            </div>
          )}
        </>
      )}
    </article>
  );
}

export function VoicePreviewRowPanel({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="card"
      role="region"
      aria-label={`Linha de voz com prévia (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">AJUSTES → NARRAÇÃO · PROVEDOR KOKORO-82M</span>
          <h3>Seleção de voz local e amostra auditável</h3>
        </div>
        <Tag
          tone={
            state === 'success'
              ? 'good'
              : state === 'error'
                ? 'bad'
                : state === 'loading'
                  ? 'warn'
                  : 'neutral'
          }
        >
          {state === 'success'
            ? 'DISPONÍVEL LOCALMENTE'
            : state === 'error'
              ? 'FALHA NA SÍNTESE'
              : state === 'loading'
                ? 'GERANDO AMOSTRA…'
                : 'NENHUMA VOZ INSTALADA'}
        </Tag>
      </div>

      {state === 'empty' && (
        <div className="empty-state" role="status">
          <span className="eyebrow">PROVEDOR SEM VOZES DISPONÍVEIS</span>
          <h3>Nenhuma voz encontrada neste motor local</h3>
          <p className="muted">
            Configure o caminho do modelo em Ajustes ou selecione o provedor Windows SAPI (vozes do
            sistema) para produzir localmente.
          </p>
        </div>
      )}

      {state !== 'empty' && (
        <div className="fact-item">
          <div className="row spread">
            <div>
              <strong>Dora (pf_dora)</strong> · <span className="muted">Português (pt-BR)</span> ·{' '}
              <code>kokoro / pf_dora</code>
            </div>
            <div className="row">
              {state === 'success' && <Tag tone="good">VOZ ATUAL</Tag>}
              <Tag tone="demo">TTS SINTÉTICO LOCAL</Tag>
            </div>
          </div>

          <div className="actions">
            <Button
              disabled={state === 'loading'}
              aria-busy={state === 'loading' ? 'true' : undefined}
            >
              {state === 'loading' ? 'Gerando amostra…' : 'Ouvir amostra'}
            </Button>
            <Button
              variant="primary"
              disabled={state === 'loading' || state === 'error'}
            >
              {state === 'success' ? 'Voz escolhida' : 'Escolher esta voz'}
            </Button>
          </div>

          {state === 'loading' && (
            <p className="muted" role="status" aria-live="polite">
              Sintetizando trecho de demonstração localmente no motor Kokoro-82M…
            </p>
          )}

          {state === 'error' && (
            <p className="error" role="alert">
              Falha ao sintetizar amostra (409): pesos do modelo Kokoro não encontrados em
              HORUS_KOKORO_MODEL. Verifique a instalação local ou escolha outra voz.
            </p>
          )}

          {state === 'success' && (
            <div className="info-block" role="status" aria-live="polite">
              <span className="eyebrow">PRÉVIA DE ÁUDIO LOCAL PRONTA (WAV · 24 KHZ)</span>
              <small className="muted">
                Amostra gerada em 1,4 s · SHA-256: <code>4e9a1c7b8d2f…</code> ·{' '}
                <code>real_voice: false</code>
              </small>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function QualityReportPanelDemo({ state = 'success' }: { state?: OperationalState }) {
  const checks = [
    {
      id: 'audio_clipping',
      category: 'Áudio',
      status: state === 'error' ? 'fail' : 'pass',
      method: 'measured',
      explanation: 'Distorção por saturação ou pico excessivo no áudio.',
      detail:
        state === 'error'
          ? 'Pico acima de 0,0 dBFS detectado no trecho final.'
          : 'Pico máximo -1,8 dBFS dentro do limite seguro.',
      timecode: state === 'error' ? '00:12.40 → 00:14.10' : null,
    },
    {
      id: 'audio_loudness',
      category: 'Áudio',
      status: 'warn',
      method: 'measured',
      explanation: 'Volume médio fora da faixa de referência de fala.',
      detail: '-26,4 LUFS (faixa recomendada: -24 a -14 LUFS).',
      timecode: '00:03.00 → 00:08.50',
    },
    {
      id: 'duration_video_audio',
      category: 'Sincronismo',
      status: 'pass',
      method: 'measured',
      explanation: 'Diferença de duração entre o vídeo e o áudio da narração.',
      detail: 'Delta de 0,02 s entre stream de vídeo e narração (15,00 s).',
      timecode: null,
    },
  ] as const;

  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Painel de qualidade QC (${state})`}
      style={{ background: 'var(--Background)' }}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">PAINEL DE QUALIDADE TÉCNICA (CONTRATO 2 · QC)</span>
          <h3>Inspeção técnica do vídeo e checks por método</h3>
        </div>
        <div className="row">
          <Tag tone="demo">NÃO PUBLICÁVEL (publishable: false)</Tag>
          <Tag
            tone={
              state === 'error'
                ? 'bad'
                : state === 'success'
                  ? 'warn'
                  : state === 'loading'
                    ? 'simulated'
                    : 'neutral'
            }
          >
            {state === 'error'
              ? 'REPROVADO (FAIL)'
              : state === 'success'
                ? 'APROVADO COM RESSALVAS (WARN)'
                : state === 'loading'
                  ? 'VERIFICANDO QC…'
                  : 'QC NÃO EXECUTADO'}
          </Tag>
        </div>
      </div>

      {state === 'loading' && (
        <div className="loading" role="status" aria-live="polite">
          Lendo medições de áudio, vídeo e sincronismo em <code>quality-report.json</code>…
        </div>
      )}

      {state === 'empty' && (
        <div className="blocker-item warning" role="status">
          <span className="eyebrow warn">QC NÃO EXECUTADO (NOT_RUN)</span>
          <p className="muted">
            Nenhum relatório de qualidade (<code>quality-report.json</code>) foi registrado para
            esta produção. A ausência de relatório nunca equivale a aprovado (
            <code>publishable: false</code>).
          </p>
        </div>
      )}

      {(state === 'error' || state === 'success') && (
        <>
          <div className="info-grid">
            <div className="info-block">
              <span className="eyebrow">FERRAMENTA DE MEDIÇÃO</span>
              <strong>horus-qc v1.0 (ffprobe + libebur128)</strong>
            </div>
            <div className="info-block">
              <span className="eyebrow">RESUMO DE CHECKS</span>
              <strong>
                {state === 'error' ? '1 pass · 1 warn · 1 fail' : '2 pass · 1 warn · 0 fail'}
              </strong>
            </div>
          </div>

          {state === 'error' && (
            <div className="critical-blockers-highlight" role="alert">
              <span className="eyebrow">ERROS BLOQUEANTES DE QUALIDADE (1)</span>
              <ul className="critical-blockers-list">
                <li className="critical-blocker-item">
                  <Tag tone="bad">FAIL</Tag>
                  <span>
                    <strong>audio_clipping</strong>: Distorção por saturação ou pico excessivo no
                    áudio (00:12.40 → 00:14.10). Aprovação exige ciência explícita (
                    <code>acknowledge_quality_errors: true</code>).
                  </span>
                </li>
              </ul>
            </div>
          )}

          <div className="data-table-container">
            <table className="data-table" aria-label={`Checks de qualidade (${state})`}>
              <thead>
                <tr>
                  <th scope="col">Check / Explicação</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Status</th>
                  <th scope="col">Método</th>
                  <th scope="col">Detalhe medido</th>
                  <th scope="col">Timecode</th>
                </tr>
              </thead>
              <tbody>
                {checks.map(check => (
                  <tr key={check.id}>
                    <td>
                      <strong>{check.id}</strong>
                      <div className="muted">{check.explanation}</div>
                    </td>
                    <td>{check.category}</td>
                    <td>
                      <Tag
                        tone={
                          check.status === 'fail'
                            ? 'bad'
                            : check.status === 'warn'
                              ? 'warn'
                              : 'good'
                        }
                      >
                        {check.status.toUpperCase()}
                      </Tag>
                    </td>
                    <td>
                      <code>{check.method}</code>
                    </td>
                    <td>{check.detail}</td>
                    <td>
                      {check.timecode ? (
                        <Button style={{ padding: '4px 8px', minHeight: 26, fontSize: 10 }}>
                          {check.timecode}
                        </Button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

export function LicenseProvenancePanelDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Painel de licenças e proveniência (${state})`}
      style={{ background: 'var(--Background)' }}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">PAINEL DE LICENÇAS E PROVENIÊNCIA (CONTRATO 3)</span>
          <h3>Rastreabilidade de origem, direitos comerciais e verificação humana</h3>
        </div>
        <div className="row">
          <Tag tone="demo">publishable: false</Tag>
          <Tag
            tone={
              state === 'error'
                ? 'bad'
                : state === 'success'
                  ? 'good'
                  : state === 'loading'
                    ? 'warn'
                    : 'neutral'
            }
          >
            {state === 'error'
              ? 'LICENÇA REJEITADA / PENDENTE'
              : state === 'success'
                ? 'ASSETS VERIFICADOS POR HUMANO'
                : state === 'loading'
                  ? 'CARREGANDO REVISÕES…'
                  : 'SEM PROVENIÊNCIA REGISTRADA'}
          </Tag>
        </div>
      </div>

      {state === 'loading' && (
        <div className="loading" role="status" aria-live="polite">
          Consultando <code>asset-provenance.json</code> e histórico de revisões humanas…
        </div>
      )}

      {state === 'empty' && (
        <div className="empty-state" role="status">
          <span className="eyebrow">PROVENIÊNCIA AUSENTE</span>
          <h3>Nenhum manifesto de assets registrado nesta execução</h3>
          <p className="muted">
            Sem <code>asset-provenance.json</code>, todos os direitos permanecem não verificados (
            <code>publishable: false</code>).
          </p>
        </div>
      )}

      {state === 'error' && (
        <div className="blocker-item critical" role="alert">
          <span className="eyebrow">BLOQUEIO DE DIREITOS DE USO COMERCIAL</span>
          <p className="error">
            O asset <code>voice_kokoro_pf_dora</code> está com <code>status: rejected</code> ou{' '}
            <code>commercial_use: unknown</code>. Nenhum uso comercial é presumido sem verificação
            humana explícita.
          </p>
        </div>
      )}

      {(state === 'success' || state === 'error') && (
        <div className="data-table-container">
          <table className="data-table" aria-label={`Assets e licenças (${state})`}>
            <thead>
              <tr>
                <th scope="col">Asset ID</th>
                <th scope="col">Origem</th>
                <th scope="col">Licença declarada</th>
                <th scope="col">Uso comercial</th>
                <th scope="col">Status</th>
                <th scope="col">Verificado por</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>voice_kokoro_pf_dora</strong>
                </td>
                <td>
                  <code>local_tts_model</code>
                </td>
                <td>Apache-2.0</td>
                <td>
                  <Tag tone={state === 'error' ? 'warn' : 'good'}>
                    {state === 'error' ? 'UNKNOWN' : 'ALLOWED'}
                  </Tag>
                </td>
                <td>
                  <Tag tone={state === 'error' ? 'bad' : 'good'}>
                    {state === 'error' ? 'REJECTED' : 'VERIFIED'}
                  </Tag>
                </td>
                <td>{state === 'error' ? '—' : 'human (2026-11-14)'}</td>
              </tr>
              <tr>
                <td>
                  <strong>scene_01_card</strong>
                </td>
                <td>
                  <code>original_local</code>
                </td>
                <td>Original Local</td>
                <td>
                  <Tag tone="good">ALLOWED</Tag>
                </td>
                <td>
                  <Tag tone="good">VERIFIED</Tag>
                </td>
                <td>human (2026-11-14)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function ProductionProgressPanelDemo({ state = 'success' }: { state?: OperationalState }) {
  const activeIndex =
    state === 'empty' ? 0 : state === 'loading' ? 4 : state === 'error' ? 4 : 6;

  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Progresso da produção (${state})`}
      style={{ background: 'var(--Background)' }}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">ACOMPANHAMENTO DE EXECUÇÃO LOCAL</span>
          <h3>Trilha de 7 etapas e telemetria do job</h3>
        </div>
        <Tag
          tone={
            state === 'success'
              ? 'good'
              : state === 'error'
                ? 'bad'
                : state === 'loading'
                  ? 'warn'
                  : 'neutral'
          }
        >
          {state === 'success'
            ? 'EXECUÇÃO TÉCNICA CONCLUÍDA'
            : state === 'error'
              ? 'INTERROMPIDO / FALHOU'
              : state === 'loading'
                ? 'EM EXECUÇÃO (RENDER)'
                : 'NA FILA (QUEUED)'}
        </Tag>
      </div>

      <ol className="steps" aria-label="Etapas da produção">
        {PRODUCTION_STAGES.map((stage, idx) => {
          const stepClass =
            state === 'success' || idx < activeIndex
              ? 'done'
              : idx === activeIndex
                ? 'ready'
                : '';
          return (
            <li key={stage.id} className={stepClass}>
              {idx + 1}. {stage.label.toUpperCase()}
            </li>
          );
        })}
      </ol>

      {state === 'loading' && (
        <div className="info-grid" role="status" aria-live="polite">
          <div className="info-block">
            <span className="eyebrow">ETAPA ATUAL</span>
            <strong>Render (renderizando vídeo MP4 na fábrica local)</strong>
          </div>
          <div className="info-block">
            <span className="eyebrow">TEMPO DECORRIDO</span>
            <strong>1 min 18 s</strong>
          </div>
          <div className="info-block">
            <span className="eyebrow">ÚLTIMA ATUALIZAÇÃO DO JOB</span>
            <span>etapa: Render (stage: render) · há 4 s</span>
          </div>
        </div>
      )}

      {state === 'empty' && (
        <p className="muted" role="status">
          Job registrado na fila local (<code>queued</code>); aguardando disponibilidade do worker
          para iniciar a etapa de Preparação.
        </p>
      )}

      {state === 'error' && (
        <div className="blocker-item critical" role="alert">
          <strong>Execução interrompida na etapa Render</strong>
          <span className="error">
            O processo local encerrou antes de concluir. Use o botão de reconciliação ou consulte o
            diagnóstico técnico para iniciar uma nova produção.
          </span>
        </div>
      )}

      {state === 'success' && (
        <div className="info-grid" role="status">
          <div className="info-block">
            <span className="eyebrow">ETAPA ATUAL</span>
            <strong>Revisão (aguardando decisão humana por hash)</strong>
          </div>
          <div className="info-block">
            <span className="eyebrow">DURAÇÃO TOTAL</span>
            <strong>2 min 04 s</strong>
          </div>
          <div className="info-block">
            <span className="eyebrow">ESTADO DO JOB</span>
            <span className="good">estado: concluído (succeeded)</span>
          </div>
        </div>
      )}
    </section>
  );
}

export function FailureDiagnosticsPanelDemo({ state = 'error' }: { state?: OperationalState }) {
  return (
    <section
      className="card"
      role="region"
      aria-label={`Bloco de diagnóstico de falha (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">DIAGNÓSTICO DE FALHA TÉCNICA (HOR-095)</span>
          <h3>Explicação acionável e saída técnica recolhível</h3>
        </div>
        <Tag
          tone={
            state === 'error'
              ? 'bad'
              : state === 'success'
                ? 'good'
                : state === 'loading'
                  ? 'warn'
                  : 'neutral'
          }
        >
          {state === 'error'
            ? 'FALHA REGISTRADA'
            : state === 'success'
              ? 'DIAGNÓSTICO COPIADO / RESOLVIDO'
              : state === 'loading'
                ? 'RECONCILIANDO JOB…'
                : 'SEM FALHA'}
        </Tag>
      </div>

      {state === 'loading' && (
        <div className="loading" role="status" aria-live="polite">
          Reconciliando estado da produção e coletando <code>stderr_tail</code> do processo local…
        </div>
      )}

      {state === 'empty' && (
        <div className="empty-state" role="status">
          <span className="eyebrow">NENHUMA FALHA REGISTRADA</span>
          <h3>Execução sem erros técnicos</h3>
          <p className="muted">
            O bloco de diagnóstico técnico só é exibido quando o job termina em falha, bloqueio ou
            interrupção.
          </p>
        </div>
      )}

      {(state === 'error' || state === 'success') && (
        <div
          className={`blocker-item ${state === 'error' ? 'critical' : 'warning'}`}
          role={state === 'error' ? 'alert' : 'status'}
        >
          <span className="eyebrow">
            {state === 'error' ? 'FALHA NA PRODUÇÃO (ETAPA: RENDER)' : 'DIAGNÓSTICO AUDITÁVEL'}
          </span>
          <p className={state === 'error' ? 'error' : 'muted'}>
            <strong>A renderização do vídeo falhou na etapa local.</strong> Confira o diagnóstico
            técnico abaixo (Remotion/FFmpeg) para corrigir a causa e inicie uma nova produção.
          </p>

          <details className="failure-diagnostics" open>
            <summary>Diagnóstico técnico</summary>
            <div className="stack" style={{ marginTop: 8 }}>
              <div className="info-grid">
                <div className="info-block">
                  <span className="eyebrow">ETAPA</span>
                  <span>Render</span>
                </div>
                <div className="info-block">
                  <span className="eyebrow">CÓDIGO</span>
                  <code>render_failed</code>
                </div>
                <div className="info-block">
                  <span className="eyebrow">DURAÇÃO</span>
                  <span>14.32 s</span>
                </div>
                <div className="info-block">
                  <span className="eyebrow">CÓDIGO DE SAÍDA</span>
                  <span>1</span>
                </div>
              </div>

              <pre className="logs" aria-label="Saída de erro técnica">
                {'Error: Remotion bundle failed during scene composition\n  at renderMedia (fabrica/render.js:42:11)\n  exit_code=1'}
              </pre>

              <div className="actions">
                <Button>Copiar diagnóstico</Button>
                {state === 'success' && (
                  <span className="good" role="status" aria-live="polite">
                    Diagnóstico copiado para a área de transferência.
                  </span>
                )}
              </div>
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
