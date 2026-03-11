import { mount } from 'svelte'
import App from './App.svelte'
import TopBar from './components/shell/TopBar.svelte'
import ScreenDisplay from './components/shell/ScreenDisplay.svelte'
import StatusBar from './components/shell/StatusBar.svelte'
import ControlPanel from './components/shell/ControlPanel.svelte'
import TabBar from './components/shell/TabBar.svelte'
import DebuggerTab from './components/tabs/DebuggerTab.svelte'
import AssemblerTab from './components/tabs/AssemblerTab.svelte'
import GraphicsTab from './components/tabs/GraphicsTab.svelte'
import InfoTab from './components/tabs/InfoTab.svelte'
import SettingsTab from './components/tabs/SettingsTab.svelte'
import ToolsTab from './components/tabs/ToolsTab.svelte'

// Mount all Svelte components first (synchronous) so DOM elements
// are available when js/main.js grabs them by ID.

// Shell components
mount(TopBar, { target: document.getElementById('topbar-mount')! })
mount(ScreenDisplay, { target: document.getElementById('screen-mount')! })
mount(StatusBar, { target: document.getElementById('statusbar-mount')! })
mount(ControlPanel, { target: document.getElementById('controls-mount')! })
mount(TabBar, { target: document.getElementById('tabbar-mount')! })

// Tab panels
mount(DebuggerTab, { target: document.getElementById('tab-debugger-mount')! })
mount(AssemblerTab, { target: document.getElementById('tab-assembler-mount')! })
mount(GraphicsTab, { target: document.getElementById('tab-graphics-mount')! })
mount(InfoTab, { target: document.getElementById('tab-info-mount')! })
mount(SettingsTab, { target: document.getElementById('tab-settings-mount')! })
mount(ToolsTab, { target: document.getElementById('tab-tools-mount')! })

// Modal dialogs
mount(App, { target: document.getElementById('svelte-app')! })

// Emulator core — dynamic import so it runs AFTER Svelte has rendered the DOM.
// js/main.js is a side-effect module (no exports): it imports core modules,
// creates the Spectrum instance, and wires up all event handlers.
import('../js/main.js')
