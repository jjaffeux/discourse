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

// Like Silk: Staging machine tracks animation state separately from lifecycle
// This allows the sheet to stay in "open" state while animations run
export const STAGING_STATES = {
  initial: "none",
  states: {
    none: {
      on: {
        OPEN: "opening", // Will be overridden by guards in controller
        ACTUALLY_STEP: "stepping",
        ACTUALLY_CLOSE: "closing",
      },
    },
    opening: {
      on: {
        NEXT: "open", // When opening animation completes, transition to open state
      },
    },
    open: {
      on: {
        NEXT: "none", // When sheet closes, transition back to none
        OPEN: "open", // Allow transitioning to open from none (for reopening)
      },
    },
    stepping: {
      on: {
        NEXT: "none",
      },
    },
    closing: {
      on: {
        NEXT: "none",
      },
    },
  },
};

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
        STEP: "open", // Stay in open, staging machine handles animation
        SWIPE_OUT: "closing",
      },
      // Like Silk: Nested machines for tracking scroll, swipe, move, touch
      machines: [
        {
          name: "scroll",
          initial: "ended",
          states: {
            ended: {
              on: {
                SCROLL_START: "ongoing",
              },
            },
            ongoing: {
              on: {
                SCROLL_END: "ended",
              },
            },
          },
        },
        {
          name: "move",
          initial: "ended",
          states: {
            ended: {
              on: {
                MOVE_START: "ongoing",
              },
            },
            ongoing: {
              on: {
                MOVE_END: "ended",
              },
            },
          },
        },
        {
          name: "swipe",
          initial: "unstarted",
          states: {
            unstarted: {
              on: {
                SWIPE_START: "ongoing",
              },
            },
            ongoing: {
              on: {
                SWIPE_END: "ended",
              },
            },
            ended: {
              on: {
                SWIPE_START: "ongoing",
                SWIPE_RESET: "unstarted",
              },
            },
          },
        },
        {
          name: "scrollContainerTouch",
          initial: "ended",
          states: {
            ended: {
              on: {
                TOUCH_START: "ongoing",
              },
            },
            ongoing: {
              on: {
                TOUCH_END: "ended",
              },
            },
          },
        },
      ],
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
