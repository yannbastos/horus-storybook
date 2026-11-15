import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorCenterPreview } from './ErrorCenter';
import type { ErrorCenterStoryState } from './ErrorCenter';

const STATES: ErrorCenterStoryState[] = ['populated', 'empty', 'error', 'disconnected'];

const meta = {
  title: 'Componentes/Central de erros (ErrorCenter)',
  component: ErrorCenterPreview,
  tags: ['autodocs'],
  args: {
    state: 'populated',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado da Central de erros (populada, vazia, erro de consulta, desconectada)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Central de erros (HOR-095) alinhada com frontend/src/features/ErrorCenter.tsx: resumo por causa e etapa, lista filtrável, ação sugerida em destaque e link para produção, workflow ou tarefa.',
      },
    },
  },
} satisfies Meta<typeof ErrorCenterPreview>;

export default meta;

export const Populada: StoryObj<typeof meta> = {
  name: '1. Populada com resumo e ações',
  args: { state: 'populated' },
};

export const Vazia: StoryObj<typeof meta> = {
  name: '2. Nenhuma falha registrada',
  args: { state: 'empty' },
};

export const ErroDeConsulta: StoryObj<typeof meta> = {
  name: '3. Erro ao consultar /v1/errors',
  args: { state: 'error' },
};

export const Desconectada: StoryObj<typeof meta> = {
  name: '4. Backend desconectado',
  args: { state: 'disconnected' },
};
