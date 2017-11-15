import { MapLike } from "map-like";
import { getPerformanceObject } from "./performance-api";

const performance = getPerformanceObject();

function set_resource_timing_buffer_size(maxSize: number) {
    if (performance === undefined) {
        return;
    }
    const supported = typeof performance.setResourceTimingBufferSize == "function";
    if (supported) {
        performance.setResourceTimingBufferSize(maxSize);
    }
}

export interface PerformanceMetadataMarkerMetadata {
    startTime?: number;
    details: any;
}

export class PerformanceMetadataMarker {
    private metadataMap = new MapLike<PerformanceEntry, any>();

    setResourceTimingBufferSize(maxSize: number) {
        set_resource_timing_buffer_size(maxSize);
    }

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

    getEntryMetadata(entry: PerformanceEntry): PerformanceMetadataMarkerMetadata | undefined {
        return this.metadataMap.get(entry);
    }

    clearEntryMetadata(entry: PerformanceEntry) {
        return this.metadataMap.delete(entry);
    }

    clear(): void {
        return this.metadataMap.clear();
    }
}
