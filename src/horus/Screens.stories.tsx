import type { Meta, StoryObj } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { Desktop, Home, List, Reading, Settings } from './Horus';
const meta={title:'Telas/Aplicativo',component:Desktop,parameters:{docs:{description:{component:'Protótipos React com dados fictícios. Navegação, busca, filtros e controles funcionam apenas no navegador, sem persistência.'}}}} satisfies Meta<typeof Desktop>;
export default meta;


export const Navegavel: StoryObj<typeof meta>={render:function RenderDesktop() {const [globals,update]=useGlobals();return <Desktop theme={globals.theme} onThemeChange={theme=>update({theme})}/>;}};
export const Inicio: StoryObj={render:()=> <Home/>};
export const Lista: StoryObj={render:()=> <List/>};
export const Leitura: StoryObj={render:()=> <Reading/>};
export const Ajustes: StoryObj={render:function RenderSettings() {const [globals,update]=useGlobals();return <Settings theme={globals.theme} onThemeChange={theme=>update({theme})}/>;}};
export const JanelaEstreita: StoryObj={render:()=> <div style={{maxWidth:720,margin:'auto',border:'1px solid var(--Line)'}}><Desktop/></div>};
