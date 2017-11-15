export const getPerformanceObject = (): Performance => {
    if (typeof performance !== "undefined" && performance) {
        return performance;
    }
    try {
        const nodePerformanceHook = require("perf_hooks");
        return nodePerformanceHook.performance as Performance;
    } catch (e) {
        throw new Error("Not support this execution environment");
    }
};
