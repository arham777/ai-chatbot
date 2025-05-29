import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

document.documentElement.classList.add('dark'); // Apply dark theme by default

createRoot(document.getElementById("root")!).render(<App />);
