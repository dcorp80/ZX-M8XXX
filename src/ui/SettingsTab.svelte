<script lang="ts">
    type Subtab = 'display' | 'input' | 'media' | 'audio' | 'machines';

    let activeSubtab: Subtab = $state('display');

    const subtabs: { id: Subtab; label: string }[] = [
        { id: 'display', label: 'Display' },
        { id: 'input', label: 'Input' },
        { id: 'media', label: 'Media' },
        { id: 'audio', label: 'Audio' },
        { id: 'machines', label: 'Machines' },
    ];

    function selectSubtab(id: Subtab) {
        activeSubtab = id;
    }
</script>

<div class="tab-content" id="tab-settings">
    <div class="settings-subtab-bar">
        {#each subtabs as subtab}
            <button
                class="settings-subtab-btn"
                class:active={activeSubtab === subtab.id}
                data-settingstab={subtab.id}
                onclick={() => selectSubtab(subtab.id)}
            >
                {subtab.label}
            </button>
        {/each}
    </div>

    <!-- Display Sub-tab -->
    <div class="settings-subtab-content" class:active={activeSubtab === 'display'} id="settings-display">
    <div class="settings-tab-content">
        <div class="settings-section">
            <div class="settings-row">
                <select id="borderSizeSelect" title="Border size preset">
                    <option value="full" selected>Full border (352x312)</option>
                    <option value="normal">Normal (320x240)</option>
                    <option value="thick">Thick (352x288)</option>
                    <option value="medium">Medium (320x256)</option>
                    <option value="small">Small (288x224)</option>
                    <option value="none">None (256x192)</option>
                </select>
                <label class="checkbox-label" title="Invert screen colors" style="margin-left: 15px;">
                    <input type="checkbox" id="chkInvertDisplay"> Invert
                </label>
                <select id="overlaySelect" style="margin-left: 15px;" title="Overlay display mode">
                    <option value="normal" selected>Normal</option>
                    <option value="grid">Grid</option>
                    <option value="box">Box</option>
                    <option value="screen">Screen</option>
                    <option value="reveal">Reveal</option>
                    <option value="beam">Beam</option>
                    <option value="beamscreen">BeamScreen</option>
                    <option value="noattr">No Attr</option>
                    <option value="nobitmap">No Bitmap</option>
                </select>
                <span class="zoom-group" style="margin-left: 15px;">
                    Zoom:
                    <button id="zoom1" class="zoom-btn active" title="Zoom 1x">x1</button>
                    <button id="zoom2" class="zoom-btn" title="Zoom 2x">x2</button>
                    <button id="zoom3" class="zoom-btn" title="Zoom 3x">x3</button>
                </span>
                <label class="checkbox-label" title="Late ULA timing (warm ULA behavior, +1 T-state shift). Real ULAs drift from early to late as they warm up." style="margin-left: 5px; white-space: nowrap;">
                    <input type="checkbox" id="chkLateTimings"> Late Timings
                </label>
            </div>
            <div class="settings-row">
                <label for="paletteSelect">Color Palette:</label>
                <select id="paletteSelect">
                    <option value="default">Default</option>
                </select>
                <span style="margin-left: 15px;">
                    <label for="fullscreenMode">Fullscreen:</label>
                    <select id="fullscreenMode" title="Fullscreen aspect ratio mode">
                        <option value="crisp" selected>Crisp (integer scale)</option>
                        <option value="fit">Fit (keep aspect ratio)</option>
                        <option value="stretch">Stretch (fill screen)</option>
                    </select>
                </span>
            </div>
            <div class="palette-preview" id="palettePreview">
                <div class="palette-row">
                    <span class="palette-row-label">Normal</span>
                    <span class="palette-color" data-index="0"></span>
                    <span class="palette-color" data-index="1"></span>
                    <span class="palette-color" data-index="2"></span>
                    <span class="palette-color" data-index="3"></span>
                    <span class="palette-color" data-index="4"></span>
                    <span class="palette-color" data-index="5"></span>
                    <span class="palette-color" data-index="6"></span>
                    <span class="palette-color" data-index="7"></span>
                </div>
                <div class="palette-row">
                    <span class="palette-row-label">Bright</span>
                    <span class="palette-color" data-index="0" data-bright="true"></span>
                    <span class="palette-color" data-index="1" data-bright="true"></span>
                    <span class="palette-color" data-index="2" data-bright="true"></span>
                    <span class="palette-color" data-index="3" data-bright="true"></span>
                    <span class="palette-color" data-index="4" data-bright="true"></span>
                    <span class="palette-color" data-index="5" data-bright="true"></span>
                    <span class="palette-color" data-index="6" data-bright="true"></span>
                    <span class="palette-color" data-index="7" data-bright="true"></span>
                </div>
            </div>
            <div class="settings-row" style="margin-top: 10px;">
                <label class="checkbox-label" title="Enable ULAplus extended palette support (64 colors)">
                    <input type="checkbox" id="chkULAplus"> ULA+
                </label>
                <button id="btnResetULAplus" style="margin-left: 10px; padding: 2px 8px; font-size: 11px;" title="Reset ULAplus palette to defaults">Reset</button>
                <span id="ulaplusStatus" style="margin-left: 10px; color: var(--text-dim); font-size: 11px;"></span>
            </div>
            <div class="ulaplus-palette-preview hidden" id="ulaplusPalettePreview">
                <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">ULA+ Palette (4 CLUTs x 16 colors)</div>
                <div class="ulaplus-palette-grid" id="ulaplusPaletteGrid"></div>
            </div>
        </div>
    </div>
    </div><!-- settings-display -->

    <!-- Input Sub-tab -->
    <div class="settings-subtab-content" class:active={activeSubtab === 'input'} id="settings-input">
    <div class="settings-tab-content">
        <div class="settings-section">
            <div class="settings-row">
                <label class="checkbox-label">
                    <input type="checkbox" id="chkKempston"> Kempston Joystick (Numpad)
                </label>
                <label class="checkbox-label" title="Extended buttons: [ = C, ] = A, \ = Start" style="margin-left: 15px;">
                    <input type="checkbox" id="chkKempstonExtended"> Extended
                </label>
                <label class="checkbox-label" title="Use USB/Bluetooth gamepad for Kempston joystick" style="margin-left: 15px;">
                    <input type="checkbox" id="chkGamepad"> Gamepad
                </label>
                <button id="btnCalibrateGamepad" class="small-btn" style="margin-left: 5px; padding: 2px 6px; font-size: 11px;" title="Configure gamepad mapping">Calibrate</button>
                <span id="gamepadStatus" style="margin-left: 5px; color: var(--text-dim); font-size: 11px;"></span>
            </div>
            <div class="settings-row">
                <label class="checkbox-label" title="Click screen to capture mouse, Escape to release">
                    <input type="checkbox" id="chkKempstonMouse"> Kempston Mouse
                </label>
                <label class="checkbox-label" title="Mouse wheel on bits 7:4 of button port" style="margin-left: 15px;">
                    <input type="checkbox" id="chkMouseWheel"> Wheel
                </label>
                <span id="mouseStatus" style="margin-left: 10px; color: var(--text-dim); font-size: 11px;"></span>
            </div>
            <div class="settings-row">
                <label class="checkbox-label" title="Enable Beta Disk interface for TR-DOS (requires trdos.rom). Always enabled for Pentagon.">
                    <input type="checkbox" id="chkBetaDisk"> Beta Disk (TR-DOS)
                </label>
                <span id="betaDiskStatus" style="margin-left: 10px; color: var(--text-dim); font-size: 11px;"></span>
            </div>
        </div>
    </div>
    </div><!-- settings-input -->

    <!-- Media Sub-tab -->
    <div class="settings-subtab-content" class:active={activeSubtab === 'media'} id="settings-media">
    <div class="settings-tab-content">
        <div class="settings-section">
            <div class="settings-row">
                <button id="btnOpenRomDialog" class="control-btn" title="Open ROM selection dialog to load or replace ROM files">ROMs...</button>
            </div>
            <div class="settings-row">
                <label style="min-width: 80px;">Last File:</label>
                <span id="lastLoadedFile" style="color: var(--cyan); font-size: 11px;">—</span>
            </div>
            <div class="settings-row">
                <label class="checkbox-label" title="Flash load = instant (trap), unchecked = real-time with border stripes and sound">
                    <input type="checkbox" id="chkFlashLoad" checked> Flash Load
                </label>
                <span id="tapeLoadMode" style="margin-left: 10px; color: var(--text-dim); font-size: 11px;">(instant)</span>
                <label class="checkbox-label" title="Enable tape loading sounds (real-time mode)" style="margin-left: 15px;">
                    <input type="checkbox" id="chkTapeAudio" checked> Tape Sound
                </label>
                <label class="checkbox-label" title="Automatically type LOAD &quot;&quot; for tape files, boot TR-DOS for disk images" style="margin-left: 15px;">
                    <input type="checkbox" id="chkAutoLoad" checked> Auto Load
                </label>
            </div>
            <div class="settings-row">
                <button id="btnTapePlay" class="control-btn" title="Play tape (real-time mode)">&#9654; Play</button>
                <button id="btnTapeStop" class="control-btn" title="Stop tape playback" style="margin-left: 5px;">&#9209; Stop</button>
                <button id="btnTapeRewind" class="control-btn" title="Rewind tape to beginning" style="margin-left: 5px;">&#9194; Rewind</button>
                <span id="tapePosition" style="margin-left: 10px; color: var(--cyan); font-size: 11px;"></span>
            </div>
            <div class="settings-row">
                <button id="btnBlankDisk" class="control-btn" title="Insert blank formatted disk">&#128190; Blank Disk</button>
            </div>
            <div class="settings-row" style="margin-top: 10px;">
                <label for="bootTrdMode" style="min-width: 80px;">Boot File:</label>
                <select id="bootTrdMode" style="width: 120px;" title="How to handle boot file when loading TRD images">
                    <option value="none">No change</option>
                    <option value="add">Add boot</option>
                    <option value="replace">Replace boot</option>
                </select>
                <button id="btnSelectBootTrd" class="control-btn" style="margin-left: 10px;" title="Select TRD or Hobeta file containing boot file">Select...</button>
                <input type="file" id="bootTrdFile" accept=".trd,.$c,.$b,.$d,.$#,.hobeta" style="display: none;">
            </div>
            <div class="settings-row">
                <span id="bootTrdName" style="color: var(--text-dim); font-size: 11px; margin-left: 80px;">No boot file selected</span>
            </div>
            <div class="settings-row" id="driveSelector" style="display: none;">
                <label>Target drive:</label>
                <select id="driveSelectorSelect" style="margin-left: 4px; font-size: 11px;">
                    <option value="0">A:</option>
                    <option value="1">B:</option>
                    <option value="2">C:</option>
                    <option value="3">D:</option>
                </select>
            </div>
            <div id="mediaCatalogContainer" style="display: none; margin-top: 6px;">
                <div class="media-catalog-bar" id="mediaCatalogBar">
                    <button class="media-catalog-btn" id="mediaCatalogTapeBtn" data-catalog="tape" style="display: none;">Tape</button>
                    <button class="media-catalog-btn" id="mediaCatalogDiskBtn" data-catalog="disk" style="display: none;">Disk</button>
                    <span id="diskDriveTabs" style="display: none; margin-left: 4px;">
                        <!-- Drive tabs are dynamically generated by updateDiskDriveTabs() -->
                    </span>
                </div>
                <div id="tapeCatalog" style="max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 11px; display: none; border: 1px solid var(--border); border-top: none; border-radius: 0 0 3px 3px; padding: 2px 0;"></div>
                <div id="diskCatalog" style="max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 11px; display: none; border: 1px solid var(--border); border-top: none; border-radius: 0 0 3px 3px; padding: 2px 0;"></div>
            </div>
        </div>
    </div>
    </div><!-- settings-media -->

    <!-- Audio Sub-tab -->
    <div class="settings-subtab-content" class:active={activeSubtab === 'audio'} id="settings-audio">
    <div class="settings-tab-content">
        <div class="settings-section">
            <div class="settings-row">
                <label class="checkbox-label" title="Enable AY-3-8910 sound output">
                    <input type="checkbox" id="chkSound"> Sound
                </label>
                <label class="checkbox-label" title="Enable AY chip in 48K mode (like Melodik interface)" style="margin-left: 15px;">
                    <input type="checkbox" id="chkAY48k"> AY in 48K
                </label>
                <button id="btnMute" class="control-btn" style="margin-left: 15px;" title="Mute/unmute sound">&#128266;</button>
            </div>
            <div class="settings-row">
                <label for="volumeSlider" style="min-width: 60px;">Volume:</label>
                <input type="range" id="volumeSlider" min="0" max="100" value="50" style="width: 120px;">
                <span id="volumeValue" style="min-width: 35px; text-align: right;">50%</span>
            </div>
            <div class="settings-row">
                <label for="stereoMode">Stereo:</label>
                <select id="stereoMode" title="Stereo panning mode">
                    <option value="mono">Mono</option>
                    <option value="abc" selected>ABC (A-left, B-center, C-right)</option>
                    <option value="acb">ACB (A-left, C-center, B-right)</option>
                </select>
            </div>
        </div>
    </div>
    </div><!-- settings-audio -->

    <!-- Machines Sub-tab -->
    <div class="settings-subtab-content" class:active={activeSubtab === 'machines'} id="settings-machines">
    <div class="settings-tab-content">
        <div class="settings-section">
            <div style="margin-bottom: 8px; color: var(--text-secondary); font-size: 11px;">Choose which machines appear in the toolbar dropdown:</div>
            <div id="machineCheckboxes"></div>
            <button id="btnSettingsLoadRoms" style="margin-top: 8px;">Load ROMs...</button>
        </div>
    </div>
    </div><!-- settings-machines -->

</div><!-- tab-settings -->

<style>
    /* Settings Tab */
    #tab-settings {
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        padding-top: 0;
    }
    .settings-subtab-bar {
        display: flex;
        gap: 2px;
        border-bottom: 1px solid var(--bg-button);
        margin-bottom: 10px;
        padding: 0 10px;
        position: sticky;
        top: 0;
        background: var(--bg-secondary);
        z-index: 10;
    }
    .settings-subtab-btn {
        padding: 6px 16px;
        background: var(--bg-tertiary);
        border: 1px solid var(--bg-button);
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        color: var(--text-secondary);
        font-size: 12px;
        cursor: pointer;
        margin-bottom: -1px;
    }
    .settings-subtab-btn:hover {
        background: var(--bg-button);
        color: var(--text-primary);
    }
    .settings-subtab-btn.active {
        background: var(--bg-secondary);
        color: var(--cyan);
        border-bottom: 1px solid var(--bg-secondary);
    }
    .settings-subtab-content {
        display: none;
    }
    .settings-subtab-content.active {
        display: block;
    }
    .media-catalog-bar {
        display: flex;
        gap: 2px;
        margin-top: 6px;
        border-bottom: 1px solid var(--bg-button);
    }
    .media-catalog-btn {
        padding: 3px 10px;
        background: var(--bg-tertiary);
        border: 1px solid var(--bg-button);
        border-bottom: none;
        border-radius: 3px 3px 0 0;
        color: var(--text-secondary);
        font-size: 11px;
        cursor: pointer;
        margin-bottom: -1px;
    }
    .media-catalog-btn:hover {
        background: var(--bg-button);
        color: var(--text-primary);
    }
    .media-catalog-btn.active {
        background: var(--bg-secondary);
        color: var(--cyan);
        border-bottom: 1px solid var(--bg-secondary);
    }
    .settings-tab-content {
        padding: 15px;
        max-width: 720px;
    }
    .settings-tab-content h3 {
        margin: 0 0 15px 0;
        color: var(--accent);
        font-size: 16px;
    }
    .settings-section {
        margin-bottom: 15px;
        padding: 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .settings-section h4 {
        margin: -12px -12px 12px -12px;
        padding: 8px 12px;
        color: var(--cyan);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: var(--bg-button);
        border-radius: 3px 3px 0 0;
    }
    .settings-row {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .settings-row label:not(.checkbox-label) {
        min-width: 100px;
        color: var(--text-secondary);
        font-size: 12px;
    }
    .settings-row select {
        flex: 1;
        max-width: 200px;
        padding: 5px 10px;
        font-size: 12px;
    }
    .settings-section select {
        padding: 5px 10px;
        font-size: 12px;
    }
    .palette-preview {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
    }
    .palette-row {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    .palette-row-label {
        font-size: 10px;
        color: var(--text-secondary);
        width: 42px;
        text-align: right;
        margin-right: 4px;
    }
    .palette-color {
        width: 28px;
        height: 28px;
        border: 1px solid var(--border-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: bold;
        color: #000;
        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
    }
    .palette-color::after {
        content: attr(data-index);
        border-radius: 2px;
    }
    .ulaplus-palette-preview {
        margin-top: 10px;
        padding: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
    }
    .ulaplus-palette-grid {
        display: grid;
        grid-template-columns: repeat(16, 18px);
        gap: 2px;
    }
    .ulaplus-palette-cell {
        width: 18px;
        height: 18px;
        border: 1px solid var(--border-secondary);
    }
</style>
