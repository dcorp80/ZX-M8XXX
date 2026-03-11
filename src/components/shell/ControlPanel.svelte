<div class="controls">
    <button id="btnScreenshotMain" title="Save screenshot">📷</button>
    <button id="btnRun" class="primary" title="Run/Pause emulation (F5)">Run</button>
    <button id="btnReset" title="Reset machine">Reset</button>
    <select id="speedSelect" title="Emulation speed">
        <option value="10">10%</option>
        <option value="25">25%</option>
        <option value="50">50%</option>
        <option value="75">75%</option>
        <option value="100" selected>100%</option>
        <option value="200">200%</option>
        <option value="400">400%</option>
        <option value="0">Max</option>
    </select>
    <button id="btnSound" title="Toggle sound (AY-3-8910)">🔇</button>
    <button id="btnFullscreen" title="Toggle fullscreen (F11)">⛶</button>
    <button id="btnMouse" title="Capture mouse (Kempston Mouse)" style="display: none;">🖱️</button>
</div>
<input type="file" id="rom48Input" class="file-input" accept=".rom,.bin">
<input type="file" id="rom128Input" class="file-input" accept=".rom,.bin">
<input type="file" id="romPlus2Input" class="file-input" accept=".rom,.bin">
<input type="file" id="romPlus2aInput" class="file-input" accept=".rom,.bin">
<input type="file" id="romPlus3Input" class="file-input" accept=".rom,.bin">
<input type="file" id="romPentagonInput" class="file-input" accept=".rom,.bin">
<input type="file" id="romScorpionInput" class="file-input" accept=".rom,.bin">
<input type="file" id="romTrdosInput" class="file-input" accept=".rom,.bin">
<input type="file" id="fileInput" class="file-input" accept=".sna,.tap,.tzx,.z80,.szx,.zip,.rzx,.trd,.scl,.dsk">
