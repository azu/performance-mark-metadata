import { MapLike } from "map-like";
import { getPerformanceObject } from "./performance-api";

const performance = getPerformanceObject();

export interface PerformanceMetadataMarkerMetadata {
    startTime?: number;
    details: any;
}

export class PerformanceMetadataMarker {
    private metadataMap = new MapLike<PerformanceEntry, any>();

    /**
     * Mark `name` with `metadata`
     * You can get the `metadata` by using `getEntryMetadata`.
     */
    mark(name: string, metadata?: PerformanceMetadataMarkerMetadata): void {
        performance.mark(name);
        if (!metadata) {
            return;
        }
        const entries = performance.getEntriesByName(name);
        const currentMark = entries[entries.length - 1];
        if (currentMark) {
            this.metadataMap.set(currentMark, metadata);
        }
    }

    /**
     * Return a metadata if match the `entry`
     */
    getEntryMetadata(entry: PerformanceEntry): PerformanceMetadataMarkerMetadata | undefined {
        return this.metadataMap.get(entry);
    }

    /**
     * Clear a metadata for `entry`
     */
    clearEntryMetadata(entry: PerformanceEntry) {
        return this.metadataMap.delete(entry);
    }

    /**
     * Clear all metdata
     */
    clear(): void {
        return this.metadataMap.clear();
    }
}
