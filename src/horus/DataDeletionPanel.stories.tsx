import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataDeletionPanelPreview } from './DataDeletionPanel';
import type { DataDeletionStoryState } from './DataDeletionPanel';

const STATES: DataDeletionStoryState[] = [
  'preview_ready',
  'preview_blocked',
  'deleted_production',
  'audit_history',
];

const meta = {
  title: 'Componentes/Exclusão Segura de Dados (DataDeletionPanel)',
  component: DataDeletionPanelPreview,
  tags: ['autodocs'],
  args: {
    state: 'preview_ready',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado da exclusão segura (preview_ready, preview_blocked, deleted_production, audit_history)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Fluxo de exclusão segura de dados locais (HOR-117): prévia com o que sai e o que permanece no banco, bloqueios, frase exata, quarentena recuperável e histórico com restauração.',
      },
    },
  },
} satisfies Meta<typeof DataDeletionPanelPreview>;

export default meta;

export const PreviaPronta: StoryObj<typeof meta> = {
  name: '1. Prévia pronta para confirmação',
  args: { state: 'preview_ready' },
};

export const PreviaBloqueada: StoryObj<typeof meta> = {
  name: '2. Prévia com bloqueio ativo',
  args: { state: 'preview_blocked' },
};

export const ProducaoExcluida: StoryObj<typeof meta> = {
  name: '3. Produção com arquivos excluídos',
  args: { state: 'deleted_production' },
};

export const HistoricoQuarentena: StoryObj<typeof meta> = {
  name: '4. Histórico e restauração da quarentena',
  args: { state: 'audit_history' },
};
