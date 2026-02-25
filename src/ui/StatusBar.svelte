<script lang="ts">
    import type { EmulatorController } from '../core/emulator-controller';
    let { emulator }: { emulator: EmulatorController } = $props();
</script>

<div class="status">
    <span class="status-item">
        <span class="status-value" id="fps" style="min-width: 32px; display: inline-block; text-align: right;">0</span>
    </span>
    <span class="status-item" id="rzxInfo" style="visibility: hidden;">
        <span class="status-label">RZX:</span>
        <span class="status-value" id="rzxStatus" style="min-width: 130px; display: inline-block; font-variant-numeric: tabular-nums;">-</span>
        <button id="btnRzxStop" class="small-btn" title="Stop RZX playback">Stop</button>
    </span>
    <span class="status-item" id="tapeInfo" style="display:none;">
        <span class="status-label" id="tapeLed" title="No tape">📼</span>
        <span class="status-value" id="tapeProgress" style="color: var(--cyan); min-width: 30px; display: inline-block; text-align: right;"></span>
    </span>
    <span class="status-item" id="diskInfo" style="display:none;">
        <span class="status-label" id="diskInfoLed" title="No disk">💾</span>
    </span>
    <span class="status-item" id="diskActivity" style="display:none;">
        <span class="status-label" id="diskLed" title="Disk activity">💾</span>
        <span class="status-value" id="diskStatus" style="display:inline-block;min-width:6.5em;font-family:monospace;">-</span>
    </span>
</div>

<style>
    .status {
        text-align: left;
        padding: 6px;
        background: var(--bg-secondary);
        border-radius: 4px;
        margin-bottom: 8px;
        font-family: monospace;
        border: none;
        box-shadow: none;
        outline: none;
        overflow: hidden;
    }
    .status-item { display: inline-block; margin: 0 6px; }
    .status-label { color: var(--text-secondary); }
    .status-value { color: var(--cyan); }
    .small-btn {
        padding: 2px 6px;
        font-size: 10px;
        margin-left: 5px;
        background: var(--bg-button);
        border: 1px solid var(--bg-button);
        color: var(--text-primary);
        border-radius: 3px;
        cursor: pointer;
    }
    .small-btn:hover { background: var(--accent); }
</style>
