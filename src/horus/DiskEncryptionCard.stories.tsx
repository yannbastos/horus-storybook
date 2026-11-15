import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiskEncryptionCardPreview } from './DiskEncryptionCard';
import type { DiskEncryptionStoryState } from './DiskEncryptionCard';

const STATES: DiskEncryptionStoryState[] = ['encrypted', 'not_encrypted', 'unverified', 'missing'];

const meta = {
  title: 'Componentes/Criptografia do Volume (DiskEncryptionCard)',
  component: DiskEncryptionCardPreview,
  tags: ['autodocs'],
  args: {
    state: 'not_encrypted',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado da criptografia do volume (encrypted, not_encrypted, unverified, missing)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Aviso de criptografia de disco (HOR-119) alinhado com frontend/src/components/DiskEncryptionCard.tsx: informa sem bloquear e orienta ativação no Windows Pro e Home.',
      },
    },
  },
} satisfies Meta<typeof DiskEncryptionCardPreview>;

export default meta;

export const Criptografado: StoryObj<typeof meta> = {
  name: '1. Volume criptografado',
  args: { state: 'encrypted' },
};

export const SemCriptografia: StoryObj<typeof meta> = {
  name: '2. Sem criptografia',
  args: { state: 'not_encrypted' },
};

export const NaoVerificado: StoryObj<typeof meta> = {
  name: '3. Não verificado',
  args: { state: 'unverified' },
};

export const ChaveAusente: StoryObj<typeof meta> = {
  name: '4. Chave ausente (degradado)',
  args: { state: 'missing' },
};
