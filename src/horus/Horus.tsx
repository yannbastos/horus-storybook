import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import './horus.css';
import { cards, statuses } from './data';

export type TagTone = 'neutral' | 'good' | 'warn' | 'bad' | 'simulated' | 'demo';
export type OperationalState = 'loading' | 'error' | 'empty' | 'success';

export interface StatusMessageProps {
  /** Estado operacional canônico do design system (loading | error | empty | success). */
  state: OperationalState;
  /** Rótulo/eyebrow opcional em bloco (renderiza dentro de .fact-item). */
  eyebrow?: string;
  /** Papel ARIA explícito; usa padrão semântico por estado ('alert' para error, 'status' para loading/success). */
  role?: 'status' | 'alert';
  /** Política de anúncio dinâmico ARIA ('polite' padrão quando state === 'loading'). */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** Tom visual opcional ('muted' padrão, 'good' para destaque positivo ou 'plain' sem classe de tom). */
  tone?: 'muted' | 'good' | 'plain';
  /** Estilo inline opcional quando necessário para espaçamento local. */
  style?: CSSProperties;
  /** Identificador de teste opcional. */
  testId?: string;
  /** Conteúdo textual ou elementos filhos da mensagem de estado. */
  children: ReactNode;
}

/**
 * Componente compartilhado para mensagens operacionais de estado (loading, error, empty, success),
 * alinhado 1:1 com frontend/src/components/StatusMessage.tsx do aplicativo Hórus.
 */
export function StatusMessage({
  state,
  eyebrow,
  role,
  ariaLive,
  tone = 'muted',
  style,
  testId,
  children,
}: StatusMessageProps) {
  const resolvedRole =
    role ?? (state === 'error' ? 'alert' : state === 'loading' || state === 'success' ? 'status' : undefined);
  const resolvedAriaLive = ariaLive ?? (state === 'loading' ? 'polite' : undefined);

  const className =
    state === 'error'
      ? 'error'
      : state === 'loading'
        ? 'loading'
        : tone === 'good'
          ? 'good'
          : tone === 'plain'
            ? undefined
            : 'muted';

  if (eyebrow) {
    return (
      <div
        className="fact-item"
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        style={style}
        data-testid={testId}
      >
        <p className="eyebrow">{eyebrow}</p>
        <p className={className}>{children}</p>
      </div>
    );
  }

  return (
    <p
      className={className}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
      style={style}
      data-testid={testId}
    >
      {children}
    </p>
  );
}

export function Button({
  variant = 'secondary',
  active = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  active?: boolean;
}) {
  return (
    <button
      className={`button ${variant}${active ? ' active' : ''}`}
      {...props}
    />
  );
}

