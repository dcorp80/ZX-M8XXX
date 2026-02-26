/**
 * EmulatorController — typed API surface for UI components.
 * Thin wrapper around Spectrum that removes DOM coupling and provides
 * multi-subscriber events instead of single-callback properties.
 */

import { applyRoms as applyRomsToSpectrum } from './rom-loader';

export interface EmulatorController {
    // Lifecycle
    init(romUrl?: string): Promise<boolean>
    applyRoms(romData: Map<string, ArrayBuffer>): boolean
    readonly romLoaded: boolean
    start(force?: boolean): void
    stop(): void
    reset(): void
    toggle(): void
    isRunning(): boolean
    getFps(): number

    // Machine
    getMachineType(): string
    setMachineType(type: string, preserveRom?: boolean): void

    // ROM
    loadRom(source: any, bank?: number): Promise<void>
    getRomChecksum(): any

    // CPU State
    getState(): any
    peek(addr: number): number
    poke(addr: number, value: number): void

    // Display
    setZoom(zoom: number): void
    setGrid(enabled: boolean): void
    setOverlayMode(mode: string): void
    getScreenDimensions(): any
    renderAndCaptureScreen(): ImageData
    redraw(): void
    renderToScreen(): void

    // Palette
    getAvailablePalettes(): any[]
    applyPalette(id: string): void
    getCurrentPalette(): string

    // Speed
    setSpeed(speed: number): void

    // Timing
    setLateTimings(late: boolean): void
    setEarlyTimings(early: boolean): void
    getTstatesPerFrame(): number

    // Audio
    initAudio(): Promise<void>
    getAudio(): any

    // Input — UI pushes events, no document.addEventListener inside Spectrum
    handleKeyDown(e: KeyboardEvent): void
    handleKeyUp(e: KeyboardEvent): void
    kempstonState: number
    kempstonEnabled: boolean
    kempstonExtendedEnabled: boolean
    // Mouse
    updateMousePosition(dx: number, dy: number): void
    setMouseButton(button: number, pressed: boolean): void
    updateMouseWheel(delta: number): void
    kempstonMouseEnabled: boolean
    // Gamepad
    gamepadEnabled: boolean

    // Tape
    loadTape(data: ArrayBuffer, storeName?: string): void
    loadTZX(data: ArrayBuffer, storeName?: string): void
    playTape(): void
    stopTape(): void
    rewindTape(): void
    isTapePlaying(): boolean
    getTapePosition(): any
    getTapeBlock(): number
    setTapeBlock(n: number): void
    setTapeFlashLoad(flash: boolean): void
    getTapeFlashLoad(): boolean
    clearTape(): void

    // Disk
    loadDiskImage(data: ArrayBuffer, type: string, fileName: string, driveIndex?: number): void
    loadDSKImage(data: ArrayBuffer, fileName: string, driveIndex?: number): void
    bootPlus3Disk(): void
    bootTrdos(): void
    loadDiskFile(diskData: any, fileInfo: any, diskType: string): void
    loadFromDiskSelection(diskResult: any, index: number): void
    clearDisk(driveIndex: number, type: string): void

    // Media (project save/load)
    getLoadedMedia(): any
    setLoadedMedia(media: any): void
    clearLoadedMedia(): void

    // Snapshots
    saveSnapshot(format?: string): any
    loadSnapshot(data: ArrayBuffer): void
    loadZ80Snapshot(data: ArrayBuffer): void
    loadSZXSnapshot(data: ArrayBuffer): void
    createZ80Snapshot(): Uint8Array
    createSZXSnapshot(): Uint8Array

    // File loading (auto-detect)
    loadFileData(data: ArrayBuffer, fileName: string, driveIndex?: number): void
    loadFile(file: File, driveIndex?: number): Promise<void>

    // Debugger — stepping
    stepInto(): void
    stepOver(): void
    stepOutOfHalt(): void
    runToAddress(addr: number, maxCycles?: number): void
    runToInterrupt(maxCycles?: number): void
    runToRet(maxCycles?: number): void
    runTstates(tstates: number): void

    // Debugger — address parsing
    parseAddressSpec(spec: string): any
    getCurrentPageForAddr(addr: number): any

    // Contention
    setContention(enabled: boolean): void

    // Triggers (unified breakpoint system)
    addTrigger(trigger: any): void
    removeTrigger(index: number): void
    toggleTrigger(index: number): void
    getTriggers(type?: string): any[]
    clearTriggers(type?: string): void
    formatTrigger(t: any): string
    parseTriggerSpec(spec: string, defaultType?: string): any

