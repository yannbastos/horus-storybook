import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationsCenterPreview } from './NotificationsCenter';
import type { NotificationsStoryState } from './NotificationsCenter';

const STATES: NotificationsStoryState[] = [
  'populated',
  'filtered-empty',
  'loading',
  'error',
  'empty',
];

const meta = {
  title: 'Componentes/Central de Notificações (NotificationsCenter)',
  component: NotificationsCenterPreview,
  tags: ['autodocs'],
  args: {
    state: 'populated',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado da central de notificações (populada, filtro vazio, carregando, erro, vazia)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Central de notificações na interface (HOR-098) alinhada com frontend/src/components/NotificationsCenter.tsx: sino com contador, filtros por não lidas e tipo, destaque para pendências, navegação direta para produção/roteiro/workflow e estados operacionais com StatusMessage.',
      },
    },
  },
} satisfies Meta<typeof NotificationsCenterPreview>;

export default meta;

export const Populada: StoryObj<typeof meta> = {
  name: '1. Populada com pendentes e não lidas',
  args: { state: 'populated' },
};

export const FiltroVazio: StoryObj<typeof meta> = {
  name: '2. Filtro sem correspondência',
  args: { state: 'filtered-empty' },
};

export const Carregando: StoryObj<typeof meta> = {
  name: '3. Carregando',
  args: { state: 'loading' },
};

export const Erro: StoryObj<typeof meta> = {
  name: '4. Erro ao carregar',
  args: { state: 'error' },
};

export const Vazia: StoryObj<typeof meta> = {
  name: '5. Lista vazia',
  args: { state: 'empty' },
};
