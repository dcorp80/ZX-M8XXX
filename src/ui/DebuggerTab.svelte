<script lang="ts">
    import type { EmulatorController } from '../core/emulator-controller';
    let { emulator }: { emulator: EmulatorController } = $props();
</script>

<div class="debugger-container">
    <div class="debugger-panel open" id="debuggerPanel">
        <div class="main-debug-row">
            <div class="debugger-section disasm-panel" id="leftPanel">
                <div class="memory-header">
                    <select id="leftPanelType" class="panel-type-select" title="Panel type">
                        <option value="disasm">Disasm</option>
                        <option value="memdump">Memory</option>
                    </select>
                    <div class="memory-controls left-disasm-controls">
                        <input type="text" id="disasmAddress" placeholder="0000" maxlength="4" value="">
                        <button id="btnDisasmGo" title="Go to address">Go</button>
                        <button id="btnDisasmPC" title="Go to current PC">PC</button>
                        <button id="btnDisasmPgUp" title="Navigate Back (Alt+Left)">&#9664;</button>
                        <button id="btnDisasmPgDn" title="Navigate Forward (Alt+Right)">&#9654;</button>
                        <label class="disasm-option" title="Show T-states for each instruction"><input type="checkbox" id="chkShowTstates">T-states</label>
                        <button id="btnDisasmExport" title="Export visible disassembly">Export</button>
                        <button id="btnDisasmExportRange" title="Export address range">Export...</button>
                    </div>
                    <div class="memory-controls left-memdump-controls" style="display:none">
                        <input type="text" id="leftMemAddress" placeholder="0000" maxlength="4" value="0000">
                        <button id="btnLeftMemGo" title="Go to address">Go</button>
                        <button id="btnLeftMemPC" title="Go to PC">PC</button>
                        <button id="btnLeftMemSP" title="Go to SP">SP</button>
                        <button id="btnLeftMemHL" title="Go to HL">HL</button>
                        <button id="btnLeftMemPgUp" title="Page up">&#9650;</button>
                        <button id="btnLeftMemPgDn" title="Page down">&#9660;</button>
                    </div>
                </div>
                <div class="disassembly-view" id="disassemblyView"></div>
                <div class="memory-view" id="leftMemoryView" style="display:none"></div>
                <div class="bookmarks-bar" id="disasmBookmarks">
                    <span class="bookmarks-label">Bookmarks:</span>
                    <button class="bookmark-btn" data-index="0" title="Click: go, Right-click: set">-</button>
                    <button class="bookmark-btn" data-index="1" title="Click: go, Right-click: set">-</button>
                    <button class="bookmark-btn" data-index="2" title="Click: go, Right-click: set">-</button>
                    <button class="bookmark-btn" data-index="3" title="Click: go, Right-click: set">-</button>
                    <button class="bookmark-btn" data-index="4" title="Click: go, Right-click: set">-</button>
                </div>
                <div class="memory-search inline left-memory-search" style="display:none">
                    <div class="search-row">
                        <span class="search-label">Search:</span>
                        <input type="text" id="leftMemSearchInput">
                        <select id="leftMemSearchType">
                            <option value="hex">Hex</option>
                            <option value="dec">Dec</option>
                            <option value="text">Text</option>
                        </select>
                        <button id="btnLeftMemSearch" title="Find bytes in memory">Find</button>
                        <button id="btnLeftMemSearchNext" title="Find next occurrence">Next</button>
                        <div class="search-options">
                            <label class="search-option"><input type="checkbox" id="chkLeftSearchCase"> Case</label>
                            <label class="search-option"><input type="checkbox" id="chkLeftSearch7bit"> +128</label>
                        </div>
                    </div>
                    <div class="search-results" id="leftSearchResults"></div>
                </div>
                <div class="debugger-controls left-debugger-controls">
                    <button id="btnStepInto" title="Step Into (F7)">Step Into</button>
                    <button id="btnStepOver" title="Step Over (F8)">Step Over</button>
                    <button id="btnRunTo" title="Run to Cursor (F4)">To Cursor</button>
                    <button id="btnRunToInt" title="Run to INT">To INT</button>
                    <button id="btnRunToRet" title="Run to RET">To RET</button>
                    <input type="text" id="tstatesInput" class="tstates-input" placeholder="T" maxlength="8" value="1000" title="Number of T-states to run">
                    <button id="btnRunTstates" title="Run specified T-states">Tstates</button>
                    <label style="margin-left: 8px; font-size: 11px;" title="Add separator comment before each step"><input type="checkbox" id="chkAutoComment"> comm</label>
                    <label style="margin-left: 8px; font-size: 11px;" title="Auto-scroll disassembly to follow PC"><input type="checkbox" id="chkFollowPC" checked> follow</label>
                </div>
            </div>
            <div class="right-column">
                <div class="registers-row">
                    <div class="reg-group">
                        <h4>Regs</h4>
                        <div class="registers-grid" id="mainRegisters"></div>
                        <div class="registers-grid" id="altRegisters"></div>
                        <div class="registers-grid" id="ixiyRegisters"></div>
                    </div>
                    <div class="reg-group">
                        <h4>System</h4>
                        <div class="registers-grid" id="indexRegisters"></div>
                        <div class="registers-grid" id="statusRegisters"></div>
                        <div class="flags-label">Flags</div>
                        <div class="flags-display" id="flagsDisplay"></div>
                    </div>
                    <div class="stack-pages-row">
                        <div class="reg-group">
                            <h4>Stack</h4>
                            <div class="stack-view" id="stackView"></div>
                        </div>
                        <div class="reg-group" id="pagesGroup" style="display: none;">
                            <h4>Pages</h4>
                            <div class="registers-grid vertical" id="pagesInfo"></div>
                        </div>
                    </div>
                </div>
                <div class="memory-section memory-panel" id="rightPanel">
                    <div class="memory-header">
                        <select id="rightPanelType" class="panel-type-select" title="Panel type">
                            <option value="memdump">Memory</option>
                            <option value="disasm">Disasm</option>
                            <option value="calc">Calculator</option>
                        </select>
                        <div class="memory-controls right-memdump-controls">
                            <input type="text" id="memoryAddress" placeholder="0000" maxlength="4" value="0000">
                            <button id="btnMemoryGo" title="Go to address">Go</button>
                            <button id="btnMemoryPC" title="Go to PC">PC</button>
                            <button id="btnMemorySP" title="Go to SP">SP</button>
                            <button id="btnMemoryHL" title="Go to HL">HL</button>
                            <button id="btnMemoryPgUp" title="Page up">&#9650;</button>
                            <button id="btnMemoryPgDn" title="Page down">&#9660;</button>
                            <button id="btnMemorySnap" title="Snapshot memory for diff">Snap</button>
                            <button id="btnMemoryClearSnap" title="Clear snapshot" style="display:none">Clear</button>
                            <label class="memory-option" title="Allow editing ROM area"><input type="checkbox" id="chkRomEdit">Edit ROM</label>
                        </div>
                        <div class="memory-controls right-disasm-controls" style="display:none">
                            <input type="text" id="rightDisasmAddress" placeholder="0000" maxlength="4" value="">
                            <button id="btnRightDisasmGo" title="Go to address">Go</button>
                            <button id="btnRightDisasmPC" title="Go to current PC">PC</button>
                            <button id="btnRightDisasmPgUp" title="Navigate Back">&#9664;</button>
                            <button id="btnRightDisasmPgDn" title="Navigate Forward">&#9654;</button>
                            <label class="disasm-option" title="Show T-states for each instruction"><input type="checkbox" id="chkRightShowTstates">T-states</label>
                        </div>
                    </div>
                    <div class="memory-view" id="memoryView"></div>
                    <div class="disassembly-view" id="rightDisassemblyView" style="display:none"></div>
                    <div class="calculator-view" id="rightCalculatorView" style="display:none">
                        <div class="calc-wrapper">
                        <div class="calc-top-row">
                        <div class="calc-container">
                            <div class="calc-display">
                                <div class="calc-input-row">
                                    <select id="calcInputBase" class="calc-base-select">
                                        <option value="16">HEX</option>
                                        <option value="10">DEC</option>
                                        <option value="8">OCT</option>
                                        <option value="2">BIN</option>
                                    </select>
                                    <input type="text" id="calcInput" class="calc-input" value="0" spellcheck="false">
                                </div>
                                <div class="calc-output-row">
                                    <span class="calc-label dec">DEC</span>
                                    <span class="calc-value" id="calcDec">0</span>
                                    <span class="calc-signed" id="calcSigned"></span>
                                </div>
                                <div class="calc-output-row">
                                    <span class="calc-label hex">HEX</span>
                                    <span class="calc-value" id="calcHex">0</span>
                                </div>
                                <div class="calc-output-row">
                                    <span class="calc-label oct">OCT</span>
                                    <span class="calc-value" id="calcOct">0</span>
                                </div>
                                <div class="calc-output-row">
                                    <span class="calc-label bin">BIN</span>
                                    <span class="calc-value bin-value" id="calcBin">0</span>
                                </div>
                                <div class="calc-output-row ascii-row">
                                    <span class="calc-label ascii">ASCII</span>
                                    <span class="calc-value" id="calcAscii"></span>
                                </div>
                            </div>
                            <div class="calc-buttons">
                                <div class="calc-row">
                                    <button class="calc-btn mode" id="calcBitSize" title="Toggle bit size (8/16/32 bits)">u16</button>
                                    <button class="calc-btn op" data-op="and" title="Bitwise AND: A and B">and</button>
                                    <button class="calc-btn op" data-op="or" title="Bitwise OR: A or B">or</button>
                                    <button class="calc-btn op" data-op="not" title="Bitwise NOT: invert all bits">not</button>
                                    <button class="calc-btn op" data-op="xor" title="Bitwise XOR: A xor B">xor</button>
                                </div>
                                <div class="calc-row">
                                    <button class="calc-btn func" data-op="inc" title="Increment: add 1">inc</button>
                                    <button class="calc-btn func" data-op="dec" title="Decrement: subtract 1">dec</button>
                                    <button class="calc-btn func" data-op="lsl" title="Logical Shift Left: shift bits left, fill with 0">lsl</button>
                                    <button class="calc-btn func" data-op="lsr" title="Logical Shift Right: shift bits right, fill with 0">lsr</button>
                                    <button class="calc-btn func" data-op="asr" title="Arithmetic Shift Right: shift right, preserve sign bit">asr</button>
                                    <button class="calc-btn func" data-op="rand" title="Random: generate random number">rand</button>
                                </div>
                                <div class="calc-row">
                                    <button class="calc-btn paren" data-char="(">(</button>
                                    <button class="calc-btn paren" data-char=")">)</button>
                                    <button class="calc-btn func" data-op="rol" title="Rotate Left: shift left, top bit wraps to bottom">rol</button>
                                    <button class="calc-btn func" data-op="ror" title="Rotate Right: shift right, bottom bit wraps to top">ror</button>
                                    <button class="calc-btn op" data-op="mod" title="Modulo: remainder after division">mod</button>
                                    <button class="calc-btn op" data-op="/" title="Divide: integer division">/</button>
                                </div>
                                <div class="calc-row">
                                    <button class="calc-btn hex-digit" data-char="A">A</button>
                                    <button class="calc-btn hex-digit" data-char="B">B</button>
                                    <button class="calc-btn digit" data-char="7">7</button>
                                    <button class="calc-btn digit" data-char="8">8</button>
                                    <button class="calc-btn digit" data-char="9">9</button>
                                    <button class="calc-btn op" data-op="*" title="Multiply">*</button>
                                </div>
                                <div class="calc-row">
                                    <button class="calc-btn hex-digit" data-char="C">C</button>
                                    <button class="calc-btn hex-digit" data-char="D">D</button>
                                    <button class="calc-btn digit" data-char="4">4</button>
                                    <button class="calc-btn digit" data-char="5">5</button>
                                    <button class="calc-btn digit" data-char="6">6</button>
                                    <button class="calc-btn op" data-op="-" title="Subtract">-</button>
                                </div>
                                <div class="calc-row">
                                    <button class="calc-btn hex-digit" data-char="E">E</button>
                                    <button class="calc-btn hex-digit" data-char="F">F</button>
                                    <button class="calc-btn digit" data-char="1">1</button>
                                    <button class="calc-btn digit" data-char="2">2</button>
                                    <button class="calc-btn digit" data-char="3">3</button>
                                    <button class="calc-btn op" data-op="+" title="Add">+</button>
                                </div>
                                <div class="calc-row">
                                    <button class="calc-btn clear" id="calcClear" title="Clear: reset to 0">C</button>
                                    <button class="calc-btn clear" id="calcDel" title="Delete: remove last digit">DEL</button>
                                    <button class="calc-btn digit" data-char="0">0</button>
                                    <button class="calc-btn digit" data-char="0" id="calcDot" style="visibility:hidden">.</button>
                                    <button class="calc-btn func" id="calcNegate" title="Negate: two's complement (flip sign)">+/-</button>
                                    <button class="calc-btn equals" id="calcEquals" title="Equals: calculate result">=</button>
                                </div>
                            </div>
                        </div>
                        <div class="calc-log">
                            <div class="calc-log-header">
                                <span>History</span>
                                <button id="calcLogClear" title="Clear history">&times;</button>
                            </div>
                            <div class="calc-log-content" id="calcLogContent"></div>
                        </div>
                        </div>
                        <div class="calc-bits-panel" id="calcBitsPanel">
                            <div class="calc-bits-labels" id="calcBitsLabels"></div>
                            <div class="calc-bits-grid" id="calcBitsGrid"></div>
                        </div>
                        </div>
                    </div>
                    <div class="bookmarks-bar" id="memoryBookmarks">
                        <span class="bookmarks-label">Bookmarks:</span>
                        <button class="bookmark-btn" data-index="0" title="Click: go, Right-click: set">-</button>
                        <button class="bookmark-btn" data-index="1" title="Click: go, Right-click: set">-</button>
                        <button class="bookmark-btn" data-index="2" title="Click: go, Right-click: set">-</button>
                        <button class="bookmark-btn" data-index="3" title="Click: go, Right-click: set">-</button>
                        <button class="bookmark-btn" data-index="4" title="Click: go, Right-click: set">-</button>
                    </div>
                    <div class="debugger-controls right-debugger-controls" style="display:none">
                        <button id="btnRightStepInto" title="Step Into (F7)">Step Into</button>
                        <button id="btnRightStepOver" title="Step Over (F8)">Step Over</button>
                        <button id="btnRightRunTo" title="Run to Cursor (F4)">To Cursor</button>
                        <button id="btnRightRunToInt" title="Run to INT">To INT</button>
                        <button id="btnRightRunToRet" title="Run to RET">To RET</button>
                        <input type="text" id="rightTstatesInput" class="tstates-input" placeholder="T" maxlength="8" value="1000">
                        <button id="btnRightRunTstates" title="Run T-States">Tstates</button>
                    </div>
                    <div class="memory-search inline right-memory-search">
                        <div class="search-row">
                            <span class="search-label">Search:</span>
                            <input type="text" id="memSearchInput">
                            <select id="memSearchType">
                                <option value="hex">Hex</option>
                                <option value="dec">Dec</option>
                                <option value="text">Text</option>
                            </select>
                            <button id="btnMemSearch" title="Find bytes in memory">Find</button>
                            <button id="btnMemSearchNext" title="Find next occurrence">Next</button>
                            <div class="search-options">
                                <label class="search-option"><input type="checkbox" id="chkSearchCase"> Case</label>
                                <label class="search-option"><input type="checkbox" id="chkSearch7bit"> +128</label>
                            </div>
                        </div>
                        <div class="search-results" id="searchResults"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-tabs">
            <div class="panel-tab-bar">
                <button class="panel-tab-btn active" data-panel="breakpoints" title="Breakpoints and watchpoints">Breakpoints</button>
                <button class="panel-tab-btn" data-panel="labels" title="Address labels">Labels</button>
                <button class="panel-tab-btn" data-panel="watches" title="Memory watches">Watches</button>
                <button class="panel-tab-btn" data-panel="tools" title="POKE search, Auto-Map, XRefs, Text scan">Tools</button>
                <button class="panel-tab-btn" data-panel="trace" title="Execution trace history">Trace</button>
            </div>
            <!-- Breakpoints Panel -->
            <div class="panel-tab-content active" id="panel-breakpoints">
                <div class="bp-add-form" style="margin-bottom: 5px;">
                    <select id="triggerType" title="Trigger type">
                        <option value="exec">Exec</option>
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                        <option value="rw">R/W</option>
                        <option value="port_in">Port IN</option>
                        <option value="port_out">Port OUT</option>
                        <option value="port_io">Port I/O</option>
                    </select>
                    <input type="text" id="triggerAddrInput" placeholder="ADDR" maxlength="15" title="Examples: 4000, 4000-4FFF, 5:C000, FE&FF">
                    <input type="text" id="triggerCondInput" placeholder="if..." maxlength="30" title="Condition: A==0, val==FF, port&FE==FE">
                    <input type="number" id="triggerSkipInput" placeholder="skip" min="0" value="0" title="Skip count: number of hits to skip before breaking" style="width: 45px;">
                    <button id="btnAddTrigger" title="Add breakpoint/watchpoint">+</button>
                    <button id="btnClearTriggers" title="Clear all triggers">Clear</button>
                </div>
                <div class="breakpoint-list trigger-list" id="triggerList">
                    <div class="no-breakpoints">No breakpoints</div>
                </div>
            </div>
            <!-- Labels Panel -->
            <div class="panel-tab-content" id="panel-labels">
                <div class="bp-add-form" style="margin-bottom: 5px;">
                    <select id="labelDisplayMode" class="disasm-select" title="Label display mode">
                        <option value="addr">Addr</option>
                        <option value="label">Label</option>
                        <option value="both" selected>Both</option>
                    </select>
                    <label class="rom-labels-toggle" title="Show ROM labels"><input type="checkbox" id="chkShowRomLabels" checked>ROM</label>
                    <input type="text" id="labelFilterInput" placeholder="Filter..." maxlength="20" style="width: 80px;">
                    <button id="btnAddLabel" title="Add label">+</button>
                    <button id="btnExportLabels" title="Export labels to file">Export</button>
                    <button id="btnImportLabels" title="Import labels from file">Import</button>
                    <button id="btnClearLabels" title="Clear user labels">Clear</button>
                    <input type="file" id="labelFileInput" accept=".json,.txt" style="display:none">
                </div>
                <div class="breakpoint-list labels-list" id="labelsList">
                    <div class="no-breakpoints">No labels</div>
                </div>
            </div>
            <!-- Watches Panel -->
            <div class="panel-tab-content" id="panel-watches">
                <div class="watches-controls">
                    <input type="text" id="watchAddrInput" placeholder="[P:]Addr" maxlength="7" title="Address (hex), e.g. 4000 or 5:C000">
                    <input type="text" id="watchNameInput" placeholder="Name" maxlength="16" title="Watch name (optional)">
                    <button id="btnWatchAdd" title="Add memory watch (max 10)">+</button>
                    <button id="btnWatchClear" title="Clear all watches">Clear</button>
                </div>
                <div class="watches-list" id="watchesList"></div>
            </div>
            <!-- Tools Panel -->
            <div class="panel-tab-content" id="panel-tools">
                <div class="tools-row">
                    <span class="search-label">POKE:</span>
                    <button id="btnPokeSnap" title="Take snapshot">Snap</button>
                    <select id="pokeSearchMode">
                        <option value="dec1">-1</option>
                        <option value="inc1">+1</option>
                        <option value="decreased">Decreased</option>
                        <option value="increased">Increased</option>
                        <option value="changed">Changed</option>
                        <option value="unchanged">Unchanged</option>
                        <option value="equals">Equals</option>
                    </select>
                    <input type="text" id="pokeSearchValue" placeholder="Val" maxlength="5" style="width:40px;display:none">
                    <button id="btnPokeSearch" title="Search candidates">Search</button>
                    <button id="btnPokeReset" title="Reset search">Reset</button>
                    <span id="pokeStatus" class="poke-status"></span>
                    <div class="poke-results" id="pokeResults"></div>
                </div>
                <div class="tools-row">
                    <span class="search-label">Auto-Map:</span>
                    <label class="search-option"><input type="checkbox" id="chkAutoMap"> Track</label>
                    <button id="btnAutoMapSnap" title="Capture current state for export (registers, memory)">Snap</button>
                    <button id="btnAutoMapApply" title="Apply tracked regions">Apply</button>
                    <button id="btnAutoMapClear" title="Clear tracking data">Clear</button>
                    <span id="autoMapStats" class="automap-stats"></span>
                    <button id="btnClearRegions" title="Clear all marked regions">Clr Regions</button>
                    <button id="btnMemoryMap" title="Show memory map visualization">Map</button>
                </div>
                <div class="tools-row">
                    <span class="search-label">XRefs:</span>
                    <button id="btnXrefScan" title="Scan visible range for cross-references">Scan</button>
                    <button id="btnXrefScanAll" title="Scan full 64KB memory">Scan All</button>
                    <button id="btnXrefClear" title="Clear all cross-references">Clear</button>
                    <label class="search-option"><input type="checkbox" id="chkXrefRuntime"> Runtime</label>
                    <span id="xrefStats" class="automap-stats"></span>
                </div>
                <div class="tools-row">
                    <span class="search-label">Text:</span>
                    <button id="btnTextScan" title="Scan memory for text strings">Scan</button>
                    <select id="textScanMode" title="Scan mode">
                        <option value="all">All strings</option>
                        <option value="dict">Dictionary</option>
                        <option value="custom">Custom</option>
                    </select>
                    <input type="text" id="textScanCustom" placeholder="Search text..." style="width:80px;display:none">
                    <label class="search-option" title="Minimum string length"><input type="number" id="textScanMinLen" value="4" min="2" max="20" style="width:35px"> min</label>
                    <label class="search-option" title="Include ROM area (0000-3FFF)"><input type="checkbox" id="textScanROM"> ROM</label>
                    <label class="search-option" title="Scan all 128K RAM banks"><input type="checkbox" id="textScanAllBanks"> All banks</label>
                    <select id="textScanMax" title="Max results to show">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="0">All</option>
                    </select>
                    <span id="textScanStatus" class="automap-stats"></span>
                </div>
                <div class="tools-row" id="textScanPagination" style="display:none">
                    <button id="textScanPrev" title="Previous page">&lt;</button>
                    <span id="textScanPage">Page 1/1</span>
                    <button id="textScanNext" title="Next page">&gt;</button>
                </div>
                <div class="text-scan-results" id="textScanResults"></div>
            </div>
            <!-- Trace Panel -->
            <div class="panel-tab-content" id="panel-trace">
                <div class="trace-controls">
                    <div class="trace-row">
                        <label class="search-option"><input type="checkbox" id="chkTraceEnabled" checked> Step</label>
                        <label class="search-option"><input type="checkbox" id="chkTraceRuntime"> Runtime</label>
                        <button id="btnTraceBack" title="Step back in history (Alt+&#8592;)">&#9664;</button>
                        <button id="btnTraceForward" title="Step forward in history (Alt+&#8594;)">&#9654;</button>
                        <button id="btnTraceLive" title="Return to live view">Live</button>
                        <button id="btnTraceClear" title="Clear trace history">Clear</button>
                        <span id="traceStatus" class="automap-stats"></span>
                    </div>
                    <div class="trace-row">
                        <span class="search-label">Export:</span>
                        <button id="btnTraceExport" title="Export trace to file">Export</button>
                        <select id="selTraceExportMode" title="Export first or last N entries">
                            <option value="first" selected>First</option>
                            <option value="last">Last</option>
                        </select>
                        <input type="number" id="txtTraceExportCount" min="0" max="1000000" value="0" style="width:70px" title="Number of entries to export (0=all)">
                        <span class="search-label">Stop:</span>
                        <input type="number" id="txtTraceStopAfter" min="0" max="1000000" value="10000" style="width:70px" title="Stop after N entries (0=unlimited)">
                    </div>
                    <div class="trace-row">
                        <span class="search-label">Include:</span>
                        <label class="search-option"><input type="checkbox" id="chkTraceBytes"> Bytes</label>
                        <label class="search-option"><input type="checkbox" id="chkTraceAlt"> Alt regs</label>
                        <label class="search-option"><input type="checkbox" id="chkTraceSys"> Sys regs</label>
                        <label class="search-option"><input type="checkbox" id="chkTracePorts"> Ports</label>
                        <label class="search-option"><input type="checkbox" id="chkTraceSkipROM" checked> Skip ROM</label>
                        <label class="search-option"><input type="checkbox" id="chkTraceCollapseBlock"> Collapse block</label>
                    </div>
                    <div class="trace-row">
                        <span class="search-label">Port I/O:</span>
                        <label class="search-option"><input type="checkbox" id="chkPortLog"> Log</label>
                        <select id="selPortLogFilter" title="Filter by direction">
                            <option value="both">Both</option>
                            <option value="in">IN only</option>
                            <option value="out">OUT only</option>
                        </select>
                        <button id="btnPortLogExport" title="Export port I/O log">Export</button>
                        <button id="btnPortLogClear" title="Clear port log">Clear</button>
                        <span id="portLogStatus" class="automap-stats"></span>
                    </div>
                    <div class="trace-row">
                        <span class="search-label">Port filter:</span>
                        <input type="text" id="txtPortTraceFilter" placeholder="PORT[&MASK]" maxlength="15"
                               title="Port spec: FE, 7FFD, FE&FF" style="width:90px">
                        <button id="btnAddPortFilter" title="Add port to trace filter">+</button>
                        <button id="btnClearPortFilters" title="Clear all (trace all ports)">Clear</button>
                        <span id="portFilterStatus" class="automap-stats"></span>
                    </div>
                    <div class="breakpoint-list" id="portFilterList" style="max-height:60px">
                        <div class="no-breakpoints">All ports (no filter)</div>
                    </div>
                </div>
                <div class="trace-list" id="traceList"></div>
            </div>
        </div>
    </div><!-- debugger-panel -->
