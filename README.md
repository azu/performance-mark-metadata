# performance-mark-metadata

`performance.mark` with custom meta data.

This library inspired by [User Timing API Level 3](https://docs.google.com/presentation/d/1d64Y4rtLCxobGgljVySU2CJpMPK5ksaiZuv3ka1dCVA/edit#slide=id.p "User Timing L3").
This proposal will add `details` as metadata to `performance.mark`.

## Supports

- Modern browser and Node.js >= 8.5.0
- They are supported [Performance.mark()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark "Performance.mark()") API.
- [Performance Timing API | Node.js v9.2.0 Documentation](https://nodejs.org/api/perf_hooks.html "Performance Timing API | Node.js v9.2.0 Documentation")

Old browser need to `Performance.mark()` polyfill.

- [nicjansma/usertiming.js: UserTiming polyfill](https://github.com/nicjansma/usertiming.js "nicjansma/usertiming.js: UserTiming polyfill")

## Install

Install with [npm](https://www.npmjs.com/):

    npm install performance-mark-metadata

## Usage

### API

```ts
export interface PerformanceMetadataMarkerMetadata {
    startTime?: number;
    details: any;
}
export interface PerformanceMetadataMarkerArgs {
    performance?: Performance;
}
export declare class PerformanceMetadataMarker {
    private metadataMap;
    private performance;
    constructor(args?: PerformanceMetadataMarkerArgs);
    /**
     * Mark `name` with `metadata`
     * You can get the `metadata` by using `getEntryMetadata`.
     */
    mark(name: string, metadata?: PerformanceMetadataMarkerMetadata): void;
    /**
     * Return a metadata if match the `entry`
     */
    getEntryMetadata(entry: PerformanceEntry): PerformanceMetadataMarkerMetadata | undefined;
    /**
     * Clear a metadata for `entry`
     */
    clearEntryMetadata(entry: PerformanceEntry): boolean;
    /**
     * Clear all metadata
     */
    clear(): void;
}
```

[PerformanceEntry](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry "PerformanceEntry") is defined in User Timing API.
It is results of `performance.getEntries()`, `performance.getEntriesByName()`, and `performance.getEntriesByType()`.

## Example

```js
import { PerformanceMetadataMarker } from "performance-mark-metadata";
const marker = new PerformanceMetadataMarker();
const metadata = {
    details: { key: "value" }
};
const markerName = "1";
// mark with metadata
marker.mark(markerName, metadata);
performance.getEntriesByName(markerName).forEach(entry => {
    const result = marker.getEntryMetadata(entry);
    /*
    {
        details: { key: "value" }
    };
    */
    assert.strictEqual(result, metadata, "should get same metadata");
});
```

### Usage in Node.js

Node.js 8.5.0 introduce [`perf_hooks`](https://nodejs.org/api/perf_hooks.html) module.
You pass `require("perf_hooks").performance` to `PerformanceMetadataMarker` constructor arguments.

```js
import { PerformanceMetadataMarker } from "performance-mark-metadata";
const nodePerformanceHook = require("perf_hooks");
const performance = nodePerformanceHook.performance;
const marker = new PerformanceMetadataMarker({
    performance
});
marker.mark("name", {
    details: { key: "value" }
});
```

### UseCase

You want to record performance logging and related metadata.
You can collection all these logging and metadata after finish all task. 

```js
const marker = new PerformanceMetadataMarker();
marker.mark("start", {
    details: {
        id: 1
    }
});

marker.mark("start task", {
    details: {
        id: 2
    }
});

return Promise.resolve().then(() => {
    marker.mark("finish task", {
        details: {
            id: 3
        }
    });
}).then(() => {
    // collect log and metadata.
    const results = performance
        .getEntries()
        .map(entry => {
            return marker.getEntryMetadata(entry);
        });
    assert.deepEqual(results, [
        {
            "details": {
                "id": 1
            }
        },
        {
            "details": {
                "id": 2
            }
        },
        {
            "details": {
                "id": 3
            }
        }
    ]);
});
```

## Changelog

See [Releases page](https://github.com/azu/performance-mark-metadata/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/performance-mark-metadata/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
