<!-- ROM Selection Modal — shown only if ROMs not found in roms/ -->
<!-- Preserves same IDs so js/app/rom-manager.js continues to work unchanged -->
<div class="modal-overlay hidden" id="romModal">
    <div class="modal">
        <h2>🖥️ ROM Files Required</h2>
        <p>No ROM files found in <code>roms/</code> directory. Select ROM files below, or place them in the <code>roms/</code> folder.</p>

        <div class="rom-grid">
            <button id="btnSelect48Rom">48.rom</button>
            <div class="rom-status" id="status48Rom">Not loaded (required)</div>

            <button id="btnSelect128Rom">128.rom</button>
            <div class="rom-status" id="status128Rom">Not loaded</div>

            <button id="btnSelectPlus2Rom">plus2.rom</button>
            <div class="rom-status" id="statusPlus2Rom">Not loaded</div>

            <button id="btnSelectPlus2aRom">plus2a.rom</button>
            <div class="rom-status" id="statusPlus2aRom">Not loaded</div>

            <button id="btnSelectPlus3Rom">plus3.rom</button>
            <div class="rom-status" id="statusPlus3Rom">Not loaded</div>

            <button id="btnSelectPentagonRom">pentagon.rom</button>
            <div class="rom-status" id="statusPentagonRom">Not loaded</div>

            <button id="btnSelectScorpionRom">scorpion.rom</button>
            <div class="rom-status" id="statusScorpionRom">Not loaded</div>

            <button id="btnSelectTrdosRom">trdos.rom</button>
            <div class="rom-status" id="statusTrdosRom">Not loaded (for TRD/SCL disks)</div>
        </div>

        <div class="modal-actions">
            <button id="btnStartEmulator" class="primary" disabled>Start Emulator</button>
            <button id="btnCloseRomModal" class="hidden">Close</button>
        </div>

        <p class="modal-hint">
            You can also drag & drop ROM files onto this dialog.
        </p>
    </div>
</div>
