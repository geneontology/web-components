import { describe, it } from "vitest";

describe.skip("go-entity-autocomplete", () => {
  it("renders", () => {
    // TODO:
    // This component currently needs a more reliable Stencil test setup before a
    // useful spec test can be added. The missing pieces to figure out are:
    // 1. How to deterministically flip `ready` after the async `dbxrefs.init()`
    //    path in `componentWillLoad()` so the input actually renders.
    // 2. How to drive or bypass the internal 800ms debounce in `newSearch()` in a
    //    way that works consistently with `@stencil/vitest`.
    // 3. Whether the cleanest path is testing through DOM input events or exposing
    //    a more testable public method/state transition for the search flow.
  });
});
