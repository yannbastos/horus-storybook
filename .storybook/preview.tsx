import type { Preview } from '@storybook/react-vite';
import { ThemeFrame } from './ThemeFrame';
import '../src/horus/horus.css';
const preview: Preview = {
 globalTypes: { theme: { description: 'Tema do Horus', toolbar: { title: 'Tema', icon: 'circlehollow', items: [{value:'system',title:'Sistema'},{value:'light',title:'Claro'},{value:'dark',title:'Escuro'}], dynamicTitle:true } } },
 initialGlobals: { theme: 'system' },
 parameters: { layout:'fullscreen', controls:{ expanded:true }, a11y:{ test:'error' }, options:{ storySort:{ order:['Fundamentos','Componentes','Movimento','Telas','Site'] } } },
 decorators: [(Story, context)=><ThemeFrame selectedTheme={context.globals.theme}><Story/></ThemeFrame>],
};
export default preview;
