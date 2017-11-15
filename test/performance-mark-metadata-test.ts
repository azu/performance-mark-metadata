import { PerformanceMetadataMarker } from "../src/performance-mark-metadata";
import { getPerformanceObject } from "../src/performance-api";
import * as assert from "assert";

const performance = getPerformanceObject();
describe("performance-mark-metadata", () => {
    beforeEach(() => {
        performance.clearMarks();
        performance.clearMeasures();
    });
    describe("mark and getEntryMetadata", () => {
        it("should mark with metadata", () => {
            const marker = new PerformanceMetadataMarker();
            const metadata = {
                details: { key: "value" }
            };
            const markerName = "1";
            marker.mark(markerName, metadata);
            performance.getEntriesByName(markerName).forEach((entry: PerformanceEntry) => {
                const result = marker.getEntryMetadata(entry);
                assert.strictEqual(result, metadata, "same metadata");
                assert.deepStrictEqual(result, metadata, "same metadata");
            });
        });
        context("when marked same name", () => {
            it("should return correct details", () => {
                const marker = new PerformanceMetadataMarker();
                const metadata = {
                    details: { key: "value" }
                };
                const markerName = "1";
                // 1. with metadata
                marker.mark(markerName, metadata);
                // 2. without metadata
                marker.mark(markerName);
                const results = performance.getEntriesByName(markerName).map((entry: PerformanceEntry) => {
                    return marker.getEntryMetadata(entry);
                });
                const [first, second] = results;
                assert.deepStrictEqual(first, metadata);
                assert.deepStrictEqual(second, undefined);
            });
        });
    });

    describe("mark and clearEntryMetadata", () => {
        it("should clear by clearEntryMetadata", () => {
            const marker = new PerformanceMetadataMarker();
            const metadata = {
                details: { key: "value" }
            };
            const markerName = "1";
            marker.mark(markerName, metadata);
            const results = performance
                .getEntriesByName(markerName)
                .map((entry: PerformanceEntry) => {
                    return marker.getEntryMetadata(entry);
                })
                .filter((result: any) => result !== undefined);
            assert.strictEqual(results.length, 1, "have 1 metadata");
            // clear
            performance.getEntriesByName(markerName).map((entry: PerformanceEntry) => {
                marker.clearEntryMetadata(entry);
            });
            const noResults = performance
                .getEntriesByName(markerName)
                .map((entry: PerformanceEntry) => {
                    return marker.getEntryMetadata(entry);
                })
                .filter((result: any) => result !== undefined);
            assert.strictEqual(noResults.length, 0, "already clear");
        });
        context("clear all metadata", () => {
            it("should return correct details", () => {
                const marker = new PerformanceMetadataMarker();
                const metadata = {
                    details: { key: "value" }
                };
                const markerName = "1";
                marker.mark(markerName, metadata);
                const results = performance
                    .getEntriesByName(markerName)
                    .map((entry: PerformanceEntry) => {
                        return marker.getEntryMetadata(entry);
                    })
                    .filter((result: any) => result !== undefined);
                assert.strictEqual(results.length, 1, "have 1 metadata");
                // clear
                marker.clear();
                const noResults = performance
                    .getEntriesByName(markerName)
                    .map((entry: PerformanceEntry) => {
                        return marker.getEntryMetadata(entry);
                    })
                    .filter((result: any) => result !== undefined);
                assert.strictEqual(noResults.length, 0, "already clear");
            });
        });
    });
    context("usecase", () => {
        it("can various mark and collect report of the marked entry", () => {});
    });
});
