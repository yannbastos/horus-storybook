import type { Meta, StoryObj } from '@storybook/react-vite';
import { SecurityWidgetsShowcase } from './SecurityWidgets';
import type { BadgeState } from './SecurityWidgets';

const STATES: BadgeState[] = ['active', 'blocked', 'unverified', 'unavailable'];

const meta = {
  title: 'Componentes/Selos de Segurança (SecurityWidgets)',
  component: SecurityWidgetsShowcase,
  tags: ['autodocs'],
  args: {
    state: 'active',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado do selo de segurança (active, blocked, unverified, unavailable)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Selos de status e legenda de segurança alinhados com frontend/src/components/SecurityWidgets.tsx.',
      },
    },
  },
} satisfies Meta<typeof SecurityWidgetsShowcase>;

export default meta;

export const Ativo: StoryObj<typeof meta> = { args: { state: 'active' } };
export const Bloqueado: StoryObj<typeof meta> = { args: { state: 'blocked' } };
export const NaoVerificado: StoryObj<typeof meta> = { args: { state: 'unverified' } };
export const NaoDisponivel: StoryObj<typeof meta> = { args: { state: 'unavailable' } };
