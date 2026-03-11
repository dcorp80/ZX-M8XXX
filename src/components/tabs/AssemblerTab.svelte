        <div class="tab-content" id="tab-assembler">
            <div class="assembler-container">
                <div class="assembler-header">
                    <div class="assembler-controls">
                        <div class="asm-files-dropdown">
                            <button id="btnAsmFiles" title="Browse project files" disabled>Files ▼</button>
                            <div class="asm-files-list" id="asmFilesList"></div>
                        </div>
                        <button id="btnAsmAssemble" title="Assemble code (F9)" disabled>Assemble</button>
                        <button id="btnAsmInject" title="Inject assembled code to memory" disabled>Inject</button>
                        <button id="btnAsmDebug" title="Inject code and start debugging at entry point" disabled>Debug</button>
                        <button id="btnAsmClear" title="Clear all">Clear</button>
                        <button id="btnAsmNew" title="Create new file">New</button>
                        <button id="btnAsmLoad" title="Load files (ASM, ZIP, binary)">Load</button>
                        <button id="btnAsmExport" title="Export all source files as ZIP" style="display:none">Export</button>
                        <button id="btnAsmDownload" title="Download generated files (.bin, .sna, .tap, .trd)" disabled>Download</button>
                        <input type="file" id="asmFileInput" accept=".asm,.z80,.s,.a80,.inc,.bin,.scr,.tap,.zip" multiple style="display:none">
                        <label class="asm-option"><input type="checkbox" id="chkAsmUnusedLabels"> Unused labels</label>
                        <label class="asm-option"><input type="checkbox" id="chkAsmShowCompiled"> Show compiled</label>
                        <label class="asm-option">Font:
                            <select id="asmFontSize" title="Editor font size" style="width: 45px; padding: 2px;">
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12" selected>12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                                <option value="20">20</option>
                                <option value="22">22</option>
                                <option value="24">24</option>
                            </select>
                        </label>
                        <label class="asm-option asm-defines-label" title="Command-line defines for IFDEF/IFNDEF (e.g., DEBUG,VERSION=5)">Defines: <input type="text" id="asmDefines" placeholder="NAME,NAME=value" spellcheck="false"></label>
                        <select id="asmDetectedDefines" multiple size="1" title="Defines from @define markers in source (click to toggle)" style="display:none"></select>
                        <span id="asmMainFileLabel" class="asm-main-label" style="display:none" title="Click to change main file"></span>
                    </div>
                </div>
                <div class="assembler-body">
                    <div class="asm-editor-container">
                        <div class="asm-file-tabs" id="asmFileTabs"></div>
                        <div class="asm-search-bar" id="asmSearchBar" style="display:none">
                            <div class="asm-search-row">
                                <input type="text" id="asmSearchInput" placeholder="Find (Ctrl+F)" spellcheck="false">
                                <button id="btnAsmFindPrev" title="Find Previous (Shift+F3)">▲</button>
                                <button id="btnAsmFindNext" title="Find Next (F3)">▼</button>
                                <span id="asmSearchCount" class="asm-search-count"></span>
                                <label class="asm-search-option"><input type="checkbox" id="chkAsmSearchCase"> Case</label>
                                <button id="btnAsmSearchAll" title="Search in all project files">All Files</button>
                                <button id="btnAsmSearchClose" title="Close (Esc)">×</button>
                            </div>
                            <div class="asm-replace-row" id="asmReplaceRow" style="display:none">
                                <input type="text" id="asmReplaceInput" placeholder="Replace (Ctrl+R)" spellcheck="false">
                                <button id="btnAsmReplace" title="Replace">Replace</button>
                                <button id="btnAsmReplaceAll" title="Replace All">All</button>
                            </div>
                            <div class="asm-search-results" id="asmSearchResults" style="display:none"></div>
                        </div>
                        <div class="asm-editor-area">
                            <div class="asm-line-numbers" id="asmLineNumbers"></div>
                            <div class="asm-editor-wrap">
                                <pre class="asm-highlight" id="asmHighlight"></pre>
                                <textarea id="asmEditor" class="asm-textarea" spellcheck="false" placeholder="; Enter Z80 assembly code here
; @entry start
; Example:
        ORG $8000
start:
        LD A, 2
        OUT (254), A
        JP start"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="asm-output-container">
                        <div class="asm-output-header">Output</div>
                        <div class="asm-output" id="asmOutput"><span class="asm-hint">Press Assemble to compile</span></div>
                    </div>
                </div>
            </div>
        </div><!-- tab-assembler -->