</div><!-- debugger-container -->

<style>
    /* Debugger Panel */
    .debugger-container {
        margin-top: 0;
    }
    .debugger-panel {
        display: block;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 10px;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
    }
    .debugger-section {
        margin-bottom: 8px;
    }
    .debugger-section h4 {
        color: var(--cyan);
        margin: 0 0 4px 0;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .registers-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 4px;
        justify-content: flex-end;
    }
    .stack-pages-row {
        display: flex;
        gap: 8px;
    }
    .registers-grid.vertical {
        flex-direction: column;
    }
    .reg-group {
        background: var(--bg-secondary);
        padding: 5px 8px;
        border-radius: 3px;
    }
    .reg-group h4 {
        color: var(--cyan);
        margin: 0 0 3px 0;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .registers-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
    }
    .registers-grid + .registers-grid {
        margin-top: 6px;
    }
    :global(.register-item) {
        background: var(--bg-primary);
        padding: 1px 4px;
        border-radius: 2px;
        font-size: 11px;
        white-space: nowrap;
    }
    :global(.register-name) {
        color: var(--text-secondary);
    }
    :global(.register-value) {
        color: var(--accent);
        font-weight: bold;
        margin-left: 2px;
        display: inline-block;
    }
    :global(.register-value.editable) {
        cursor: pointer;
        border-bottom: 1px dashed var(--text-secondary);
    }
    :global(.register-value.editable:hover) {
        color: var(--yellow);
        border-bottom-color: var(--yellow);
    }
    :global(.register-value.editing) {
        color: var(--yellow);
        border-bottom-color: var(--yellow);
    }
    :global(.reg-swap-btn) {
        height: 21px;
        padding: 0 6px;
        margin-left: 2px;
        font-size: 11px;
        background: var(--bg-button);
        color: var(--text-primary);
        border: none;
        border-radius: 3px;
        cursor: pointer;
        align-self: flex-end;
    }
    :global(.reg-swap-btn:first-of-type) {
        margin-left: 5px;
    }
    :global(.reg-swap-btn:hover) {
        background: var(--bg-button-hover);
    }
    .flags-label {
        font-size: 9px;
        color: var(--cyan);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 6px;
        margin-bottom: 2px;
    }
    .flags-display {
        display: flex;
        gap: 2px;
        flex-wrap: wrap;
    }
    :global(.flag-item) {
        background: var(--bg-primary);
        padding: 1px 4px;
        border-radius: 2px;
        color: var(--text-secondary);
        font-size: 10px;
        cursor: pointer;
        user-select: none;
    }
    :global(.flag-item:hover) {
        background: var(--bg-tertiary);
        border: 1px solid var(--accent);
        padding: 0 3px;
    }
    :global(.flag-item.set) {
        background: #4a6a4a;
        color: #8f8;
    }
    :global(.flag-item.set:hover) {
        background: #5a7a5a;
    }
    :global(.flag-item:not(.editable)) {
        cursor: default;
        opacity: 0.7;
    }
    :global(.flag-item:not(.editable):hover) {
        border: none;
        padding: 1px 4px;
        background: inherit;
    }
    .stack-view {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
        background: var(--bg-secondary);
        border-radius: 3px;
        padding: 3px;
    }
    :global(.stack-entry) {
        display: flex;
        padding: 1px 3px;
        border-radius: 2px;
        cursor: context-menu;
    }
    :global(.stack-entry:hover) {
        background: var(--bg-button);
    }
    :global(.stack-entry.current) {
        background: #3a4a3a;
        color: #8f8;
    }
    :global(.stack-entry.changed) {
        color: var(--accent);
    }
    :global(.stack-addr) {
        color: var(--text-secondary);
        margin-right: 4px;
    }
    :global(.stack-value) {
        color: var(--text-primary);
    }
    :global(.stack-pointer) {
        color: #8f8;
        margin-left: 2px;
    }
    :global(.stack-context-menu) {
        position: fixed;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 4px 0;
        z-index: 1000;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.5);
    }
    :global(.stack-context-menu div) {
        padding: 4px 12px;
        cursor: pointer;
    }
    :global(.stack-context-menu div:hover) {
        background: var(--bg-button);
    }
    :global(.label-context-menu) {
        position: fixed;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 4px 0;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    :global(.label-context-menu div) {
        padding: 4px 12px;
        cursor: pointer;
        font-size: 12px;
    }
    :global(.label-context-menu div:hover) {
        background: var(--bg-button);
    }
    :global(.label-context-menu div.danger) {
        color: var(--accent);
    }
    :global(.label-context-menu div.selected) {
        color: var(--accent);
    }
    :global(.label-context-menu div.selected::before) {
        content: '\2713 ';
    }
    :global(.label-context-menu .menu-separator) {
        height: 1px;
        background: var(--bg-button);
        margin: 4px 0;
        padding: 0;
    }
    :global(.label-context-menu .menu-separator:hover) {
        background: var(--bg-button);
    }
    :global(.label-context-menu .menu-header) {
        color: var(--cyan);
        font-weight: bold;
        cursor: default;
    }
    :global(.label-context-menu .menu-header:hover) {
        background: transparent;
    }
    :global(.label-context-menu .menu-submenu) {
        position: relative;
    }
    :global(.label-context-menu .menu-submenu-items) {
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        padding: 4px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        white-space: nowrap;
    }
    :global(.label-context-menu .menu-submenu:hover .menu-submenu-items) {
        display: block;
    }
    :global(.label-context-menu .menu-submenu.submenu-left .menu-submenu-items) {
        left: auto;
        right: 100%;
    }
    :global(.label-context-menu .menu-submenu.submenu-up .menu-submenu-items) {
        top: auto;
        bottom: 0;
    }
    :global(.label-context-menu .menu-submenu-items div) {
        padding: 4px 12px;
    }
    :global(.region-type-code) { color: #8f8; }
    :global(.region-type-db) { color: #88f; }
    :global(.region-type-dw) { color: #8cf; }
    :global(.region-type-text) { color: #ff8; }
    :global(.region-type-graphics) { color: #f8f; }
    :global(.region-type-smc) { color: #f88; }
    :global(.label-dialog) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
    }
    :global(.label-dialog.hidden) {
        display: none;
    }
    :global(.label-dialog-content) {
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 6px;
        padding: 15px;
        min-width: 280px;
    }
    :global(.label-dialog h4) {
        margin: 0 0 12px 0;
        color: var(--cyan);
    }
    :global(.label-dialog-row) {
        margin-bottom: 10px;
    }
    :global(.label-dialog-row label) {
        display: block;
        font-size: 11px;
        color: var(--text-secondary);
        margin-bottom: 3px;
    }
    :global(.label-dialog-row input) {
        width: 100%;
        padding: 6px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
        font-size: 12px;
        box-sizing: border-box;
    }
    :global(.label-dialog-row input:focus) {
        outline: none;
        border-color: var(--cyan);
    }
    :global(.label-dialog-row textarea) {
        width: 100%;
        padding: 5px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
        font-size: 12px;
        font-family: var(--font-mono);
        box-sizing: border-box;
        resize: vertical;
    }
    :global(.label-dialog-row textarea:focus) {
        outline: none;
        border-color: var(--cyan);
    }
    :global(.label-dialog-buttons button.danger) {
        background: #633;
    }
    :global(.label-dialog-buttons button.danger:hover) {
        background: #844;
    }
    :global(.label-dialog-buttons) {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 15px;
    }
    :global(.label-dialog-buttons button) {
        padding: 6px 14px;
        font-size: 12px;
    }
    :global(.export-options) {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
    }
    :global(.export-options label) {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
    }
    .disassembly-view {
        background: var(--bg-primary);
        border: none;
        border-radius: 3px;
        padding: 5px;
        flex: 1;
        overflow: hidden;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
    }
    .main-debug-row {
        display: flex;
        gap: 8px;
        margin-top: 0;
        align-items: stretch;
    }
    .right-column {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
    }
    .disasm-panel {
        flex: 0 0 480px;
        width: 480px;
        height: 740px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        margin-bottom: 0;
    }
    .memory-panel {
        width: 100%;
        min-width: 0;
        margin-top: 0;
        display: flex;
        flex-direction: column;
    }
    .tools-row .search-label {
        color: var(--text-secondary);
        font-size: 11px;
    }
    :global(.disasm-line) {
        display: flex;
        padding: 1px 3px;
        border-radius: 2px;
    }
    :global(.disasm-line.flow-break) {
        margin-bottom: 6px;
    }
    :global(.disasm-line.data-line .disasm-mnemonic) {
        color: #8cf;
        font-style: italic;
    }
    :global(.disasm-line:hover) {
        background: var(--bg-button);
    }
    :global(.disasm-line.current) {
        background: #4a3a2a;
        border-left: 3px solid var(--accent);
        margin-left: -3px;
    }
    :global(.disasm-line.trace) {
        background: #3a2a4a;
        border-left: 3px solid #c060c0;
        margin-left: -3px;
    }
    :global(.disasm-line.current.trace) {
        background: #4a3a4a;
        border-left: 3px solid #c060c0;
    }
    :global(.disasm-line.target) {
        background: #2a3a4a;
        border-right: 3px solid var(--cyan);
    }
    :global(.disasm-line.current.target) {
        background: #3a3a3a;
    }
    :global(.disasm-addr) {
        color: var(--text-secondary);
        width: 100px;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
    :global(.disasm-addr:hover) {
        color: var(--cyan);
        text-decoration: underline;
    }
    :global(.disasm-addr .label-name) {
        color: var(--cyan);
        font-weight: bold;
    }
    :global(.disasm-line.has-long-label) {
        flex-wrap: wrap;
    }
    :global(.disasm-line.has-long-label .disasm-label-row) {
        width: 100%;
        padding-left: 16px;
        margin-bottom: 1px;
        color: var(--cyan);
    }
    :global(.disasm-line.has-long-label .disasm-label-row .label-name) {
        color: var(--cyan);
        font-weight: bold;
    }
    :global(.disasm-label-operand) {
        color: var(--cyan);
    }
    :global(.disasm-operand-addr) {
        cursor: pointer;
        color: #00aa00;
    }
    :global(.disasm-operand-addr:hover) {
        text-decoration: underline;
    }
    :global(.disasm-label-operand.disasm-operand-addr) {
        color: var(--cyan);
    }
    :global(.xref-tooltip) {
        position: fixed;
        background: rgba(0, 0, 0, 0.95);
        color: #fff;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-family: monospace;
        max-width: 300px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 10000;
        pointer-events: none;
        display: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        border: 1px solid #444;
    }
    :global(.xref-tooltip-header) {
        font-weight: bold;
        margin-bottom: 4px;
        border-bottom: 1px solid #444;
        padding-bottom: 4px;
        color: #fff;
    }
    :global(.xref-tooltip-item) {
        padding: 2px 0;
        white-space: nowrap;
    }
    :global(.xref-type-call) { color: #ff8080; }
    :global(.xref-type-jp) { color: #80ff80; }
    :global(.xref-type-jr) { color: #80ffff; }
    :global(.xref-type-djnz) { color: #80ffff; }
    :global(.xref-type-rst) { color: #ff80ff; }
    :global(.xref-type-ld) { color: #ffff80; }
    :global(.disasm-bytes) {
        color: var(--text-secondary);
        width: 80px;
        flex-shrink: 0;
        opacity: 0.6;
    }
    :global(.disasm-mnemonic) {
        color: var(--cyan);
        flex-grow: 1;
    }
    :global(.disasm-mnemonic .op) {
        color: var(--accent);
    }

    /* Operand syntax colors */
    :global(.disasm-reg) {
        color: #daa520;
    }
    :global(.disasm-num) {
        color: #00aa00;
    }
    :global(.disasm-char) {
        color: #cc66cc;
    }
    :global(.disasm-bin) {
        color: #6699cc;
    }
    :global(.disasm-ptr) {
        color: #888888;
    }
    :global(.disasm-tstates) {
        color: var(--text-secondary);
        font-size: 10px;
        width: 40px;
        flex-shrink: 0;
        text-align: right;
        margin-right: 8px;
    }
    .debugger-controls {
        display: flex;
        gap: 5px;
        margin-top: 10px;
        margin-bottom: -3px;
    }
    .debugger-controls button {
        padding: 4px 8px;
        font-size: 11px;
    }
    :global(.debugger-controls button kbd) {
        background: var(--bg-secondary);
        padding: 1px 4px;
        border-radius: 2px;
        margin-left: 4px;
        font-size: 10px;
    }
    .tstates-input {
        width: 55px;
        padding: 4px 6px;
        font-size: 11px;
        font-family: monospace;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
    }
    :global(.disasm-line.breakpoint) {
        background: #4a2a2a;
    }
    :global(.disasm-line.breakpoint.current) {
        background: #5a3a2a;
    }
    :global(.disasm-bp) {
        width: 16px;
        flex-shrink: 0;
        text-align: center;
        cursor: pointer;
        user-select: none;
    }
    :global(.disasm-bp::before) {
        content: '\25CB';
        color: var(--text-secondary);
    }
    :global(.disasm-bp:hover::before) {
        color: var(--accent);
    }
    :global(.disasm-bp.active::before) {
        content: '\25CF';
        color: var(--accent);
    }

    /* Comment styling */
    :global(.disasm-comment) {
        color: #7a7;
        font-style: italic;
    }
    :global(.disasm-comment-line) {
        display: block;
        padding-left: 80px;
        color: #7a7;
        font-style: italic;
        white-space: pre-wrap;
    }
    :global(.disasm-separator) {
        display: block;
        padding-left: 80px;
        color: #666;
    }
    :global(.disasm-sub-separator) {
        display: block;
        padding-left: 20px;
        color: var(--cyan);
        font-family: monospace;
    }
    :global(.disasm-sub-name) {
        display: block;
        padding-left: 20px;
        color: var(--yellow);
        font-weight: bold;
    }
    :global(.disasm-sub-comment) {
        display: block;
        padding-left: 20px;
        color: #7a7;
        font-style: italic;
    }
    :global(.disasm-sub-end) {
        display: block;
        padding-left: 20px;
        color: var(--cyan);
        font-family: monospace;
    }

    /* Code folding styles */
    :global(.disasm-fold-toggle) {
        display: inline-block;
        width: 14px;
        cursor: pointer;
        color: var(--cyan);
        font-family: monospace;
        user-select: none;
        margin-right: 2px;
    }
    :global(.disasm-fold-toggle:hover) {
        color: var(--accent);
    }
    :global(.disasm-fold-summary) {
        display: block;
        padding: 2px 20px;
        background: var(--bg-button);
        border-left: 3px solid var(--cyan);
        color: var(--text-secondary);
        cursor: pointer;
        font-family: monospace;
    }
    :global(.disasm-fold-summary:hover) {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    :global(.disasm-fold-summary .fold-name) {
        color: var(--yellow);
        font-weight: bold;
    }
    :global(.disasm-fold-summary .fold-stats) {
        color: var(--text-secondary);
        margin-left: 8px;
    }
    :global(.disasm-user-fold-start) {
        display: block;
        padding-left: 20px;
        color: var(--magenta);
        font-family: monospace;
    }
    :global(.disasm-user-fold-end) {
        display: block;
        padding-left: 20px;
        color: var(--magenta);
        font-family: monospace;
    }
    :global(.disasm-inline-comment) {
        color: #7a7;
        font-style: italic;
        margin-left: 8px;
    }

    /* Breakpoint/Trigger form */
    .bp-add-form {
        display: flex;
        gap: 3px;
    }
    .bp-add-form input {
        width: 55px;
        padding: 2px 5px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
        font-family: monospace;
        font-size: 11px;
    }
    :global(#triggerCondInput) {
        width: 80px;
    }
    .bp-add-form select {
        padding: 2px 3px;
        font-size: 10px;
    }
    .bp-add-form button {
        padding: 2px 6px;
        font-size: 10px;
    }
    .breakpoint-list {
        max-height: 80px;
        overflow-y: auto;
    }
    :global(.breakpoint-item) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 5px;
        background: var(--bg-primary);
        border-radius: 2px;
        margin-bottom: 2px;
        font-size: 11px;
    }
    :global(.breakpoint-item:hover) {
        background: var(--bg-button);
    }
    :global(.bp-addr) {
        color: var(--accent);
        font-family: monospace;
        cursor: pointer;
    }
    :global(.bp-addr:hover) {
        text-decoration: underline;
    }
    :global(.bp-remove) {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 2px 4px;
        font-size: 12px;
    }
    :global(.bp-remove:hover) {
        color: var(--accent);
    }

    /* Unified Trigger Styles */
    :global(.trigger-item) {
        display: flex;
        align-items: center;
        padding: 2px 5px;
        background: var(--bg-primary);
        border-radius: 2px;
        margin-bottom: 2px;
        font-size: 11px;
        gap: 4px;
    }
    :global(.trigger-item:hover) {
        background: var(--bg-button);
    }
    :global(.trigger-item.disabled) {
        opacity: 0.5;
    }
    :global(.trigger-icon) {
        color: var(--text-secondary);
        font-size: 10px;
        min-width: 16px;
        text-align: center;
    }
    :global(.trigger-icon.exec) { color: var(--accent); }
    :global(.trigger-icon.read) { color: var(--cyan); }
    :global(.trigger-icon.write) { color: var(--warning); }
    :global(.trigger-icon.rw) { color: #ff80ff; }
    :global(.trigger-icon.port) { color: var(--purple); }
    :global(.trigger-icon.port-filter) { color: var(--cyan); }
    :global(.trigger-desc) {
        flex: 1;
        color: var(--accent);
        font-family: monospace;
        cursor: pointer;
    }
    :global(.trigger-desc:hover) {
        text-decoration: underline;
    }
    :global(.trigger-skip) {
        color: var(--yellow);
        font-size: 10px;
        margin-left: 3px;
    }
    :global(.trigger-toggle) {
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0 3px;
        font-size: 10px;
    }
    :global(.trigger-toggle:hover) {
        color: var(--accent);
    }
    :global(.trigger-remove) {
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0 3px;
        font-size: 12px;
    }
    :global(.trigger-remove:hover) {
        color: var(--accent);
    }
    :global(.wp-type) {
        color: var(--text-secondary);
        font-size: 10px;
        margin-left: 5px;
    }
    .no-breakpoints {
        color: var(--text-secondary);
        font-size: 10px;
        text-align: center;
        padding: 5px;
    }
    :global(.label-item) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 5px;
        background: var(--bg-primary);
        border-radius: 2px;
        margin-bottom: 2px;
        font-size: 11px;
        cursor: pointer;
    }
    :global(.label-item:hover) {
        background: var(--bg-button);
    }
    :global(.label-info) {
        display: flex;
        gap: 6px;
        overflow: hidden;
        flex: 1;
    }
    :global(.label-addr) {
        color: var(--accent);
        font-family: monospace;
        flex-shrink: 0;
    }
    :global(.label-name) {
        color: #8bd;
        font-family: monospace;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    :global(.label-comment) {
        color: var(--text-secondary);
        font-size: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    :global(.label-actions) {
        display: flex;
        gap: 2px;
        flex-shrink: 0;
    }
    :global(.label-btn) {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 2px 4px;
        font-size: 11px;
    }
    :global(.label-btn:hover) {
        color: var(--accent);
    }
    .labels-list {
        max-height: 100px;
        overflow-y: auto;
    }
    .rom-labels-toggle {
        display: flex;
        align-items: center;
        gap: 0;
        font-size: 11px;
        cursor: pointer;
    }
    .rom-labels-toggle input {
        margin: 0 2px 0 0;
        width: 13px;
    }
    :global(.label-item.rom-label) {
        opacity: 0.7;
        font-style: italic;
    }
    :global(.label-item.rom-label .label-item-name::before) {
        content: "ROM: ";
        color: var(--text-secondary);
        font-style: normal;
    }

    /* Memory Hex View */
    .memory-section {
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        padding: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }
    .memory-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .memory-header h4 {
        margin: 0;
        color: var(--cyan);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .panel-type-select {
        padding: 3px 6px;
        background: var(--bg-button);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--cyan);
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        margin-right: 8px;
        color-scheme: dark;
    }
    .panel-type-select option {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    .panel-type-select:hover {
        background: var(--bg-hover);
    }
    .memory-controls {
        display: flex;
        gap: 2px;
        align-items: center;
    }
    .memory-controls input {
        width: 60px;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
        font-family: monospace;
        font-size: 12px;
    }
    .memory-controls button {
        padding: 4px 10px;
        font-size: 11px;
    }
    .memory-option {
        margin-left: 5px;
        font-size: 11px;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0;
        white-space: nowrap;
    }
    .memory-option input {
        margin: 0 2px 0 0;
        width: 13px;
    }
    .disasm-option {
        margin-left: 0;
        font-size: 10px;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0;
        white-space: nowrap;
    }
    .disasm-option input[type="checkbox"] {
        margin: 0 2px 0 0;
        padding: 0;
        width: 12px;
        height: 12px;
    }
    .disasm-select {
        padding: 2px 4px;
        font-size: 10px;
        background: var(--bg-primary);
        color: var(--text-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        margin-left: 3px;
    }
    .memory-view {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
        flex: 1;
        overflow: hidden;
        background: var(--bg-primary);
        border-radius: 2px;
        padding: 5px;
        min-height: 0;
    }
    :global(.memory-line) {
        display: flex;
        padding: 1px 0;
        white-space: nowrap;
        line-height: 18px;
    }
    :global(.memory-addr) {
        color: var(--text-secondary);
        width: 36px;
        flex-shrink: 0;
        cursor: pointer;
    }
    :global(.memory-addr:hover) {
        text-decoration: underline;
    }
    :global(.memory-hex) {
        display: flex;
        gap: 0;
        margin-right: 8px;
    }
    :global(#leftMemoryView .memory-hex) {
        margin-right: 14px;
    }
    :global(.memory-byte) {
        color: var(--text-primary);
        width: 18px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        cursor: pointer;
        border-radius: 2px;
        display: inline-block;
    }
    :global(.memory-byte:hover) {
        background: var(--bg-button);
    }
    :global(.memory-byte.modified) {
        color: var(--accent);
    }
    :global(.memory-byte.changed) {
        background: #4a2a2a;
        color: #f88;
    }
    :global(.memory-byte.has-bp) {
        outline: 1px solid #f44;
    }
    :global(.memory-byte.has-wp) {
        outline: 1px solid #4af;
    }
    :global(.memory-byte.has-wp-r) {
        outline: 1px solid #4f4;
    }
    :global(.memory-byte.has-wp-w) {
        outline: 1px solid #fa4;
    }
    :global(.memory-byte.region-db) {
        color: #88f;
    }
    :global(.memory-byte.region-dw) {
        color: #8cf;
    }
    :global(.memory-byte.region-text) {
        color: #ff8;
    }
    :global(.memory-byte.region-graphics) {
        color: #f8f;
    }
    :global(.memory-byte.region-smc) {
        color: #f88;
    }
    :global(.memory-byte.selected) {
        background: #446;
        outline: 1px solid #88f;
    }
    :global(.memory-ascii .changed) {
        color: #f88;
    }
    :global(.memory-ascii) {
        color: var(--text-secondary);
        letter-spacing: 0;
    }
    :global(.memory-ascii .printable) {
        color: var(--cyan);
    }
    :global(.memory-ascii .region-text) {
        color: #ff8;
        font-weight: bold;
    }
    :global(.memory-edit-input) {
        width: 22px;
        height: 18px;
        padding: 0;
        margin: 0;
        text-align: center;
        font-family: inherit;
        font-size: inherit;
        background: var(--bg-secondary);
        border: 1px solid var(--cyan);
        border-radius: 2px;
        color: var(--text-primary);
        outline: none;
        box-sizing: border-box;
    }
    .memory-search {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--bg-button);
    }
    .memory-search.inline {
        margin-top: 4px;
        padding-top: 4px;
        margin-bottom: -10px;
        border-top: none;
    }
    .memory-search.inline input[type="text"] {
        flex: 0 1 auto;
        width: 140px;
    }
    .memory-search.inline .search-options {
        gap: 6px;
        margin: 0;
    }
    .search-row {
        display: flex;
        gap: 5px;
        align-items: center;
    }
    .search-row input {
        flex: 1;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
        font-family: monospace;
        font-size: 12px;
    }
    .search-row select {
        padding: 4px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
        font-size: 11px;
    }
    .search-row button {
        padding: 4px 10px;
        font-size: 11px;
    }
    .search-options {
        display: flex;
        gap: 15px;
        margin: 5px 0;
    }
    .search-option {
        font-size: 10px;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 3px;
    }
    .search-results {
        max-height: 80px;
        overflow-y: auto;
        margin-top: 5px;
        font-family: monospace;
        font-size: 11px;
    }
    :global(.search-result) {
        padding: 2px 5px;
        cursor: pointer;
        border-radius: 2px;
    }
    :global(.search-result:hover) {
        background: var(--bg-button);
    }
    :global(.search-result .addr) {
        color: var(--accent);
    }
    :global(.search-result .preview) {
        color: var(--text-secondary);
        margin-left: 10px;
    }
    :global(.search-info) {
        color: var(--text-secondary);
        font-style: italic;
    }

    /* Panel tabs (Breakpoints/Labels/Tools) */
    .panel-tabs {
        margin-top: 10px;
    }
    .panel-tab-bar {
        display: flex;
        gap: 2px;
        border-bottom: 1px solid var(--bg-button);
        margin-bottom: 0;
    }
    .panel-tab-btn {
        padding: 4px 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-bottom: none;
        border-radius: 3px 3px 0 0;
        color: var(--text-secondary);
        font-size: 11px;
        cursor: pointer;
        margin-bottom: -1px;
    }
    .panel-tab-btn:hover {
        background: var(--bg-button);
        color: var(--text-primary);
    }
    .panel-tab-btn.active {
        background: var(--bg-secondary);
        color: var(--cyan);
        border-bottom: 1px solid var(--bg-secondary);
    }
    .panel-tab-content {
        display: none;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-top: none;
        border-radius: 0 0 3px 3px;
        padding: 8px;
    }
    .panel-tab-content.active {
        display: block;
    }
    :global(.panel-tab-content .panel-row) {
        display: flex;
        gap: 10px;
    }
    :global(.panel-tab-content .panel-column) {
        flex: 1;
    }
    .tools-row {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
        margin-bottom: 5px;
    }
    .tools-row:last-child {
        margin-bottom: 0;
    }
    .tools-row button {
        padding: 2px 6px;
        font-size: 11px;
    }
    .tools-row select {
        font-size: 11px;
        padding: 2px 4px;
    }
    :global(.poke-status) {
        color: var(--text-secondary);
        font-size: 11px;
        margin-left: 5px;
    }
    .poke-results {
        max-height: 60px;
        overflow-y: auto;
        margin-top: 5px;
        font-family: monospace;
        font-size: 11px;
    }
    :global(.poke-result) {
        display: inline-block;
        padding: 2px 6px;
        margin: 1px;
        background: var(--bg-primary);
        border-radius: 2px;
        cursor: pointer;
    }
    :global(.poke-result:hover) {
        background: var(--bg-button);
    }
    :global(.poke-result .addr) {
        color: var(--accent);
    }
    :global(.poke-result .val) {
        color: var(--text-secondary);
        margin-left: 3px;
    }
    .text-scan-results {
        max-height: 200px;
        overflow-y: auto;
        margin-top: 5px;
        font-family: monospace;
        font-size: 11px;
    }
    :global(.text-scan-result) {
        display: flex;
        padding: 2px 6px;
        margin: 1px 0;
        background: var(--bg-primary);
        border-radius: 2px;
        cursor: pointer;
        gap: 8px;
    }
    :global(.text-scan-result:hover) {
        background: var(--bg-button);
    }
    :global(.text-scan-result .addr) {
        color: var(--accent);
        min-width: 45px;
    }
    :global(.text-scan-result .len) {
        color: var(--text-secondary);
        min-width: 25px;
    }
    :global(.text-scan-result .text) {
        color: var(--cyan);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    :global(.text-scan-result .text .dict-match) {
        color: var(--green);
        font-weight: bold;
    }
    :global(.text-scan-result .bank) {
        color: var(--magenta);
        font-size: 9px;
        margin-left: 2px;
    }
    .automap-stats {
        color: var(--text-secondary);
        font-size: 11px;
        margin-left: 5px;
    }
    :global(.automap-stats.active) {
        color: var(--accent);
    }

    /* Trace Panel */
    .trace-controls {
        padding: 4px;
    }
    .trace-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
    }
    .trace-row .search-label {
        min-width: auto;
    }
    .trace-row button {
        padding: 2px 6px;
        font-size: 11px;
    }
    .trace-row select {
        font-size: 11px;
        padding: 2px 4px;
    }

    /* Trace List */
    :global(#panel-trace .trace-list) {
        display: block;
        max-height: calc(100% - 100px);
        min-height: 80px;
    }
    .trace-list {
        max-height: 120px;
        overflow-y: auto;
        margin-top: 5px;
        font-family: monospace;
        font-size: 11px;
        background: var(--bg-primary);
        border: 1px solid var(--border-primary);
        display: none;
    }
    :global(.trace-list.visible) {
        display: block;
    }
    :global(.trace-entry) {
        padding: 1px 4px;
        cursor: pointer;
        white-space: nowrap;
        border-bottom: 1px solid var(--border-primary);
    }
    :global(.trace-entry:hover) {
        background: var(--bg-button);
    }
    :global(.trace-entry.current) {
        background: var(--bg-selected);
    }
    :global(.trace-entry.viewing) {
        background: var(--accent);
        color: var(--bg-primary);
    }
    :global(.trace-entry .addr) {
        color: var(--accent);
    }
    :global(.trace-entry.viewing .addr) {
        color: var(--bg-primary);
    }
    :global(.trace-entry .instr) {
        color: var(--text-primary);
        margin-left: 8px;
    }
    :global(.trace-entry .regs) {
        color: var(--text-secondary);
        margin-left: 8px;
    }
    :global(.trace-entry .ports) {
        color: var(--cyan);
        margin-left: 8px;
        font-weight: bold;
    }
    :global(.trace-entry.viewing .ports) {
        color: var(--bg-secondary);
    }
    :global(.trace-entry .memops) {
        color: var(--warning);
        margin-left: 8px;
    }
    :global(.trace-entry.viewing .memops) {
        color: var(--bg-secondary);
    }
    :global(.trace-viewing-indicator) {
        background: var(--warning);
        color: #000;
        padding: 2px 6px;
        font-size: 11px;
        margin-left: 5px;
        border-radius: 3px;
    }

    /* Watches Panel */
    .watches-controls {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-bottom: 5px;
    }
    .watches-controls input {
        padding: 2px 5px;
        font-size: 11px;
        font-family: monospace;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 3px;
        color: var(--text-primary);
    }
    :global(#watchAddrInput) {
        width: 60px;
    }
    :global(#watchNameInput) {
        width: 80px;
    }
    .watches-controls button {
        padding: 2px 6px;
        font-size: 10px;
    }
    .watches-list {
        font-family: monospace;
        font-size: 11px;
        max-height: 150px;
        overflow-y: auto;
    }
    :global(.watch-entry) {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 0;
        border-bottom: 1px solid var(--border-primary);
    }
    :global(.watch-entry:last-child) {
        border-bottom: none;
    }
    :global(.watch-addr) {
        color: var(--accent);
        min-width: 45px;
    }
    :global(.watch-name) {
        color: var(--text-secondary);
        min-width: 60px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    :global(.watch-name.label) {
        color: var(--cyan);
    }
    :global(.watch-bytes) {
        color: var(--text-primary);
    }
    :global(.watch-ascii) {
        color: var(--text-secondary);
    }
    :global(.watch-remove) {
        padding: 0 4px;
        font-size: 10px;
        background: var(--bg-button);
        border: 1px solid var(--border-primary);
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 2px;
    }
    :global(.watch-remove:hover) {
        background: var(--warning);
        color: #000;
    }
    :global(.watch-bytes .changed) {
        color: var(--warning);
        font-weight: bold;
    }

    /* Bookmarks bar */
    .bookmarks-bar {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 6px;
        background: var(--bg-tertiary);
        border-top: 1px solid var(--border-color);
        font-size: 10px;
        margin-bottom: -6px;
    }
    .bookmarks-label {
        color: var(--text-secondary);
        margin-right: 4px;
    }
    .bookmark-btn {
        min-width: 40px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 10px;
        background: var(--bg-button);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 3px;
        cursor: pointer;
    }
    .bookmark-btn:hover {
        background: var(--bg-hover);
    }
    :global(.bookmark-btn.set) {
        background: var(--bg-button);
        color: var(--text-primary);
    }
    :global(.bookmark-btn.type-mismatch) {
        color: var(--text-secondary);
        font-style: italic;
    }

    /* Calculator */
    .calculator-view {
        display: none;
    }
    .calc-wrapper {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 5px;
    }
    .calc-top-row {
        display: flex;
        gap: 8px;
        align-items: flex-start;
    }
    .calc-container {
        width: 306px;
        min-width: 306px;
        font-family: 'Consolas', 'Monaco', monospace;
    }
    .calc-log {
        width: 475px;
        height: 445px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 6px;
        font-family: 'Consolas', 'Monaco', monospace;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .calc-log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid var(--border-color);
        font-size: 11px;
        color: var(--text-secondary);
    }
    .calc-log-header button {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 14px;
        padding: 0 4px;
    }
    .calc-log-header button:hover {
        color: var(--accent);
    }
    .calc-log-content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        font-size: 11px;
    }
    :global(.calc-log-entry) {
        padding: 4px 6px;
        margin: 2px 0;
        border-radius: 3px;
        background: var(--bg-secondary);
        cursor: pointer;
    }
    :global(.calc-log-entry:hover) {
        background: var(--bg-button);
    }
    :global(.calc-log-op) {
        color: var(--text-secondary);
    }
    :global(.calc-log-val) {
        color: var(--cyan);
        margin-left: 4px;
    }
    :global(.calc-log-result) {
        color: var(--green);
        font-weight: bold;
    }
    .calc-display {
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 6px;
        padding: 12px;
        min-height: 180px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .calc-input-row {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
    }
    .calc-base-select {
        background: var(--bg-button);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 3px;
        padding: 1px 4px;
        font-family: inherit;
        font-size: 10px;
        height: 20px;
    }
    .calc-base-select:disabled {
        opacity: 0.4;
        background: var(--bg-tertiary);
        color: var(--text-secondary);
        cursor: not-allowed;
        pointer-events: none;
    }
    .calc-input {
        flex: 1;
        background: var(--bg-primary);
        color: var(--cyan);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 8px;
        font-family: inherit;
        font-size: 16px;
        text-align: right;
    }
    .calc-output-row {
        display: flex;
        align-items: center;
        padding: 4px 0;
        gap: 10px;
        min-height: 20px;
    }
    .calc-label {
        font-size: 11px;
        font-weight: bold;
        width: 35px;
    }
    .calc-label.dec { color: #4CAF50; }
    .calc-label.hex { color: var(--cyan); }
    .calc-label.oct { color: var(--text-secondary); }
    .calc-label.bin { color: var(--text-secondary); }
    .calc-label.ascii { color: var(--yellow); }
    .calc-output-row.ascii-row {
        height: 20px;
        min-height: 20px;
        max-height: 20px;
    }
    .calc-signed {
        color: #e74c3c;
        font-size: 12px;
        margin-left: 10px;
        min-width: 60px;
    }
    .calc-value {
        font-size: 13px;
        color: var(--text-primary);
        word-break: break-all;
        max-width: 280px;
    }
    .calc-value.bin-value {
        font-size: 11px;
        letter-spacing: -0.5px;
    }
    .calc-buttons {
        display: flex;
        flex-direction: column;
        gap: 3px;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 6px;
        padding: 8px;
        margin-top: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .calc-row {
        display: flex;
        gap: 3px;
    }
    .calc-btn {
        flex: 1;
        padding: 8px 3px;
        font-family: inherit;
        font-size: 12px;
        border: 1px solid var(--bg-button);
        border-radius: 4px;
        cursor: pointer;
        background: var(--bg-secondary);
        color: var(--text-primary);
        transition: background 0.1s;
    }
    .calc-btn:hover {
        background: var(--bg-button);
    }
    .calc-btn:active {
        background: var(--accent);
    }
    .calc-btn.digit {
        background: var(--bg-primary);
        font-size: 14px;
        font-weight: bold;
    }
    .calc-btn.hex-digit {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        font-size: 13px;
    }
    :global(.calc-btn-disabled),
    :global(.calc-btn-disabled:hover) {
        opacity: 0.35;
        cursor: not-allowed;
        background: var(--bg-tertiary) !important;
        color: var(--text-secondary);
    }
    .calc-btn.op {
        color: var(--text-secondary);
    }
    .calc-btn.func {
        color: var(--text-secondary);
        font-size: 11px;
    }
    .calc-btn.mode {
        background: var(--bg-button);
        color: var(--text-primary);
        font-size: 12px;
        font-weight: bold;
    }
    .calc-btn.special {
        color: var(--cyan);
        font-weight: bold;
    }
    .calc-btn.clear {
        background: #c0392b;
        color: white;
        font-weight: bold;
    }
    .calc-btn.clear:hover {
        background: #e74c3c;
    }
    .calc-btn.equals {
        background: var(--bg-button);
        color: var(--text-primary);
        font-size: 16px;
        font-weight: bold;
    }
    .calc-btn.paren {
        font-size: 14px;
    }
    .calc-bits-panel {
        width: 100%;
        background: var(--bg-primary);
        border: 1px solid var(--bg-button);
        border-radius: 6px;
        padding: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .calc-bits-labels {
        display: flex;
        gap: 1px;
        margin-bottom: 2px;
        justify-content: flex-start;
    }
    :global(.calc-bits-label) {
        width: 18px;
        font-size: 8px;
        text-align: center;
        color: var(--text-secondary);
    }
    :global(.calc-bits-label-sep) {
        width: 3px;
    }
    .calc-bits-grid {
        display: flex;
        flex-wrap: nowrap;
        gap: 1px;
    }
    :global(.calc-bit) {
        width: 18px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        background: var(--bg-secondary);
        border: 1px solid var(--bg-button);
        border-radius: 2px;
        cursor: pointer;
        color: var(--text-secondary);
    }
    :global(.calc-bit.set) {
        background: var(--cyan);
        color: var(--bg-primary);
    }
    :global(.calc-bit-separator) {
        width: 3px;
    }
    :global(.calc-bit-label) {
        font-size: 9px;
        color: var(--text-secondary);
        width: 100%;
        text-align: center;
        margin-top: 2px;
    }
</style>
