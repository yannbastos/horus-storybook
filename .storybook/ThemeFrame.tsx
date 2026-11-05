import { useEffect, useState } from 'react';
export function ThemeFrame({ children, selectedTheme }: {children: React.ReactNode; selectedTheme: string}) {
 const [systemDark, setSystemDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
 useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const update=()=>setSystemDark(media.matches);media.addEventListener('change',update);return ()=>media.removeEventListener('change',update);},[]);
 const theme = selectedTheme === 'system' ? (systemDark ? 'dark' : 'light') : selectedTheme;
 return <div className="horus" data-theme={theme}>{children}</div>;
}
