import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, StatusMessage } from './Horus';
import type { OperationalState } from './Horus';
import {
  Dialog,
  FormField,
  OperationalList,
  PanelCard,
  StatusBadge,
  Tabs,
} from './DesignSystem';

const STATES: OperationalState[] = ['loading', 'error', 'empty', 'success'];

const SAMPLE_ITEMS = [
  {
    id: 'v-01',
    title: 'Piloto local — Abertura técnica',
    meta: 'Kokoro-82M · pf_dora · 1080×1920 · 42s',
    statusLabel: 'APROVADO',
    tone: 'good' as const,
  },
  {
    id: 'v-02',
    title: 'Revisão de legendas sincronizadas',
    meta: 'Whisper medium · pt-BR · 18 segmentos',
    statusLabel: 'RESSALVA QC',
    tone: 'warn' as const,
  },
  {
    id: 'v-03',
    title: 'Pacote de exportação local',
    meta: 'SHA-256 verificado · sem bloqueios',
    statusLabel: 'SIMULADO',
    tone: 'simulated' as const,
  },
];

const meta = {
  title: 'Design System/Padrões Canônicos',
  component: PanelCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Padrões canônicos do Hórus: botões, campos de formulário, cartões/painéis, listas, abas, diálogos, tags/badges e StatusMessage em todos os estados, temas claro/escuro e foco visível.',
      },
    },
  },
} satisfies Meta<typeof PanelCard>;

export default meta;

export const Botoes: StoryObj = {
  name: '1. Botões (Variantes e Estados)',
  render: () => (
    <div className="page">
      <section className="card">
        <p className="eyebrow muted">BOTÕES PADRONIZADOS</p>
        <h3>Primário, Secundário, Perigo, Desabilitado, Carregando e Compacto</h3>
        <div className="actions">
          <Button variant="primary">PRODUZIR VÍDEO</Button>
          <Button variant="secondary">SALVAR RASCUNHO</Button>
          <Button variant="danger">DESCARTAR PRODUÇÃO</Button>
          <Button variant="primary" disabled>
            DESABILITADO
          </Button>
          <Button variant="secondary" disabled>
            INDISPONÍVEL
          </Button>
          <Button variant="primary" loading>
            PROCESSANDO…
          </Button>
          <Button variant="secondary" active>
            SELECIONADO
          </Button>
          <Button variant="secondary" size="sm">
            COMPACTO (SM)
          </Button>
        </div>
      </section>
    </div>
  ),
};

export const CamposDeFormulario: StoryObj = {
  name: '2. Campos de Formulário (Rótulo, Ajuda, Erro)',
  render: () => (
    <div className="page">
      <section className="card">
        <p className="eyebrow muted">CAMPOS DE FORMULÁRIO</p>
        <h3>Rótulo, Texto de Ajuda, Validação de Erro e Desabilitado</h3>
        <div className="form-row">
          <FormField
            label="Título do projeto"
            required
            defaultValue="Hórus — Guia do primeiro vídeo"
            help="Use até 80 caracteres para identificação na Central de Produção."
          />
          <FormField
            label="Diretório de saída local"
            defaultValue="C:/Saida/invalido?"
            error="O caminho informado contém caracteres inválidos para exportação local."
          />
        </div>
        <div className="form-row">
          <FormField
            as="select"
            label="Voz local de narração"
            defaultValue="kokoro-pf-dora"
            options={[
              { value: 'kokoro-pf-dora', label: 'Kokoro-82M · pf_dora (pt-BR)' },
              { value: 'sapi-maria', label: 'Windows SAPI · Maria (pt-BR)' },
            ]}
            help="Execução 100% local, sem envio para nuvem."
          />
          <FormField
            as="textarea"
            label="Observações de revisão (desabilitado)"
            disabled
            defaultValue="Aprovação bloqueada enquanto o check de áudio estiver pendente."
          />
        </div>
      </section>
    </div>
  ),
};

