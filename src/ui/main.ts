import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { Spectrum } from '../core/spectrum'

const canvas = document.getElementById('screen') as HTMLCanvasElement
const overlayCanvas = document.getElementById('overlayCanvas') as HTMLCanvasElement

const emulator = new Spectrum(canvas, {
  machineType: localStorage.getItem('zx-machine-type') || '48k',
  tapeTrapsEnabled: true,
  overlayCanvas,
})

const app = mount(App, {
  target: document.getElementById('ui')!,
  props: { emulator },
})

export default app
