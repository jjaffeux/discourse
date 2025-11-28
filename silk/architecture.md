# Silk Component Library Architecture

Silk is a premium React component library for building native-like swipeable sheets and overlays on the web. This document provides a comprehensive architectural overview based on the deobfuscated source code, CSS implementation, and official documentation.

## Overview

Silk implements sophisticated sheet components using a combination of:
- **Compound Component Architecture**: Modular React components with clear separation of concerns
- **State Machine Coordination**: Four coordinated state machines managing sheet lifecycle
- **Physics-Based Animations**: Spring physics and cubic-bezier easing for natural motion
- **CSS Scroll Snap**: Advanced scroll-snap implementation for gesture-driven interactions
- **Accessibility First**: Comprehensive focus management, ARIA support, and screen reader compatibility
- **Cross-Platform Optimization**: Platform-specific optimizations for iOS, Android, and desktop

## Core Architecture Systems

### 1. Component Architecture

Silk uses a sophisticated compound component architecture with three primary component systems:

#### Sheet Components (`Sheet.*`)
The core sheet system providing swipeable modal overlays:
- **Root**: Container managing sheet lifecycle and state
- **Trigger**: Interactive elements that open/close sheets
- **View**: Viewport container defining travel boundaries
- **Content**: The actual sheet content that moves during travel
- **Backdrop**: Animated overlay behind the sheet
- **Portal**: Renders sheet outside DOM hierarchy
- **Handle**: Interactive drag handles
- **Title/Description**: Accessible labeling components

#### Stack Components (`Stack.*`)
Multi-sheet coordination system:
- **Root**: Groups related sheets for stacking behavior
- **Outlet**: Animation targets for stacking-driven effects

#### ScrollView Components (`ScrollView.*`)
Enhanced scrollable containers:
- **Root**: Main scrollable container with Silk features
- **Content**: Scrollable content wrapper

### 2. State Machine System

Silk implements four coordinated state machines that manage the complete sheet lifecycle:

#### Openness Machine
Controls mount/unmount lifecycle:
```
closed.safe-to-unmount → opening → open → closing → closed.pending → closed.safe-to-unmount
```

#### Staging Machine
Coordinates animations:
- `none`: No animation in progress
- `animating`: Animation currently running

#### Position Machine
Manages stacking position:
- `front`: Topmost sheet
- `covered`: Partially covered by sheets above
- `back`: Completely covered

#### Active Machine
Controls interactivity:
- `active`: Sheet accepts user input
- `inactive`: Sheet blocked by sheets above

### 3. Animation System

#### Physics-Based Motion
Silk uses Web Animations API with spring physics:
- **Cubic Bezier Easing**: `bezierCurve()` and `bezierDerivative()` functions
- **Newton-Raphson Solver**: Solves bezier equations for smooth interpolation
- **Spring Physics**: Configurable stiffness, damping, and mass parameters

#### Animation Presets
```javascript
presets: {
  gentle: { easing: "spring", stiffness: 560, damping: 68, mass: 1.85 },
  smooth: { easing: "spring", stiffness: 580, damping: 60, mass: 1.35 },
  snappy: { easing: "spring", stiffness: 350, damping: 34, mass: 0.9 },
  brisk: { easing: "spring", stiffness: 350, damping: 28, mass: 0.65 },
  bouncy: { easing: "spring", stiffness: 240, damping: 19, mass: 0.7 },
  elastic: { easing: "spring", stiffness: 260, damping: 20, mass: 1 }
}
```

#### Travel-Driven Animation
Declarative animations based on sheet travel progress:
```jsx
<Sheet.Outlet travelAnimation={{
  opacity: [0, 0.5],  // Keyframes syntax
  translateY: ({ progress }) => progress * 100 + "px"  // Function syntax
}} />
```

#### Stacking-Driven Animation
Animations based on sheets stacked above:
```jsx
<SheetStack.Outlet stackingAnimation={{
  scale: [1, 0.95]  // Background blur effect
}} />
```

### 4. Gesture System

#### Multi-Axis Gesture Recognition
- **Touch Events**: `touchstart`, `touchmove`, `touchend`
- **Mouse Events**: `mousedown`, `mousemove`, `mouseup`
- **Wheel Events**: Momentum scrolling support
- **Keyboard**: Arrow keys and escape handling

#### Velocity Calculation
Silk tracks gesture velocity for:
- **Inertia Physics**: Continued motion after touch release
- **Swipe Detection**: Fast swipes trigger auto-stepping
- **Momentum Scrolling**: Wheel-based dismissal

#### Platform Optimizations
- **iOS Safari**: Edge swipe prevention, WebKit-specific scroll handling
- **Android**: Different swipe trap defaults for UI consistency
- **Desktop**: Wheel event handling with momentum detection

### 5. Focus Management System

#### Auto-Focus Logic
```javascript
function handlePresentAutoFocus(layerId, container, handler) {
  if (handler) handler();
  focusFirstElement(layerId, container);
}
```

#### Focusable Element Detection
```javascript
function getFocusableElements(container, additionalSelectors) {
  // Returns categorized focusable elements with tabbable/skippable flags
}
```

#### Focus Restoration
```javascript
function handleDismissAutoFocus(layerId, container, handler, fallback) {
  // Restores focus to previous element or fallback
}
```