    // Legacy breakpoint API
    addBreakpoint(spec: any): void
    removeBreakpoint(index: number): void
    toggleBreakpoint(addr: number): void
    hasBreakpoint(addr: number): boolean
    hasBreakpointAt(addr: number): boolean
    getBreakpoints(): any[]
    clearBreakpoints(): void
    formatBreakpoint(bp: any): string
    addBreakpointWithCondition(addrSpec: any, condition: any): void

    // Watchpoints
    addWatchpoint(spec: any, type?: string): void
    removeWatchpoint(index: number): void
    hasWatchpoint(addr: number): boolean
    getWatchpoint(addr: number): any
    getWatchpoints(): any[]
    clearWatchpoints(): void
    formatWatchpoint(wp: any): string

    // Port breakpoints
    addPortBreakpoint(spec: any, direction?: string): void
    removePortBreakpoint(index: number): void
    getPortBreakpoints(): any[]
    clearPortBreakpoints(): void
    formatPortBreakpoint(pb: any): string

    // Port logging
    setPortLogEnabled(enabled: boolean): void
    isPortLogEnabled(): boolean
    getPortLogCount(): number
    exportPortLog(filter?: string): any
    clearPortLog(): void
    addPortTraceFilter(spec: any): void
    removePortTraceFilter(index: number): void
    clearPortTraceFilters(): void
    getPortTraceFilters(): any[]

    // Auto memory mapping
    setAutoMapEnabled(enabled: boolean): void
    isAutoMapEnabled(): boolean
    getAutoMapData(): any
    getAutoMapStats(): any
    clearAutoMap(): void

    // RZX
    loadRZX(data: ArrayBuffer, skipSnapshot?: boolean): Promise<void>
    isRZXPlaying(): boolean
    getRZXFrame(): number
    getRZXTotalFrames(): number
    setRZXFrame(frame: number): void
    getRZXData(): any
    getRZXInstructions(): any
    setRZXInstructions(count: number): void
    rzxStop(): void
    rzxStartRecording(): void
    rzxStartRecordingNow(): void
    rzxStopRecording(): void
    rzxCancelRecording(): void
    isRZXRecording(): boolean
    getRZXRecordedFrameCount(): number
    rzxGetDebugLog(): string
    rzxSaveRecording(): Uint8Array | null
    rzxVerifyRecording(): any
    rzxAnalyze(data: ArrayBuffer): any

    // Events — multi-subscriber replacement for Spectrum's single callbacks
    on(event: string, callback: Function): void
    off(event: string, callback: Function): void

    // Direct access escape hatch (for debugger features not yet abstracted)
    readonly spectrum: any
}

// ---- Implementation ----

export class EmulatorControllerImpl implements EmulatorController {
    readonly spectrum: any;
    private listeners: Map<string, Set<Function>> = new Map();

    constructor(spectrum: any) {
        this.spectrum = spectrum;

        // Wire Spectrum's single-subscriber callbacks to multi-subscriber event emitter
        spectrum.onFrame = (count: number) => this.emit('frame', count);
        spectrum.onBreakpoint = (pc: number) => this.emit('breakpoint', pc);
        spectrum.onError = (e: any) => this.emit('error', e);
        spectrum.onRomLoaded = () => this.emit('romLoaded');
        spectrum.onTrigger = (info: any) => this.emit('trigger', info);
        spectrum.onWatchpoint = (info: any) => this.emit('watchpoint', info);
        spectrum.onPortBreakpoint = (info: any) => this.emit('portBreakpoint', info);
        spectrum.onRZXEnd = () => this.emit('rzxEnd');
    }

    // ---- Event emitter ----

    on(event: string, callback: Function) {
        let set = this.listeners.get(event);
        if (!set) {
            set = new Set();
            this.listeners.set(event, set);
        }
        set.add(callback);
    }

    off(event: string, callback: Function) {
        const set = this.listeners.get(event);
        if (set) set.delete(callback);
    }

    private emit(event: string, ...args: any[]) {
        const set = this.listeners.get(event);
        if (set) {
            for (const cb of set) cb(...args);
        }
    }

    // ---- Lifecycle ----

