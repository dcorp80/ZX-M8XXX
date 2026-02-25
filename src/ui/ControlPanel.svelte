<script lang="ts">
    import type { EmulatorController } from '../core/emulator-controller';
    let { emulator }: { emulator: EmulatorController } = $props();
</script>

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

<style>
    .controls {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 4px;
    }
    .controls :global(button),
    .controls :global(select) {
        padding: 2px 10px;
        font-size: 13px;
        height: 26px;
    }
    :global(#btnRun) { width: 90px; text-align: center; }
</style>
