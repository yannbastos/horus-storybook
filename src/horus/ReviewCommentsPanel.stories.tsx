import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewCommentsPanelPreview } from './ReviewCommentsPanel';
import type { ReviewCommentsStoryState } from './ReviewCommentsPanel';

const STATES: ReviewCommentsStoryState[] = ['populated', 'empty', 'error'];

const meta = {
  title: 'Componentes/Comentários por Timecode e Versão (ReviewCommentsPanel)',
  component: ReviewCommentsPanelPreview,
  tags: ['autodocs'],
  args: {
    state: 'populated',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado do painel de comentários por timecode e versão',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Painel de comentários por timecode e versão (HOR-088) alinhado com frontend/src/features/production/ReviewCommentsPanel.tsx: criação no tempo atual do player, salto por timecode, distinção de outra versão, filtros e trilha de decisões.',
      },
    },
  },
} satisfies Meta<typeof ReviewCommentsPanelPreview>;

export default meta;

export const Populado: StoryObj<typeof meta> = {
  name: '1. Populado com versão atual e outra versão',
  args: { state: 'populated' },
};

export const Vazio: StoryObj<typeof meta> = {
  name: '2. Nenhum comentário encontrado',
  args: { state: 'empty' },
};

export const ErroDeLeitura: StoryObj<typeof meta> = {
  name: '3. Erro de conflito ou leitura',
  args: { state: 'error' },
};