### 6. Global Registry System

Central coordination system for all Silk instances:
```javascript
var silkRegistry = {
  layers: new Map(),           // Active layer tracking
  sheets: new Map(),           // Sheet instance registry
  autoFocusTargets: new Set(), // Focus management targets
  fixedComponents: new Set(),  // Fixed-position elements
  themeColorMetaTag: null,     // OS status bar color
  underlyingThemeColor: null,  // Base theme color
  themeColorDimmingOverlays: [] // Active backdrop overlays
};
```

#### Theme Color Management
Silk automatically dims the OS status bar to match sheet backdrops:
```javascript
updateThemeColorDimmingOverlay({
  dimmingOverlayId: "sheet-backdrop-" + Math.random(),
  color: [0, 0, 0],  // Black overlay
  alpha: 0.33         // 33% opacity
});
```

### 7. CSS Architecture

Silk uses a sophisticated CSS system with data attributes and CSS variables:

#### Data-Silk Attribute System
CSS selectors use `data-silk` attributes for component targeting:
```css
[data-silk~="a1"] { /* Root container */ }
[data-silk~="a6"] { /* Scroll container */ }
[data-silk~="a11"] { /* Content */ }
```

#### CSS Variables System
Dynamic styling through CSS custom properties:
```css
:root {
  --silk-100-lvh-dvh-pct: max(100%, 100dvh);  /* Viewport height */
}

[data-silk~="a1"] {
  --silk-aO: var(--silk-aD, 100%);  /* Travel size */
  --silk-aF: 300px;                  /* Content travel distance */
  --silk-aH: calc(var(--silk-aO) + var(--silk-aF)); /* Spacer height */
}
```

#### Scroll Snap Implementation
Advanced scroll-snap for gesture-driven interactions:
```css
[data-silk~="a6"] {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  overflow-x: hidden;
}
```

#### Detent Markers
Each detent gets a marker element with precise positioning:
```css
[data-silk~="a9"] {
  position: absolute;
  scroll-snap-align: start;
  bottom: calc(100% + (var(--silk-aO) - var(--silk-aB)) / 2);
}
```

## DOM Structure & Rendering

### Component Hierarchy

```
Sheet.Root (Container)
├── Sheet.Outlet (Animation target)
├── Sheet.Trigger (Interactive trigger)
└── Sheet.Portal (Out-of-tree rendering)
    └── Sheet.View (Viewport container)
        ├── Sheet.Backdrop (Animated overlay)
        └── Sheet.Content (Moving content)
            ├── Sheet.BleedingBackground (Extended background)
            ├── Sheet.Handle (Drag handle)
            ├── Sheet.Title (Accessible title)
            └── Sheet.Description (Accessible description)
```

### Scroll Container Architecture

Silk uses nested scroll containers for sophisticated gesture handling:

#### Primary Scroll Container (`a6`)
**Purpose**: Implements scroll-snap for gesture-driven interactions
**Key Features**:
- `scroll-snap-type: y mandatory` (or `x` for horizontal)
- Contains front/back spacers and detent markers
- Handles momentum scrolling and swipe gestures
- Overscroll behavior controlled per axis

#### Secondary Scroll Container (`b0`)
**Purpose**: Provides scroll stabilization and custom scrollbars
**Variants**:
- `bBf`: Vertical scrolling with horizontal clip
- `bBe`: Horizontal scrolling with vertical clip
- `bBg`: Bidirectional scrolling
- `bCa`: Overflow clipping

#### Scroll Stabilizer (`b1`)
**Purpose**: Sticky positioning context for content
**Implementation**: `position: sticky` wrapper that maintains scroll state

### Detent System

#### Marker Elements (`a9`)
Each detent gets a positioned marker element:
```html
<div data-silk="a9" style="--silk-aB: 425px; --silk-aC: 0"></div>
```

#### Spacer Elements
- **Front Spacer** (`a7`): Creates space before content (closed position)
- **Back Spacer** (`a8`): Creates space after content
- **Content Wrapper** (`a10`): Sticky positioned content container

### Portal System

Silk renders sheets outside the normal DOM hierarchy:
```jsx
<Sheet.Portal container={document.body}>
  {/* Sheet renders here */}
</Sheet.Portal>
```

This ensures sheets appear above all other content and prevents CSS containment issues.

## Animation & Interaction System

### Travel Animation Sequence

#### Opening Animation
1. **State Change**: `closed.safe-to-unmount → opening`
2. **DOM Mount**: Sheet.View component mounts
3. **Initial Scroll**: Scroll container positioned at front-spacer height
4. **Transform Animation**: Content wrapper animates from closed to open position
5. **State Complete**: `opening → open` (animation finished)
6. **Cleanup**: Transform cleared, scroll position maintained

#### Closing Animation
1. **State Change**: `open → closing`
2. **Transform Animation**: Content wrapper animates to closed position
3. **Intersection Observer**: Monitors when content leaves viewport
4. **DOM Unmount**: `closing → closed.pending → closed.safe-to-unmount`
5. **Component Removal**: Sheet.View unmounts

### Scroll-Based Progress Calculation

Silk calculates animation progress from scroll position:

