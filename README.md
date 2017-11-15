# performance-mark-metadata

performance.mark with custom meta data.

This library inspired by [User Timing API Level 3](https://docs.google.com/presentation/d/1d64Y4rtLCxobGgljVySU2CJpMPK5ksaiZuv3ka1dCVA/edit#slide=id.p "User Timing L3")
This proposal will add `details` as metadata to `performance.mark`.

## Dependencies

- [Performance.mark()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark "Performance.mark()")
- [Performance Timing API | Node.js v9.2.0 Documentation](https://nodejs.org/api/perf_hooks.html "Performance Timing API | Node.js v9.2.0 Documentation")
    - Modern browser or Node.js 8.5.0>=

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
export declare class PerformanceMetadataMarker {
    private metadataMap;
    setResourceTimingBufferSize(maxSize: number): void;
    mark(name: string, metadata?: PerformanceMetadataMarkerMetadata): void;
    getEntryMetadata(entry: PerformanceEntry): PerformanceMetadataMarkerMetadata | undefined;
    clearEntryMetadata(entry: PerformanceEntry): boolean;
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
