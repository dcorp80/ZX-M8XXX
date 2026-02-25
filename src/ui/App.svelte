<script lang="ts">
    import TopBar from './TopBar.svelte';
    import ScreenDisplay from './ScreenDisplay.svelte';
    import StatusBar from './StatusBar.svelte';
    import ControlPanel from './ControlPanel.svelte';
    import TabBar from './TabBar.svelte';

    let { emulator }: { emulator: any } = $props();
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