    init(romUrl?: string) { return this.spectrum.init(romUrl); }
    applyRoms(romData: Map<string, ArrayBuffer>) { return applyRomsToSpectrum(this.spectrum, romData); }
    get romLoaded() { return this.spectrum.romLoaded; }
    start(force?: boolean) { this.spectrum.start(force); }
    stop() { this.spectrum.stop(); }
    reset() { this.spectrum.reset(); }
    toggle() { this.spectrum.toggle(); }
    isRunning() { return this.spectrum.isRunning(); }
    getFps() { return this.spectrum.getFps(); }

    // ---- Machine ----

    getMachineType() { return this.spectrum.machineType; }
    setMachineType(type: string, preserveRom?: boolean) { this.spectrum.setMachineType(type, preserveRom); }

    // ---- ROM ----

    loadRom(source: any, bank?: number) { return this.spectrum.loadRom(source, bank); }
    getRomChecksum() { return this.spectrum.getRomChecksum(); }

    // ---- CPU State ----

    getState() { return this.spectrum.getState(); }
    peek(addr: number) { return this.spectrum.peek(addr); }
    poke(addr: number, value: number) { this.spectrum.poke(addr, value); }

    // ---- Display ----

    setZoom(zoom: number) { this.spectrum.setZoom(zoom); }
    setGrid(enabled: boolean) { this.spectrum.setGrid(enabled); }
    setOverlayMode(mode: string) { this.spectrum.setOverlayMode(mode); }
    getScreenDimensions() { return this.spectrum.getScreenDimensions(); }
    renderAndCaptureScreen() { return this.spectrum.renderAndCaptureScreen(); }
    redraw() { this.spectrum.redraw(); }
    renderToScreen() { this.spectrum.renderToScreen(); }

    // ---- Speed ----

    setSpeed(speed: number) { this.spectrum.setSpeed(speed); }

    // ---- Timing ----

    setLateTimings(late: boolean) { this.spectrum.setLateTimings(late); }
    setEarlyTimings(early: boolean) { this.spectrum.setEarlyTimings(early); }
    getTstatesPerFrame() { return this.spectrum.getTstatesPerFrame(); }

    // ---- Audio ----

    initAudio() { return this.spectrum.initAudio(); }
    getAudio() { return this.spectrum.getAudio(); }

    // ---- Input ----

    handleKeyDown(e: KeyboardEvent) { this.spectrum.handleKeyDown(e); }
    handleKeyUp(e: KeyboardEvent) { this.spectrum.handleKeyUp(e); }

    get kempstonState() { return this.spectrum.kempstonState; }
    set kempstonState(v: number) { this.spectrum.kempstonState = v; }

    get kempstonEnabled() { return this.spectrum.kempstonEnabled; }
    set kempstonEnabled(v: boolean) { this.spectrum.kempstonEnabled = v; }

    get kempstonExtendedEnabled() { return this.spectrum.kempstonExtendedEnabled; }
    set kempstonExtendedEnabled(v: boolean) { this.spectrum.kempstonExtendedEnabled = v; }

    updateMousePosition(dx: number, dy: number) { this.spectrum.updateMousePosition(dx, dy); }
    setMouseButton(button: number, pressed: boolean) { this.spectrum.setMouseButton(button, pressed); }
    updateMouseWheel(delta: number) { this.spectrum.updateMouseWheel(delta); }

    get kempstonMouseEnabled() { return this.spectrum.kempstonMouseEnabled; }
    set kempstonMouseEnabled(v: boolean) { this.spectrum.kempstonMouseEnabled = v; }

    get gamepadEnabled() { return this.spectrum.gamepadEnabled; }
    set gamepadEnabled(v: boolean) { this.spectrum.gamepadEnabled = v; }

    // ---- Tape ----

    loadTape(data: ArrayBuffer, storeName?: string) { this.spectrum.loadTape(data, storeName); }
    loadTZX(data: ArrayBuffer, storeName?: string) { this.spectrum.loadTZX(data, storeName); }
    playTape() { this.spectrum.playTape(); }
    stopTape() { this.spectrum.stopTape(); }
    rewindTape() { this.spectrum.rewindTape(); }
    isTapePlaying() { return this.spectrum.isTapePlaying(); }
    getTapePosition() { return this.spectrum.getTapePosition(); }
    getTapeBlock() { return this.spectrum.getTapeBlock(); }
    setTapeBlock(n: number) { this.spectrum.setTapeBlock(n); }
    setTapeFlashLoad(flash: boolean) { this.spectrum.setTapeFlashLoad(flash); }
    getTapeFlashLoad() { return this.spectrum.getTapeFlashLoad(); }
    clearTape() { this.spectrum.clearTape(); }

