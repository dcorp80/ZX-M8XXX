<!-- ZIP File Selection Modal -->
<!-- Preserves same IDs so js/app/media-io.js continues to work unchanged -->
<div id="zipModal" class="modal-overlay hidden">
    <div class="modal">
        <h2>Select File to Load</h2>
        <p>The archive contains multiple files. Select one to load:</p>
        <div id="zipFileList" class="zip-file-list"></div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="btnBootTrdos" class="secondary" style="display: none;">Boot TR-DOS</button>
            <button id="btnZipCancel" class="secondary">Cancel</button>
        </div>
    </div>
</div>
