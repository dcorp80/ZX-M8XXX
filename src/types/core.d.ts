// Minimal type stubs for the vanilla JS emulator core.
// These will be fleshed out incrementally as Svelte components
// start consuming core APIs in later phases.

export interface Spectrum {
    loadFile(file: File): Promise<unknown>
    getFullState(): unknown
    setFullState(state: unknown): void
    reset(hard?: boolean): void
    pause(): void
    resume(): void
    isRunning(): boolean
    triggers: unknown[]
}

export interface EmulatorControl {
    pause(): void
    resume(): void
    reset(hard?: boolean): void
    stepInto(): void
    stepOver(): void
    runToBreakpoint(): void
}

// Bridge interface — populated by js/main.js after init, consumed by Svelte components
export interface EmulatorBridge {
    spectrum: Spectrum
    emulatorControl: EmulatorControl
}
