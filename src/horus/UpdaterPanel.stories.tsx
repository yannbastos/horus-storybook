import type { Meta, StoryObj } from '@storybook/react-vite';
import { UpdaterPanelPreview } from './UpdaterPanel';
import type { UpdaterStoryState } from './UpdaterPanel';

const STATES: UpdaterStoryState[] = [
  'disabled',
  'up_to_date',
  'available',
  'confirm_dialog',
  'blocked_job',
  'downloading',
  'error_signature',
  'error_downgrade',
  'error_network',
];

const meta = {
  title: 'Componentes/Atualizações em Ajustes (UpdaterPanel)',
  component: UpdaterPanelPreview,
  tags: ['autodocs'],
  args: {
    state: 'available',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado do atualizador desktop em Ajustes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Seção Atualizações em Ajustes (HOR-100): estado desabilitado, verificação automática opcional, atualização disponível com aviso discreto, diálogo de confirmação explícita, bloqueio por job ativo, progresso de download e erros por código.',
      },
    },
  },
} satisfies Meta<typeof UpdaterPanelPreview>;

export default meta;

export const DisponivelComAviso: StoryObj<typeof meta> = {
  name: '1. Atualização disponível e aviso',
  args: { state: 'available' },
};

export const ConfirmacaoExplicita: StoryObj<typeof meta> = {
  name: '2. Confirmação explícita de instalação',
  args: { state: 'confirm_dialog' },
};

export const BloqueadoPorJob: StoryObj<typeof meta> = {
  name: '3. Bloqueado por trabalho em andamento',
  args: { state: 'blocked_job' },
};

export const BaixandoPacote: StoryObj<typeof meta> = {
  name: '4. Progresso de download',
  args: { state: 'downloading' },
};

export const VersaoMaisRecente: StoryObj<typeof meta> = {
  name: '5. Versão mais recente',
  args: { state: 'up_to_date' },
};

export const CanalDesabilitado: StoryObj<typeof meta> = {
  name: '6. Canal não configurado (disabled)',
  args: { state: 'disabled' },
};

export const ErroAssinaturaInvalida: StoryObj<typeof meta> = {
  name: '7. Erro de assinatura inválida',
  args: { state: 'error_signature' },
};

export const ErroDowngradeRecusado: StoryObj<typeof meta> = {
  name: '8. Erro de downgrade recusado',
  args: { state: 'error_downgrade' },
};

export const ErroDeRede: StoryObj<typeof meta> = {
  name: '9. Erro de rede com retentativa',
  args: { state: 'error_network' },
};
