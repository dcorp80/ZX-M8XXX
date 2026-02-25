<script lang="ts">
    let activeSubtab: 'explorer' | 'compare' | 'tests' | 'export' = $state('explorer');

    function switchSubtab(subtab: typeof activeSubtab) {
        activeSubtab = subtab;
    }
</script>

<div class="tab-content" id="tab-tools">
    <div class="tools-subtab-bar">
        <button class="tools-subtab-btn" class:active={activeSubtab === 'explorer'} data-toolstab="explorer" onclick={() => switchSubtab('explorer')}>Explorer</button>
        <button class="tools-subtab-btn" class:active={activeSubtab === 'compare'} data-toolstab="compare" onclick={() => switchSubtab('compare')}>Compare</button>
        <button class="tools-subtab-btn" class:active={activeSubtab === 'tests'} data-toolstab="tests" onclick={() => switchSubtab('tests')}>Tests</button>
        <button class="tools-subtab-btn" class:active={activeSubtab === 'export'} data-toolstab="export" onclick={() => switchSubtab('export')}>Export</button>
    </div>

    <!-- Tests Sub-tab -->
    <div class="tools-subtab-content" class:active={activeSubtab === 'tests'} id="tools-tests">
    <div class="tests-container">
        <!-- Controls Row -->
        <div class="tests-controls">
            <button id="btnRunSelectedTests" class="tests-btn primary" disabled>Run Selected</button>
            <button id="btnPreviewTest" class="tests-btn" disabled>Preview</button>
            <button id="btnAbortTests" class="tests-btn danger hidden">Abort</button>
            <button id="btnReloadTests" class="tests-btn">Reload</button>
            <label class="tests-checkbox-label" title="Highlight pixel differences with semi-transparent overlay">
                <input type="checkbox" id="chkHighlightDiff"> Highlight Diff
            </label>
            <a href="system-test.html" class="test-link" title="Run system tests">System Tests</a>
            <a href="fuse-test.html" class="test-link" title="Run FUSE Z80 CPU tests">FUSE Tests</a>
            <a href="asm-test.html" class="test-link" title="Run assembler tests">Assembler Tests</a>
            <span class="tests-status" id="testsStatus">Loading tests...</span>
        </div>

        <!-- Developer Note -->
        <div class="tests-note">This functionality is intended for emulator developers only, not for end users.</div>

        <!-- Test List -->
        <div class="tests-list-container">
            <div class="tests-category-tabs" id="testsCategoryTabs">
                <button class="tests-category-tab active" data-category="all">All</button>
                <button class="tests-category-tab" data-category="cpu">CPU</button>
                <button class="tests-category-tab" data-category="video">Video</button>
                <button class="tests-category-tab" data-category="ulaplus">ULA+</button>
                <button class="tests-category-tab" data-category="multicolor">Multicolor</button>
                <button class="tests-category-tab" data-category="rzx">RZX</button>
            </div>
            <table class="tests-table" id="testsTable">
                <thead>
                    <tr>
                        <th class="tests-col-check"><input type="checkbox" id="testsSelectAll" title="Select/deselect all"></th>
                        <th class="tests-col-name">Test Name</th>
                        <th class="tests-col-machine">Machine</th>
                        <th class="tests-col-file">File</th>
                        <th class="tests-col-result">Result</th>
                    </tr>
                </thead>
                <tbody id="testsTableBody">
                </tbody>
            </table>
        </div>

        <!-- Progress Section -->
        <div class="tests-progress hidden" id="testsProgressSection">
            <div class="tests-progress-header">
                <span id="testsProgressText">Test 1/5: ULA 48K Timing</span>
                <span id="testsProgressPercent">0%</span>
            </div>
            <div class="tests-progress-bar">
                <div class="tests-progress-fill" id="testsProgressFill" style="width: 0%"></div>
            </div>
            <div class="tests-progress-details">
                <span id="testsFrameCount">Frame: 0/500</span>
                <span id="testsTstateCount">T-states: 0</span>
            </div>
        </div>

        <!-- Preview Section (for calibration) -->
        <div class="tests-preview hidden" id="testsPreviewSection">
            <div class="tests-preview-header">
                <span>Frame: <strong id="testsPreviewFrame">0</strong></span>
                <div class="tests-preview-buttons">
                    <button id="btnPausePreview" class="tests-btn">Pause</button>
                    <button id="btnCopyFrame" class="tests-btn">Copy Frame#</button>
                    <button id="btnTestScreenshot" class="tests-btn">Screenshot</button>
                    <button id="btnStopPreview" class="tests-btn danger">Stop</button>
                </div>
            </div>
            <div class="tests-preview-canvas-container">
                <canvas id="testsPreviewCanvas" width="320" height="240"></canvas>
            </div>
            <div class="tests-preview-info" id="testsPreviewInfo"></div>
        </div>

        <!-- Comparison Section -->
        <div class="tests-comparison hidden" id="testsComparisonSection">
            <div class="tests-comparison-images">
                <div class="tests-comparison-panel">
                    <div class="tests-comparison-label">Expected (Pristine)</div>
                    <canvas id="testsExpectedCanvas" width="320" height="240"></canvas>
                </div>
                <div class="tests-comparison-panel">
                    <div class="tests-comparison-label">Actual (Current)</div>
                    <canvas id="testsActualCanvas" width="320" height="240"></canvas>
                </div>
            </div>
            <div class="tests-comparison-result" id="testsComparisonResult">
                No comparison yet
            </div>
        </div>

        <!-- Results Summary -->
        <div class="tests-summary hidden" id="testsSummarySection">
            <div class="tests-summary-header">Results Summary</div>
            <div class="tests-summary-stats">
                <span class="tests-stat passed"><span id="testsPassed">0</span> passed</span>
                <span class="tests-stat failed"><span id="testsFailed">0</span> failed</span>
                <span class="tests-stat skipped"><span id="testsSkipped">0</span> skipped</span>
                <span class="tests-stat time"><span id="testsTime">0.0</span>s</span>
                <span class="tests-stat fps"><span id="testsFps">0</span> fps</span>
            </div>
            <table class="tests-results-table" id="testsResultsTable">
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Result</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody id="testsResultsBody">
                </tbody>
            </table>
        </div>
    </div>
    </div><!-- tools-tests -->

    <!-- Compare Sub-tab Content -->
    <div class="tools-subtab-content" class:active={activeSubtab === 'compare'} id="tools-compare">
    <div class="compare-container" style="padding:10px;display:flex;flex-direction:column;gap:15px;max-width:1200px">

        <!-- Compare Mode Selection -->
        <div class="compare-mode" style="display:flex;gap:15px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer">
                <input type="radio" name="compareMode" value="sna-sna" checked> Snapshots
            </label>
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer">
                <input type="radio" name="compareMode" value="bin-bin"> Binaries
            </label>
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer">
                <input type="radio" name="compareMode" value="sna-emu"> Snapshot vs Emulator
            </label>
        </div>

        <!-- File Inputs -->
        <div class="compare-inputs" style="display:flex;gap:15px;flex-wrap:wrap">
            <div class="compare-file" style="flex:1;min-width:200px">
                <label style="display:block;margin-bottom:5px;color:var(--text-secondary);font-size:11px">File A:</label>
                <input type="file" id="compareFileA" accept=".sna,.z80,.szx,.rzx,.bin,.rom,.dat,*" style="width:100%">
            </div>
            <div class="compare-file" id="compareFileBContainer" style="flex:1;min-width:200px">
                <label style="display:block;margin-bottom:5px;color:var(--text-secondary);font-size:11px">File B:</label>
                <input type="file" id="compareFileB" accept=".sna,.z80,.szx,.rzx,.bin,.rom,.dat,*" style="width:100%">
            </div>
        </div>

        <!-- Compare Options -->
        <div class="compare-options" style="display:flex;gap:15px;flex-wrap:wrap;align-items:center">
            <button id="btnCompare" title="Compare selected files or states" style="padding:8px 20px;background:var(--accent);color:var(--bg-primary);border:none;border-radius:4px;cursor:pointer;font-size:12px">Compare</button>
            <label style="display:flex;align-items:center;gap:5px;font-size:12px">
                <input type="checkbox" id="chkCompareShowEqual"> Show equal values
            </label>
            <label style="display:flex;align-items:center;gap:5px;font-size:12px">
                <input type="checkbox" id="chkCompareHexDump" checked> Hex dump
            </label>
            <label style="display:flex;align-items:center;gap:5px;font-size:12px" title="Exclude $4000-$5AFF screen area (and $C000-$DAFF for 128K bank 7)">
                <input type="checkbox" id="chkCompareExcludeScreen" checked> Exclude screen
            </label>
        </div>

        <!-- Results -->
        <div class="compare-results" style="flex:1;overflow:auto">
            <!-- Register Comparison -->
            <div id="compareHeaderResults" style="display:none;margin-bottom:15px">
                <div id="compareHeaderTable" style="font-family:monospace;font-size:12px;background:var(--bg-secondary);padding:10px;border-radius:4px;max-height:200px;overflow:auto"></div>
            </div>

            <!-- Data/Memory Differences -->
            <div id="compareDataResults" style="display:none">
                <span id="compareDataTitle" style="display:none"></span>
                <div id="comparePagination" style="display:none;margin-bottom:8px;align-items:center;gap:10px;font-size:12px">
                    <button id="comparePrevPage" style="padding:4px 8px">&#9668; Prev</button>
                    <span id="comparePageInfo" style="color:var(--text-secondary)">Page 1 / 1</span>
                    <button id="compareNextPage" style="padding:4px 8px">Next &#9658;</button>
                    <span style="color:var(--text-secondary);margin-left:10px">Go to:</span>
                    <input type="number" id="compareGoToPage" min="1" style="width:60px;padding:2px 4px;font-size:12px">
                    <button id="compareGoPage" style="padding:4px 8px">Go</button>
                    <span id="compareDiffCount" style="margin-left:15px;color:var(--yellow);font-size:12px"></span>
                </div>
                <div id="compareDiffCountNoPage" style="display:none;margin-bottom:8px;color:var(--yellow);font-size:12px"></div>
                <div id="compareDataTable" style="font-family:monospace;font-size:12px;background:var(--bg-secondary);padding:10px;border-radius:4px;max-height:400px;overflow:auto"></div>
            </div>

            <!-- No differences message -->
            <div id="compareNoResults" style="display:none;text-align:center;padding:40px;color:var(--green)">
                <span style="font-size:24px">&#10003;</span><br>
                Files are identical
            </div>
        </div>
    </div>
    </div><!-- tools-compare -->

    <!-- Explorer Sub-tab Content -->
    <div class="tools-subtab-content" class:active={activeSubtab === 'explorer'} id="tools-explorer">
    <div class="explorer-container">
        <!-- Controls Row -->
        <div class="explorer-controls">
            <input type="file" id="explorerFileInput" accept=".tap,.tzx,.sna,.z80,.szx,.rzx,.trd,.scl,.dsk,.zip" style="display:none">
            <button id="btnExplorerLoad" class="explorer-btn primary">Load File</button>
            <span id="explorerFileName" class="explorer-file-info">No file loaded</span>
            <span id="explorerFileSize" class="explorer-file-size"></span>
        </div>

        <!-- Sub-tabs -->
        <div class="explorer-subtabs">
            <button class="explorer-subtab active" data-subtab="info">File Info</button>
            <button class="explorer-subtab" data-subtab="basic">BASIC</button>
            <button class="explorer-subtab" data-subtab="disasm">Disasm</button>
            <button class="explorer-subtab" data-subtab="hexdump">Hex Dump</button>
        </div>

        <!-- Sub-tab Content -->
        <div class="explorer-content">
            <!-- File Info Sub-tab -->
            <div class="explorer-subtab-content active" id="explorer-info">
                <div class="explorer-info-row">
                    <div id="explorerInfoOutput" class="explorer-output">
                        <span class="explorer-empty">Load a file to view its structure</span>
                    </div>
                    <div id="explorerPreviewContainer" class="explorer-preview" style="display:none">
                        <canvas id="explorerPreviewCanvas" width="256" height="192"></canvas>
                        <div id="explorerPreviewLabel" class="explorer-preview-label"></div>
                    </div>
                </div>
            </div>

            <!-- BASIC Sub-tab -->
            <div class="explorer-subtab-content" id="explorer-basic" style="display:none">
                <div class="explorer-controls" style="margin-bottom:10px">
                    <span class="explorer-label">Source:</span>
                    <select id="explorerBasicSource" class="explorer-select"></select>
                    <button id="btnExplorerBasic" class="explorer-btn">Decode</button>
                </div>
                <div id="explorerBasicOutput" class="explorer-output">
                    <span class="explorer-empty">Select a BASIC program and click Decode</span>
                </div>
            </div>

            <!-- Disasm Sub-tab -->
            <div class="explorer-subtab-content" id="explorer-disasm" style="display:none">
                <div class="explorer-controls" style="margin-bottom:10px">
                    <span class="explorer-label">Source:</span>
                    <select id="explorerDisasmSource" class="explorer-select"></select>
                    <span class="explorer-label">Address:</span>
                    <input type="text" id="explorerDisasmAddr" value="0000" maxlength="4" class="explorer-input addr">
                    <span class="explorer-label">Length:</span>
                    <input type="number" id="explorerDisasmLen" value="256" min="1" max="65536" class="explorer-input len">
                    <button id="btnExplorerDisasm" class="explorer-btn">Disassemble</button>
                </div>
                <div id="explorerDisasmOutput" class="explorer-output">
                    <span class="explorer-empty">Select a source and click Disassemble</span>
                </div>
            </div>

            <!-- Hex Dump Sub-tab -->
            <div class="explorer-subtab-content" id="explorer-hexdump" style="display:none">
                <div class="explorer-controls" style="margin-bottom:10px">
                    <span class="explorer-label">Source:</span>
                    <select id="explorerHexSource" class="explorer-select"></select>
                    <span class="explorer-label">Address:</span>
                    <input type="text" id="explorerHexAddr" value="0000" maxlength="4" class="explorer-input addr">
                    <span class="explorer-label">Length:</span>
                    <input type="number" id="explorerHexLen" value="256" min="16" max="65536" class="explorer-input len">
                    <button id="btnExplorerHex" class="explorer-btn">View</button>
                </div>
                <div id="explorerHexOutput" class="explorer-output">
                    <span class="explorer-empty">Select a source and click View</span>
                </div>
            </div>
        </div>
    </div>
    </div><!-- tools-explorer -->

    <!-- Export Sub-tab -->
    <div class="tools-subtab-content" class:active={activeSubtab === 'export'} id="tools-export">
    <div class="settings-tab-content">
        <div class="settings-section full-width">
            <div class="settings-row">
                <button id="btnScreenshot" title="Export current screen in selected format">Export</button>
            </div>
            <div class="settings-row">
                <label for="frameExportFormat">Format:</label>
                <select id="frameExportFormat">
                    <option value="png">PNG</option>
                    <option value="scr">SCR (screen only)</option>
                    <option value="bsc">BSC (with border)</option>
                    <option value="zip">ZIP (PNG sequence)</option>
                    <option value="gif">Animated GIF</option>
                    <option value="sca">SCA (animation)</option>
                </select>
                <label for="maxFrames" style="min-width: auto; margin-left: 10px; margin-right: -6px;">Max:</label>
                <input type="number" id="maxFrames" value="0" min="0" style="width: 50px;">
                <span style="color: var(--text-secondary); font-size: 11px;">(0=&#8734;)</span>
            </div>
            <div class="settings-row" id="scaOptionsRow" style="display: none;">
                <label for="scaPayloadType">Payload:</label>
                <select id="scaPayloadType">
                    <option value="0">Type 0 (full frames)</option>
                    <option value="1">Type 1 (attrs only)</option>
                </select>
                <label for="scaFillPattern" style="min-width: auto; margin-left: 10px;">Fill:</label>
                <select id="scaFillPattern">
                    <option value="auto">Automatic</option>
                    <option value="53c">53c (AA 55)</option>
                    <option value="127c">127c (DD 77)</option>
                    <option value="v4x8">Vertical 4x8 (F0)</option>
                    <option value="h8x4">Horizontal 8x4 (FF/00)</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div class="settings-row" id="scaCustomPatternRow" style="display: none;">
                <label for="scaCustomPattern">Pattern (8 hex bytes):</label>
                <input type="text" id="scaCustomPattern" value="AA 55 AA 55 AA 55 AA 55" style="width: 200px; font-family: monospace;">
            </div>
            <div class="settings-row" id="sizeRow">
                <label for="frameExportSize">Size:</label>
                <select id="frameExportSize">
                    <option value="screen">Screen only (256x192)</option>
                    <option value="normal">Normal border</option>
                    <option value="full">Full border</option>
                    <option value="sprite-pixels">Sprite (pixels)</option>
                    <option value="sprite-cells">Sprite (cells 8x8)</option>
                </select>
            </div>
            <div class="settings-row sprite-region-row" id="spriteRegionRow" style="display: none;">
                <span class="sprite-input-group"><label id="spriteLabelX">X:</label><input type="number" id="spriteX" value="0" min="0" max="255"></span>
                <span class="sprite-input-group"><label id="spriteLabelY">Y:</label><input type="number" id="spriteY" value="0" min="0" max="191"></span>
                <span class="sprite-input-group"><label id="spriteLabelW">W:</label><input type="number" id="spriteW" value="16" min="1" max="256"></span>
                <span class="sprite-input-group"><label id="spriteLabelH">H:</label><input type="number" id="spriteH" value="16" min="1" max="192"></span>
            </div>
            <div class="settings-row frame-export-controls">
                <button id="btnFrameGrabStart" class="frame-grab-btn">Start</button>
                <button id="btnFrameGrabStop" class="frame-grab-btn" disabled>Stop</button>
                <button id="btnFrameGrabCancel" class="frame-grab-btn" disabled>Cancel</button>
            </div>
            <div class="frame-grab-status" id="frameGrabStatus"></div>
            <div style="border-top: 1px solid var(--text-secondary); margin: 12px 0 8px 0; opacity: 0.3;"></div>
            <div class="settings-row" style="margin-bottom: 4px;">
                <span style="font-weight: bold; font-size: 11px; color: var(--text-secondary);">AY Capture (PSG)</span>
                <button id="btnPsgPlayer" style="margin-left: auto; font-size: 11px;" title="Download PSG player Z80 source code">Get Player</button>
            </div>
            <div class="settings-row">
                <label class="checkbox-label" title="Only record registers that changed from previous frame (smaller file)">
                    <input type="checkbox" id="chkPsgChangedOnly" checked> Changed only
                </label>
            </div>
            <div class="settings-row frame-export-controls">
                <button id="btnPsgStart" class="frame-grab-btn" title="Start recording AY register writes">Record</button>
                <button id="btnPsgStop" class="frame-grab-btn" disabled title="Stop and export PSG file">Export</button>
                <button id="btnPsgCancel" class="frame-grab-btn" disabled title="Cancel recording">Cancel</button>
            </div>
            <div class="frame-grab-status" id="psgStatus"></div>
            <div style="border-top: 1px solid var(--text-secondary); margin: 12px 0 8px 0; opacity: 0.3;"></div>
            <div class="settings-row" style="margin-bottom: 4px;">
                <span style="font-weight: bold; font-size: 11px; color: var(--text-secondary);">RZX Recording</span>
            </div>
            <div class="settings-row frame-export-controls">
                <button id="btnRzxRecStart" class="frame-grab-btn" title="Start recording inputs for RZX">Record</button>
                <button id="btnRzxRecExport" class="frame-grab-btn" disabled title="Stop and export RZX file">Export</button>
                <button id="btnRzxRecCancel" class="frame-grab-btn" disabled title="Cancel recording">Cancel</button>
            </div>
            <div class="frame-grab-status" id="rzxRecStatus"></div>
            <div style="border-top: 1px solid var(--text-secondary); margin: 12px 0 8px 0; opacity: 0.3;"></div>
            <div class="settings-row">
                <label class="checkbox-label" title="Detect unrolled loops (identical instruction sequences) and output as REPT blocks when exporting ASM from Memory Map">
                    <input type="checkbox" id="chkExportDedupLoops" checked> Dedup ASM loops
                </label>
            </div>
        </div>
    </div>
    </div><!-- tools-export -->

</div><!-- tab-tools -->

<style>
    /* Tools Tab */
    #tab-tools {
        padding-top: 0;
    }
    .tools-subtab-bar {
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
    .tools-subtab-btn {
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
    .tools-subtab-btn:hover {
        background: var(--bg-button);
        color: var(--text-primary);
    }
    .tools-subtab-btn.active {
        background: var(--bg-secondary);
        color: var(--cyan);
        border-bottom: 1px solid var(--bg-secondary);
    }
    .tools-subtab-content {
        display: none;
    }
    .tools-subtab-content.active {
        display: block;
    }

    /* Tests Tab */
    .tests-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        height: 100%;
        overflow: hidden;
    }
    .tests-controls {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
    }
    .tests-note {
        font-size: 11px;
        color: var(--text-secondary);
        font-style: italic;
        margin: 4px 0;
    }
    .tests-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        background: var(--bg-button);
        color: var(--text-primary);
        cursor: pointer;
        font-size: 12px;
    }
    .tests-btn:hover:not(:disabled) {
        background: var(--bg-tertiary);
    }
    .tests-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .tests-btn.primary {
        background: var(--cyan);
        color: var(--bg-primary);
    }
    .tests-btn.primary:hover:not(:disabled) {
        background: #5dade2;
    }
    .tests-btn.danger {
        background: #c0392b;
        color: white;
    }
    .tests-btn.danger:hover:not(:disabled) {
        background: #e74c3c;
    }
    .tests-checkbox-label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--text-secondary);
        cursor: pointer;
        margin-left: 8px;
    }
    .tests-checkbox-label input {
        cursor: pointer;
    }
    .tests-status {
        color: var(--text-secondary);
        font-size: 11px;
        margin-left: auto;
    }
    .tests-list-container {
        flex: 1;
        overflow-y: auto;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        min-height: 80px;
        max-height: 310px;
    }
    .tests-category-tabs {
        display: flex;
        gap: 2px;
        margin-bottom: 8px;
        flex-wrap: wrap;
    }
    .tests-category-tab {
        padding: 4px 10px;
        font-size: 11px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        color: var(--text-secondary);
        cursor: pointer;
    }
    .tests-category-tab:hover {
        background: var(--bg-button);
        color: var(--text-primary);
    }
    .tests-category-tab.active {
        background: var(--accent);
        color: var(--bg-primary);
        border-color: var(--accent);
    }
    .tests-category-tab .count {
        opacity: 0.7;
        font-size: 10px;
        margin-left: 4px;
    }
    .tests-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
    }
    .tests-table th, .tests-table td {
        padding: 6px 8px;
        text-align: left;
        border-bottom: 1px solid var(--bg-button);
    }
    .tests-table th {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        font-weight: normal;
        text-transform: uppercase;
        font-size: 10px;
        position: sticky;
        top: 0;
    }
    .tests-table tbody tr:hover {
        background: var(--bg-secondary);
    }
    .tests-row-disabled {
        opacity: 0.5;
    }
    .tests-row-disabled td {
        color: var(--text-muted);
    }
    .tests-col-check { width: 30px; text-align: center; }
    .tests-col-name { min-width: 150px; }
    .tests-col-machine { width: 80px; }
    .tests-col-file { min-width: 120px; color: var(--text-secondary); }
    .tests-col-result { width: 80px; text-align: center; }
    .tests-result-pass { color: #2ecc71; font-weight: bold; }
    .tests-result-fail { color: #e74c3c; font-weight: bold; }
    .tests-result-pending { color: var(--text-secondary); }
    .tests-result-running { color: var(--yellow); }
    .tests-progress {
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 10px;
    }
    .tests-progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 12px;
    }
    .tests-progress-bar {
        height: 8px;
        background: var(--bg-secondary);
        border-radius: 4px;
        overflow: hidden;
    }
    .tests-progress-fill {
        height: 100%;
        background: var(--cyan);
        transition: width 0.1s;
    }
    .tests-progress-details {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        font-size: 10px;
        color: var(--text-secondary);
    }
    .tests-preview {
        background: var(--bg-primary);
        border: 1px solid var(--accent);
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
    }
    .tests-preview-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        font-size: 14px;
    }
    .tests-preview-header strong {
        color: var(--accent);
        font-size: 16px;
    }
    .tests-preview-buttons {
        display: flex;
        gap: 4px;
    }
    .tests-preview-canvas-container {
        display: flex;
        justify-content: center;
        background: #000;
        padding: 5px;
        border-radius: 4px;
    }
    .tests-preview-canvas-container canvas {
        image-rendering: pixelated;
    }
    .tests-preview-info {
        margin-top: 10px;
        color: var(--text-secondary);
        font-size: 12px;
        text-align: center;
    }
    .tests-comparison {
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 10px;
    }
    .tests-comparison-images {
        display: flex;
        gap: 10px;
        justify-content: center;
    }
    .tests-comparison-panel {
        text-align: center;
    }
    .tests-comparison-label {
        font-size: 10px;
        color: var(--text-secondary);
        margin-bottom: 4px;
        text-transform: uppercase;
    }
    .tests-comparison-panel canvas {
        border: 1px solid var(--bg-button);
        background: #000;
        image-rendering: pixelated;
    }
    .tests-comparison-result {
        text-align: center;
        margin-top: 8px;
        font-size: 12px;
        padding: 6px;
        border-radius: 4px;
        background: var(--bg-secondary);
    }
    .tests-comparison-result.pass {
        background: rgba(46, 204, 113, 0.2);
        color: #2ecc71;
    }
    .tests-comparison-result.fail {
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
    }
    .tests-summary {
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 10px;
    }
    .tests-summary-header {
        font-size: 12px;
        color: var(--cyan);
        margin-bottom: 8px;
        text-transform: uppercase;
    }
    .tests-summary-stats {
        display: flex;
        gap: 16px;
        margin-bottom: 10px;
    }
    .tests-stat {
        font-size: 12px;
    }
    .tests-stat.passed { color: #2ecc71; }
    .tests-stat.failed { color: #e74c3c; }
    .tests-stat.skipped { color: var(--text-secondary); }
    .tests-results-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
    }
    .tests-results-table th, .tests-results-table td {
        padding: 4px 8px;
        text-align: left;
        border-bottom: 1px solid var(--bg-button);
    }
    .tests-results-table th {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        font-weight: normal;
        text-transform: uppercase;
        font-size: 10px;
    }

    /* Explorer Tab */
    .explorer-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        height: calc(100vh - 200px);
        min-height: 500px;
        max-height: 875px;
        overflow: hidden;
    }
    @media (min-width: 1400px) {
        .explorer-container {
            max-height: 770px;
        }
    }
    .explorer-controls {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
    }
    .explorer-subtab:focus,
    .explorer-btn:focus,
    .explorer-select:focus,
    .explorer-input:focus {
        outline: none;
    }
    .explorer-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        background: var(--bg-button);
        color: var(--text-primary);
        cursor: pointer;
        font-size: 12px;
    }
    .explorer-btn:hover:not(:disabled) {
        background: var(--bg-tertiary);
    }
    .explorer-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .explorer-btn.primary {
        background: var(--cyan);
        color: var(--bg-primary);
    }
    .explorer-btn.primary:hover:not(:disabled) {
        background: #5dade2;
    }
    .explorer-file-info {
        color: var(--cyan);
        font-size: 12px;
    }
    .explorer-file-size {
        color: var(--text-secondary);
        font-size: 11px;
    }
    .explorer-subtabs {
        display: flex;
        gap: 0;
        border-bottom: 1px solid var(--border);
    }
    .explorer-subtab {
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 12px;
    }
    .explorer-subtab:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
    }
    .explorer-subtab.active {
        color: var(--cyan);
        border-bottom-color: var(--cyan);
    }
    .explorer-content {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
    .explorer-subtab-content {
        flex: 1;
        overflow: auto;
    }
    .explorer-subtab-content.active {
        display: flex;
        flex-direction: column;
    }
    .explorer-output {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        white-space: pre-wrap;
        color: var(--text-primary);
        flex: 1;
        overflow: auto;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 6px 10px;
        max-height: 750px;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
        cursor: text;
    }
    #explorerInfoOutput {
        white-space: normal;
        width: 50%;
        min-width: 300px;
    }
    .explorer-info-row {
        display: flex;
        gap: 15px;
        flex: 1;
        overflow: hidden;
    }
    .explorer-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
    }
    .explorer-preview canvas {
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
    .explorer-preview-label {
        margin-top: 6px;
        font-size: 10px;
        color: var(--text-secondary);
        text-transform: uppercase;
    }
    @media (min-width: 1400px) {
        .explorer-output {
            max-height: 650px;
        }
    }
    .explorer-empty {
        color: var(--text-secondary);
        font-style: italic;
        padding: 20px;
        text-align: center;
    }
    .explorer-label {
        font-size: 11px;
        color: var(--text-secondary);
        background: transparent;
        border: none;
        outline: none;
    }
    .explorer-select {
        font-size: 11px;
        padding: 4px 8px;
        min-width: 150px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        color: var(--text-primary);
    }
    .explorer-input {
        font-size: 11px;
        padding: 4px 8px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        color: var(--text-primary);
        font-family: 'Consolas', 'Monaco', monospace;
    }
    .explorer-input.addr {
        width: 50px;
        text-transform: uppercase;
    }
    .explorer-input.len {
        width: 70px;
    }
    .explorer-info-section {
        margin-bottom: 10px;
    }
    .explorer-info-section:first-child {
        margin-top: 0;
    }
    .explorer-info-header {
        color: var(--cyan);
        font-size: 11px;
        text-transform: uppercase;
        margin-bottom: 2px;
        letter-spacing: 0.5px;
    }
    .explorer-info-table {
        width: auto;
        max-width: 400px;
        border-collapse: collapse;
        font-size: 11px;
        font-family: 'Consolas', 'Monaco', monospace;
    }
    .explorer-info-table th,
    .explorer-info-table td {
        padding: 3px 8px;
        text-align: left;
        border-bottom: 1px solid var(--bg-button);
    }
    .explorer-info-table th {
        color: var(--text-secondary);
        font-weight: normal;
        width: 120px;
    }
    .explorer-info-table td {
        color: var(--text-primary);
    }
    .explorer-block-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .explorer-block {
        border-left: 3px solid var(--cyan);
        padding: 6px 10px;
        background: var(--bg-secondary);
        font-size: 11px;
        font-family: 'Consolas', 'Monaco', monospace;
        cursor: pointer;
        outline: none;
    }
    .explorer-block:hover {
        opacity: 0.85;
    }
    .explorer-block.basic-block {
        border-left-color: #2ecc71;
    }
    .explorer-block.code-block {
        border-left-color: var(--cyan);
    }
    .explorer-block.array-block {
        border-left-color: #9b59b6;
    }
    .explorer-block.data-block {
        border-left-color: #7f8c8d;
        background: var(--bg-tertiary);
    }
    .explorer-block-header {
        color: var(--yellow);
        font-weight: bold;
    }
    .explorer-block-meta {
        color: var(--text-secondary);
    }
    .explorer-block-meta .checksum-ok {
        color: #2ecc71;
    }
    .explorer-block-meta .checksum-bad {
        color: #e74c3c;
    }
    .explorer-block-details {
        color: var(--text-primary);
        line-height: 1.4;
    }
    .explorer-block-details .label {
        color: var(--text-secondary);
    }
    .explorer-block-details .value {
        color: var(--cyan);
    }
    .explorer-block-details .filename {
        color: #2ecc71;
    }
    /* TRD/SCL file list - compact table-like layout */
    .explorer-file-list {
        display: table;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        width: 100%;
        max-width: 500px;
    }
    .explorer-file-entry {
        display: table-row;
        cursor: pointer;
    }
    .explorer-file-entry:hover {
        background: var(--bg-tertiary);
    }
    .explorer-file-entry > span {
        display: table-cell;
        padding: 3px 8px;
        border-bottom: 1px solid var(--bg-tertiary);
    }
    .explorer-file-num {
        color: var(--text-secondary);
        text-align: right;
        width: 30px;
    }
    .explorer-file-type {
        color: var(--yellow);
        width: 20px;
    }
    .explorer-file-name {
        color: #2ecc71;
    }
    .explorer-file-size {
        color: var(--text-secondary);
        text-align: right;
    }
    .explorer-file-addr {
        color: var(--cyan);
        text-align: right;
    }
    .explorer-file-preview {
        color: var(--magenta);
        width: 20px;
        text-align: center;
    }
    .explorer-basic-line {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        -webkit-user-select: text;
        -moz-user-select: text;
        user-select: text;
        cursor: text;
    }
    .explorer-basic-linenum {
        color: var(--yellow);
        display: inline-block;
        width: 50px;
    }
    .explorer-basic-keyword {
        color: var(--cyan);
    }
    .explorer-basic-string {
        color: #2ecc71;
    }
    .explorer-basic-number {
        color: #e67e22;
    }
    .explorer-basic-comment {
        color: var(--text-secondary);
    }
    :global(#explorerDisasmOutput) {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
        white-space: pre;
    }
    :global(.da) { color: var(--yellow); }
    :global(.db) { color: var(--text-secondary); }
    :global(.dm) { color: var(--cyan); }
    :global(.dl) { color: #2ecc71; }
    :global(#explorerHexOutput) {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
        white-space: pre;
    }
    :global(.ha) { color: var(--yellow); }
    :global(.hb) { color: var(--text-primary); }
    :global(.hc) { color: var(--cyan); }

    /* Test link */
    .test-link {
        color: var(--text-secondary);
        font-size: 12px;
        text-decoration: none;
        padding: 4px 8px;
        background: var(--bg-button);
        border-radius: 3px;
    }
    .test-link:hover {
        background: var(--bg-button-hover);
        color: var(--text-primary);
    }
</style>
