<script lang="ts">
    import { onMount } from 'svelte';
    import TopBar from './TopBar.svelte';
    import ScreenDisplay from './ScreenDisplay.svelte';
    import StatusBar from './StatusBar.svelte';
    import ControlPanel from './ControlPanel.svelte';
    import TabBar from './TabBar.svelte';
    import { PaletteManager } from '../core/palette-manager';

    import type { EmulatorController } from '../core/emulator-controller';
    let { emulator }: { emulator: EmulatorController } = $props();

    onMount(() => {
        // Load and apply saved palette on app startup
        PaletteManager.loadSaved(emulator.spectrum.ula);
    });
</script>

<div class="container">
    <TopBar {emulator} />

    <div class="main-layout">
        <div class="emulator-section">
            <ScreenDisplay {emulator} />
            <StatusBar {emulator} />
            <ControlPanel {emulator} />
        </div>

        <TabBar {emulator} />
    </div>
</div>
