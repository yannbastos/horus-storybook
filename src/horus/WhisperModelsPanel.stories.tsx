import type { Meta, StoryObj } from '@storybook/react-vite';
import { WhisperModelsPanelPreview } from './WhisperModelsPanel';
import type { WhisperModelsStoryState } from './WhisperModelsPanel';

const STATES: WhisperModelsStoryState[] = [
  'ready-cuda',
  'missing-cuda-unavailable',
  'download-preview',
  'download-progress',
  'download-error',
  'import-error',
  'disconnected',
];

const meta = {
  title: 'Componentes/Modelos Whisper e CUDA (WhisperModelsPanel)',
  component: WhisperModelsPanelPreview,
  tags: ['autodocs'],
  args: {
    state: 'ready-cuda',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado do catálogo local de modelos Whisper e do runtime CUDA',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Gestão local de modelos Whisper (importação de pasta com confirmação de licença MIT, remoção com confirmação dupla, legado externo) e status do runtime CUDA em Ajustes.',
      },
    },
  },
} satisfies Meta<typeof WhisperModelsPanelPreview>;

export default meta;

export const ModelosECudaDisponiveis: StoryObj<typeof meta> = {
  name: '1. Modelos e CUDA disponíveis',
  args: { state: 'ready-cuda' },
};

export const CudaIndisponivel: StoryObj<typeof meta> = {
  name: '2. CUDA indisponível (fallback CPU)',
  args: { state: 'missing-cuda-unavailable' },
};

export const DownloadPreviaObrigatoria: StoryObj<typeof meta> = {
  name: '3. Prévia obrigatória de download',
  args: { state: 'download-preview' },
};

export const DownloadEmAndamento: StoryObj<typeof meta> = {
  name: '4. Download em andamento e cancelar',
  args: { state: 'download-progress' },
};

export const ErroDeDownload: StoryObj<typeof meta> = {
  name: '5. Erro acionável no download',
  args: { state: 'download-error' },
};

export const ErroDeImportacao: StoryObj<typeof meta> = {
  name: '6. Erro acionável na importação',
  args: { state: 'import-error' },
};

export const Desconectado: StoryObj<typeof meta> = {
  name: '7. Backend desconectado',
  args: { state: 'disconnected' },
};