    // ---- Disk ----

    loadDiskImage(data: ArrayBuffer, type: string, fileName: string, driveIndex?: number) {
        this.spectrum.loadDiskImage(data, type, fileName, driveIndex);
    }
    loadDSKImage(data: ArrayBuffer, fileName: string, driveIndex?: number) {
        this.spectrum.loadDSKImage(data, fileName, driveIndex);
    }
    bootPlus3Disk() { this.spectrum.bootPlus3Disk(); }
    bootTrdos() { this.spectrum.bootTrdos(); }
    loadDiskFile(diskData: any, fileInfo: any, diskType: string) {
        this.spectrum.loadDiskFile(diskData, fileInfo, diskType);
    }
    loadFromDiskSelection(diskResult: any, index: number) {
        this.spectrum.loadFromDiskSelection(diskResult, index);
    }
    clearDisk(driveIndex: number, type: string) { this.spectrum.clearDisk(driveIndex, type); }

    // ---- Media ----

    getLoadedMedia() { return this.spectrum.getLoadedMedia(); }
    setLoadedMedia(media: any) { this.spectrum.setLoadedMedia(media); }
    clearLoadedMedia() { this.spectrum.clearLoadedMedia(); }

    // ---- Snapshots ----

    saveSnapshot(format?: string) { return this.spectrum.saveSnapshot(format); }
    loadSnapshot(data: ArrayBuffer) { this.spectrum.loadSnapshot(data); }
    loadZ80Snapshot(data: ArrayBuffer) { this.spectrum.loadZ80Snapshot(data); }
    loadSZXSnapshot(data: ArrayBuffer) { this.spectrum.loadSZXSnapshot(data); }
    createZ80Snapshot() { return this.spectrum.createZ80Snapshot(); }
    createSZXSnapshot() { return this.spectrum.createSZXSnapshot(); }

    // ---- File loading ----

    loadFileData(data: ArrayBuffer, fileName: string, driveIndex?: number) {
        this.spectrum.loadFileData(data, fileName, driveIndex);
    }
    loadFile(file: File, driveIndex?: number) { return this.spectrum.loadFile(file, driveIndex); }

    // ---- Debugger — stepping ----

    stepInto() { this.spectrum.stepInto(); }
    stepOver() { this.spectrum.stepOver(); }
    stepOutOfHalt() { this.spectrum.stepOutOfHalt(); }
    runToAddress(addr: number, maxCycles?: number) { this.spectrum.runToAddress(addr, maxCycles); }
    runToInterrupt(maxCycles?: number) { this.spectrum.runToInterrupt(maxCycles); }
    runToRet(maxCycles?: number) { this.spectrum.runToRet(maxCycles); }
    runTstates(tstates: number) { this.spectrum.runTstates(tstates); }

    // ---- Debugger — address parsing ----

    parseAddressSpec(spec: string) { return this.spectrum.parseAddressSpec(spec); }
    getCurrentPageForAddr(addr: number) { return this.spectrum.getCurrentPageForAddr(addr); }

    // ---- Contention ----

    setContention(enabled: boolean) { this.spectrum.setContention(enabled); }

    // ---- Triggers ----

    addTrigger(trigger: any) { this.spectrum.addTrigger(trigger); }
    removeTrigger(index: number) { this.spectrum.removeTrigger(index); }
    toggleTrigger(index: number) { this.spectrum.toggleTrigger(index); }
    getTriggers(type?: string) { return this.spectrum.getTriggers(type); }
    clearTriggers(type?: string) { this.spectrum.clearTriggers(type); }
    formatTrigger(t: any) { return this.spectrum.formatTrigger(t); }
    parseTriggerSpec(spec: string, defaultType?: string) { return this.spectrum.parseTriggerSpec(spec, defaultType); }

    // ---- Legacy breakpoint API ----

    addBreakpoint(spec: any) { this.spectrum.addBreakpoint(spec); }
    removeBreakpoint(index: number) { this.spectrum.removeBreakpoint(index); }
    toggleBreakpoint(addr: number) { this.spectrum.toggleBreakpoint(addr); }
    hasBreakpoint(addr: number) { return this.spectrum.hasBreakpoint(addr); }
    hasBreakpointAt(addr: number) { return this.spectrum.hasBreakpointAt(addr); }
    getBreakpoints() { return this.spectrum.getBreakpoints(); }
    clearBreakpoints() { this.spectrum.clearBreakpoints(); }
    formatBreakpoint(bp: any) { return this.spectrum.formatBreakpoint(bp); }
    addBreakpointWithCondition(addrSpec: any, condition: any) {
        this.spectrum.addBreakpointWithCondition(addrSpec, condition);
    }

