import type { Meta, StoryObj } from '@storybook/react-vite';
import { Foundations, Hero, SpacingScaleDemo, TypographyScaleDemo } from './Horus';
const meta = { title: 'Fundamentos/Identidade', component: Foundations, tags:['autodocs'] } satisfies Meta<typeof Foundations>;
export default meta;
export const Identidade: StoryObj<typeof meta> = {};
export const EscalaTipografica: StoryObj = { name: 'Tipografia e Tokens', render: () => <div className="page"><TypographyScaleDemo /></div> };
export const EscalaDeEspacamento: StoryObj = { name: 'Escala de Espaçamento', render: () => <div className="page"><SpacingScaleDemo /></div> };
export const TemasLadoALado: StoryObj = { name:'Temas lado a lado', render:()=><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>{['light','dark'].map(t=><div key={t} className="horus" data-theme={t}><Hero/></div>)}</div> };
