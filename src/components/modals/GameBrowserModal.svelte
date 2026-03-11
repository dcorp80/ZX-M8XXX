<!-- Game Browser Dialog -->
<!-- Preserves same IDs so js/views/game-browser.js continues to work unchanged -->
<div class="gamebrowser-dialog hidden" id="gameBrowserDialog">
    <div class="gamebrowser-content">
        <div class="gamebrowser-header">
            <h3>Game Browser</h3>
            <button class="gamebrowser-close" id="btnGameBrowserClose">&times;</button>
        </div>
        <div class="gamebrowser-search">
            <input type="text" id="gameBrowserSearch" placeholder="Search games..." spellcheck="false">
            <button id="btnGameBrowserSearchGo">Search</button>
            <span class="gamebrowser-source-info">Powered by <a href="https://spectrumcomputing.co.uk" target="_blank">Spectrum Computing</a></span>
        </div>
        <div class="gamebrowser-body">
            <div class="gamebrowser-results" id="gameBrowserResults">
                <div class="gamebrowser-status">
                    Enter a search term to find games
                </div>
            </div>
            <div class="gamebrowser-detail hidden" id="gameBrowserDetail">
                <div class="gamebrowser-detail-title" id="gameBrowserDetailTitle">Select a game</div>
                <div class="gamebrowser-detail-screen" id="gameBrowserDetailScreen">
                    <div class="gamebrowser-thumb-placeholder"></div>
                </div>
                <div class="gamebrowser-detail-info" id="gameBrowserDetailInfo"></div>
                <div class="gamebrowser-releases" id="gameBrowserReleases">
                    <div class="gamebrowser-releases-title">Available Downloads</div>
                    <div id="gameBrowserReleasesList"></div>
                </div>
                <div class="gamebrowser-external" id="gameBrowserExternal"></div>
            </div>
        </div>
        <div class="gamebrowser-pagination">
            <button id="btnGameBrowserPrev" disabled>&lt; Prev</button>
            <span id="gameBrowserPageInfo">Page 0 of 0</span>
            <button id="btnGameBrowserNext" disabled>Next &gt;</button>
        </div>
    </div>
</div>
