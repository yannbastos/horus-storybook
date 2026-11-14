import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FailureDiagnosticsPanelDemo,
  LicenseProvenancePanelDemo,
  ProductionProgressPanelDemo,
  QualityReportPanelDemo,
  ScriptEditorPanel,
  VoicePreviewRowPanel,
} from './FlowComponents';
import type { OperationalState } from './Horus';

const STATES: OperationalState[] = ['loading', 'error', 'empty', 'success'];

const meta = {
  title: 'Componentes/Fluxo de Produção e Revisão (4 Estados)',
  component: ScriptEditorPanel,
  tags: ['autodocs'],
  args: {
    state: 'success',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado operacional (loading, error, empty, success)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Componentes do fluxo completo (Editor de Roteiro, Linha de Voz com Prévia, Painel de QC, Painel de Licenças, Progresso da Produção e Bloco de Diagnóstico de Falha) nos 4 estados operacionais, usando a mesma fonte de tokens e tipografia do app.',
      },
    },
  },
} satisfies Meta<typeof ScriptEditorPanel>;

export default meta;

export const EditorDeRoteiroQuatroEstados: StoryObj<typeof meta> = {
  name: '1. Editor de Roteiro — Seção e Contadores (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ScriptEditorPanel key={state} state={state} />
      ))}
    </div>
  ),
};

export const LinhaDeVozComPreviaQuatroEstados: StoryObj<typeof meta> = {
  name: '2. Linha de Voz com Prévia (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <VoicePreviewRowPanel key={state} state={state} />
      ))}
    </div>
  ),
};

export const PainelDeQcQuatroEstados: StoryObj<typeof meta> = {
  name: '3. Painel de Qualidade — QC fail/warn/pass (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <QualityReportPanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const PainelDeLicencasQuatroEstados: StoryObj<typeof meta> = {
  name: '4. Painel de Licenças e Proveniência (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <LicenseProvenancePanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const ProgressoDaProducaoQuatroEstados: StoryObj<typeof meta> = {
  name: '5. Progresso da Produção — 7 Etapas (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ProductionProgressPanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const DiagnosticoDeFalhaQuatroEstados: StoryObj<typeof meta> = {
  name: '6. Bloco de Diagnóstico de Falha (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <FailureDiagnosticsPanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const FluxoCompletoPorEstado: StoryObj<typeof meta> = {
  name: '7. Fluxo Completo Interativo por Estado (Controls)',
  render: ({ state = 'success' }) => (
    <div className="page">
      <ScriptEditorPanel state={state} />
      <VoicePreviewRowPanel state={state} />
      <ProductionProgressPanelDemo state={state} />
      <QualityReportPanelDemo state={state} />
      <LicenseProvenancePanelDemo state={state} />
      <FailureDiagnosticsPanelDemo state={state} />
    </div>
  ),
};
