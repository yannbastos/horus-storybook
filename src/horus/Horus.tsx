import { useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './horus.css';
import { cards, statuses } from './data';

export function Button({ variant = 'secondary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return <button className={`button ${variant}`} {...props} />;
}
export function Tag({ children }: { children: ReactNode }) { return <span className="tag">{children}</span>; }
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
  return <div className="page"><Hero/><div className="toolbar"><div className="segments" aria-label="Filtrar produções de exemplo">{['TODOS', ...statuses].map(s => <button key={s} aria-pressed={s === filter} onClick={() => setFilter(s)}>{s}</button>)}</div><label className="search"><span className="sr-only">Buscar produções de exemplo</span><input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)}/></label><Button variant="primary" disabled>NOVO VÍDEO</Button></div><p className="eyebrow">01 / PRODUÇÕES DE EXEMPLO</p><div className="cards">{visible.map(c => <ProductionCard key={c.number} {...c}/>)}</div>{visible.length === 0 && <p role="status">Nenhum exemplo encontrado.</p>}</div>;
}
export function List() {
  return <div className="page"><p className="eyebrow">02 / FILA DE PRODUÇÃO</p><h1>Da pauta à entrega.</h1><p className="muted">Dados fictícios para comparar densidade e organização.</p><div className="table-scroll"><table><thead><tr>{['VÍDEO', 'STATUS', 'PROGRESSO FICTÍCIO', 'PRAZO FICTÍCIO', 'AÇÃO'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{cards.map((c,i) => <tr key={c.number}><td><h3>{c.title}</h3><span className="muted">Descrição curta</span></td><td><Tag>{c.status}</Tag></td><td><label className="eyebrow">{[72,15,100,48,5,33][i]}%<progress aria-label={`Progresso fictício do vídeo ${i+1}`} max="100" value={[72,15,100,48,5,33][i]}/></label></td><td>{['Hoje','Amanhã','—','Sexta-feira','Próxima semana','Segunda-feira'][i]}</td><td><Button disabled>ABRIR</Button></td></tr>)}</tbody></table></div></div>;
}
export function Briefing() {
 return <article className="document-panel"><p className="eyebrow">03 / BRIEFING DE EXEMPLO</p><h1>Vídeo original: uma cidade em transformação</h1><p className="muted">Proposta editorial fictícia · nenhum vídeo em produção</p><hr/><p>Objetivo: apresentar uma transformação urbana com narrativa original, fontes identificadas e recursos visuais autorizados. Esta tela demonstra a organização de um briefing; não executa análise nem produção.</p><p>Formato proposto: vídeo narrado com gancho inicial, desenvolvimento em três blocos e encerramento. Duração, roteiro, título e thumbnail dependem de revisão editorial antes de qualquer execução.</p><aside><p className="eyebrow accent">REVISÃO EDITORIAL</p><p>Verificar afirmações factuais, originalidade e licenças antes de aprovar a versão do roteiro.</p></aside><div className="toolbar"><Button variant="primary" disabled>AÇÃO PRINCIPAL</Button><Button disabled>AÇÃO SECUNDÁRIA</Button></div></article>;
}
export function Settings({ theme, onThemeChange }: { theme?: string; onThemeChange?: (value: string) => void }) {
 return <section className="document-panel settings"><p className="eyebrow">04 / AJUSTES DE EXEMPLO</p><h1>Aparência</h1><p className="muted">Explore os controles. As opções são locais e não são salvas.</p><div className="segments" aria-label="Tema">{['system','light','dark'].map((t,i)=><button key={t} aria-pressed={theme === t} onClick={()=>onThemeChange?.(t)}>{['SISTEMA','CLARO','ESCURO'][i]}</button>)}</div><hr/><h3>Controles de exemplo</h3><label>Campo de texto<input placeholder="Digite algo"/></label><label>Lista de seleção<select defaultValue="1"><option value="1">Opção de exemplo 1</option><option value="2">Opção de exemplo 2</option><option value="3">Opção de exemplo 3</option></select></label><label>Intensidade<input type="range" defaultValue="40"/></label><label className="check"><input type="checkbox" role="switch" defaultChecked/> Opção liga e desliga</label><label className="check"><input type="checkbox" defaultChecked/> Caixa de seleção de exemplo</label></section>;
}
export function Desktop({ initialPage = 'Início', onThemeChange, theme }: { initialPage?: string; theme?: string; onThemeChange?: (value: string) => void }) {
 const [page,setPage] = useState(initialPage);
 return <div className="desktop"><header><a className="wordmark" href="#" onClick={e=>{e.preventDefault();setPage('Início');}}>HORUS</a><nav aria-label="Navegação principal">{['Início','Produção','Briefing','Ajustes'].map(p=><button key={p} aria-current={page === p ? 'page' : undefined} onClick={()=>setPage(p)}>{p}</button>)}</nav><Tag>EM DESENVOLVIMENTO</Tag></header><main>{page === 'Início' ? <Home/> : page === 'Produção' ? <List/> : page === 'Briefing' ? <Briefing/> : <Settings theme={theme} onThemeChange={onThemeChange}/>}</main><footer>TELAS E DADOS FICTÍCIOS · LABORATÓRIO DE DESIGN</footer></div>;
}
export function Foundations() {
 return <div className="page foundations"><p className="eyebrow">HORUS / FUNDAMENTOS</p><h1>Geometria precisa.<br/>Espaço para criar.</h1><p className="muted">Uma identidade para o desktop e a web. Explore os temas na barra do Storybook.</p><h2>Paleta semântica</h2><div className="swatches">{['Background','Sunken','Ink','Muted','AccentInk','Good','Warn','Bad'].map(token=><div key={token}><span style={{background:`var(--${token})`}}/><code>{token}</code></div>)}</div><h2>Tipografia</h2><h1>Archivo Expanded</h1><p>Inter para roteiros, transcrições e revisões. Acentuação: narração, edição, produção.</p><p className="eyebrow">GEIST MONO / RÓTULOS CURTOS</p><h2>Princípios</h2><p>Linhas finas, cantos retos, uma cor de destaque e espaço para leitura. Movimento breve, sem distrações persistentes.</p><p>Os valores iniciais vêm de Theme/Tokens.axaml. Mudanças aprovadas aqui devem ser adaptadas explicitamente à interface do aplicativo.</p></div>;
}
export function WebsiteConcept() {
 return <div className="website"><header><span className="wordmark">HORUS</span><Tag>PROPOSTA DE SITE</Tag></header><Hero/><section className="page"><p className="eyebrow">INTELIGÊNCIA AUDIOVISUAL</p><h2>Seu centro de produção audiovisual.</h2><p className="muted">Exploração visual do futuro site. O aplicativo está em desenvolvimento inicial; funcionalidades e lançamento ainda serão definidos.</p><div className="concept-grid"><article><span className="eyebrow">01 / CLAREZA</span><h3>Espaço para as ideias.</h3><p>Tipografia confortável e uma interface que deixa o conteúdo respirar.</p></article><article><span className="eyebrow">02 / IDENTIDADE</span><h3>Uma linguagem própria.</h3><p>Órbitas, linhas e índigo conectam desktop e web.</p></article></div></section><footer>HORUS · PROPOSTA VISUAL, SEM OPERAÇÕES DE PRODUÇÃO</footer></div>;
}