```javascript
// Progress calculation for backdrop opacity and travel animations
rawProgress = (scrollTop - snapAccelerator) / contentSize;
clampedProgress = Math.max(firstDetentProgress, Math.min(1, rawProgress));

// Backdrop opacity formula
opacity = Math.min(0.33 * progress, 0.33);
```

### Auto-Stepping (Swipe Overshoot)

When `swipeOvershoot` is enabled, fast swipes trigger auto-advancement:

#### Stuck Detection State Machine
```javascript
// Tracks when scroll reaches detent boundaries
{
  name: "frontStuck",  // At last detent
  initial: "false",
  states: {
    false: { messages: { STUCK_START: "true" } },
    true: { messages: { STUCK_END: "false" } }
  }
}
```

#### Auto-Step Logic
```javascript
// On touch end, if stuck at boundary, auto-advance
if (matches("frontStuck:true") && matches("touch:ended")) {
  travelToDetent({ destinationDetent: lastDetent, behavior: "instant" });
}
```

### Desktop Scroll-to-Dismiss

#### Intersection Observer Implementation
```javascript
// Monitors Sheet.Content relative to Sheet.View
const observer = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) {
    // Content off-screen, trigger dismissal
    send({ type: "SWIPED_OUT" });
  }
});
```

#### Wheel Event Handling
- **Momentum Detection**: Tracks wheel events during dismissal
- **Event Blocking**: Prevents further wheel events for 100ms
- **State Machine**: Triggers `SWIPED_OUT` message

### Platform-Specific Optimizations

#### iOS Safari
- **Edge Swipe Prevention**: 30px blocker prevents "swipe back" navigation
- **WebKit Scroll Handling**: Special scroll behavior for momentum
- **Touch Event Optimization**: Platform-specific gesture recognition

#### Android
- **Swipe Trap Defaults**: `swipeTrap: { x: true, y: false }` in non-standalone mode
- **UI Consistency**: Prevents interference with system UI gestures

#### Desktop
- **Wheel Momentum**: Supports fling gestures via mouse wheel
- **Keyboard Navigation**: Arrow keys and escape handling

**State Modifiers**:
- `aHp`: Hidden overflow (for locking scroll)
- `aJp`: Snap to closest detent
- `aMk`: Overscroll contain on y-axis
- `aMj`: Overscroll contain on x-axis

## CSS Variables & Styling System

### Root Variables (Global)
```css
:root {
  --silk-100-lvh-dvh-pct: max(100%, 100dvh);  /* Modern viewport height */
}
```

### Container Variables (`a1` - Root View)
```css
[data-silk~="a1"] {
  --silk-aD: initial;     /* Container width */
  --silk-aE: initial;     /* Container height */
  --silk-aF: initial;     /* Travel distance */
  --silk-aG: initial;     /* Max travel distance */
  --silk-aH: initial;     /* Front spacer size */
  --silk-aI: initial;     /* Back spacer size */
  --silk-aJ: 1px;         /* Snap threshold */
  --silk-aK: initial;     /* Override travel distance */
  --silk-aL: 1px;         /* Min snap distance */
  --silk-aN: 10px;        /* Edge padding */
  --silk-aO: var(--silk-aD, 100%);  /* Calculated travel size */
  --silk-aP: var(--silk-aE, 100%);  /* Calculated height */
  --silk-aQ: min(300px, var(--silk-aO));  /* Max overshoot */
  --silk-aR: 2px;         /* Snap margin */
  --silk-aS: calc(-1 * (var(--silk-aQ) - var(--silk-aR)));  /* Negative offset */
  --silk-aV: initial;     /* Content wrapper offset */
}
```

### Detent Variables (`a9` - Markers)
```css
/* Set inline on each marker element */
style="--silk-aA: 0px; --silk-aB: 425px; --silk-aC: 0"
```

### Calculated Variables
```css
[data-silk~="a9"] {
  --silk-aW: calc(100% + var(--silk-aF) - var(--silk-aB));
  --silk-aX: calc(var(--silk-aO) - var(--silk-aB) + var(--silk-aA));
}
```

## State Management Deep Dive

### State Machine Coordination

Silk uses four state machines that coordinate through message passing:

#### 1. Openness Machine (Primary)
```
closed.safe-to-unmount --OPEN→ opening --ANIMATION_COMPLETE→ open
open --CLOSE→ closing --ANIMATION_COMPLETE→ closed.pending --ANIMATION_COMPLETE→ closed.safe-to-unmount
```

#### 2. Staging Machine (Animation)
```
none --START_ANIMATION→ animating --ANIMATION_COMPLETE→ none
```

#### 3. Position Machine (Stacking)
```
back --BECOME_FRONT→ front
front --COVERED→ covered
covered --BECOME_FRONT→ front
```

#### 4. Active Machine (Interactivity)
```
inactive --ACTIVATE→ active
active --DEACTIVATE→ inactive
```

### Safe Unmounting Pattern

Critical pattern preventing RAF callback errors during cleanup:

```javascript
// State machine handles reopen during pending state
pending: {
  messages: {
    OPEN: [
      { guard: hasValidReopen, target: "flushing-to-preparing-open" },
      { target: "flushing-to-preparing-opening" }
    ],
    "": "safe-to-unmount"  // Automatic transition after RAF frame
  }
}
```

### Race Condition Handling

