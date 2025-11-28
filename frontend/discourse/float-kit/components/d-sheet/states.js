// Like Silk: Use nested state machines to manage the lifecycle properly.
// The "closed" state has sub-states to distinguish between:
// - "pending": Closing animation is running, elements still exist
// - "safe-to-unmount": Animation complete, safe to unmount DOM elements
//
// Like Silk: Use "preparing-opening" intermediate state to set up initial
// scroll position synchronously (before browser paint), then transition to
// "opening" to start the animation.
//
// This prevents RAF callbacks from accessing null references during cleanup.
export const SHEET_STATES = {
  initial: "closed.safe-to-unmount",
  states: {
    closed: {
      initial: "safe-to-unmount",
      on: {
        OPEN: "preparing-opening",
      },
      states: {
        // Safe to unmount the View component - no animations running
        "safe-to-unmount": {},
        // Animation is in progress, elements must remain mounted
        pending: {
          on: {
            // Like Silk: Allow reopening from pending state
            // This handles the race condition elegantly through the state machine
            OPEN: "preparing-opening",
            // Automatic transition to safe-to-unmount (Silk uses "" for this)
            ANIMATION_COMPLETE: "closed.safe-to-unmount",
          },
        },
      },
    },
    // Like Silk: Intermediate state to set up initial scroll position
    // before browser paint. View is rendered but content is offscreen.
    "preparing-opening": {
      on: {
        PREPARED: "opening",
      },
    },
    opening: {
      on: {
        ANIMATION_COMPLETE: "open",
      },
    },
    open: {
      on: {
        CLOSE: "closing",
        STEP: "stepping",
        SWIPE_OUT: "closing",
      },
    },
    stepping: {
      on: {
        ANIMATION_COMPLETE: "open",
      },
    },
    closing: {
      on: {
        // Like Silk: Transition to closed.pending first (animation still running)
        // Then to closed.safe-to-unmount when animation completes
        ANIMATION_COMPLETE: "closed.pending",
      },
    },
  },
};
