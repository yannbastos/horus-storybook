import type { Meta, StoryObj } from '@storybook/react-vite';
import { Foundations, Hero } from './Horus';
const meta = { title: 'Fundamentos/Identidade', component: Foundations, tags:['autodocs'] } satisfies Meta<typeof Foundations>;
export default meta;
export const Identidade: StoryObj<typeof meta> = {};
export const TemasLadoALado: StoryObj = { name:'Temas lado a lado', render:()=><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>{['light','dark'].map(t=><div key={t} className="horus" data-theme={t}><Hero/></div>)}</div> };