export const CartoesEPaineis: StoryObj = {
  name: '3. Cartões e Painéis (4 Estados)',
  render: () => (
    <div className="page">
      <div className="info-grid">
        {STATES.map(state => (
          <PanelCard
            key={state}
            eyebrow={`ESTADO · ${state.toUpperCase()}`}
            title={`Prontidão do Piloto (${state})`}
            state={state}
            badge={
              state === 'success'
                ? { label: 'PRONTO', tone: 'good' }
                : state === 'error'
                  ? { label: 'BLOQUEADO', tone: 'bad' }
                  : undefined
            }
            description="Fábrica local, FFmpeg e voz Kokoro-82M verificados neste computador."
            actions={
              state === 'success' ? (
                <Button variant="primary" size="sm">
                  INICIAR PRODUÇÃO
                </Button>
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  ),
};

function ListasPreview() {
  const [selected, setSelected] = useState('v-01');
  return (
    <div className="page">
      <div className="stack">
        {STATES.map(state => (
          <div key={state} className="card">
            <p className="eyebrow muted">LISTA · {state.toUpperCase()}</p>
            <OperationalList
              ariaLabel={`Lista de produções (${state})`}
              state={state}
              items={SAMPLE_ITEMS}
              selectedId={selected}
              onSelect={setSelected}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const ListasOperacionais: StoryObj = {
  name: '4. Listas Operacionais (4 Estados)',
  render: () => <ListasPreview />,
};

export const AbasAcessiveis: StoryObj = {
  name: '5. Abas (Teclado e ARIA)',
  render: () => (
    <div className="page">
      <section className="card">
        <p className="eyebrow muted">NAVEGAÇÃO POR ABAS</p>
        <h3>Configurações e Inspeção</h3>
        <Tabs
          ariaLabel="Seções do painel"
          items={[
            {
              id: 'geral',
              label: 'GERAL',
              content: (
                <StatusMessage state="success" eyebrow="AMBIENTE LOCAL" tone="good">
                  Operação offline validada. Nenhuma credencial externa habilitada.
                </StatusMessage>
              ),
            },
            {
              id: 'voz',
              label: 'NARRAÇÃO',
              content: (
                <FormField
                  label="Taxa de fala"
                  defaultValue="1.0x"
                  help="Ajuste entre 0.85x e 1.25x mantendo naturalidade."
                />
              ),
            },
            {
              id: 'seguranca',
              label: 'PRIVACIDADE',
              content: (
                <StatusMessage state="empty" eyebrow="TRANSMISSÕES">
                  Zero transmissões externas registradas nesta sessão.
                </StatusMessage>
              ),
            },
          ]}
        />
      </section>
    </div>
  ),
};

export const DialogosModais: StoryObj = {
  name: '6. Diálogos (Confirmação e Perigo)',
  render: () => (
    <div className="page">
      <div className="compare-grid">
        <Dialog
          open
          inlinePreview
          eyebrow="APROVAÇÃO HUMANA"
          title="Confirmar exportação local"
          description="O pacote ZIP com vídeo, legendas e manifesto SHA-256 será gravado na pasta local."
          confirmLabel="EXPORTAR AGORA"
          confirmVariant="primary"
        />
        <Dialog
          open
          inlinePreview
          eyebrow="AÇÃO IRREVERSÍVEL"
          title="Excluir produção em rascunho"
          description="Esta ação remove os arquivos temporários desta execução local. O roteiro original será preservado."
          confirmLabel="EXCLUIR RASCUNHO"
          confirmVariant="danger"
        />
      </div>
    </div>
  ),
};

export const TagsEBadges: StoryObj = {
  name: '7. Tags e Badges Semânticos',
  render: () => (
    <div className="page">
      <section className="card">
        <p className="eyebrow muted">TAGS E STATUS BADGES</p>
        <h3>Variantes Semânticas e Indicadores de Estado</h3>
        <div className="actions">
          <StatusBadge label="NEUTRO" tone="neutral" />
          <StatusBadge label="APROVADO" tone="good" dotState="good" badgeState="active" />
          <StatusBadge label="RESSALVA QC" tone="warn" dotState="warn" badgeState="unverified" />
          <StatusBadge label="BLOQUEADO" tone="bad" dotState="bad" badgeState="blocked" />
          <StatusBadge label="SIMULADO" tone="simulated" badgeState="unavailable" />
          <StatusBadge label="DEMO" tone="demo" />
        </div>
      </section>
    </div>
  ),
};

export const StatusMessageTodosEstados: StoryObj = {
  name: '8. StatusMessage (Inline e Bloco · 4 Estados)',
  render: () => (
    <div className="page">
      <section className="card">
        <p className="eyebrow muted">STATUSMESSAGE · INLINE E BLOCO</p>
        <h3>Paridade com frontend/src/components/StatusMessage.tsx</h3>
        <div className="stack">
          <StatusMessage state="loading">Carregando status da fila local…</StatusMessage>
          <StatusMessage state="error">Falha ao conectar com o backend local (porta 8000).</StatusMessage>
          <StatusMessage state="empty">Nenhum arquivo na fila de transcrição.</StatusMessage>
          <StatusMessage state="success" tone="good">
            Verificação concluída sem violações.
          </StatusMessage>
          <StatusMessage state="success" eyebrow="PRONTIDÃO" tone="plain">
            Fábrica pronta para gerar o piloto local.
          </StatusMessage>
        </div>
      </section>
    </div>
  ),
};
