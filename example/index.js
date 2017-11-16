// MIT © 2017 azu
"use strict";
const { PerformanceMetadataMarker } = require("performance-mark-metadata");
const marker = new PerformanceMetadataMarker();
const outputTextField = document.getElementById("js-output");
// main content

const canvasContext = document.getElementById("js-canvas").getContext("2d");

function render() {
    canvasContext.clearRect(0, 0, 320, 320);
    canvasContext.font = "24px serif";
    canvasContext.fillText(new Date().toISOString(), 0, 100);
    requestAnimationFrame(render);
}

render();
// fps
const FpsEmitter = require("fps-emitter");
const fps = new FpsEmitter();
fps.on("update", function(FPS) {
    // mark current FPS
    marker.mark("FPS", {
        details: {
            FPS: FPS
        }
    });

    const pageLoad = performance.timing.navigationStart;
    const output = performance.getEntriesByType("mark").map(entry => {
        const meta = marker.getEntryMetadata(entry);
        return {
            type: entry.name,
            timeStamp: pageLoad + entry.startTime,
            meta: meta
        };
    });
    outputTextField.textContent = JSON.stringify(output, null, 4);
});
// defined heavy task
const heavyTaskButton = document.getElementById("js-button");
heavyTaskButton.addEventListener("click", () => {
    marker.mark("Heavy Action");

    // It is junk code
    function getRndColor() {
        const r = (255 * Math.random()) | 0,
            g = (255 * Math.random()) | 0,
            b = (255 * Math.random()) | 0;
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    for (let i = 0; i < 5; i++) {
        let x = 0;
        let y = 0;
        const width = document.getElementById("js-canvas2").width;
        const canvasContext = document.getElementById("js-canvas2").getContext("2d");
        for (; y < width; y++) {
            // walk x/y grid
            for (x = 0; x < width; x++) {
                canvasContext.fillStyle = getRndColor(); // set random color
                canvasContext.fillRect(x, y, 1, 1); // draw a pixel
            }
        }
    }
});
