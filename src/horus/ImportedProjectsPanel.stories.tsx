import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImportedProjectsPanelPreview } from './ImportedProjectsPanel';
import type { ImportedProjectsStoryState } from './ImportedProjectsPanel';

const STATES: ImportedProjectsStoryState[] = [
  'with-detail',
  'empty',
  'import-conflict',
  'invalid-package',
];

const meta = {
  title: 'Componentes/Importação de Projetos (ImportedProjectsPanel)',
  component: ImportedProjectsPanelPreview,
  tags: ['autodocs'],
  args: {
    state: 'with-detail',
  },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      description: 'Estado da seção de importação e consulta histórica de projetos (.zip)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Importação de pacotes .zip exportados na Biblioteca com modo somente consulta (player, legendas, roteiro, QC, licenças e revisão históricos, sem aprovação, reexportação ou publicação).',
      },
    },
  },
} satisfies Meta<typeof ImportedProjectsPanelPreview>;

export default meta;

export const DetalheSomenteConsulta: StoryObj<typeof meta> = {
  name: '1. Detalhe somente consulta',
  args: { state: 'with-detail' },
};

export const ListaVazia: StoryObj<typeof meta> = {
  name: '2. Lista vazia',
  args: { state: 'empty' },
};

export const PacoteJaImportado: StoryObj<typeof meta> = {
  name: '3. Conflito 409 (já importado)',
  args: { state: 'import-conflict' },
};

export const PacoteInvalido: StoryObj<typeof meta> = {
  name: '4. Pacote inválido (422)',
  args: { state: 'invalid-package' },
};
