<script lang="ts">
    import type { EmulatorController } from '../core/emulator-controller';
    let { emulator }: { emulator: EmulatorController } = $props();
</script>

<div class="graphics-container">
    <div class="graphics-body">
        <div class="graphics-dump-wrap">
            <canvas id="gfxDumpCanvas" class="graphics-dump-canvas"></canvas>
        </div>
        <div class="gfx-col-address">
            <div class="gfx-control-group">
                <label>Address</label>
                <input type="text" id="gfxAddress" value="3000" maxlength="4" title="Memory address in hex (Enter to apply)">
            </div>
            <div class="gfx-control-group">
                <label>Navigate</label>
                <div class="gfx-nav-buttons">
                    <button id="btnGfxByte1" title="Back 1 byte">-1</button>
                    <button id="btnGfxByte2" title="Forward 1 byte">+1</button>
                </div>
                <div class="gfx-nav-buttons">
                    <button id="btnGfxLine1" title="Back 1 line">-Line</button>
                    <button id="btnGfxLine2" title="Forward 1 line">+Line</button>
                </div>
                <div class="gfx-nav-buttons">
                    <button id="btnGfxRow1" title="Back 8 lines">-Row</button>
                    <button id="btnGfxRow2" title="Forward 8 lines">+Row</button>
                </div>
                <div class="gfx-nav-buttons">
                    <button id="btnGfxSprite1" title="Previous sprite">-Spr</button>
                    <button id="btnGfxSprite2" title="Next sprite">+Spr</button>
                </div>
                <div class="gfx-nav-buttons">
                    <button id="btnGfxPage1" title="Back 24 rows (192 lines)">-Page</button>
                    <button id="btnGfxPage2" title="Forward 24 rows (192 lines)">+Page</button>
                </div>
            </div>
            <div class="gfx-control-group">
                <label>Width (bytes)</label>
                <div class="gfx-spinner">
                    <button id="btnGfxWidthMin" title="Minimum width (1 byte)">|&lt;</button>
                    <button id="btnGfxWidthDec" title="Decrease width">-</button>
                    <input type="text" id="gfxWidth" value="24" maxlength="2" title="Sprite width in bytes (1-32)">
                    <button id="btnGfxWidthInc" title="Increase width">+</button>
                    <button id="btnGfxWidthMax" title="Maximum width (32 bytes)">&gt;|</button>
                </div>
            </div>
            <div class="gfx-control-group">
                <label>Height (lines)</label>
                <div class="gfx-spinner">
                    <button id="btnGfxHeightDec8" title="Decrease height by 8 lines">-8</button>
                    <button id="btnGfxHeightDec" title="Decrease height">-</button>
                    <input type="text" id="gfxHeight" value="8" maxlength="2" title="Sprite height in lines (1-64)">
                    <button id="btnGfxHeightInc" title="Increase height">+</button>
                    <button id="btnGfxHeightInc8" title="Increase height by 8 lines">+8</button>
                </div>
            </div>
            <div class="gfx-control-group gfx-checkboxes">
                <label title="Invert colors (white on black)"><input type="checkbox" id="gfxInvert"> Invert</label>
                <label title="Show pixel grid overlay"><input type="checkbox" id="gfxGrid" checked> Grid</label>
                <label title="Character mode: 8x8 tiles stored sequentially"><input type="checkbox" id="gfxCharMode"> Char</label>
                <div class="gfx-zoom-inline">
                    <label title="1:1 zoom"><input type="radio" name="gfxZoom" id="gfxZoom1" value="1"> x1</label>
                    <label title="2:1 zoom"><input type="radio" name="gfxZoom" id="gfxZoom2" value="2" checked> x2</label>
                    <label title="3:1 zoom"><input type="radio" name="gfxZoom" id="gfxZoom3" value="3"> x3</label>
                </div>
            </div>
            <div class="gfx-control-group">
                <label>Preview</label>
                <div class="gfx-preview-wrap">
                    <canvas id="gfxPreviewCanvas" class="gfx-preview-canvas"></canvas>
                </div>
                <div class="gfx-info" id="gfxInfo">0000h: 8x8</div>
            </div>
        </div>
        <div class="gfx-col-actions">
            <div class="gfx-control-group">
                <label>Comment</label>
                <input type="text" id="gfxComment" placeholder="Sprite name..." maxlength="40" title="Label for the graphics region">
            </div>
            <div class="gfx-control-group gfx-actions">
                <button id="btnGfxMarkRegion" title="Mark selected area as graphics region">Mark</button>
                <button id="btnGfxCopyAsm" title="Copy selection as assembly DEFB statements">Copy</button>
                <button id="btnGfxSaveAsm" title="Save selection as .asm file">Save</button>
                <button id="btnGfxExportAll" title="Export all marked graphics regions">Export</button>
            </div>
            <div class="gfx-control-group gfx-actions">
                <button id="btnGfxGoDisasm" title="Go to address in Disassembler">→Disasm</button>
                <button id="btnGfxGoMem" title="Go to address in Memory view">→Memdump</button>
            </div>
        </div>
    </div>
