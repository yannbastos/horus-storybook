import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CenterFiltersAndNoticeDemo,
  FailureDiagnosticsPanelDemo,
  FirstVideoGuideDemo,
  LicenseProvenancePanelDemo,
  MediaLibraryPlayerDemo,
  ProductionComparePanelDemo,
  ProductionExportPanelDemo,
  ProductionLaunchOptionsDemo,
  ProductionProgressPanelDemo,
  QualityReportPanelDemo,
  ScriptComparePanelDemo,
  ScriptEditorPanel,
  TimecodeReviewWorkspaceDemo,
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
          'Todos os componentes do fluxo completo de produção audiovisual (Guia do Primeiro Vídeo, Filtros e Avisos da Central, Editor de Roteiro, Comparação de Versões de Roteiro, Linha de Voz com Prévia, Opções de Lançamento da Produção, Progresso de 7 Etapas, Painel de QC, Painel de Licenças, Revisão por Timecode/Palavras, Comparação de Produções/Glossário, Exportação Auditável ZIP e Diagnóstico de Falha) nos 4 estados operacionais, alinhados ao StatusMessage e aos tokens de tokens.css.',
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

export const GuiaPrimeiroVideoQuatroEstados: StoryObj<typeof meta> = {
  name: '7. Guia Meu Primeiro Vídeo (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <FirstVideoGuideDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const FiltrosCentralEAvisosQuatroEstados: StoryObj<typeof meta> = {
  name: '8. Filtros da Central e Avisos de Produção (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <CenterFiltersAndNoticeDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const ComparacaoVersoesRoteiroQuatroEstados: StoryObj<typeof meta> = {
  name: '9. Comparar Versões do Roteiro (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ScriptComparePanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const OpcoesLancamentoProducaoQuatroEstados: StoryObj<typeof meta> = {
  name: '10. Voz e Qualidade do Piloto Local (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ProductionLaunchOptionsDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const RevisaoPorTimecodeEPalavrasQuatroEstados: StoryObj<typeof meta> = {
  name: '11. Revisão por Timecode e Linha de Palavras (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <TimecodeReviewWorkspaceDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const ComparacaoProducoesEGlossarioQuatroEstados: StoryObj<typeof meta> = {
  name: '12. Comparação de Produções e Glossário (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ProductionComparePanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const ExportacaoAuditavelPacoteQuatroEstados: StoryObj<typeof meta> = {
  name: '13. Exportação Auditável — Thumbnail, Metadados e ZIP (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ProductionExportPanelDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const BibliotecaEPlayerDeMidiaQuatroEstados: StoryObj<typeof meta> = {
  name: '14. Biblioteca de Mídia e Player Acessível — HOR-019 (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <MediaLibraryPlayerDemo key={state} state={state} />
      ))}
    </div>
  ),
};

export const FluxoCompletoPorEstado: StoryObj<typeof meta> = {
  name: '15. Fluxo Completo Interativo por Estado (Controls)',
  render: ({ state = 'success' }) => (
    <div className="page">
      <FirstVideoGuideDemo state={state} />
      <CenterFiltersAndNoticeDemo state={state} />
      <MediaLibraryPlayerDemo state={state} />
      <ScriptEditorPanel state={state} />
      <ScriptComparePanelDemo state={state} />
      <VoicePreviewRowPanel state={state} />
      <ProductionLaunchOptionsDemo state={state} />
      <ProductionProgressPanelDemo state={state} />
      <QualityReportPanelDemo state={state} />
      <LicenseProvenancePanelDemo state={state} />
      <TimecodeReviewWorkspaceDemo state={state} />
      <ProductionComparePanelDemo state={state} />
      <ProductionExportPanelDemo state={state} />
      <FailureDiagnosticsPanelDemo state={state} />
    </div>
  ),
};
