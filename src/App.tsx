import { useEffect, useState } from 'react';
import { Desktop } from './horus/Horus';
export default function App() {
 const [theme,setTheme]=useState('system');
 const [systemDark,setSystemDark]=useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
 useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const update=()=>setSystemDark(media.matches);media.addEventListener('change',update);return ()=>media.removeEventListener('change',update);},[]);
 return <div className="horus" data-theme={theme === 'system' ? (systemDark ? 'dark':'light') : theme}><Desktop theme={theme} onThemeChange={setTheme}/></div>;
}
