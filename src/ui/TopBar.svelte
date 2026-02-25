<script lang="ts">
    let { emulator }: { emulator: any } = $props();

    function toggleTheme() {
        document.body.classList.toggle('light-theme');
    }
</script>

<div class="top-bar">
    <select id="machineSelect" class="toolbar-select" title="Select machine type">
    </select>
    <select id="loadSelect" class="toolbar-select" title="Load file" style="width:auto;padding:4px 6px;">
        <option value="" disabled selected hidden>Load</option>
        <option value="file">File</option>
        <option value="browse">Web</option>
        <option value="project">Project</option>
        <option value="quick">Quick (F5)</option>
    </select>
    <select id="saveSelect" class="toolbar-select" title="Save" style="width:auto;padding:4px 6px;">
        <option value="" disabled selected hidden>Save</option>
        <option value="sna">SNA</option>
        <option value="z80">Z80</option>
        <option value="szx">SZX</option>
        <option value="project">Project</option>
        <option value="quick">Quick (F2)</option>
    </select>
    <button id="btnHelpFull" class="test-link" title="ZX-M8XXX — Help">Help</button>
    <button class="theme-btn" title="Toggle light/dark theme" onclick={toggleTheme}>☀️</button>
    <input type="file" id="projectFileInput" class="file-input" accept=".zxproj,.json">
    <input type="file" id="rom48Input" class="file-input" accept=".rom,.bin">
    <input type="file" id="rom128Input" class="file-input" accept=".rom,.bin">
    <input type="file" id="romPlus2Input" class="file-input" accept=".rom,.bin">
    <input type="file" id="romPlus2aInput" class="file-input" accept=".rom,.bin">
    <input type="file" id="romPlus3Input" class="file-input" accept=".rom,.bin">
    <input type="file" id="romPentagonInput" class="file-input" accept=".rom,.bin">
    <input type="file" id="romScorpionInput" class="file-input" accept=".rom,.bin">
    <input type="file" id="romTrdosInput" class="file-input" accept=".rom,.bin">
    <input type="file" id="fileInput" class="file-input" accept=".sna,.tap,.tzx,.z80,.szx,.zip,.rzx,.trd,.scl,.dsk">
</div>

<style>
    .top-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
        flex-wrap: wrap;
    }
    .toolbar-select {
        padding: 6px 10px;
        font-size: 12px;
    }
    .test-link {
        color: var(--text-secondary);
        font-size: 12px;
        text-decoration: none;
        padding: 4px 8px;
        background: var(--bg-button);
        border-radius: 3px;
    }
    .test-link:hover {
        background: var(--bg-button-hover);
        color: var(--text-primary);
    }
    .theme-btn {
        background: var(--bg-secondary);
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        color: inherit;
        outline: none;
        box-shadow: none;
        transition: none;
    }
    .theme-btn:hover {
        background: var(--bg-button-hover);
    }
</style>
