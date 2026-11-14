import { Button, StatusMessage, Tag } from './Horus';
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
        <StatusMessage state="loading">
          Reconciliando estado da produção e coletando <code>stderr_tail</code> do processo local…
        </StatusMessage>
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
                  <StatusMessage state="success" tone="good" ariaLive="polite">
                    Diagnóstico copiado para a área de transferência.
                  </StatusMessage>
                )}
              </div>
            </div>
          </details>
        </div>
      )}
    </section>
  );
}

export function FirstVideoGuideDemo({ state = 'success' }: { state?: OperationalState }) {
  const steps = [
    {
      id: 'environment',
      title: 'Verificar ambiente e voz local',
      detail: 'FFmpeg, fábrica, Remotion e motor de voz local prontos.',
      status: state === 'error' ? 'pending' : 'done',
      action: 'ABRIR AJUSTES',
    },
    {
      id: 'script',
      title: 'Escrever ou aprovar um roteiro',
      detail: 'Roteiro v2 aprovado e pronto para produzir.',
      status: state === 'empty' ? 'in_progress' : 'done',
      action: 'IR PARA PRODUÇÃO',
    },
    {
      id: 'production',
      title: 'Executar uma produção local',
      detail: 'Piloto local concluído com vídeo MP4 1080×1920.',
      status: state === 'empty' ? 'pending' : state === 'error' ? 'pending' : 'done',
      action: 'IR PARA PRODUÇÃO',
    },
    {
      id: 'review',
      title: 'Revisar e aprovar o vídeo',
      detail:
        state === 'success'
          ? 'Revisão humana aprovada por hash SHA-256.'
          : 'Inspecione o vídeo, o QC e as licenças antes de aprovar.',
      status: state === 'success' ? 'done' : state === 'error' ? 'pending' : 'in_progress',
      action: 'IR PARA PRODUÇÃO',
    },
  ] as const;

  return (
    <section
      className="card guide-panel"
      role="region"
      aria-label={`Guia Meu primeiro vídeo (${state})`}
    >
      <div className="row spread">
        <div>
          <p className="eyebrow accent">GUIA RÁPIDO · MEU PRIMEIRO VÍDEO</p>
          <h3>Meu primeiro vídeo</h3>
          <StatusMessage
            state={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'success'}
            tone="muted"
            style={{ padding: 0, border: 0, background: 'transparent' }}
          >
            {state === 'loading'
              ? 'Verificando etapas…'
              : state === 'error'
                ? '1 de 4 passos concluídos — ambiente com pendência de ferramenta local.'
                : state === 'empty'
                  ? '1 de 4 passos concluídos.'
                  : '4 de 4 passos concluídos.'}
          </StatusMessage>
        </div>
        <div className="actions">
          {state === 'success' && <Button>OCULTAR GUIA</Button>}
          <Button aria-expanded={state !== 'loading'}>RECOLHER</Button>
        </div>
      </div>

      {state !== 'loading' && (
        <ol className="guide-steps" aria-label={`Passos do guia (${state})`}>
          {steps.map((step, idx) => {
            const isCurrent =
              (state === 'empty' && idx === 1) ||
              (state === 'error' && idx === 0);
            const tone =
              step.status === 'done'
                ? 'good'
                : step.status === 'in_progress'
                  ? 'simulated'
                  : 'warn';
            const statusLabel =
              step.status === 'done'
                ? 'Concluído'
                : step.status === 'in_progress'
                  ? 'Em andamento'
                  : 'Pendente';
            return (
              <li
                key={step.id}
                className={`guide-step${isCurrent ? ' current' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="guide-step-info">
                  <span className="eyebrow muted">{idx + 1}.</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p className="muted small-text">{step.detail}</p>
                  </div>
                </div>
                <div className="guide-step-actions">
                  <Tag tone={tone}>{statusLabel}</Tag>
                  <Button>{step.action}</Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export function CenterFiltersAndNoticeDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="card"
      role="region"
      aria-label={`Filtros da Central e avisos de produção (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">CENTRAL DE PRODUÇÃO · FILTROS E AVISOS GLOBAIS</span>
          <h3>Filtragem por etapa, bloqueios humanos e notificação de término</h3>
        </div>
        <Tag>{state.toUpperCase()}</Tag>
      </div>

      {state !== 'loading' && (
        <div
          className={`production-notice ${
            state === 'error' ? 'failed' : state === 'empty' ? 'interrupted' : 'succeeded'
          }`}
          role={state === 'error' ? 'alert' : 'status'}
        >
          <div>
            <span className="eyebrow">
              {state === 'error'
                ? 'PRODUÇÃO FALHOU (RENDER)'
                : state === 'empty'
                  ? 'PRODUÇÃO INTERROMPIDA'
                  : 'PRODUÇÃO CONCLUÍDA'}
            </span>
            <p className="muted">
              {state === 'error'
                ? 'A execução prod_03 encerrou com falha técnica. Abra a revisão para inspecionar o diagnóstico.'
                : state === 'empty'
                  ? 'A execução prod_02 foi interrompida no reinício e aguarda conciliação humana.'
                  : 'Vídeo MP4 de prod_01 pronto para revisão humana por hash SHA-256.'}
            </p>
          </div>
          <div className="actions">
            <Button variant="primary">Abrir revisão</Button>
            <Button>Dispensar</Button>
          </div>
        </div>
      )}

      <div
        className="row"
        role="group"
        aria-label={`Filtros da Central (${state})`}
        style={{ gap: 'var(--Space7)', flexWrap: 'wrap' }}
      >
        <label className="row" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <span className="eyebrow">ETAPA</span>
          <select
            aria-label={`Etapa filtrada (${state})`}
            defaultValue={state === 'empty' ? 'review' : 'all'}
            style={{ width: 'auto' }}
          >
            <option value="all">Todas as etapas</option>
            <option value="proposal">Proposta</option>
            <option value="script">Roteiro</option>
            <option value="production">Produção</option>
            <option value="review">Revisão humana</option>
          </select>
        </label>
        <label className="row" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <input
            type="checkbox"
            defaultChecked={state === 'error'}
            style={{ width: 'auto' }}
          />
          <span>Somente com bloqueio (ação humana)</span>
        </label>
      </div>

      {state === 'loading' && <StatusMessage state="loading">Carregando vídeos…</StatusMessage>}
      {state === 'error' && (
        <StatusMessage state="error">
          Falha ao consultar fluxos na Central de Produção (500): verifique o backend local.
        </StatusMessage>
      )}
      {state === 'empty' && (
        <StatusMessage state="empty">Nenhum vídeo corresponde aos filtros.</StatusMessage>
      )}
      {state === 'success' && (
        <StatusMessage state="success">
          3 de 3 vídeo(s) exibido(s). A lista do backend é limitada a 100 fluxos.
        </StatusMessage>
      )}
    </section>
  );
}

export function ScriptComparePanelDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="card"
      role="region"
      aria-label={`Comparação de versões do roteiro (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">COMPARAR VERSÕES DO ROTEIRO (HOR-088)</span>
          <h3>v1 vs v2 · Diferenças palavra por palavra</h3>
        </div>
        <div className="row">
          <Button active>Lado a lado</Button>
          <Button>Em linha</Button>
        </div>
      </div>

      {state === 'loading' && (
        <StatusMessage state="loading">
          Calculando diferenças entre as versões v1 e v2 do roteiro…
        </StatusMessage>
      )}

      {state === 'empty' && (
        <StatusMessage state="empty" role="status">
          É necessário ter pelo menos duas versões do roteiro para comparar alterações.
        </StatusMessage>
      )}

      {state === 'error' && (
        <StatusMessage state="error">
          Não foi possível carregar o histórico de versões do roteiro (404).
        </StatusMessage>
      )}

      {state === 'success' && (
        <>
          <StatusMessage state="success">
            <strong>Resumo:</strong> Título alterado · 1 seção(ões) alterada(s)
          </StatusMessage>
          <div className="compare-grid">
            <div className="fact-item">
              <span className="eyebrow muted">Base (v1 · Gerado pela simulação)</span>
              <strong> GANCHO · Abertura</strong>
              <p>
                O Hórus sincroniza <del className="diff-removed">aproximadamente cada frase</del>{' '}
                da narração local antes de montar as cenas.
              </p>
            </div>
            <div className="fact-item">
              <span className="eyebrow muted">Comparada (v2 · Escrito por você · Aprovado)</span>
              <strong> GANCHO · Abertura</strong>
              <p>
                O Hórus sincroniza{' '}
                <ins className="diff-added">a duração real medida de cada seção</ins> da narração
                local antes de montar as cenas.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export function ProductionLaunchOptionsDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Voz e qualidade da produção (${state})`}
      style={{ background: 'var(--Background)' }}
    >
      <div className="row spread">
        <span className="eyebrow accent">VOZ E QUALIDADE DO PILOTO LOCAL · {state.toUpperCase()}</span>
        <Tag tone="demo">PILOTO LOCAL · TTS SINTÉTICO</Tag>
      </div>

      {state === 'loading' && (
        <StatusMessage state="loading">Carregando vozes disponíveis…</StatusMessage>
      )}

      {state === 'error' && (
        <StatusMessage state="error">
          Não foi possível carregar as vozes (Falha ao conectar em /v1/narration/providers). A
          produção usará a voz padrão do backend.
        </StatusMessage>
      )}

      {state === 'empty' && (
        <StatusMessage state="empty" role="status">
          Nenhuma voz local disponível. A produção usará a voz padrão do backend; se ele não tiver
          motor de voz, a execução ficará bloqueada.
        </StatusMessage>
      )}

      {state === 'success' && (
        <>
          <div className="form-row">
            <label>
              Provedor de voz
              <select aria-label="Provedor de voz (demo)" defaultValue="kokoro">
                <option value="kokoro">Kokoro-82M (Local)</option>
                <option value="windows_sapi">Windows SAPI (Vozes do sistema)</option>
              </select>
            </label>
            <label>
              Voz
              <select aria-label="Voz da narração (demo)" defaultValue="pf_dora">
                <option value="pf_dora">Dora (pt-BR)</option>
                <option value="pm_alex">Alex (pt-BR)</option>
              </select>
            </label>
          </div>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <Tag tone="good">Uso comercial: permitido</Tag>
            <Tag>Licença da voz: Apache-2.0</Tag>
            <Tag>Licença do motor: Apache-2.0</Tag>
          </div>
          <label>
            Qualidade do vídeo
            <select aria-label="Qualidade da renderização (demo)" defaultValue="final">
              <option value="draft">Rascunho 540×960</option>
              <option value="final">Final 1080×1920</option>
            </select>
          </label>
          <small className="muted">
            Tempo estimado (final 1080×1920): referência de ensaios locais ≈ 140 a 160 s no total.
          </small>
        </>
      )}
    </section>
  );
}

export function TimecodeReviewWorkspaceDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Revisão e navegação por timecode (${state})`}
      style={{ background: 'var(--Background)' }}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">
            REVISÃO AUDIOVISUAL POR TIMECODE (CONTRATO 1 E CONTRATO 4)
          </span>
          <h3>Navegação por cenas, legendas, palavras e notas por tempo</h3>
        </div>
        <div className="row">
          <Tag tone="simulated">TIMECODE ATUAL: 00:04.20 (4.20s)</Tag>
          <Tag tone={state === 'success' ? 'good' : 'warn'}>
            {state === 'success' ? 'speech_aligned: true' : 'speech_aligned: false'}
          </Tag>
        </div>
      </div>

      {state === 'loading' && (
        <StatusMessage state="loading">
          Carregando <code>word-timings.json</code>, cenas e segmentos de legenda…
        </StatusMessage>
      )}

      {state === 'empty' && (
        <StatusMessage state="empty" role="status">
          Nenhuma cena, legenda ou palavra sincronizada registrada para esta execução.
        </StatusMessage>
      )}

      {state === 'error' && (
        <StatusMessage state="error">
          O texto da nota por timecode deve ter entre 1 e 2000 caracteres (Contrato 4).
        </StatusMessage>
      )}

      {state === 'success' && (
        <>
          <div className="info-grid">
            <div className="info-block">
              <span className="eyebrow">NAVEGAR POR CENAS (3)</span>
              <div className="stack">
                <Button style={{ padding: '6px 10px', minHeight: 30, fontSize: 10, textAlign: 'left' }}>
                  00:00.00 → 00:05.00 · Cena 1: Gancho
                </Button>
                <Button
                  active
                  style={{ padding: '6px 10px', minHeight: 30, fontSize: 10, textAlign: 'left' }}
                >
                  00:05.00 → 00:10.00 · Cena 2: Desenvolvimento
                </Button>
              </div>
            </div>
            <div className="info-block">
              <span className="eyebrow">LINHA DO TEMPO DE PALAVRAS (WORD-TIMINGS.JSON)</span>
              <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                <Button style={{ padding: '4px 8px', minHeight: 26, fontSize: 10 }}>
                  00:03.80 · mede
                </Button>
                <Button
                  active
                  style={{ padding: '4px 8px', minHeight: 26, fontSize: 10 }}
                >
                  00:04.20 · duração
                </Button>
                <Button style={{ padding: '4px 8px', minHeight: 26, fontSize: 10 }}>
                  00:04.75 · real
                </Button>
              </div>
              <small className="muted">
                Nota marcada em 00:04.20: Conferir transição visual na entrada do segundo bloco.
              </small>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export function ProductionComparePanelDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="card"
      role="region"
      aria-label={`Comparação de produções e glossário (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">COMPARAÇÃO DE EXECUÇÕES E GLOSSÁRIO TÉCNICO</span>
          <h3>prod_01 vs prod_02 · Diferenças entre execuções do mesmo roteiro</h3>
        </div>
        <Tag>{state.toUpperCase()}</Tag>
      </div>

      {state === 'loading' && (
        <StatusMessage state="loading">
          Carregando histórico de execuções deste roteiro para comparação…
        </StatusMessage>
      )}

      {state === 'empty' && (
        <StatusMessage state="empty" role="status">
          Apenas uma produção registrada para este roteiro. Execute outra produção para comparar.
        </StatusMessage>
      )}

      {state === 'error' && (
        <StatusMessage state="error">
          Não foi possível carregar os metadados comparativos das produções selecionadas.
        </StatusMessage>
      )}

      {state === 'success' && (
        <>
          <div className="data-table-container">
            <table className="data-table" aria-label="Tabela comparativa de produções (demo)">
              <thead>
                <tr>
                  <th scope="col">Campo</th>
                  <th scope="col">Produção A (prod_01)</th>
                  <th scope="col">Produção B (prod_02)</th>
                  <th scope="col">Diferença</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Versão do roteiro</th>
                  <td>v2</td>
                  <td>v2</td>
                  <td><Tag>Igual</Tag></td>
                </tr>
                <tr className="compare-row-changed">
                  <th scope="row">Qualidade</th>
                  <td>Rascunho (540×960)</td>
                  <td>Final (1080×1920)</td>
                  <td><Tag tone="warn">Alterado</Tag></td>
                </tr>
                <tr className="compare-row-changed">
                  <th scope="row">Resumo do QC</th>
                  <td><Tag tone="warn">Atenção (1 warn, 0 fail)</Tag></td>
                  <td><Tag tone="good">Aprovado (0 fail, 0 warn)</Tag></td>
                  <td><Tag tone="warn">Alterado</Tag></td>
                </tr>
              </tbody>
            </table>
          </div>
          <details open aria-label="Glossário dos termos técnicos">
            <summary>O que significam estes termos?</summary>
            <div className="info-grid" style={{ marginTop: 8 }}>
              <div className="info-block">
                <strong>Não publicável (<code>publishable</code>)</strong>
                <small className="muted">
                  O vídeo ainda não pode ser publicado: faltam licenças verificadas e a decisão de
                  publicação não foi tomada.
                </small>
              </div>
              <div className="info-block">
                <strong>Impressão digital (<code>sha256</code>)</strong>
                <small className="muted">
                  Código de 64 caracteres que identifica exatamente o conteúdo de um arquivo; a
                  aprovação fica presa a ele.
                </small>
              </div>
            </div>
          </details>
        </>
      )}
    </section>
  );
}

export function ProductionExportPanelDemo({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Exportação auditável local (${state})`}
      style={{ background: 'var(--Background)' }}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">EXPORTAÇÃO AUDITÁVEL LOCAL (HOR-099)</span>
          <h3>Pacote para publicação manual (Thumbnail, Metadados e ZIP)</h3>
        </div>
        <Tag tone="demo">publishable: false</Tag>
      </div>

      {state === 'empty' && (
        <StatusMessage state="empty" role="status">
          Disponível somente após aprovação na revisão humana desta produção.
        </StatusMessage>
      )}

      {state === 'loading' && (
        <StatusMessage state="loading">
          Gerando pacote de exportação e verificando hashes SHA-256 dos artefatos…
        </StatusMessage>
      )}

      {state === 'error' && (
        <StatusMessage state="error">
          Conflito ao gerar pacote ZIP (409): a revisão ou os metadados mudaram. Tente exportar
          novamente com a nova chave de idempotência.
        </StatusMessage>
      )}

      {state === 'success' && (
        <div className="stack">
          <div className="info-grid">
            <div className="info-block">
              <span className="eyebrow">1. THUMBNAIL VERTICAL (1080×1920)</span>
              <strong>render/thumbnail.png · render/thumbnail.jpg</strong>
              <small className="muted">Extraída em 00:04.20 · SHA-256 verificado</small>
            </div>
            <div className="info-block">
              <span className="eyebrow">2. METADADOS E DIVULGAÇÕES FIXAS</span>
              <strong>Título + descrição + rodapé obrigatório</strong>
              <small className="muted">Fontes citadas e aviso de voz sintética anexados</small>
            </div>
          </div>
          <div className="row spread">
            <StatusMessage state="success" tone="good" ariaLive="polite">
              Pacote pronto para download (horus-pacote-prod_01.zip · 4,82 MB).
            </StatusMessage>
            <div className="actions">
              <Button variant="primary">Baixar ZIP</Button>
              <Button>Exportar pacote novamente</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
