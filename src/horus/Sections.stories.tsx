import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEMO_SECTION, SectionEmptyPreview } from './Sections';

const meta = {
  title: 'Componentes/Cabeçalho e Prévia de Seção (Sections)',
  component: SectionEmptyPreview,
  tags: ['autodocs'],
  args: {
    section: DEMO_SECTION,
  },
  parameters: {
    docs: {
      description: {
        component:
          'SectionHeader e Preview para seções em preparação alinhados com frontend/src/components/Sections.tsx.',
      },
    },
  },
} satisfies Meta<typeof SectionEmptyPreview>;

export default meta;

export const SecaoEmPreparacao: StoryObj<typeof meta> = {
  name: '1. Cabeçalho e Estado em Preparação',
};
