// MIT © 2017 azu
"use strict";
const { PerformanceMetadataMarker } = require("performance-mark-metadata");
const marker = new PerformanceMetadataMarker();
const outputTextField = document.getElementById("js-output");
// main loop
(() => {
    const canvasContext = document.getElementById("js-canvas").getContext("2d");

    function render() {
        canvasContext.clearRect(0, 0, 240, 240);
        canvasContext.font = "24px serif";
        canvasContext.fillText(new Date().toISOString(), 0, 100);
        requestAnimationFrame(render);
    }

    render();
})();
// chart
// in custom-plotly.js
const Plotly = require("plotly.js");
const updateChart = logData => {
    const FPSLog = logData.filter(log => log.type === "FPS");
    const OtherLog = logData.filter(log => log.type !== "FPS");
    const trace1 = {
        x: FPSLog.map(log => Math.round(log.timeStamp)),
        y: FPSLog.map(log => log.meta.details.FPS),
        type: "scatter",
        name: "FPS"
    };
    const events = {
        x: OtherLog.map(log => Math.round(log.timeStamp)),
        y: 50,
        text: OtherLog.map(log => `${log.type}<br>${JSON.stringify(log)}`),
        mode: "markers",
        type: "scatter",
        marker: { size: 12 },
        name: "Event"
    };

    const layout = {
        title: "FPS and Action",
        yaxis: {
            range: [0, 60]
        }
    };
    const data = [trace1, events];
    Plotly.newPlot("js-chart", data, layout, { editable: true });
};
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

    const logData = performance.getEntriesByType("mark").map(entry => {
        const meta = marker.getEntryMetadata(entry);
        return {
            type: entry.name,
            timeStamp: entry.startTime,
            meta: meta
        };
    });
    updateChart(logData);
    outputTextField.textContent = JSON.stringify(logData, null, 4);
});
// heavy task
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