</div>

<style>
    .graphics-container {
        padding: 10px;
        height: auto;
        display: flex;
        flex-direction: column;
    }
    .graphics-body {
        display: flex;
        gap: 10px;
        flex: 1;
        overflow: visible;
    }
    .graphics-dump-wrap {
        flex: 1;
        overflow: auto;
        background: #000;
        border: 1px solid var(--border-secondary);
        max-height: calc(100vh - 200px);
    }
    .graphics-dump-canvas {
        image-rendering: pixelated;
        display: block;
    }
    .gfx-col-address,
    .gfx-col-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex-shrink: 0;
    }
    .gfx-control-group {
        background: var(--bg-secondary);
        border: 1px solid var(--border-secondary);
        border-radius: 4px;
        padding: 8px;
    }
    .gfx-control-group label {
        display: block;
        font-size: 10px;
        color: var(--text-secondary);
        margin-bottom: 4px;
    }
    .gfx-control-group input[type="text"] {
        width: 100%;
        padding: 4px 6px;
        background: var(--bg-primary);
        border: 1px solid var(--border-secondary);
        color: var(--text-primary);
        border-radius: 3px;
        font-family: monospace;
        font-size: 12px;
        box-sizing: border-box;
    }
    :global(#gfxAddress) {
        width: 50px;
    }
    .gfx-spinner {
        display: flex;
        gap: 2px;
    }
    .gfx-spinner input {
        width: 30px !important;
        max-width: 30px;
        flex: 0 0 30px;
        text-align: center;
    }
    .gfx-spinner button {
        width: 28px;
        padding: 4px;
        background: var(--bg-button);
        border: 1px solid var(--border-secondary);
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 3px;
    }
    .gfx-spinner button:hover {
        background: var(--accent);
        color: var(--bg-primary);
    }
    .gfx-checkboxes label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-right: 10px;
        cursor: pointer;
    }
    .gfx-zoom-inline {
        display: flex;
        gap: 6px;
        margin-top: 4px;
    }
    .gfx-zoom-inline label {
        margin-right: 0;
    }
    .gfx-nav-buttons {
        display: flex;
        gap: 2px;
        margin-bottom: 2px;
        width: 160px;
    }
    .gfx-nav-buttons button {
        flex: 1;
        padding: 4px 6px;
        background: var(--bg-button);
        border: 1px solid var(--border-secondary);
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 3px;
        font-size: 10px;
    }
    .gfx-nav-buttons button:hover {
        background: var(--accent);
        color: var(--bg-primary);
    }
    .gfx-preview-wrap {
        background: #000;
        border: 1px solid var(--border-secondary);
        padding: 4px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        overflow: hidden;
        max-width: 160px;
        min-height: 200px;
    }
    .gfx-preview-canvas {
        image-rendering: pixelated;
        max-width: 100%;
    }
    .gfx-info {
        font-size: 10px;
        color: var(--text-secondary);
        text-align: center;
        margin-top: 4px;
    }
    .gfx-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .gfx-actions button {
        padding: 6px 8px;
        background: var(--bg-button);
        border: 1px solid var(--accent);
        color: var(--accent);
        cursor: pointer;
        border-radius: 3px;
        font-size: 11px;
    }
    .gfx-actions button:hover {
        background: var(--accent);
        color: var(--bg-primary);
    }

    @media (min-width: 1400px) {
        .graphics-container {
            max-height: calc(100vh - 100px) !important;
        }
        .graphics-dump-wrap {
            max-height: calc(100vh - 180px) !important;
        }
    }
</style>