Silk handles the race condition of reopening during animation:
- **Problem**: User clicks trigger during closing animation
- **Solution**: State machine accepts `OPEN` from `pending` state
- **Result**: Seamless transition without cleanup conflicts

## Implementation Guide

### Basic Sheet Setup

```jsx
import { Sheet } from "@silk-hq/components";

// Import styles (choose one)
import "@silk-hq/components/unlayered-styles.css";
// OR
import "@silk-hq/components/layered-styles.css";

function MySheet() {
  return (
    <Sheet.Root license="commercial">
      <Sheet.Trigger>Open Sheet</Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.View>
          <Sheet.Backdrop />
          <Sheet.Content>
            <Sheet.BleedingBackground />
            <h2>Sheet Content</h2>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
}
```

### Controlled Sheet

```jsx
const [isOpen, setIsOpen] = useState(false);

<Sheet.Root
  presented={isOpen}
  onPresentedChange={setIsOpen}
  license="commercial"
>
  {/* Sheet components */}
</Sheet.Root>
```

### Sheet with Detents

```jsx
<Sheet.View detents={["25vh", "50vh", "75vh"]}>
  <Sheet.Backdrop />
  <Sheet.Content>
    {/* Content */}
  </Sheet.Content>
</Sheet.View>
```

### Stacked Sheets

```jsx
<SheetStack.Root>
  <SheetStack.Outlet stackingAnimation={{
    scale: [1, 0.95, 0.9]  // Progressive blur effect
  }} />

  {/* Sheet 1 */}
  <Sheet.Root>
    {/* Sheet components */}
  </Sheet.Root>

  {/* Sheet 2 */}
  <Sheet.Root>
    {/* Sheet components */}
  </Sheet.Root>
</SheetStack.Root>
```

### Travel Animation

```jsx
<Sheet.Outlet travelAnimation={{
  opacity: [0, 0.8],  // Fade in from 0 to 0.8
  transform: [
    "translateY(100%)",  // Start below viewport
    "translateY(0%)"      // End at normal position
  ]
}} />
```

### Theme Color Dimming

```jsx
<Sheet.Backdrop
  themeColorDimming="auto"
  travelAnimation={{
    opacity: ({ progress }) => Math.min(progress * 0.33, 0.33)
  }}
/>
```

## Key Implementation Insights

### 1. Conditional Rendering Required
Sheet.View must only be in DOM when presented or animating to prevent layout issues.

### 2. State Machine Critical
All sheet behavior flows through the four coordinated state machines.

### 3. Scroll Snap is Core
Scroll-snap-type on the scroll container drives all gesture interactions.

### 4. Sticky Positioning with Initial Scroll
Content wrapper uses `position: sticky` but requires initial scroll positioning to activate.

### 5. Transform Animation for Movement
Visual sheet movement uses `transform: translateY()` on content-wrapper during animation.

### 6. Scroll Position Persistence
After opening, scroll position stays at front-spacer height (not 0).

### 7. Backdrop Opacity Formula
`opacity = Math.min(0.33 * progress, 0.33)` provides natural dimming.

### 8. Intersection Observer for Dismissal
Observer detects when content leaves viewport to finalize dismissal.

### 9. Accessibility Built-in
ARIA attributes, focus management, and screen reader support are automatic.

### 10. Platform-Specific Handling
Silk automatically optimizes for iOS, Android, and desktop differences.

### Content Wrapper (`a10`)

**Purpose**: Wraps the actual sheet content and manages positioning
**CSS Properties**:
- `position: sticky`
- `z-index: 1`
- `display: flex` with alignment based on placement
- Contains the visible sheet content
- **Height**: Set to travel size (`var(--silk-aO)`) for bottom sheets
- **Positioning**:
  - With scroll-snap (`aJp`): `top: var(--silk-aS)` (negative overshoot offset, e.g., -298px)
  - Without scroll-snap: `bottom: var(--silk-aV)` (positive bottom offset, e.g., 437px)

**Placement Classes**:
- `aFf`: Align top
- `aFg`: Align bottom (end)
- `aFh`: Align left
- `aFi`: Align right
- `aFr`: Center

**State Classes**:
- `aIp`: Interaction enabled
- `aDl`: Active/draggable state
- `aDag`: Inactive/locked state

### Sheet Content (`a11`)

**Purpose**: The actual visible sheet content container
**CSS Properties**:
- Default: `background-color: #fff`
- Width/height from CSS variables: `--silk-default-width`, `--silk-default-height`
- `position: relative`
- `box-sizing: border-box`

**Modifiers**:
- `0af`: No background color (when using bleeding background)

### Bleeding Background (`a12`)

**Purpose**: Extended background that bleeds beyond content edges
**CSS Properties**:
- `position: absolute`
- `z-index: -1`
- Extended dimensions beyond parent
- `border-radius: inherit`
- `background-color: #fff`

**Variants**:
- `aKp`: Standard bleeding
- `aKo`: Reduced bleeding

### Handle (`a16`)

**Purpose**: Interactive handle element for drag gestures
**CSS Properties**:
- `position: relative`
- Contains ::before pseudo-element for larger hit area (48px min)

### Styled Handle (`a17`)

**Purpose**: Visual handle indicator
**CSS Properties**:
- `width: 48px`
- `height: 5.5px`
- `appearance: none`
- `background-color: #cbd5e1`

