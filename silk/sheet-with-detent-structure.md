# Silk Sheet with Detent: Confirmed DOM Structure & Behavior

Based on live DOM inspection of the Silk "Sheet with Detent" example.

## Core Hierarchy (Verified)

```html
<!-- ROOT VIEW (a1) -->
<!-- pos:fixed | overflow:clip | z:1 -->
<div class="SheetWithDetent-view" data-silk="a1 ...">

  <!-- PRIMARY SCROLL TRAP (b0) -->
  <!-- pos:absolute | overflow:hidden auto -->
  <div data-silk="b0 ... a4 ...">

    <!-- SCROLL STABILIZER (b1) -->
    <!-- pos:sticky -->
    <div data-silk="b1">

      <!-- BACKDROP (a2) -->
      <!-- pos:absolute | z:-1 -->
      <div class="SheetWithDetent-backdrop" data-silk="a2 ..."></div>

      <!-- SCROLL CONTAINER (a6) -->
      <!-- pos:absolute | snap:y mandatory | overflow:hidden auto | z:1 -->
      <!-- CRITICAL: Has pointer-events: auto (default) to allow scrolling -->
      <div data-silk="a6 ...">

        <!-- FRONT SPACER (a7) -->
        <!-- pos:static | pe:none | align:start | order:1 -->
        <div data-silk="a7 ..."></div>

        <!-- CONTENT WRAPPER (a10) -->
        <!-- pos:sticky | pe:none | z:1 | order:2 -->
        <!-- CRITICAL: pe:none prevents it from blocking scroll on a6, but children re-enable pointer-events -->
        <div data-silk="a10 ...">

          <!-- CONTENT (a11) -->
          <!-- pos:relative -->
          <!-- Note: Inspection shows pointer-events:auto inherited or set explicitly on children/interactive elements -->
          <div class="SheetWithDetent-content" data-silk="a11 ...">

            <!-- HEADER/HANDLE AREA -->
            <div class="ExampleSheetWithDetent-header">
              <button class="SheetWithDetent-handle" data-silk="a16 a17 ...">
                <!-- Handle is interactive -->
              </button>
              <!-- ... title, inputs ... -->
            </div>

            <!-- INNER SCROLL VIEW (c1/c2) -->
            <!-- Internal scrolling content -->
            <div class="SheetWithDetent-scrollView ...">
               <!-- ... -->
            </div>

          </div>

          <!-- EDGE MARKER (a15) -->
          <!-- pos:absolute -->
          <div data-silk="a15 ..."></div>

        </div>

        <!-- BACK SPACER (a8) -->
        <!-- pos:relative | pe:none | align:end | order:3 -->
        <div data-silk="a8 ...">

          <!-- DETENT MARKERS (a9) -->
          <!-- pos:absolute | pe:none | align:start (for bottom sheet) -->
          <div data-silk="a9 ..."></div>

          <!-- Additional marker(s) -->
          <div data-silk="a9 ..."></div>

        </div>

      </div>
    </div>
  </div>

  <!-- SECONDARY SCROLL TRAP (b0/a5) -->
  <!-- pos:absolute | overflow:auto | z:-1 -->
  <div data-silk="b0 ... a5 ..."></div>

</div>
```

## Critical Findings

1.  **`primary-scroll-trap` (b0) allows pointer events**: The inspection shows `overflow:hidden auto`, which implies interaction. It does **not** have `pe:none` in the log.
2.  **`scroll-container` (a6) allows pointer events**: The log shows `pos:absolute | snap:y mandatory | overflow:hidden auto | z:1`. It does **not** have `pe:none`. This confirms my fix was correct.
3.  **`content-wrapper` (a10) has `pe:none`**: `pos:sticky | pe:none | z:1 | order:2`. This allows touch/scroll events to pass through the wrapper to the `scroll-container` behind it, *unless* they hit a child with `pointer-events: auto`.
4.  **`content` (a11)**: The inspection didn't flag `pe:none`, meaning it accepts events (or children like the handle/buttons do).
5.  **Detent Markers (a9) inside Back Spacer (a8)**: Confirmed. `a8` is `order:3` (after content), and `a9` children are absolutely positioned within it.
6.  **Backdrop (a2) inside Stabilizer (b1)**: Confirmed. `a2` is a sibling of `a6` (scroll container), both inside `b1`.

## Implementation Corrections

*   **`scroll-container` (a6)** MUST have `pointer-events: auto` (or inherited) to be scrollable.
*   **`content-wrapper` (a10)** MUST have `pointer-events: none` to allow scrolling on the "empty" parts of the sticky area, but...
*   **`content` (a11)** MUST have `pointer-events: auto` (or specific children must) to allow interaction with the sheet content itself.

