import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShortcutsHelpPreview } from './ShortcutsHelp';
import type { ShortcutsHelpStoryState } from './ShortcutsHelp';

const STATES: ShortcutsHelpStoryState[] = ['enabled', 'disabled'];

const meta = {
  title: 'Componentes/Ajuda de Atalhos (ShortcutsHelpModal)',
  component: ShortcutsHelpPreview,
  tags: ['autodocs'],
  args: {
    state: 'enabled',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado dos atalhos globais (ativados ou desativados nas preferências locais)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Painel de referência rápida de atalhos de teclado (HOR-101) alinhado com frontend/src/components/ShortcutsHelpModal.tsx: acessível por ?, com proteção contra campos de texto e leitores de tela.',
      },
    },
  },
} satisfies Meta<typeof ShortcutsHelpPreview>;

export default meta;

export const Ativados: StoryObj<typeof meta> = {
  name: '1. Atalhos ativados',
  args: { state: 'enabled' },
};

export const Desativados: StoryObj<typeof meta> = {
  name: '2. Atalhos desativados',
  args: { state: 'disabled' },
};
