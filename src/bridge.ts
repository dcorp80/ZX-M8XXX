// Bridge between Svelte UI and existing vanilla JS modules.
// Phase 2: minimal — existing JS continues to use document.getElementById().
// Phase 3+: will expose typed APIs for Svelte components to call into core.

import type { EmulatorBridge } from './types/core'

let bridge: Partial<EmulatorBridge> = {}

/** Called by js/main.js after initialization to make core objects available to Svelte. */
export function setBridge(deps: Partial<EmulatorBridge>) {
    Object.assign(bridge, deps)
}

export function getSpectrum() { return bridge.spectrum }
export function getEmulatorControl() { return bridge.emulatorControl }
