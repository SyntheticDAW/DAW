import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as AudioEngine from './lib/index.ts'
import { fdgs } from './lib/AudioEngine/JWI/CoreJWI.ts'
import { MidiClipSource } from './lib/AudioEngine/classes/sources/MidiClipSource.ts'
(window as any).fdgs = fdgs;
(window as any).a = AudioEngine;
(window as any).mcs = MidiClipSource;

// (window as any).init = init;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
