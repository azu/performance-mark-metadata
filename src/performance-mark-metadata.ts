import { MapLike } from "map-like";

export interface PerformanceMetadataMarkerMetadata {
    startTime?: number;
    details: any;
}

export interface PerformanceMetadataMarkerArgs {
    performance?: Performance;
}

export class PerformanceMetadataMarker {
    private metadataMap = new MapLike<PerformanceEntry, any>();
    private performance: Performance;

    constructor(args: PerformanceMetadataMarkerArgs = {}) {
        this.performance = args.performance || performance;
    }

    /**
     * Mark `name` with `metadata`
     * You can get the `metadata` by using `getEntryMetadata`.
     */
    mark(name: string, metadata?: PerformanceMetadataMarkerMetadata): void {
        this.performance.mark(name);
        if (!metadata) {
            return;
        }
        const entries = this.performance.getEntriesByName(name, "mark");
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
     * Clear all metadata
     */
    clear(): void {
        return this.metadataMap.clear();
    }
}