### Edge Marker (`a15`)

**Purpose**: Prevents iOS swipe-back gesture at sheet edges
**CSS Properties**:
- `position: absolute`
- `width: 30px`
- `left: -2px`
- Full height
- `user-select: none; pointer-events: auto`

### Secondary Scroll Container (`a5`)

**Purpose**: Additional scroll container for specific behaviors
**CSS Properties**:
- `position: absolute`
- `z-index: -1` (default) or `z-index: 1` when `aNp` is set
- Covers entire parent area

## Performance Characteristics

### Memory Management
- **Safe Unmounting**: Prevents memory leaks through state machine coordination
- **RAF Callback Cleanup**: Ensures animation callbacks don't access null references
- **Component Registry**: Global registry tracks all active instances

### Animation Performance
- **Web Animations API**: Hardware-accelerated animations
- **RequestAnimationFrame**: 60fps animation loops
- **Cubic Bezier Optimization**: Pre-calculated lookup tables for performance
- **Spring Physics**: Configurable physics parameters for natural motion

### Gesture Performance
- **Touch Event Optimization**: Platform-specific gesture recognition
- **Velocity Tracking**: Efficient velocity calculation for inertia
- **Intersection Observer**: High-performance visibility detection
- **Scroll Snap**: CSS-based snap points for smooth interactions

### Bundle Size
- **Tree Shaking**: Modular exports allow importing only needed components
- **CSS Optimization**: Data-attribute selectors minimize CSS size
- **React Integration**: Preserves React's optimization capabilities

## Browser Compatibility

### Modern Browser Requirements
- **Web Animations API**: For physics-based animations
- **Intersection Observer**: For dismissal detection
- **CSS Scroll Snap**: For gesture-driven interactions
- **CSS Custom Properties**: For dynamic styling
- **ES2018+ Features**: Async/await, object spread, etc.

### Platform-Specific Handling
- **iOS Safari 12+**: Full feature support with WebKit optimizations
- **Chrome 90+**: Full support with Chromium scroll handling
- **Firefox 88+**: Full support with Gecko-specific adjustments
- **Edge 90+**: Full support via Chromium engine

### Progressive Enhancement
Silk gracefully degrades on older browsers:
- **No Scroll Snap**: Falls back to transform-based animations
- **No Web Animations**: Uses CSS transitions
- **No Intersection Observer**: Uses scroll event listeners

## Migration & Compatibility

### From Silk v0.x
Key changes in the component API:
- **License Required**: Must specify `license="commercial"` or `license="non-commercial"`
- **Component Structure**: Simplified compound component architecture
- **Animation API**: Declarative travel/stacking animations
- **State Management**: Controlled vs uncontrolled presentation

### Integration with Frameworks
- **Next.js**: Works with App Router and Pages Router
- **Vite**: Full support with modern build tools
- **Create React App**: Compatible with React 16.8+
- **Remix/Expo**: Works with modern React frameworks

## References & Resources

### Official Documentation
- **Silk Components**: `silk-documentation/Silk – Components/`
- **Getting Started**: `silk-documentation/Silk – Getting started 2b66f1e2479181ac8431faad0aa59f2c.md`
- **Sheet API**: `silk-documentation/Silk – Components/Silk – Sheet 2b66f1e2479181c7acd1e1c1dd040c50.md`
- **SheetStack API**: `silk-documentation/Silk – Components/Silk – SheetStack 2b66f1e2479181bab900c647caa3a035.md`

### Source Code Analysis
- **Deobfuscated Source**: `silk/source.js` - Complete implementation
- **CSS Implementation**: `silk/source.css` - Full styling system
- **DOM Examples**: `silk/presented-dom.html`, `silk/not-presented-dom.html`

### Key Implementation Files
- `silk/source.js`: Core library implementation (11,716 lines)
- `silk/source.css`: Complete CSS system with data-silk selectors
- `silk/SILK_ARCHITECTURE.MD`: This architectural documentation

### Web Standards Used
- **CSS Scroll Snap**: https://drafts.csswg.org/css-scroll-snap/
- **Web Animations API**: https://drafts.csswg.org/web-animations/
- **Intersection Observer**: https://w3c.github.io/IntersectionObserver/
- **CSS Containment**: https://drafts.csswg.org/css-containment/

---

**Note**: This architecture document is based on Silk library version 0.9.x. The library uses commercial licensing for production use. See https://silkhq.com/ for licensing information.

## DOM Structure

```
[data-silk="a1"] (Root View - Fixed Container)
├── [data-silk="b0 ... a4"] (Primary Scroll Trap)
│   └── [data-silk="b1"] (Scroll Stabilizer)
│       ├── [data-silk="a2"] (Backdrop)
│       └── [data-silk="a6"] (Scroll Snap Container)
│           ├── [data-silk="a7"] (Front Spacer)
│           ├── [data-silk="a10"] (Content Wrapper - Sticky)
│           │   ├── [data-silk="a11"] (Sheet Content)
│           │   │   ├── [data-silk="a12"] (Bleeding Background)
│           │   │   ├── [data-silk="a16 a17"] (Handle)
│           │   │   └── [Content Elements]
│           │   └── [data-silk="a15"] (Edge Marker)
│           └── [data-silk="a8"] (Back Spacer)
│               └── [data-silk="a9"] × N (Detent Markers)
└── [data-silk="b0 ... a5"] (Secondary Scroll Container)
```

