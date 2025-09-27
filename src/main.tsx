import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as AudioEngine from './lib/index.ts'
import { AudioEngineWasm, msgPackedPlugin } from './lib/AudioEngine/JWI/CoreJWI.ts'
// import { MidiClipSource } from './lib/AudioEngine/classes/sources/MidiClipSource.ts'
import { view128Samples } from './lib/util/encoding/128sampleread.ts'
(window as any).mpps = msgPackedPlugin;
(window as any).A = AudioEngineWasm;
(window as any).a = AudioEngine;
// (window as any).mcs = MidiClipSource;
(window as any).v128 = view128Samples;

document.title = "Synthetic | Home"
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
