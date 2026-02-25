<script lang="ts">
    import { onMount } from 'svelte';

    import type { EmulatorController } from '../core/emulator-controller';
    let { emulator }: { emulator: EmulatorController } = $props();

    let wrapper: HTMLDivElement;

    onMount(() => {
        const screen = document.getElementById('screen');
        const overlay = document.getElementById('overlayCanvas');
        if (screen) wrapper.appendChild(screen);
        if (overlay) wrapper.appendChild(overlay);
    });
</script>

<div class="screen-container">
    <div class="screen-wrapper" bind:this={wrapper}>
        <div id="spriteRegionOverlay" class="sprite-region-overlay"></div>
    </div>
    <div id="screenInfoPopup" class="screen-info-popup hidden"></div>
    <div id="xrefTooltip" class="xref-tooltip"></div>
</div>

<style>
    .screen-container {
        background: var(--bg-screen);
        padding: 6px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        margin-bottom: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        overflow: auto;
        position: relative;
    }
    .screen-wrapper {
        position: relative;
        display: inline-block;
    }
    .screen-wrapper :global(#screen) {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
        cursor: crosshair;
        display: block;
    }
    .screen-wrapper :global(#overlayCanvas) {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 10;
    }
    .sprite-region-overlay {
        position: absolute;
        pointer-events: none;
        z-index: 20;
        border: 2px dashed #ff0000;
        background: rgba(255, 0, 0, 0.15);
        box-sizing: border-box;
        display: none;
    }
    /* Fullscreen mode styles */
    .screen-wrapper:fullscreen,
    .screen-wrapper:-webkit-full-screen {
        background: #000 !important;
        overflow: hidden !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    .screen-wrapper:fullscreen .sprite-region-overlay,
    .screen-wrapper:-webkit-full-screen .sprite-region-overlay {
        display: none !important;
    }
    .screen-info-popup {
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 11px;
        line-height: 1.5;
        z-index: 100;
        pointer-events: none;
        white-space: nowrap;
        border: 1px solid var(--cyan);
    }
    .screen-info-popup.hidden {
        display: none;
    }
    .xref-tooltip {
        display: none;
    }
</style>