## Animation & Interaction

### Travel Animation

The sheet animates between detents using:
1. **Initial Scroll Position**: When opening a bottom sheet, the scroll container is initially positioned at the front-spacer height (contentSize + snapAcceleratorSize)
2. **Transform Animation**: During the opening animation, `transform: translateY()` is applied to the content-wrapper to visually move the sheet
3. **Final Scroll Position**: After animation completes, the transform is cleared and the scroll position remains at the front-spacer height
4. **Sticky Positioning**: The content-wrapper uses `position: sticky` with a negative `top` value (or positive `bottom` value for bottom sheets) to position the content above/below the viewport edge
5. **Spring Physics**: Applied via JavaScript for smooth motion using the Web Animations API

### Critical Implementation Details for Bottom Sheets

1. **Front Spacer Calculation**: `height = contentSize + snapAcceleratorSize` (where snapAcceleratorSize varies based on content/view relationship)
2. **Initial Scroll**: On sheet open, scroll container must be set to `scrollTop = frontSpacerHeight` to activate sticky positioning
3. **Content Wrapper Height**: Must be set to `height: var(--travel-size)` (the full viewport height minus any offsets)
4. **Content Wrapper Positioning**:
   - For sheets WITH scroll-snap: `top: var(--overshoot-offset)` (a negative value like -298px)
   - For sheets WITHOUT scroll-snap: `bottom: var(--bottom-offset)` (a positive value)
5. **Scroll Position at First Detent**: The scroll position STAYS at the front-spacer height when the sheet is open at the first detent (not 0)
6. **Animation Order**:
   - Set initial `scrollTop` to front-spacer height
   - Apply `transform: translateY()` animation to content-wrapper
   - On animation complete, clear the transform
   - Leave `scrollTop` at its final position (front-spacer height for first detent)

### Current Offset Logic (Critical for Animations)

The `currentOffset` (variable `B` in Silk source) determines the visual start position for animations.

- **Closed State**: `currentOffset = 0` for ALL tracks. This implies the content is fully off-screen (pushed away by the front-spacer).
- **Open State**:
  - Bottom Sheet: `currentOffset = -contentSize` (implies content is visible at bottom)
  - Top Sheet: `currentOffset = contentSize`
  - Left Sheet: `currentOffset = contentSize`
  - Right Sheet: `currentOffset = -contentSize`

**Why "0" for Closed?**
When closed, the scroll container is positioned (via front-spacer) such that the content-wrapper is naturally off-screen.
- For a bottom sheet, the natural position is pushed down by `contentSize`.
- To animate "Opening", we start with `transform: translateY(contentSize)` (pushed down) and animate to `translateY(0)` (natural position).
- `currentOffset = 0` results in `startTransform = 0 - (-contentSize) = contentSize`.

### Scroll Position Calculation for Detents

The target scroll position for each detent is calculated in source.js lines 6801-6825:

```javascript
// For sheets without opposite tracks (most common case):
positionToScrollTo = accumulatedOffset + snapAccelerator
```

Where:
- `accumulatedOffset`: The marker's accumulated offset (includes current marker's size)
- `snapAccelerator`: The snap accelerator size

**Example for 66vh detent on 704px viewport**:
- accumulatedOffset = 425px (66vh computed)
- snapAccelerator = 245px
- positionToScrollTo = 425 + 245 = 670px

**Important**: The `accumulatedOffset` in dimensions includes the current marker's size (not just previous markers). This is set in source.js lines 8831-8850 where `n += markerSize` happens BEFORE assigning to `accumulatedOffsets`.

### Virtual Full-Height Marker

Silk handles the "full height" detent by overwriting the last marker's dimensions (source.js lines 8863-8882):

```javascript
// The last marker gets its accumulatedOffsets set to contentSize
detentMarkers[lastIndex].accumulatedOffsets = contentSize
```

This means with a single 66vh detent marker:
- Marker 0 (66vh): accumulatedOffsets = 425px (actual marker size)
- Marker 1 (virtual): accumulatedOffsets = 698px (contentSize)

When calculating `progressValueAtDetents`, Silk iterates over all markers EXCEPT the last (using `slice(0, -1)`) then manually adds the full-height entry with progress = 1.0.

### Scroll-Based Progress Calculation

When the sheet is open and the user scrolls between detents, Silk calculates progress for backdrop opacity and travel animations using this formula (source.js lines 9404-9439):

```javascript
rawProgress = (scrollTop - snapAccelerator) / contentSize
clampedProgress = Math.max(firstDetentProgress, Math.min(1, rawProgress))
```

**Key Values**:
- `scrollTop`: Current scroll position
- `snapAccelerator`: The snap accelerator offset (~245px for typical bottom sheet)
- `contentSize`: The content travel axis size (~698px)
- `firstDetentProgress`: Progress value at first detent (e.g., 0.6089 for 66vh detent)

**Clamping Logic**: Progress is clamped to `[firstDetentProgress, 1.0]` to prevent the backdrop from becoming less opaque than its value at the first detent, even if scroll position briefly dips during touch interactions.

