            <div class="tab-content active" id="tab-debugger">
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
                                <button id="btnDisasmPgUp" title="Navigate Back (Alt+Left)">◀</button>
                                <button id="btnDisasmPgDn" title="Navigate Forward (Alt+Right)">▶</button>
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
                                <button id="btnLeftMemPgUp" title="Page up">▲</button>
                                <button id="btnLeftMemPgDn" title="Page down">▼</button>
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
                            <label style="margin-left: 8px; font-size: 11px;" title="Auto-scroll disassembly to follow PC"><input type="checkbox" id="chkFollowPC"> follow</label>
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
                                <div class="flags-row">
                                    <div class="register-item" id="regRItem"></div>
                                    <div class="flags-block">
                                        <div class="flags-label">Flags</div>
                                        <div class="flags-display" id="flagsDisplay"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="stack-pages-row">
                                <div class="reg-group">
                                    <h4>Stack</h4>
                                    <div class="stack-view" id="stackView"></div>
                                </div>
                                <div class="reg-group calls-group">
                                    <h4>Calls</h4>
                                    <div class="stack-view" id="callStackView"></div>
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
                                    <button id="btnMemoryPgUp" title="Page up">▲</button>
                                    <button id="btnMemoryPgDn" title="Page down">▼</button>
                                    <button id="btnMemorySnap" title="Snapshot memory for diff">Snap</button>
                                    <button id="btnMemoryClearSnap" title="Clear snapshot" style="display:none">Clear</button>
                                    <label class="memory-option" title="Allow editing ROM area"><input type="checkbox" id="chkRomEdit">Edit ROM</label>
                                </div>
                                <div class="memory-controls right-disasm-controls" style="display:none">
                                    <input type="text" id="rightDisasmAddress" placeholder="0000" maxlength="4" value="">
                                    <button id="btnRightDisasmGo" title="Go to address">Go</button>
                                    <button id="btnRightDisasmPC" title="Go to current PC">PC</button>
                                    <button id="btnRightDisasmPgUp" title="Navigate Back">◀</button>
                                    <button id="btnRightDisasmPgDn" title="Navigate Forward">▶</button>
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
                        <button class="panel-tab-btn" data-panel="pokes" title="POKE manager">Pokes</button>
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
                                <option value="tape_block">Tape Block</option>
                                <option value="disk_read">Disk Read</option>
                                <option value="disk_sector">Disk Sector</option>
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
                            <select id="labelSourceFilter" class="disasm-select" title="Filter labels by source">
                                <option value="all" selected>All</option>
                                <option value="user">User</option>
                                <option value="profiled">Profiled</option>
                                <option value="rom">ROM</option>
                            </select>
                            <input type="text" id="labelFilterInput" placeholder="Filter..." maxlength="20" style="width: 80px;">
                            <button id="btnAddLabel" title="Add label">+</button>
                            <button id="btnExportLabels" title="Export labels to file">Export</button>
                            <button id="btnImportLabels" title="Import labels from file">Import</button>
                            <button id="btnClearLabels" title="Clear user labels">Clear</button>
                            <span id="labelCount" style="font-size: 10px; color: var(--text-secondary); margin-left: 2px;"></span>
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
                        <div class="tools-panel-row">
                        <div class="tools-group">
                            <div class="tools-group-label">analysis</div>
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
                                <span class="search-label">Analyze:</span>
                                <button id="btnCfaRun" title="Static code-flow analysis from entry points">Flow</button>
                                <label class="search-option" title="Skip ROM area (0000-3FFF)">
                                    <input type="checkbox" id="chkCfaSkipRom" checked> Skip ROM
                                </label>
                                <label class="search-option" title="Include ISR handler at $0038">
                                    <input type="checkbox" id="chkCfaISR" checked> ISR
                                </label>
                                <input type="text" id="cfaExtraEntries" placeholder="Extra entries (hex, comma-sep)"
                                       style="width:160px" title="Additional entry point addresses, e.g. 8000,9000">
                                <button id="btnCfaClear" title="Clear code-flow analysis results">Clear</button>
                                <span id="cfaStatus" class="automap-stats"></span>
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
                                <span class="search-label">Profile:</span>
                                <button id="btnProfileRun" title="Run profiler and auto-label subroutines">Run</button>
                                <input type="number" id="profileFrameCount" value="200" min="10" max="5000" style="width:50px" title="Number of frames to profile">
                                <button id="btnProfileStop" title="Stop profiling early" disabled>Stop</button>
                                <span id="profileStatus" class="automap-stats"></span>
                            </div>
                            <div id="hotspotResults" class="hidden" style="margin-top:4px;max-height:180px;overflow-y:auto;font-size:11px;line-height:1.5"></div>
                        </div>
                        <div class="tools-group">
                            <div class="tools-group-label">search</div>
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
                                </select>
                                <button id="btnPokeSearch" title="Search candidates">Search</button>
                                <button id="btnPokeReset" title="Reset search">Reset</button>
                                <input type="text" id="pokeFilterValue" placeholder="Val" maxlength="2" style="width:28px;margin-left:4px" title="Hex value to filter by last snap">
                                <button id="btnPokeFilter" title="Filter candidates: keep only addresses where last snap equals value">Filter</button>
                                <label title="Skip screen memory (4000-5BFF)" style="font-size:11px;color:var(--text-secondary);margin-left:5px;cursor:pointer"><input type="checkbox" id="pokeSkipScreen" checked>Skip screen</label>
                                <button id="btnPokeTrace" title="Trace memory writes for blacklist">Trace</button>
                                <button id="btnPokeTraceClear" title="Clear blacklist" class="hidden" style="padding:2px 4px;font-size:10px">&times;</button>
                                <span id="pokeStatus" class="poke-status"></span>
                                <div class="poke-results" id="pokeResults"></div>
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
                        </div>
                    </div>
                    <!-- Trace Panel -->
                    <div class="panel-tab-content" id="panel-trace">
                        <div class="trace-controls">
                            <div class="tools-panel-row">
                            <div class="tools-group">
                                <div class="tools-group-label">trace</div>
                                <div class="trace-row">
                                    <label class="search-option"><input type="checkbox" id="chkTraceEnabled" checked> Step</label>
                                    <label class="search-option"><input type="checkbox" id="chkTraceRuntime"> Runtime</label>
                                    <button id="btnTraceBack" title="Step back in history (Alt+←)">◀</button>
                                    <button id="btnTraceForward" title="Step forward in history (Alt+→)">▶</button>
                                    <button id="btnTraceLive" title="Return to live view">Live</button>
                                    <button id="btnTraceClear" title="Clear trace history">Clear</button>
                                    <span id="traceStatus" class="automap-stats"></span>
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
                            </div>
                            <div class="tools-group">
                                <div class="tools-group-label">port i/o</div>
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
                            </div>
                        </div>
                        <div class="trace-list" id="traceList"></div>
                    </div>
                    <div class="panel-tab-content" id="panel-pokes">
                        <div class="poke-manager">
                            <div class="poke-columns">
                                <div class="poke-col-editors">
                                    <div class="poke-add-form">
                                        <input type="text" id="editorAddName" placeholder="Name" style="width:80px" maxlength="16">
                                        <input type="text" id="editorAddAddr" placeholder="Addr" style="width:50px" maxlength="6">
                                        <select id="editorAddType" title="Value type">
                                            <option value="byte">Byte</option>
                                            <option value="word">Word</option>
                                        </select>
                                        <button id="btnEditorAdd" title="Add memory editor">+</button>
                                        <button id="btnEditorReadAll" title="Read all editor values from memory">Read</button>
                                    </div>
                                    <div class="poke-editors" id="pokeEditors"></div>
                                </div>
                                <div class="poke-col-pokes">
                                    <div class="poke-add-form">
                                        <input type="text" id="pokeAddName" placeholder="Name" style="width:80px" maxlength="30">
                                        <input type="text" id="pokeAddAddr" placeholder="Addr" style="width:50px" maxlength="6">
                                        <input type="text" id="pokeAddNormal" placeholder="Orig" style="width:35px" maxlength="4">
                                        <input type="text" id="pokeAddPoke" placeholder="Poke" style="width:35px" maxlength="4">
                                        <button id="btnPokeAdd" title="Add poke (or add patch if name exists)">+</button>
                                    </div>
                                    <div class="poke-toggle-all">
                                        <input type="checkbox" id="pokeToggleAll" title="Enable/disable all pokes">
                                    </div>
                                    <div class="poke-list" id="pokeList">
                                        <div class="no-breakpoints">No pokes loaded</div>
                                    </div>
                                </div>
                                <div class="poke-col-buttons">
                                    <span id="pokeGameLabel" class="poke-game-label" title="Click to edit game name"></span>
                                    <button id="btnPokeLoad" title="Load pokes from JSON file">Load</button>
                                    <button id="btnPokeSave" title="Save pokes to JSON file">Save</button>
                                    <button id="btnPokeClear" title="Clear all pokes and editors">Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!-- debugger-panel -->
        </div><!-- debugger-container -->
        </div><!-- tab-debugger -->
