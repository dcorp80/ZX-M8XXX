<script lang="ts">
    import RomModal from './components/modals/RomModal.svelte'
    import ZipModal from './components/modals/ZipModal.svelte'
    import MemoryMapDialog from './components/modals/MemoryMapDialog.svelte'
    import GameBrowserModal from './components/modals/GameBrowserModal.svelte'
    import FullHelpDialog from './components/modals/FullHelpDialog.svelte'
</script>

<!-- Svelte UI mounts here. Modal components render their DOM with the same IDs
     as the original index.html, so existing JS modules work unchanged. -->
<div id="svelte-shell" style="display: contents;">
    <!-- Phase 2: Modal dialogs -->
    <RomModal />
    <ZipModal />
    <MemoryMapDialog />
    <GameBrowserModal />
    <FullHelpDialog />
</div>