**Backdrop Opacity Formula**:
```javascript
opacity = Math.min(0.33 * progress, 0.33)
```

At first detent (progress ~0.61): opacity ≈ 0.20
At full height (progress = 1.0): opacity = 0.33

### Desktop Scroll-to-Dismiss

Desktop scrolling (and touch momentum scrolling) handles dismissal via the following sequence:

1. **Scroll Action**: User scrolls "down" (wheel up) or flings the sheet.
2. **Native Scroll**: The `scroll-container` (`a6`) scrolls towards 0 (viewing the Front Spacer).
3. **Visual Movement**: As `scrollTop` decreases, the sheet content moves down visually.
4. **Off-Screen Detection**: An `IntersectionObserver` monitors the **Sheet Content** (`a11`) relative to the **Root View** (`a1`).
5. **Trigger**: When the content moves completely off-screen (`isIntersecting: false`):
   - The Observer callback fires.
   - It immediately sets `pointer-events: none` and `opacity: 0` on the Root View to hide it.
   - If a `wheel` event was detected during this process, it blocks further wheel events for 100ms (to consume momentum).
   - It triggers the `SWIPED_OUT` message to the state machine.
6. **State Transition**: The state machine transitions to the closing/closed sequence, unmounting the component.

**Note**: This relies on the scroll snap point at 0 (Front Spacer) effectively acting as the "closed" position.

### Auto-Stepping (swipeOvershoot) - Stuck Detection

When `swipeOvershoot` is enabled (default), Silk implements an auto-stepping mechanism that detects when the user swipes fast enough to reach the next detent, then automatically steps to that detent even if scroll-snap would normally pull back.

#### State Machines for Stuck Detection

Silk uses two parallel state machines to track when scroll reaches detent boundaries:

```javascript
// State machines (source.js lines 7684-7716)
{
  name: "frontStuck",  // At the last detent (full height)
  initial: "false",
  states: {
    false: { messages: { STUCK_START: "true" } },
    true: { messages: { STUCK_END: "false" } }
  }
},
{
  name: "backStuck",   // At the first detent
  initial: "false",
  states: {
    false: { messages: { STUCK_START: "true" } },
    true: { messages: { STUCK_END: "false" } }
  }
}
```

#### Segment Callback Triggers STUCK_START (source.js lines 8854-8885)

The `setSegment` callback (called during scroll/travel) updates stuck states:

```javascript
// When segment becomes [n, n] at a boundary:
const [start, end] = segment;
const lastDetent = detentMarkers.length;

if (start === lastDetent && end === lastDetent) {
  // At last detent (full height)
  send({ machine: "frontStuck", type: "STUCK_START" });
} else if (start === 1 && end === 1 && swipeOutDisabled) {
  // At first detent (with swipeOutDisabled)
  send({ machine: "backStuck", type: "STUCK_START" });
} else {
  // Not at a boundary - clear stuck states
  if (frontStuck) send({ machine: "frontStuck", type: "STUCK_END" });
  if (backStuck) send({ machine: "backStuck", type: "STUCK_END" });
}
```

#### Touch Tracking State Machine

Silk also tracks touch state via a separate state machine:

```javascript
{
  name: "scrollContainerTouch",
  initial: "ended",
  states: {
    ended: { messages: { TOUCH_START: "ongoing" } },
    ongoing: { messages: { TOUCH_END: "ended" } }
  }
}
```

Touch handlers (source.js lines 9683-9703) send these messages:
- `touchstart` → `TOUCH_START`
- `touchend` → `TOUCH_END`

#### Auto-Step Triggering (source.js lines 10460-10517)

When `STUCK_START` fires AND touch has ended, Silk auto-steps:

```javascript
// On frontStuck:STUCK_START transition
onTransition("frontStuck:STUCK_START", () => {
  if (matches("openness:open") && matches("scrollContainerTouch:ended")) {
    nO("front");  // Auto-step to full height
  }
});

// On scrollContainerTouch:ended
onEnter("scrollContainerTouch:ended", () => {
  setTimeout(() => {
    requestAnimationFrame(() => {
      if (matches("openness:open")) {
        if (matches("backStuck:true")) nO("back");
        else if (matches("frontStuck:true")) nO("front");
      }
    });
  }, 80);  // 80ms delay to let scroll settle
});
```

#### The nO Function (source.js lines 8939-8962)

`nO` performs the actual auto-step:

```javascript
function nO(direction) {
  // 1. Travel to destination detent WITHOUT animation (behavior: "instant")
  travelToDetent({
    destinationDetent: direction === "front" ? lastDetent : 1,
    runTravelCallbacksAndAnimations: false  // defaults to behavior: "instant"
  });

  // 2. Safari/WebKit only: Temporarily disable scroll to prevent snap interference
  // eQ() returns true only for WebKit browsers
  if (isWebKit()) {
    scrollContainer.style.setProperty("overflow", "hidden");
    setTimeout(() => {
      scrollContainer.style.removeProperty("overflow");
    }, CSS.supports("overscroll-behavior", "none") ? 1 : 10);
  }
}
```

**Note**: The `overflow: hidden` trick is **Safari/WebKit-specific**. On Chrome/Firefox, Silk just does the instant scroll and relies on scroll-snap to keep us at the valid snap point.

#### Why This Works

