import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActionButtonPanel,
  AlertBlockerPanel,
  FactItemPanel,
  OperationalDataTable,
  StatusTagPanel,
} from './Horus';
import type { OperationalState } from './Horus';

const STATES: OperationalState[] = ['loading', 'error', 'empty', 'success'];

const meta = {
  title: 'Componentes/Blocos Operacionais (4 Estados)',
  component: FactItemPanel,
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
          'Componentes mais usados na Central de Produção, Roteiro, Narração e Revisão (Tag/Status, Botão de Ação, Painel Fact-Item, Bloco de Alerta/Erro e Tabela de Dados) nos 4 estados operacionais, compartilhando os tokens oficiais de tokens.css.',
      },
    },
  },
} satisfies Meta<typeof FactItemPanel>;

export default meta;

export const TagsDeStatusQuatroEstados: StoryObj<typeof meta> = {
  name: '1. Tag e Status (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <StatusTagPanel key={state} state={state} />
      ))}
    </div>
  ),
};

export const BotoesAssincronosQuatroEstados: StoryObj<typeof meta> = {
  name: '2. Botão e Ação Assíncrona (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <ActionButtonPanel key={state} state={state} />
      ))}
    </div>
  ),
};

export const PainelFactItemQuatroEstados: StoryObj<typeof meta> = {
  name: '3. Painel Fact-Item e Info-Block (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <FactItemPanel key={state} state={state} />
      ))}
    </div>
  ),
};

export const AlertaEBloqueioQuatroEstados: StoryObj<typeof meta> = {
  name: '4. Bloco de Alerta, Prontidão e Erro (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <AlertBlockerPanel key={state} state={state} />
      ))}
    </div>
  ),
};

export const TabelaDeDadosQuatroEstados: StoryObj<typeof meta> = {
  name: '5. Tabela de Dados Operacional (4 estados)',
  render: () => (
    <div className="page">
      {STATES.map(state => (
        <OperationalDataTable key={state} state={state} />
      ))}
    </div>
  ),
};

export const ControleInterativoPorEstado: StoryObj<typeof meta> = {
  name: '6. Visão Consolidada por Estado (Controls)',
  render: ({ state = 'success' }) => (
    <div className="page">
      <StatusTagPanel state={state} />
      <ActionButtonPanel state={state} />
      <FactItemPanel state={state} />
      <AlertBlockerPanel state={state} />
      <OperationalDataTable state={state} />
    </div>
  ),
};
