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

[![Example](docs/example.png)](https://azu.github.io/performance-mark-metadata)

- See <https://azu.github.io/performance-mark-metadata>

```
git clone https://github.com/azu/performance-mark-metadata.git
cd performance-mark-metadata/docs
npm install
open index.html
```
 
You want to found performance problem on viewing the site.
You can analyze the problem by using `performance-mark-metadata`.

It is useful for [Real user monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring "Real user monitoring")(RUM).
In development, you can use browser's development tools, but it is difficult about RUM.

#### Mark points

- Mark current Frame Per Seconds(FPS)
- Mark each action

Record FPS

```js
const { PerformanceMetadataMarker } = require("performance-mark-metadata");
const marker = new PerformanceMetadataMarker();

const FpsEmitter = require("fps-emitter");
const fps = new FpsEmitter();
fps.on("update", function(FPS) {
    // mark current FPS
    marker.mark("FPS", {
        details: {
            FPS: FPS
        }
    });
});
```

and record action

```js
// heavy task
const heavyTaskButton = document.getElementById("js-button");
heavyTaskButton.addEventListener("click", () => {
    marker.mark("Heavy Action");

    // ... heavy task ...
})
```

After that, you can get FPS and action logs.

```js
const logData = performance.getEntriesByType("mark").map(entry => {
    const meta = marker.getEntryMetadata(entry);
    return {
        type: entry.name,
        timeStamp: entry.startTime,
        meta: meta
    };
});
```

#### Analytics

You can get the log data and analyze the log data.

For example, visualize the log data by using [C3.js](http://c3js.org/ "C3.js").
You can found the relationship  between "FPS" and "Heavy Task".

![example.gif](./docs/example.gif)

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