1. **During fast swipe**: Scroll position momentarily reaches the next detent boundary
2. **Segment tracking**: `setSegment` callback fires with segment `[n, n]` at the boundary
3. **STUCK_START**: State machine records that we reached this position
4. **Touch ends**: `scrollContainerTouch:ended` triggers the 80ms + RAF delayed check
5. **Auto-step**: If still stuck at a detent, `nO()` snaps to that position
6. **Override scroll-snap**: Setting `overflow: hidden` briefly prevents scroll-snap from pulling back

This mechanism ensures that fast swipes expand/collapse the sheet to the next detent, even though native scroll-snap would normally snap back to the starting position.

### Why This Works

The combination of:
- `position: sticky` on content-wrapper
- Negative `top` offset (or positive `bottom` for snap-type sheets)
- `scrollTop` positioned at front-spacer height
- `height` equal to travel size

...creates a "sticky zone" where the content-wrapper is offset from its natural flow position. When scrolled past the front-spacer, the sticky positioning kicks in and keeps the content at the specified negative offset, making it appear above (or below for bottom sheets) the viewport edge.

### Gesture Handling

- **Touch/mouse drag**: On content wrapper and handle
- **Scroll wheel**: On scroll container (triggers native scroll, eventually dismissing via Observer)
- **Keyboard**: Navigation when focused
- **Accessibility**: Full screen reader support

## Mapping to Ember Implementation

| Silk Class | Ember data-d-sheet | Purpose |
|------------|-------------------|---------|
| `a1` | `view` | Root container |
| `a2` | `backdrop` | Overlay backdrop |
| `b0` (primary) | `primary-scroll-trap` | Main scroll container |
| `b0` (secondary) | N/A | Secondary scroll (optional) |
| `b1` | `scroll-trap-stabilizer` | Sticky scroll wrapper |
| `a4` | N/A | Scroll container type |
| `a5` | N/A | Secondary scroll type |
| `a6` | `scroll-container` | Snap container |
| `a7` | `front-spacer` | Space before content |
| `a8` | `back-spacer` | Space after content |
| `a9` | `detent-marker` | Snap points |
| `a10` | `content-wrapper` | Sticky content holder |
| `a11` | `content` | Actual content |
| `a12` | `bleeding-background` | Extended background |
| `a15` | N/A | Edge swipe blocker |
| `a16` | N/A | Handle wrapper |
| `a17` | N/A | Handle visual |

## Key Insights for Implementation

1. **Conditional Rendering Required**: The root view (`a1`) should only be in DOM when sheet is presented or animating
2. **State Classes Critical**: `aAa` vs `aAc` control visibility; must toggle on state change
3. **Scroll Snap is Core**: The entire animation system relies on CSS scroll-snap-type on the scroll container (`a6`), NOT on the content-wrapper
4. **Detents via Markers**: Each detent position needs a marker element with scroll-snap-align
5. **Sticky Positioning with Initial Scroll**: Content wrapper uses sticky positioning, but REQUIRES the scroll container to be initially scrolled to the front-spacer height to activate
6. **Transform Animation**: Visual sheet movement uses `transform: translateY()` on content-wrapper during animation, then clears it
7. **Scroll Position Persistence**: After opening to first detent, scroll position STAYS at front-spacer height (not 0)
8. **Backdrop Animation**: Backdrop opacity animates based on travel progress using `opacity = Math.min(0.33 * progress, 0.33)`
9. **Intersection Observer for Dismiss**: Use an Observer to detect when content leaves the viewport to finalize dismissal and cleanup state
10. **Accessibility**: Must manage aria-hidden, tabindex, and screen-reader classes
11. **Track Variant Consistency (Critical!)**: The scroll-container positioning (e.g., `bottom: -1x` vs `top: -0.5x`) MUST match the detent marker CSS formula. Mixing `aGg` scroll-container with `aGk` marker formula causes scroll-snap to land at wrong positions, creating a "deadzone" in progress calculations.
12. **Scroll-Margin for Edge-Aligned Tracks**: Edge-aligned variants (aGg, aGf, aGh, aGi) use `scroll-margin` to offset the snap position. Centered variants (aGj, aGk) do NOT use scroll-margin.
13. **Marker Accumulated Offsets**: The `--silk-aB` variable must be the computed pixel value of the accumulated offset, not the raw CSS value (e.g., "425px" not "66vh"). This ensures scroll position calculations align with where scroll-snap actually lands.
14. **Auto-Stepping via Stuck Detection**: When `swipeOvershoot` is enabled, Silk tracks when scroll reaches detent boundaries via `setSegment` callback. When segment becomes `[n, n]` at a boundary, it sets `frontStuck` or `backStuck` flags. When touch ends AND stuck is true, it auto-steps to that detent using `nO()` which sets scroll position and briefly disables overflow to prevent scroll-snap interference.
15. **Touch State Tracking**: Silk tracks touch state separately (`scrollContainerTouch: ended/ongoing`) and uses an 80ms delay + RAF before checking stuck states on touch end. This lets scroll settle before deciding whether to auto-step.

## References

- `silk/source.css` - Complete CSS implementation
- `silk/source.js` - JavaScript controller logic
- `silk/presented-dom.html` - DOM structure when sheet is visible
- `silk/not-presented-dom.html` - DOM structure when sheet is hidden
