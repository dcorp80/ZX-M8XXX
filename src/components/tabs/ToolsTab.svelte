        <div class="tab-content" id="tab-tools">
            <div class="tools-subtab-bar">
                <button class="tools-subtab-btn active" data-toolstab="explorer">Explorer</button>
                <button class="tools-subtab-btn" data-toolstab="compare">Compare</button>
                <button class="tools-subtab-btn" data-toolstab="tests">Tests</button>
                <button class="tools-subtab-btn" data-toolstab="export">Export</button>
                <button class="tools-subtab-btn" data-toolstab="mapper">Mapper</button>
            </div>

            <!-- Tests Sub-tab -->
            <div class="tools-subtab-content" id="tools-tests">
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
                    <span class="test-link" title="System, FUSE CPU and Assembler tests are now in tests/unit/ (run via: npm test)">Unit tests: npm test</span>
                    <span class="tests-status" id="testsStatus">Loading tests...</span>
                </div>

                <!-- Summary Stats -->
                <div class="tests-summary-stats hidden" id="testsSummaryStats">
                    <span class="tests-stat passed"><span id="testsPassed">0</span> passed</span>
                    <span class="tests-stat failed"><span id="testsFailed">0</span> failed</span>
                    <span class="tests-stat skipped"><span id="testsSkipped">0</span> skipped</span>
                    <span class="tests-stat time"><span id="testsTime">0.0</span>s</span>
                    <span class="tests-stat fps"><span id="testsFps">0</span> fps</span>
                </div>

                <!-- Test List + Preview/Comparison Row -->
                <div class="tests-main-row">
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
                                    <th class="tests-col-details">Details</th>
                                </tr>
                            </thead>
                            <tbody id="testsTableBody">
                            </tbody>
                        </table>
                    </div>

                    <!-- Right side: Preview + Comparison -->
                    <div class="tests-right-panel">
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
                    </div>
                </div>

            </div>
            </div><!-- tools-tests -->

            <!-- Compare Sub-tab Content -->
            <div class="tools-subtab-content" id="tools-compare">
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
                        <label for="compareFileA" style="display:block;margin-bottom:5px;color:var(--text-secondary);font-size:11px">File A:</label>
                        <input type="file" id="compareFileA" accept=".sna,.z80,.szx,.rzx,.bin,.rom,.dat,*" style="width:100%">
                    </div>
                    <div class="compare-file" id="compareFileBContainer" style="flex:1;min-width:200px">
                        <label for="compareFileB" style="display:block;margin-bottom:5px;color:var(--text-secondary);font-size:11px">File B:</label>
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
                            <button id="comparePrevPage" style="padding:4px 8px">◄ Prev</button>
                            <span id="comparePageInfo" style="color:var(--text-secondary)">Page 1 / 1</span>
                            <button id="compareNextPage" style="padding:4px 8px">Next ►</button>
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
                        <span style="font-size:24px">✓</span><br>
                        Files are identical
                    </div>
                </div>
            </div>
            </div><!-- tools-compare -->

            <!-- Explorer Sub-tab Content -->
            <div class="tools-subtab-content active" id="tools-explorer">
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
            <div class="tools-subtab-content" id="tools-export">
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
                        <span style="color: var(--text-secondary); font-size: 11px;">(0=∞)</span>
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
                            <option value="screen">Screen only (256×192)</option>
                            <option value="normal">Normal border</option>
                            <option value="full">Full border</option>
                            <option value="sprite-pixels">Sprite (pixels)</option>
                            <option value="sprite-cells">Sprite (cells 8×8)</option>
                        </select>
                    </div>
                    <div class="settings-row sprite-region-row" id="spriteRegionRow" style="display: none;">
                        <span class="sprite-input-group"><label id="spriteLabelX" for="spriteX">X:</label><input type="number" id="spriteX" value="0" min="0" max="255"></span>
                        <span class="sprite-input-group"><label id="spriteLabelY" for="spriteY">Y:</label><input type="number" id="spriteY" value="0" min="0" max="191"></span>
                        <span class="sprite-input-group"><label id="spriteLabelW" for="spriteW">W:</label><input type="number" id="spriteW" value="16" min="1" max="256"></span>
                        <span class="sprite-input-group"><label id="spriteLabelH" for="spriteH">H:</label><input type="number" id="spriteH" value="16" min="1" max="192"></span>
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

            <!-- Mapper Sub-tab -->
            <div class="tools-subtab-content" id="tools-mapper">
                <div class="mapper-container">
                    <!-- Toolbar -->
                    <div class="mapper-toolbar">
                        <button class="mapper-btn primary" id="btnMapperCapture" title="Capture screen (Ctrl+Space)">Capture</button>
                        <span class="mapper-separator"></span>
                        <button class="mapper-nav-btn" id="btnMapperLeft" title="Move left (Ctrl+Left)">&larr;</button>
                        <button class="mapper-nav-btn" id="btnMapperUp" title="Move up (Ctrl+Up)">&uarr;</button>
                        <button class="mapper-nav-btn" id="btnMapperDown" title="Move down (Ctrl+Down)">&darr;</button>
                        <button class="mapper-nav-btn" id="btnMapperRight" title="Move right (Ctrl+Right)">&rarr;</button>
                        <span class="mapper-room-label" id="mapperRoomLabel">(0, 0)</span>
                        <span class="mapper-separator"></span>
                        <span class="mapper-floor-label">F:</span>
                        <button class="mapper-nav-btn mapper-floor-btn" id="btnMapperFloorDown" title="Floor down (Ctrl+PgDn)">&#9660;</button>
                        <span class="mapper-floor-value" id="mapperFloorLabel">0</span>
                        <button class="mapper-nav-btn mapper-floor-btn" id="btnMapperFloorUp" title="Floor up (Ctrl+PgUp)">&#9650;</button>
                        <span class="mapper-separator"></span>
                        <button class="mapper-btn" id="btnMapperBlend" title="Blend all screenshots into one averaged image" style="display:none">Blend</button>
                        <button class="mapper-btn" id="btnMapperStamp" title="Stamp region from selected screenshot onto blend" style="display:none">Stamp</button>
                        <button class="mapper-btn danger" id="btnMapperDeleteShot" title="Delete current screenshot" style="display:none">Delete</button>
                        <select class="mapper-mark-select" id="mapperRoomMark" title="Mark room for attention">
                            <option value="">No mark</option>
                            <option value="#000000" style="color:#000000">&#x2716; Black</option>
                            <option value="#0000FF" style="color:#0000FF">&#x2716; Blue</option>
                            <option value="#FF0000" style="color:#FF0000">&#x2716; Red</option>
                            <option value="#FF00FF" style="color:#FF00FF">&#x2716; Magenta</option>
                            <option value="#00FF00" style="color:#00FF00">&#x2716; Green</option>
                            <option value="#00FFFF" style="color:#00FFFF">&#x2716; Cyan</option>
                            <option value="#FFFF00" style="color:#FFFF00">&#x2716; Yellow</option>
                            <option value="#FFFFFF" style="color:#FFFFFF">&#x2716; White</option>
                        </select>
                        <span class="mapper-toolbar-spacer"></span>
                        <div class="mapper-thumb-strip" id="mapperThumbStrip"></div>
                        <button class="mapper-nav-btn" id="btnMapperSettings" title="Map settings">&#9881;</button>
                    </div>
                    <!-- Settings Panel (toggled) -->
                    <div class="mapper-settings hidden" id="mapperSettingsPanel">
                        <div class="mapper-settings-row">
                            <label class="mapper-field-label">Region &mdash; X:<input type="number" id="mapperRegionX" value="0" min="0" max="31" class="mapper-field-input"></label>
                            <label class="mapper-field-label">Y:<input type="number" id="mapperRegionY" value="0" min="0" max="23" class="mapper-field-input"></label>
                            <label class="mapper-field-label">W:<input type="number" id="mapperRegionW" value="32" min="1" max="32" class="mapper-field-input"></label>
                            <label class="mapper-field-label">H:<input type="number" id="mapperRegionH" value="24" min="1" max="24" class="mapper-field-input"></label>
                            <span class="mapper-separator"></span>
                            <label class="mapper-field-label">Highlight:
                                <select id="mapperHighlightColor" class="mapper-field-select">
                                    <option value="#4ecdc4">Cyan</option>
                                    <option value="#ff6b6b">Red</option>
                                    <option value="#ffd93d">Yellow</option>
                                    <option value="#6bcb77">Green</option>
                                    <option value="#ffffff">White</option>
                                </select>
                            </label>
                            <span class="mapper-separator"></span>
                            <label class="mapper-field-label">Gap H:<input type="number" id="mapperGapH" value="0" min="0" max="32" class="mapper-field-input" title="Horizontal gap between rooms in pixels"></label>
                            <label class="mapper-field-label">V:<input type="number" id="mapperGapV" value="0" min="0" max="32" class="mapper-field-input" title="Vertical gap between rooms in pixels"></label>
                            <label class="mapper-field-label">Zoom:
                                <select id="mapperOverviewZoom" class="mapper-field-select" title="Overview zoom level">
                                    <option value="fit">Fit</option>
                                    <option value="x1">x1</option>
                                    <option value="x2">x2</option>
                                </select>
                            </label>
                            <label class="mapper-field-label"><input type="checkbox" id="mapperFollow" title="Auto-scroll to keep current room centered (x1/x2 zoom)"> Follow</label>
                            <span class="mapper-separator"></span>
                            <label class="mapper-field-label">Export:
                                <select id="mapperExportLayout" class="mapper-field-select">
                                    <option value="separate">Separate PNGs</option>
                                    <option value="1x">1 x ...</option>
                                    <option value="2x">2 x ...</option>
                                    <option value="3x">3 x ...</option>
                                    <option value="4x">4 x ...</option>
                                    <option value="5x">5 x ...</option>
                                    <option value="x1">... x 1</option>
                                    <option value="x2">... x 2</option>
                                    <option value="x3">... x 3</option>
                                    <option value="x4">... x 4</option>
                                    <option value="x5">... x 5</option>
                                </select>
                            </label>
                            <label class="mapper-field-label">Floor gap:<input type="number" id="mapperFloorGap" value="8" min="0" max="64" class="mapper-field-input" title="Gap between floors in composite PNG export"></label>
                        </div>
                        <div class="mapper-settings-row">
                            <label class="mapper-field-label">Game:<input type="text" id="mapperGame" class="mapper-text-input" placeholder="Game name"></label>
                            <label class="mapper-field-label">Level:<input type="text" id="mapperLevel" class="mapper-text-input mapper-text-short" placeholder="Level"></label>
                            <label class="mapper-field-label">Author:<input type="text" id="mapperAuthor" class="mapper-text-input mapper-text-short" placeholder="Author"></label>
                            <span class="mapper-separator"></span>
                            <button class="mapper-btn" id="btnMapperSave">Save</button>
                            <button class="mapper-btn" id="btnMapperLoad">Load</button>
                            <button class="mapper-btn" id="btnMapperExportPng">Export PNG</button>
                            <button class="mapper-btn danger" id="btnMapperClear">Clear</button>
                            <span class="mapper-separator"></span>
                            <span class="mapper-stats" id="mapperStats">0 rooms mapped</span>
                            <input type="file" id="mapperFileInput" accept=".json" style="display:none">
                        </div>
                    </div>
                    <!-- Map Overview -->
                    <div class="mapper-overview-container" id="mapperOverviewContainer">
                        <canvas id="mapperOverviewCanvas"></canvas>
                        <div class="mapper-overview-placeholder" id="mapperOverviewPlaceholder">Capture rooms to build the map</div>
                        <div class="mapper-room-popup hidden" id="mapperRoomPopup">
                            <div class="mapper-room-popup-label" id="mapperRoomPopupLabel"></div>
                            <canvas id="mapperRoomPopupCanvas"></canvas>
                        </div>
                        <div class="mapper-stamp-dialog hidden" id="mapperStampDialog">
                            <div class="mapper-stamp-header">
                                <label>A: <select id="mapperStampSourceA"></select></label>
                                <label>B: <select id="mapperStampSourceB"></select></label>
                                <span id="mapperStampInfo">Drawing from A</span>
                                <button class="mapper-btn" id="btnMapperStampClear">Clear stamps</button>
                                <button class="mapper-btn" id="btnMapperStampClose">&times;</button>
                            </div>
                            <div class="mapper-stamp-canvas-wrap">
                                <canvas id="mapperStampCanvas"></canvas>
                            </div>
                            <div class="mapper-stamp-sources">
                                <div class="mapper-stamp-source selected" id="mapperStampSourceAWrap">
                                    <div class="mapper-stamp-source-label">A</div>
                                    <canvas id="mapperStampCanvasA"></canvas>
                                </div>
                                <div class="mapper-stamp-source" id="mapperStampSourceBWrap">
                                    <div class="mapper-stamp-source-label">B</div>
                                    <canvas id="mapperStampCanvasB"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!-- tools-mapper -->

        </div><!-- tab-tools -->