    // ---- Watchpoints ----

    addWatchpoint(spec: any, type?: string) { this.spectrum.addWatchpoint(spec, type); }
    removeWatchpoint(index: number) { this.spectrum.removeWatchpoint(index); }
    hasWatchpoint(addr: number) { return this.spectrum.hasWatchpoint(addr); }
    getWatchpoint(addr: number) { return this.spectrum.getWatchpoint(addr); }
    getWatchpoints() { return this.spectrum.getWatchpoints(); }
    clearWatchpoints() { this.spectrum.clearWatchpoints(); }
    formatWatchpoint(wp: any) { return this.spectrum.formatWatchpoint(wp); }

    // ---- Port breakpoints ----

    addPortBreakpoint(spec: any, direction?: string) { this.spectrum.addPortBreakpoint(spec, direction); }
    removePortBreakpoint(index: number) { this.spectrum.removePortBreakpoint(index); }
    getPortBreakpoints() { return this.spectrum.getPortBreakpoints(); }
    clearPortBreakpoints() { this.spectrum.clearPortBreakpoints(); }
    formatPortBreakpoint(pb: any) { return this.spectrum.formatPortBreakpoint(pb); }

    // ---- Port logging ----

    setPortLogEnabled(enabled: boolean) { this.spectrum.setPortLogEnabled(enabled); }
    isPortLogEnabled() { return this.spectrum.isPortLogEnabled(); }
    getPortLogCount() { return this.spectrum.getPortLogCount(); }
    exportPortLog(filter?: string) { return this.spectrum.exportPortLog(filter); }
    clearPortLog() { this.spectrum.clearPortLog(); }
    addPortTraceFilter(spec: any) { this.spectrum.addPortTraceFilter(spec); }
    removePortTraceFilter(index: number) { this.spectrum.removePortTraceFilter(index); }
    clearPortTraceFilters() { this.spectrum.clearPortTraceFilters(); }
    getPortTraceFilters() { return this.spectrum.getPortTraceFilters(); }

    // ---- Auto memory mapping ----

    setAutoMapEnabled(enabled: boolean) { this.spectrum.setAutoMapEnabled(enabled); }
    isAutoMapEnabled() { return this.spectrum.isAutoMapEnabled(); }
    getAutoMapData() { return this.spectrum.getAutoMapData(); }
    getAutoMapStats() { return this.spectrum.getAutoMapStats(); }
    clearAutoMap() { this.spectrum.clearAutoMap(); }

    // ---- RZX ----

    loadRZX(data: ArrayBuffer, skipSnapshot?: boolean) { return this.spectrum.loadRZX(data, skipSnapshot); }
    isRZXPlaying() { return this.spectrum.isRZXPlaying(); }
    getRZXFrame() { return this.spectrum.getRZXFrame(); }
    getRZXTotalFrames() { return this.spectrum.getRZXTotalFrames(); }
    setRZXFrame(frame: number) { this.spectrum.setRZXFrame(frame); }
    getRZXData() { return this.spectrum.getRZXData(); }
    getRZXInstructions() { return this.spectrum.getRZXInstructions(); }
    setRZXInstructions(count: number) { this.spectrum.setRZXInstructions(count); }
    rzxStop() { this.spectrum.rzxStop(); }
    rzxStartRecording() { this.spectrum.rzxStartRecording(); }
    rzxStartRecordingNow() { this.spectrum.rzxStartRecordingNow(); }
    rzxStopRecording() { this.spectrum.rzxStopRecording(); }
    rzxCancelRecording() { this.spectrum.rzxCancelRecording(); }
    isRZXRecording() { return this.spectrum.isRZXRecording(); }
    getRZXRecordedFrameCount() { return this.spectrum.getRZXRecordedFrameCount(); }
    rzxGetDebugLog() { return this.spectrum.rzxGetDebugLog(); }
    rzxSaveRecording() { return this.spectrum.rzxSaveRecording(); }
    rzxVerifyRecording() { return this.spectrum.rzxVerifyRecording(); }
    rzxAnalyze(data: ArrayBuffer) { return this.spectrum.rzxAnalyze(data); }
}
