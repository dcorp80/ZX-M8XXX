<!-- Memory Map Dialog -->
<!-- Preserves same IDs so js/views/debugger-display.js continues to work unchanged -->
<div class="memmap-dialog hidden" id="memmapDialog">
    <div class="memmap-content">
        <div class="memmap-header">
            <button class="memmap-close" id="btnMemmapClose">Close</button>
        </div>
        <div class="memmap-body">
            <div class="memmap-scale">
                <div class="memmap-scale-item"><span id="memmapRomLabel">ROM</span><span class="memmap-scale-addr">0000</span></div>
                <div class="memmap-scale-item"><span>Bank 5</span><span class="memmap-scale-addr">4000</span></div>
                <div class="memmap-scale-tick" style="top:182px"><span class="memmap-scale-addr">5B00</span></div>
                <div class="memmap-scale-item"><span>Bank 2</span><span class="memmap-scale-addr">8000</span></div>
                <div class="memmap-scale-item"><span id="memmapBankLabel">Bank 0</span><span class="memmap-scale-addr">C000</span></div>
                <div class="memmap-scale-end"><span class="memmap-scale-addr">FFFF</span></div>
            </div>
            <div class="memmap-canvas-container">
                <canvas id="memmapCanvas" width="512" height="512"></canvas>
                <div class="memmap-tooltip" id="memmapTooltip"></div>
            </div>
            <div class="memmap-sidebar">
                <div class="memmap-view-toggle" style="margin-bottom:8px">
                    <button class="memmap-view-btn active" id="btnMemmapRegions">Regions</button>
                    <button class="memmap-view-btn" id="btnMemmapHeatmap">Heatmap</button>
                </div>
                <div class="memmap-view-toggle" id="memmapBankToggle" style="display:none;margin-bottom:8px">
                    <button class="memmap-view-btn active" id="btnMemmap64K">64KB</button>
                    <button class="memmap-view-btn" id="btnMemmap128K">128KB</button>
                </div>
                <div class="memmap-legend" id="memmapLegendRegions">
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#4080ff"></div>Code</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#ff4040"></div>SMC</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#ffcc00"></div>DB (bytes)</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#ff8800"></div>DW (words)</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#40cc40"></div>Text</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#cc40cc"></div>Graphics</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#606060"></div>Unmapped</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#000000;border:1px solid #444"></div>Zeroes</div>
                </div>
                <div class="memmap-legend hidden" id="memmapLegendHeatmap">
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#0066ff"></div>Execute</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#00ff66"></div>Read</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#ff6600"></div>Write</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#ffffff"></div>Mixed (high)</div>
                    <div class="memmap-legend-item"><div class="memmap-legend-color" style="background:#000000;border:1px solid #444"></div>No access</div>
                    <div class="memmap-heatmap-scale">
                        <div>Low</div>
                        <div class="memmap-gradient"></div>
                        <div>High</div>
                    </div>
                </div>
                <div class="memmap-stats" id="memmapStats"></div>
                <div class="memmap-bar" id="memmapBar"></div>
                <div class="memmap-addr-info" id="memmapAddrInfo">Hover over map to see details<br>Click to navigate</div>
                <h3 class="memmap-title">Memory Map (64KB)</h3>
                <div style="margin-top:10px;display:flex;align-items:center;gap:10px">
                    <button class="memmap-view-btn" id="btnExportAsm" title="Export disassembly as sjasmplus-compatible ASM file" style="border-radius:4px">Export ASM</button>
                    <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);cursor:pointer" title="Include address and bytes as comments (e.g. LD A,$00 ; 8000: 3E 00)">
                        <input type="checkbox" id="chkExportAddrBytes"> Addr+Bytes
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>
