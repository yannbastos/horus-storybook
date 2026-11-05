import type { Meta, StoryObj } from '@storybook/react-vite';
import { Orbit } from './Horus';
export default {title:'Movimento/Olho orbital',component:Orbit,tags:['autodocs'],args:{animate:true},parameters:{layout:'centered',docs:{description:{component:'Entrada de 2,4 segundos, seguida de repouso. Respeita prefers-reduced-motion. Remonte a história para repetir.'}}}} satisfies Meta<typeof Orbit>;
export const Entrada: StoryObj<typeof Orbit>={};
export const Estatico: StoryObj<typeof Orbit>={args:{animate:false}};
