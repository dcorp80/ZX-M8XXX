        <div class="tab-content" id="tab-settings">
            <div class="settings-subtab-bar">
                <button class="settings-subtab-btn active" data-settingstab="display">Display</button>
                <button class="settings-subtab-btn" data-settingstab="input">Input</button>
                <button class="settings-subtab-btn" data-settingstab="media">Media</button>
                <button class="settings-subtab-btn" data-settingstab="audio">Audio</button>
                <button class="settings-subtab-btn" data-settingstab="machines">Machines</button>
                <button class="settings-subtab-btn" data-settingstab="signatures">Signatures</button>
            </div>

            <!-- Display Sub-tab -->
            <div class="settings-subtab-content active" id="settings-display">
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
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">ULA+ Palette (4 CLUTs × 16 colors)</div>
                        <div class="ulaplus-palette-grid" id="ulaplusPaletteGrid"></div>
                    </div>
                </div>
            </div>
            </div><!-- settings-display -->

            <!-- Input Sub-tab -->
            <div class="settings-subtab-content" id="settings-input">
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
                        <label class="checkbox-label" title="Swap left/right mouse buttons (bit0↔bit1)" style="margin-left: 15px;">
                            <input type="checkbox" id="chkMouseSwap" checked> Swap L/R
                        </label>
                        <label class="checkbox-label" title="Invert mouse wheel direction" style="margin-left: 15px;">
                            <input type="checkbox" id="chkMouseWheelSwap"> Swap Wheel
                        </label>
                        <span id="mouseStatus" style="margin-left: 10px; color: var(--text-dim); font-size: 11px;"></span>
                    </div>
                </div>
            </div>
            </div><!-- settings-input -->

            <!-- Media Sub-tab -->
            <div class="settings-subtab-content" id="settings-media">
            <div class="settings-tab-content">
                <div class="settings-section">
                    <div class="settings-row">
                        <span style="min-width: 80px;">Last File:</span>
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
                        <button id="btnTapePlay" class="control-btn" title="Play tape (real-time mode)">▶ Play</button>
                        <button id="btnTapeStop" class="control-btn" title="Stop tape playback" style="margin-left: 5px;">⏹ Stop</button>
                        <button id="btnTapeRewind" class="control-btn" title="Rewind tape to beginning" style="margin-left: 5px;">⏪ Rewind</button>
                        <span id="tapePosition" style="margin-left: 10px; color: var(--cyan); font-size: 11px;"></span>
                    </div>
                    <div class="settings-row">
                        <button id="btnBlankDisk" class="control-btn" title="Insert blank formatted disk">💾 Blank Disk</button>
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
                        <label for="driveSelectorSelect">Target drive:</label>
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
            <div class="settings-subtab-content" id="settings-audio">
            <div class="settings-tab-content">
                <div class="settings-section">
                    <div class="settings-row">
                        <label class="checkbox-label" title="Enable AY-3-8910 sound output">
                            <input type="checkbox" id="chkSound"> Sound
                        </label>
                        <label class="checkbox-label" title="Enable AY chip in 48K mode (like Melodik interface)" style="margin-left: 15px;">
                            <input type="checkbox" id="chkAY48k"> AY in 48K
                        </label>
                        <button id="btnMute" class="control-btn" style="margin-left: 15px;" title="Mute/unmute sound">🔊</button>
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
            <div class="settings-subtab-content" id="settings-machines">
            <div class="settings-tab-content">
                <div class="settings-section">
                    <div style="margin-bottom: 8px; color: var(--text-secondary); font-size: 11px;">Choose which machines appear in the toolbar dropdown:</div>
                    <div id="machineCheckboxes"></div>
                    <button id="btnSettingsLoadRoms" style="margin-top: 8px;">Load ROMs...</button>
                    <label class="checkbox-label" title="Late ULA timing (warm ULA behavior, +1 T-state shift). Real ULAs drift from early to late as they warm up." style="margin-top: 8px; display: inline-block;">
                        <input type="checkbox" id="chkLateTimings"> Late Timings
                    </label>
                    <div style="margin-top: 4px;">
                        <label class="checkbox-label" title="Enable Beta Disk interface for TR-DOS (requires trdos.rom). Always enabled for Pentagon." style="display: inline-block;">
                            <input type="checkbox" id="chkBetaDisk"> Beta Disk (TR-DOS)
                        </label>
                        <span id="betaDiskStatus" style="margin-left: 10px; color: var(--text-dim); font-size: 11px;"></span>
                    </div>
                </div>
            </div>
            </div><!-- settings-machines -->

            <!-- Signatures Sub-tab -->
            <div class="settings-subtab-content" id="settings-signatures">
            <div class="settings-tab-content">
                <div class="settings-section">
                    <div style="margin-bottom: 8px; color: var(--text-secondary); font-size: 11px;">Signature packs for automatic label/region recognition:</div>
                    <div class="settings-row" style="margin-bottom: 6px;">
                        <button id="btnSigImportSkool" title="Import .skool or .asm files from disk">Import File</button>
                        <button id="btnSigImportPack" title="Import a signature pack JSON file from disk">Import Pack</button>
                        <button id="btnSigGitHub" title="Browse a GitHub repository for disassembly sources (.asm, .skool, .a80, .json)">GitHub</button>
                        <button id="btnSigScanMemory" title="Scan current memory for matching signatures">Scan Memory</button>
                    </div>
                    <div id="sigGitHubBrowser" class="hidden" style="margin-top: 6px; padding: 6px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 3px;">
                        <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
                            <input id="sigGitHubUrl" type="text" placeholder="GitHub repo URL or owner/repo" style="flex: 1; padding: 4px 8px; font-size: 11px; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--bg-button); border-radius: 3px;">
                            <button id="btnSigGitHubFetch" style="font-size: 11px; padding: 3px 10px;">Browse</button>
                            <button id="btnSigGitHubClose" style="font-size: 11px; padding: 3px 6px;" title="Close">&times;</button>
                        </div>
                        <div id="sigGitHubStatus" style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px;"></div>
                        <div id="sigGitHubFileList" style="max-height: 200px; overflow-y: auto;"></div>
                        <div id="sigGitHubActions" class="hidden" style="margin-top: 6px; display: flex; gap: 6px; align-items: center;">
                            <button id="btnSigGitHubImport" style="font-size: 11px; padding: 3px 10px;">Import Selected</button>
                            <span id="sigGitHubSelected" style="font-size: 10px; color: var(--text-secondary);"></span>
                        </div>
                    </div>
                    <div id="sigPackList" style="margin-top: 6px;"></div>
                    <div id="sigScanResults" class="hidden" style="margin-top: 8px; padding: 6px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 3px; font-size: 11px; max-height: 33vh; overflow-y: auto;"></div>
                </div>
            </div>
            </div><!-- settings-signatures -->

        </div><!-- tab-settings -->
