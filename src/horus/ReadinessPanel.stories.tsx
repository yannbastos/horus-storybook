import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReadinessPanelPreview } from './ReadinessPanel';
import type { ReadinessStoryState } from './ReadinessPanel';

const STATES: ReadinessStoryState[] = ['disconnected', 'missing', 'error', 'present'];

const meta = {
  title: 'Componentes/Prontidão da Primeira Execução (ReadinessPanel)',
  component: ReadinessPanelPreview,
  tags: ['autodocs'],
  args: {
    state: 'missing',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado do painel de prontidão (desconectado, ausentes, erro, presentes)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Painel de prontidão da primeira execução (HOR-100) alinhado com frontend/src/components/ReadinessPanel.tsx: explica o que já funciona, o que falta entre Whisper, Kokoro, yt-dlp e FFmpeg e orienta instalação local sem download automático.',
      },
    },
  },
} satisfies Meta<typeof ReadinessPanelPreview>;

export default meta;

export const Desconectado: StoryObj<typeof meta> = {
  name: '1. Desconectado',
  args: { state: 'disconnected' },
};

export const ComponentesAusentes: StoryObj<typeof meta> = {
  name: '2. Componentes opcionais ausentes',
  args: { state: 'missing' },
};

export const ErroDeDiagnostico: StoryObj<typeof meta> = {
  name: '3. Erro ao consultar /v1/diagnostics',
  args: { state: 'error' },
};

export const TodosPresentes: StoryObj<typeof meta> = {
  name: '4. Todos os componentes presentes',
  args: { state: 'present' },
};