export function Tag({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: TagTone;
}) {
  return <span className={`tag${tone !== 'neutral' ? ` ${tone}` : ''}`}>{children}</span>;
}
export function Orbit({ animate = true }: { animate?: boolean }) {
  return <svg className={`orbit ${animate ? 'animate' : ''}`} viewBox="0 0 220 220" role="img" aria-label="Olho orbital do Horus">
    <circle className="orbit-track" cx="110" cy="110" r="92"/><circle className="orbit-track" cx="110" cy="110" r="70"/>
    <g className="orbit-rings"><ellipse cx="110" cy="110" rx="98" ry="38" transform="rotate(35 110 110)"/><ellipse cx="110" cy="110" rx="98" ry="38" transform="rotate(-35 110 110)"/><circle className="satellite" cx="110" cy="18" r="4"/></g>
    <path className="eye" d="M60 110 Q110 65 160 110 Q110 155 60 110 M110 94 A16 16 0 1 1 109.9 94 M110 126 L97 154 L119 143"/>
  </svg>;
}
export function Hero() {
  return <section className="hero"><div><p className="eyebrow accent">HORUS / CENTRAL AUDIOVISUAL</p><h1>Da referência<br/>à sua próxima história.</h1><p className="muted">Pesquise oportunidades, planeje vídeos originais e acompanhe sua produção audiovisual.</p></div><Orbit/></section>;
}
export type CardProps = (typeof cards)[number];
export function ProductionCard({ number, title, description, status, meta }: CardProps) {
  return <article className="production-card"><div className="card-number"><span>{number}</span></div><div className="card-body"><h3>{title}</h3><p className="muted description">{description}</p><Tag>{status}</Tag><p className="muted">{meta}</p><div className="card-actions"><Button variant="primary">{status === 'CONCLUÍDO' ? 'REVER' : status === 'EM ANDAMENTO' ? 'CONTINUAR' : 'ABRIR'}</Button><Button aria-label={`Mais opções de ${title}`}>···</Button></div></div></article>;
}
export function Home() {
  const [filter, setFilter] = useState('TODOS'); const [search, setSearch] = useState('');
  const visible = cards.filter(c => (filter === 'TODOS' || c.status === filter) && c.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <div className="page"><Hero/><div className="toolbar"><div className="segments" aria-label="Filtrar produções de exemplo">{['TODOS', ...statuses].map(s => <button key={s} aria-pressed={s === filter} onClick={() => setFilter(s)}>{s}</button>)}</div><label className="search"><span className="sr-only">Buscar produções de exemplo</span><input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)}/></label><Button variant="primary" disabled>NOVO VÍDEO</Button></div><p className="eyebrow">01 / PRODUÇÕES DE EXEMPLO</p><h2 className="sr-only">Produções de exemplo</h2><div className="cards">{visible.map(c => <ProductionCard key={c.number} {...c}/>)}</div>{visible.length === 0 && <p role="status">Nenhum exemplo encontrado.</p>}</div>;
}
export function List() {
  return <div className="page"><p className="eyebrow">02 / FILA DE PRODUÇÃO</p><h1>Da pauta à entrega.</h1><p className="muted">Dados fictícios para comparar densidade e organização.</p><h2 className="sr-only">Tabela da fila de produção</h2><div className="table-scroll"><table><thead><tr>{['VÍDEO', 'STATUS', 'PROGRESSO FICTÍCIO', 'PRAZO FICTÍCIO', 'AÇÃO'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{cards.map((c,i) => <tr key={c.number}><td><h3>{c.title}</h3><span className="muted">Descrição curta</span></td><td><Tag>{c.status}</Tag></td><td><label className="eyebrow">{[72,15,100,48,5,33][i]}%<progress aria-label={`Progresso fictício do vídeo ${i+1}`} max="100" value={[72,15,100,48,5,33][i]}/></label></td><td>{['Hoje','Amanhã','—','Sexta-feira','Próxima semana','Segunda-feira'][i]}</td><td><Button disabled>ABRIR</Button></td></tr>)}</tbody></table></div></div>;
}
export function Briefing() {
 return <article className="document-panel"><p className="eyebrow">03 / BRIEFING DE EXEMPLO</p><h1>Vídeo original: uma cidade em transformação</h1><p className="muted">Proposta editorial fictícia · nenhum vídeo em produção</p><hr/><p>Objetivo: apresentar uma transformação urbana com narrativa original, fontes identificadas e recursos visuais autorizados. Esta tela demonstra a organização de um briefing; não executa análise nem produção.</p><p>Formato proposto: vídeo narrado com gancho inicial, desenvolvimento em três blocos e encerramento. Duração, roteiro, título e thumbnail dependem de revisão editorial antes de qualquer execução.</p><aside><p className="eyebrow accent">REVISÃO EDITORIAL</p><p>Verificar afirmações factuais, originalidade e licenças antes de aprovar a versão do roteiro.</p></aside><div className="toolbar"><Button variant="primary" disabled>AÇÃO PRINCIPAL</Button><Button disabled>AÇÃO SECUNDÁRIA</Button></div></article>;
}
export function Settings({ theme, onThemeChange }: { theme?: string; onThemeChange?: (value: string) => void }) {
 return <section className="document-panel settings"><p className="eyebrow">04 / AJUSTES DE EXEMPLO</p><h1>Aparência</h1><p className="muted">Explore os controles. As opções são locais e não são salvas.</p><div className="segments" aria-label="Tema">{['system','light','dark'].map((t,i)=><button key={t} aria-pressed={theme === t} onClick={()=>onThemeChange?.(t)}>{['SISTEMA','CLARO','ESCURO'][i]}</button>)}</div><hr/><h2 style={{ fontSize: 'var(--TextH3)' }}>Controles de exemplo</h2><label>Campo de texto<input placeholder="Digite algo"/></label><label>Lista de seleção<select defaultValue="1"><option value="1">Opção de exemplo 1</option><option value="2">Opção de exemplo 2</option><option value="3">Opção de exemplo 3</option></select></label><label>Intensidade<input type="range" defaultValue="40"/></label><label className="check"><input type="checkbox" role="switch" defaultChecked/> Opção liga e desliga</label><label className="check"><input type="checkbox" defaultChecked/> Caixa de seleção de exemplo</label></section>;
}
export function Desktop({ initialPage = 'Início', onThemeChange, theme }: { initialPage?: string; theme?: string; onThemeChange?: (value: string) => void }) {
 const [page,setPage] = useState(initialPage);
 return <div className="desktop"><header><a className="wordmark" href="#" onClick={e=>{e.preventDefault();setPage('Início');}}>HORUS</a><nav aria-label="Navegação principal">{['Início','Produção','Briefing','Ajustes'].map(p=><button key={p} aria-current={page === p ? 'page' : undefined} onClick={()=>setPage(p)}>{p}</button>)}</nav><Tag>EM DESENVOLVIMENTO</Tag></header><main>{page === 'Início' ? <Home/> : page === 'Produção' ? <List/> : page === 'Briefing' ? <Briefing/> : <Settings theme={theme} onThemeChange={onThemeChange}/>}</main><footer>TELAS E DADOS FICTÍCIOS · LABORATÓRIO DE DESIGN</footer></div>;
}
const TYPOGRAPHY_TOKENS = [
  { token: '--FontDisplay', value: 'Archivo, Inter, sans-serif', usage: 'Títulos h1–h4 e marca HORUS' },
  { token: '--FontSans', value: 'Inter, sans-serif', usage: 'Corpo de leitura, roteiros e transcrições' },
  { token: '--FontMono', value: 'Geist, monospace', usage: 'Rótulos curtos (.eyebrow), .tag, .button, hashes e logs' },
  { token: '--TextH1', value: '26px', usage: 'Cabeçalho principal de página (h1)' },
  { token: '--TextH2', value: '21px', usage: 'Cabeçalho de seção / card principal (h2)' },
  { token: '--TextH3', value: '17px', usage: 'Subtítulo de bloco operacional (h3)' },
  { token: '--TextH4', value: '15px', usage: 'Subtítulo auxiliar de painel (h4)' },
  { token: '--TextBody', value: '14px', usage: 'Texto base da interface (.horus)' },
  { token: '--TextMeta', value: '12px', usage: 'Labels de formulário, tabelas (.data-table) e metadados (.small-text)' },
  { token: '--TextCode', value: '11px', usage: 'Botões (.button), logs técnicos (.logs) e rodapé' },
  { token: '--TextSm', value: '10px', usage: 'Eyebrows (.eyebrow) e cabeçalhos de tabela (th)' },
  { token: '--TextXs', value: '9px', usage: 'Tags (.tag), trilha de etapas (.steps li) e selos compactos' },
] as const;

const SPACING_TOKENS = [
  { token: '--Space1', px: 4, usage: 'Gaps mínimos entre tags/etapas (.steps)' },
  { token: '--Space2', px: 6, usage: 'Gaps internos de blocos densos (.fact-item, .info-block)' },
  { token: '--Space3', px: 8, usage: 'Gaps de listas, labels e passos do guia (.guide-steps)' },
  { token: '--Space4', px: 10, usage: 'Gaps padrão de linhas (.row, .actions, .stack) e células de tabela' },
  { token: '--Space5', px: 12, usage: 'Padding interno de .fact-item, .info-block e .card gap' },
  { token: '--Space6', px: 14, usage: 'Gap de grades (.info-grid) e padding de .logs' },
  { token: '--Space7', px: 16, usage: 'Gap de formulários (.form-row) e painéis (.guide-panel)' },
  { token: '--Space8', px: 20, usage: 'Padding de .card e botões (.button)' },
  { token: '--Space9', px: 24, usage: 'Padding de estado .loading e gap de .page' },
  { token: '--Space10', px: 28, usage: 'Padding de .page e .empty-state' },
  { token: '--Space11', px: 32, usage: 'Padding horizontal de página desktop' },
  { token: '--Space12', px: 36, usage: 'Altura mínima de alvo interativo (.button min-height: 36px)' },
] as const;

export function TypographyScaleDemo() {
  return (
    <section className="card" role="region" aria-label="Tokens de tipografia">
      <span className="eyebrow accent">TIPOGRAFIA DOCUMENTADA · TOKENS.CSS</span>
      <h3>Famílias e escala tipográfica canônica</h3>
      <div className="data-table-container">
        <table className="data-table" aria-label="Tabela de tokens tipográficos">
          <thead>
            <tr>
              <th scope="col">Token CSS</th>
              <th scope="col">Valor</th>
              <th scope="col">Aplicação na interface</th>
            </tr>
          </thead>
          <tbody>
            {TYPOGRAPHY_TOKENS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td><code>{item.value}</code></td>
                <td>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SpacingScaleDemo() {
  return (
    <section className="card" role="region" aria-label="Tokens de escala de espaçamento">
      <span className="eyebrow accent">ESCALA DE ESPAÇAMENTO · TOKENS.CSS</span>
      <h3>Unidades de ritmo espacial e densidade</h3>
      <div className="data-table-container">
        <table className="data-table" aria-label="Tabela de tokens de espaçamento">
          <thead>
            <tr>
              <th scope="col">Token CSS</th>
              <th scope="col">Medida</th>
              <th scope="col">Referência visual</th>
              <th scope="col">Uso principal</th>
            </tr>
          </thead>
          <tbody>
            {SPACING_TOKENS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td><code>{item.px}px</code></td>
                <td>
                  <div className="space-bar" style={{ width: `var(${item.token})` }} aria-hidden="true" />
                </td>
                <td>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Foundations() {
  return <div className="page foundations"><p className="eyebrow">HORUS / FUNDAMENTOS</p><h1>Geometria precisa.<br/>Espaço para criar.</h1><p className="muted">Uma identidade para o desktop e a web. Explore os temas na barra do Storybook.</p><h2>Paleta semântica</h2><div className="swatches">{['Background','Sunken','Ink','InkStrong','Muted','Faint','AccentInk','InvertBackground','Good','Warn','Bad','Line'].map(token=><div key={token}><span style={{background:`var(--${token})`}}/><code>--{token}</code></div>)}</div><h2>Tipografia</h2><p style={{ fontFamily: 'var(--FontDisplay)', fontSize: 'var(--TextH1)', fontWeight: 600, color: 'var(--InkStrong)', lineHeight: 1.1 }}>Archivo Expanded</p><p>Inter para roteiros, transcrições e revisões. Acentuação: narração, edição, produção.</p><p className="eyebrow">GEIST MONO / RÓTULOS CURTOS</p><TypographyScaleDemo/><SpacingScaleDemo/><h2>Princípios</h2><p>Linhas finas, cantos retos, uma cor de destaque e espaço para leitura. Movimento breve, sem distrações persistentes.</p><p>A referência visual canônica é <code>frontend/src/styles/tokens.css</code> e os componentes React do aplicativo (o legado C#/Avalonia foi removido em <code>cd365b1</code>). Mudanças aprovadas aqui devem ser adaptadas explicitamente à interface do aplicativo.</p></div>;
}
export function WebsiteConcept() {
 return <div className="website"><header><span className="wordmark">HORUS</span><Tag>PROPOSTA DE SITE</Tag></header><Hero/><section className="page"><p className="eyebrow">INTELIGÊNCIA AUDIOVISUAL</p><h2>Seu centro de produção audiovisual.</h2><p className="muted">Exploração visual do futuro site. O aplicativo está em desenvolvimento inicial; funcionalidades e lançamento ainda serão definidos.</p><div className="concept-grid"><article><span className="eyebrow">01 / CLAREZA</span><h3>Espaço para as ideias.</h3><p>Tipografia confortável e uma interface que deixa o conteúdo respirar.</p></article><article><span className="eyebrow">02 / IDENTIDADE</span><h3>Uma linguagem própria.</h3><p>Órbitas, linhas e índigo conectam desktop e web.</p></article></div></section><footer>HORUS · PROPOSTA VISUAL, SEM OPERAÇÕES DE PRODUÇÃO</footer></div>;
}

export function StatusTagPanel({ state = 'success' }: { state?: OperationalState }) {
  return (
    <div className="card" role="region" aria-label={`Tags e indicadores de status (${state})`}>
      <div className="row spread">
        <span className="eyebrow accent">TAGS E STATUS SEMÂNTICOS · {state.toUpperCase()}</span>
        <Tag tone="demo">publishable: false</Tag>
      </div>
      {state === 'loading' && (
        <div className="row" role="status" aria-live="polite" style={{ flexWrap: 'wrap' }}>
          <span>
            <span className="status-dot" />
            <Tag tone="warn">EM EXECUÇÃO (RENDER / QC)</Tag>
          </span>
          <Tag tone="simulated">VERIFICANDO AMBIENTE…</Tag>
          <Tag>NA FILA</Tag>
        </div>
      )}
      {state === 'error' && (
        <div className="row" role="alert" style={{ flexWrap: 'wrap' }}>
          <span>
            <span className="status-dot bad" />
            <Tag tone="bad">FALHOU (EXIT CODE 1)</Tag>
          </span>
          <Tag tone="bad">QC REPROVADO (STATUS: FAIL)</Tag>
          <Tag tone="warn">LICENÇA NÃO VERIFICADA</Tag>
        </div>
      )}
      {state === 'empty' && (
        <div className="row" role="status" style={{ flexWrap: 'wrap' }}>
          <Tag>SEM PRODUÇÃO REGISTRADA</Tag>
          <Tag>AGUARDANDO ROTEIRO APROVADO</Tag>
        </div>
      )}
      {state === 'success' && (
        <div className="row" role="status" style={{ flexWrap: 'wrap' }}>
          <span>
            <span className="status-dot good" />
            <Tag tone="good">APROVADO NA REVISÃO FINAL</Tag>
          </span>
          <Tag tone="good">PRONTO PARA PRODUZIR</Tag>
          <Tag tone="simulated">PILOTO LOCAL COM NARRAÇÃO</Tag>
        </div>
      )}
    </div>
  );
}

export function StatusMessagePanel({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="card"
      role="region"
      aria-label={`Componente StatusMessage (${state})`}
    >
      <div className="row spread">
        <div>
          <span className="eyebrow accent">COMPONENTE CANÔNICO · STATUSMESSAGE ({state.toUpperCase()})</span>
          <h3>Mensagens operacionais padronizadas (alinhado com StatusMessage.tsx)</h3>
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
          {state.toUpperCase()}
        </Tag>
      </div>

      {state === 'loading' && (
        <div className="stack">
          <StatusMessage state="loading">
            Carregando vídeos e verificando artefatos da produção local…
          </StatusMessage>
          <StatusMessage state="loading" eyebrow="VERIFICAÇÃO EM BLOCO (EYEBROW)">
            Consultando provedores locais de narração e disponibilidade do FFmpeg…
          </StatusMessage>
        </div>
      )}

      {state === 'error' && (
        <div className="stack">
          <StatusMessage state="error">
            Não foi possível carregar o relatório de qualidade (404): verifique os artefatos da execução.
          </StatusMessage>
          <StatusMessage state="error" eyebrow="FALHA DE VALIDAÇÃO OU REDE">
            Conflito de revisão (409): recarregue o estado atual antes de enviar nova decisão.
          </StatusMessage>
        </div>
      )}

      {state === 'empty' && (
        <div className="stack">
          <StatusMessage state="empty" role="status">
            Nenhum fluxo editorial registrado para os filtros selecionados.
          </StatusMessage>
          <StatusMessage state="empty" eyebrow="PRONTO PARA GERAR OU ESCREVER">
            Nenhuma versão de roteiro registrada ainda. Gere o roteiro simulado ou escreva manualmente.
          </StatusMessage>
        </div>
      )}

      {state === 'success' && (
        <div className="stack">
          <StatusMessage state="success" tone="good">
            Pacote de exportação pronto para download (SHA-256 verificado localmente).
          </StatusMessage>
          <StatusMessage state="success" eyebrow="ESTADO SINCRONIZADO" tone="plain">
            3 de 3 vídeos exibidos na Central de Produção. Voz padrão salva localmente.
          </StatusMessage>
        </div>
      )}
    </section>
  );
}

export function ActionButtonPanel({ state = 'success' }: { state?: OperationalState }) {
  return (
    <div className="card" role="region" aria-label={`Ações operacionais (${state})`}>
      <span className="eyebrow accent">BOTÕES E AÇÕES ASSÍNCRONAS · {state.toUpperCase()}</span>
      {state === 'loading' && (
        <>
          <div className="actions">
            <Button variant="primary" disabled aria-busy="true">
              Gerando pacote…
            </Button>
            <Button disabled>Cancelar job</Button>
          </div>
          <StatusMessage state="loading">
            Operação local em andamento; aguarde a confirmação do backend.
          </StatusMessage>
        </>
      )}
      {state === 'error' && (
        <>
          <div className="actions">
            <Button variant="primary">Tentar novamente</Button>
            <Button>Recarregar produção atual</Button>
          </div>
          <StatusMessage state="error">
            Conflito de versão ou hash (409): nova chave de idempotência pronta para reenvio.
          </StatusMessage>
        </>
      )}
      {state === 'empty' && (
        <>
          <div className="actions">
            <Button variant="primary" disabled>
              Exportar pacote
            </Button>
            <Button>Abrir Roteiro</Button>
          </div>
          <StatusMessage state="empty" role="status">
            Disponível somente após aprovação na revisão humana desta produção.
          </StatusMessage>
        </>
      )}
      {state === 'success' && (
        <>
          <div className="actions">
            <Button variant="primary">Exportar pacote</Button>
            <Button active>Prévia de vídeo (MP4)</Button>
            <Button>Baixar ZIP</Button>
          </div>
          <StatusMessage state="success" tone="good" ariaLive="polite">
            Pacote pronto para download (SHA-256 verificado localmente).
          </StatusMessage>
        </>
      )}
    </div>
  );
}

export function FactItemPanel({ state = 'success' }: { state?: OperationalState }) {
  return (
    <section
      className="fact-item"
      role="region"
      aria-label={`Painel fact-item de evidência (${state})`}
    >
      <div className="row spread">
        <span className="eyebrow accent">
          EVIDÊNCIA DE PRODUÇÃO E NARRAÇÃO · {state.toUpperCase()}
        </span>
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
            ? 'VERIFICADO POR HASH'
            : state === 'error'
              ? 'DIVERGÊNCIA DE HASH'
              : state === 'loading'
                ? 'CARREGANDO EVIDÊNCIA'
                : 'SEM ARTEFATO'}
        </Tag>
      </div>
      {state === 'loading' && (
        <p className="muted" role="status" aria-live="polite">
          Verificando narração completa e tempos de palavras em <code>pilot-evidence.json</code>…
        </p>
      )}
      {state === 'error' && (
        <p className="error" role="alert">
          Não foi possível ler <code>quality-report.json</code> (404): confira os artefatos da execução.
        </p>
      )}
      {state === 'empty' && (
        <p className="muted" role="status">
          Nenhuma seção de roteiro ou amostra de voz selecionada para esta revisão.
        </p>
      )}
      {state === 'success' && (
        <div className="info-grid">
          <div className="info-block">
            <span className="eyebrow">PROVEDOR DE VOZ LOCAL</span>
            <strong>Kokoro-82M · pf_dora (pt-BR)</strong>
            <small className="muted">TTS local sintético · sem envio para nuvem</small>
          </div>
          <div className="info-block">
            <span className="eyebrow">ARTEFATO DE VÍDEO ALVO</span>
            <strong>render/short.mp4 (1080×1920)</strong>
            <small className="muted">SHA-256: 8f9c2d1e4a7b… · Duração: 15,0 s</small>
          </div>
        </div>
      )}
    </section>
  );
}

export function AlertBlockerPanel({ state = 'success' }: { state?: OperationalState }) {
  if (state === 'loading') {
    return (
      <div className="summary-banner" role="status" aria-live="polite">
        <div className="summary-status-header">
          <span className="status-dot" />
          <span className="eyebrow accent">PRONTO PARA PRODUZIR?</span>
        </div>
        <h3 className="summary-title">Verificando ferramentas locais…</h3>
        <p className="muted">
          Consultando FFmpeg, CLI da fábrica, Remotion e motores de voz locais.
        </p>
      </div>
    );
  }
  if (state === 'error') {
    return (
      <div className="summary-banner blocked" role="alert">
        <div className="summary-status-header">
          <span className="status-dot bad" />
          <span className="eyebrow">DIAGNÓSTICO DE BLOQUEIO / FALHA</span>
          <Tag tone="bad">FALTA (1)</Tag>
        </div>
        <h3 className="summary-title">Ambiente local com pendência para render final</h3>
        <div className="blocker-item critical">
          <strong>FFmpeg (ffmpeg + ffprobe)</strong>
          <span className="error">
            Executável não localizado em HORUS_FFMPEG nem no PATH do sistema.
          </span>
        </div>
      </div>
    );
  }
  if (state === 'empty') {
    return (
      <div className="empty-state" role="status">
        <span className="eyebrow">NENHUM ALERTA OU BLOQUEIO ATIVO</span>
        <h3>Nenhuma verificação pendente neste momento</h3>
        <p className="muted">
          Inicie uma verificação em Ajustes ou abra uma produção na Central de Produção para
          inspecionar o relatório de qualidade (QC).
        </p>
      </div>
    );
  }
  return (
    <div className="summary-banner allowed" role="status">
      <div className="summary-status-header">
        <span className="status-dot good" />
        <span className="eyebrow">PRONTO PARA PRODUZIR?</span>
        <Tag tone="good">PRONTO (4/4)</Tag>
      </div>
      <h3 className="summary-title">Ambiente local verificado para produzir vídeo 1080×1920</h3>
      <div className="blocker-item warning">
        <strong>Aviso de revisão humana (publishable: false)</strong>
        <span className="muted">
          Mesmo com QC aprovado, a publicação manual exige conferência humana de licenças e
          divulgações obrigatórias.
        </span>
      </div>
    </div>
  );
}

export function OperationalDataTable({ state = 'success' }: { state?: OperationalState }) {
  const sampleRows = [
    {
      id: 'prod_01',
      title: 'Como garantir sincronismo real no Hórus',
      stage: 'Revisão',
      mode: 'PILOTO LOCAL',
      status: 'APROVADO',
      tone: 'good' as TagTone,
      sha: '9f8e7d6c5b4a…',
    },
    {
      id: 'prod_02',
      title: 'Arquitetura local e evidências auditáveis',
      stage: 'Render',
      mode: 'PILOTO LOCAL',
      status: 'EM EXECUÇÃO',
      tone: 'warn' as TagTone,
      sha: '3a2b1c0d9e8f…',
    },
    {
      id: 'prod_03',
      title: 'Checklist de licenças e proveniência',
      stage: 'Qualidade (QC)',
      mode: 'DEMO LOCAL',
      status: 'FALHOU',
      tone: 'bad' as TagTone,
      sha: '7c6d5e4f3a2b…',
    },
  ];

  return (
    <div className="card" role="region" aria-label={`Tabela de dados operacionais (${state})`}>
      <div className="row spread">
        <div>
          <span className="eyebrow accent">CENTRAL DE PRODUÇÃO · TABELA DE VÍDEOS</span>
          <h3>Execuções e artefatos verificáveis</h3>
        </div>
        <Tag>{state.toUpperCase()}</Tag>
      </div>

      {state === 'loading' && (
        <div className="loading" role="status" aria-live="polite">
          Carregando histórico de produções e artefatos verificados…
        </div>
      )}

      {state === 'error' && (
        <div className="blocker-item critical" role="alert">
          <strong>Não foi possível carregar a lista de produções (500)</strong>
          <span className="error">
            Verifique se o backend local está ativo em 127.0.0.1:8765 e tente novamente.
          </span>
        </div>
      )}

      {state === 'empty' && (
        <div className="empty-state" role="status">
          <span className="eyebrow">LISTA VAZIA</span>
          <h3>Nenhuma produção executada para este roteiro</h3>
          <p className="muted">
            Aprove a versão atual do roteiro e clique em Iniciar produção local para gerar os
            artefatos auditáveis.
          </p>
        </div>
      )}

      {state === 'success' && (
        <div className="data-table-container">
          <table className="data-table" aria-label="Tabela de produções demonstrativas">
            <thead>
              <tr>
                <th scope="col">Roteiro / Vídeo</th>
                <th scope="col">Modo</th>
                <th scope="col">Etapa</th>
                <th scope="col">Status</th>
                <th scope="col">SHA-256</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              {sampleRows.map(row => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.title}</strong>
                  </td>
                  <td>
                    <Tag tone="simulated">{row.mode}</Tag>
                  </td>
                  <td>{row.stage}</td>
                  <td>
                    <Tag tone={row.tone}>{row.status}</Tag>
                  </td>
                  <td>
                    <code>{row.sha}</code>
                  </td>
                  <td>
                    <Button style={{ padding: '4px 10px', minHeight: 28, fontSize: 10 }}>
                      Inspecionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
